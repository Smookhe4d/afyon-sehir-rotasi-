import {spring} from "motion";
// All movement values live here. Visual design tokens remain in globals.css.
export const movement = {
  duration: 0.45,
  stagger: 0.06,
  maxDelay: 0.3,
  distance: 12,
  ease: [0.22, 0.8, 0.3, 1] as [number, number, number, number],
  pressScale: 0.97,
  pressDuration: 0.1,
  spring: {type: spring, stiffness: 400, damping: 24, mass: 0.6},
  parallaxRatio: 0.15,
  parallaxSpeed: 0.12,
  scrollLerp: 0.1,
  restoreFrames: 2,
};
