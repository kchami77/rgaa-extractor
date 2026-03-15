import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Edit2, Check, X, BookOpen, AlertCircle, Sparkles, RefreshCw, Wand2, RotateCcw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function ExpertiseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImpact, setSelectedImpact] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ finding: string; solution: string }>({ finding: "", solution: "" });


  const utils = trpc.useUtils();
  const { data: templates, isLoading } = trpc.findingTemplates.search.useQuery({
    q: searchQuery || undefined,
    impact: selectedImpact !== "all" ? (selectedImpact as any) : undefined,
    status: selectedStatus !== "all" ? (selectedStatus as any) : undefined,
  });

  const updateTemplate = trpc.findingTemplates.updateTemplate.useMutation({
    onSuccess: () => {
      toast.success("Modèle mis à jour");
      setEditingId(null);

      utils.findingTemplates.search.invalidate();
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });



  const handleEdit = (t: any) => {
    setEditingId(t.id);
    setEditValues({ finding: t.finding, solution: t.solution || "" });
  };

  const handleSave = (id: number) => {
    updateTemplate.mutate({
      id,
      finding: editValues.finding,
      solution: editValues.solution,
    });
  };



  if (isLoading && !templates) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bibliothèque d'Expertise</h2>
          <p className="text-sm text-gray-500">Gérez vos modèles de constats génériques et approuvés</p>
        </div>
        <div className="flex items-center gap-3">

          <Badge variant="secondary" className="px-3 py-1">
            {templates?.length || 0} modèles
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les impacts</SelectItem>
                  <SelectItem value="Bloquant">Bloquant</SelectItem>
                  <SelectItem value="Majeur">Majeur</SelectItem>
                  <SelectItem value="Mineur">Mineur</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="deprecated">Obsolète</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {templates?.map((t) => (
          <Card key={t.id} className={`overflow-hidden border-l-4 ${t.status === 'approved' ? 'border-l-green-500' : 'border-l-amber-400'}`}>
            <CardHeader className="py-3 px-4 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">
                    Critère {t.criterionId}
                  </Badge>
                  <Badge className={t.impact === "Bloquant" ? "bg-red-100 text-red-800" : t.impact === "Majeur" ? "bg-orange-100 text-orange-800" : "bg-yellow-100 text-yellow-800"}>
                    {t.impact}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Utilisé {t.occurrenceCount} fois
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   {t.status === 'draft' && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Brouillon</Badge>}
                   {t.status === 'approved' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approuvé</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {editingId === t.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Phrase du constat</label>
                    <Textarea
                      value={editValues.finding}
                      onChange={(e) => setEditValues({ ...editValues, finding: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Solution préconisée</label>
                    <Textarea
                      value={editValues.solution}
                      onChange={(e) => setEditValues({ ...editValues, solution: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 mr-1" /> Annuler
                    </Button>
                    <Button size="sm" onClick={() => handleSave(t.id)} disabled={updateTemplate.isPending}>
                      {updateTemplate.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />} 
                      Enregistrer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="group relative">
                  <div className="pr-12">
                    <div className="text-gray-900 font-medium mb-2">{t.finding}</div>
                    {t.solution && (
                      <div className="text-sm text-gray-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                        <span className="font-semibold not-italic text-indigo-600 mr-1">Solution:</span> {t.solution}
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(t)}
                        title="Éditer manuellement"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {templates?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
             <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500">Aucun modèle ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
