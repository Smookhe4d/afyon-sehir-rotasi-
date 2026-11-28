"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";
import { TOUR_STEPS, type TourStep } from "@/lib/narration/tanitim";

const DONE = "rotafyon-tanitim-v1";
const PENDING = "rotafyon-tanitim-bekliyor";
const MUTE = "rotafyon-tanitim-sessiz";
const ONB = "afyon-onb-v1";
export const START_EVENT = "rotafyon-tanitim";

function get(store: Storage | undefined, k: string) { try { return store?.getItem(k) ?? null; } catch { return null; } }
function set(store: Storage | undefined, k: string, v: string | null) { try { if (v === null) store?.removeItem(k); else store?.setItem(k, v); } catch { /* depolama kapalı */ } }
const ls = () => (typeof window === "undefined" ? undefined : window.localStorage);
const ss = () => (typeof window === "undefined" ? undefined : window.sessionStorage);

type Box = { x: number; y: number; w: number; h: number };

function visible(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const st = getComputedStyle(el);
  return r.width >= 8 && r.height >= 8 && st.visibility !== "hidden" && st.display !== "none";
}
function targetOf(sel?: string) {
  if (!sel) return null;
  return Array.from(document.querySelectorAll<HTMLElement>(sel)).find(visible) ?? null;
}
/** Hedefin ekrandaki kutusu, ekran sınırlarına kırpılmış olarak. */
function boxOf(el: HTMLElement | null): Box | null {
  if (!el) return null;
  let r = el.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) { el.scrollIntoView({ block: "center" }); r = el.getBoundingClientRect(); }
  const pad = 8;
  const x = Math.max(4, r.left - pad), y = Math.max(4, r.top - pad);
  const w = Math.min(innerWidth - 4, r.right + pad) - x, h = Math.min(innerHeight - 4, r.bottom + pad) - y;
  return w > 0 && h > 0 ? { x, y, w, h } : null;
}

