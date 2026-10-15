import {routes} from "./routes";

/** Kabul edilen QR içerikleri: tam URL (…/rotalar/<slug> veya …/en/routes/<slug>), "/rotalar/<slug>" veya yalnızca "<slug>". */
export function parseRouteSlug(raw: string): string | null {
  const text = raw.trim();
  let candidate = text;
  try { const u = new URL(text); candidate = u.pathname; } catch { /* URL değil */ }
  const m = candidate.match(/^(?:\/rotalar|\/en\/routes)\/([a-z0-9-]+)\/?$/i);
  const slug = (m ? m[1] : candidate.replace(/^\/+|\/+$/g, "")).toLowerCase();
  return routes.some((r) => r.slug === slug) ? slug : null;
}

