import {
  Button,
  Diamond,
  FAQ,
  FeaturePanel,
  Footer,
  IndustryCards,
  ProviderFlow,
  RotatingWord,
} from "@/components/vertlo";
import type { CSSProperties } from "react";
import * as c from "@/content/landing";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { FeatureGridMotion } from "@/components/landing/FeatureGridMotion";
import { PortalTour } from "@/components/landing/PortalTour";
import { keyed, rich } from "@/components/landing/Rich";

/* One responsive page on a misty off-white ground. Headings are one sans; `*words*` in content take the
   accent colour (Rich.tsx). No labels over headings, no photos: the page's own texture is the routing grid
   (hero and closing call), the dot-matrix and pixel art, and the mono running labels inside the scenes.
   Two full-bleed black bands stay for the stealth side (`vt-bleed`: the section itself is the backdrop).
   Every section is a server component; the interactive bits live inside the design-system
   components (client). Layout classes are in app/landing.css (lp-*), the look in app/mist.css. */

/* Routing grid: a hairline grid where diamonds are merchant accounts sitting on intersections; green
   packets run the lines into them and each one lights up on arrival. A paused account (red) gets no
   traffic. Coordinates are grid cells from the centre line (col) and the top of the grid (row).
   `on` picks the layout: "d" desktop, "m" phones. Pure CSS, decorative. */
type GridNode = { col: number; row: number; state?: "paused" | "idle"; on?: "d" | "m" };
type GridRoute = { axis: "x" | "y"; at: number; from: number; to: number; dur: number; delay: number; on?: "d" | "m" };

/* Hero: the grid starts behind the sticky header; one account is paused and the rest keep taking traffic. */
const HERO_NODES: GridNode[] = [
  { col: -10, row: 4, on: "d" },
  { col: 9, row: 3, on: "d" },
  { col: -8, row: 10, on: "d" },
  { col: 10, row: 9, on: "d" },
  { col: -11, row: 7, state: "paused", on: "d" },
  { col: 7, row: 11, state: "idle", on: "d" },
  { col: -6, row: 1, state: "idle", on: "d" },
];
// A route that ends on a node feeds it; the node's flash shares the route's timing.
const HERO_ROUTES: GridRoute[] = [
  { axis: "y", at: -10, from: 0, to: 4, dur: 7, delay: 0.6, on: "d" },
  { axis: "x", at: 3, from: 15, to: 9, dur: 8, delay: 2.2, on: "d" },
  { axis: "x", at: 10, from: -15, to: -8, dur: 7.5, delay: 4, on: "d" },
  { axis: "y", at: 10, from: 13, to: 9, dur: 6.5, delay: 1.4, on: "d" },
  // Phones: no room for accounts, so two packets pass each other on the line under the nav.
  { axis: "x", at: 2, from: -7, to: 7, dur: 7, delay: 0.6, on: "m" },
  { axis: "x", at: 2, from: 7, to: -7, dur: 7, delay: 4.1, on: "m" },
];

/* Closing call: the same grid along the bottom of the card, every account live. */
const CTA_NODES: GridNode[] = [
  { col: -9, row: 3, on: "d" },
  { col: -4, row: 5, on: "d" },
  { col: 5, row: 4, on: "d" },
  { col: 10, row: 2, on: "d" },
  { col: 1, row: 6, state: "idle", on: "d" },
  { col: -3, row: 3, on: "m" },
  { col: 3, row: 5, on: "m" },
];
const CTA_ROUTES: GridRoute[] = [
  { axis: "y", at: -9, from: 0, to: 3, dur: 7, delay: 0.4, on: "d" },
  { axis: "x", at: 5, from: -14, to: -4, dur: 8, delay: 2.6, on: "d" },
  { axis: "x", at: 4, from: 14, to: 5, dur: 7.5, delay: 1.2, on: "d" },
  { axis: "y", at: 10, from: 8, to: 2, dur: 6.5, delay: 3.8, on: "d" },
  { axis: "x", at: 3, from: 7, to: -3, dur: 7, delay: 0.6, on: "m" },
  { axis: "y", at: 3, from: 0, to: 5, dur: 6, delay: 3.2, on: "m" },
];

type Vars = CSSProperties & Record<`--${string}`, string | number>;

function RoutingGrid({ nodes, routes, className }: { nodes: GridNode[]; routes: GridRoute[]; className?: string }) {
  const timing = (n: GridNode) =>
    routes.find((r) => r.on === n.on && r.to === (r.axis === "x" ? n.col : n.row) && r.at === (r.axis === "x" ? n.row : n.col));
  return (
    <div className={className ? `lp-grid-bg ${className}` : "lp-grid-bg"} aria-hidden="true">
      {routes.map((r, i) => {
        const [lo, hi] = [Math.min(r.from, r.to), Math.max(r.from, r.to)];
        const style: Vars = {
          "--a": lo,
          "--len": hi - lo,
          "--at": r.at,
          "--dur": `${r.dur}s`,
          "--delay": `${r.delay}s`,
        };
        return (
          <span
            key={i}
            className="lp-route"
            data-axis={r.axis}
            data-rev={r.to < r.from || undefined}
            data-on={r.on}
            style={style}
          />
        );
      })}
      {nodes.map((n, i) => {
        const t = timing(n);
        const style: Vars = { "--c": n.col, "--r": n.row };
        if (t) Object.assign(style, { "--dur": `${t.dur}s`, "--delay": `${t.delay}s` });
        return <span key={i} className="lp-node" data-state={n.state ?? (t ? "live" : "idle")} data-on={n.on} style={style} />;
      })}
    </div>
  );
}

