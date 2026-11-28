"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Author = { name: string; uri: string };
type G = { ref: string; authors: Author[] };

/**
 * G-023: durağın Google Haritalar'daki güncel fotoğrafları. Sunucuda anahtar varsa mevcut fotoğrafın
 * üstüne kaydırılabilir bir galeri açılır. Her fotoğrafta çekenlerin adı ve "Google Maps" atfı görünür
 * (Google kuralı: çevrilmez, en az 12 px). Fotoğraf dosyası ancak görünür olunca istenir.
 * Anahtar yoksa ya da fotoğraf gelmezse hiçbir şey çizmez, alttaki fotoğraf kalır.
 */
export default function GooglePhotos({ id, alt, className = "", lift = false }: { id: string; alt: string; className?: string; /** Altta üst üste binen kart varsa atıf yukarı alınır */ lift?: boolean }) {
  const t = useTranslations("g023");
  const [list, setList] = useState<G[] | null>(null);
  const [maps, setMaps] = useState("");
  const [at, setAt] = useState(0);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let off = false;
    fetch(`/api/yer-foto?id=${encodeURIComponent(id)}`).then((r) => (r.status === 200 ? r.json() : null)).then((d) => {
      if (!off && d?.photos?.length) { setList(d.photos); setMaps(d.maps ?? ""); }
    }).catch(() => {});
    return () => { off = true; };
  }, [id]);

  if (!list) return null;
  const goTo = (k: number) => { const el = strip.current; if (el) el.scrollTo({ left: k * el.clientWidth, behavior: "smooth" }); };
  const bottom = lift ? "bottom-12 lg:bottom-3" : "bottom-3";
  return (
    <div className={`absolute inset-0 overflow-hidden bg-sand ${className}`} role="group" aria-roledescription={t("gallery")} aria-label={alt}>
      <div ref={strip} className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
        onScroll={(e) => { const el = e.currentTarget; setAt(Math.round(el.scrollLeft / el.clientWidth)); }}>
        {list.map((p, k) => (
          <figure key={p.ref} className="relative h-full w-full shrink-0 snap-center" aria-hidden={k !== at}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/yer-foto?id=${encodeURIComponent(id)}&foto=${encodeURIComponent(p.ref)}`} alt={`${alt} (${k + 1}/${list.length})`}
              loading={k === 0 ? "eager" : "lazy"} referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
            <figcaption className={`absolute left-3 right-[6.5rem] ${bottom} flex flex-wrap items-center gap-x-1 rounded-2xl bg-black/60 px-2.5 py-1 text-[12px] font-normal leading-snug text-white`}>
              {p.authors.map((a, n) => (
                <span key={a.name + n}>{a.uri ? <a href={a.uri} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{a.name}</a> : a.name}{n < p.authors.length - 1 ? "," : ""}</span>
              ))}
              {p.authors.length > 0 && <span aria-hidden>·</span>}
              <a href={maps} target="_blank" rel="noopener noreferrer" translate="no" lang="en">Google Maps</a>
            </figcaption>
          </figure>
        ))}
      </div>
      {list.length > 1 && <>
        <span className="sr-only" aria-live="polite">{t("photoOf", { n: at + 1, total: list.length })}</span>
        <div className={`absolute right-3 flex gap-1 ${bottom}`}>
          <button type="button" onClick={() => goTo(Math.max(0, at - 1))} disabled={at === 0} aria-label={t("prevPhoto")} className="grid h-11 w-11 place-items-center text-white disabled:opacity-40">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M15.4 5.4 14 4l-8 8 8 8 1.4-1.4L8.8 12z" /></svg>
          </button>
          <button type="button" onClick={() => goTo(Math.min(list.length - 1, at + 1))} disabled={at === list.length - 1} aria-label={t("nextPhoto")} className="grid h-11 w-11 place-items-center text-white disabled:opacity-40">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8.6 18.6 10 20l8-8-8-8-1.4 1.4 6.6 6.6z" /></svg>
          </button>
        </div>
      </>}
    </div>
  );
}
