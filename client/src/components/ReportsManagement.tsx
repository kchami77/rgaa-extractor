import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Trash2, Play } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";

export default function ReportsManagement() {
  const utils = trpc.useUtils();
  const { data: reports, isLoading } = trpc.audit.getUserReports.useQuery();
  const [processingId, setProcessingId] = useState<number | null>(null);

  const processReport = trpc.audit.processReport.useMutation({
    onSuccess: (data) => {
      toast.success(`Traitement terminé : ${data.findingsCount} constat(s) extraits`);
      setProcessingId(null);
      utils.audit.getUserReports.invalidate();
    },
    onError: (error) => {
      toast.error(`Erreur de traitement : ${error.message}`);
      setProcessingId(null);
      utils.audit.getUserReports.invalidate();
    },
  });

  const handleProcess = (reportId: number) => {
    setProcessingId(reportId);
    processReport.mutate({ reportId });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Traité";
      case "processing":
        return "En cours";
      case "failed":
        return "Erreur";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun rapport</h3>
          <p className="text-sm text-gray-600">
            Commencez par uploader un fichier d'audit Word pour voir vos rapports ici.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Mes rapports d'audit</CardTitle>
          <CardDescription>
            {reports.length} rapport{reports.length > 1 ? "s" : ""} uploadé{reports.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{report.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {report.findingsCount} constat{report.findingsCount > 1 ? "s" : ""} •{" "}
                      {formatDistanceToNow(new Date(report.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.status === "pending" && (
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleProcess(report.id)}
                      disabled={processingId === report.id}
                    >
                      {processingId === report.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Traiter
                        </>
                      )}
                    </Button>
                  )}
                  {report.status === "failed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      onClick={() => handleProcess(report.id)}
                      disabled={processingId === report.id}
                    >
                      {processingId === report.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        "Réessayer"
                      )}
                    </Button>
                  )}
                  <Badge className={getStatusColor(report.status)}>
                    {getStatusLabel(report.status)}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