/** G-023: giriş yaptıktan sonra uygulamayı düğme düğme tanıtan yazılı ve sesli rehberli tur. */
export default function AppTour() {
  const locale = useLocale();
  const t = useTranslations("g023");
  const path = usePathname();
  const router = useRouter();
  const [steps, setSteps] = useState<TourStep[] | null>(null);
  const [i, setI] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [cardH, setCardH] = useState(0);
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const openRef = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  // Adımlar ekranda olanlara göre bir kez belirlenir, tanıtım sürerken baştan başlamaz.
  const start = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    prevFocus.current = document.activeElement as HTMLElement | null;
    setMuted(get(ls(), MUTE) === "1");
    setSteps(TOUR_STEPS.filter((s) => !s.optional || targetOf(s.target)));
    setI(0);
  }, []);

  // Yalnızca Türkçe ana sayfada, ilk açılış tanıtımı bittikten sonra ve oturum varken kendiliğinden açılır.
  const onHome = path === "/";
  useEffect(() => {
    if (locale !== "tr") return;
    let cancelled = false;
    const tryStart = (signedIn: boolean) => {
      if (cancelled || !onHome || get(ls(), ONB) !== "1") return;
      if (get(ss(), PENDING) === "1") { set(ss(), PENDING, null); start(); return; }
      if (signedIn && get(ls(), DONE) !== "1") start();
    };
    const onEvent = () => { if (onHome) start(); else { set(ss(), PENDING, "1"); router.push("/"); } };
    window.addEventListener(START_EVENT, onEvent);
    if (!supabaseConfigured) { tryStart(false); return () => { cancelled = true; window.removeEventListener(START_EVENT, onEvent); }; }
    const sb = createClient();
    let had: boolean | null = null;
    sb.auth.getSession().then(({ data }) => { had = Boolean(data.session); tryStart(had); });
    // Sekmeye dönüşte de SIGNED_IN gelebilir, yalnızca oturumsuzdan oturumluya geçiş sayılır.
    const { data: sub } = sb.auth.onAuthStateChange((ev, session) => {
      const now = Boolean(session);
      if (ev === "SIGNED_IN" && had === false && now) setTimeout(() => tryStart(true), 900);
      if (had !== null) had = now;
    });
    return () => { cancelled = true; window.removeEventListener(START_EVENT, onEvent); sub.subscription.unsubscribe(); };
  }, [locale, onHome, start, router]);

  const step = steps?.[i] ?? null;

  const place = useCallback(() => { if (step) setBox(boxOf(targetOf(step.target))); }, [step]);
  useLayoutEffect(() => {
    if (!step) return;
    place();
    const tm = setTimeout(place, 350);
    addEventListener("resize", place);
    addEventListener("scroll", place, true);
    return () => { clearTimeout(tm); removeEventListener("resize", place); removeEventListener("scroll", place, true); };
  }, [step, place]);
  useLayoutEffect(() => { if (card.current) setCardH(card.current.offsetHeight); }, [step, box]);

  // Her adımın kendi kaydı çalar. Tarayıcı izin vermezse kartta "Dinle" düğmesi görünür.
  const play = useCallback(() => {
    const a = audio.current;
    if (!a || !step) return;
    a.pause();
    if (!a.src.endsWith(step.audio)) a.src = step.audio;
    a.currentTime = 0;
    a.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
  }, [step]);
  useEffect(() => {
    if (!step) return;
    if (muted) { audio.current?.pause(); return; }
    play();
  }, [step, muted, play]);

  useEffect(() => { if (step) card.current?.focus(); }, [step]);

  const close = useCallback(() => {
    audio.current?.pause();
    set(ls(), DONE, "1");
    openRef.current = false;
    setSteps(null);
    prevFocus.current?.focus?.();
  }, []);
  const go = (d: number) => { if (!steps) return; const n = i + d; if (n >= steps.length) close(); else if (n >= 0) setI(n); };
  const toggleMute = () => setMuted((m) => { set(ls(), MUTE, m ? null : "1"); return !m; });

  // Klavye: Esc kapatır, Tab kartın içinde döner. Arka plan etkileşime kapanır.
  const isOpen = steps !== null;
  useEffect(() => {
    if (!isOpen) return;
    // Tanıtımın atalarının dışındaki her kardeş öğe etkileşime kapanır.
    const bg: HTMLElement[] = [];
    for (let el: HTMLElement | null = root.current; el && el !== document.body; el = el.parentElement) {
      for (const sib of Array.from(el.parentElement?.children ?? [])) if (sib !== el && sib instanceof HTMLElement && !sib.hasAttribute("inert")) bg.push(sib);
    }
    bg.forEach((el) => el.setAttribute("inert", ""));
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !card.current) return;
      const f = Array.from(card.current.querySelectorAll<HTMLElement>("button, a[href]"));
      if (!f.length) return;
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === card.current)) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    };
    addEventListener("keydown", k);
    return () => { removeEventListener("keydown", k); bg.forEach((el) => el.removeAttribute("inert")); };
  }, [isOpen, close]);

  if (!steps || !step) return <audio ref={audio} preload="none" />;
  const last = i === steps.length - 1;
  const vh = typeof window === "undefined" ? 800 : innerHeight;
  // Kart, hedef ekranın üst yarısındaysa altına, alt yarısındaysa üstüne yerleşir. Ölçülen yüksekliğe göre ekranda tutulur.
  let pos: React.CSSProperties | undefined;
  if (box) {
    const below = box.y + box.h / 2 < vh / 2;
    pos = below ? { top: Math.max(12, Math.min(box.y + box.h + 12, vh - cardH - 12)) } : { top: Math.max(12, box.y - cardH - 12) };
  }

  return (
    <div ref={root} data-app-tour className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-labelledby="tanitim-baslik" aria-describedby="tanitim-metin">
      <audio ref={audio} preload="none" />
      {box ? (
        <div aria-hidden className="tour-hole pointer-events-none absolute rounded-[22px] ring-2 ring-white/90 transition-all duration-500 [transition-timing-function:var(--ease-spring)]"
          style={{ left: box.x, top: box.y, width: box.w, height: box.h }} />
      ) : <div aria-hidden className="tour-dim absolute inset-0" />}
      <div className={box ? "absolute inset-x-3" : "absolute inset-3 grid place-items-center"} style={pos}>
        <div ref={card} tabIndex={-1} key={i}
          className="glass sheen mx-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overflow-y-auto rounded-[28px] p-5 outline-none [animation:onb-rise_.5s_var(--ease-spring)_both]">
          {step.mock && <Mock kind={step.mock} />}
          <div className="flex items-start justify-between gap-3">
            <h2 id="tanitim-baslik" className="font-display text-[22px] leading-tight text-navy">{step.title}</h2>
            <button type="button" onClick={blocked && !muted ? play : toggleMute} aria-pressed={!muted && !blocked}
              aria-label={blocked && !muted ? t("listen") : t("sound")} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ac/10 text-ac">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{muted
                ? <path d="M4 9v6h4l5 4V5L8 9H4zm12.6 3 2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4z" />
                : blocked ? <path d="M8 5.5v13l10.5-6.5z" />
                : <path d="M4 9v6h4l5 4V5L8 9H4zm11.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM13 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />}</svg>
            </button>
          </div>
          <p id="tanitim-metin" className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{step.text}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold text-ink-2" aria-live="polite">{i + 1} / {steps.length}</span>
            <div className="ml-auto flex items-center gap-2">
              {!last && <button type="button" onClick={close} className="min-h-11 px-2 text-[14px] font-semibold text-ink-2">{t("skip")}</button>}
              {i > 0 && <button type="button" onClick={() => go(-1)} className="h-11 rounded-full bg-ac/10 px-4 text-[14px] font-bold text-ac">{t("back")}</button>}
              <button type="button" onClick={() => go(1)} className="terra-grad h-11 rounded-full px-5 text-[14px] font-bold text-white">{last ? t("done") : t("next")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Tur ekranı henüz açık olmadığı için o ekranın düğmeleri küçük bir örnekle gösterilir. */
function Mock({ kind }: { kind: NonNullable<TourStep["mock"]> }) {
  const t = useTranslations("g023");
  const chip = "rounded-full px-3 py-1.5 text-[12px] font-bold";
  return (
    <div aria-hidden className="mb-4 rounded-2xl border border-line bg-white p-3 text-navy shadow-card">
      {kind === "tur" && <>
        <div className="flex items-center justify-between text-[12px] font-bold"><span>{t("stopOf")}</span><span className="text-mute">{t("mockStop")}</span></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ac/15"><div className="h-full w-1/4 rounded-full bg-ac" /></div>
        <div className="mt-3 flex justify-between"><span className={`${chip} bg-ac/10 text-ac`}>{t("prev")}</span><span className={`${chip} terra-grad text-white`}>{t("nextStop")}</span></div>
      </>}
      {kind === "ses" && <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-ac2"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z" /></svg></span>
        <div className="flex flex-1 flex-wrap gap-1.5"><span className={`${chip} bg-ac/10 text-ac`}>{t("back15")}</span><span className={`${chip} bg-ac/10 text-ac`}>1x</span><span className={`${chip} bg-ac/10 text-ac`}>{t("showText")}</span></div>
      </div>}
      {kind === "harita" && <>
        <div className="grid grid-cols-2 rounded-full bg-ac/10 p-1 text-center text-[12px] font-bold"><span className="py-1.5 text-mute">{t("story")}</span><span className="rounded-full bg-white py-1.5 shadow-card">{t("map")}</span></div>
        <p className="mt-2.5 rounded-xl bg-ac/10 px-3 py-2 text-[12px] font-semibold">{t("arrived")}</p>
      </>}
      {kind === "grup" && <div className="flex items-center justify-between gap-2 text-[12px] font-bold">
        <span>{t("guideAt")}</span><span className={`${chip} terra-grad text-white`}>{t("backToGuide")}</span>
      </div>}
    </div>
  );
}
