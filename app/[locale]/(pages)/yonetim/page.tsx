import {getContent} from "@/lib/content";

import {getTranslations as getUiTranslations} from "next-intl/server";

import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {pageMetadata, pageTitle} from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/PageHeader";
import SignInPrompt from "@/components/SignInPrompt";
import { AnnouncementsAdmin, FeedbackList, ReportedPosts, type AnnRow, type FeedbackRow, type ReportedRow } from "@/components/admin/AdminClient";
import { getRoute } from "@/lib/routes";
import { getSession } from "@/lib/session";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {places} = getContent((await params).locale);

  const {locale} = await params;
  return pageMetadata(locale, "/yonetim", pageTitle(locale, "admin"), undefined, {robots: {index: false}});
}
export const dynamic = "force-dynamic";

type Stats = { users: number; guests: number; posts: number; comments: number; favorites: number; started_routes: number; completed_routes: number; feedback_new: number; views_today: number; visitors_today: number; views_7d: number; visitors_7d: number; daily: { d: string; views: number; visitors: number }[]; top_pages: { path: string; views: number }[] };

function Note({ title, text }: { title: string; text: string }) {

  return <div className="glass mx-5 mt-6 rounded-[28px] p-6"><p className="font-display text-xl font-semibold">{title}</p><p className="mt-2 text-sm leading-relaxed text-ink-2">{text}</p></div>;
}

