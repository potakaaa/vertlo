"use client";

import { useEffect } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/** Page-level scroll. Scrolling itself is the browser's own: direct and immediate under the trackpad,
    with ScrollTrigger's scrub easing the animations instead. This handles two things around it:
    - one ScrollTrigger re-measure whenever the page height changes after load (fonts, client-drawn
      art), since every trigger below the change would otherwise fire early;
    - in-page links, glided to smoothly (instantly for reduced motion), measured with sticky layers
      let go (html[data-measure-flow], see paper.css) so a target inside a sheet that's stuck on screen
      resolves to where it sits in the page. */
export function PageScroll() {
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
      window.scrollTo({ top: Math.max(0, flowTop(target) - 96), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);

    return () => {
      clearTimeout(refreshId);
      pageRo.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
