"use client";
import {createContext, useContext, useEffect, useRef, type RefObject} from "react";
import Reveal from "./Reveal";
import Stagger from "./Stagger";
import Parallax from "./Parallax";
import Pressable from "./Pressable";
import SmoothScroll from "./SmoothScroll";

const Root = createContext<RefObject<HTMLElement | null> | null>(null);
export function useMotionRoot() {
  const root = useContext(Root);
  if (!root) throw new Error("Motion controls require MotionProvider");
  return root;
}
// Replaces the existing main, with no extra layout box. Server HTML stays visible.
export default function MotionProvider({children}: {children: React.ReactNode}) {
  const root = useRef<HTMLElement>(null);
  // Tells the boot script in layout.tsx that hydration happened, so reveal targets stay under JS control.
  useEffect(() => {(window as Window & {__afyonMotion?: boolean}).__afyonMotion = true;}, []);
  // A plain main element: animations run through motion's small animate() helper, so the LazyMotion runtime is not needed.
  return <Root.Provider value={root}>
    <main ref={root} className="wide" data-motion-page>
      {children}<Reveal /><Stagger /><Parallax /><Pressable /><SmoothScroll />
    </main>
  </Root.Provider>;
}
