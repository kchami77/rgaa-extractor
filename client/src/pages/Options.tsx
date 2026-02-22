import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  RefreshCw, 
  Settings, 
  Database, 
  Globe, 
  Zap, 
  ShieldCheck,
  ChevronLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  LucideIcon
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Options() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    document.title = "Options Hub | Perfection RAG";
  }, []);
  
  // ─── tRPC Queries ──────────────────────────────────────────────────────────
  
  // Statut du scraping (polling de 2s si actif)
  const { data: status, refetch: refetchStatus } = trpc.hub.getScrapeStatus.useQuery(undefined, {
    refetchInterval: (query: any) => {
      const data = query.state.data;
      return data?.phase === "running" ? 2000 : false;
    },
  });

  // Paramètres
  const { data: settings, isLoading: loadingSettings, refetch: refetchSettings } = trpc.settings.getAll.useQuery();

  // ─── tRPC Mutations ───────────────────────────────────────────────────────
  
  const updateSetting = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success("Paramètre mis à jour");
      refetchSettings();
    },
    onError: (err) => toast.error(`Erreur : ${err.message}`),
  });

  const triggerReindex = trpc.hub.triggerReindex.useMutation({
    onSuccess: () => {
      toast.success("Réindexation lancée en arrière-plan");
      refetchStatus();
    },
    onError: (err) => toast.error(`Impossible de lancer : ${err.message}`),
  });

  const resetToDefaults = trpc.settings.resetToDefaults.useMutation({
    onSuccess: () => {
      toast.success("Paramètres réinitialisés aux valeurs d'usine");
      refetchSettings();
    },
  });

  // ─── Handlers ──────────────────────────────────────────────────────────────
  
  const handleReindex = (source: string = "all") => {
    triggerReindex.mutate({ source: source as any, reset: true });
  };

  const handleUpdate = (key: string, value: string) => {
    updateSetting.mutate({ key, value });
  };

  // ─── Helpers affichage ─────────────────────────────────────────────────────
  
  const categories: Array<{ id: string; name: string; icon: LucideIcon }> = [
    { id: "llm", name: "Modèle LLM", icon: Zap },
    { id: "embed", name: "Embeddings", icon: Search },
    { id: "chroma", name: "Base Vectorielle (Chroma)", icon: Database },
    { id: "rag", name: "Moteur RAG", icon: Settings },
    { id: "sources", name: "Sources de données", icon: Globe },
    { id: "mcp", name: "Outils MCP", icon: ShieldCheck },
  ];

  if (loadingSettings) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 dark:bg-slate-950/20">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2">
              <ChevronLeft className="h-4 w-4" />
              <Link href="/" className="text-sm font-medium">Retour à l'audit</Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Hub de Connaissances</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Configurez le moteur RAG et gérez l'indexation des référentiels d'accessibilité.
            </p>
          </div>
          <Button 
            id="hub-reset-defaults-btn"
            variant="outline" 
            onClick={() => resetToDefaults.mutate()} 
            disabled={resetToDefaults.isPending}
          >
            Défauts usine
          </Button>
        </div>

        {/* 1. Monitoring & Scraping */}
        <Card id="hub-monitoring-card" className="border-none glass-card overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <RefreshCw 
              className={`h-4 w-4 text-slate-400 cursor-pointer ${status?.phase === 'running' ? 'animate-spin' : ''}`} 
              onClick={() => refetchStatus()} 
            />
          </div>
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  Statut de l'indexation
                  {status?.phase === "running" && <Badge className="animate-pulse bg-blue-500">En cours</Badge>}
                  {status?.phase === "done" && <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">À jour</Badge>}
                </CardTitle>
                <CardDescription>
                  ChromaDB contient {status?.totalIndexed || 0} documents indexés.
                </CardDescription>
              </div>
              <Button 
                id="hub-reindex-all-btn"
                onClick={() => handleReindex()} 
                disabled={status?.phase === "running"}
                className="gap-2 btn-premium border-none"
              >
                <RefreshCw className="h-4 w-4" />
                Tout ré-indexer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {status?.phase === "running" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scraping : <span className="font-semibold text-primary uppercase">{status.currentSource}</span></span>
                  <span>{status.progress}%</span>
                </div>
                <Progress value={status.progress} className="h-2" />
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-3 border rounded-lg bg-white dark:bg-slate-900 flex flex-col gap-1">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">RGAA 4.1.2</span>
                <div className="flex items-center justify-between">
                   <span className="text-sm">106 critères</span>
                   <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="p-3 border rounded-lg bg-white dark:bg-slate-900 flex flex-col gap-1">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">MDN / AcceDe</span>
                <div className="flex items-center justify-between">
                   <span className="text-sm">Experts</span>
                   <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="p-3 border rounded-lg bg-white dark:bg-slate-900 flex flex-col gap-1">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">ChromaDB</span>
                <div className="flex items-center justify-between">
                   <span className="text-sm font-medium">Connecté</span>
                   <Badge variant="outline" className="text-[10px] h-4 px-1">CO-SINE</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Paramètres dynamique par catégories */}
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const catSettings = settings?.filter((s: any) => s.category === cat.id) || [];
            if (catSettings.length === 0) return null;

            return (
              <Card key={cat.id} className="h-full border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 bg-slate-50/30 dark:bg-slate-900/10">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    {cat.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {catSettings.map((s: any) => (
                    <div key={s.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={s.key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {s.key.split('.').pop()?.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </Label>
                        {s.type === 'boolean' ? (
                          <Switch 
                            id={s.key} 
                            checked={s.value === 'true'} 
                            onCheckedChange={(checked) => handleUpdate(s.key, checked ? 'true' : 'false')}
                          />
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-mono opacity-50 uppercase">{s.type}</Badge>
                        )}
                      </div>
                      
                      {s.type !== 'boolean' && (
                        <div className="flex gap-2">
                          <Input 
                            id={`setting-input-${s.key}`}
                            type={s.type === 'password' ? 'password' : 'text'}
                            defaultValue={s.value}
                            className="text-xs h-9 bg-white/50 dark:bg-black/20 border-slate-200/50"
                            onBlur={(e) => {
                              if (e.target.value !== s.value) {
                                handleUpdate(s.key, e.target.value);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdate(s.key, e.currentTarget.value);
                              }
                            }}
                          />
                        </div>
                      )}
                      
                      {s.description && (
                         <p className="text-[11px] text-slate-400 italic leading-tight">
                           {s.description}
                         </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-6 py-10 opacity-30 select-none grayscale">
           <AlertCircle className="h-4 w-4" />
           <span className="text-xs font-semibold tracking-widest uppercase italic">Hub Engine v1.0 — Architecture RAG Vectorisée</span>
        </div>
      </div>
    </div>
  );
}
