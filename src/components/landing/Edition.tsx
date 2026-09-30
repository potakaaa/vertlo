"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/motion";
import { Notification } from "@/components/vertlo";
import { sceneFor } from "@/components/landing/scenes";

/* The edition: the site is a paper you turn page by page. On desktop each section (A, then B) pins and
   scrolling turns its pages sideways: the next sheet slides over the last, which drops back a little
   and darkens underneath, then the new page's scene plays (scenes.ts) before the next turn. The scroll
   snaps to finished pages. Between the sections the paper opens to a centre spread that
   scrolls down (Spread). On phones and with reduced motion the pages stack as sheets and each scene
   plays as its page scrolls through (or shows finished). Styles in app/press.css (pr-ed, pr-page). */

/** Where the page turns: wide screens that allow motion. Kept in step with press.css. */
export const TURN = "(min-width: 961px) and (prefers-reduced-motion: no-preference)";
const STACK = "not all and (min-width: 961px) and (prefers-reduced-motion: no-preference)";
/** The fixed running head's height (the --head token: 52px, 56px on phones); pages and anchors sit under it. */
export const headHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--head")) || 52;

export type PageInfo = { id: string; no: string; section: string };

/** Page id → the scroll position that shows it. Filled while each section runs; read by in-page links. */
const pageTargets = new Map<string, () => number>();
export const scrollTargetFor = (id: string): number | null => pageTargets.get(id)?.() ?? null;

/** Tells the running head which page is open. */
export const announcePage = (p: PageInfo) => window.dispatchEvent(new CustomEvent<PageInfo>("press:page", { detail: p }));
const infoOf = (el: HTMLElement): PageInfo => ({ id: el.id, no: el.dataset.no ?? "", section: el.dataset.section ?? "" });

