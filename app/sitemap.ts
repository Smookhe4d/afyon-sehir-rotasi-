import type { MetadataRoute } from "next";
import { placeList } from "@/lib/places";
import { routes } from "@/lib/routes";
import {routing} from "@/i18n/routing";
import {localizePath} from "@/i18n/paths";

const base = "https://afyon-sehir-rotasi.vercel.app";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/rotalar", "/harita", "/rotani-belirle", "/sosyal", "/gizlilik", "/sartlar", "/hakkinda", "/geri-bildirim",
    ...routes.map(r => "/rotalar/" + r.slug),
    ...placeList.map(p => "/duraklar/" + p.id)
  ];
  return paths.flatMap(path => routing.locales.map(locale => ({
    url: base + localizePath(path, locale),
    alternates: {languages: {tr: base + localizePath(path, "tr"), en: base + localizePath(path, "en"), "x-default": base + localizePath(path, "tr")}}
  })));
}
