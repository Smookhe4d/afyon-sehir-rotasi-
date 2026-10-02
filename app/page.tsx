import Link from "next/link";
import PhotoSlot from "@/components/PhotoSlot";
import { CategoryChip, routeMetaLine } from "@/components/RouteMeta";
import { routes } from "@/lib/routes";

export default function Kesfet() {
  const local = routes.filter((r) => r.scope === "il-ici");
  return (
    <main>
      <section className="relative h-[316px] overflow-hidden bg-navy px-5 pt-8 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/hero-kale.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08122c]/50 to-transparent" />
        <div className="relative">
        <p className="text-[10.5px] font-bold tracking-[2px] opacity-90">AFYONKARAHİSAR</p>
        <h1 className="mt-1.5 font-display text-[46px] font-semibold leading-none tracking-tight">Keşfet</h1>
        <p className="mt-2 max-w-[280px] text-sm opacity-90">Frig vadilerinden Ulu Cami'ye, Afyonkarahisar'ın {routes.length} önerilen tur rotası.</p>
        </div>
      </section>
      <Link href="/rotalar" className="glass relative z-10 mx-5 -mt-7 flex h-[52px] items-center rounded-full px-5 text-sm text-ink-2">Rota veya mekân ara</Link>
      <h2 className="mx-5 mt-8 font-display text-xl font-semibold">Afyonkarahisar rotaları</h2>
      <div className="mt-4 flex gap-3 overflow-x-auto px-5 pb-2">
        {local.map((r) => (
          <Link key={r.slug} href={`/rotalar/${r.slug}`} className="flex w-[236px] shrink-0 flex-col rounded-[28px] border border-line bg-white p-2.5 shadow-sm">
            <PhotoSlot className="h-[150px] rounded-[20px]" />
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
