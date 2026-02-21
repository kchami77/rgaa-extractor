import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, BarChart3, BookOpen, Layers, History, Brain, Settings } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import UploadSection from "@/components/UploadSection";
import FindingsLibrary from "@/components/FindingsLibrary";
import ReportsManagement from "@/components/ReportsManagement";
import StatsOverview from "@/components/StatsOverview";
import ExpertiseLibrary from "@/components/ExpertiseLibrary";
import EvolutionReport from "@/components/EvolutionReport";
import McpCapabilities from "@/components/McpCapabilities";
import DraftingAssistant from "@/components/DraftingAssistant";
import { PenTool } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("upload");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-600 p-3 rounded-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">RGAA Constat Extractor</CardTitle>
              <CardDescription>
                Automatisez l'extraction de vos constats d'accessibilité RGAA 4.1
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Importez vos rapports d'audit Word et constituez une bibliothèque structurée de constats
                d'accessibilité conformes à la méthodologie RGAA 4.1.
              </p>
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                <a href={getLoginUrl()}>Se connecter</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RGAA Constat Extractor</h1>
              <p className="text-xs text-gray-500">Bibliothèque d'accessibilité</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">{user?.name || user?.email}</span>
            <Button variant="ghost" size="icon" asChild title="Paramètres du Hub">
              <Link href="/settings">
                <Settings className="h-5 w-5 text-gray-500 hover:text-indigo-600 transition-colors" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-8 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Rapports</span>
            </TabsTrigger>
            <TabsTrigger value="drafting" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">Rédaction</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Audit Explorer</span>
            </TabsTrigger>
            <TabsTrigger value="expertise" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Expertise</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Evolution</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI Hub</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <UploadSection onUploadSuccess={() => setActiveTab("reports")} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsManagement />
          </TabsContent>

          <TabsContent value="drafting" className="space-y-6">
            <DraftingAssistant />
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <FindingsLibrary />
          </TabsContent>

          <TabsContent value="expertise" className="space-y-6">
            <ExpertiseLibrary />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <StatsOverview />
          </TabsContent>

          <TabsContent value="evolution" className="space-y-6">
            <EvolutionReport />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <McpCapabilities />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
