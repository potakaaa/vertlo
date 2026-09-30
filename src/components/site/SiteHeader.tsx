"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Logo, Nav } from "@/components/vertlo";
import { navLinks } from "@/content/landing";

/**
 * Sticky header: the design-system Nav on desktop, a compact bar with a working menu on phones. It
 * stays on screen (compact once scrolled) so "Book a call" is always one tap away. It switches to its
 * dark tone while it floats over a dark `vt-bleed` band.
 */

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  // Scroll: compact once off the top. Tone: probe the centre of whichever nav is visible against the dark bands.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const bands = Array.from(document.querySelectorAll<HTMLElement>(".vt-bleed"));
    let raf = 0;

    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);

      const nav = Array.from(header.querySelectorAll<HTMLElement>(".vt-nav, .lp-mnav")).find(
        (n) => n.offsetParent !== null,
      );
      if (!nav) return;
      // offsetTop ignores the compact transform, so the probe sits on the nav's resting centre.
      const probe = header.getBoundingClientRect().top + nav.offsetTop + nav.offsetHeight / 2;
      setDark(bands.some((b) => {
        const br = b.getBoundingClientRect();
        return br.top <= probe && br.bottom >= probe;
      }));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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
      data-tone={dark ? "dark" : "light"}
    >
      <div className="lp-wrap lp-header-in">
        <div className="lp-nav-d">
          <Nav links={navLinks} scrolled={scrolled} loginHref={false} ctaHref="#book" />
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
          </ul>
        </div>
      </div>
    </header>
  );
}
