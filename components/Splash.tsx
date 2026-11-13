"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const KEY = "afyon-splash";
const EASE = "cubic-bezier(.22,1,.36,1)";

/**
 * G-011: Açılış. Oturum başına bir kez görünür. A işareti belirir, yazı A'dan iki yana açılır,
 * sonra sayfa A'nın iğnesinden büyüyen bir daireyle ortaya çıkar.
 * Sunucu çıktısında da vardır: oturumda daha önce görüldüyse satır içi betik ilk boyamadan önce gizler.
 */
export default function Splash() {
  const t = useTranslations("splash");
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current; if (!el) return;
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; sessionStorage.setItem(KEY, "1"); } catch { /* depolama kapalı */ }
    if (seen || el.style.display === "none") { setGone(true); return; }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mark = el.querySelector<HTMLElement>("[data-mark]")!, word = el.querySelector<HTMLElement>("[data-word]")!, tag = el.querySelector<HTMLElement>("[data-tag]")!;
    if (reduce) { const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 600, fill: "forwards" }); a.finished.then(() => setGone(true)); return; }
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(80);
      await mark.animate([{ transform: "translateY(30px) scale(.55)", opacity: 0 }, { transform: "none", opacity: 1, offset: .7 }, { transform: "scale(1.03)", offset: .85 }, { transform: "none", opacity: 1 }], { duration: 620, easing: "cubic-bezier(.34,1.4,.64,1)", fill: "both" }).finished;
      await wait(60); if (cancelled) return;
      const mr = mark.getBoundingClientRect(), wr = word.getBoundingClientRect();
      const aX = wr.left + wr.width * 0.455, aY = wr.top + wr.height * 0.52;
      const sc = (wr.width * 0.2) / mr.width, dx = aX - (mr.left + mr.width / 2), dy = aY - (mr.top + mr.height / 2);
      mark.animate([{ transform: "none", opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(${sc})`, opacity: 1, offset: .8 }, { transform: `translate(${dx}px,${dy}px) scale(${sc})`, opacity: 0 }], { duration: 560, easing: EASE, fill: "both" });
      await wait(260);
      word.animate([{ opacity: 1, clipPath: "inset(0 54.5% 0 45.5% round 20px)" }, { opacity: 1, clipPath: "inset(0 0 0 0 round 20px)" }], { duration: 620, easing: EASE, fill: "both" });
      tag.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 450, delay: 250, fill: "both" });
      await wait(850); if (cancelled) return;
      const cx = aX, cy = aY - wr.height * 0.16, R = Math.hypot(innerWidth, innerHeight);
      el.style.background = "transparent";
      el.querySelector<HTMLElement>("[data-fill]")!.style.display = "block";
      const hole = el.querySelector<HTMLElement>("[data-fill]")!;
      [mark, word, tag].forEach((n) => n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" }));
      // Mor zemin, A'nın iğnesinde açılan bir delikten içeriyi gösterir.
      await hole.animate([{ maskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent 0px, #000 1px)`, WebkitMaskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent 0px, #000 1px)` }, { maskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${R}px, #000 ${R + 1}px)`, WebkitMaskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${R}px, #000 ${R + 1}px)` }] as Keyframe[], { duration: 650, easing: "cubic-bezier(.65,0,.25,1)", fill: "forwards" }).finished;
      setGone(true);
    })();
    return () => { cancelled = true; };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} role="presentation" aria-hidden className="fixed inset-0 z-[200] flex items-center justify-center bg-[#4B0266]">
      <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("${KEY}")==="1")document.currentScript.parentElement.style.display="none"}catch(e){}` }} />
      <div data-fill className="absolute inset-0 hidden bg-[#4B0266]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,144,36,.28),transparent_55%)]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-mark src="/brand/2/isaret.webp" alt="" width={560} height={403} className="relative w-[58%] max-w-[260px] opacity-0" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-word src="/brand/2/rotafyon-beyaz-960.webp" alt="" width={960} height={240} className="absolute left-1/2 top-1/2 w-[86%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-0" />
      <p data-tag className="absolute inset-x-0 bottom-16 text-center text-sm font-medium text-white/75 opacity-0">{t("tagline")}</p>
    </div>
  );
}
