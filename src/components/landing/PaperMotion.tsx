"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/motion";

/* The paper journey, run over the server-rendered markup (Sections.tsx, Paper.tsx):
   - the stack: each sheet is sticky with its bottom edge at the viewport's (a tall sheet scrolls
     normally, then stays), so the next one slides over it; measured here into --sheet-h.
   - arrival and cover: a sheet comes up with a slight turn and settles; as the next one covers it,
     it sinks back a little under a shadow.
   - on load, the banknote is laid down and printed: the medallion inks in, then the headline.
   - in the sheets: the two letter headings ink in word by word; each letter types on (the
     termination's verdict is then struck through and Vertlo's note typed under it); the statement's
     line items land one by one and are stamped; the cheque's signature writes itself.
   - the ledger thread (Paper.tsx) in the left margin fills to the middle of the screen, and each
     document's diamond lights when it lands (wide screens only).
   Reduced motion: the stack still stacks and the thread still fills (both are position, not
   animation); nothing else moves. */

export function PaperMotion() {
  useEffect(() => {
    const stack = document.querySelector<HTMLElement>(".pp-stack");
    if (!stack) return;
    const sheets = [...stack.querySelectorAll<HTMLElement>(":scope > .pp-sheet")];

    const root = document.documentElement;
    const thread = stack.querySelector<HTMLElement>(".pp-thread");
    const fill = thread?.querySelector<HTMLElement>(".pp-thread-fill");
    const nodes = thread ? [...thread.querySelectorAll<HTMLElement>(".pp-thread-node")] : [];
    let nodeAt: number[] = [];

    /* sticky offsets: a sheet sticks once its bottom edge meets the viewport's. The thread's nodes sit
       where each sheet starts in the page, measured with the stack let go. */
    const measure = () => {
      sheets.forEach((s) => s.style.setProperty("--sheet-h", `${s.offsetHeight}px`));
      if (!thread) return;
      root.setAttribute("data-measure-flow", "");
      const top = stack.getBoundingClientRect().top;
      nodeAt = sheets.map((s) => s.getBoundingClientRect().top - top);
      root.removeAttribute("data-measure-flow");
      nodes.forEach((n, i) => n.style.setProperty("--y", `${nodeAt[i] ?? 0}px`));
    };
    measure();
    const ro = new ResizeObserver(measure);
    sheets.forEach((s) => ro.observe(s));

    /* ScrollTrigger measures every trigger from the page's layout. A sheet that is stuck on screen
       would be measured where it sits, not where it belongs, so let the stack go for the length of
       each refresh (html[data-measure-flow], paper.css). Refresh is synchronous: nothing paints between. */
    const letGo = () => root.setAttribute("data-measure-flow", "");
    const settle = () => root.removeAttribute("data-measure-flow");
    ScrollTrigger.addEventListener("refreshInit", letGo);
    ScrollTrigger.addEventListener("refresh", settle);

    /* the thread: filled down to the middle of the screen; a node lights once the fill reaches it */
    let raf = 0;
    const track = () => {
      raf = 0;
      if (!thread || !fill) return;
      const h = thread.offsetHeight;
      const tip = Math.min(h, Math.max(0, window.innerHeight * 0.5 - thread.getBoundingClientRect().top));
      fill.style.transform = `scaleY(${h ? tip / h : 0})`;
      nodes.forEach((n, i) => n.toggleAttribute("data-on", (nodeAt[i] ?? Infinity) <= tip));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(track); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
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
          .fromTo(note, { y: 40, rotate: -1, scale: 0.985, autoAlpha: 0 }, { y: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 1.2, ease: "expo.out" })
          .fromTo(q(".pp-note-medallion"), { "--ink": "-20%", rotate: -24 }, { "--ink": "115%", rotate: 0, duration: 1.6, ease: "power2.inOut" }, 0.3)
          .from(q(".pp-note-serial"), { autoAlpha: 0, duration: 0.6 }, 0.6)
          .from(q(".pp-note-micro"), { clipPath: "inset(0 50% 0 50%)", duration: 0.9, ease: "power2.inOut" }, 0.6)
          .from(q(".lp-h1, .lp-hero-sub"), { autoAlpha: 0, y: 18, stagger: 0.12, duration: 0.8 }, 0.55);
        const cta = document.querySelector(".lp-hero-cta");
        if (cta) intro.fromTo(cta, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.95);
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

      /* ── headings that ink in word by word as they come up the page ── */
      document.querySelectorAll<HTMLElement>(".pp-ink-words").forEach((h) => {
        gsap.fromTo(
          h.querySelectorAll(".pp-word"),
          { color: "rgba(11,20,16,.16)" },
          { color: "#0b1410", stagger: 0.12, ease: "none", scrollTrigger: { trigger: h, start: "top 88%", end: "top 48%", scrub: 0.5 } },
        );
      });

      /* ── the statement's line items land one by one (each stamps itself as it comes into view) ── */
      const ledger = document.querySelector<HTMLElement>(".pp-ledger");
      if (ledger) {
        const rows = ledger.querySelectorAll("tbody tr");
        const tl = gsap.timeline({ scrollTrigger: { trigger: ledger, start: "top 82%", end: "bottom 70%", scrub: 0.5 } });
        rows.forEach((row, i) => tl.from(row.children, { autoAlpha: 0, y: 14, duration: 0.5, ease: "power2.out" }, i * 0.45));
      }

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
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
