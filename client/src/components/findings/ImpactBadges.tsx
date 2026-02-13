import { Badge } from "@/components/ui/badge";

export function ImpactBadges({ items }: { items: any[] }) {
  const bloquant = items.filter(i => i.impact === "Bloquant").length;
  const majeur = items.filter(i => i.impact === "Majeur").length;
  const mineur = items.filter(i => i.impact === "Mineur").length;
  return (
    <>
      {bloquant > 0 && <Badge className="bg-red-100 text-red-800 text-xs">{bloquant} bloq.</Badge>}
      {majeur > 0 && <Badge className="bg-orange-100 text-orange-800 text-xs">{majeur} maj.</Badge>}
      {mineur > 0 && <Badge className="bg-yellow-100 text-yellow-800 text-xs">{mineur} min.</Badge>}
    </>
  );
}
