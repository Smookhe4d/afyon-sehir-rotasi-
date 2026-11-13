import { photos } from "./photos";
import { routes } from "./routes";

/** Her rota için, başka bir rotada kullanılmamış ilk fotoğraflı durağı seçer. Aynı fotoğraf iki kartta tekrarlanmaz, temsilî görsel kapak olmaz (G-016). */
export const routeCover: Record<string, string | undefined> = (() => {
  const used = new Set<string>(); const out: Record<string, string | undefined> = {};
  for (const r of routes) {
    const pick = r.stops.map((s) => s.placeId).find((id) => photos[id] && !photos[id].rep && !used.has(photos[id].src));
    if (pick) used.add(photos[pick].src);
    out[r.slug] = pick;
  }
  return out;
})();
