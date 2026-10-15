"use client";
import {useEffect} from "react";
import {useAnimate} from "motion/react-mini";
import {movement} from "@/lib/motion";
import {useMotionRoot} from "./MotionProvider";

export default function Pressable() {
  const root = useMotionRoot();
  const [, animate] = useAnimate();
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let pressed: HTMLElement | null = null;
    let current: ReturnType<typeof animate> | undefined;
    function release() {
      if (!pressed) return;
      const target = pressed; pressed = null; current?.stop();
      if (preference.matches) {target.style.removeProperty("transform"); return;}
      current = animate(target, {transform: "none"}, movement.spring);
      current.then(() => target.style.removeProperty("transform"));
    }
    function down(event: PointerEvent) {
      if (event.button !== 0 || preference.matches) return;
      const target = (event.target as Element).closest<HTMLElement>("button[class*='rounded']:not(:disabled), a[class*='rounded']");
      if (!target || !page!.contains(target) || target.closest("[data-lenis-prevent], [role=dialog]")) return;
      release(); pressed = target;
      current = animate(target, {transform: `scale(${movement.pressScale})`}, {duration: movement.pressDuration});
    }
    function keydown(event: KeyboardEvent) {
      if (event.repeat || !["Enter", " "].includes(event.key) || preference.matches) return;
      const target = event.target as HTMLElement;
      if (!target.matches("button[class*='rounded']:not(:disabled), a[class*='rounded']")) return;
      release(); pressed = target;
      current = animate(target, {transform: `scale(${movement.pressScale})`}, {duration: movement.pressDuration});
    }
    function keyup(event: KeyboardEvent) {if (["Enter", " "].includes(event.key)) release();}
    page.addEventListener("pointerdown", down);
    page.addEventListener("keydown", keydown); window.addEventListener("keyup", keyup);
    window.addEventListener("pointerup", release); window.addEventListener("pointercancel", release); window.addEventListener("blur", release);
    preference.addEventListener("change", release);
    return () => {page.removeEventListener("pointerdown", down); page.removeEventListener("keydown", keydown); window.removeEventListener("keyup", keyup); window.removeEventListener("pointerup", release); window.removeEventListener("pointercancel", release); window.removeEventListener("blur", release); preference.removeEventListener("change", release); current?.stop(); pressed?.style.removeProperty("transform");};
  }, [root, animate]);
  return null;
}
