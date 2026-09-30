"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/** Page-level scroll: Lenis smooth scrolling + smooth in-page anchors, driven by GSAP's ticker so
    ScrollTrigger (pins, scrubs) reads the same scroll position on the same frame; and one
    ScrollTrigger re-measure whenever the page height changes after load (fonts, client-rendered
    art), since every trigger below the change would otherwise fire early. Lenis is off for
    prefers-reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    /* phones: the address bar showing/hiding resizes the viewport; don't re-measure every trigger for it */
    ScrollTrigger.config({ ignoreMobileResize: true });

    let refreshId = 0, pageH = document.body.scrollHeight;
    const pageRo = new ResizeObserver(() => {
      if (document.body.scrollHeight === pageH) return;
      pageH = document.body.scrollHeight;
      clearTimeout(refreshId);
      refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    pageRo.observe(document.body);
    const stopResize = () => { clearTimeout(refreshId); pageRo.disconnect(); };

    if (prefersReducedMotion()) return stopResize;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -64 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    /* no catch-up jumps after a long frame: they read as a stutter while scrubbing */
    gsap.ticker.lagSmoothing(0);
    return () => {
      stopResize();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);
  return null;
}
