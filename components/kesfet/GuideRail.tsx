"use client";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/Icon";
import CatBadge from "@/components/CatBadge";
import type { RouteCategory } from "@/lib/types";

export type GuideCard = { slug: string; title: string; cat: RouteCategory; img?: string; stops: string; time?: string; modeIcon: string };

/**
 * G-011: Apple Haritalar tarzı rehber kartları. Yatay kaydırmada öne gelen kartın rotası haritada çizilir.
 * Tema çipi seçilince yalnızca o temanın rotaları kalır.
 */
export default function GuideRail({ cards, onMap, empty, heading, headingCat, allLabel }: { cards: GuideCard[]; onMap: string; empty: string; heading: string; headingCat: Record<string, string>; allLabel: string }) {
  const [cat, setCat] = useState<RouteCategory | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const list = cards.filter((c) => !cat || c.cat === cat);
  useEffect(() => { const f = (e: Event) => setCat((e as CustomEvent).detail); addEventListener("kesfet-cat", f); return () => removeEventListener("kesfet-cat", f); }, []);
  useEffect(() => {
    const r = rail.current; if (!r) return;
    let t: ReturnType<typeof setTimeout>;
    const pick = () => {
      const kids = [...r.querySelectorAll<HTMLElement>("[data-slug]")];
      if (!kids.length) return;
      const x = r.scrollLeft + 16;
      const best = kids.reduce((a, b) => (Math.abs(b.offsetLeft - x) < Math.abs(a.offsetLeft - x) ? b : a));
      setActive(best.dataset.slug ?? null);
    };
    const on = () => { clearTimeout(t); t = setTimeout(pick, 160); };
    r.addEventListener("scroll", on, { passive: true });
    const first = setTimeout(pick, 2600);
    return () => { r.removeEventListener("scroll", on); clearTimeout(t); clearTimeout(first); };
  }, [cat]);
  useEffect(() => { dispatchEvent(new CustomEvent("kesfet-route", { detail: active })); }, [active]);
  return (
    <>
      <div className="flex items-baseline justify-between px-4 pb-2.5 pt-2"><h2 className="font-display text-[21px] text-navy">{cat ? headingCat[cat] : heading}</h2><Link href="/rotalar" className="text-[15px] font-semibold text-ac">{allLabel}</Link></div>
      <div ref={rail} data-hscroll className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 pt-1.5 [scrollbar-width:none]">
        {list.length === 0 && <p className="py-3 text-sm text-mute">{empty}</p>}
        {list.map((c) => {
          const on = c.slug === active;
          return (
            <Link key={c.slug} data-slug={c.slug} href={`/rotalar/${c.slug}`} aria-label={c.title}
              className={`relative h-[200px] w-[240px] shrink-0 snap-start overflow-hidden rounded-[26px] text-white transition-shadow duration-500 ${on ? "shadow-[0_0_0_3px_var(--ac),0_16px_30px_-18px_rgba(44,18,66,.7)]" : "shadow-[0_16px_30px_-18px_rgba(44,18,66,.7)]"}`}>
              {c.img ? (/* eslint-disable-next-line @next/next/no-img-element */<img src={c.img} alt="" loading="lazy" style={{ viewTransitionName: `cv-${c.slug}` }} className="absolute inset-0 h-full w-full object-cover" />)
                : <span className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,var(--ac),#2A1236)] text-white/80"><CatBadge cat={c.cat} size={56} radius={18} /></span>}
              <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-30% to-[#14081c]/85" />
              <span className="absolute left-2.5 top-2.5"><CatBadge cat={c.cat} /></span>
              {on && <span className="glass-dark absolute right-2.5 top-2.5 flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold [animation:fade-in_.4s_both]"><svg width="18" height="6" aria-hidden><line x1="1" y1="3" x2="17" y2="3" stroke="#fff" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" /></svg>{onMap}</span>}
              <span className="absolute inset-x-3.5 bottom-3 flex flex-col gap-1.5">
                <b className="text-[17px] font-extrabold leading-tight">{c.title}</b>
                <span className="flex flex-wrap gap-1.5 text-xs font-bold">
                  <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">{c.stops}</span>
                  {c.time && <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur"><Icon name={c.modeIcon} size={13} />{c.time}</span>}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
