import {getContent} from "@/lib/content";
import {getTranslations as getUiTranslations, setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import Announcements from "@/components/Announcements";
import WeatherCard from "@/components/WeatherCard";
import SearchBox, { type SearchItem } from "@/components/SearchBox";
import KesfetUI from "@/components/kesfet/KesfetUI";
import GuideRail, { type GuideCard } from "@/components/kesfet/GuideRail";
import CatBadge from "@/components/CatBadge";
import Icon from "@/components/Icon";
import { routeCover } from "@/lib/covers";
import { photos } from "@/lib/photos";
import { routeGeo } from "@/lib/routeGeo";
import { routeTimes } from "@/lib/durations";
import { CAT_ORDER, CAT_STYLE } from "@/lib/categories";
import { fmtTotal } from "@/lib/timefmt";
import type { RouteCategory } from "@/lib/types";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "/", pageTitle(locale, "home"));
}

const MODE_ICON = { arac: "car", yuruyus: "person-simple-walk", bisiklet: "bicycle" } as const;
const sample = (c: [number, number][], n = 400) => { const st = Math.max(1, Math.ceil(c.length / n)); return c.filter((_, i) => i % st === 0 || i === c.length - 1); };

/** G-011: Keşfet. Tam ekran harita ve üzerinde sürüklenen panel. İçerik eskisiyle aynı: arama, duyurular, hava, rotalar. */
export default async function Kesfet({ params }: { params: Promise<{locale: Locale}> }) {
  const locale = (await params).locale;
  setRequestLocale(locale);
  const {placeListFull, placesFull, routes, categoryLabels} = getContent(locale);
  const dx = await getUiTranslations({locale, namespace: "dynamic"});
  const tx = await getUiTranslations({locale, namespace: "ui"});
  const g = await getUiTranslations({locale, namespace: "g011"});
  const nav = await getUiTranslations({locale, namespace: "nav"});

  const searchItems: SearchItem[] = [
    ...routes.map((r) => ({ href: `/rotalar/${r.slug}`, label: r.title, sub: tx("route_5dd9b") })),
    ...placeListFull.map((p) => ({ href: `/duraklar/${p.id}`, label: p.name, sub: dx("searchStop", {area: p.area}) })),
  ];
  const local = routes.filter((r) => r.scope === "il-ici");
  const catOf: Record<string, RouteCategory> = {};
  for (const r of [...local, ...routes]) for (const s of r.stops) catOf[s.placeId] ??= r.category;
  const seen = new Set<string>();
  const stops = local.flatMap((r) => r.stops.map((s) => s.placeId)).filter((id) => placesFull[id]?.coords && !seen.has(id) && seen.add(id))
    .map((id) => ({ id, c: placesFull[id].coords!, cat: catOf[id], color: CAT_STYLE[catOf[id]].color, name: placesFull[id].name }));
  const mapRoutes = local.map((r) => ({ slug: r.slug, line: sample(routeGeo[r.slug]?.coords ?? []), stops: r.stops.filter((s) => placesFull[s.placeId]?.coords).map((s) => ({ id: s.placeId, c: placesFull[s.placeId].coords! })) }));
  const cards: GuideCard[] = local.map((r) => {
    const mode = (r.modes?.find((m) => routeTimes[r.slug]?.[m]) ?? "arac") as keyof typeof MODE_ICON;
    const t = routeTimes[r.slug]?.[mode];
    const cover = routeCover[r.slug];
    return { slug: r.slug, title: r.title.replace(/^Afyonkarahisar |^Afyon /, ""), cat: r.category, img: cover ? photos[cover].src : undefined, stops: g("stopCount", {count: r.stops.length}), time: t ? fmtTotal(g, t.total) : undefined, modeIcon: MODE_ICON[mode] };
  });
  const center = stops.filter((s) => placesFull[s.id].area === "Merkez" || placesFull[s.id].area === "Center").slice(0, 6);
  const routeOf = (id: string) => local.find((r) => r.stops.some((s) => s.placeId === id));
  const catCount = Object.fromEntries(CAT_ORDER.map((c) => [c, routes.filter((r) => r.category === c).length]));

  return (
    <KesfetUI stops={stops} routes={mapRoutes} chips={CAT_ORDER.map((c) => ({ cat: c, label: categoryLabels[c] }))}
      labels={{ map: g("mapLabel"), profile: nav("profile"), locate: tx("showMyLocation_ad4f4"), tilt: g("fullMap"), grab: g("guides"), panel: g("guides") }}>
      <div className="px-4 pb-1"><SearchBox items={searchItems} /></div>
      <GuideRail cards={cards} onMap={g("onMap")} empty={g("noRouteInCat")} heading={g("guides")} allLabel={g("all")}
        headingCat={Object.fromEntries(CAT_ORDER.map((c) => [c, g("catRoutes", {label: categoryLabels[c]})]))} />
      {center.length > 0 && <>
        <h3 className="px-4 pb-1 pt-5 text-sm font-bold text-mute">{g("inCenter")}</h3>
        <ul className="px-4">
          {center.map((s) => { const r = routeOf(s.id); const idx = r ? r.stops.findIndex((x) => x.placeId === s.id) + 1 : 0; const ph = photos[s.id]; return (
            <li key={s.id} className="border-b border-line last:border-0">
              <Link href={`/duraklar/${s.id}`} className="flex items-center gap-3 py-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {ph ? <img src={ph.src} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-2xl object-cover" /> : <CatBadge cat={s.cat} size={56} radius={16} />}
                <span className="min-w-0 flex-1"><b className="block text-[16px] leading-tight text-navy">{s.name}</b>{r && <span className="text-[13px] text-mute">{r.title.replace(/^Afyonkarahisar |^Afyon /, "")}, {idx}.</span>}</span>
                <Icon name="caret-right" size={18} className="text-mute/60" />
              </Link>
            </li>); })}
        </ul>
      </>}
      <h3 className="px-4 pb-2 pt-5 text-sm font-bold text-mute">{g("themes")}</h3>
      <div className="grid grid-cols-2 gap-2 px-4">
        {CAT_ORDER.map((c) => (
          <Link key={c} href={`/rotalar?tema=${c}`} className="flex items-center gap-2.5 rounded-[18px] bg-white p-2.5 shadow-card">
            <CatBadge cat={c} size={38} radius={12} />
            <span className="min-w-0"><b className="block truncate text-[14.5px] text-navy">{categoryLabels[c]}</b><span className="text-xs text-mute">{g("routeCount", {count: catCount[c]})}</span></span>
          </Link>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-2 px-4">
        <Link href="/rotani-belirle" className="flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-card">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ac-soft text-ac"><Icon name="signpost" size={24} fill /></span>
          <span className="min-w-0 flex-1"><b className="block text-[15.5px] text-navy">{g("plan")}</b><span className="text-[13px] text-mute">{g("planText")}</span></span><Icon name="caret-right" size={18} className="text-mute/60" />
        </Link>
        <Link href="/harita" className="flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-card">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ac-soft text-ac"><Icon name="map-trifold" size={24} fill /></span>
          <span className="min-w-0 flex-1"><b className="block text-[15.5px] text-navy">{g("fullMap")}</b><span className="text-[13px] text-mute">{tx("stopsAndYourLiveLocation_91489")}</span></span><Icon name="caret-right" size={18} className="text-mute/60" />
        </Link>
      </div>
      <div className="mt-2 [&>*]:mx-4"><Announcements /></div>
      <div className="[&>*]:mx-4"><WeatherCard /></div>
    </KesfetUI>
  );
}
