"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/* Flip words (no container): the current word blurs up and out while the next one resolves letter by
   letter. The slot eases to each word's measured width, so a centred headline glides instead of jumping.
   Screen readers get the first word as plain text. Paused offscreen and in background tabs; reduced
   motion keeps the first word. */

// Visible and measured words are split the same way, so the measured widths match what renders.
const letters = (w: string, stagger = false) =>
  Array.from(w).map((ch, k) => (
    <span key={k} style={stagger ? { animationDelay: `${k * 28}ms` } : undefined}>
      {ch}
    </span>
  ));

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function FlipWords({ words, interval = 2600 }: { words: string[]; interval?: number }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [{ i, prev }, setFlip] = useState<{ i: number; prev: number | null }>({ i: 0, prev: null });
  const [widths, setWidths] = useState<number[] | null>(null);

  // Measure every word in the live font; re-measure when fonts load or the headline resizes.
  useIsoLayoutEffect(() => {
    const box = measureRef.current;
    if (!box) return;
    const measure = () => setWidths(Array.from(box.children, (c) => (c as HTMLElement).getBoundingClientRect().width));
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    // The measurer is out of flow and has no size of its own; watch the headline it sits in.
    ro.observe(box.closest("h1") ?? box);
    return () => ro.disconnect();
  }, [words]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || words.length < 2 || prefersReducedMotion()) return;
    let visible = false;
    let timer = 0;
    const tick = () => setFlip((s) => ({ prev: s.i, i: (s.i + 1) % words.length }));
    const sync = () => {
      window.clearInterval(timer);
      if (visible && document.visibilityState === "visible") timer = window.setInterval(tick, interval);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [words.length, interval]);

  const word = words[i];
  return (
    <span ref={rootRef} className="lp-flip" style={widths ? { width: widths[i] } : undefined}>
      <span className="sr-only">{words[0]}</span>
      <span aria-hidden="true">
        {prev !== null && (
          <span key={`out-${prev}-${i}`} className="lp-flip-out">
            {words[prev]}
          </span>
        )}
        {/* Letters only animate after the first flip, so the page-load entrance stays in charge. */}
        <span key={`in-${i}`} className="lp-flip-in" data-animate={prev !== null || undefined}>
          {letters(word, true)}
        </span>
      </span>
      <span ref={measureRef} className="lp-flip-measure" aria-hidden="true">
        {words.map((w) => (
          <span key={w}>{letters(w)}</span>
        ))}
      </span>
    </span>
  );
}
