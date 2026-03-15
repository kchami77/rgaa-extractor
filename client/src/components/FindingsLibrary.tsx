import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2, ChevronDown, ChevronRight, FileText, Globe,
  LayoutList, Layers, FolderOpen, Search, X, Copy, Check,
  AlertCircle, AlertTriangle, Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { MultiSelect } from "@/components/ui/multi-select";
import { SummaryCard } from "@/components/findings/SummaryCard";
import { ViewModeButton } from "@/components/findings/ViewModeButton";
import { ImpactBadges } from "@/components/findings/ImpactBadges";
import { getThematicName } from "@/components/findings/getThematicName";
import { toast } from "sonner";

type ViewMode = "by-criterion" | "by-report" | "flat" | "tree";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function extractSiteName(fileName: string): string {
  return fileName
    .replace(/^\d+-/, "")
    .replace(/\.docx$/i, "")
    .replace(/^_?publipostage_/i, "")
    .replace(/_Rapport[-_]RGAA.*$/i, "")
    .replace(/_STRATIS$/i, "")
    .replace(/_/g, " ")
    .trim() || fileName;
}

function getShortLocation(location: string | null | undefined): string | null {
  if (!location) return null;
  return location.split(/\s*«/)[0].trim() || null;
}

// ─── Impact config ────────────────────────────────────────────────────────────
function getImpactConfig(impact: string) {
  return {
    Bloquant: {
      dot: "bg-red-500",
      badge: "bg-red-100 text-red-800 border-red-200",
      icon: <AlertCircle className="w-3 h-3" />,
      label: "Bloquant",
    },
    Majeur: {
      dot: "bg-orange-400",
      badge: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <AlertTriangle className="w-3 h-3" />,
      label: "Majeur",
    },
    Mineur: {
      dot: "bg-yellow-400",
      badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <Info className="w-3 h-3" />,
      label: "Mineur",
    },
  }[impact as "Bloquant" | "Majeur" | "Mineur"] ?? {
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <Info className="w-3 h-3" />,
    label: impact,
  };
}

