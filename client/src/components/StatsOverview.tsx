import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, TrendingUp, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";

const COLORS = {
  Bloquant: "#ef4444",
  Majeur: "#f97316",
  Mineur: "#eab308",
};

export default function StatsOverview() {
  const { data: reports } = trpc.audit.getUserReports.useQuery();

  const totalReports = reports?.length || 0;
  const totalFindings = reports?.reduce((sum, r) => sum + (r.findingsCount || 0), 0) || 0;

  // Données pour le graphique des impacts
  const impactData = [
    { name: "Bloquant", value: 12, fill: COLORS.Bloquant },
    { name: "Majeur", value: 28, fill: COLORS.Majeur },
    { name: "Mineur", value: 15, fill: COLORS.Mineur },
  ];

  // Données pour le graphique des thématiques
  const thematicData = [
    { name: "1. Images", constats: 12 },
    { name: "2. Cadres", constats: 5 },
    { name: "3. Couleurs", constats: 8 },
    { name: "4. Multimédia", constats: 3 },
    { name: "5. Tableaux", constats: 6 },
    { name: "6. Liens", constats: 9 },
    { name: "7. Scripts", constats: 4 },
    { name: "8. Éléments obligatoires", constats: 7 },
  ];

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
              <div className="text-3xl font-bold text-gray-900">13</div>
              <AlertCircle className="w-8 h-8 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
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
    </div>
  );
}
