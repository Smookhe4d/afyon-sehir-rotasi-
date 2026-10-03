import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryChip, routeMetaLine } from "@/components/RouteMeta";
import { FavoriteButton, ShareButton, StopChecklist } from "@/components/route/RouteControls";
import Comments, { type CommentRow } from "@/components/route/Comments";
import { routes, getRoute, routeStops, modeLabels, difficultyLabels } from "@/lib/routes";
import MapView from "@/components/map/LazyMap";
import { placesFull } from "@/lib/placesFull";
import { mapStopsForRoute } from "@/lib/map/data";
import { getSession } from "@/lib/session";

export function generateStaticParams() { return routes.map((r) => ({ slug: r.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRoute(slug);
  return r ? { title: r.title, description: r.summary } : {};
}

export default async function RotaDetay({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRoute(slug);
  if (!r) notFound();
  const stops = routeStops(r);
  const geo = mapStopsForRoute(slug);
  const { supabase, user, profile } = await getSession();
  const noRow = Promise.resolve({ data: null as { visited_place_ids?: string[]; route_slug?: string } | null });
  const [fav, progress, comments] = await Promise.all([
    user ? supabase.from("favorites").select("route_slug").eq("user_id", user.id).eq("route_slug", slug).maybeSingle() : noRow,
    user ? supabase.from("route_progress").select("visited_place_ids").eq("user_id", user.id).eq("route_slug", slug).maybeSingle() : noRow,
    supabase.from("comments").select("id, body, created_at, user_id, profiles(display_name)").eq("route_slug", slug).order("created_at", { ascending: false }).limit(50),
  ]);
  const rows: CommentRow[] = (comments.data ?? []).map((c) => {
    const p = c.profiles as unknown as { display_name: string } | { display_name: string }[] | null;
    const name = Array.isArray(p) ? p[0]?.display_name : p?.display_name;
    return { id: c.id, body: c.body, created_at: c.created_at, user_id: c.user_id, author: name ?? "Gezgin" };
  });

  const jsonLd = {
    "@context": "https://schema.org", "@type": "TouristTrip", name: r.title, description: r.summary, touristType: "Kültür turizmi",
    itinerary: { "@type": "ItemList", itemListElement: stops.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.place.name })) },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative h-[240px] overflow-hidden bg-navy px-5 pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/hero-kale.svg" alt="" className="absolute inset-0 h-full w-full object-cover object-[40%_50%]" />
        <div className="relative">
        <div className="flex items-center justify-between">
          <Link href="/rotalar" aria-label="Geri" className="glass-dark inline-flex h-11 w-11 items-center justify-center rounded-full text-white">‹</Link>
          <div className="flex gap-2"><ShareButton title={r.title} slug={slug} /><FavoriteButton slug={slug} initial={Boolean(fav.data)} signedIn={Boolean(user)} /></div>
        </div>
        </div>
      </section>
      <article className="relative -mt-8 rounded-t-[34px] bg-cream px-5 pt-5">
        <CategoryChip r={r} />
        <h1 className="mt-2 font-display text-[25px] font-semibold leading-tight">{r.title}</h1>
        <p className="mt-1.5 text-xs font-semibold text-mute">{routeMetaLine(r)}{r.provinces ? ` · ${r.provinces.join(", ")}` : ""}</p>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-2">{r.description.map((p, i) => <p key={i}>{p}</p>)}</div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {r.distanceKm && <div className="rounded-2xl border border-line bg-white/70 shadow-card p-3"><dt className="text-[11px] font-semibold text-mute">Uzunluk</dt><dd className="font-display text-lg font-semibold">{r.distanceKm} km</dd>{r.distanceNote && <dd className="text-[11px] text-mute">{r.distanceNote}</dd>}</div>}
          {r.modes && <div className="rounded-2xl border border-line bg-white/70 shadow-card p-3"><dt className="text-[11px] font-semibold text-mute">Yapılabilirlik</dt><dd className="font-semibold">{r.modes.map((m) => modeLabels[m]).join(" · ")}</dd></div>}
          {r.difficulty && <div className="col-span-2 rounded-2xl border border-line bg-white/70 shadow-card p-3"><dt className="text-[11px] font-semibold text-mute">Zorluk</dt><dd className="font-semibold">{difficultyLabels[r.difficulty]}</dd>{r.difficultyNote && <dd className="mt-0.5 text-xs text-ink-2">{r.difficultyNote}</dd>}</div>}
          {(r.difficulty === "orta" || r.difficulty === "zor") && <div className="col-span-2 rounded-2xl bg-[#FBE9D8] p-3 text-xs font-medium leading-relaxed text-[#7A3A14]">Güvenlik: Hava ve patika durumunu kontrol edin, yeterli su ve uygun ayakkabı alın, mümkünse yalnız çıkmayın. Acil durumda 112.</div>}
        </dl>

        {geo.stops.length > 0 && (
          <section aria-label="Harita" className="mt-7">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-xl font-semibold">Haritada</h2>
              <Link href={`/harita?rota=${slug}`} className="text-xs font-bold text-terra">Tam ekran harita ›</Link>
            </div>
            <div className="mt-2 h-[360px] overflow-hidden rounded-3xl border border-line">
              <MapView stops={geo.stops} line={geo.line} className="h-full w-full" />
            </div>
            {geo.missing.length > 0 && <p className="mt-1.5 text-[11px] text-mute">Haritada gösterilemeyen duraklar (konum doğrulanıyor): {geo.missing.join(", ")}.</p>}
          </section>
        )}

        <StopChecklist slug={slug} stops={stops.map((s) => ({ ...s, hasMap: Boolean(placesFull[s.placeId]?.coords) }))} started={Boolean(progress.data)} visited={progress.data?.visited_place_ids ?? []} signedIn={Boolean(user)} mode={r.modes?.includes("yuruyus") ? "yuruyus" : r.modes?.[0] ?? "arac"} />

        {r.tips && <><h2 className="mt-7 font-display text-xl font-semibold">İpuçları</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2">{r.tips.map((t) => <li key={t}>{t}</li>)}</ul></>}
        <Comments slug={slug} rows={rows} userId={user?.id ?? ""} canWrite={Boolean(profile && !profile.is_guest)} />
        {r.source && <p className="mt-6 text-[11px] text-mute">Kaynak: {r.source}</p>}
      </article>
    </main>
  );
}
