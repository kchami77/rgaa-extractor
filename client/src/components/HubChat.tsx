import { useState } from "react";
import { AIChatBox, type Message } from "./AIChatBox";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Info, Book, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HubChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Bonjour ! Je suis l'Expert IA du Hub RGAA. J'ai accès au référentiel officiel, aux techniques WCAG, aux notices AcceDe Web et à votre base d'expertise.\n\nPosez-moi une question sur un critère ou une technique d'accessibilité." 
    }
  ]);

  const ask = trpc.hub.ask.useQuery(
    { question: messages[messages.length - 1]?.content || "", context: "" },
    { 
      enabled: false, // On ne veut pas qu'il s'exécute automatiquement au mount
      retry: false
    }
  );

  const utils = trpc.useUtils();

  const handleSendMessage = async (content: string) => {
    // Ajouter le message utilisateur
    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    try {
      // Appeler manuellement la query tRPC (ou on pourrait passer en mutation si on préférait, 
      // mais ici le router définit ask comme une query).
      // Note: Pour une interface de chat, un fetch manuel ou une mutation est souvent plus simple,
      // mais on va faire au plus court avec ce qui existe.
      const result = await utils.hub.ask.fetch({ question: content });
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: result.answer 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Désolé, j'ai rencontré une erreur : ${error.message}` 
      }]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="hub-chat-container">
      <div className="lg:col-span-1 space-y-4">
        <Card className="border-none glass-card overflow-hidden shadow-lg bg-indigo-600/10 dark:bg-indigo-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-indigo-700 dark:text-indigo-300">
              <Brain className="w-5 h-5" />
              Status du Hub
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-white/40 dark:bg-black/20 rounded-lg space-y-2 border border-white/20">
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-80 text-indigo-900 dark:text-indigo-100 italic">Documents Indexés</span>
                <Badge variant="secondary" className="bg-indigo-500 text-white border-0 shadow-sm">400+</Badge>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-80 text-indigo-900 dark:text-indigo-100 italic">Moteur</span>
                <span className="font-mono text-[10px] text-indigo-700 dark:text-indigo-300">RAG + Ollama</span>
              </div>
            </div>
            <p className="text-[10px] text-indigo-800 dark:text-indigo-400 opacity-80 leading-relaxed italic">
              "L'IA fonde ses réponses sur le référentiel RGAA et vos modèles d'expertise approuvés."
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500" />
              Suggéré
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            {[
              "C'est quoi le critère 1.1 ?",
              "Comment rendre un menu accessible ?",
              "Exemple de bouton modal focus",
              "Alternative pour une image de logo"
            ].map((p, i) => (
              <button
                key={i}
                id={`hub-suggestion-${i}`}
                onClick={() => handleSendMessage(p)}
                className="w-full text-left text-[11px] p-2.5 rounded-lg bg-white/50 dark:bg-slate-900/50 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:shadow-md hover:-translate-x-1"
              >
                {p}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <AIChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={ask.isFetching}
          placeholder="Posez votre question d'expert..."
          height="650px"
          emptyStateMessage="Le Hub est prêt à vous répondre."
        />
      </div>
    </div>
  );
}
