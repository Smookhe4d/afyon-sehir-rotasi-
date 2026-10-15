"use client";
import {useEffect} from "react";
import {useAnimate} from "motion/react-mini";
import {movement} from "@/lib/motion";
import {useMotionRoot} from "./MotionProvider";

export default function Stagger() {
  const root = useMotionRoot();
  const [, animate] = useAnimate();
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const controls: ReturnType<typeof animate>[] = [];
    const observed: HTMLElement[] = [];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      observer.unobserve(element);
      if (preference.matches) {element.dataset.shown = ""; return;}
      const index = Number(element.dataset.motionOrder || 0);
      const animation = animate(element, {opacity: [0, 1], transform: [`translateY(${movement.distance}px)`, "none"]}, {
        duration: movement.duration, delay: Math.min(index * movement.stagger, movement.maxDelay), ease: movement.ease,
      });
      controls.push(animation);
      animation.then(() => {element.dataset.shown = ""; element.style.removeProperty("opacity"); element.style.removeProperty("transform");});
    }));
    page.querySelectorAll<HTMLElement>("[data-motion-list]").forEach(list => {
      const bounds = list.getBoundingClientRect();
      const horizontal = getComputedStyle(list).overflowX === "auto";
      Array.from(list.children).forEach((child, index) => {
        const element = child as HTMLElement;
        const box = element.getBoundingClientRect();
        // Do not replay or reveal initially offscreen horizontal cards on swiping.
        if (preference.matches || (horizontal && (box.left >= bounds.right || box.right <= bounds.left))) {element.dataset.shown = ""; return;}
        element.dataset.motionOrder = String(index);
        observed.push(element); observer.observe(element);
      });
    });
    // Children added after the first scan (filters, "show more") appear at once instead of staying hidden.
    const additions = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node instanceof HTMLElement && !observed.includes(node)) node.dataset.shown = "";
    })));
    page.querySelectorAll<HTMLElement>("[data-motion-list]").forEach(list => additions.observe(list, {childList: true}));
    function reduce() {if(preference.matches) {controls.forEach(control => control.stop()); observed.forEach(element => {element.dataset.shown = ""; element.style.removeProperty("opacity"); element.style.removeProperty("transform");});}}
    preference.addEventListener("change", reduce);
    return () => {observer.disconnect(); additions.disconnect(); controls.forEach(control => control.stop()); preference.removeEventListener("change", reduce);};
  }, [root, animate]);
  return null;
}
