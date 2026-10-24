"use client";
import {useLocale, useTranslations} from "next-intl";
import {useCallback, useEffect, useRef, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {rememberLanguage} from "./LanguageSwitcher";
import type {Locale} from "@/i18n/routing";

const KEY = "afyon-onb-v1";
const STEP = "afyon-onb-step";
const LAST = 2;

function read(store: "local" | "session", key: string) {
  try { return (store === "local" ? localStorage : sessionStorage).getItem(key); } catch { return null; }
}
function write(store: "local" | "session", key: string, value: string | null) {
  try {
    const s = store === "local" ? localStorage : sessionStorage;
    if (value === null) s.removeItem(key); else s.setItem(key, value);
  } catch { /* depolama kapalı */ }
}

/**
 * İlk açılış tanıtımı. Yalnızca ana sayfaya ilk gelişte açılır.
 * 1. ekran karşılama ve dil seçimi, 2. ve 3. ekran uygulamanın harita ve sesli rehber bölümleri.
 * Rota, durak ya da QR bağlantısıyla doğrudan gelen ziyaretçide açılmaz, adresin dili hatırlanır.
 */
export default function Onboarding({routeCount}: {routeCount: number}) {
  const pathname = usePathname();
  const locale = (useLocale() === "en" ? "en" : "tr") as Locale;
  const router = useRouter();
  const t = useTranslations("onboarding");
  const [step, setStep] = useState<number | null>(null);
  const [lang, setLang] = useState<Locale>(locale);
  const root = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    // Tanıtım yalnızca Türkçe ana sayfadan başlar. /en'ye ancak karşılamada İngilizce seçilerek
    // geçilmişse devam eder. /en'ye doğrudan gelen ziyaretçi İngilizceyi zaten seçmiş sayılır.
    const continuing = pathname === "/en" && read("session", STEP) !== null;
    if (pathname !== "/" && !continuing) {
      // Doğrudan bir sayfaya gelen ziyaretçi tanıtımı görmez, adresin dili saklanır.
      rememberLanguage(locale);
      write("local", KEY, "1");
      write("session", STEP, null);
      setStep(null);
      return;
    }
    if (read("local", KEY)) { setStep(null); return; }
    setLang(locale);
    setStep(Number(read("session", STEP) ?? 0) || 0);
  }, [pathname, locale]);

  // Odak pencerenin kendisine taşınır: ekran okuyucu başlığı okur, ilk Tab ana düğmelere gider.
  useEffect(() => { if (step !== null) root.current?.focus(); }, [step]);

  const finish = useCallback(() => {
    rememberLanguage(locale);
    write("local", KEY, "1");
    write("session", STEP, null);
    setStep(null);
  }, [locale]);

  const go = useCallback((next: number) => {
    if (next > LAST) return finish();
    write("session", STEP, String(next));
    setStep(next);
  }, [finish]);

  // Karşılamada seçilen dil farklıysa sayfa o dile geçer, tanıtım kaldığı yerden sürer.
  const leaveWelcome = (skip: boolean) => {
    rememberLanguage(lang);
    if (skip) { write("local", KEY, "1"); write("session", STEP, null); }
    else write("session", STEP, "1");
    if (lang !== locale) { router.replace(lang === "en" ? "/en" : "/"); return; }
    if (skip) setStep(null); else setStep(1);
  };

  if (step === null) return null;
  const w = (key: string, values?: Record<string, number>) => t(`welcome.${lang}.${key}`, values);
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => { touch.current = e.touches[0].clientX; },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touch.current === null) return;
      const dx = e.changedTouches[0].clientX - touch.current; touch.current = null;
      if (dx < -50) go(step + 1); else if (dx > 50 && step > 1) go(step - 1);
    },
  };

  if (step === 0) return (
    <div ref={root} tabIndex={-1} data-lenis-prevent role="dialog" aria-modal="true" aria-label={t("label")} lang={lang}
      className="fixed inset-0 z-[100] flex justify-center bg-navy text-white outline-none" style={{animation: "fade-in .3s both"}}>
      <div className="relative flex w-full max-w-[520px] flex-col overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/onb-hero.webp" alt="" className="absolute inset-x-0 top-0 h-[72%] w-full object-cover object-[50%_30%]" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-navy/55 via-navy/0 via-25% to-navy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/rotafyon-480.webp" srcSet="/brand/rotafyon-480.webp 1x, /brand/rotafyon-960.webp 2x" width={155} height={52} alt="rotAfyon"
          className="relative mx-auto mt-[max(2.75rem,env(safe-area-inset-top))] h-[52px] w-auto rounded-xl shadow-lift" />
        <div className="relative mt-auto px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))]">
          <h2 className="font-display text-[31px] font-semibold leading-[1.08] tracking-[-0.015em] [text-wrap:balance]">{w("title")}</h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-white/80">{w("text", {count: routeCount})}</p>
          <div role="radiogroup" aria-label={w("language")} className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-white/10 p-1">
            {(["tr", "en"] as const).map((l) => (
              <button key={l} type="button" role="radio" aria-checked={lang === l} lang={l} onClick={() => setLang(l)}
                className={`h-10 rounded-full text-sm font-bold transition-colors ${lang === l ? "bg-white text-navy" : "text-white/75 hover:text-white"}`}>
                {l === "tr" ? "Türkçe" : "English"}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => leaveWelcome(false)} className="terra-grad mt-3.5 h-14 w-full rounded-full text-[15px] font-bold text-white">{w("start")}</button>
          <button type="button" onClick={() => leaveWelcome(true)} className="mx-auto mt-3 block min-h-11 px-4 text-[13px] font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline">{w("skip")}</button>
        </div>
      </div>
    </div>
  );

  const isMap = step === 1;
  return (
    <div ref={root} tabIndex={-1} data-lenis-prevent role="dialog" aria-modal="true" aria-label={t("label")} {...swipe}
      className="fixed inset-0 z-[100] flex justify-center bg-cream outline-none" style={{animation: "fade-in .3s both"}}>
      <div className="relative flex w-full max-w-[520px] flex-col overflow-hidden">
        <div key={step} className="page-in relative h-[62%] shrink-0 overflow-hidden" aria-hidden>
          {isMap ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/art/onb-map.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-x-3.5 bottom-10 flex items-center gap-3 rounded-2xl bg-white p-3 pl-3.5 shadow-lift">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-[13px] font-extrabold text-white">3</span>
                <span className="min-w-0"><b className="block text-sm leading-tight text-navy">Ayazini (Metropolis) Ören Yeri</b><span className="text-xs text-mute">{t("map.distance")}</span></span>
                <span className="ml-auto flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-navy px-3.5 text-[12.5px] font-bold text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-8-8 18-2-8z" /></svg>
                  {t("map.directions")}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/aslankaya.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[18%_50%]" />
              <div className="absolute inset-0 bg-gradient-to-b from-navy/0 via-navy/0 via-45% to-navy/60" />
              <span className="absolute left-4 top-6 text-[10.5px] text-white/85">{t("audio.credit")}</span>
              <div className="absolute inset-x-3.5 bottom-10 rounded-2xl bg-white px-3.5 py-3 shadow-lift">
                <div className="flex items-center gap-3">
                  <span className="terra-grad grid h-11 w-11 shrink-0 place-items-center rounded-full">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5.5v13l10.5-6.5z" /></svg>
                  </span>
                  <span className="min-w-0"><b className="block text-sm leading-tight text-navy">Aslankaya Açık Hava Tapınağı</b><span className="text-xs text-mute">{t("audio.stop")}</span></span>
                </div>
                <div className="mt-2.5 flex h-[26px] items-center gap-[3px]">
                  {Array.from({length: 38}, (_, k) => (
                    <i key={k} className={`flex-1 rounded-[3px] ${k < 14 ? "bg-terra" : "bg-[#E2D6C2]"}`} style={{height: 6 + Math.round(18 * Math.abs(Math.sin(k * 1.7) * Math.cos(k * 0.45)))}} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <button type="button" onClick={finish} className="absolute right-4 top-[max(1.125rem,env(safe-area-inset-top))] z-10 flex h-9 items-center rounded-full bg-white/95 px-4 text-[13px] font-bold text-navy shadow-card">{t("skip")}</button>
        <div className="relative -mt-[22px] flex flex-1 flex-col rounded-t-[28px] bg-cream px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-6">
          <div key={step} className="page-in">
            <h2 className="font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.015em] text-navy [text-wrap:balance]">{t(isMap ? "map.title" : "audio.title")}</h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{t(isMap ? "map.text" : "audio.text")}</p>
          </div>
          <div className="mt-auto pt-6">
            <div className="mb-[18px] flex justify-center gap-1.5" aria-hidden>
              {[0, 1, 2].map((k) => <span key={k} className={`h-1.5 rounded-full transition-all duration-300 ${k === step ? "w-[22px] bg-terra" : "w-1.5 bg-[#E2D6C2]"}`} />)}
            </div>
            <button type="button" onClick={() => go(step + 1)} className="terra-grad h-14 w-full rounded-full text-[15px] font-bold text-white">{step === LAST ? t("start") : t("next")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