/* Hero and product in one pinned section: the routing grid behind, the portal on a laptop. Scrolling
   zooms into the laptop until its screen fills the view, then runs the portal tour (PortalTour). */
export function Hero() {
  return (
    <section className="lp-hero-band" id="top">
      <RoutingGrid nodes={HERO_NODES} routes={HERO_ROUTES} />
      <div className="lp-wrap lp-hero">
        <h1 className="lp-h1">
          <span className="lp-h1-line">{c.hero.lead}</span>{" "}
          <span className="lp-h1-line lp-accent">{c.hero.accent}</span>
        </h1>
        <p className="lp-hero-sub">{keyed(c.hero.subhead)}</p>
        <div className="lp-hero-cta">
          <Button size="lg" href="#book">
            Book a call
          </Button>
          <Button variant="ghost" size="lg" href="#how" arrow={false}>
            See how it works
          </Button>
        </div>
      </div>
      <div className="lp-wrap lp-stage">
        <PortalTour data={c.portal} clipH={760} clipHMobile={860} />
        <span className="lp-illus">Illustrative data</span>
      </div>
    </section>
  );
}

export function Trust() {
  return (
    <section className="lp-wrap lp-trust" aria-labelledby="trust-t">
      <h2 className="lp-trust-t" id="trust-t">
        {rich(c.trust.heading)}
      </h2>
      <ul className="lp-logos">
        {c.logos.map((l) => (
          <li key={l} className="lp-logo">
            {l}
          </li>
        ))}
      </ul>
      <dl className="lp-figures">
        {c.trust.figures.map((f) => (
          <div key={f.label} className="lp-figure">
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
      <p className="lp-note">{c.trust.note}</p>
    </section>
  );
}

export function Problem() {
  return (
    <section className="vt-bleed lp-bleed">
      <div className="lp-wrap lp-sec lp-sec--flush">
        <div className="lp-head lp-head--split">
          <div className="lp-head-main">
            <h2 className="lp-h2">
              {c.problem.lead}{" "}
              <em className="lp-em lp-rot">
                <RotatingWord words={c.problem.rotating} />
              </em>
            </h2>
          </div>
          <p className="lp-lede">{keyed(c.problem.blurb)}</p>
        </div>
        <IndustryCards tone="dark" items={c.problem.items} />
      </div>
    </section>
  );
}

export function How() {
  return (
    <section className="lp-wrap lp-sec" id="how">
      <div className="lp-head lp-head--center">
        <h2 className="lp-h2">{rich(c.how.title)}</h2>
      </div>
      <HowFlow steps={c.how.steps} />
    </section>
  );
}

export function WhatYouGet() {
  return (
    <section className="lp-wrap lp-sec lp-wyg">
      <div className="lp-head lp-head--center">
        <h2 className="lp-h2">{rich(c.whatYouGet.title)}</h2>
        <p className="lp-blurb">{keyed(c.whatYouGet.blurb)}</p>
      </div>
      <FeatureGridMotion items={c.whatYouGet.items} />
    </section>
  );
}

export function ForBrands() {
  return (
    <section className="vt-bleed lp-bleed lp-brands">
      <div className="lp-wrap">
        <FeaturePanel {...c.forBrands} title={rich(c.forBrands.title)} description={keyed(c.forBrands.description)} />
      </div>
    </section>
  );
}

export function Providers() {
  return (
    <section className="lp-wrap lp-sec">
      <div className="lp-head lp-head--center">
        <h2 className="lp-h2">{rich(c.providers.title)}</h2>
      </div>
      <div className="lp-pf-d">
        <ProviderFlow />
      </div>
      <div className="lp-pf-m">
        <ProviderFlow layout="vertical" />
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section className="lp-wrap lp-sec lp-industries" id="industries">
      <div className="lp-head lp-head--split lp-head--end">
        <h2 className="lp-h2">{rich(c.industries.title)}</h2>
        <div className="lp-hide-m">
          <Button variant="text" href="#book">
            All industries
          </Button>
        </div>
      </div>
      <IndustryCards items={c.industries.items} />
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="lp-band lp-band--dots" id="reviews">
      <div className="lp-wrap lp-sec">
        <div className="lp-head">
          <h2 className="lp-h2">{rich(c.testimonials.title)}</h2>
          <p className="lp-note">{c.testimonials.note}</p>
        </div>
        <MerchantStories items={c.testimonials.items} />
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="lp-wrap lp-sec">
      <FAQ title={rich(c.faq.title)} blurb={c.faq.blurb} items={c.faq.items} ctaHref="#book" />
    </section>
  );
}

/* The closing call: a white card on the mist, the routing grid along its bottom with every account live. */
export function FinalCTA() {
  return (
    <section className="lp-cta" id="book">
      <div className="lp-wrap lp-cta-in">
        <h2 className="lp-h2">{rich(c.cta.title)}</h2>
        <p className="lp-blurb">{keyed(c.cta.blurb)}</p>
        <Button size="lg" href="#book">
          Book a call
        </Button>
        <ul className="lp-cta-points">
          {c.cta.points.map((p) => (
            <li key={p}>
              <Diamond size={7} />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <RoutingGrid nodes={CTA_NODES} routes={CTA_ROUTES} className="lp-grid-bg--cta" />
    </section>
  );
}

export function SiteFooter() {
  return (
    <div className="lp-wrap lp-footer" id="company">
      <Footer tagline={c.footer.tagline} columns={c.footer.columns} wordmark={false} />
    </div>
  );
}
