"use client";

import { useEffect, useState } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/motion";
import { sheets as SHEETS } from "@/content/landing";

/* The paper journey, run over the server-rendered markup (Sections.tsx, Paper.tsx):
   - the stack: each sheet is sticky with its bottom edge at the viewport's (a tall sheet scrolls
     normally, then stays), so the next one slides over it; measured here into --sheet-h.
   - arrival and cover: a sheet comes up with a slight turn and settles; as the next one covers it,
     it sinks back a little under a shadow.
   - on load, the banknote is printed: the medallion inks in, the microprint runs out from it, the
     serial rolls into place like a numbering machine, the headline and the engraved "1" print.
   - in the sheets: each letter types on (the termination's verdict is then struck through and
     Vertlo's note typed under it), and the cheque's signature writes itself.
   - a slim rail in the left margin shows which sheet you're on (wide screens only).
   Reduced motion: the stack still stacks (it's layout), nothing else moves. */

type Current = { n: number; title: string } | null;
const pad = (n: number) => String(n).padStart(2, "0");

export function PaperMotion() {
  const [current, setCurrent] = useState<Current>(null);

  useEffect(() => {
    const stack = document.querySelector<HTMLElement>(".pp-stack");
    if (!stack) return;
    const sheets = [...stack.querySelectorAll<HTMLElement>(":scope > .pp-sheet")];

    /* sticky offsets: a sheet sticks once its bottom edge meets the viewport's */
    const measure = () => sheets.forEach((s) => s.style.setProperty("--sheet-h", `${s.offsetHeight}px`));
    measure();
    const ro = new ResizeObserver(measure);
    sheets.forEach((s) => ro.observe(s));

    /* ScrollTrigger measures every trigger from the page's layout. A sheet that is stuck on screen
       would be measured where it sits, not where it belongs, so let the stack go for the length of
       each refresh (html[data-measure-flow], paper.css). Refresh is synchronous: nothing paints between. */
    const root = document.documentElement;
    const letGo = () => root.setAttribute("data-measure-flow", "");
    const settle = () => root.removeAttribute("data-measure-flow");
    ScrollTrigger.addEventListener("refreshInit", letGo);
    ScrollTrigger.addEventListener("refresh", settle);

    /* the index: the last sheet whose top has passed the middle of the screen */
    let raf = 0;
    const track = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      const sr = stack.getBoundingClientRect();
      if (sr.top > mid || sr.bottom < mid) return setCurrent(null);
      let on: HTMLElement | null = null;
      for (const s of sheets) if (s.getBoundingClientRect().top <= mid) on = s;
      setCurrent(on ? { n: Number(on.dataset.n), title: on.dataset.title ?? "" } : null);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(track); };
    window.addEventListener("scroll", onScroll, { passive: true });
    track();

    const mm = gsap.matchMedia();
    mm.add({ motion: MQ.motionOk, phone: MQ.phone }, (ctx) => {
      const { motion, phone } = ctx.conditions as { motion: boolean; phone: boolean };
      if (!motion) return;

      /* ── the banknote, laid down and printed ── */
      const note = document.querySelector<HTMLElement>("[data-note]");
      if (note) {
        const q = gsap.utils.selector(note);
        const intro = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
        intro
          .fromTo(note, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "none" })
          .fromTo(q(".pp-note-medallion"), { "--ink": "-20%", rotate: -24 }, { "--ink": "115%", rotate: 0, duration: 1.6, ease: "power2.inOut" }, 0.3)
          .from(q(".pp-note-serial"), { autoAlpha: 0, duration: 0.6 }, 0.6)
          .from(q(".pp-note-micro"), { clipPath: (i: number) => (i ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)"), duration: 0.9, ease: "power2.inOut" }, 0.5)
          .from(q(".lp-h1, .lp-hero-sub"), { autoAlpha: 0, y: 18, stagger: 0.12, duration: 0.8 }, 0.55)
          .from(q(".pp-note-numeral"), { autoAlpha: 0, y: 12, duration: 1, ease: "expo.out" }, 0.8);
        const cta = document.querySelector(".lp-hero-cta");
        if (cta) intro.fromTo(cta, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.95);

        /* the serial, rolled into place like a numbering machine: its digits spin, then settle left to right */
        const serial = note.querySelector<HTMLElement>(".pp-note-serial");
        if (serial) {
          const final = serial.textContent ?? "";
          const digits = final.replace(/\D/g, "").length;
          const roll = { p: 0 };
          intro.to(roll, {
            p: 1, duration: 0.9, ease: "none",
            onUpdate: () => {
              const settled = Math.floor(roll.p * (digits + 1));
              let d = 0;
              serial.textContent = final.replace(/\d/g, (ch) => (d++ < settled ? ch : String(Math.floor(Math.random() * 10))));
            },
            onComplete: () => { serial.textContent = final; },
          }, 0.6);
        }
      }

      /* ── the stack: arrive, settle, sink when covered ── */
      sheets.forEach((sheet, i) => {
        const tilt = sheet.querySelector<HTMLElement>(".pp-sheet-tilt");
        const paper = sheet.querySelector<HTMLElement>(".pp-sheet-paper");
        const shade = sheet.querySelector<HTMLElement>(".pp-sheet-shade");
        if (!tilt || !paper) return;
        const turn = (i % 2 ? -1 : 1) * (phone ? 0.6 : 1);
        gsap.fromTo(
          tilt,
          { rotate: turn, y: phone ? 24 : 48, transformOrigin: i % 2 ? "0% 0%" : "100% 0%" },
          { rotate: 0, y: 0, ease: "none", scrollTrigger: { trigger: sheet, start: "top bottom", end: "top 45%", scrub: 0.6 } },
        );
        const next = sheets[i + 1];
        if (!next) return;
        const cover = gsap.timeline({
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: 0.6 },
        });
        cover.to(paper, { scale: phone ? 0.97 : 0.95, rotate: -turn * 0.3, transformOrigin: "50% 100%", ease: "none" }, 0);
        if (shade) cover.fromTo(shade, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none" }, 0);
      });

      /* ── the letters type on; the termination's verdict is struck, Vertlo's note typed under it ── */
      document.querySelectorAll<HTMLElement>(".pp-letter").forEach((letter) => {
        const strikes = letter.querySelectorAll(".pp-letter-line del");
        const tl = gsap.timeline({ scrollTrigger: { trigger: letter, start: "top 80%", end: phone ? "bottom 70%" : "bottom 55%", scrub: 0.5 } });
        tl.from(letter.querySelectorAll(".pp-letter-head, .pp-letter-ref"), { autoAlpha: 0, y: 10, stagger: 0.1, duration: 0.3 })
          .from(letter.querySelectorAll(".pp-letter-line"), { clipPath: "inset(0 100% 0 0)", stagger: 0.35, duration: 0.6, ease: "none" })
          .from(letter.querySelector(".pp-letter-sign"), { autoAlpha: 0, duration: 0.2 });
        if (strikes.length) tl.fromTo(strikes, { "--strike": "0%" }, { "--strike": "100%", stagger: 0.2, duration: 0.4, ease: "power1.inOut" });
        const note = letter.querySelector(".pp-letter-note");
        if (note) tl.from(note, { clipPath: "inset(0 100% 0 0)", duration: 0.5, ease: "none" });
      });

      /* ── the cheque is signed as it lands ── */
      const sig = document.querySelector<SVGPathElement>(".pp-signature path");
      if (sig) {
        const len = sig.getTotalLength();
        gsap.fromTo(
          sig,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, ease: "power1.inOut", scrollTrigger: { trigger: sig.closest(".pp-cheque"), start: "top 70%", end: "top 15%", scrub: 0.8 } },
        );
        const amount = document.querySelector(".pp-cheque-amount");
        if (amount) {
          gsap.from(amount, { clipPath: "inset(0 100% 0 0)", ease: "power2.inOut", scrollTrigger: { trigger: amount, start: "top 85%", end: "top 55%", scrub: 0.6 } });
        }
      }

    });

    /* the stack's heights settle after fonts and client-drawn art; re-measure the triggers once. The
       triggers above were created at whatever the scroll was (a reload can restore it mid-stack), and
       this refresh measures them again with the stack let go. */
    document.fonts?.ready.then(() => { measure(); ScrollTrigger.refresh(); });

    return () => {
      mm.revert();
      ro.disconnect();
      ScrollTrigger.removeEventListener("refreshInit", letGo);
      ScrollTrigger.removeEventListener("refresh", settle);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <aside className="pp-index" data-on={current ? "" : undefined} aria-hidden="true" title={current?.title}>
      <span className="pp-index-n">{pad(current?.n ?? 1)}</span>
      <span className="pp-index-stack">
        {SHEETS.map((_, k) => (
          <i key={k} data-on={current && k < current.n ? "" : undefined} />
        ))}
      </span>
      <span className="pp-index-n">{pad(SHEETS.length)}</span>
    </aside>
  );
}
