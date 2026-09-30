"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/vertlo";
import { navLinks } from "@/content/landing";

/**
 * The header: a flat strip on the page's own ground, no pane. Logo, plain links, the one CTA.
 * It gains a hairline once the page has scrolled, slides away while reading down and returns on
 * any upward scroll. Phones get the logo, the CTA and a menu button.
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
  const [hidden, setHidden] = useState(false);

  // Keep the latest menu state readable from the scroll listener without re-binding it.
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
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
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const reveal = () => setHidden(false);

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    header.addEventListener("focusin", reveal);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      header.removeEventListener("focusin", reveal);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header ref={headerRef} className="rt-header" data-scrolled={scrolled || undefined} data-hidden={hidden || undefined}>
      <div className="rt-header-in">
        <Logo href="#top" />
        <nav className="rt-nav" aria-label="Main">
          <ul>
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="rt-header-end">
          <a className="rt-nav-login" href="#book">
            Login
          </a>
          <a className="rt-btn rt-btn--sm" href="#book">
            <span>Book a call</span>
          </a>
          <button
            type="button"
            className="rt-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="rt-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="rt-burger-i rt-burger-i--bars" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
            <svg className="rt-burger-i rt-burger-i--x" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {/* Always mounted so opening and closing are both interruptible CSS transitions. */}
        <ul id="rt-menu" className="rt-menu" data-open={open || undefined} inert={!open}>
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
    </header>
  );
}
