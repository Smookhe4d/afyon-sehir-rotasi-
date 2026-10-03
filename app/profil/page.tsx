import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SignInPrompt from "@/components/SignInPrompt";
import ProfileName from "@/components/ProfileName";
import { badgeDefs, earnedBadges } from "@/lib/badges";
import { getRoute } from "@/lib/routes";
import { getSession } from "@/lib/session";
export const metadata = { title: "Profil" };
export const dynamic = "force-dynamic";

export default async function Profil() {
  const { supabase, user, profile } = await getSession();
  if (!user) return (<main><PageHeader eyebrow="HESABIM" title="Profil" /><SignInPrompt title="İlerlemenizi kaydedin" text="Giriş yaparak favori rotalarınızı, ziyaret ettiğiniz durakları ve rozetlerinizi saklayın." /></main>);
  const [prog, favs, photo] = await Promise.all([
    supabase.from("route_progress").select("route_slug, visited_place_ids, completed_at").eq("user_id", user.id),
    supabase.from("favorites").select("route_slug").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", user.id).not("photo_path", "is", null),
  ]);
  const progress = prog.data ?? [];
  const completed = progress.filter((p) => p.completed_at).map((p) => p.route_slug);
  const ongoing = progress.filter((p) => !p.completed_at);
  const stops = progress.reduce((n, p) => n + p.visited_place_ids.length, 0);
  const earned = earnedBadges({ started: progress.map((p) => p.route_slug), completed, hasPhotoPost: (photo.count ?? 0) > 0 });
  const guest = profile?.is_guest ?? false;
  const name = profile?.display_name ?? "Gezgin";

  return (
    <main>
      <section className="h-40 bg-gradient-to-b from-navy to-[#B0586B]" />
      <div className="-mt-10 px-5">
        <span className="terra-grad flex h-[84px] w-[84px] items-center justify-center rounded-full border-4 border-cream font-display text-[34px] font-semibold text-white" aria-hidden>{name.charAt(0).toLocaleUpperCase("tr")}</span>
        <div className="mt-2"><ProfileName name={name} /></div>
        <p className="text-[12.5px] text-mute">{guest ? "Misafir hesabı" : user.email}</p>
        {guest && <p className="mt-3 rounded-2xl bg-sand px-4 py-3 text-sm text-ink-2">Misafir olarak rota gezebilir, favori ekleyebilirsiniz. Paylaşım ve yorum için hesap oluşturun.<Link href="/giris" className="ml-1 font-bold text-terra" prefetch={false}>Kayıt ol</Link></p>}

        <dl className="mt-5 grid grid-cols-3 rounded-[22px] border border-line bg-white shadow-card py-3 text-center">
          {[["Tamamlanan", completed.length], ["Ziyaret edilen durak", stops], ["Rozet", earned.size]].map(([k, v]) => (
            <div key={k as string}><dd className="font-display text-[22px] font-semibold leading-none">{v}</dd><dt className="mt-1 text-[11px] font-semibold text-mute">{k}</dt></div>
          ))}
        </dl>

        <Link href="/qr" className="mt-4 flex h-16 items-center gap-3 rounded-3xl bg-gradient-to-br from-navy-2 to-navy px-4 text-white shadow-lg">
          <span className="terra-grad flex h-11 w-11 items-center justify-center rounded-full"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 5a2 2 0 0 1 2-2h3v5H3zM16 3h3a2 2 0 0 1 2 2v3h-5zM3 16h5v5H5a2 2 0 0 1-2-2zM21 16h-3a2 2 0 0 0-2 2v3M12 7v3a2 2 0 0 1-2 2H7" /></svg></span>
          <span><span className="block font-display text-base font-semibold">QR ile rota başlat</span><span className="text-xs opacity-80">Durakta kodu okut, rota açılsın</span></span>
        </Link>

        <h2 className="mt-7 font-display text-xl font-semibold">Rozetler</h2>
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {badgeDefs.map((b) => { const on = earned.has(b.id); return (
            <li key={b.id} className="text-center" title={b.hint}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.icon} alt="" width={64} height={64} className={`mx-auto h-16 w-16 ${on ? "" : "opacity-40 grayscale"}`} />
              <p className={`mt-1 text-[11px] font-semibold ${on ? "" : "text-mute"}`}>{b.label}</p><p className="text-[10px] leading-tight text-mute">{on ? "Kazanıldı" : b.hint}</p>
            </li>); })}
        </ul>

        {ongoing.length > 0 && <><h2 className="mt-7 font-display text-xl font-semibold">Devam eden rotalar</h2>
          <ul className="mt-3 flex flex-col gap-2.5">{ongoing.map((p) => { const r = getRoute(p.route_slug); if (!r) return null; const total = new Set(r.stops.map((s) => s.placeId)).size; return (
            <li key={p.route_slug}><Link href={`/rotalar/${r.slug}`} className="block rounded-2xl border border-line bg-white shadow-card p-3.5">
              <div className="flex justify-between text-xs font-bold"><span className="text-terra">DEVAM EDEN</span><span>{p.visited_place_ids.length} / {total} durak</span></div>
              <p className="mt-1 font-display font-semibold leading-tight">{r.title}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand"><div className="terra-grad h-full rounded-full" style={{ width: `${(p.visited_place_ids.length / total) * 100}%` }} /></div></Link></li>); })}</ul></>}

        <h2 className="mt-7 font-display text-xl font-semibold">Favori rotalar</h2>
        {(favs.data ?? []).length === 0 ? <p className="mt-2 text-sm text-mute">Henüz favori rota yok.</p> : (
          <ul className="mt-3 flex flex-col gap-2">{(favs.data ?? []).map((f) => { const r = getRoute(f.route_slug); return r ? <li key={f.route_slug}><Link href={`/rotalar/${r.slug}`} className="block rounded-2xl border border-line bg-white shadow-card px-4 py-3 text-sm font-bold">{r.title}</Link></li> : null; })}</ul>
        )}

        <form action="/auth/cikis" method="post" className="mt-8"><button className="h-12 w-full rounded-full border border-line bg-white shadow-card text-sm font-bold">Çıkış yap</button></form>
      </div>
    </main>
  );
}
