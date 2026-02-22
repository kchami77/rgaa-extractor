import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ChevronDown, ChevronRight, FileText, Globe, LayoutList, Layers, FolderOpen, Search, X, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { MultiSelect } from "@/components/ui/multi-select";
import { SummaryCard } from "@/components/findings/SummaryCard";
import { ViewModeButton } from "@/components/findings/ViewModeButton";
import { ImpactBadges } from "@/components/findings/ImpactBadges";
import { FindingRow } from "@/components/findings/FindingRow";
import { getThematicName } from "@/components/findings/getThematicName";

type ViewMode = "by-criterion" | "by-report" | "flat";

export default function FindingsLibrary() {
  const [viewMode, setViewMode] = useState<ViewMode>("by-criterion");
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [selectedPageNames, setSelectedPageNames] = useState<string[]>([]);
  const [selectedThematic, setSelectedThematic] = useState<string>("all");
  const [selectedImpact, setSelectedImpact] = useState<string>("all");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isSmartSearch, setIsSmartSearch] = useState(false);

  const { data: findings, isLoading } = trpc.audit.getEnrichedFindings.useQuery({
    reportIds: selectedReportIds.map(id => parseInt(id)),
    pageNames: selectedPageNames.length > 0 ? selectedPageNames : undefined,
    thematicNumber: selectedThematic !== "all" ? parseInt(selectedThematic) : undefined,
    impact: selectedImpact !== "all" ? (selectedImpact as any) : undefined,
    q: isSmartSearch && searchQuery.trim().length > 2 ? searchQuery : undefined,
  }, {
    // Re-fetch only when smart search is active and query changes, 
    // or when filters change.
    keepPreviousData: true
  });

  const { data: reports } = trpc.audit.getUserReports.useQuery();

  // Helper: strip accents for search matching
  const stripAccents = useCallback((s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), []);

  // Client-side text search filtering
  const filteredFindings = useMemo(() => {
    if (!findings) return [];
    // En mode recherche intelligente, on fait confiance au backend pour le filtrage textuel
    if (isSmartSearch && searchQuery.trim().length > 2) return findings;
    
    if (!searchQuery.trim()) return findings;

    const queryWords = stripAccents(searchQuery.trim()).split(/\s+/).filter(Boolean);
    
    return findings.filter(f => {
      const haystack = stripAccents([
        f.finding,
        f.solution,
        f.location,
        f.criterionReference,
        f.criterionLabel,
        f.contentType,
        f.userProblem,
        f.subThematic,
      ].filter(Boolean).join(" "));
      
      // All words must appear somewhere in the text
      return queryWords.every(word => haystack.includes(word));
    });
  }, [findings, searchQuery, stripAccents, isSmartSearch]);

  // Extract unique pages from reports instead of scanning all findings
  const availablePages = useMemo(() => {
    if (!reports) return [];
    
    const pageSet = new Set<string>();
    reports.forEach(r => {
      try {
        if (r.auditedPages) {
          const pages = JSON.parse(r.auditedPages);
          pages.forEach((p: any) => {
            if (p.name) pageSet.add(p.name);
          });
        }
      } catch {}
    });

    return Array.from(pageSet).sort();
  }, [reports]);

  // Reuse outer stripAccents
  const strip = stripAccents;

  // Impact stats (based on filtered findings)
  const impactStats = useMemo(() => {
    if (!filteredFindings.length) return { total: 0, bloquant: 0, majeur: 0, mineur: 0 };
    return {
      total: filteredFindings.length,
      bloquant: filteredFindings.filter(f => f.impact === "Bloquant").length,
      majeur: filteredFindings.filter(f => f.impact === "Majeur").length,
      mineur: filteredFindings.filter(f => f.impact === "Mineur").length,
    };
  }, [filteredFindings]);

  // Unique thematics — use raw findings so filter dropdown always shows all options
  const uniqueThematics = useMemo(() => {
    if (!findings) return [];
    const map = new Map<number, string>();
    findings.forEach(f => {
      if (f.thematicNumber != null) {
        map.set(f.thematicNumber, getThematicName(f.thematicNumber));
      }
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [findings]);

  // Group by criterion
  const groupedByCriterion = useMemo(() => {
    if (!filteredFindings.length) return [];
    const map = new Map<string, typeof filteredFindings>();
    filteredFindings.forEach(f => {
      const key = f.criterionReference || "?";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    });
    return Array.from(map.entries()).sort((a, b) => {
      const [na, nb] = [parseFloat(a[0]), parseFloat(b[0])];
      return na - nb;
    });
  }, [filteredFindings]);

  // Group by report
  const groupedByReport = useMemo(() => {
    if (!filteredFindings.length) return [];
    const map = new Map<number, { name: string; siteUrl: string | null; auditedPages: any[]; findings: typeof filteredFindings }>();
    filteredFindings.forEach(f => {
        const reportData = (reports || []).find(r => r.id === reportId);
        let pages: any[] = [];
        try {
          if (reportData?.auditedPages) pages = JSON.parse(reportData.auditedPages);
        } catch {}
        map.set(reportId, {
          name: f.reportFileName || reportData?.fileName || `Rapport #${reportId}`,
          siteUrl: f.reportSiteUrl || reportData?.siteUrl || null,
          auditedPages: pages,
          findings: [],
        });
      map.get(reportId)!.findings.push(f);
    });
    return Array.from(map.entries());
  }, [filteredFindings]);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    if (viewMode === "by-criterion") {
      setExpandedGroups(new Set(groupedByCriterion.map(g => g[0])));
    } else {
      setExpandedGroups(new Set(groupedByReport.map(g => g[0].toString())));
    }
  };

  const collapseAll = () => setExpandedGroups(new Set());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
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
              <ViewModeButton
                active={viewMode === "by-criterion"}
                onClick={() => setViewMode("by-criterion")}
                icon={<Layers className="w-4 h-4" />}
                label="Par critère"
              />
              <ViewModeButton
                active={viewMode === "by-report"}
                onClick={() => setViewMode("by-report")}
                icon={<FolderOpen className="w-4 h-4" />}
                label="Par rapport"
              />
              <ViewModeButton
                active={viewMode === "flat"}
                onClick={() => setViewMode("flat")}
                icon={<LayoutList className="w-4 h-4" />}
                label="Liste"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par mots-clés... (ex: lien évitement, attribut alt, menu focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${!isSmartSearch ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`} onClick={() => setIsSmartSearch(false)}>
                Recherche Classique
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${isSmartSearch ? 'bg-purple-100 text-purple-700 border border-purple-200 animate-pulse-subtle' : 'bg-slate-100 text-slate-600 border border-slate-200'}`} onClick={() => setIsSmartSearch(true)}>
                <Search className="w-3 h-3" />
                Smart Search (IA)
              </div>
            </div>

            {searchQuery.trim() && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredFindings.length}</span> résultat{filteredFindings.length !== 1 ? 's' : ''} trouvé{filteredFindings.length !== 1 ? 's' : ''}
                {isSmartSearch && <span className="ml-1 text-purple-600 font-medium">(via ChromaDB)</span>}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Report filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rapports</label>
              <MultiSelect
                options={reports?.filter(r => r.status === "completed").map(r => ({
                  label: extractSiteName(r.fileName),
                  value: r.id.toString()
                })) || []}
                selected={selectedReportIds}
                onChange={setSelectedReportIds}
                placeholder="Tous les rapports"
              />
            </div>

            {/* Page filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pages</label>
              <Select value={selectedPageNames.length === 1 ? selectedPageNames[0] : "__all__"} onValueChange={(val) => setSelectedPageNames(val === "__all__" ? [] : [val])}>
                <SelectTrigger>
                  <SelectValue placeholder="Sans filtre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Sans filtre</SelectItem>
                  {availablePages.map(pageName => (
                    <SelectItem key={pageName} value={pageName}>
                      {pageName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Thematic filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Thématique</label>
              <Select value={selectedThematic} onValueChange={setSelectedThematic}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les thématiques" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les thématiques</SelectItem>
                  {uniqueThematics.map(([num, name]) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}. {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Impact filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Impact</label>
              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
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
          {viewMode !== "flat" && (
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={expandAll}>Tout déplier</Button>
              <Button variant="ghost" size="sm" onClick={collapseAll}>Tout replier</Button>
            </div>
          )}

          {viewMode === "by-criterion" && (
            <div className="space-y-3">
              {groupedByCriterion.map(([ref, items]) => {
                const expanded = expandedGroups.has(ref);
                const label = items[0]?.criterionLabel || "";
                return (
                  <Card key={ref} className="overflow-hidden">
                    <button
                      onClick={() => toggleGroup(ref)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                    >
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
                        {items.map(f => (
                          <FindingRow key={f.id} finding={f} showReport searchQuery={searchQuery} />
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {viewMode === "by-report" && (
            <div className="space-y-3">
              {groupedByReport.map(([reportId, group]) => {
                const expanded = expandedGroups.has(reportId.toString());
                return (
                  <Card key={reportId} className="overflow-hidden">
                    <button
                      onClick={() => toggleGroup(reportId.toString())}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      {expanded ? <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
                      <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{group.name.replace(/^\d+-/, '').replace(/\.docx$/i, '')}</div>
                        {group.siteUrl && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                            <Globe className="w-3 h-3" />
                            <a href={group.siteUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="hover:underline">
                              {group.siteUrl}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <ImpactBadges items={group.findings} />
                        <Badge variant="secondary" className="ml-1">{group.findings.length}</Badge>
                      </div>
                    </button>
                    {expanded && (
                      <div className="border-t">
                        {/* Audited pages */}
                        {group.auditedPages.length > 0 && (
                          <div className="bg-blue-50/50 px-4 py-3 border-b">
                            <p className="text-xs font-medium text-blue-800 mb-1.5">Pages auditées ({group.auditedPages.length})</p>
                            <div className="flex flex-wrap gap-1.5">
                              {group.auditedPages.map((p: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={p.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs bg-white border border-blue-200 text-blue-700 rounded px-2 py-0.5 hover:bg-blue-100 transition-colors"
                                >
                                  {p.name}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="divide-y">
                          {group.findings.map(f => (
                            <FindingRow key={f.id} finding={f} showReport={false} searchQuery={searchQuery} />
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {viewMode === "flat" && (
            <div className="space-y-3">
              {filteredFindings.map(f => (
                <Card key={f.id} className="overflow-hidden">
                  <FindingRow finding={f} showReport searchQuery={searchQuery} />
                </Card>
              ))}
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

/**
 * Extrait le nom du site lisible depuis le nom de fichier du rapport.
 * "1234567890-_publipostage_Cinémas_Du_Grand_Paris_Rapport-RGAA-4.1-Initial_202602JJ_STRATIS.docx"
 *  → "Cinémas Du Grand Paris"
 */
function extractSiteName(fileName: string): string {
  let name = fileName
    .replace(/^\d+-/, "")         // supprimer le timestamp
    .replace(/\.docx$/i, "");      // supprimer l'extension

  // Supprimer le préfixe _publipostage_
  name = name.replace(/^_?publipostage_/i, "");

  // Supprimer le suffixe _Rapport-RGAA-... et tout ce qui suit
  name = name.replace(/_Rapport[-_]RGAA.*$/i, "");

  // Supprimer un éventuel suffixe _STRATIS restant
  name = name.replace(/_STRATIS$/i, "");

  // Nettoyer les underscores → espaces
  name = name.replace(/_/g, " ").trim();

  return name || fileName;
}
