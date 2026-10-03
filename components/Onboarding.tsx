"use client";
import { useEffect, useState } from "react";

const KEY = "afyon-onb-v1";
const slides = [
  { art: "/art/hero-kale.svg", title: "Afyonkarahisar'ı keşfedin", text: "Kale'den Ulu Cami'ye, Frig vadilerinden termal sulara; şehrin rehberli rotaları tek yerde." },
  { art: "/art/map-city.svg", title: "Haritada gezin", text: "Duraklar, yürüyüş ve araç rotaları canlı haritada. Kendi rotanızı seçip tek dokunuşla başlatın." },
  { art: "/art/banner-frig.svg", title: "Sesli rehber eşlik etsin", text: "Her durağın hikâyesini dinleyin. Giriş yapmadan da her şeyi gezebilirsiniz." },
];

export default function Onboarding() {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setI(0); } catch { /* depolama kapalı: tanıtım atlanır */ }
  }, []);
  if (i === null) return null;
  const done = () => { try { localStorage.setItem(KEY, "1"); } catch { /* yok say */ } setI(null); };
  const s = slides[i]; const last = i === slides.length - 1;
  return (
    <div role="dialog" aria-modal="true" aria-label="Tanıtım" className="fixed inset-0 z-[100] flex justify-center bg-cream" style={{ animation: "fade-in .3s both" }}>
      <div className="flex w-full max-w-[520px] flex-col">
        <div className="relative h-[52%] overflow-hidden bg-navy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={s.art} src={s.art} alt="" className="page-in absolute inset-0 h-full w-full object-cover object-[85%_50%]" />
          <button type="button" onClick={done} className="glass-dark absolute right-4 top-5 rounded-full px-4 py-2 text-xs font-bold text-white">Atla</button>
        </div>
        <div className="-mt-6 flex flex-1 flex-col rounded-t-[32px] bg-cream px-6 pb-8 pt-7">
          <div key={i} className="page-in">
            <h2 className="font-display text-[30px] font-semibold leading-tight">{s.title}</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{s.text}</p>
          </div>
          <div className="mt-auto">
            <div className="mb-5 flex justify-center gap-2" aria-hidden>
              {slides.map((_, k) => <span key={k} className={`h-2 rounded-full transition-all duration-300 ${k === i ? "w-6 bg-terra" : "w-2 bg-line"}`} />)}
            </div>
            <button type="button" onClick={() => (last ? done() : setI(i + 1))} className="terra-grad h-14 w-full rounded-full text-[15px] font-bold text-white">{last ? "Keşfetmeye başla" : "Devam"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
