import {getContent} from "@/lib/content";

import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import AudioGuide from "@/components/AudioGuide";
import BackButton from "@/components/BackButton";
import PhotoSlot from "@/components/PhotoSlot";
import MapView from "@/components/map/LazyMap";
import {placeListFull} from "@/lib/placesFull";

export function generateStaticParams() { return placeListFull.map((p) => ({ id: p.id })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const {placeListFull, placesFull: places, routes} = getContent((await params).locale);

  const { id, locale } = await params; const p = places[id];
  return p ? pageMetadata(locale, "/duraklar/" + id, p.name, p.about?.[0] ?? p.note) : {};
}

export default async function Durak({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const {placeListFull, placesFull: places, routes} = getContent((await params).locale);

  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  const { id } = await params;
  const p = places[id];
  if (!p) notFound();
  const inRoutes = routes.filter((r) => r.stops.some((s) => s.placeId === id));
  return (
    <main className="wide pb-36 lg:pb-16">
      <section className="relative lg:mx-4 lg:mt-4">
        <PhotoSlot id={id} className="h-[230px] w-full lg:h-[400px] lg:rounded-[32px]" credit />
        <BackButton className="glass-dark absolute left-4 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full text-white" />
      </section>
      <article className="split relative -mt-7 rounded-t-[34px] bg-cream px-5 pt-5 lg:mt-0 lg:rounded-none lg:bg-transparent lg:px-9 lg:pt-8">
        <p className="text-xs font-bold text-terra">{p.area}</p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight lg:text-[40px]">{p.name}</h1>

        <AudioGuide title={p.name} text={(p.about?.length ? p.about : p.note ? [p.note] : []).join(" ")} />

        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-2">
          {p.about?.length ? p.about.map((t, i) => <p key={i}>{t}</p>) : p.note && <p>{p.note}</p>}
        </div>

        {p.facts && p.facts.length > 0 && (
          <dl className="mt-5 grid grid-cols-1 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white/80 shadow-card text-sm">
            {p.facts.map((f) => (
              <div key={f.label} className="flex gap-3 px-4 py-2.5"><dt className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-wide text-mute">{f.label}</dt><dd className="font-medium text-navy">{f.value}</dd></div>
            ))}
          </dl>
        )}

        {p.visitTips && p.visitTips.length > 0 && (
          <><h2 className="mt-6 font-display text-xl font-semibold">{tx("visitingTips_6bae5")}</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-2">{p.visitTips.map((t) => <li key={t}>{t}</li>)}</ul></>
        )}

        <div className="side">
        <h2 className="mt-6 font-display text-xl font-semibold">{tx("onTheMap_47ce7")}</h2>
        {p.coords ? (
          <>
            <div className="mt-2 h-[280px] overflow-hidden rounded-3xl border border-line lg:h-[460px]">
              <MapView stops={[{ id: p.id, name: p.name, area: p.area, coords: p.coords, approx: p.precision !== "exact", index: 1 }]} className="h-full w-full" />
            </div>
          </>
        ) : <p className="mt-2 rounded-2xl border border-line bg-white/70 shadow-card p-3 text-sm text-ink-2">{tx("thisStopSLocationHas_35a00")}</p>}
        </div>

        {inRoutes.length > 0 && (
          <><h2 className="mt-6 font-display text-xl font-semibold">{tx("routesThatIncludeThisStop_24e8e")}</h2>
          <ul className="mt-2 flex flex-col gap-2">{inRoutes.map((r) => <li key={r.slug}><Link href={`/rotalar/${r.slug}`} className="block rounded-2xl border border-line bg-white shadow-card px-4 py-3 text-sm font-semibold">{r.title}</Link></li>)}</ul></>
        )}

        <Link href={`/geri-bildirim?durak=${p.id}&tur=katki`} className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold shadow-card">{tx("isSomethingIncorrectOrMissing_4c334")} <span className="text-terra" aria-hidden>›</span></Link>

        {p.sources && p.sources.length > 0 && (
          <><h2 className="mt-6 font-display text-base font-semibold">{tx("sources_c1f19")}</h2>
          <ul className="mt-1.5 space-y-1 text-[12px] text-mute">{p.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2">{s.title}</a></li>)}</ul></>
        )}
      </article>
    </main>
  );
}
