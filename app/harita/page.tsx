import Link from "next/link";
import MapView from "@/components/map/MapView";
import { allMapStops, mapStopsForIds, mapStopsForRoute, routeOptions } from "@/lib/map/data";

export const metadata = { title: "Harita" };

export default async function Harita({ searchParams }: { searchParams: Promise<{ rota?: string; durak?: string; duraklar?: string }> }) {
  const { rota, durak, duraklar } = await searchParams;
  const custom = duraklar ? mapStopsForIds(duraklar.split(",").slice(0, 30)) : null;
  const opt = custom ? undefined : routeOptions.find((r) => r.slug === rota);
  const data = custom && custom.stops.length ? custom : opt ? mapStopsForRoute(opt.slug) : null;
  const stops = data ? data.stops : allMapStops();
  const chip = "shrink-0 rounded-full px-3.5 py-2 text-xs font-bold";
  return (
    <main className="relative h-dvh">
      <MapView key={custom ? `ozel-${duraklar}` : opt?.slug ?? "tum"} stops={stops} line={data?.line} title={custom?.stops.length ? "Rotam" : opt ? opt.title : "Tüm duraklar"} initialStopId={durak} bottomInset={108} className="h-full w-full" />
      <nav aria-label="Rota seçimi" className="absolute inset-x-0 top-[68px] z-10 flex gap-2 overflow-x-auto pl-3 pr-[68px] pb-1 [scrollbar-width:none]">
        <Link href="/harita" className={`${chip} ${!opt && !custom ? "terra-grad text-white" : "glass text-navy"}`}>Tümü</Link>
        {routeOptions.map((r) => (
          <Link key={r.slug} href={`/harita?rota=${r.slug}`} className={`${chip} whitespace-nowrap ${opt?.slug === r.slug ? "terra-grad text-white" : "glass text-navy"}`}>{r.title}</Link>
        ))}
      </nav>
    </main>
  );
}
