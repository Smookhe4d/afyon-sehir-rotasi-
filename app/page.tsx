import Link from "next/link";
import PhotoSlot from "@/components/PhotoSlot";
import { CategoryChip, routeMetaLine } from "@/components/RouteMeta";
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
    <main>
      <section className="relative z-10 h-[316px] bg-navy px-5 pt-4 text-white">
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/hero-kale.svg" alt="" className="absolute inset-0 h-full w-full object-cover object-[40%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08122c]/70 via-[#08122c]/20 to-transparent" />
      </div>
        <SearchBox items={searchItems} />
        <div className="relative mt-5">
        <p className="text-[10.5px] font-bold tracking-[2px] opacity-90">AFYONKARAHİSAR</p>
        <h1 className="mt-1.5 font-display text-[46px] font-semibold leading-none tracking-tight">Keşfet</h1>
        <p className="mt-2 max-w-[280px] text-sm opacity-90">Frig vadilerinden Ulu Cami'ye, Afyonkarahisar'ın {routes.length} önerilen tur rotası.</p>
        </div>
      </section>
      <WeatherCard />
      <h2 className="mx-5 mt-8 font-display text-xl font-semibold">Afyonkarahisar rotaları</h2>
      <div className="stagger mt-4 flex gap-3 overflow-x-auto px-5 pb-4">
        {local.map((r) => (
          <Link key={r.slug} href={`/rotalar/${r.slug}`} className="flex w-[236px] shrink-0 flex-col rounded-[28px] border border-line bg-white shadow-card p-2.5">
            <PhotoSlot id={routeCover[r.slug]} label={false} className="h-[150px] rounded-[20px]" />
            <div className="mt-3 flex flex-1 flex-col gap-1.5"><CategoryChip r={r} />
              <p className="font-display text-[17px] font-semibold leading-tight">{r.title}</p>
              <p className="mt-auto text-xs font-semibold text-mute">{routeMetaLine(r)}</p></div>
          </Link>
        ))}
      </div>
      <Link href="/harita" className="glass mx-5 mt-4 flex h-16 items-center justify-between rounded-3xl px-5 font-bold text-navy"><span>Haritada keşfet <span className="block text-[11px] font-semibold text-mute">Duraklar ve canlı konumunuz</span></span><span aria-hidden className="text-xl text-terra">›</span></Link>
      <Link href="/qr" className="terra-grad mx-5 mt-4 flex h-16 items-center justify-center rounded-3xl font-bold text-white">QR ile rota başlat</Link>
    </main>
  );
}
