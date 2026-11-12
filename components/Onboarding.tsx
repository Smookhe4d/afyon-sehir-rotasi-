"use client";
import {useLocale, useTranslations} from "next-intl";
import {useCallback, useEffect, useRef, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {rememberLanguage} from "./LanguageSwitcher";
import type {Locale} from "@/i18n/routing";
import {ONB_ROUTE} from "./onbRoute";

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
    router.push(locale === "en" ? "/en/giris" : "/giris");
  }, [locale, router]);

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
    if (skip) { setStep(null); router.push(locale === "en" ? "/en/giris" : "/giris"); } else setStep(1);
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

  const isMap = step === 1;
  const dots = (
    <div className="flex gap-1.5" aria-hidden>
      {[0, 1, 2].map((k) => <span key={k} className={`h-[7px] rounded-full transition-all duration-500 [transition-timing-function:var(--ease-spring)] ${k === step ? "w-6 bg-ac" : "w-[7px] bg-ac/20"}`} />)}
    </div>
  );
  // G-011: tam ekran görsel, altta buzlu cam kart. Adımlar yana kayarak değişir.
  return (
    <div ref={root} tabIndex={-1} data-lenis-prevent role="dialog" aria-modal="true" aria-label={t("label")} lang={step === 0 ? lang : undefined} {...(step > 0 ? swipe : {})}
      className="fixed inset-0 z-[100] flex justify-center bg-[#20102A] outline-none">
      <div className="relative flex w-full max-w-[520px] flex-col overflow-hidden">
        <div key={step} aria-hidden className="absolute inset-0 [animation:onb-slide_.7s_var(--ease-out-soft)_both]">
          {step === 0 && <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/afyon-kalesi.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_35%] [animation:onb-kb_16s_ease-out_both]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#14081c]/35 via-transparent via-30% to-[#14081c]/60" />
          </>}
          {isMap && <div className="absolute inset-0 bg-[#F7F3EC]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/art/onb-rota.webp" alt="" className="absolute inset-x-0 top-0 w-full" />
            <svg viewBox={`0 0 ${ONB_ROUTE.w} ${ONB_ROUTE.h}`} className="absolute inset-x-0 top-0 w-full overflow-visible">
              {[["#fff", 9], ["var(--ac)", 5]].map(([c, w]) => <path key={String(c)} d={ONB_ROUTE.d} fill="none" stroke={String(c)} strokeWidth={Number(w)} strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: ONB_ROUTE.len, strokeDashoffset: ONB_ROUTE.len, animation: "onb-draw 2.2s .35s cubic-bezier(.45,0,.2,1) forwards" }} />)}
              {ONB_ROUTE.stops.map(([n, x, y], k) => (
                <g key={n} style={{ transformOrigin: `${x}px ${y}px`, animation: `onb-pop .5s ${0.5 + k * 0.17}s cubic-bezier(.34,1.56,.64,1) both` }}>
                  <circle cx={x} cy={y} r="11" fill="var(--ac)" stroke="#fff" strokeWidth="2.5" /><text x={x} y={y + 4.2} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fff">{n}</text>
                </g>
              ))}
            </svg>
          </div>}
          {step === 2 && <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/ayazini.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[35%_50%] [animation:onb-kb_16s_ease-out_both]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#14081c]/10 to-[#14081c]/60" />
            <div className="glass sheen absolute inset-x-5 top-[16%] rounded-[30px] p-4 [animation:onb-rise_.7s_.25s_var(--ease-spring)_both]">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ac2 text-navy"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z" /></svg></span>
                <span className="min-w-0"><b className="block text-[15px] leading-tight text-navy">{t("audio.stopName")}</b><span className="text-xs font-semibold text-mute">{t("audio.stop")}</span></span>
              </div>
              <div className="mt-3 flex h-[30px] items-center gap-[3px]">
                {Array.from({length: 34}, (_, k) => <i key={k} className="flex-1 rounded-[2px] bg-ac [animation:onb-wave_1.1s_ease-in-out_infinite]" style={{height: 8 + Math.round(20 * Math.abs(Math.sin(k * 1.7) * Math.cos(k * 0.45))), animationDelay: `${k * 45}ms`}} />)}
              </div>
            </div>
          </>}
        </div>
        {step > 0 && <button type="button" onClick={finish} className="glass absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-10 items-center rounded-full px-4 text-[13px] font-bold text-navy">{t("skip")}</button>}
        <div className="glass sheen relative mx-3 mb-[max(0.875rem,env(safe-area-inset-bottom))] mt-auto flex flex-col gap-3.5 rounded-[36px] p-5 [animation:onb-rise_.8s_.2s_var(--ease-spring)_both]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/rotafyon-acik-480.webp" srcSet="/brand/rotafyon-acik-480.webp 1x, /brand/rotafyon-acik-960.webp 2x" alt="rotAfyon" className="-ml-1 h-10 w-auto self-start" />
          <div key={step} className="[animation:onb-text_.6s_.1s_var(--ease-spring)_both]">
            <h2 className="font-display text-[28px] leading-[1.08] text-navy [text-wrap:balance]">{step === 0 ? w("title") : t(isMap ? "map.title" : "audio.title")}</h2>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{step === 0 ? w("text", {count: routeCount}) : t(isMap ? "map.text" : "audio.text")}</p>
          </div>
          {step === 0 && (
            <div role="radiogroup" aria-label={w("language")} className="relative grid grid-cols-2 rounded-full bg-ac/10 p-1">
              <span aria-hidden className="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-white shadow-card transition-transform duration-500 [transition-timing-function:var(--ease-spring)]" style={{ transform: lang === "en" ? "translateX(100%)" : "none" }} />
              {(["tr", "en"] as const).map((l) => (
                <button key={l} type="button" role="radio" aria-checked={lang === l} lang={l} onClick={() => setLang(l)}
                  className={`relative h-11 rounded-full text-[15px] transition-colors ${lang === l ? "font-bold text-navy" : "font-semibold text-mute"}`}>{t(`languages.${l}`)}</button>
              ))}
            </div>
          )}
          <button type="button" onClick={() => step === 0 ? leaveWelcome(false) : go(step + 1)} className="terra-grad h-14 w-full rounded-full text-[16px] font-bold text-white">{step === 0 ? w("start") : step === LAST ? t("start") : t("next")}</button>
          <div className="flex items-center justify-between">{dots}{step === 0 && <button type="button" onClick={() => leaveWelcome(true)} className="min-h-11 px-1 text-[14px] font-semibold text-ac">{w("skip")}</button>}</div>
        </div>
      </div>
    </div>
  );
}
