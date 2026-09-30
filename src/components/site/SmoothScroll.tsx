"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/** Page-level scroll: Lenis smooth scrolling + smooth in-page links, driven by GSAP's ticker so
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

    /* In-page links, measured with sticky layers let go (html[data-measure-flow], see paper.css): a
       target inside a sheet that's stuck on screen resolves to where it sits in the page. */
    let lenis: Lenis | null = null;
    const flowTop = (el: HTMLElement) => {
      const root = document.documentElement;
      root.setAttribute("data-measure-flow", "");
      const y = el.getBoundingClientRect().top + window.scrollY;
      root.removeAttribute("data-measure-flow");
      return y;
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      const target = a && a.hash.length > 1 ? document.getElementById(decodeURIComponent(a.hash.slice(1))) : null;
      if (!target) return;
      e.preventDefault();
      const y = Math.max(0, flowTop(target) - 96);
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y });
    };
    document.addEventListener("click", onClick);
    const stopAll = () => { stopResize(); document.removeEventListener("click", onClick); };

    if (prefersReducedMotion()) return stopAll;
    const smooth = new Lenis({ lerp: 0.1 });
    lenis = smooth;
    smooth.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => smooth.raf(time * 1000);
    gsap.ticker.add(tick);
    /* no catch-up jumps after a long frame: they read as a stutter while scrubbing */
    gsap.ticker.lagSmoothing(0);
    return () => {
      stopAll();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      smooth.off("scroll", ScrollTrigger.update);
      smooth.destroy();
    };
  }, []);
  return null;
}
