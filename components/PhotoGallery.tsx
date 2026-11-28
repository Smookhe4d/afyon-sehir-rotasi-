"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

type G = { src: string; author: string; license: string; page: string };

/** G-023: durağın lisanslı fotoğrafları kaydırılabilir galeri olarak. Her fotoğrafta çekenin adı ve lisansı görünür. */
export default function PhotoGallery({ items, alt, className = "", lift = false }: { items: G[]; alt: string; className?: string; lift?: boolean }) {
  const t = useTranslations("g023");
  const [at, setAt] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  if (items.length < 2) return null;
  const goTo = (k: number) => { const el = strip.current; if (el) el.scrollTo({ left: k * el.clientWidth, behavior: "smooth" }); };
  const bottom = lift ? "bottom-12 lg:bottom-3" : "bottom-3";
  return (
    <div className={`absolute inset-0 overflow-hidden bg-sand ${className}`} role="group" aria-roledescription={t("gallery")} aria-label={alt}>
      <div ref={strip} className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
        onScroll={(e) => { const el = e.currentTarget; setAt(Math.round(el.scrollLeft / el.clientWidth)); }}>
        {items.map((p, k) => (
          <figure key={p.src} className="relative h-full w-full shrink-0 snap-center" aria-hidden={k !== at}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={`${alt} (${k + 1}/${items.length})`} loading={k === 0 ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" />
            <figcaption className={`absolute left-3 right-[6.5rem] ${bottom} truncate rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white`}>
              <a href={p.page} target="_blank" rel="noopener noreferrer">{p.author} · {p.license}</a>
            </figcaption>
          </figure>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">{t("photoOf", { n: at + 1, total: items.length })}</span>
      <div className={`absolute right-3 flex gap-1 ${bottom}`}>
        <button type="button" onClick={() => goTo(Math.max(0, at - 1))} disabled={at === 0} aria-label={t("prevPhoto")} className="grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white disabled:opacity-40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M15.4 5.4 14 4l-8 8 8 8 1.4-1.4L8.8 12z" /></svg>
        </button>
        <button type="button" onClick={() => goTo(Math.min(items.length - 1, at + 1))} disabled={at === items.length - 1} aria-label={t("nextPhoto")} className="grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white disabled:opacity-40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8.6 18.6 10 20l8-8-8-8-1.4 1.4 6.6 6.6z" /></svg>
        </button>
      </div>
    </div>
  );
}
