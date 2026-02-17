import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Check, Send, AlertCircle, Info, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function DraftingAssistant() {
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState<{
    suggestedFinding: string;
    criterion: any;
    otherCriteria?: any[];
    confidence: number;
    templateUsed: string;
  } | null>(null);

  const generateDraft = trpc.findingTemplates.generateFromDraft.useMutation({
    onSuccess: (data) => {
      setResult(data);
      toast.success("Constat généré avec succès !");
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  const handleGenerate = (targetCriteriaRef?: string) => {
    if (!draft.trim()) return;
    // Pour l'instant on simule en changeant juste le critère si on veut raffiner,
    // mais dans une V2 le router accepterait un criterionRef forcé.
    generateDraft.mutate({ draft });
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.suggestedFinding);
      toast.success("Copié dans le presse-papier");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-indigo-100 shadow-sm overflow-hidden bg-gradient-to-br from-white to-indigo-50/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Assistant de Rédaction (Design Preview)</CardTitle>
                <CardDescription>Mode Consultation : Mapping critère actif / Rédaction suspendue</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Ex: 'h1 absent accueil' ou 'image logo pas de alt'..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[120px] text-lg p-4 border-indigo-100 focus:ring-indigo-500 rounded-xl bg-white shadow-inner"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) handleGenerate();
              }}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono hidden md:block">CTRL + ENTRÉE</span>
              <Button 
                onClick={() => handleGenerate()} 
                disabled={generateDraft.isPending || !draft.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 shadow-md shadow-indigo-200"
              >
                {generateDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Rédiger
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 pt-4 border-t border-indigo-100/50"
              >
                {/* Confidence & Criteria */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="bg-indigo-600 text-white border-none py-1 px-3">
                      Critère {result.criterion.reference}
                    </Badge>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      result.confidence > 0.8 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {result.confidence > 0.8 ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      Confiance : {Math.round(result.confidence * 100)}%
                    </div>
                  </div>

                  {result.otherCriteria && result.otherCriteria.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Était-ce plutôt l'un de ces critères ?</p>
                      <div className="flex flex-wrap gap-2">
                        {result.otherCriteria.map((c) => (
                          <button
                            key={c.id}
                            className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-slate-600"
                            onClick={() => {
                              toast.info(`Critère ${c.reference} sélectionné. Relance de la génération...`);
                              // Simuler la relance avec ce critère spécifique (V2 technique)
                              generateDraft.mutate({ draft }); 
                            }}
                          >
                            {c.reference} : {c.label.slice(0, 40)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Spotlight Result */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative p-8 bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" onClick={handleCopy} className="h-9 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 gap-2">
                        <Check className="w-4 h-4" />
                        Copier le constat
                      </Button>
                    </div>
                    
                    <div className="text-2xl leading-relaxed text-slate-100 font-medium mb-6">
                      {result.suggestedFinding}
                    </div>
                    
                    <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-indigo-400">
                        <div className="p-1.5 bg-indigo-500/10 rounded-full">
                          <Info className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-tighter text-slate-400">
                          Source : {result.templateUsed}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Preview Notice */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-1.5 bg-slate-100 rounded-full">
                    <Info className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">Mode Design Uniquement</p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      La logique de rédaction intelligente est actuellement suspendue pour maintenance. Seule l'identification du critère est fonctionnelle.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {!result && !generateDraft.isPending && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <StepHint icon={<Send />} title="Saisie Rapide" desc="Tapez vos notes sans vous soucier de la forme." />
            <StepHint icon={<ArrowRight />} title="Fusion Intelligente" desc="L'IA identifie le critère et injecte vos notes dans le template." />
            <StepHint icon={<Check />} title="Expertise Validée" desc="Obtenez un constat prêt pour le client finale en un clic." />
         </div>
      )}
    </div>
  );
}

function StepHint({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-4 bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
      <div className="text-indigo-500">{icon}</div>
      <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}
