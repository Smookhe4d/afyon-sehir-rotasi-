"use client";
import {useEffect} from "react";
import {movement} from "@/lib/motion";
import {useMotionRoot} from "./MotionProvider";

export default function Parallax() {
  const root = useMotionRoot();
  useEffect(() => {
    const images = root.current?.querySelectorAll<HTMLElement>("[data-parallax]");
    if (!images) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    function update() {
      frame = 0;
      images!.forEach(image => {
        const height = image.offsetHeight;
        const y = preference.matches ? 0 : Math.min(Math.max(window.scrollY, 0) * movement.parallaxSpeed, height * movement.parallaxRatio);
        // Cover images expand only while moving, so neither edge exposes the background.
        const scale = image.dataset.parallax === "cover" && height ? 1 + 2 * y / height : 1;
        image.style.transform = y ? `translateY(${y}px) scale(${scale})` : "";
      });
    }
    function schedule() {if (!frame) frame = requestAnimationFrame(update);}
    window.addEventListener("scroll", schedule, {passive: true});
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule); update();
    return () => {cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); preference.removeEventListener("change", schedule); images.forEach(image => image.style.removeProperty("transform"));};
  }, [root]);
  return null;
}