/** A section of the paper that turns sideways: its children are Pages. */
export function Edition({ label, children }: { label: string; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pages = [...root.querySelectorAll<HTMLElement>(":scope > .pr-ed-view > .pr-page")];
    const mm = gsap.matchMedia();

    mm.add({ turn: TURN, stack: STACK, reduce: MQ.reduce }, (ctx) => {
      const { turn, reduce } = ctx.conditions as { turn: boolean; stack: boolean; reduce: boolean };

      if (!turn) {
        pages.forEach((p) => {
          const scene = sceneFor(p);
          if (scene) {
            if (reduce) scene.progress(1);
            else ScrollTrigger.create({ trigger: p, start: "top 72%", end: "center 52%", scrub: 0.6, animation: scene });
          }
          ScrollTrigger.create({ trigger: p, start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && announcePage(infoOf(p)) });
          pageTargets.set(p.id, () => p.getBoundingClientRect().top + window.scrollY - headHeight());
        });
        return () => pages.forEach((p) => pageTargets.delete(p.id));
      }

      /* one timeline for the whole section: each page turns in, and its scene starts while the sheet is
         still sliding (so it never lands blank) and finishes with the page open; then a beat. The CSS
         parks later pages off to the right before JS runs; hand that position to GSAP as xPercent. */
      gsap.set(pages.slice(1), { x: 0, xPercent: 104 });
      const tl = gsap.timeline();
      const stops: { t: number; page: HTMLElement }[] = [];
      pages.forEach((p, i) => {
        let sceneAt = 0;
        if (i > 0) {
          const prev = pages[i - 1], at = tl.duration();
          tl.fromTo(p, { xPercent: 104 }, { xPercent: 0, duration: 1, ease: "power2.inOut" }, at);
          tl.fromTo(prev, { xPercent: 0 }, { xPercent: -22, duration: 1, ease: "power2.inOut", immediateRender: false }, at);
          const shade = prev.querySelector(".pr-page-shade");
          if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power1.in", immediateRender: false }, at);
          stops.push({ t: at + 1, page: p });
          sceneAt = at + 0.55;
        } else stops.push({ t: 0, page: p });
        const scene = sceneFor(p);
        if (scene) tl.add(scene, sceneAt);
        // the page, finished: where the scroll snaps and where links to it land
        tl.addLabel(p.id, Math.max(tl.duration(), stops[i].t));
        if (i < pages.length - 1) tl.to({}, { duration: 0.2 }, tl.labels[p.id]);
      });

      /* about 85% of a screen of scroll per unit of timeline; snap to finished pages */
      const unit = () => window.innerHeight * 0.85;
      const snaps = () => pages.map((p) => (tl.labels[p.id] ?? 0) / tl.duration()); // proportions, so they hold across resizes
      let open: HTMLElement | null = null;
      const st = ScrollTrigger.create({
        trigger: root,
        start: () => `top ${headHeight()}px`,
        end: () => `+=${tl.duration() * unit()}`,
        pin: true,
        scrub: 0.7,
        animation: tl,
        // no invalidateOnRefresh: it would reset the scenes' counters (clock, shares) to their start values
        // while the page sits finished; nothing in the scenes measures the layout
        // nearest page, not directional: a link that lands on a page stays there
        snap: { snapTo: snaps(), directional: false, duration: { min: 0.25, max: 0.8 }, delay: 0.1, ease: "power1.inOut" },
        onUpdate: (self) => {
          const t = self.progress * tl.duration();
          // a page counts as open once it's more than halfway across
          const cur = stops.reduce((acc, s) => (t >= s.t - 0.5 ? s : acc), stops[0]).page;
          if (cur !== open) announcePage(infoOf((open = cur)));
        },
      });
      ScrollTrigger.sort(); // keep refresh order = page order, however the effects ran
      pages.forEach((p) =>
        pageTargets.set(p.id, () => st.start + ((tl.labels[p.id] ?? 0) / tl.duration()) * (st.end - st.start)),
      );

      /* keyboard: focus landing on a page that isn't open scrolls the paper to it */
      const onFocus = (e: FocusEvent) => {
        const page = (e.target as HTMLElement).closest<HTMLElement>(".pr-page");
        if (page && page !== open) window.dispatchEvent(new CustomEvent("press:scrollto", { detail: scrollTargetFor(page.id) }));
      };
      root.addEventListener("focusin", onFocus);

      return () => {
        root.removeEventListener("focusin", onFocus);
        pages.forEach((p) => pageTargets.delete(p.id));
        gsap.set(pages, { clearProps: "transform" });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="pr-ed" role="region" aria-label={label}>
      <div className="pr-ed-view">{children}</div>
    </div>
  );
}

/** One page of the paper: its folio (number and section) on top, its content, and a turn cue. */
export function Page({
  id,
  no,
  section,
  scene,
  turn,
  folio = true,
  children,
}: {
  id: string;
  no: string;
  section: string;
  scene?: string;
  turn?: string;
  folio?: boolean;
  children: ReactNode;
}) {
  return (
    <article className={`pr-page pr-page--${id}`} id={id} data-no={no} data-section={section} data-scene={scene} aria-label={`${no}, ${section}`}>
      <div className="lp-wrap pr-page-in">
        {folio ? (
          <header className="pr-folio">
            <b>{no}</b> {section}
          </header>
        ) : null}
        <div className="pr-page-body">{children}</div>
        {turn ? (
          <footer className="pr-page-foot" aria-hidden="true">
            {turn}
          </footer>
        ) : null}
      </div>
      <span className="pr-page-shade" aria-hidden="true" />
    </article>
  );
}

/** The centre spread: the paper opens and this part scrolls down. Tells the running head when it's open. */
export function Spread({ id, no, section, children }: PageInfo & { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({ trigger: el, start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && announcePage({ id, no, section }) });
    pageTargets.set(id, () => el.getBoundingClientRect().top + window.scrollY - headHeight());
    return () => {
      st.kill();
      pageTargets.delete(id);
    };
  }, [id, no, section]);
  return (
    <section ref={ref} className="pr-spread" id={id} data-no={no} data-section={section} aria-label={`${no}, ${section}`}>
      {children}
    </section>
  );
}

/** A stipple engraving, printed onto the paper (multiplied, so its white is the paper). Prints in from the top. */
export function Engraving({ src, className, sizes = "(max-width: 960px) 60vw, 26vw" }: { src: string; className?: string; sizes?: string }) {
  return (
    <div className={`pr-engraving${className ? ` ${className}` : ""}`} aria-hidden="true">
      <Image src={src} alt="" width={900} height={900} sizes={sizes} />
    </div>
  );
}

type BoardRow = { id: string; provider: string; before: number; after: number };

/** A3's routing board, set in its final state (US-01 paused, the rest carrying its share); the scene
    runs it from the minute before. Bars are scaled so 50% of volume fills the track. */
export function RerouteBoard({
  title,
  merchant,
  live,
  from,
  to,
  orders,
  label,
  caption,
  note,
  rows,
  notice,
}: {
  title: string;
  merchant: string;
  live: string;
  from: string;
  to: string;
  orders: string;
  label: string;
  caption: string;
  note: string;
  rows: BoardRow[];
  notice: { time: string; message: string };
}) {
  // orders per minute: steady through the switch (deterministic wobble, no dip)
  const pts = Array.from({ length: 40 }, (_, i) => 46 + Math.sin(i * 1.7) * 4 + Math.sin(i * 0.6) * 3);
  const path = pts.map((v, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * 300} ${60 - v}`).join(" ");
  return (
    <figure className="pr-board" aria-label={`Illustrative routing board: at ${to}, MID ${rows.find((r) => !r.after)?.id} is paused and its share moves to the other MIDs.`}>
      <div className="pr-board-win">
        <header className="pr-board-head">
          <span className="pr-board-t">
            {title}
            <small>{merchant}</small>
          </span>
          <span className="pr-board-live">
            <i aria-hidden="true" />
            {live}
          </span>
          <time className="pr-board-clock" data-from={from} data-to={to}>
            {to}:07
          </time>
        </header>
        <div className="pr-board-rows">
          {rows.map((r) => (
            <div key={r.id} className="pr-board-row" data-before={r.before} data-after={r.after} data-paused={r.after === 0 || undefined}>
              <b className="pr-board-id">{r.after === 0 ? <span className="pr-strike pr-strike--thin">{r.id}</span> : r.id}</b>
              <span className="pr-board-prov">{r.provider}</span>
              <span className="pr-board-bar">
                <i style={{ transform: `scaleX(${r.after / 50})` }} />
              </span>
              <span className="pr-board-pct">{r.after}%</span>
              <span className="pr-board-st">
                <span data-s="live">Live</span>
                <span data-s="paused">Paused</span>
              </span>
            </div>
          ))}
        </div>
        <div className="pr-board-orders">
          <span>{orders}</span>
          <svg viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true">
            <path d={path} pathLength={1} />
          </svg>
        </div>
        <div className="pr-board-note">
          <Notification from="Vertlo" time={notice.time} message={notice.message} animate={false} />
        </div>
      </div>
      <figcaption className="pr-cap">
        <b>{label}.</b> {caption} <span className="pr-cap-credit">{note}</span>
      </figcaption>
    </figure>
  );
}