// ─── Copy icon button ─────────────────────────────────────────────────────────
function CopyIconButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Constat copié !");
      setTimeout(() => setCopied(false), 2500);
    });
  };
  return (
    <button
      onClick={handleCopy}
      title="Copier le constat"
      className={`inline-flex items-center p-2 rounded-lg text-sm font-semibold transition-all shadow-sm border-2
        ${copied
          ? "bg-green-50 text-green-700 border-green-300"
          : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-md active:scale-95"
        }`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

// ─── Finding row: always shows full detail inline ─────────────────────────────
function FindingDetailRow({ finding }: { finding: any }) {
  const cfg = getImpactConfig(finding.impact);
  const siteName = finding.reportFileName ? extractSiteName(finding.reportFileName) : "";
  const shortLocation = getShortLocation(finding.location);

  const copyText = [finding.finding, finding.solution ?? ""]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="px-5 py-3 border-b last:border-b-0 bg-white hover:bg-slate-50/50 transition-colors">
      {/* Header: "1.1 – Toutes les pages – Majeur" */}
      <p className="text-sm font-semibold text-gray-700 mb-2">
        <span className="font-mono text-gray-500 mr-1">{finding.criterionReference}</span>
        {shortLocation && <span className="font-normal text-gray-600"> – {shortLocation}</span>}
        <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${cfg.badge}`}>
          {cfg.icon}{cfg.label}
        </span>
      </p>

      {/* Bordered text box: finding + solution */}
      <div className="border border-violet-200 rounded-lg px-4 py-2.5 bg-violet-50/30 mb-2.5">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {finding.finding}
        </p>
        {finding.solution && (
          <p className="text-sm text-gray-800 leading-relaxed mt-1 pt-1 border-t border-violet-200 whitespace-pre-line">
            {finding.solution}
          </p>
        )}
      </div>

      {/* Footer: site name + copy icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{siteName || "—"}</span>
        <CopyIconButton text={copyText} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FindingsLibrary() {
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [selectedPageNames, setSelectedPageNames] = useState<string[]>([]);
  const [selectedThematic, setSelectedThematic] = useState<string>("all");
  const [selectedImpact, setSelectedImpact] = useState<string>("all");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedThematics, setExpandedThematics] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isSmartSearch, setIsSmartSearch] = useState(false);

  const { data: findings, isLoading } = trpc.audit.getEnrichedFindings.useQuery({
    reportIds: selectedReportIds.map(id => parseInt(id)),
    pageNames: selectedPageNames.length > 0 ? selectedPageNames : undefined,
    thematicNumber: selectedThematic !== "all" ? parseInt(selectedThematic) : undefined,
    impact: selectedImpact !== "all" ? (selectedImpact as any) : undefined,
    q: isSmartSearch && searchQuery.trim().length > 2 ? searchQuery : undefined,
  }, { keepPreviousData: true });

  const { data: reports } = trpc.audit.getUserReports.useQuery();

  const stripAccents = useCallback((s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), []);

  const filteredFindings = useMemo(() => {
    if (!findings) return [];
    if (isSmartSearch && searchQuery.trim().length > 2) return findings;
    if (!searchQuery.trim()) return findings;
    const queryWords = stripAccents(searchQuery.trim()).split(/\s+/).filter(Boolean);
    return findings.filter(f => {
      const haystack = stripAccents(
        [f.finding, f.solution, f.location, f.criterionReference, f.criterionLabel, f.contentType, f.userProblem, f.subThematic]
          .filter(Boolean).join(" ")
      );
      return queryWords.every(word => haystack.includes(word));
    });
  }, [findings, searchQuery, stripAccents, isSmartSearch]);

  const availablePages = useMemo(() => {
    const pagesSet = new Set<string>();
    if (reports) {
      reports.forEach(r => {
        try {
          if (r.auditedPages) {
            const pages = JSON.parse(r.auditedPages);
            pages.forEach((p: any) => { if (p.name) pagesSet.add(p.name); });
          }
        } catch (e) {
          if (process.env.NODE_ENV === "development") console.warn("Failed to parse auditedPages", e);
        }
      });
    }
    return Array.from(pagesSet).sort();
  }, [reports]);

  const impactStats = useMemo(() => {
    return {
      total: filteredFindings.length,
      bloquant: filteredFindings.filter(f => f.impact === "Bloquant").length,
      majeur: filteredFindings.filter(f => f.impact === "Majeur").length,
      mineur: filteredFindings.filter(f => f.impact === "Mineur").length,
    };
  }, [filteredFindings]);

  const uniqueThematics = useMemo(() => {
    if (!findings) return [];
    const map = new Map<number, string>();
    findings.forEach(f => { if (f.thematicNumber != null) map.set(f.thematicNumber, getThematicName(f.thematicNumber)); });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [findings]);

  const treeData = useMemo(() => {
    if (!filteredFindings.length) return [];
    const thematicMap = new Map<number, { name: string; criteria: Map<string, { label: string; findings: typeof filteredFindings }> }>();
    filteredFindings.forEach(f => {
      const tNum = f.thematicNumber ?? 0;
      if (!thematicMap.has(tNum)) thematicMap.set(tNum, { name: getThematicName(tNum), criteria: new Map() });
      const thematic = thematicMap.get(tNum)!;
      const cRef = f.criterionReference || "?";
      if (!thematic.criteria.has(cRef)) thematic.criteria.set(cRef, { label: f.criterionLabel || "", findings: [] });
      thematic.criteria.get(cRef)!.findings.push(f);
    });
    return Array.from(thematicMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([tNum, tData]) => ({
        tNum,
        name: tData.name,
        criteria: Array.from(tData.criteria.entries())
          .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
          .map(([ref, cData]) => ({ ref, ...cData })),
      }));
  }, [filteredFindings]);

  const groupedByCriterion = useMemo(() => {
    if (!filteredFindings.length) return [];
    const map = new Map<string, typeof filteredFindings>();
    filteredFindings.forEach(f => {
      const key = f.criterionReference || "?";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    });
    return Array.from(map.entries()).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  }, [filteredFindings]);

  const groupedByReport = useMemo(() => {
    if (!filteredFindings.length) return [];
    const map = new Map<number, { name: string; siteUrl: string | null; findings: typeof filteredFindings }>();
    filteredFindings.forEach(f => {
      const reportId = f.reportId;
      if (!map.has(reportId)) {
        const reportData = (reports || []).find(r => r.id === reportId);
        map.set(reportId, {
          name: f.reportFileName || reportData?.fileName || `Rapport #${reportId}`,
          siteUrl: f.reportSiteUrl || reportData?.siteUrl || null,
          findings: [],
        });
      }
      map.get(reportId)!.findings.push(f);
    });
    return Array.from(map.entries());
  }, [filteredFindings, reports]);

  const toggleGroup = (key: string) => setExpandedGroups(prev => {
    const n = new Set(prev);
    n.has(key) ? n.delete(key) : n.add(key);
    return n;
  });
  const toggleThematic = (tNum: number) => setExpandedThematics(prev => {
    const n = new Set(prev);
    n.has(tNum) ? n.delete(tNum) : n.add(tNum);
    return n;
  });

  const expandAll = () => {
    if (viewMode === "tree") {
      setExpandedThematics(new Set(treeData.map(t => t.tNum)));
      setExpandedGroups(new Set(treeData.flatMap(t => t.criteria.map(c => `${t.tNum}-${c.ref}`))));
    } else if (viewMode === "by-criterion") {
      setExpandedGroups(new Set(groupedByCriterion.map(g => g[0])));
    } else if (viewMode === "by-report") {
      setExpandedGroups(new Set(groupedByReport.map(g => g[0].toString())));
    }
  };
  const collapseAll = () => { setExpandedGroups(new Set()); setExpandedThematics(new Set()); };

  const hasExpandable = viewMode !== "flat";

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Total constats" value={impactStats.total} className="bg-slate-50 border-slate-200" />
        <SummaryCard label="Bloquant" value={impactStats.bloquant} className="bg-red-50 border-red-200 text-red-700" />
        <SummaryCard label="Majeur" value={impactStats.majeur} className="bg-orange-50 border-orange-200 text-orange-700" />
        <SummaryCard label="Mineur" value={impactStats.mineur} className="bg-yellow-50 border-yellow-200 text-yellow-700" />
      </div>

      {/* Filters + view mode */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Filtres</CardTitle>
              <CardDescription>Filtrez et regroupez les constats</CardDescription>
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <ViewModeButton active={viewMode === "tree"} onClick={() => setViewMode("tree")} icon={<Layers className="w-4 h-4" />} label="Arborescence" />
              <ViewModeButton active={viewMode === "by-criterion"} onClick={() => setViewMode("by-criterion")} icon={<Layers className="w-4 h-4" />} label="Par critère" />
              <ViewModeButton active={viewMode === "by-report"} onClick={() => setViewMode("by-report")} icon={<FolderOpen className="w-4 h-4" />} label="Par rapport" />
              <ViewModeButton active={viewMode === "flat"} onClick={() => setViewMode("flat")} icon={<LayoutList className="w-4 h-4" />} label="Liste" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par mots-clés..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${!isSmartSearch ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
                onClick={() => setIsSmartSearch(false)}
              >
                Recherche Classique
              </button>
              <button
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${isSmartSearch ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
                onClick={() => setIsSmartSearch(true)}
              >
                <Search className="w-3 h-3" /> Smart Search (IA)
              </button>
            </div>
            {searchQuery.trim() && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredFindings.length}</span> résultat{filteredFindings.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rapports</label>
              <MultiSelect
                options={reports?.filter(r => r.status === "completed").map(r => ({ label: extractSiteName(r.fileName), value: r.id.toString() })) || []}
                selected={selectedReportIds}
                onChange={setSelectedReportIds}
                placeholder="Tous les rapports"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pages</label>
              <Select value={selectedPageNames.length === 1 ? selectedPageNames[0] : "__all__"} onValueChange={val => setSelectedPageNames(val === "__all__" ? [] : [val])}>
                <SelectTrigger><SelectValue placeholder="Sans filtre" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Sans filtre</SelectItem>
                  {availablePages.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Thématique</label>
              <Select value={selectedThematic} onValueChange={setSelectedThematic}>
                <SelectTrigger><SelectValue placeholder="Toutes les thématiques" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les thématiques</SelectItem>
                  {uniqueThematics.map(([num, name]) => <SelectItem key={num} value={num.toString()}>{num}. {name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Impact</label>
              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger><SelectValue placeholder="Tous les niveaux" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="Bloquant">🔴 Bloquant</SelectItem>
                  <SelectItem value="Majeur">🟠 Majeur</SelectItem>
                  <SelectItem value="Mineur">🟡 Mineur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Findings display */}
      {filteredFindings.length > 0 ? (
        <>
          {/* Expand/collapse — hidden in flat mode */}
          {hasExpandable && (
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={expandAll}>Tout déplier</Button>
              <Button variant="ghost" size="sm" onClick={collapseAll}>Tout replier</Button>
            </div>
          )}

          {/* ── TREE VIEW ─────────────────────────────────────────────────── */}
          {viewMode === "tree" && (
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {treeData.map((thematic, tIdx) => {
                const tExpanded = expandedThematics.has(thematic.tNum);
                const tTotal = thematic.criteria.reduce((s, c) => s + c.findings.length, 0);
                return (
                  <div key={thematic.tNum} className={tIdx > 0 ? "border-t border-gray-200" : ""}>
                    <button
                      onClick={() => toggleThematic(thematic.tNum)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      {tExpanded ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
                      <span className="font-semibold text-gray-800 text-sm flex-1">
                        Critère {thematic.tNum} — {thematic.name}
                      </span>
                      <ImpactBadges items={thematic.criteria.flatMap(c => c.findings)} />
                      <Badge variant="secondary" className="ml-1">{tTotal}</Badge>
                    </button>

                    {tExpanded && thematic.criteria.map((criterion, cIdx) => {
                      const cKey = `${thematic.tNum}-${criterion.ref}`;
                      const cExpanded = expandedGroups.has(cKey);
                      return (
                        <div key={criterion.ref} className={cIdx > 0 ? "border-t border-gray-100" : ""}>
                          <button
                            onClick={() => toggleGroup(cKey)}
                            className="w-full flex items-center gap-3 pl-8 pr-4 py-2.5 hover:bg-slate-50 transition-colors text-left bg-white"
                          >
                            {cExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                            <span className="text-sm text-gray-700 flex-1 truncate">
                              <span className="font-mono font-semibold text-gray-500 mr-2">Critère {criterion.ref}</span>
                              <span className="text-gray-500">{criterion.label}</span>
                            </span>
                            <ImpactBadges items={criterion.findings} />
                            <Badge variant="outline" className="ml-1 text-xs">{criterion.findings.length}</Badge>
                          </button>

                          {cExpanded && (
                            <div className="border-t border-gray-100 bg-white">
                              {criterion.findings.map(f => (
                                <FindingDetailRow key={f.id} finding={f} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── BY CRITERION ──────────────────────────────────────────────── */}
          {viewMode === "by-criterion" && (
            <div className="space-y-3">
              {groupedByCriterion.map(([ref, items]) => {
                const expanded = expandedGroups.has(ref);
                const label = items[0]?.criterionLabel || "";
                return (
                  <Card key={ref} className="overflow-hidden">
                    <button onClick={() => toggleGroup(ref)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors">
                      {expanded ? <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="font-mono shrink-0">Critère {ref}</Badge>
                          <span className="text-sm text-gray-600 truncate">{label}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <ImpactBadges items={items} />
                        <Badge variant="secondary" className="ml-1">{items.length}</Badge>
                      </div>
                    </button>
                    {expanded && (
                      <div className="border-t divide-y">
                        {items.map(f => <FindingDetailRow key={f.id} finding={f} />)}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {/* ── BY REPORT ─────────────────────────────────────────────────── */}
          {viewMode === "by-report" && (
            <div className="space-y-3">
              {groupedByReport.map(([reportId, group]) => {
                const expanded = expandedGroups.has(reportId.toString());
                return (
                  <Card key={reportId} className="overflow-hidden">
                    <button onClick={() => toggleGroup(reportId.toString())} className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors">
                      {expanded ? <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
                      <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{extractSiteName(group.name)}</div>
                        {group.siteUrl && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                            <Globe className="w-3 h-3" />
                            <a href={group.siteUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="hover:underline truncate">{group.siteUrl}</a>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <ImpactBadges items={group.findings} />
                        <Badge variant="secondary" className="ml-1">{group.findings.length}</Badge>
                      </div>
                    </button>
                    {expanded && (
                      <div className="border-t divide-y">
                        {group.findings.map(f => <FindingDetailRow key={f.id} finding={f} />)}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {/* ── FLAT LIST ─────────────────────────────────────────────────── */}
          {viewMode === "flat" && (
            <div className="space-y-1 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {filteredFindings.map(f => <FindingDetailRow key={f.id} finding={f} />)}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Aucun constat trouvé avec les filtres sélectionnés.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
