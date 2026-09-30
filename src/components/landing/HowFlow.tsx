"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, WIDTH_AND_MOTION, type WidthAndMotion } from "@/lib/motion";
import { SCENE_W, SCENE_H, focusFor, monoFont, paintScene } from "@/components/landing/how-flow/scene";

/* How it works, told as one flow. Steps scroll on the left (below on phones); a sticky pixel-art
   scene on the right (on top on phones) is scrubbed by scroll: providers connect into Vertlo,
   Vertlo splits volume across MIDs, then MID 2 pauses and the rest take its traffic.
   Lanes that are built carry live packets. Reduced motion: static frame per step, no packets. */

export type FlowStep = { kicker?: string; title: string; body: string };


export function HowFlow({ steps, caption }: { steps: FlowStep[]; caption?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current, list = listRef.current, cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!root || !list || !cv || !ctx) return;
    const state = { p: 0 };
    const font = monoFont();
    let sc = 1, dpr = 1, visible = true, still = false, lastP = -1, lastTk = -1;

    const size = () => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      sc = Math.min(r.width / SCENE_W, r.height / SCENE_H);
      const ox = (r.width - SCENE_W * sc) / 2, oy = (r.height - SCENE_H * sc) / 2;
      ctx.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * ox, dpr * oy);
      lastP = -1;
    };

    const render = () => {
      if (!visible) return;
      const tk = still ? 0 : Math.floor(performance.now() / 140);
      const p = Math.round(state.p * 2000) / 2000;
      if (p === lastP && tk === lastTk) return;
      if (p !== lastP) root.style.setProperty("--p", String(p));
      lastP = p; lastTk = tk;
      paintScene(ctx, { p, f: focusFor(p, still), tk, live: !still, sc, font });
    };

    const setStep = (progress: number) => {
      const i = Math.min(steps.length - 1, Math.floor(progress * steps.length));
      setActive((prev) => (prev === i ? prev : i));
      return i;
    };

    const mm = gsap.matchMedia();
    mm.add(
      WIDTH_AND_MOTION,
      (mctx) => {
        const { phone, reduce } = mctx.conditions as WidthAndMotion;
        still = reduce;
        /* the "reading line": screen centre on desktop, centre of the text area under the sticky scene on phones */
        const start = phone ? "top 74%" : "top 50%";
        const end = phone ? "bottom 74%" : "bottom 70%";
        /* phones: flag the scene while it is actually stuck under the header (it sits first in the
           flow, so that's while the flow's top is above the 56px running head), so its cover strip only shows then */
        if (phone && cv.parentElement) {
          const stage = cv.parentElement;
          ScrollTrigger.create({
            trigger: root, start: "top 56px", end: () => `bottom ${56 + stage.offsetHeight}px`,
            toggleClass: { targets: stage, className: "is-stuck" },
          });
        }
        if (reduce) {
          ScrollTrigger.create({
            trigger: list, start, end,
            onUpdate: (self) => { state.p = (setStep(self.progress) + 1) / steps.length; render(); },
            onRefresh: (self) => { state.p = (setStep(self.progress) + 1) / steps.length; render(); },
          });
        } else {
          gsap.to(state, {
            p: 1,
            ease: "none",
            scrollTrigger: { trigger: list, start, end, scrub: 0.6, onUpdate: (self) => setStep(self.progress) },
          });
        }
      },
    );

    size();
    render();
    const ro = new ResizeObserver(() => { size(); render(); });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; render(); });
    io.observe(cv);
    gsap.ticker.add(render);

    return () => {
      gsap.ticker.remove(render);
      ro.disconnect();
      io.disconnect();
      mm.revert();
    };
  }, [steps.length]);

  const cur = steps[active];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="lp-flow" ref={rootRef}>
      <div className="lp-flow-stage" aria-hidden="true">
        <div className="lp-flow-meta">
          <span>
            <b>{pad(active + 1)}</b> / {pad(steps.length)}
            {cur?.kicker ? <span className="lp-flow-meta-k"> · {cur.kicker}</span> : null}
          </span>
          <span className="lp-flow-bar">
            {steps.map((_, i) => (
              <i key={i} style={{ "--k": i } as React.CSSProperties} />
            ))}
          </span>
        </div>
        <canvas ref={canvasRef} className="lp-flow-canvas" />
        {caption ? <p className="pr-cap">{caption}</p> : null}
      </div>
      <div className="lp-flow-steps">
        <span className="lp-flow-rail" aria-hidden="true" />
        <ol ref={listRef}>
        {steps.map((s, i) => (
          <li
            key={i}
            className="lp-flow-step"
            data-state={i < active ? "done" : i === active ? "active" : "next"}
            aria-current={i === active ? "step" : undefined}
          >
            <span className="lp-flow-num" aria-hidden="true">{i + 1}</span>
            <div className="lp-flow-copy">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </div>
  );
}
