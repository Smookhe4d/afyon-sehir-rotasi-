import {routes} from "@/lib/routes";

import { routeGeo } from "@/lib/routeGeo";
import type { MapStop } from "@/components/map/RouteMap";
import {getContent} from "@/lib/content";
import type {Locale} from "@/i18n/routing";

export function mapStopsForRoute(slug: string, locale: Locale = "tr"): { stops: MapStop[]; line?: [number, number][]; missing: string[] } {
  const {getRoute, routeStops, placesFull} = getContent(locale);
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

export function allMapStops(locale: Locale = "tr"): MapStop[] {
  const {placeListFull} = getContent(locale);
  return placeListFull.filter((p) => p.coords).map((p, i) => ({ id: p.id, name: p.name, area: p.area, coords: p.coords!, approx: p.precision !== "exact", index: i + 1 }));
}

export const routeOptions = routes.map((r) => ({ slug: r.slug, title: r.title }));
export const localizedRouteOptions = (locale: Locale) => getContent(locale).routes.map(route => ({slug: route.slug, title: route.title}));

/** Rotanı Belirle: seçilen durakları verilen sırayla haritaya döker (duraklar arası düz çizgi). */
export function mapStopsForIds(ids: string[], locale: Locale = "tr"): { stops: MapStop[]; line?: [number, number][] } {
  const {placesFull} = getContent(locale);
  const stops: MapStop[] = [];
  ids.forEach((id) => {
    const p = placesFull[id];
    if (!p?.coords) return;
    stops.push({ id, name: p.name, area: p.area, coords: p.coords, approx: p.precision !== "exact", index: stops.length + 1 });
  });
  return { stops, line: stops.length > 1 ? stops.map((s) => s.coords) : undefined };
}
