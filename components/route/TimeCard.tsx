"use client";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Icon from "@/components/Icon";
import { routeTimes, DAY_MIN } from "@/lib/durations";
import { fmtDist, fmtMin, fmtTotal } from "@/lib/timefmt";

type Mode = "arac" | "yuruyus" | "bisiklet";
const ICON: Record<Mode, string> = { arac: "car", yuruyus: "person-simple-walk", bisiklet: "bicycle" };

/** G-011: ulaşım seçimine göre mesafe, yol süresi ve tahmini toplam. Seçim yönlendirmeye ve durak listesine iletilir. */
export default function TimeCard({ slug, modes, initial }: { slug: string; modes: Mode[]; initial: Mode }) {
  const g = useTranslations("g011");
  const locale = useLocale();
  const avail = modes.filter((m) => routeTimes[slug]?.[m]);
  const [mode, setMode] = useState<Mode>(avail.includes(initial) ? initial : avail[0]);
  const t = routeTimes[slug]?.[mode];
  if (!t) return null;
  const pick = (m: Mode) => { setMode(m); dispatchEvent(new CustomEvent("route-mode", { detail: m })); };
  const idx = avail.indexOf(mode);
  return (
    <section className="mt-4 rounded-[24px] bg-white p-3.5 shadow-card">
      {avail.length > 1 ? (
        <div role="radiogroup" aria-label={g("travel")} className="relative mb-3 flex rounded-full bg-ac/10 p-1">
          <span aria-hidden className="absolute bottom-1 top-1 rounded-full bg-white shadow-card transition-transform duration-500 [transition-timing-function:var(--ease-spring)]" style={{ width: `calc((100% - 8px) / ${avail.length})`, transform: `translateX(${idx * 100}%)`, left: 4 }} />
          {avail.map((m) => (
            <button key={m} type="button" role="radio" aria-checked={m === mode} onClick={() => pick(m)}
              className={`relative flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full text-[14px] transition-colors ${m === mode ? "font-bold text-navy" : "font-semibold text-mute"}`}>
              <Icon name={ICON[m]} size={17} />{g(`modes.${m}`)}
            </button>
          ))}
        </div>
      ) : <p className="mb-2.5 flex items-center gap-1.5 text-[14px] font-bold text-navy"><Icon name={ICON[mode]} size={18} />{g(`modes.${mode}`)}</p>}
      <dl key={mode} className="grid grid-cols-3 [animation:fade-in_.4s_both]">
        <div className="px-1"><dt className="text-xs text-mute">{g("distance")}</dt><dd className="mt-0.5 whitespace-nowrap text-[18px] font-extrabold">{fmtDist(locale, t.dist)}</dd></div>
        <div className="border-l border-line pl-2.5"><dt className="text-xs text-mute">{g("travel")}</dt><dd className="mt-0.5 whitespace-nowrap text-[18px] font-extrabold">{fmtMin(g, t.travel)}</dd></div>
        <div className="border-l border-line pl-2.5"><dt className="text-xs text-mute">{g("total")}</dt><dd className="mt-0.5 whitespace-nowrap text-[18px] font-extrabold text-ac">{fmtTotal(g, t.total)}</dd></div>
      </dl>
      <p className="mt-2.5 text-[12.5px] leading-relaxed text-mute">{g(t.total > DAY_MIN ? "estNoteDays" : "estNote", {visit: fmtMin(g, t.visit)})}</p>
    </section>
  );
}
