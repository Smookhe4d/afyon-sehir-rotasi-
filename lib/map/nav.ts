import type { LngLat } from "./geo";

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
const TEXT: Record<string, string> = { left: "Sola dönün", right: "Sağa dönün", "slight left": "Hafif sola dönün", "slight right": "Hafif sağa dönün", "sharp left": "Keskin sola dönün", "sharp right": "Keskin sağa dönün", uturn: "U dönüşü yapın", straight: "Düz devam edin" };

type OsrmStep = { distance: number; name?: string; maneuver: { type: string; modifier?: string; exit?: number } };

export function stepText(s: OsrmStep): NavStep {
  const { type, modifier, exit } = s.maneuver;
  let text: string;
  if (type === "arrive") text = "Hedefe varıyorsunuz";
  else if (type === "depart") text = "Yola çıkın";
  else if (type === "roundabout" || type === "rotary") text = exit ? `Kavşaktan ${exit}. çıkıştan çıkın` : "Kavşaktan çıkın";
  else if (type === "merge") text = "Yola katılın";
  else text = TEXT[modifier ?? "straight"] ?? "Devam edin";
  return { dist: s.distance, text: s.name ? `${text} · ${s.name}` : text, rot: ROT[modifier ?? "straight"] ?? 0 };
}

export async function fetchNav(from: LngLat, to: LngLat, mode: TravelMode, signal?: AbortSignal): Promise<NavResult | null> {
  try {
    const url = `${BASE[mode]}/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson&steps=true`;
    const r = await fetch(url, { signal });
    if (!r.ok) return null;
    const j = await r.json();
    const route = j.routes?.[0];
    if (!route) return null;
    const steps: OsrmStep[] = route.legs?.[0]?.steps ?? [];
    // Her adımın "sıradaki manevra" metni, bir sonraki adımın manevrasıdır; mesafe bu adımın uzunluğudur.
    const out: NavStep[] = steps.map((s, i) => ({ ...stepText(steps[i + 1] ?? s), dist: s.distance }));
    return { dist: route.distance, dur: route.duration, coords: route.geometry.coordinates as LngLat[], steps: out };
  } catch { return null; }
}

export const formatDuration = (s: number) => (s < 90 ? "1 dk" : s < 3600 ? `${Math.round(s / 60)} dk` : `${Math.floor(s / 3600)} sa ${Math.round((s % 3600) / 60)} dk`);
export function bearingText(a: LngLat, b: LngLat) {
  const y = b[0] - a[0], x = b[1] - a[1];
  const deg = (Math.atan2(y * Math.cos((a[1] * Math.PI) / 180), x) * 180) / Math.PI;
  const names = ["kuzey", "kuzeydoğu", "doğu", "güneydoğu", "güney", "güneybatı", "batı", "kuzeybatı"];
  return names[Math.round(((deg + 360) % 360) / 45) % 8];
}
