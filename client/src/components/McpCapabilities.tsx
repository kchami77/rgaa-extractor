import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  Database, 
  Wand2, 
  Search, 
  Layers, 
  Zap, 
  ArrowRight, 
  Eye, 
  GitMerge, 
  ShieldCheck,
  Code2,
  BrainCircuit,
  Workflow,
  BookOpen,
  FileSearch,
  CheckCircle2,
  Info,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  "mcp-integration": Cpu,
  "smart-deduplication": Database,
  "expertise-library": ShieldCheck,
  "ai-clean-pipeline": Sparkles,
  "bulk-safe-cleaning": Zap,
  "get-report-findings": FileSearch,
  "search-findings": Search
};

export default function McpCapabilities() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 py-12 px-4">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold uppercase tracking-widest mb-4">
          <BrainCircuit className="w-4 h-4" />
          Model Context Protocol (MCP)
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
          L'IA, Augmentée par vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Données métiers</span>
        </h2>
        <p className="text-slate-500 max-w-3xl mx-auto text-xl leading-relaxed">
          Le protocole MCP n'est pas qu'une connexion technique : c'est le pont qui permet à l'IA de devenir un véritable collaborateur expert RGAA.
        </p>
      </motion.div>

      {/* 1. Le Cerveau Connecté : Comment ça marche ? */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Le Cerveau Connecté</h3>
              <p className="text-sm text-slate-500">Comprendre le flux d'intelligence</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">INFRASTRUCTURE NATIVE</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Visual Canvas */}
          <div className="lg:col-span-7 bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[400px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.1),transparent)]" />
            
            <div className="relative z-10 space-y-12">
              <div className="flex justify-between items-center px-4">
                {/* External World */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                    <BookOpen className="w-8 h-8 text-indigo-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Sources Externes</span>
                </div>

                {/* MCP Bridge */}
                <div className="flex-grow flex flex-col items-center gap-3 px-8">
                   <div className="w-full h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-indigo-500/0 relative">
                     <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-sm"
                     />
                   </div>
                   <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-widest">
                     MCP INTERFACE
                   </div>
                </div>

                {/* AI Brain */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] border-2 border-white/20">
                    <Cpu className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Votre IA</span>
                </div>
              </div>

              {/* Data Context nodes */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "RGAA Reference", desc: "106 Critères", status: "Read-only" },
                  { label: "Library", desc: "250+ Templates", status: "Read/Write" },
                  { label: "Word Reports", desc: "Projets Audités", status: "Full Context" }
                ].map((node, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm group hover:bg-white/10 transition-colors">
                    <div className="text-indigo-400 font-black text-xs mb-1">{node.label}</div>
                    <div className="text-white font-medium text-[10px] leading-tight mb-2">{node.desc}</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-400 text-[8px] font-bold uppercase tracking-widest">{node.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 space-y-4">
              <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                Pourquoi c'est révolutionnaire ?
              </h4>
              <p className="text-slate-600 text-md leading-relaxed">
                Contrairement à une IA classique qui "discute" de manière isolée, notre architecture MCP permet à l'IA d'avoir des **"Yeux"** sur vos fichiers et des **"Mains"** sur vos processus.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">1</div>
                  <p><strong>Zéro Hallucination :</strong> L'IA fonde ses réponses sur le référentiel RGAA réel (rgaa://criteria), pas sur ses souvenirs.</p>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">2</div>
                  <p><strong>Contexte Vivant :</strong> Elle connaît l'historique de vos audits. Elle sait ce que vous avez déjà validé dans le passé.</p>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">3</div>
                  <p><strong>Action Directe :</strong> Elle peut suggérer des modifications précises dans votre base de données via ses outils.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Le Catalogue d'Outils IA : Complet & Technique */}
      <section className="space-y-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
          <div className="p-2 bg-emerald-600 rounded-lg text-white">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Le Catalogue d'Outils Complet</h3>
            <p className="text-sm text-slate-500">Les capacités actives de l'agent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tool 1 : search_rgaa_expertise */}
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group">
             <CardHeader className="bg-indigo-50/30 p-8 border-b border-indigo-50">
               <div className="flex justify-between items-start mb-4">
                 <Badge className="bg-indigo-600 text-white border-0 rounded-lg">Moteur de recherche</Badge>
                 <Search className="w-5 h-5 text-indigo-400" />
               </div>
               <CardTitle className="text-2xl font-black font-mono text-slate-800">search_rgaa_expertise</CardTitle>
               <CardDescription className="text-xs font-bold text-indigo-500 uppercase">Input: {"{ q: string }"}</CardDescription>
             </CardHeader>
             <CardContent className="p-8 space-y-4">
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                 Interroge la bibliothèque centrale pour trouver des modèles de constats approuvés correspondant à un terme technique.
               </p>
               <div className="p-4 bg-slate-900 rounded-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 text-[8px] font-bold text-slate-600 uppercase">Exemple</div>
                 <code className="text-[11px] text-emerald-400 font-mono leading-tight">
                   search_rgaa_expertise(&#123; q: "modal focus" &#125;)
                 </code>
               </div>
               <div className="flex items-center gap-2 pt-2">
                 <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                 <span className="text-xs font-bold text-slate-700">Impact : Accès instantané au savoir collectif</span>
               </div>
             </CardContent>
          </Card>

          {/* Tool 2 : get_expertise_by_criterion */}
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
             <CardHeader className="bg-emerald-50/30 p-8 border-b border-emerald-50">
               <div className="flex justify-between items-start mb-4">
                 <Badge className="bg-emerald-600 text-white border-0 rounded-lg">Filtre Normatif</Badge>
                 <FileSearch className="w-5 h-5 text-emerald-400" />
               </div>
               <CardTitle className="text-2xl font-black font-mono text-slate-800">get_expertise_by_criterion</CardTitle>
               <CardDescription className="text-xs font-bold text-emerald-500 uppercase">Input: {"{ ref: string }"}</CardDescription>
             </CardHeader>
             <CardContent className="p-8 space-y-4">
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                 Extrait tous les exemples de rédaction liés à un critère RGAA précis (ex: 8.3) pour garantir la conformité.
               </p>
               <div className="p-4 bg-slate-900 rounded-2xl relative overflow-hidden">
                 <code className="text-[11px] text-emerald-400 font-mono leading-tight">
                   get_expertise_by_criterion(&#123; ref: "1.1" &#125;)
                 </code>
               </div>
               <div className="flex items-center gap-2 pt-2">
                 <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                 <span className="text-xs font-bold text-slate-700">Impact : Cohérence normative absolue</span>
               </div>
             </CardContent>
          </Card>

          {/* Tool 3 : propose_deduplication */}
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
             <CardHeader className="bg-amber-50/30 p-8 border-b border-amber-50">
               <div className="flex justify-between items-start mb-4">
                 <Badge className="bg-amber-600 text-white border-0 rounded-lg">Analyse Sémantique</Badge>
                 <GitMerge className="w-5 h-5 text-amber-400" />
               </div>
               <CardTitle className="text-2xl font-black font-mono text-slate-800">propose_deduplication</CardTitle>
               <CardDescription className="text-xs font-bold text-amber-500 uppercase">Input: {"{ text, ref }"}</CardDescription>
             </CardHeader>
             <CardContent className="p-8 space-y-4">
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                 Compare un nouveau constat avec la base existante et calcule un score de similitude pour suggérer une fusion.
               </p>
               <div className="p-4 bg-slate-900 rounded-2xl relative overflow-hidden">
                 <code className="text-[11px] text-emerald-400 font-mono leading-tight">
                   propose_deduplication(&#123; findingText: "...", criterionReference: "1.1" &#125;)
                 </code>
               </div>
               <div className="flex items-center gap-2 pt-2">
                 <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                 <span className="text-xs font-bold text-slate-700">Impact : Nettoyage automatique des doublons</span>
               </div>
             </CardContent>
          </Card>

          {/* Tool 4 : get_report_findings */}
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
             <CardHeader className="bg-blue-50/30 p-8 border-b border-blue-50">
               <div className="flex justify-between items-start mb-4">
                 <Badge className="bg-blue-600 text-white border-0 rounded-lg">Extraction</Badge>
                 <Database className="w-5 h-5 text-blue-400" />
               </div>
               <CardTitle className="text-2xl font-black font-mono text-slate-800">get_report_findings</CardTitle>
               <CardDescription className="text-xs font-bold text-blue-500 uppercase">Input: &#123; reportId: number &#125;</CardDescription>
             </CardHeader>
             <CardContent className="p-8 space-y-4">
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                 Lit l'intégralité des constats d'un rapport spécifique pour permettre à l'IA d'analyser un projet complet.
               </p>
               <div className="p-4 bg-slate-900 rounded-2xl relative overflow-hidden">
                 <code className="text-[11px] text-emerald-400 font-mono leading-tight">
                   get_report_findings(&#123; reportId: 12 &#125;)
                 </code>
               </div>
               <div className="flex items-center gap-2 pt-2">
                 <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                 <span className="text-xs font-bold text-slate-700">Impact : Analyse contextuelle globale</span>
               </div>
             </CardContent>
          </Card>

          {/* Tool 5 : search_findings */}
          <Card className="rounded-[2.5rem] border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
             <CardHeader className="bg-slate-50 p-8 border-b border-slate-200">
               <div className="flex justify-between items-start mb-4">
                 <Badge className="bg-slate-800 text-white border-0 rounded-lg">Big Data Audit</Badge>
                 <Search className="w-5 h-5 text-slate-400" />
               </div>
               <CardTitle className="text-2xl font-black font-mono text-slate-800">search_findings</CardTitle>
               <CardDescription className="text-xs font-bold text-slate-500 uppercase">Input: &#123; criterion, impact... &#125;</CardDescription>
             </CardHeader>
             <CardContent className="p-8 space-y-4">
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                 Recherche multi-critères à travers TOUS les rapports de TOUS vos clients pour dégager des tendances.
               </p>
               <div className="p-4 bg-slate-900 rounded-2xl relative overflow-hidden">
                 <code className="text-[11px] text-emerald-400 font-mono leading-tight">
                   search_findings(&#123; impact: "Bloquant" &#125;)
                 </code>
               </div>
               <div className="flex items-center gap-2 pt-2">
                 <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                 <span className="text-xs font-bold text-slate-700">Impact : Intelligence stratégique transverse</span>
               </div>
             </CardContent>
          </Card>
        </div>
      </section>

      {/* 2.5 Resources Section (The "Eyes" of the AI) */}
      <section className="space-y-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Le Graph de Connaissance (Resources)</h3>
            <p className="text-sm text-slate-500">Ce que l'IA peut lire nativement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                 <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="space-y-1">
                 <div className="text-xs font-black text-indigo-400 uppercase tracking-widest">URI: rgaa://criteria</div>
                 <h5 className="font-bold text-slate-800">Référentiel RGAA 4.1</h5>
                 <p className="text-xs text-slate-500 leading-relaxed">
                   L'IA accède aux 13 thématiques et 106 critères officiels. Elle ne peut pas "inventer" de règles.
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                 <Database className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-1">
                 <div className="text-xs font-black text-blue-400 uppercase tracking-widest">URI: rgaa://reports</div>
                 <h5 className="font-bold text-slate-800">Historique des Rapports</h5>
                 <p className="text-xs text-slate-500 leading-relaxed">
                   Vision complète sur tous les sites déjà audités pour capitaliser sur l'expérience passée.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Scénario : Un Audit Augmenté (Réel & Concret) */}
      <section className="space-y-12">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
           <div className="p-2 bg-pink-600 rounded-lg text-white">
             <Eye className="w-5 h-5" />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Scénario d'Usage : L'Audit Automatisé</h3>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Detailed step-by-step with real data examples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-start">
             {/* Step 1 : Discovery */}
             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4 relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center font-black text-slate-400 shadow-md">1</div>
                <h5 className="font-black text-slate-900 uppercase text-xs tracking-wider">Aspiration du Rapport</h5>
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Entrée Word :</p>
                   <p className="text-xs text-slate-600 italic leading-relaxed">
                     "Sur la page d'accueil de la Ville de Lyon, l'image du logo n'a pas d'alternative pour les non-voyants."
                   </p>
                </div>
                <p className="text-sm text-slate-500">
                  L'IA identifie le critère <Badge variant="outline" className="text-[10px]">1.1</Badge> et le sujet <Badge variant="outline" className="text-[10px]">Image</Badge>.
                </p>
             </div>

             {/* Step 2 : Intelligence */}
             <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-2xl shadow-indigo-200 space-y-4 relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center font-black text-indigo-600 shadow-md">2</div>
                <h5 className="font-black text-white uppercase text-xs tracking-wider">Réflexion & Match</h5>
                <div className="p-4 bg-white/10 rounded-2xl space-y-2 border border-white/10">
                   <p className="text-[11px] font-bold text-indigo-200 uppercase tracking-tighter">Action IA (search_expertise) :</p>
                   <p className="text-xs text-indigo-100 font-medium">
                     "Je cherche un modèle pour 1.1 + Logo. Trouvé : ID #42."
                   </p>
                </div>
                <p className="text-sm text-indigo-50/80">
                  Elle compare sémantiquement les deux phrases et voit que le modèle #42 est plus complet.
                </p>
             </div>

             {/* Step 3 : Transformation */}
             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4 relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center font-black text-white shadow-md">3</div>
                <h5 className="font-black text-slate-900 uppercase text-xs tracking-wider">Production Augmentée</h5>
                <div className="p-4 bg-emerald-50 rounded-2xl space-y-2 border border-emerald-100">
                   <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">Sortie Finale :</p>
                   <p className="text-xs text-slate-700 font-bold leading-relaxed">
                     "L'image de logo possédant une fonction de lien n'a pas d'alternative textuelle pertinente. Ajouter un attribut alt='Ville de Lyon - Accueil'."
                   </p>
                </div>
                <p className="text-sm text-slate-500">
                  L'IA a **transformé** un constat vague en une recommandation technique exacte.
                </p>
             </div>
          </div>
        </div>

        {/* The Benefit Frame */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <ShieldCheck className="w-56 h-56 text-indigo-500" />
           </div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
               <h4 className="text-4xl font-black text-white tracking-tight leading-tight">
                 Le résultat pour votre Cabinet d'Audit
               </h4>
               <p className="text-slate-400 text-lg leading-relaxed">
                 Ce n'est plus seulement une base de données, c'est un **actif qui apprend**. Chaque projet enrichit le suivant, créant un avantage compétitif majeur.
               </p>
               <div className="flex flex-wrap gap-4">
                 {[
                   "Qualité Constante",
                   "Gain de productivité",
                   "Standardisation RGAA",
                   "Transfert de savoir"
                 ].map((tag, i) => (
                   <div key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest">
                     {tag}
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-[2rem] bg-indigo-600 text-white space-y-2 shadow-2xl">
                  <div className="text-5xl font-black">2.5s</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Extraction & Match</div>
                </div>
                <div className="p-8 rounded-[2rem] bg-white text-slate-900 space-y-2 shadow-2xl">
                  <div className="text-5xl font-black">100%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Focus Expertise</div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* 4. Developer Space : Advanced Agentic Workflows */}
      <section className="space-y-12">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
          <div className="p-2 bg-slate-900 rounded-lg text-white">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Espace Développeurs : Workflows Agentiques</h3>
            <p className="text-sm text-slate-500">Exploiter toute la puissance du MCP par API ou via un Agent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Example 1 : Cross-Project Health Check */}
          <div className="space-y-4">
            <h5 className="flex items-center gap-2 font-bold text-slate-900">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              Scénario A : Audit de Santé Transverse
            </h5>
            <Card className="rounded-3xl border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-100/50 border-b border-slate-200 font-mono text-[10px] text-slate-500">
                // Objectif : Trouver les 10 problèmes bloquants les plus fréquents sur 50 clients.
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-[10px] leading-relaxed relative group/code">
                  <div className="text-slate-500 mb-2">// 1. Lister tous les rapports</div>
                  <div className="text-white">list_resources(&#123; uri: "rgaa://reports" &#125;)</div>
                  <div className="text-slate-500 my-2">// 2. Pour chaque projet, chercher les bloquants</div>
                  <div className="text-emerald-400">search_findings(&#123; impact: "Bloquant", reportId: 45 &#125;)</div>
                  <div className="text-slate-500 my-2">// 3. Consolider par Critère</div>
                  <div className="text-white">get_expertise_by_criterion(&#123; ref: "3.1" &#125;)</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-xs text-indigo-700 leading-relaxed font-semibold">
                    <Zap className="w-3 h-3 inline mr-2" />
                    Bénéfice : L'Agent peut générer une "carte de chaleur" de la dette technique accessibilité d'un parc de sites en quelques secondes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Example 2 : Library Self-Refactoring */}
          <div className="space-y-4">
            <h5 className="flex items-center gap-2 font-bold text-slate-900">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Scénario B : Refactoring de Bibliothèque
            </h5>
            <Card className="rounded-3xl border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-100/50 border-b border-slate-200 font-mono text-[10px] text-slate-500">
                // Objectif : Fusionner récursivement les modèles d'expertise similaires.
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-[10px] leading-relaxed relative">
                  <div className="text-slate-500 mb-2">// 1. Boucle sur les templates "Draft"</div>
                  <div className="text-white">call_tool("propose_deduplication", &#123;</div>
                  <div className="text-white pl-4">findingText: current.text,</div>
                  <div className="text-white pl-4">criterionReference: "1.1"</div>
                  <div className="text-white">&#125;)</div>
                  <div className="text-slate-500 my-2">// 2. Si similitude {'>'} 90%, proposer le merge</div>
                  <div className="text-amber-400">merge_templates(&#123; source: 101, target: 42 &#125;)</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs text-emerald-700 leading-relaxed font-semibold">
                    <Zap className="w-3 h-3 inline mr-2" />
                    Bénéfice : Votre bibliothèque d'expertise reste propre et unifiée, même après avoir ingéré 100 nouveaux rapports.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Deep Dive Container */}
        <div className="p-10 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] shadow-2xl relative overflow-hidden group border border-white/5">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="space-y-4 flex-grow">
                 <Badge className="bg-indigo-500 text-white border-0 px-3 py-1 font-black text-[10px] tracking-widest">ARCHITECTURE AGENTIQUE</Badge>
                 <h4 className="text-3xl font-black text-white leading-tight">
                   L'IA comme "Co-Développeur" de vos Audits
                 </h4>
                 <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                   Nos outils MCP ne sont pas de simples API. Ils sont conçus pour être **découvrables** par les outils de raisonnement de l'IA (comme moi). Cela permet à un agent d'inventer des solutions à vos problèmes sans que vous n'ayez besoin de coder chaque workflow à la main.
                 </p>
              </div>
              <div className="shrink-0 space-y-4">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4">
                       <Workflow className="w-6 h-6 text-indigo-400" />
                       <span className="text-white font-black text-sm uppercase tracking-tighter">Stack Tech</span>
                    </div>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                       {["Node.js", "tRPC", "Drizzle ORM", "MCP SDK", "TypeScript", "React 18"].map((t, i) => (
                         <li key={i} className="text-[10px] text-slate-500 flex items-center gap-2 font-bold">
                           <div className="w-1 h-1 rounded-full bg-indigo-500" />
                           {t}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer Branding */}
      <div className="text-center pt-8 border-t border-slate-100">
        <div className="inline-flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-[0.3em]">
          <Code2 className="w-4 h-4" />
          Powered by MCP Architecture • Built for Web Accessibility Experts
        </div>
      </div>
    </div>
  );
}
