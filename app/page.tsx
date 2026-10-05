import Link from "next/link";
import PhotoSlot from "@/components/PhotoSlot";
import { CategoryChip, routeMetaLine } from "@/components/RouteMeta";
import Announcements from "@/components/Announcements";
import WeatherCard from "@/components/WeatherCard";
import SearchBox, { type SearchItem } from "@/components/SearchBox";
import { placeListFull } from "@/lib/placesFull";
import { routeCover } from "@/lib/covers";
import { routes } from "@/lib/routes";

const searchItems: SearchItem[] = [
  ...routes.map((r) => ({ href: `/rotalar/${r.slug}`, label: r.title, sub: "Rota" })),
  ...placeListFull.map((p) => ({ href: `/duraklar/${p.id}`, label: p.name, sub: `Durak · ${p.area}` })),
];

export default function Kesfet() {
  const local = routes.filter((r) => r.scope === "il-ici");
  return (
    <main className="wide">
      <section className="relative z-10 px-5 pt-4 lg:mx-4 lg:mt-2 lg:min-h-[500px] lg:px-14 lg:pt-12">
        <div className="relative z-20 lg:max-w-[560px]"><SearchBox items={searchItems} /></div>
        <div className="relative z-20 mt-5 lg:mt-14">
          <p className="text-[10.5px] font-bold tracking-[2px] text-terra lg:text-xs lg:tracking-[4px]">AFYONKARAHİSAR</p>
          <h1 className="mt-1 font-display text-[44px] font-semibold leading-none tracking-tight text-navy lg:mt-3 lg:text-[88px]">Keşfet</h1>
          <p className="mt-2 max-w-[300px] text-sm text-ink-2 lg:mt-4 lg:max-w-[440px] lg:text-lg lg:leading-relaxed">Frig vadilerinden Ulu Cami'ye, Afyonkarahisar'ın {routes.length} önerilen tur rotası.</p>
          <div className="mt-8 hidden gap-3 lg:flex"><Link href="/rotalar" className="terra-grad rounded-full px-7 py-3.5 font-bold text-white">Rotaları keşfet</Link><Link href="/harita" className="rounded-full border border-navy/15 bg-white/80 px-7 py-3.5 font-bold text-navy shadow-card backdrop-blur">Haritayı aç</Link></div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/bleed-780.webp" srcSet="/art/bleed-780.webp 780w, /art/bleed-1280.webp 1280w" sizes="(min-width: 1024px) 760px, 92vw" width={780} height={407} alt="Afyonkarahisar Kalesi ve eski şehir, suluboya" fetchPriority="high" className="relative z-10 -mx-2 mt-1 w-[calc(100%+1rem)] max-w-none lg:pointer-events-none lg:absolute lg:-right-6 lg:top-4 lg:z-0 lg:m-0 lg:w-[62%]" />
      </section>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-2 lg:px-4"><div className="lg:order-2"><Announcements /></div><WeatherCard /></div>
      <h2 className="mx-5 mt-8 font-display text-xl font-semibold lg:mx-9 lg:mt-14 lg:text-[32px]">Afyonkarahisar rotaları</h2>
      <div className="stagger mt-4 flex gap-3 overflow-x-auto px-5 pb-4 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-9">
        {local.map((r) => (
          <Link key={r.slug} href={`/rotalar/${r.slug}`} className="flex w-[236px] shrink-0 flex-col lg:w-auto rounded-[28px] border border-line bg-white shadow-card p-2.5">
            <PhotoSlot id={routeCover[r.slug]} label={false} className="h-[150px] rounded-[20px] lg:h-[190px]" />
            <div className="mt-3 flex flex-1 flex-col gap-1.5"><CategoryChip r={r} />
              <p className="font-display text-[17px] font-semibold leading-tight">{r.title}</p>
              <p className="mt-auto text-xs font-semibold text-mute">{routeMetaLine(r)}</p></div>
          </Link>
        ))}
      </div>
      <div className="lg:mx-9 lg:mt-6 lg:mb-16 lg:grid lg:grid-cols-2 lg:gap-5 [&>a]:lg:mx-0">
      <Link href="/harita" className="glass mx-5 mt-4 flex h-16 items-center justify-between rounded-3xl px-5 font-bold text-navy"><span>Haritada keşfet <span className="block text-[11px] font-semibold text-mute">Duraklar ve canlı konumunuz</span></span><span aria-hidden className="text-xl text-terra">›</span></Link>
      <Link href="/qr" className="terra-grad mx-5 mt-4 flex h-16 items-center justify-center rounded-3xl font-bold text-white">QR ile rota başlat</Link>
      </div>
    </main>
  );
}
