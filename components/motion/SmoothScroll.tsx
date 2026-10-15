"use client";
import {useEffect} from "react";
import type Lenis from "lenis";
import {movement} from "@/lib/motion";

// Each history entry needs its own position, including repeated visits to one URL.
const positions = new Map<string, number>();
let returning: string | null = null;
let watching = false;
function historyKey() {
  if (!history.state?.afyonScroll) history.replaceState({...history.state, afyonScroll: crypto.randomUUID()}, "");
  return history.state.afyonScroll as string;
}
export default function SmoothScroll() {
  useEffect(() => {
    if (!watching) {
      window.addEventListener("popstate", event => {returning = event.state?.afyonScroll ?? null;});
      watching = true;
    }
    const fine = matchMedia("(pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const key = historyKey();
    const pathname = location.pathname;
    let leaving = false;
    let lenis: Lenis | undefined;
    let generation = 0;
    let frame = 0;
    const fromHistory = returning === key;
    const previousY = fromHistory ? positions.get(key) : undefined;
    let restoring = fromHistory;
    returning = null;
    async function setup() {
      const request = ++generation;
      lenis?.destroy(); lenis = undefined;
      delete document.documentElement.dataset.smoothScroll;
      if (fine.matches && !reduced.matches) {
        // Touch and reduced-motion sessions never download the smooth-scroll code.
        const {default: Lenis} = await import("lenis");
        if (request !== generation) return;
        lenis = new Lenis({autoRaf: true, lerp: movement.scrollLerp, smoothWheel: true, syncTouch: false, anchors: true,
          prevent: element => Boolean(element.closest("[data-lenis-prevent], [role=dialog], dialog"))});
        document.documentElement.dataset.smoothScroll = "on";
        lenis.scrollTo(window.scrollY, {immediate: true});
      }
    }
    setup();
    // New page: reset Lenis as well as native scroll. Back/forward: restore that entry.
    let remaining = movement.restoreFrames;
    function restore() {
      if (remaining-- > 0) {frame = requestAnimationFrame(restore); return;}
      if (fromHistory) {
        const y = previousY ?? window.scrollY;
        if (lenis) lenis.scrollTo(y, {immediate: true}); else window.scrollTo({top: y, behavior: "instant"});
        if (Math.abs(window.scrollY - y) < 1) {restoring = false; resize.disconnect();}
      } else if (!location.hash) {
        if (lenis) lenis.scrollTo(0, {immediate: true});
        else window.scrollTo({top: 0, behavior: "instant"});
      }
    }
    // A returning page can regain height after weather/lazy content mounts.
    const resize = new ResizeObserver(() => {if (restoring) restore();});
    if (restoring) resize.observe(document.body);
    frame = requestAnimationFrame(restore);
    function save() {if (!leaving && !restoring && location.pathname === pathname && history.state?.afyonScroll === key) positions.set(key, window.scrollY);}
    function interact() {restoring = false; resize.disconnect();}
    function navigate(event: MouseEvent) {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!anchor || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const destination = new URL(anchor.href);
      if (destination.origin === location.origin && destination.pathname !== pathname && !anchor.target) {save(); leaving = true;}
    }
    function pop() {leaving = true;}
    window.addEventListener("scroll", save, {passive: true});
    window.addEventListener("wheel", interact, {passive: true}); window.addEventListener("touchstart", interact, {passive: true}); window.addEventListener("keydown", interact);
    document.addEventListener("click", navigate, true); window.addEventListener("popstate", pop);
    fine.addEventListener("change", setup); reduced.addEventListener("change", setup);
    return () => {generation++; cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener("scroll", save); window.removeEventListener("wheel", interact); window.removeEventListener("touchstart", interact); window.removeEventListener("keydown", interact); document.removeEventListener("click", navigate, true); window.removeEventListener("popstate", pop); fine.removeEventListener("change", setup); reduced.removeEventListener("change", setup); lenis?.destroy(); delete document.documentElement.dataset.smoothScroll;};
  }, []);
  return null;
}
