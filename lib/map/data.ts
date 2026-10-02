import { routes, getRoute, routeStops } from "@/lib/routes";
import { placeListFull, placesFull } from "@/lib/placesFull";
import { routeGeo } from "@/lib/routeGeo";
import type { MapStop } from "@/components/map/RouteMap";

export function mapStopsForRoute(slug: string): { stops: MapStop[]; line?: [number, number][]; missing: string[] } {
  const r = getRoute(slug);
  if (!r) return { stops: [], missing: [] };
  const stops: MapStop[] = []; const missing: string[] = [];
  routeStops(r).forEach((s, i) => {
    const p = placesFull[s.placeId];
    if (!p.coords) { missing.push(p.name); return; }
    stops.push({ id: s.placeId, name: p.name, area: p.area, coords: p.coords, approx: p.precision !== "exact", index: i + 1, note: s.note });
  });
  return { stops, line: routeGeo[slug]?.coords, missing };
}

export function allMapStops(): MapStop[] {
  return placeListFull.filter((p) => p.coords).map((p, i) => ({ id: p.id, name: p.name, area: p.area, coords: p.coords!, approx: p.precision !== "exact", index: i + 1 }));
}

export const routeOptions = routes.map((r) => ({ slug: r.slug, title: r.title }));
