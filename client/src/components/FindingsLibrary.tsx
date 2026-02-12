import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, AlertTriangle, Info, ExternalLink, ChevronDown, ChevronRight, FileText, Globe, LayoutList, Layers, FolderOpen } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { MultiSelect } from "@/components/ui/multi-select";

type ViewMode = "by-criterion" | "by-report" | "flat";

export default function FindingsLibrary() {
  const [viewMode, setViewMode] = useState<ViewMode>("by-criterion");
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [selectedPageNames, setSelectedPageNames] = useState<string[]>([]);
  const [selectedThematic, setSelectedThematic] = useState<string>("all");
  const [selectedImpact, setSelectedImpact] = useState<string>("all");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const { data: findings, isLoading } = trpc.audit.getEnrichedFindings.useQuery({
    reportIds: selectedReportIds.map(id => parseInt(id)),
    pageNames: selectedPageNames.length > 0 ? selectedPageNames : undefined,
    thematicNumber: selectedThematic !== "all" ? parseInt(selectedThematic) : undefined,
    impact: selectedImpact !== "all" ? (selectedImpact as any) : undefined,
  });

  const { data: reports } = trpc.audit.getUserReports.useQuery();

  // Extract unique pages from findings' location field
  const availablePages = useMemo(() => {
    if (!findings) return [];

    // Helper: strip all accents for comparison
    const stripAccents = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Canonical page names in the exact desired order
    const canonicalPages = [
      "Toutes les pages",
      "Commune",
      "Accueil",
      "Contact",
      "Mentions légales",
      "Déclaration d'accessibilité",
      "Plan du site",
      "Aide à la navigation",
      "Recherche",
      "Liste des actualités",
      "Actualité détaillée",
      "Liste des évènements",
      "Événement détaillé",
      "Page Sommaire",
      "Page de contenu",
      "Connexion utilisateur",
    ];

    // Matching rules: stripped pattern -> canonical name
    const matchingRules: Array<{ pattern: RegExp; canonical: string }> = [
      { pattern: /^toutes les pages/,                    canonical: "Toutes les pages" },
      { pattern: /^commune/,                             canonical: "Commune" },
      { pattern: /^accueil/,                             canonical: "Accueil" },
      { pattern: /^contact/,                             canonical: "Contact" },
      { pattern: /^mention/,                             canonical: "Mentions légales" },
      { pattern: /^declaration/,                         canonical: "Déclaration d'accessibilité" },
      { pattern: /^plan du site/,                        canonical: "Plan du site" },
      { pattern: /^aide a la navigation/,                canonical: "Aide à la navigation" },
      { pattern: /^recherche/,                           canonical: "Recherche" },
      { pattern: /^liste des actual/,                    canonical: "Liste des actualités" },
      { pattern: /^actualite/,                           canonical: "Actualité détaillée" },
      { pattern: /^liste des eve/,                       canonical: "Liste des évènements" },
      { pattern: /^eve?ne?ment/,                         canonical: "Événement détaillé" },
      { pattern: /^page sommaire/,                       canonical: "Page Sommaire" },
      { pattern: /^page de contenu/,                     canonical: "Page de contenu" },
      { pattern: /^connexion/,                           canonical: "Connexion utilisateur" },
    ];

    const pagesSet = new Set<string>();

    findings.forEach(f => {
      if (f.location) {
        let name = f.location.trim();

        // Remove content in guillemets « ... »
        name = name.split(/\s*«/)[0].trim();

        // Remove content after " : ", " - ", " | "
        name = name.split(/\s+[:|]\s+/)[0];
        name = name.split(/\s+-\s+/)[0];
        name = name.trim();

        // Strip accents for matching
        const stripped = stripAccents(name);

        // Try to match against canonical rules
        let matched = false;
        for (const rule of matchingRules) {
          if (rule.pattern.test(stripped)) {
            pagesSet.add(rule.canonical);
            matched = true;
            break;
          }
        }

        // If no rule matched, use the cleaned name as-is
        if (!matched) {
          pagesSet.add(name);
        }
      }
    });

    // Sort by canonical order, then alphabetical for extras
    return Array.from(pagesSet).sort((a, b) => {
      const indexA = canonicalPages.indexOf(a);
      const indexB = canonicalPages.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [findings]);

  // Impact stats
  const impactStats = useMemo(() => {
    if (!findings) return { total: 0, bloquant: 0, majeur: 0, mineur: 0 };
    return {
      total: findings.length,
      bloquant: findings.filter(f => f.impact === "Bloquant").length,
      majeur: findings.filter(f => f.impact === "Majeur").length,
      mineur: findings.filter(f => f.impact === "Mineur").length,
    };
  }, [findings]);

  // Unique thematics
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
    if (!findings) return [];
    const map = new Map<string, typeof findings>();
    findings.forEach(f => {
      const key = f.criterionReference || "?";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    });
    return Array.from(map.entries()).sort((a, b) => {
      const [na, nb] = [parseFloat(a[0]), parseFloat(b[0])];
      return na - nb;
    });
  }, [findings]);

  // Group by report
  const groupedByReport = useMemo(() => {
    if (!findings) return [];
    const map = new Map<number, { name: string; siteUrl: string | null; auditedPages: any[]; findings: typeof findings }>();
    findings.forEach(f => {
      const reportId = f.reportId;
      if (!map.has(reportId)) {
        let pages: any[] = [];
        try {
          if (f.reportAuditedPages) pages = JSON.parse(f.reportAuditedPages);
        } catch {}
        map.set(reportId, {
          name: f.reportFileName || `Rapport #${reportId}`,
          siteUrl: f.reportSiteUrl,
          auditedPages: pages,
          findings: [],
        });
      }
      map.get(reportId)!.findings.push(f);
    });
    return Array.from(map.entries());
  }, [findings]);

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Report filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rapports</label>
              <MultiSelect
                options={reports?.filter(r => r.status === "completed").map(r => ({
                  label: r.fileName.replace(/^\d+-/, '').replace(/\.docx$/i, ''),
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
      {findings && findings.length > 0 ? (
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
                          <FindingRow key={f.id} finding={f} showReport />
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
                            <FindingRow key={f.id} finding={f} showReport={false} />
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
              {findings.map(f => (
                <Card key={f.id} className="overflow-hidden">
                  <FindingRow finding={f} showReport />
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

/* ==================== Sub-components ==================== */

function SummaryCard({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className={`rounded-lg border p-3 ${className}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium opacity-80">{label}</p>
    </div>
  );
}

function ViewModeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-white text-indigo-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ImpactBadges({ items }: { items: any[] }) {
  const bloquant = items.filter(i => i.impact === "Bloquant").length;
  const majeur = items.filter(i => i.impact === "Majeur").length;
  const mineur = items.filter(i => i.impact === "Mineur").length;
  return (
    <>
      {bloquant > 0 && <Badge className="bg-red-100 text-red-800 text-xs">{bloquant} bloq.</Badge>}
      {majeur > 0 && <Badge className="bg-orange-100 text-orange-800 text-xs">{majeur} maj.</Badge>}
      {mineur > 0 && <Badge className="bg-yellow-100 text-yellow-800 text-xs">{mineur} min.</Badge>}
    </>
  );
}

function FindingRow({ finding, showReport }: { finding: any; showReport: boolean }) {
  const impactConfig = {
    Bloquant: { icon: <AlertCircle className="w-3.5 h-3.5" />, bg: "bg-red-100 text-red-800", dot: "bg-red-500" },
    Majeur: { icon: <AlertTriangle className="w-3.5 h-3.5" />, bg: "bg-orange-100 text-orange-800", dot: "bg-orange-500" },
    Mineur: { icon: <Info className="w-3.5 h-3.5" />, bg: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500" },
  }[finding.impact as "Bloquant" | "Majeur" | "Mineur"] || { icon: null, bg: "bg-gray-100 text-gray-800", dot: "bg-gray-500" };

  // Try to match location with audited page URL
  let locationUrl: string | null = null;
  if (finding.reportAuditedPages && finding.location) {
    try {
      const pages = JSON.parse(finding.reportAuditedPages);
      const loc = finding.location.toLowerCase();
      const matched = pages.find((p: any) => {
        const pName = p.name.toLowerCase();
        return loc.includes(pName) || pName.includes(loc) || 
               loc.replace(/['']/g, "'").includes(pName.replace(/['']/g, "'"));
      });
      if (matched) locationUrl = matched.url;
    } catch {}
  }

  return (
    <div className="px-4 py-3 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${impactConfig.dot}`} />
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Header line */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="font-mono text-xs shrink-0">
              {finding.criterionReference}
            </Badge>
            <Badge className={`${impactConfig.bg} text-xs`}>
              {impactConfig.icon}
              <span className="ml-1">{finding.impact}</span>
            </Badge>
            {finding.contentType && (
              <Badge variant="secondary" className="text-xs">{finding.contentType}</Badge>
            )}
            {showReport && finding.reportFileName && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {finding.reportFileName.replace(/^\d+-/, '').replace(/\.docx$/i, '').substring(0, 40)}
              </span>
            )}
          </div>

          {/* Criterion label */}
          {finding.criterionLabel && (
            <p className="text-xs text-gray-500 italic">{finding.criterionLabel}</p>
          )}

          {/* Location */}
          {finding.location && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500">📍</span>
              {locationUrl ? (
                <a href={locationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                  {finding.location}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-gray-600">{finding.location}</span>
              )}
            </div>
          )}

          {/* Finding text */}
          <p className="text-sm text-gray-800">{finding.finding}</p>

          {/* Solution */}
          {finding.solution && (
            <p className="text-sm text-green-700 italic">💡 {finding.solution}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function getThematicName(number: number): string {
  const thematics: Record<number, string> = {
    1: "Images",
    2: "Cadres",
    3: "Couleurs",
    4: "Multimédia",
    5: "Tableaux",
    6: "Liens",
    7: "Scripts",
    8: "Éléments obligatoires",
    9: "Structuration de l'information",
    10: "Présentation de l'information",
    11: "Formulaires",
    12: "Navigation",
    13: "Consultation",
  };
  return thematics[number] || `Thématique ${number}`;
}
