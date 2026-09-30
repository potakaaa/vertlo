"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* The one place GSAP is set up. Import gsap / ScrollTrigger from here so the plugin is
   registered once, and use MQ for breakpoints so JS and landing.css agree (phone = ≤720px). */

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export const MQ = {
  phone: "(max-width: 720px)",
  desktop: "(min-width: 721px)",
  reduce: "(prefers-reduced-motion: reduce)",
  motionOk: "(prefers-reduced-motion: no-preference)",
} as const;

/** gsap.matchMedia conditions for scenes that differ by width and honour reduced motion.
    Both widths are listed because a handler only runs while at least one condition matches. */
export const WIDTH_AND_MOTION = { phone: MQ.phone, desktop: MQ.desktop, reduce: MQ.reduce };
export type WidthAndMotion = { phone: boolean; desktop: boolean; reduce: boolean };

export const prefersReducedMotion = () => window.matchMedia(MQ.reduce).matches;

export { gsap, ScrollTrigger };