export default async function Yonetim({ params }: { params: Promise<{locale: Locale}> }) {
  const num = new Intl.NumberFormat((await params).locale).format;

  const {places} = getContent((await params).locale);

  const dx = await getUiTranslations({locale: (await params).locale, namespace: "dynamic"});
  const tx = await getUiTranslations({locale: (await params).locale, namespace: "ui"});

  setRequestLocale((await params).locale);
  const { supabase, user } = await getSession();
  const head = <PageHeader eyebrow={tx("siteAdministration_fe32f")} title={tx("administration_24ed2")} />;
  if (!user) return <main>{head}<SignInPrompt title={tx("administratorSignIn_7b04d")} text={tx("thisPageIsForSite_f48f4")} /></main>;
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) return <main>{head}<Note title={tx("setupRequired_47fa0")} text={tx("theAdministrationTablesHaveNot_12ba8")} /></main>;
  if (isAdmin !== true) return <main>{head}<Note title={tx("accessDenied_d0b86")} text={tx("yourAccountIsNotAn_12e62")} /></main>;

  const g = await getUiTranslations({locale: (await params).locale, namespace: "g027"});
  const [st, fb, an, ts, rp] = await Promise.all([
    supabase.rpc("admin_stats"),
    supabase.from("feedback").select("id, kind, place_id, message, contact, status, admin_note, created_at").order("created_at", { ascending: false }).limit(150),
    supabase.from("announcements").select("id, title, body, active").order("created_at", { ascending: false }).limit(30),
    supabase.rpc("admin_tour_stats"),
    supabase.from("post_reports").select("post_id, posts(id, body, photo_path, created_at, profiles(display_name))").order("created_at", { ascending: false }).limit(200),
  ]);
  type TS = { routes: { slug: string; started: number; finished: number; group: number; audio_start: number; audio_end: number; survey: number }[]; stops: { slug: string; stop: string; n: number; visitors: number }[] };
  const tstats = ts.data as TS | null;
  const reportedMap = new Map<string, ReportedRow>();
  for (const r of (rp.data ?? []) as unknown as { post_id: string; posts: { id: string; body: string; photo_path: string | null; created_at: string; profiles: { display_name: string } | null } | null }[]) {
    if (!r.posts) continue;
    const cur = reportedMap.get(r.post_id);
    if (cur) cur.count += 1;
    else reportedMap.set(r.post_id, { id: r.posts.id, body: r.posts.body, author: r.posts.profiles?.display_name ?? "", photo_path: r.posts.photo_path, created_at: r.posts.created_at, count: 1 });
  }
  const reported = [...reportedMap.values()].sort((a, b) => b.count - a.count);
  const s = st.data as Stats | null;
  const rows: FeedbackRow[] = (fb.data ?? []).map((r) => ({ ...r, place_name: r.place_id ? places[r.place_id]?.name ?? r.place_id : null }));
  const max = Math.max(1, ...(s?.daily ?? []).map((d) => d.views));
  const tile = (label: string, v: number | string | undefined) => (
    <div className="rounded-2xl border border-line bg-white p-3.5 shadow-card"><p className="text-[11px] font-semibold text-mute">{label}</p><p className="font-display text-[26px] font-semibold leading-tight">{typeof v === "number" ? num(v) : v ?? "–"}</p></div>
  );

  return (
    <main className="pb-10">
      {head}
      <div className="px-5">
        <h2 className="mt-4 font-display text-xl font-semibold">{tx("overview_915da")}</h2>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          {tile(tx("viewsToday_a164d"), s?.views_today)}{tile(tx("visitorsToday_f8c39"), s?.visitors_today)}
          {tile(tx("viewsOver7Days_b63b7"), s?.views_7d)}{tile(tx("visitorsOver7Days_d6e6e"), s?.visitors_7d)}
          {tile(tx("registeredUsers_57b87"), s?.users)}{tile(tx("guestAccounts_47720"), s?.guests)}
          {tile(tx("routesStarted_128ef"), s?.started_routes)}{tile(tx("routesCompleted_271a2"), s?.completed_routes)}
          {tile(tx("postsComments_f2a37"), s ? `${s.posts} / ${s.comments}` : undefined)}{tile(tx("favorites_53211"), s?.favorites)}
        </div>
        {s && s.daily.length > 0 && (
          <div className="mt-4 rounded-2xl border border-line bg-white p-3.5 shadow-card">
            <p className="text-xs font-bold text-mute">{tx("last14DaysPageViews_db7ae")}</p>
            <div className="mt-3 flex h-24 items-end gap-1" role="img" aria-label={tx("dailyPageViewsChart_829b9")}>
              {s.daily.map((d) => <div key={d.d} title={dx("chart", {date: d.d, views: d.views, visitors: d.visitors})} className="terra-grad min-w-0 flex-1 rounded-t" style={{ height: `${Math.max(4, (d.views / max) * 100)}%` }} />)}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-mute"><span>{s.daily[0].d.slice(5)}</span><span>{s.daily[s.daily.length - 1].d.slice(5)}</span></div>
          </div>
        )}
        {s && s.top_pages.length > 0 && (
          <div className="mt-3 rounded-2xl border border-line bg-white p-3.5 shadow-card">
            <p className="text-xs font-bold text-mute">{tx("mostViewedPages7Days_a6523")}</p>
            <ul className="mt-2 space-y-1">{s.top_pages.map((p) => <li key={p.path} className="flex justify-between gap-3 text-[13px]"><span className="truncate font-medium">{p.path}</span><b>{num(p.views)}</b></li>)}</ul>
          </div>
        )}
        {st.error && <p className="mt-3 rounded-2xl bg-[#FBE4DC] px-3.5 py-2.5 text-xs font-semibold text-[#8E2C12]">{tx("theOverviewCouldNotBe_ae8ee")}</p>}

        <h2 className="mt-8 font-display text-xl font-semibold">{g("tourRecords")}</h2>
        <p className="mt-1 text-xs text-mute">{g("tourRecordsNote")}</p>
        {ts.error ? <p className="mt-2 rounded-2xl bg-sand px-3.5 py-2.5 text-xs text-ink-2">{g("tourRecordsMissing")}</p> : (
          <>
            <div className="mt-2 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
              <table className="w-full min-w-[520px] text-left text-[12.5px]">
                <thead className="text-[11px] text-mute"><tr><th className="px-3 py-2">{g("colRoute")}</th><th className="px-2 py-2">{g("colStarted")}</th><th className="px-2 py-2">{g("colFinished")}</th><th className="px-2 py-2">{g("colGroup")}</th><th className="px-2 py-2">{g("colAudio")}</th><th className="px-2 py-2">{g("colSurvey")}</th></tr></thead>
                <tbody className="divide-y divide-line">{(tstats?.routes ?? []).map((r) => (
                  <tr key={r.slug}><td className="px-3 py-2 font-medium">{getRoute(r.slug)?.title ?? r.slug}</td><td className="px-2 py-2">{num(r.started)}</td><td className="px-2 py-2">{num(r.finished)}</td><td className="px-2 py-2">{num(r.group)}</td><td className="px-2 py-2">{num(r.audio_end)} / {num(r.audio_start)}</td><td className="px-2 py-2">{num(r.survey)}</td></tr>
                ))}</tbody>
              </table>
              {(tstats?.routes ?? []).length === 0 && <p className="px-3 py-4 text-center text-xs text-mute">{g("noRecords")}</p>}
            </div>
            {(tstats?.stops ?? []).length > 0 && (
              <div className="mt-3 rounded-2xl border border-line bg-white p-3.5 shadow-card">
                <p className="text-xs font-bold text-mute">{g("stopVisitors")}</p>
                <ul className="mt-2 space-y-1">{(tstats?.stops ?? []).filter((x) => x.slug === "merkez-kultur-rotasi").map((x) => <li key={x.stop} className="flex justify-between gap-3 text-[13px]"><span className="truncate">{x.n}. {places[x.stop]?.name ?? x.stop}</span><b>{num(x.visitors)}</b></li>)}</ul>
              </div>
            )}
            <a href="/api/yonetim/tur-kayitlari" className="mt-3 inline-flex h-11 items-center rounded-full bg-navy px-5 text-sm font-bold text-white">{g("downloadCsv")}</a>
          </>
        )}

        <h2 className="mt-8 font-display text-xl font-semibold">{g("reportedPosts")}</h2>
        <ReportedPosts rows={reported} />

        <h2 className="mt-8 font-display text-xl font-semibold">{tx("feedback_1b429")} {s ? <span className="text-sm font-medium text-mute">· {num(s.feedback_new)} yeni</span> : null}</h2>
        <FeedbackList rows={rows} />

        <h2 className="mt-8 font-display text-xl font-semibold">{tx("announcements_57f93")}</h2>
        <AnnouncementsAdmin rows={(an.data ?? []) as AnnRow[]} />

        <p className="mt-8 text-center text-xs text-mute"><Link href="/" className="underline">{tx("backToTheSite_b1493")}</Link></p>
      </div>
    </main>
  );
}
