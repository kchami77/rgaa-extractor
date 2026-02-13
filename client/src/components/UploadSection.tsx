import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UploadSectionProps {
  onUploadSuccess?: () => void;
}

export default function UploadSection({ onUploadSuccess }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [duplicateFile, setDuplicateFile] = useState<{ file: File; existingReport: any } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const performUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const response = await fetch("/api/audit/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      toast.success(`${file.name} uploadé avec succès`);
      onUploadSuccess?.();
    } catch (error) {
      console.error("Upload error:", error);
      const message = error instanceof Error ? error.message : "Erreur lors de l'upload";
      toast.error(`Erreur: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Vérifier l'extension
      if (!file.name.endsWith(".docx")) {
        toast.error(`${file.name} n'est pas un fichier Word valide`);
        continue;
      }

      // Vérifier la taille (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max 50MB)`);
        continue;
      }

      // Vérifier si le fichier existe déjà
      try {
        const existingReport = await utils.audit.checkReportExists.fetch({ fileName: file.name });
        if (existingReport) {
          setDuplicateFile({ file, existingReport });
          break; // On arrête pour demander confirmation (on ne traite qu'un doublon à la fois pour la simplicité)
        }
      } catch (error) {
        console.error("Check duplicate error:", error);
      }

      await performUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importer un rapport d'audit</CardTitle>
          <CardDescription>
            Uploadez vos fichiers Word (.docx) pour extraire automatiquement les constats d'accessibilité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Déposez vos fichiers ici
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ou cliquez pour parcourir votre ordinateur
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Sélectionner des fichiers
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-4">
              Formats acceptés: .docx | Taille max: 50MB
            </p>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Assurez-vous que vos fichiers Word respectent la structure standardisée du rapport RGAA 4.1
          avec la section "Descriptions des erreurs d'accessibilité".
        </AlertDescription>
      </Alert>

      <AlertDialog open={!!duplicateFile} onOpenChange={(open) => !open && setDuplicateFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fichier déjà existant</AlertDialogTitle>
            <AlertDialogDescription>
              Un rapport nommé <strong>{duplicateFile?.file.name}</strong> a déjà été importé
              le {duplicateFile?.existingReport?.createdAt 
                ? new Date(duplicateFile.existingReport.createdAt).toLocaleDateString("fr-FR") 
                : "écemment"}.
              <br /><br />
              Voulez-vous quand même l'importer ? Cela créera un nouveau rapport distinct.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                if (duplicateFile) {
                  performUpload(duplicateFile.file);
                  setDuplicateFile(null);
                }
              }}
            >
              Importer quand même
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
