"use client";
import {useTranslations} from "next-intl";
import { useEffect, useState } from "react";

const KEY = "afyon-onb-v1";
const slides = ["/art/banner-afyon-1200.webp", "/art/map-city.svg", "/art/banner-frig.svg"];

export default function Onboarding() {
  const t = useTranslations("onboarding");
  const [i, setI] = useState<number | null>(null);
  useEffect(() => {
    const begin = () => {
      try { if (document.cookie.split(";").some(value => value.trim().startsWith("NEXT_LOCALE=")) && !localStorage.getItem(KEY)) setI(0); } catch { /* storage unavailable */ }
    };
    begin();
    window.addEventListener("afyon-language-chosen", begin);
    return () => window.removeEventListener("afyon-language-chosen", begin);
  }, []);
  if (i === null) return null;
  const done = () => { try { localStorage.setItem(KEY, "1"); } catch { /* yok say */ } setI(null); };
  const s = slides[i]; const last = i === slides.length - 1;
  return (
    <div role="dialog" aria-modal="true" aria-label={t("label")} className="fixed inset-0 z-[100] flex justify-center bg-cream" style={{ animation: "fade-in .3s both" }}>
      <div className="flex w-full max-w-[520px] flex-col">
        <div className="relative h-[52%] overflow-hidden bg-navy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={s} src={s} alt="" className="page-in absolute inset-0 h-full w-full object-cover object-[70%_50%]" />
          <button type="button" onClick={done} className="glass-dark absolute right-4 top-5 rounded-full px-4 py-2 text-xs font-bold text-white">{t("skip")}</button>
        </div>
        <div className="-mt-6 flex flex-1 flex-col rounded-t-[32px] bg-cream px-6 pb-8 pt-7">
          <div key={i} className="page-in">
            <h2 className="font-display text-[30px] font-semibold leading-tight">{t("slides." + i + ".title")}</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{t("slides." + i + ".text")}</p>
          </div>
          <div className="mt-auto">
            <div className="mb-5 flex justify-center gap-2" aria-hidden>
              {slides.map((_, k) => <span key={k} className={`h-2 rounded-full transition-all duration-300 ${k === i ? "w-6 bg-terra" : "w-2 bg-line"}`} />)}
            </div>
            <button type="button" onClick={() => (last ? done() : setI(i + 1))} className="terra-grad h-14 w-full rounded-full text-[15px] font-bold text-white">{last ? t("start") : t("next")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
