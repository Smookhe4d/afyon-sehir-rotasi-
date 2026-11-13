"use client";
import { useRef, useState } from "react";

export type AlbumPhoto = { src: string; alt: string; rep?: boolean };

/** G-015: durak fotoğraf albümü. Yatay kaydırmalı, karta oturan görseller ve sayaç. */
export default function StopAlbum({ title, photos, repLabel }: { title: string; photos: AlbumPhoto[]; repLabel: string }) {
  const box = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0);
  if (photos.length < 2) return null;
  const onScroll = () => { const el = box.current; if (!el) return; const w = el.firstElementChild?.clientWidth ?? 1; setI(Math.min(photos.length - 1, Math.round(el.scrollLeft / (w + 10)))); };
  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between"><h2 className="font-display text-xl font-semibold">{title}</h2><span className="text-[12px] font-semibold tabular-nums text-mute">{i + 1} / {photos.length}</span></div>
      <ul ref={box} onScroll={onScroll} className="-mx-4 mt-2.5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none]" aria-label={title}>
        {photos.map((p, k) => (
          <li key={p.src} className="relative aspect-[4/3] w-[82%] shrink-0 snap-start overflow-hidden rounded-[22px] bg-sand shadow-card lg:w-[46%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} loading={k < 2 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" />
            {p.rep && <span className="absolute left-2.5 top-2.5 rounded-full bg-black/50 px-2 py-0.5 text-[10.5px] font-semibold text-white">{repLabel}</span>}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-center gap-1.5" aria-hidden>{photos.map((p, k) => <span key={p.src} className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-4 bg-ac" : "w-1.5 bg-line"}`} />)}</div>
    </section>
  );
}
