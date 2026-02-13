import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, ExternalLink, FileText } from "lucide-react";
import { HighlightText } from "./HighlightText";

export function FindingRow({ finding, showReport, searchQuery = "" }: { finding: any; showReport: boolean; searchQuery?: string }) {
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
          <p className="text-sm text-gray-800"><HighlightText text={finding.finding} query={searchQuery} /></p>

          {/* Solution */}
          {finding.solution && (
            <p className="text-sm text-green-700 italic">💡 <HighlightText text={finding.solution} query={searchQuery} /></p>
          )}
        </div>
      </div>
    </div>
  );
}
