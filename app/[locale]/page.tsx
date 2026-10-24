import MotionProvider from "@/components/motion/MotionProvider";
import {getContent} from "@/lib/content";

import {getTranslations as getUiTranslations} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import PhotoSlot from "@/components/PhotoSlot";
import { CategoryChip, routeMetaLine } from "@/components/RouteMeta";
import Announcements from "@/components/Announcements";
import WeatherCard from "@/components/WeatherCard";
import SearchBox, { type SearchItem } from "@/components/SearchBox";

import { routeCover } from "@/lib/covers";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {placeListFull, routes} = getContent((await params).locale);

  const {locale} = await params;
  return pageMetadata(locale, "/", pageTitle(locale, "home"));
}

export default async function Kesfet({ params }: { params: Promise<{locale: Locale}> }) {
  const locale = (await params).locale;
  const {placeListFull, routes} = getContent((await params).locale);

  const dx = await getUiTranslations({locale: (await params).locale, namespace: "dynamic"});
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  const searchItems: SearchItem[] = [
  ...routes.map((r) => ({ href: `/rotalar/${r.slug}`, label: r.title, sub: tx("route_5dd9b") })),
  ...placeListFull.map((p) => ({ href: `/duraklar/${p.id}`, label: p.name, sub: dx("searchStop", {area: p.area}) })),
];

  setRequestLocale((await params).locale);
  const local = routes.filter((r) => r.scope === "il-ici");
  return (
    <MotionProvider key={locale}>
      <section className="relative z-10 px-5 pt-4 lg:mx-4 lg:mt-2 lg:min-h-[500px] lg:px-14 lg:pt-12">
        <div data-enter="0" className="relative z-20 lg:max-w-[560px]">
          {/* Telefonda üst menü olmadığı için marka burada görünür. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/rotafyon-acik-480.webp" srcSet="/brand/rotafyon-acik-480.webp 1x, /brand/rotafyon-acik-960.webp 2x" width={107} height={32} alt="rotAfyon" className="mb-3 h-8 w-auto lg:hidden" />
          <SearchBox items={searchItems} />
        </div>
        <div data-enter="1" className="relative z-20 mt-5 lg:mt-14">
          <p className="text-[10.5px] font-bold tracking-[2px] text-terra lg:text-xs lg:tracking-[4px]">{tx("afyonkarahSar_6ac24")}</p>
          <h1 className="mt-1 font-display text-[44px] font-semibold leading-none tracking-tight text-navy lg:mt-3 lg:text-[88px]">{tx("explore_62f64")}</h1>
          <p className="mt-2 max-w-[300px] text-sm text-ink-2 lg:mt-4 lg:max-w-[440px] lg:text-lg lg:leading-relaxed">{dx("homeIntro", {count: routes.length})}</p>
          <div className="mt-8 hidden gap-3 lg:flex"><Link href="/rotalar" className="terra-grad rounded-full px-7 py-3.5 font-bold text-white">{tx("exploreRoutes_dd231")}</Link><Link href="/harita" className="rounded-full border border-navy/15 bg-white/80 px-7 py-3.5 font-bold text-navy shadow-card backdrop-blur">{tx("openTheMap_40ddf")}</Link></div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-parallax="art" src="/art/bleed-780.webp" srcSet="/art/bleed-780.webp 780w, /art/bleed-1280.webp 1280w" sizes="(min-width: 1024px) 760px, 92vw" width={780} height={407} alt={tx("watercolorOfAfyonkarahisarKalesiAnd_d15f1")} fetchPriority="high" className="relative z-10 -mx-2 mt-1 w-[calc(100%+1rem)] max-w-none lg:pointer-events-none lg:absolute lg:-right-6 lg:top-4 lg:z-0 lg:m-0 lg:w-[62%]" />
      </section>
      <div data-enter="2" className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-2 lg:px-4"><div className="lg:order-2"><Announcements /></div><WeatherCard /></div>
      <h2 data-enter="3" className="mx-5 mt-8 font-display text-xl font-semibold lg:mx-9 lg:mt-14 lg:text-[32px]">{tx("afyonkarahisarRoutes_3f077")}</h2>
      <div data-motion-list data-lenis-prevent className="mt-4 flex gap-3 overflow-x-auto px-5 pb-4 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-9">
        {local.map((r) => (
          <Link key={r.slug} href={`/rotalar/${r.slug}`} className="flex w-[236px] shrink-0 flex-col lg:w-auto rounded-[28px] border border-line bg-white shadow-card p-2.5">
            <PhotoSlot id={routeCover[r.slug]} label={false} className="h-[150px] rounded-[20px] lg:h-[190px]" />
            <div className="mt-3 flex flex-1 flex-col gap-1.5"><CategoryChip r={r} />
              <p className="font-display text-[17px] font-semibold leading-tight">{r.title}</p>
              <p className="mt-auto text-xs font-semibold text-mute">{routeMetaLine(r, locale)}</p></div>
          </Link>
        ))}
      </div>
      <div className="lg:mx-9 lg:mt-6 lg:mb-16 lg:grid lg:grid-cols-2 lg:gap-5 [&>a]:lg:mx-0">
      <Link data-reveal href="/harita" className="glass mx-5 mt-4 flex h-16 items-center justify-between rounded-3xl px-5 font-bold text-navy"><span>{tx("exploreOnTheMap_e2d09")} <span className="block text-[11px] font-semibold text-mute">{tx("stopsAndYourLiveLocation_91489")}</span></span><span aria-hidden className="text-xl text-terra">›</span></Link>
      <Link data-reveal href="/qr" className="terra-grad mx-5 mt-4 flex h-16 items-center justify-center rounded-3xl font-bold text-white">{tx("startARouteWithQr_8ea80")}</Link>
      </div>
    </MotionProvider>
  );
}
