import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Code2, Database, Sparkles, Cpu, ShieldCheck, ChevronRight, Zap, History, Layers } from "lucide-react";
import { evolutionData } from "../data/evolution";
import { motion } from "framer-motion";

const iconMap = {
  "mcp-integration": Cpu,
  "smart-deduplication": Database,
  "expertise-library": ShieldCheck,
  "ai-clean-pipeline": Sparkles,
  "bulk-safe-cleaning": Zap,
};

export default function EvolutionReport() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8 px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
          <History className="w-3 h-3" />
          Journal de Bord
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          L'Évolution du <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Projet</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Une épopée technique mêlant architecture MCP, déduplication intelligente et automatisation par IA.
        </p>
      </motion.div>

      {/* Navigation Rapide Premium */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative group mb-8"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <Card className="relative bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="pb-3 pt-4 border-b border-slate-50">
            <CardTitle className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Layers className="w-3 h-3" />
              Sauts Temporels
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 py-4">
            {evolutionData.map((m) => (
              <a 
                key={m.id} 
                href={`#${m.id}`}
                className="group/btn px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md transition-all duration-300 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/btn:bg-indigo-500 transition-colors" />
                {m.title}
              </a>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline Premium */}
      <div className="relative space-y-24 mt-16 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-100 before:via-slate-200 before:to-transparent">
        {evolutionData.map((milestone, index) => {
          const IconComponent = (iconMap as any)[milestone.id] || Circle;
          return (
            <motion.div 
              key={milestone.id} 
              id={milestone.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group scroll-mt-32"
            >
              {/* Dot Animated */}
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl border-4 border-white bg-white text-slate-400 group-hover:text-indigo-600 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-500 z-10 group-hover:rotate-12">
                <div className="absolute inset-0 bg-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <IconComponent className="w-6 h-6 relative z-10" />
              </div>
              
              {/* Card Container */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] md:group-odd:mr-auto md:group-even:ml-auto">
                <div className="relative p-1 rounded-3xl bg-transparent hover:bg-gradient-to-br hover:from-indigo-100 hover:to-purple-100 transition-all duration-500">
                  <Card className="border-slate-200 shadow-sm rounded-[1.4rem] overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 py-4 px-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" />
                          {milestone.date}
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 rounded-lg font-bold text-[10px] px-2 py-0.5 uppercase tracking-widest">
                          Délivré
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                        {milestone.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <p className="text-slate-600 text-lg leading-relaxed font-medium">
                        {milestone.summary}
                      </p>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/50 space-y-3">
                          <div className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] flex items-center gap-2 font-black">
                            <Zap className="w-3 h-3 fill-indigo-400" />
                            Impact Fonctionnel
                          </div>
                          <ul className="grid grid-cols-1 gap-2">
                            {milestone.functional.map((f, i) => (
                              <li key={i} className="flex items-start gap-3 bg-white/50 p-2 rounded-xl text-sm text-slate-700 font-semibold shadow-sm">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 space-y-3">
                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 font-black">
                            <Code2 className="w-3 h-3" />
                            Ingénierie & Architecture
                          </div>
                          <ul className="space-y-2">
                            {milestone.technical.map((t, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs text-slate-500 italic font-medium">
                                <ChevronRight className="w-3 h-3 text-slate-300" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center pt-20"
      >
        <div className="inline-block p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
          <p className="text-sm font-bold text-slate-400 flex items-center justify-center gap-2 italic font-medium">
            <ShieldCheck className="w-4 h-4" />
            Rapport Dynamique RGAA-Extractor • Mis à jour en temps réel
          </p>
        </div>
      </motion.div>
    </div>
  );
}
