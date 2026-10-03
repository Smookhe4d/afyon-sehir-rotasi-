import Link from "next/link";
import { notFound } from "next/navigation";
import AudioGuide from "@/components/AudioGuide";
import BackButton from "@/components/BackButton";
import PhotoSlot from "@/components/PhotoSlot";
import MapView from "@/components/map/MapView";
import { placeListFull, placesFull as places } from "@/lib/placesFull";
import { routes } from "@/lib/routes";

export function generateStaticParams() { return placeListFull.map((p) => ({ id: p.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const p = places[id];
  return p ? { title: p.name, description: p.about?.[0] ?? p.note } : {};
}

export default async function Durak({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = places[id];
  if (!p) notFound();
  const inRoutes = routes.filter((r) => r.stops.some((s) => s.placeId === id));
  return (
    <main className="pb-36">
      <section className="relative">
        <PhotoSlot id={id} className="h-[230px] w-full" credit />
        <BackButton className="glass-dark absolute left-4 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full text-white" />
      </section>
      <article className="relative -mt-7 rounded-t-[34px] bg-cream px-5 pt-5">
        <p className="text-xs font-bold text-terra">{p.area}</p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight">{p.name}</h1>

        <AudioGuide title={p.name} text={(p.about?.length ? p.about : p.note ? [p.note] : []).join(" ")} />

        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-2">
          {p.about?.length ? p.about.map((t, i) => <p key={i}>{t}</p>) : p.note && <p>{p.note}</p>}
        </div>

        {p.facts && p.facts.length > 0 && (
          <dl className="mt-5 grid grid-cols-1 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white/80 text-sm">
            {p.facts.map((f) => (
              <div key={f.label} className="flex gap-3 px-4 py-2.5"><dt className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-wide text-mute">{f.label}</dt><dd className="font-medium text-navy">{f.value}</dd></div>
            ))}
          </dl>
        )}

        {p.visitTips && p.visitTips.length > 0 && (
          <><h2 className="mt-6 font-display text-xl font-semibold">Ziyaret ipuçları</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-2">{p.visitTips.map((t) => <li key={t}>{t}</li>)}</ul></>
        )}

        <h2 className="mt-6 font-display text-xl font-semibold">Haritada</h2>
        {p.coords ? (
          <>
            <div className="mt-2 h-[280px] overflow-hidden rounded-3xl border border-line">
              <MapView stops={[{ id: p.id, name: p.name, area: p.area, coords: p.coords, approx: p.precision !== "exact", index: 1 }]} className="h-full w-full" />
            </div>
          </>
        ) : <p className="mt-2 rounded-2xl border border-line bg-white/70 p-3 text-sm text-ink-2">Bu durağın konumu henüz doğrulanmadı; doğrulandığında haritada görünecek.</p>}

        {inRoutes.length > 0 && (
          <><h2 className="mt-6 font-display text-xl font-semibold">Bu durağın yer aldığı rotalar</h2>
          <ul className="mt-2 flex flex-col gap-2">{inRoutes.map((r) => <li key={r.slug}><Link href={`/rotalar/${r.slug}`} className="block rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold">{r.title}</Link></li>)}</ul></>
        )}

        {p.sources && p.sources.length > 0 && (
          <><h2 className="mt-6 font-display text-base font-semibold">Kaynaklar</h2>
          <ul className="mt-1.5 space-y-1 text-[12px] text-mute">{p.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2">{s.title}</a></li>)}</ul></>
        )}
      </article>
    </main>
  );
}
