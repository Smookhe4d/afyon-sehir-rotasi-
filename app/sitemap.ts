import type { MetadataRoute } from "next";
import { placeList } from "@/lib/places";
import { routes } from "@/lib/routes";

const base = "https://afyon-sehir-rotasi.vercel.app";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/rotalar", "/harita", "/rotani-belirle", "/sosyal", "/gizlilik", "/sartlar", "/hakkinda", "/geri-bildirim"].map((p) => ({ url: base + p })),
    ...routes.map((r) => ({ url: `${base}/rotalar/${r.slug}` })),
    ...placeList.map((p) => ({ url: `${base}/duraklar/${p.id}` })),
  ];
}
