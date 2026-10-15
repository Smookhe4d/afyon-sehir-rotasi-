import {getContent} from "@/lib/content";

import {getTranslations as getUiTranslations} from "next-intl/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/PageHeader";
import SignInPrompt from "@/components/SignInPrompt";
import ProfileName from "@/components/ProfileName";
import ProfileBanner from "@/components/ProfileBanner";
import { cookies } from "next/headers";
import {earnedBadges} from "@/lib/badges";

import { getSession } from "@/lib/session";
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {badgeDefs, getRoute} = getContent((await params).locale);

  const {locale} = await params;
  return pageMetadata(locale, "/profil", pageTitle(locale, "profile"));
}
export const dynamic = "force-dynamic";

export default async function Profil({ params }: { params: Promise<{locale: Locale}> }) {
  const num = new Intl.NumberFormat((await params).locale).format;

  const {badgeDefs, getRoute} = getContent((await params).locale);

  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  const { supabase, user, profile } = await getSession();
  if (!user) return (<main><PageHeader eyebrow={tx("myAccount_858f8")} title={tx("profile_669fe")} /><SignInPrompt title={tx("saveYourProgress_bbb83")} text={tx("signInToSaveYour_cee23")} /><div className="px-5"><LanguageSwitcher /></div></main>);
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
  const adminRes = await supabase.rpc("is_admin");
  const isAdmin = adminRes.data === true;
  const guest = profile?.is_guest ?? false;
  const name = profile?.display_name ?? tx("traveler_c4a46");

  return (
    <main>
      <ProfileBanner initial={(await cookies()).get("afyon-tema")?.value ?? "gece"} />
      <div className="relative z-10 -mt-10 px-5">
        <span className="terra-grad flex h-[84px] w-[84px] items-center justify-center rounded-full border-4 border-cream font-display text-[34px] font-semibold text-white" aria-hidden>{name.charAt(0).toLocaleUpperCase("tr")}</span>
        <div className="mt-2"><ProfileName name={name} /></div>
        <p className="text-[12.5px] text-mute">{guest ? tx("guestAccount_8b6de") : user.email}</p>
        {guest && <p className="mt-3 rounded-2xl bg-sand px-4 py-3 text-sm text-ink-2">{tx("asAGuestYouCan_a77cd")}<Link href="/giris" className="ml-1 font-bold text-terra" prefetch={false}>{tx("createAnAccount_45824")}</Link></p>}

        <dl className="mt-5 grid grid-cols-3 rounded-[22px] border border-line bg-white shadow-card py-3 text-center">
          {[[tx("completed_90c01"), completed.length], [tx("stopsVisited_9a956"), stops], [tx("badge_50b94"), earned.size]].map(([k, v]) => (
            <div key={k as string}><dd className="font-display text-[22px] font-semibold leading-none">{typeof v === "number" ? num(v) : v}</dd><dt className="mt-1 text-[11px] font-semibold text-mute">{k}</dt></div>
          ))}
        </dl>

        <Link href="/qr" className="mt-4 flex h-16 items-center gap-3 rounded-3xl bg-gradient-to-br from-navy-2 to-navy px-4 text-white shadow-lg">
          <span className="terra-grad flex h-11 w-11 items-center justify-center rounded-full"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 5a2 2 0 0 1 2-2h3v5H3zM16 3h3a2 2 0 0 1 2 2v3h-5zM3 16h5v5H5a2 2 0 0 1-2-2zM21 16h-3a2 2 0 0 0-2 2v3M12 7v3a2 2 0 0 1-2 2H7" /></svg></span>
          <span><span className="block font-display text-base font-semibold">{tx("startARouteWithQr_8ea80")}</span><span className="text-xs opacity-80">{tx("scanACodeAtA_e2b46")}</span></span>
        </Link>

        <h2 className="mt-7 font-display text-xl font-semibold">{tx("badges_6c1b9")}</h2>
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {badgeDefs.map((b) => { const on = earned.has(b.id); return (
            <li key={b.id} className="text-center" title={b.hint}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.icon} alt="" width={64} height={64} className={`mx-auto h-16 w-16 ${on ? "" : "opacity-40 grayscale"}`} />
              <p className={`mt-1 text-[11px] font-semibold ${on ? "" : "text-mute"}`}>{b.label}</p><p className="text-[10px] leading-tight text-mute">{on ? tx("earned_07ca2") : b.hint}</p>
            </li>); })}
        </ul>

        {ongoing.length > 0 && <><h2 className="mt-7 font-display text-xl font-semibold">{tx("routesInProgress_2d246")}</h2>
          <ul className="mt-3 flex flex-col gap-2.5">{ongoing.map((p) => { const r = getRoute(p.route_slug); if (!r) return null; const total = new Set(r.stops.map((s) => s.placeId)).size; return (
            <li key={p.route_slug}><Link href={`/rotalar/${r.slug}`} className="block rounded-2xl border border-line bg-white shadow-card p-3.5">
              <div className="flex justify-between text-xs font-bold"><span className="text-terra">{tx("inProgress_f029b")}</span><span>{p.visited_place_ids.length} / {num(total)}  {tx("stops_d5083")}</span></div>
              <p className="mt-1 font-display font-semibold leading-tight">{r.title}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand"><div className="terra-grad h-full rounded-full" style={{ width: `${(p.visited_place_ids.length / total) * 100}%` }} /></div></Link></li>); })}</ul></>}

        <h2 className="mt-7 font-display text-xl font-semibold">{tx("favoriteRoutes_acb4c")}</h2>
        {(favs.data ?? []).length === 0 ? <p className="mt-2 text-sm text-mute">{tx("noFavoriteRoutesYet_468a7")}</p> : (
          <ul className="mt-3 flex flex-col gap-2">{(favs.data ?? []).map((f) => { const r = getRoute(f.route_slug); return r ? <li key={f.route_slug}><Link href={`/rotalar/${r.slug}`} className="block rounded-2xl border border-line bg-white shadow-card px-4 py-3 text-sm font-bold">{r.title}</Link></li> : null; })}</ul>
        )}

        <nav aria-label={tx("more_861fe")} className="mt-8 flex flex-col gap-2">
          {[["/geri-bildirim", tx("suggestionsContributionsAndComplaints_bedd0")], ["/hakkinda", tx("about_12a5d")], ["/gizlilik", tx("privacy_9e93e")], ["/sartlar", tx("termsOfUse_8a73f")], ...(isAdmin ? [["/yonetim", tx("adminPanel_5d22e")]] : [])].map(([h, l]) => (
            <Link key={h} href={h} className="flex h-12 items-center justify-between rounded-2xl border border-line bg-white px-4 text-sm font-bold shadow-card">{l}<span className="text-terra" aria-hidden>›</span></Link>
          ))}
        </nav>
        <form action="/auth/cikis" method="post" className="mt-8"><input type="hidden" name="locale" value={(await params).locale} /><button className="h-12 w-full rounded-full border border-line bg-white shadow-card text-sm font-bold">{tx("signOut_8d1ab")}</button></form>
        <LanguageSwitcher />
      </div>
    </main>
  );
}
