"use client";
import {useEffect} from "react";
import {useAnimate} from "motion/react-mini";
import {movement} from "@/lib/motion";
import {useMotionRoot} from "./MotionProvider";

export default function Reveal() {
  const root = useMotionRoot();
  const [, animate] = useAnimate();
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const finished = new WeakSet<Element>();
    const running = new Set<ReturnType<typeof animate>>();
    const elements = new Set<HTMLElement>();
    function show(element: HTMLElement) {
      if (finished.has(element)) return;
      finished.add(element);
      if (preference.matches) {element.dataset.shown = ""; return;}
      const controls = animate(element, {opacity: [0, 1], transform: [`translateY(${movement.distance}px)`, "none"]}, {
        duration: movement.duration, ease: movement.ease,
      });
      running.add(controls);
      controls.then(() => {
        running.delete(controls);
        element.dataset.shown = "";
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
      });
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { show(entry.target as HTMLElement); observer.unobserve(entry.target); }
    }));
    // Opening elements ([data-enter]) animate in CSS. Only scroll reveals are handled here.
    function scan() {
      page!.querySelectorAll<HTMLElement>("[data-reveal]").forEach(element => {
        if (elements.has(element)) return;
        elements.add(element);
        if (preference.matches) element.dataset.shown = "";
        else observer.observe(element);
      });
    }
    const mutations = new MutationObserver(scan);
    mutations.observe(page, {childList: true, subtree: true});
    scan();
    function reduce() {
      if (!preference.matches) return;
      running.forEach(control => control.stop()); running.clear();
      elements.forEach(element => {element.dataset.shown = ""; element.style.removeProperty("opacity"); element.style.removeProperty("transform");});
    }
    preference.addEventListener("change", reduce);
    return () => {observer.disconnect(); mutations.disconnect(); preference.removeEventListener("change", reduce); reduce();};
  }, [root, animate]);
  return null;
}
