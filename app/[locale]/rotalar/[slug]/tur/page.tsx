import {getContent} from "@/lib/content";
import {getTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata} from "@/i18n/metadata";
import { notFound } from "next/navigation";
import AudioGuide from "@/components/AudioGuide";
import NarrationPlayer from "@/components/NarrationPlayer";
import GooglePhotos from "@/components/GooglePhotos";
import PhotoGallery from "@/components/PhotoGallery";
import { narrationFor, surveys, intros, narrations, silentStops } from "@/lib/narration";
import PhotoSlot from "@/components/PhotoSlot";
import StopGuide from "@/components/stop/StopGuide";
import StopAlbum from "@/components/stop/StopAlbum";
import TourView, { type TourStop } from "@/components/tour/TourView";
import { photos } from "@/lib/photos";
import { ALBUMS } from "@/lib/albums";
import { routes } from "@/lib/routes";
import { routeTimes } from "@/lib/durations";
import { mapStopsForRoute } from "@/lib/map/data";
import { getSession } from "@/lib/session";

/** G-020: rota başlayınca açılan durak durak tur ekranı. */
export function generateStaticParams() { return routes.map((r) => ({ slug: r.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { slug, locale } = await params;
  const r = getContent(locale).getRoute(slug);
  return r ? { ...pageMetadata(locale, "/rotalar/" + slug + "/tur", r.title), robots: { index: false } } : {};
}

type Search = { mod?: string; grup?: string; lider?: string; durak?: string };

export default async function Tur({ params, searchParams }: { params: Promise<{ locale: Locale; slug: string }>; searchParams: Promise<Search> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const { getRoute, routeStops, routes: allRoutes } = getContent(locale);
  const r = getRoute(slug);
  if (!r) notFound();
  const g15 = await getTranslations({ locale, namespace: "g015" });
  const t = await getTranslations({ locale, namespace: "g020" });
  const g22 = await getTranslations({ locale, namespace: "g022" });
  const { mod, grup, lider, durak } = await searchParams;
  const modes = r.modes ?? ["arac"];
  const mode = mod === "arac" || mod === "bisiklet" || mod === "yuruyus" ? mod : modes.includes("yuruyus") ? "yuruyus" : modes[0];
  const code = grup && /^[A-Za-z0-9]{4,8}$/.test(grup) ? grup.toUpperCase() : undefined;
  const geo = mapStopsForRoute(slug, locale);
  const legs = routeTimes[slug]?.[mode as "arac"]?.legs ?? {};

  const { supabase, user } = await getSession();
  const progress = user ? await supabase.from("route_progress").select("visited_place_ids").eq("user_id", user.id).eq("route_slug", slug).maybeSingle() : { data: null };

  const list = routeStops(r);
  const stops: TourStop[] = list.map((s, i) => ({
    id: s.placeId, name: s.place.name, area: s.place.area,
    mapIdx: geo.stops.findIndex((m) => m.id === s.placeId),
    leg: i > 0 && legs[s.placeId] ? legs[s.placeId] : null,
  }));

  const panels = list.map((s) => {
    const p = s.place;
    const inRoutes = allRoutes.filter((x) => x.stops.some((y) => y.placeId === p.id));
    const nr = narrationFor(p.id, locale);
    const text = (p.about?.length ? p.about : p.note ? [p.note] : []).join(" ");
    return (
      <article key={p.id}>
        <div className="relative"><PhotoSlot id={p.id} eager className="h-[230px] w-full rounded-[28px] lg:h-[260px]" />{photos[p.id]?.gallery && <PhotoGallery items={photos[p.id].gallery!} alt={p.name} className="rounded-[28px]" />}<GooglePhotos id={p.id} alt={p.name} className="rounded-[28px]" /></div>
        <p className="mt-4 text-[13px] font-bold text-ac">{p.area}</p>
        <h2 className="mt-1 font-display text-[27px] leading-[1.08] text-navy lg:text-[32px]">{p.name}</h2>
        {s.note && <p className="mt-2 rounded-2xl bg-ac-soft px-3.5 py-2.5 text-[13.5px] font-medium leading-snug text-ac"><b>{t("onThisStop")}</b> {s.note}</p>}
        {locale === "tr" && intros[slug]?.at === p.id && narrations[intros[slug].key] && <NarrationPlayer title={g22("introTitle")} label={g22("introLabel")} {...narrations[intros[slug].key]} />}
        {locale === "tr" && silentStops[slug]?.includes(p.id) ? null : nr ? <NarrationPlayer title={p.name} {...nr} /> : <AudioGuide title={p.name} text={text} />}
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-2">
          {p.about?.length ? p.about.map((x, i) => <p key={i}>{x}</p>) : p.note && <p>{p.note}</p>}
        </div>
        {p.facts && p.facts.length > 0 && (
          <dl className="mt-5 grid grid-cols-1 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white/80 text-sm shadow-card">
            {p.facts.map((f) => (
              <div key={f.label} className="flex gap-3 px-4 py-2.5"><dt className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-wide text-mute">{f.label}</dt><dd className="font-medium text-navy">{f.value}</dd></div>
            ))}
          </dl>
        )}
        <StopAlbum title={g15("album")} repLabel={g15("rep")} photos={[...(photos[p.id] ? [{ src: photos[p.id].src, alt: photos[p.id].alt, rep: photos[p.id].rep }] : []), ...(ALBUMS[p.id] ?? []).map((a) => ({ src: a.src, alt: p.name, rep: a.rep }))]} />
        <StopGuide place={p} routes={inRoutes} locale={locale} />
      </article>
    );
  });

  return (
    <TourView
      slug={slug} title={r.title} mode={mode} grup={code} lider={lider === "1"} startId={durak} walkFrom={r.walkFrom}
      stops={stops} mapStops={geo.stops} line={geo.line} panels={panels}
      serverVisited={progress.data?.visited_place_ids ?? []}
      survey={surveys[slug]}
    />
  );
}
