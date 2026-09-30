"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Logo, Nav } from "@/components/vertlo";
import { navLinks } from "@/content/landing";

/**
 * Sticky liquid-glass header: the design-system Nav on desktop, a compact pill with a working menu on phones.
 * The glass switches to its dark tone while it floats over a black `vt-bleed` band.
 */
/** Below this scroll depth the header never hides. */
const HIDE_AFTER = 160;
/** Continuous downward travel before the header slides away. */
const HIDE_TRAVEL = 24;
/** Upward travel that brings it back: small, so any intent to reach the nav reveals it. */
const SHOW_TRAVEL = 6;

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Keep the latest menu state readable from the scroll listener without re-binding it.
  const openRef = useRef(open);
  openRef.current = open;

  // Scroll: compact once off the top, slide away while reading down, return on any upward scroll.
  // Tone: probe the resting centre of whichever nav is visible against the dark bands.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const bands = Array.from(document.querySelectorAll<HTMLElement>(".vt-bleed"));
    let raf = 0;
    let lastY = window.scrollY;
    let travel = 0; // distance scrolled in the current direction; signed

    const update = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      const dy = y - lastY;
      lastY = y;
      if (dy !== 0) travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;

      setScrolled(y > 8);
      if (y < HIDE_AFTER || openRef.current || header.contains(document.activeElement)) setHidden(false);
      else if (travel > HIDE_TRAVEL) setHidden(true);
      else if (travel < -SHOW_TRAVEL) setHidden(false);

      const nav = Array.from(header.querySelectorAll<HTMLElement>(".vt-nav, .lp-mnav")).find(
        (n) => n.offsetParent !== null,
      );
      if (!nav) return;
      // offsetTop ignores the compact/hide transforms, so the tone is ready before the nav comes back.
      const probe = header.getBoundingClientRect().top + nav.offsetTop + nav.offsetHeight / 2;
      setDark(bands.some((b) => {
        const br = b.getBoundingClientRect();
        return br.top <= probe && br.bottom >= probe;
      }));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const reveal = () => setHidden(false);

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    header.addEventListener("focusin", reveal);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      header.removeEventListener("focusin", reveal);
    };
  }, []);

  // Desktop links: a glass lens that glides to the hovered or focused link.
  useEffect(() => {
    const list = headerRef.current?.querySelector<HTMLElement>(".vt-nav-links");
    if (!list) return;

    const moveTo = (e: Event) => {
      const li = (e.target as Element).closest?.("li");
      if (!li || !list.contains(li)) return;
      // Appearing from hidden: jump into place and only fade in, instead of sliding from the last spot.
      const snap = list.dataset.lens !== "on";
      if (snap) list.dataset.lensSnap = "";
      list.style.setProperty("--lens-x", `${li.offsetLeft - 16}px`);
      list.style.setProperty("--lens-w", `${li.offsetWidth + 32}px`);
      if (snap) {
        void list.offsetWidth;
        delete list.dataset.lensSnap;
      }
      list.dataset.lens = "on";
    };
    const hide = () => delete list.dataset.lens;
    const onFocusOut = (e: FocusEvent) => {
      if (!list.contains(e.relatedTarget as Node | null)) hide();
    };

    list.addEventListener("pointerover", moveTo);
    list.addEventListener("focusin", moveTo);
    list.addEventListener("pointerleave", hide);
    list.addEventListener("focusout", onFocusOut);
    return () => {
      list.removeEventListener("pointerover", moveTo);
      list.removeEventListener("focusin", moveTo);
      list.removeEventListener("pointerleave", hide);
      list.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="lp-header"
      data-scrolled={scrolled || undefined}
      data-hidden={hidden || undefined}
      data-tone={dark ? "dark" : "light"}
    >
      <div className="lp-wrap lp-header-in">
        <div className="lp-nav-d">
          <Nav links={navLinks} scrolled={scrolled} loginHref="#book" ctaHref="#book" />
        </div>

        <div className="lp-nav-m">
          <nav className="lp-mnav" aria-label="Main">
            <Logo href="#top" />
            <div className="lp-mnav-end">
              <Button size="sm" href="#book">
                Book a call
              </Button>
              <button
                type="button"
                className="lp-burger"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="lp-mmenu"
                onClick={() => setOpen((v) => !v)}
              >
                <svg
                  className="lp-burger-i lp-burger-i--bars"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 8h16M4 16h16" />
                </svg>
                <svg
                  className="lp-burger-i lp-burger-i--x"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </nav>
          {/* Always mounted so opening and closing are both interruptible CSS transitions. */}
          <ul id="lp-mmenu" className="lp-mmenu" data-open={open || undefined}>
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#book" onClick={() => setOpen(false)}>
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
