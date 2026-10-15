import type { LngLat } from "./geo";
import {createTranslator} from "next-intl";
import type {Locale} from "@/i18n/routing";
import tr from "@/messages/tr.json";
import en from "@/messages/en.json";

const translate = (locale: Locale) => createTranslator({locale, messages: (locale === "en" ? en : tr).navigation});

export type TravelMode = "yuruyus" | "bisiklet" | "arac";
export type NavStep = { dist: number; text: string; rot: number };
export type NavResult = { dist: number; dur: number; coords: LngLat[]; steps: NavStep[] };

// OpenStreetMap (FOSSGIS) yönlendirme sunucuları; yürüyüş, bisiklet ve araç için ayrı profiller.
const BASE: Record<TravelMode, string> = {
  yuruyus: "https://routing.openstreetmap.de/routed-foot/route/v1/foot",
  bisiklet: "https://routing.openstreetmap.de/routed-bike/route/v1/bike",
  arac: "https://routing.openstreetmap.de/routed-car/route/v1/driving",
};
const ROT: Record<string, number> = { left: -90, right: 90, "slight left": -45, "slight right": 45, "sharp left": -135, "sharp right": 135, uturn: 180, straight: 0 };

type OsrmStep = { distance: number; name?: string; maneuver: { type: string; modifier?: string; exit?: number } };

export function stepText(s: OsrmStep, locale: Locale = "tr"): NavStep {
  const t = translate(locale);
  const { type, modifier, exit } = s.maneuver;
  let text: string;
  if (type === "arrive") text = t("arrive");
  else if (type === "depart") text = t("depart");
  else if (type === "roundabout" || type === "rotary") text = exit ? t("roundaboutExit", {exit}) : t("roundabout");
  else if (type === "merge") text = t("merge");
  else text = modifier && modifier in ROT ? t(modifier as keyof typeof tr.navigation) : modifier ? t("continue") : t("straight");
  return { dist: s.distance, text: s.name ? `${text} · ${s.name}` : text, rot: ROT[modifier ?? "straight"] ?? 0 };
}

export async function fetchNav(from: LngLat, to: LngLat, mode: TravelMode, signal?: AbortSignal, locale: Locale = "tr"): Promise<NavResult | null> {
  try {
    const url = `${BASE[mode]}/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson&steps=true`;
    const r = await fetch(url, { signal });
    if (!r.ok) return null;
    const j = await r.json();
    const route = j.routes?.[0];
    if (!route) return null;
    const steps: OsrmStep[] = route.legs?.[0]?.steps ?? [];
    // Her adımın "sıradaki manevra" metni, bir sonraki adımın manevrasıdır; mesafe bu adımın uzunluğudur.
    const out: NavStep[] = steps.map((s, i) => ({ ...stepText(steps[i + 1] ?? s, locale), dist: s.distance }));
    return { dist: route.distance, dur: route.duration, coords: route.geometry.coordinates as LngLat[], steps: out };
  } catch { return null; }
}

export function formatDuration(seconds: number, locale: "tr" | "en") {
  const t = translate(locale);
  const minutes = Math.max(1, Math.round(seconds / 60));
  const minuteUnit = t("minute");
  if (minutes < 60) return minutes + " " + minuteUnit;
  return Math.floor(minutes / 60) + " " + t("hour") + " " + (minutes % 60) + " " + minuteUnit;
}
export function bearingText(a: LngLat, b: LngLat, locale: Locale = "tr") {
  const y = b[0] - a[0], x = b[1] - a[1];
  const deg = (Math.atan2(y * Math.cos((a[1] * Math.PI) / 180), x) * 180) / Math.PI;
  const names = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"] as const;
  return translate(locale)(names[Math.round(((deg + 360) % 360) / 45) % 8]);
}
