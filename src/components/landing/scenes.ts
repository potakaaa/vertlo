"use client";

import { gsap } from "@/lib/motion";

/* Each page's scene: GSAP timelines built from the page's own markup. On desktop Edition scrubs the
   whole scene inside the page-turn timeline (sceneFor). On phones a page is taller than the screen, so
   the scene comes apart (scenePartsFor) and each part runs as it scrolls in. With reduced motion the
   scene jumps to its end. The markup is always in its final state, so without JS the paper reads
   complete; every scene tweens from a starting state to that final state with fromTo. Scenes are named
   by the page's `data-scene`; every page also prints its engravings in from the top. */

type Tl = gsap.core.Timeline;
type Build = (page: HTMLElement, tl: Tl) => void;

const all = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => [...root.querySelectorAll<T>(sel)];

/** Rows of things set down one after another. */
function setDown(tl: Tl, items: Element[], at = 0.1) {
  if (items.length) tl.fromTo(items, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.14 }, at);
}

/** Engravings print in from the top. */
function printIn(tl: Tl, imgs: Element[]) {
  if (imgs.length) tl.fromTo(imgs, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power1.inOut", stagger: 0.15 }, 0);
}

/* Stacked, a scene is either a list whose items each set down as they scroll in (`EACH`), or one
   figure the whole scene plays on as it crosses the screen (`FOCUS`). */
const EACH: Record<string, string> = { briefs: ".vt-ic-card, .pr-madefor", qa: ".pr-qa-item" };
const FOCUS: Record<string, string> = { reroute: ".pr-board", underwriting: ".pr-timeline", numbers: ".pr-table", classifieds: ".pr-coupon" };

const SCENES: Record<string, Build> = {
  /* A2: the dot-matrix briefs set down one by one, then the made-for line */
  briefs(page, tl) {
    setDown(tl, all(page, EACH.briefs));
  },

  /* A3: the minute US-01 is paused. The clock ticks over 09:41; US-01's share drains and is struck
     out; the live MIDs take it; orders per minute keep drawing flat; the notification lands. */
  reroute(page, tl) {
    const board = page.querySelector<HTMLElement>(".pr-board");
    if (!board) return;
    const clock = board.querySelector<HTMLElement>(".pr-board-clock");
    const at = 0.55; // the moment of the pause
    if (clock) {
      const [h, m] = (clock.dataset.from ?? "09:40").split(":").map(Number);
      const o = { s: 44 };
      const fmt = (s: number) => {
        const t = h * 3600 + m * 60 + Math.floor(s);
        const p2 = (n: number) => String(n).padStart(2, "0");
        return `${p2(Math.floor(t / 3600))}:${p2(Math.floor(t / 60) % 60)}:${p2(t % 60)}`;
      };
      tl.fromTo(o, { s: 44 }, { s: 67, duration: 1.6, ease: "none", onUpdate: () => void (clock.textContent = fmt(o.s)) }, 0);
    }
    all(board, ".pr-board-row").forEach((row, i) => {
      const before = Number(row.dataset.before), after = Number(row.dataset.after);
      const bar = row.querySelector(".pr-board-bar i"), pct = row.querySelector<HTMLElement>(".pr-board-pct");
      tl.fromTo(row, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out" }, 0.05 + i * 0.06);
      tl.fromTo(bar, { scaleX: before / 50 }, { scaleX: after / 50, duration: 0.7, ease: "power2.inOut" }, after ? at + 0.2 : at);
      if (pct) {
        const o = { v: before };
        tl.fromTo(o, { v: before }, { v: after, duration: 0.7, ease: "power2.inOut", onUpdate: () => void (pct.textContent = `${Math.round(o.v)}%`) }, after ? at + 0.2 : at);
      }
      if (!after) {
        tl.fromTo(row.querySelector(".pr-strike"), { backgroundSize: "0% 1.5px" }, { backgroundSize: "100% 1.5px", duration: 0.35, ease: "power1.inOut" }, at + 0.1);
        tl.fromTo(row.querySelector('[data-s="live"]'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, at + 0.1);
        tl.fromTo(row.querySelector('[data-s="paused"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, at + 0.2);
        tl.fromTo(row, { "--row-dim": 0 }, { "--row-dim": 1, duration: 0.3 }, at + 0.2);
      }
    });
    tl.fromTo(board.querySelector(".pr-board-orders path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "none" }, 0);
    tl.fromTo(board.querySelector(".pr-board-note"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, at + 0.75);
  },

  /* A4: the timeline's rule draws across the page and each dated step lands on it in turn */
  underwriting(page, tl) {
    const line = page.querySelector(".pr-timeline");
    const steps = all(page, ".pr-timeline li");
    if (!line || !steps.length) return;
    tl.fromTo(line, { "--drawn": 0 }, { "--drawn": 1, duration: 1.2, ease: "power1.inOut" }, 0.1);
    tl.fromTo(steps, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.28 }, 0.15);
  },

  /* B1: Table 1's rows print in */
  numbers(page, tl) {
    const rows = all(page, ".pr-table tbody tr, .pr-table tfoot tr");
    if (rows.length) tl.fromTo(rows, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.1 }, 0.1);
  },

  /* B3: the questions set down */
  qa(page, tl) {
    setDown(tl, all(page, EACH.qa), 0.05);
  },

  /* B4: the scissors run along the cut line, then the coupon lifts off the page */
  classifieds(page, tl) {
    const coupon = page.querySelector<HTMLElement>(".pr-coupon");
    if (!coupon) return;
    // --cut runs 0 → 1; press.css turns it into the scissors' travel along the cut line
    tl.fromTo(coupon, { "--cut": 0 }, { "--cut": 1, duration: 1.1, ease: "power1.inOut" }, 0.05);
    tl.fromTo(coupon, { y: 0, "--lift": 0 }, { y: -8, "--lift": 1, duration: 0.45, ease: "power2.out" }, 1.1);
  },
};

/** The page's scene (its engravings printing in, plus its named scene), or null if it has none. */
export function sceneFor(page: HTMLElement): Tl | null {
  const tl = gsap.timeline();
  printIn(tl, all(page, ".pr-engraving img"));
  const build = SCENES[page.dataset.scene ?? ""];
  if (build) build(page, tl);
  return tl.duration() ? tl : null;
}

/** A part of a page's scene with the element whose scroll drives it. `span` says how far it runs: an
    "item" finishes soon after it enters; a "figure" plays for as long as it takes to come fully into view. */
export type ScenePart = { trigger: HTMLElement; tl: Tl; span: "item" | "figure" };

/** The page's scene taken apart for stacked pages: each engraving, each list item, or the one figure. */
export function scenePartsFor(page: HTMLElement): ScenePart[] {
  const part = (trigger: HTMLElement, span: ScenePart["span"], build: (tl: Tl) => void): ScenePart => {
    const tl = gsap.timeline();
    build(tl);
    return { trigger, tl, span };
  };
  const parts = all(page, ".pr-engraving").map((el) => part(el, "item", (tl) => printIn(tl, all(el, "img"))));
  const name = page.dataset.scene ?? "";
  if (EACH[name]) parts.push(...all(page, EACH[name]).map((el) => part(el, "item", (tl) => setDown(tl, [el], 0))));
  else if (SCENES[name]) parts.push(part(page.querySelector<HTMLElement>(FOCUS[name]) ?? page, "figure", (tl) => SCENES[name](page, tl)));
  return parts.filter((p) => p.tl.duration() > 0);
}
