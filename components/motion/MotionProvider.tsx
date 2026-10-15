"use client";
import {createContext, useContext, useRef, type RefObject} from "react";
import {LazyMotion} from "motion/react";
import * as m from "motion/react-m";
import Reveal from "./Reveal";
import Stagger from "./Stagger";
import Parallax from "./Parallax";
import Pressable from "./Pressable";
import SmoothScroll from "./SmoothScroll";

const Root = createContext<RefObject<HTMLElement | null> | null>(null);
const loadFeatures = () => import("./features").then(module => module.default);
export function useMotionRoot() {
  const root = useContext(Root);
  if (!root) throw new Error("Motion controls require MotionProvider");
  return root;
}
// Replaces the existing main, with no extra layout box. Server HTML stays visible.
export default function MotionProvider({children}: {children: React.ReactNode}) {
  const root = useRef<HTMLElement>(null);
  return <LazyMotion features={loadFeatures} strict><Root.Provider value={root}>
    <m.main ref={root} initial={false} className="wide" data-motion-page>
      {children}<Reveal /><Stagger /><Parallax /><Pressable /><SmoothScroll />
    </m.main>
  </Root.Provider></LazyMotion>;
}
