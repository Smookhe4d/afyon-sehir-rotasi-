import type { Route } from "@/lib/types";
import { categoryLabels, difficultyLabels } from "@/lib/routes";

export function routeMetaLine(r: Route): string {
  const parts: string[] = [];
  if (r.distanceKm) parts.push(`${r.distanceNote?.startsWith("Yaklaşık") || r.distanceNote === "Toplam, yaklaşık" ? "~" : ""}${r.distanceKm} km`);
  parts.push(`${r.stops.length} durak`);
  if (r.difficulty) parts.push(difficultyLabels[r.difficulty]);
  return parts.join(" · ");
}

export function CategoryChip({ r }: { r: Route }) {
  return <span className="self-start rounded-full bg-sand px-2.5 py-0.5 text-[10.5px] font-bold">{categoryLabels[r.category]}</span>;
}
