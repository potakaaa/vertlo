"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { headHeight, scrollTargetFor } from "@/components/landing/Edition";

/** Page-level scroll: Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger (pins, scrubs)
    reads the same scroll position on the same frame; one ScrollTrigger re-measure whenever the page
    height changes after load (fonts, client-rendered art); and in-page links. A link to a page of the
    edition scrolls to where that page lies open (inside a pinned section that's not the page's own
    offset), so anchors resolve through scrollTargetFor; anything else lands under the running head.
    `press:scrollto` events (keyboard focus on a closed page) scroll the same way. Lenis is off for
    prefers-reduced-motion, and scrolling jumps instead. */
export function SmoothScroll() {
  useEffect(() => {
    /* phones: the address bar showing/hiding resizes the viewport; don't re-measure every trigger for it */
    ScrollTrigger.config({ ignoreMobileResize: true });

    let refreshId = 0, pageH = document.body.scrollHeight;
    const pageRo = new ResizeObserver(() => {
      if (document.body.scrollHeight === pageH) return;
      pageH = document.body.scrollHeight;
      clearTimeout(refreshId);
      // triggers can be created out of page order (a remount, a late effect); measure them top to bottom
      refreshId = window.setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 150);
    });
    pageRo.observe(document.body);

    const lenis = prefersReducedMotion() ? null : new Lenis({ lerp: 0.1 });
    const scrollTo = (y: number, immediate = false) => {
      if (lenis) lenis.scrollTo(y, { immediate, duration: immediate ? 0 : 1.4 });
      else window.scrollTo(0, y);
    };
    const targetOf = (id: string) => {
      const page = scrollTargetFor(id);
      if (page !== null) return page;
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY - headHeight() : null;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = decodeURIComponent(a.hash.slice(1));
      const y = id ? targetOf(id) : 0;
      if (y === null) return;
      e.preventDefault();
      scrollTo(y);
      history.replaceState(null, "", id ? `#${id}` : location.pathname);
    };
    const onScrollTo = (e: Event) => {
      const y = (e as CustomEvent<number | null>).detail;
      if (typeof y === "number") scrollTo(y);
    };
    document.addEventListener("click", onClick);
    window.addEventListener("press:scrollto", onScrollTo);

    /* a link from elsewhere (…/#routing): once the triggers have measured (and, for a page of the
       edition, once its section has said where the page lies open), go there */
    const onFirstRefresh = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el?.closest(".pr-ed") && scrollTargetFor(id) === null) return; // not measured yet: wait for the next refresh
      ScrollTrigger.removeEventListener("refresh", onFirstRefresh);
      const y = el ? targetOf(id) : null;
      if (y !== null) scrollTo(y, true);
    };
    ScrollTrigger.addEventListener("refresh", onFirstRefresh);

    let tick: ((time: number) => void) | null = null;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      /* no catch-up jumps after a long frame: they read as a stutter while scrubbing */
      gsap.ticker.lagSmoothing(0);
    }
    return () => {
      clearTimeout(refreshId);
      pageRo.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("press:scrollto", onScrollTo);
      ScrollTrigger.removeEventListener("refresh", onFirstRefresh);
      if (lenis && tick) {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
      }
    };
  }, []);
  return null;
}
