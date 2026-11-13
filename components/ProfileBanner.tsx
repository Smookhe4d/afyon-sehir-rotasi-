"use client";
import {useTranslations as useUiTranslations} from "next-intl";

import { useEffect, useState } from "react";
import { applyThemeLive, themeById, DEFAULT_THEME } from "@/lib/themes";

import ThemeScene from "./ThemeScenes";

export const themeIds: string[] = ["rotafyon", "gece", "gunbatimi", "hashas", "zeytin", "termal", "mermer", "lokum", "kale"];

export default function ProfileBanner({ initial, who }: { initial: string; who?: React.ReactNode }) {
  const tx = useUiTranslations("ui");
  const g = useUiTranslations("g011");

  const themes = [
  { id: "rotafyon", label: "rotAfyon", a: "#60117B", b: "#FA9024", sun: "#FFF1C9" },
  { id: "gece", label: tx("night_1eabb"), a: "#16264F", b: "#B0586B", sun: "#F3C9A0" },
  { id: "gunbatimi", label: tx("sunset_63a54"), a: "#C25A2B", b: "#F0B35E", sun: "#FFF1C9" },
  { id: "hashas", label: tx("poppy_30b19"), a: "#5B2A6B", b: "#D9577A", sun: "#FFD4DE" },
  { id: "zeytin", label: tx("olive_57519"), a: "#3C4A28", b: "#A8A04C", sun: "#F4EBB4" },
  { id: "termal", label: tx("thermal_bafab"), a: "#0F4C5C", b: "#5FB3A8", sun: "#DFF6EE" },
  { id: "mermer", label: tx("marble_478bc"), a: "#4A5568", b: "#C3CAD6", sun: "#FFFFFF" },
  { id: "lokum", label: tx("turkishDelight_ca9fe"), a: "#B2456E", b: "#F5B8C8", sun: "#FFF4F6" },
  { id: "kale", label: tx("castle_65ead"), a: "#4B3426", b: "#B98B62", sun: "#F6E3C8" },
] as const;

  const [id, setId] = useState(themes.some((t) => t.id === initial) ? initial : DEFAULT_THEME);
  useEffect(() => { const f = (e: Event) => setId((e as CustomEvent).detail.id); addEventListener("afyon-theme", f); return () => removeEventListener("afyon-theme", f); }, []);
  const t = themes.find((x) => x.id === id) ?? themes[0];
  const pick = (v: string) => { setId(v); applyThemeLive(themeById(v)); };
  return (
    <>
    <section className="relative mx-4 h-48 overflow-hidden rounded-[30px] shadow-card transition-[background] duration-700" style={{ background: `linear-gradient(135deg, ${t.a} 0%, ${t.b} 100%)` }}>
      <svg key={t.id} aria-hidden viewBox="0 0 400 176" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full [animation:fade-in_.7s_both]"><ThemeScene id={t.id} /></svg>
      {who && <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 text-white">{who}</div>}
    </section>
    <section className="mx-4 mt-3 rounded-[26px] bg-white px-1 pb-2 pt-3.5 shadow-card">
      <div className="flex items-baseline justify-between gap-3 px-3.5"><h2 className="font-display text-[18px] text-navy">{tx("theme_6ae1b")}</h2><span className="truncate text-[12.5px] text-mute">{g("themeHint")}</span></div>
      <ul className="mt-1 flex gap-2.5 overflow-x-auto px-3.5 pb-2 pt-3 [scrollbar-width:none]" role="radiogroup" aria-label={tx("profileTheme_0d3bb")}>
        {themes.map((x) => (
          <li key={x.id} className="w-[60px] shrink-0 text-center">
            <button type="button" role="radio" aria-checked={x.id === id} aria-label={x.label} onClick={() => pick(x.id)} className={`mx-auto block h-[50px] w-[50px] overflow-hidden rounded-[17px] transition-transform duration-300 ${x.id === id ? "scale-105 shadow-[0_0_0_3px_#fff,0_0_0_5.5px_var(--ac)]" : "shadow-[0_0_0_1px_rgba(40,20,60,.08)]"}`} style={{ background: `linear-gradient(135deg, ${x.a}, ${x.b})` }}><svg aria-hidden viewBox="150 0 176 176" preserveAspectRatio="xMidYMid slice" className="h-full w-full"><ThemeScene id={x.id} /></svg></button>
            <span className={`mt-2 block truncate text-[11.5px] ${x.id === id ? "font-bold text-navy" : "font-semibold text-mute"}`}>{x.label}</span>
          </li>
        ))}
      </ul>
    </section>
    </>
  );
}
