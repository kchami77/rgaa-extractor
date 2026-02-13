import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, TrendingUp, FileText, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const IMPACT_COLORS: Record<string, string> = {
  Bloquant: "#ef4444",
  Majeur: "#f97316",
  Mineur: "#eab308",
};

const THEMATIC_NAMES: Record<number, string> = {
  1: "Images",
  2: "Cadres",
  3: "Couleurs",
  4: "Multimédia",
  5: "Tableaux",
  6: "Liens",
  7: "Scripts",
  8: "Éléments obligatoires",
  9: "Structuration",
  10: "Présentation",
  11: "Formulaires",
  12: "Navigation",
  13: "Consultation",
};

export default function StatsOverview() {
  const { data: reports } = trpc.audit.getUserReports.useQuery();
  const { data: findings, isLoading } = trpc.audit.getEnrichedFindings.useQuery({});

  const totalReports = reports?.length || 0;
  const totalFindings = findings?.length || 0;

  // Données dynamiques pour le graphique des impacts
  const impactData = useMemo(() => {
    if (!findings || findings.length === 0) return [];
    const counts: Record<string, number> = { Bloquant: 0, Majeur: 0, Mineur: 0 };
    findings.forEach(f => {
      if (f.impact && counts[f.impact] !== undefined) {
        counts[f.impact]++;
      }
    });
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
        fill: IMPACT_COLORS[name] || "#8884d8",
      }));
  }, [findings]);

  // Données dynamiques pour le graphique des thématiques
  const thematicData = useMemo(() => {
    if (!findings || findings.length === 0) return [];
    const counts = new Map<number, number>();
    findings.forEach(f => {
      if (f.thematicNumber != null) {
        counts.set(f.thematicNumber, (counts.get(f.thematicNumber) || 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([num, count]) => ({
        name: `${num}. ${THEMATIC_NAMES[num] || `Thématique ${num}`}`,
        constats: count,
      }));
  }, [findings]);

  // Nombre de thématiques réellement couvertes
  const uniqueThematics = useMemo(() => {
    if (!findings) return 0;
    const set = new Set<number>();
    findings.forEach(f => {
      if (f.thematicNumber != null) set.add(f.thematicNumber);
    });
    return set.size;
  }, [findings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rapports uploadés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">{totalReports}</div>
              <FileText className="w-8 h-8 text-indigo-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Constats extraits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">{totalFindings}</div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Thématiques couvertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">{uniqueThematics}</div>
              <AlertCircle className="w-8 h-8 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      {totalFindings > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique des impacts */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution par impact</CardTitle>
              <CardDescription>Répartition des constats selon leur niveau d'impact</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={impactData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {impactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Graphique des thématiques */}
          <Card>
            <CardHeader>
              <CardTitle>Constats par thématique</CardTitle>
              <CardDescription>Nombre de constats détectés par thématique</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={thematicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="constats" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
