"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/Icon";
import CatBadge from "@/components/CatBadge";
import Avatar from "@/components/profile/Avatar";
import { AVATAR_CACHE } from "@/lib/avatars";
import { createClient } from "@/lib/supabase/client";
import type { RouteCategory } from "@/lib/types";
import type { KRoute, KStop } from "./KesfetMap";

const KesfetMap = dynamic(() => import("./KesfetMap"), { ssr: false, loading: () => <div className="absolute inset-0 bg-[#F4EDE0]" /> });

type Chip = { cat: RouteCategory; label: string };

/** G-011: Keşfet kabuğu. Tam ekran harita, üstte cam logo ve tema çipleri, altta sürüklenen panel. */
export default function KesfetUI({ stops, routes, chips, labels, children }: {
  stops: KStop[]; routes: KRoute[]; chips: Chip[];
  labels: { map: string; profile: string; locate: string; tilt: string; grab: string; panel: string; poi?: Record<string, string> };
  children: React.ReactNode;
}) {
  const sheet = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [y, setY] = useState<number | null>(null);
  const [cat, setCat] = useState<RouteCategory | null>(null);
  const [me, setMe] = useState<{ v: string | null; name: string } | null>(null);
  useEffect(() => {
    // G-015: sağ üstte profil görseli. Önce önbellek, sonra oturumdan güncel değer.
    try { const c = localStorage.getItem(AVATAR_CACHE); if (c) setMe(JSON.parse(c)); } catch {}
    let off = false;
    (async () => {
      try {
        const sb = createClient();
        const { data: { user } } = await sb.auth.getUser();
        if (!user) { if (!off) setMe(null); try { localStorage.removeItem(AVATAR_CACHE); } catch {} return; }
        const { data } = await sb.from("profiles").select("avatar_url, display_name").eq("id", user.id).maybeSingle();
        if (off || !data) return;
        const v = { v: data.avatar_url ?? null, name: data.display_name ?? "" };
        setMe(v); try { localStorage.setItem(AVATAR_CACHE, JSON.stringify(v)); } catch {}
      } catch {}
    })();
    return () => { off = true; };
  }, []);
  const yRef = useRef(0);
  const det = useCallback(() => { const H = innerHeight; return { full: 64, mid: Math.round(H * 0.5), peek: H - 250 }; }, []);
  const snap = useCallback((v: number, anim = true) => {
    const d = det(); v = Math.max(d.full, Math.min(innerHeight - 140, v)); yRef.current = v;
    const s = sheet.current; if (!s) return;
    s.style.transition = anim ? "transform .6s cubic-bezier(.2,.9,.25,1.05)" : "none";
    s.style.transform = `translateY(${v}px)`; setY(v);
  }, [det]);

  useEffect(() => {
    if (matchMedia("(min-width: 1024px)").matches) return;
    snap(det().mid, false);
    const s = sheet.current!, b = body.current!;
    let sy = 0, y0 = 0, last = 0, lt = 0, v = 0, drag = false, cand = false;
    const start = (cy: number) => { sy = cy; y0 = yRef.current; last = cy; lt = performance.now(); v = 0; cand = true; drag = false; };
    const move = (cy: number, e: TouchEvent | MouseEvent) => {
      if (!cand) return; const dy = cy - sy, d = det();
      if (!drag) {
        if (Math.abs(dy) < 6) return;
        const atFull = yRef.current <= d.full + 2;
        if (atFull && (dy < 0 || b.scrollTop > 0) && (e.target as HTMLElement).closest("[data-sheet-body]")) { cand = false; return; }
        if ((e.target as HTMLElement).closest("[data-hscroll]") && Math.abs(dy) < 10) return;
        drag = true; s.style.transition = "none";
      }
      if (e.cancelable) e.preventDefault();
      let ny = y0 + dy; if (ny < d.full) ny = d.full - (d.full - ny) * 0.25;
      s.style.transform = `translateY(${ny}px)`; yRef.current = ny;
      const now = performance.now(); v = (cy - last) / Math.max(1, now - lt); last = cy; lt = now;
    };
    const end = () => {
      if (!drag) { cand = false; return; } drag = cand = false;
      const d = det(), proj = yRef.current + v * 220;
      snap([d.full, d.mid, d.peek].reduce((a, c) => (Math.abs(c - proj) < Math.abs(a - proj) ? c : a)));
    };
    const ts = (e: TouchEvent) => start(e.touches[0].clientY), tm = (e: TouchEvent) => move(e.touches[0].clientY, e);
    s.addEventListener("touchstart", ts, { passive: true }); s.addEventListener("touchmove", tm, { passive: false }); s.addEventListener("touchend", end);
    const onResize = () => snap(det().mid, false);
    addEventListener("resize", onResize);
    return () => { s.removeEventListener("touchstart", ts); s.removeEventListener("touchmove", tm); s.removeEventListener("touchend", end); removeEventListener("resize", onResize); };
  }, [det, snap]);

  const full = y !== null && y <= det().full + 2;
  useEffect(() => { if (body.current) body.current.style.overflowY = full || y === null ? "auto" : "hidden"; }, [full, y]);

  const pickCat = (c: RouteCategory) => {
    const next = cat === c ? null : c; setCat(next);
    dispatchEvent(new CustomEvent("kesfet-cat", { detail: next }));
    sheet.current?.setAttribute("data-cat", next ?? "");
  };
  const toggle = () => { const d = det(); snap(yRef.current > d.mid + 5 ? d.mid : yRef.current > d.full + 2 ? d.full : d.mid); };

  return (
    <div data-kesfet className="fixed inset-0 z-0 overflow-hidden lg:top-16">
      <KesfetMap stops={stops} routes={routes} label={labels.map} poiLabel={labels.poi} />
      <div className={`absolute inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex flex-col gap-2.5 transition-opacity duration-300 lg:left-[452px] ${y !== null && y < 150 ? "pointer-events-none opacity-0" : ""}`}>
        <div className="flex items-center gap-2.5 lg:hidden">
          <Link href="/" className="glass sheen flex h-[52px] items-center rounded-full pl-3.5 pr-[18px]" aria-label="rotAfyon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/rotafyon-acik-480.webp" srcSet="/brand/rotafyon-acik-480.webp 1x, /brand/rotafyon-acik-960.webp 2x" alt="rotAfyon" className="h-[30px] w-auto" />
          </Link>
          <span className="flex-1" />
          <Link href="/profil" aria-label={labels.profile} className="glass flex h-[52px] w-[52px] items-center justify-center rounded-full text-ac">{me ? <Avatar value={me.v} name={me.name} size={44} /> : <Icon name="user-circle" size={26} fill />}</Link>
        </div>
        <div data-hscroll className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-2 pt-1 [scrollbar-width:none]">
          {chips.map((c) => {
            const on = cat === c.cat;
            return (
              <button key={c.cat} type="button" aria-pressed={on} onClick={() => pickCat(c.cat)}
                className={`flex h-[42px] shrink-0 items-center gap-2 rounded-full py-0 pl-[5px] pr-3.5 text-sm font-bold ${on ? "bg-ac text-white shadow-btn" : "glass text-navy"}`}>
                <CatBadge cat={c.cat} size={32} radius={999} />{c.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="glass absolute right-3 z-10 flex w-12 flex-col overflow-hidden rounded-2xl transition-opacity duration-300" style={{ top: y === null ? "42%" : Math.min(y - 120, innerHeight * 0.42), opacity: y !== null && y < innerHeight * 0.3 ? 0 : 1 }}>
        <button type="button" aria-label={labels.locate} onClick={() => dispatchEvent(new Event("kesfet-locate"))} className="flex h-12 items-center justify-center text-ac"><Icon name="navigation-arrow" size={22} fill /></button>
        <span className="mx-2 h-px bg-line" />
        <button type="button" aria-label={labels.tilt} onClick={() => dispatchEvent(new Event("kesfet-3d"))} className="flex h-12 items-center justify-center text-ac"><Icon name="mountains" size={22} /></button>
      </div>
      <section ref={sheet} aria-label={labels.panel} data-cat="" style={{ transform: "translateY(50dvh)" }}
        className="absolute inset-x-0 top-0 z-20 flex h-full flex-col rounded-t-[30px] bg-[rgba(250,248,252,.88)] shadow-[0_-10px_40px_-18px_rgba(44,18,66,.45),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-[30px] backdrop-saturate-[180%] will-change-transform lg:bottom-0 lg:left-4 lg:right-auto lg:top-4 lg:h-auto lg:w-[420px] lg:rounded-[30px] lg:!transform-none">
        <button type="button" onClick={toggle} aria-label={labels.grab} className="flex h-[22px] shrink-0 cursor-grab justify-center pt-2 lg:hidden"><i className="h-[5px] w-[38px] rounded-full bg-[rgba(60,30,80,.22)]" /></button>
        <div ref={body} data-sheet-body data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain pb-40 [scrollbar-width:none] lg:pb-8 lg:pt-4">{children}</div>
      </section>
    </div>
  );
}
