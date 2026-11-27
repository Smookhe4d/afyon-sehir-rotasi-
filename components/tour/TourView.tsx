"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import MapView from "@/components/map/LazyMap";
import type { MapStop } from "@/components/map/RouteMap";
import { startRoute } from "@/app/actions";
import { formatDistance } from "@/lib/map/geo";
import { formatDuration } from "@/lib/map/nav";

export type TourStop = { id: string; name: string; area: string; mapIdx: number; leg: [number, number] | null };
type Props = {
  slug: string; title: string; mode: string; grup?: string; lider: boolean; startId?: string;
  stops: TourStop[]; mapStops: MapStop[]; line?: [number, number][]; panels: ReactNode[]; serverVisited: string[];
  /** G-022: rota sonunda gösterilecek anket */ survey?: string;
};
type Saved = { i?: number; v?: string[] };

/** G-020: durak durak tur ekranı. Anlatım, fotoğraf ve bilgi kartı ile canlı yönlendirme aynı ekranda. */
export default function TourView({ slug, title, mode, grup, lider, startId, stops, mapStops, line, panels, serverVisited, survey }: Props) {
  const t = useTranslations("g020");
  const tx = useTranslations("ui");
  const tg = useTranslations("g022");
  const locale = useLocale() as "tr" | "en";
  const key = `afyon-tur-${slug}`;
  const total = stops.length;
  const member = Boolean(grup && !lider);

  const [idx, setIdx] = useState(() => Math.max(0, startId ? stops.findIndex((s) => s.id === startId) : 0));
  const [init, setInit] = useState(false);
  const [visited, setVisitedIds] = useState<Set<string>>(() => new Set(serverVisited));
  const [tab, setTab] = useState<"story" | "map">("story");
  const [listOpen, setListOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [arrived, setArrived] = useState<string | null>(null);
  const [leaderIdx, setLeaderIdx] = useState<number | null>(null);
  const followLeader = useRef(true);
  const [name, setName] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  // Açılış: kaldığı yer, yerel ve sunucudaki gezilen duraklar
  useEffect(() => {
    let saved: Saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) ?? "{}") as Saved; } catch { /* yok say */ }
    try { setName(localStorage.getItem("afyon-ad") ?? ""); } catch { setName(""); }
    const v = new Set([...serverVisited, ...(saved.v ?? [])].filter((id) => stops.some((s) => s.id === id)));
    setVisitedIds(v);
    if (!startId && !member) {
      if (typeof saved.i === "number" && saved.i > 0 && saved.i < total) { setIdx(saved.i); setResumed(true); }
      else { const first = stops.findIndex((s) => !v.has(s.id)); if (first > 0) { setIdx(first); setResumed(true); } }
    }
    setInit(true);
    if (grup) startRoute(slug).catch(() => {});
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!init) return;
    try { localStorage.setItem(key, JSON.stringify({ i: idx, v: [...visited] })); } catch { /* yok say */ }
  }, [init, idx, visited, key]);

  const go = useCallback((n: number, byUser = true) => {
    if (n < 0 || n >= total) return;
    setIdx(n); setArrived(null);
    if (byUser) setResumed(false);
    if (byUser && member) followLeader.current = leaderIdx === null || n === leaderIdx;
    scroller.current?.scrollTo({ top: 0 });
  }, [total, member, leaderIdx]);

  const onGroupStop = useCallback((n: number) => {
    if (n < 0 || n >= total) return;
    setLeaderIdx(n);
    if (followLeader.current) { setIdx(n); setArrived(null); scroller.current?.scrollTo({ top: 0 }); }
  }, [total]);

  const onArrive = useCallback((id: string) => {
    setArrived(id);
    setVisitedIds((v) => (v.has(id) ? v : new Set(v).add(id)));
  }, []);

  const next = () => { if (idx + 1 < total) go(idx + 1); else { setDone(true); try { localStorage.setItem(key, JSON.stringify({ v: [...visited] })); } catch { /* yok say */ } } };

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.key === "Escape") setListOpen(false);
      if (listOpen || done) return;
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
    };
    addEventListener("keydown", f); return () => removeEventListener("keydown", f);
  }, [go, idx, listOpen, done]);

  const cur = stops[idx];
  const after = stops[idx + 1];
  const visitedCount = useMemo(() => stops.filter((s) => visited.has(s.id)).length, [stops, visited]);
  const qs = `mod=${mode}${grup ? `&grup=${grup}` : ""}`;
  const needName = Boolean(grup) && name !== null && name.trim().length < 2;
  const showMap = name !== null && !needName && mapStops.length > 0;

  return (
    <div className="fixed inset-0 z-[65] flex flex-col bg-cream lg:top-16 lg:flex-row" role="region" aria-label={title}>
      <section className="flex min-h-0 flex-1 flex-col lg:w-[520px] lg:flex-none lg:border-r lg:border-line">
        {/* Üst bilgi */}
        <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))] lg:px-6 lg:pt-5">
          <div className="flex items-center gap-2">
            <Link href={`/rotalar/${slug}`} aria-label={t("close")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-navy shadow-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
            </Link>
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate text-[12px] font-semibold text-mute">{title}</p>
              <p className="font-display text-[17px] font-semibold leading-tight text-navy">{t("stopOf", { n: idx + 1, total })}</p>
            </div>
            <button type="button" onClick={() => setListOpen(true)} aria-label={t("stopsList")} aria-haspopup="dialog" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-navy shadow-card">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" /></svg>
            </button>
          </div>
          <ol className="mt-3 flex gap-1" aria-label={t("progress")}>
            {stops.map((s, i) => (
              <li key={s.id} className="flex-1">
                <button type="button" onClick={() => go(i)} aria-label={`${i + 1}. ${s.name}${visited.has(s.id) ? `, ${t("visited")}` : ""}`} aria-current={i === idx ? "step" : undefined}
                  className="flex h-4 w-full items-center">
                  <span className={`block h-1.5 w-full rounded-full ${i === idx ? "bg-ac" : visited.has(s.id) ? "bg-navy/60" : "bg-line"}`} />
                </button>
              </li>
            ))}
          </ol>
          {(arrived === cur.id || resumed || (member && leaderIdx !== null && leaderIdx !== idx)) && (
            <div className="mt-2 flex flex-wrap items-center gap-2" aria-live="polite">
              {arrived === cur.id && <p className="rounded-full bg-ok-soft px-3 py-1.5 text-[12px] font-bold text-ok">{t("arrived")}</p>}
              {resumed && arrived !== cur.id && <p className="flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-[12px] font-semibold text-ink-2">{t("resumed")}<button type="button" onClick={() => go(0)} className="rounded-full bg-white px-2.5 py-1 font-bold text-navy shadow-card">{t("restart")}</button></p>}
              {member && leaderIdx !== null && leaderIdx !== idx && <p className="flex items-center gap-2 rounded-full bg-ac-soft px-3 py-1 text-[12px] font-semibold text-ac">{t("guideAt", { n: leaderIdx + 1 })}<button type="button" onClick={() => { followLeader.current = true; go(leaderIdx, false); }} className="rounded-full bg-white px-2.5 py-1 font-bold text-ac shadow-card">{t("backToGuide")}</button></p>}
            </div>
          )}
          <div role="tablist" aria-label={t("view")} className="mt-3 flex rounded-full bg-sand p-1 lg:hidden">
            {(["story", "map"] as const).map((k) => (
              <button key={k} role="tab" type="button" aria-selected={tab === k} onClick={() => setTab(k)} className={`h-9 flex-1 rounded-full text-[13.5px] font-bold ${tab === k ? "bg-navy text-white" : "text-ink-2"}`}>{k === "story" ? t("tabStory") : t("tabMap")}</button>
            ))}
          </div>
        </header>

        {/* Anlatım ve harita */}
        <div className="relative mt-3 min-h-0 flex-1">
          <div ref={scroller} data-lenis-prevent className={`absolute inset-0 overflow-y-auto overscroll-contain px-4 pb-6 lg:px-6 ${tab === "map" ? "invisible lg:visible" : ""} ${init ? "" : "opacity-0"}`}>
            {visited.has(cur.id) && arrived !== cur.id && <p className="mb-2 inline-flex rounded-full bg-ok-soft px-3 py-1 text-[11.5px] font-bold text-ok">✓ {t("visited")}</p>}
            <div key={cur.id}>{panels[idx]}</div>
          </div>
          <div className={`absolute inset-0 lg:fixed lg:inset-auto lg:bottom-0 lg:left-[520px] lg:right-0 lg:top-16 ${tab === "story" ? "pointer-events-none invisible opacity-0 lg:pointer-events-auto lg:visible lg:opacity-100" : ""}`}>
            {showMap ? (
              <MapView stops={mapStops} line={line} guide embedded routeSlug={slug} travelMode={mode === "arac" || mode === "bisiklet" ? mode : "yuruyus"}
                cur={cur.mapIdx} onArrive={onArrive} grup={grup} lider={lider} groupCur={idx} onGroupStop={onGroupStop}
                inviteHref={`/rotalar/${slug}/tur?${qs}`} className="h-full w-full" />
            ) : <div className="skeleton h-full w-full" />}
            {cur.mapIdx < 0 && <p className="glass absolute left-3 right-[68px] top-3 z-20 rounded-2xl px-4 py-3 text-center text-[13px] font-semibold text-navy">{t("noMap")}</p>}
          </div>
        </div>

        {/* Alt: sıradaki durak ve geçiş */}
        <footer className="border-t border-line bg-cream px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:px-6 lg:pb-5">
          <p className="truncate text-[12.5px] font-semibold text-mute">
            {after ? <>{t("nextUp")}: <b className="text-navy">{after.name}</b>{after.leg ? ` · ${formatDistance(after.leg[0], locale)} · ${formatDuration(after.leg[1], locale)}` : ""}</> : t("lastStop")}
          </p>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label={t("prev")} className="flex h-12 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-white text-navy shadow-card disabled:opacity-40 lg:w-auto lg:px-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
              <span className="ml-1 hidden text-sm font-bold lg:inline">{t("prev")}</span>
            </button>
            {cur.mapIdx >= 0 && <button type="button" onClick={() => setTab("map")} className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-white text-sm font-bold text-navy shadow-card lg:hidden">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>{t("directions")}</button>}
            <button type="button" onClick={next} className="terra-grad flex h-12 flex-1 items-center justify-center gap-1 rounded-full text-sm font-bold text-white">
              {after ? t("next") : t("finish")}
              {after && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6" /></svg>}
            </button>
          </div>
        </footer>
      </section>

      {listOpen && (
        <div data-lenis-prevent className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/50 lg:items-center" role="dialog" aria-modal="true" aria-label={t("stopsList")} onClick={() => setListOpen(false)}>
          <div className="max-h-[80dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[32px] bg-cream p-5 pb-8 lg:rounded-[32px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-display text-xl font-semibold text-navy">{t("stopsList")}</p>
              <p className="text-[12px] font-semibold text-mute">{t("doneText", { visited: visitedCount, total })}</p>
            </div>
            <ol className="mt-3 flex flex-col gap-1.5">
              {stops.map((s, i) => (
                <li key={s.id}>
                  <button type="button" autoFocus={i === idx} onClick={() => { go(i); setListOpen(false); }} aria-current={i === idx ? "step" : undefined}
                    className={`flex min-h-[52px] w-full items-center gap-3 rounded-2xl px-3 py-2 text-left ${i === idx ? "bg-navy text-white" : "bg-white text-navy shadow-card"}`}>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${visited.has(s.id) ? "bg-ok-soft text-ok" : i === idx ? "bg-white/15" : "bg-sand"}`}>{visited.has(s.id) ? "✓" : i + 1}</span>
                    <span className="min-w-0 flex-1"><b className="block truncate text-[14.5px]">{s.name}</b><span className={`block truncate text-[12px] ${i === idx ? "text-white/75" : "text-mute"}`}>{s.area}</span></span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {done && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/50 p-6" role="dialog" aria-modal="true" aria-label={t("doneTitle")}>
          <div className="w-full max-w-[380px] rounded-[30px] bg-cream p-6 text-center">
            <p className="font-display text-2xl font-semibold text-navy">{t("doneTitle")}</p>
            <p className="mt-1.5 text-sm text-ink-2">{t("doneText", { visited: visitedCount, total })}</p>
            {survey && <a href={survey} target="_blank" rel="noopener noreferrer" className="terra-grad mt-5 flex h-12 items-center justify-center rounded-full text-sm font-bold text-white">{tg("survey")}</a>}
            <Link href={`/rotalar/${slug}`} className={survey ? "mt-2 flex h-12 items-center justify-center rounded-full border border-line bg-white text-sm font-bold text-navy shadow-card" : "terra-grad mt-5 flex h-12 items-center justify-center rounded-full text-sm font-bold text-white"}>{t("backToRoute")}</Link>
            <button type="button" onClick={() => setDone(false)} className="mt-2 h-12 w-full rounded-full border border-line bg-white text-sm font-bold text-navy shadow-card">{t("keepGoing")}</button>
          </div>
        </div>
      )}

      {needName && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/50 p-6">
          <form className="glass w-full max-w-[340px] rounded-[28px] p-5" onSubmit={(e) => { e.preventDefault(); const n = draft.trim().slice(0, 24); if (n.length < 2) return; try { localStorage.setItem("afyon-ad", n); } catch { /* yok say */ } setName(n); }}>
            <p className="font-display text-xl font-semibold text-navy">{tx("joinTheGroup_aae67")}</p>
            <p className="mt-1 text-xs text-ink-2">{tx("code_76352")} <b className="tracking-[2px]">{grup}</b>{tx("yourGroupWillSeeYour_4e312")}</p>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={tx("yourName_41792")} maxLength={24} autoFocus className="mt-3 h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none focus:border-terra" />
            <button disabled={draft.trim().length < 2} className="terra-grad mt-3 h-12 w-full rounded-full text-sm font-bold text-white disabled:opacity-50">{tx("join_33189")}</button>
          </form>
        </div>
      )}
    </div>
  );
}
