"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { THEMES, applyThemeLive, themeById, DEFAULT_THEME } from "@/lib/themes";

/** G-015: ayarlar satırında yerleşik tema seçimi. Yalnızca renk noktaları. */
export default function ThemeRow({ initial }: { initial: string }) {
  const tx = useTranslations("ui");
  const [id, setId] = useState(THEMES.some((t) => t.id === initial) ? initial : DEFAULT_THEME);
  useEffect(() => { const f = (e: Event) => setId((e as CustomEvent).detail.id); addEventListener("afyon-theme", f); return () => removeEventListener("afyon-theme", f); }, []);
  const L: Record<string, string> = { rotafyon: "rotAfyon", gece: tx("night_1eabb"), gunbatimi: tx("sunset_63a54"), hashas: tx("poppy_30b19"), zeytin: tx("olive_57519"), termal: tx("thermal_bafab"), mermer: tx("marble_478bc"), lokum: tx("turkishDelight_ca9fe"), kale: tx("castle_65ead") };
  const cur = themeById(id);
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-card">
      <span className="min-w-0 shrink-0"><b className="block text-sm font-bold text-navy">{tx("theme_6ae1b")}</b><span className="block text-[11.5px] text-mute">{L[cur.id]}</span></span>
      <ul role="radiogroup" aria-label={tx("profileTheme_0d3bb")} className="ml-auto flex flex-wrap justify-end gap-[7px]">
        {THEMES.map((t) => { const on = t.id === id; return (
          <li key={t.id}><button type="button" role="radio" aria-checked={on} aria-label={L[t.id]} onClick={() => { setId(t.id); applyThemeLive(t); }}
            className={`block h-[22px] w-[22px] rounded-full transition-transform duration-300 ${on ? "scale-110 shadow-[0_0_0_2px_#fff,0_0_0_3.5px_var(--ac)]" : "shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]"}`}
            style={{ background: `linear-gradient(135deg, ${t.a} 50%, ${t.b} 50%)` }} /></li>); })}
      </ul>
    </div>
  );
}
