import {
  Button,
  CTABand,
  FAQ,
  FeaturePanel,
  Footer,
  IndustryCards,
  LogoStrip,
  ProviderFlow,
  RotatingWord,
} from "@/components/vertlo";
import type { CSSProperties } from "react";
import * as c from "@/content/landing";
import { FlipWords } from "@/components/landing/FlipWords";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { FeatureGridMotion } from "@/components/landing/FeatureGridMotion";
import { PortalTour } from "@/components/landing/PortalTour";

/* One responsive page matching the approved canvas. White sections alternate with full-bleed
   black bands (`vt-bleed`: the section itself is the black backdrop, components sit straight on it).
   Every section is a server component; the interactive bits live inside the design-system
   components (client). Layout classes are in app/landing.css (lp-*). */

/* Hero backdrop: a hairline routing grid. Diamonds are merchant accounts sitting on grid intersections;
   green packets run the lines into them and each one lights up on arrival. One account is paused (red)
   and gets no traffic. Coordinates are grid cells from the centre line (col) and the top of the grid (row),
   which starts behind the sticky header so the glass nav frosts it. Pure CSS, decorative. */
type GridNode = { col: number; row: number; state?: "paused" | "idle"; on?: "d" | "m" };
type GridRoute = { axis: "x" | "y"; at: number; from: number; to: number; dur: number; delay: number; on?: "d" | "m" };

const GRID_NODES: GridNode[] = [
  { col: -10, row: 4, on: "d" },
  { col: 9, row: 3, on: "d" },
  { col: -8, row: 10, on: "d" },
  { col: 10, row: 9, on: "d" },
  { col: -11, row: 7, state: "paused", on: "d" },
  { col: 7, row: 11, state: "idle", on: "d" },
  { col: -6, row: 1, state: "idle", on: "d" },
];
// A route that ends on a node feeds it; the node's flash shares the route's timing.
const GRID_ROUTES: GridRoute[] = [
  { axis: "y", at: -10, from: 0, to: 4, dur: 7, delay: 0.6, on: "d" },
  { axis: "x", at: 3, from: 15, to: 9, dur: 8, delay: 2.2, on: "d" },
  { axis: "x", at: 10, from: -15, to: -8, dur: 7.5, delay: 4, on: "d" },
  { axis: "y", at: 10, from: 13, to: 9, dur: 6.5, delay: 1.4, on: "d" },
  // Phones: no room for accounts, so two packets pass each other on the line under the nav.
  { axis: "x", at: 2, from: -7, to: 7, dur: 7, delay: 0.6, on: "m" },
  { axis: "x", at: 2, from: 7, to: -7, dur: 7, delay: 4.1, on: "m" },
];

type Vars = CSSProperties & Record<`--${string}`, string | number>;

function HeroGrid() {
  const timing = (n: GridNode) =>
    GRID_ROUTES.find((r) => r.on === n.on && r.to === (r.axis === "x" ? n.col : n.row) && r.at === (r.axis === "x" ? n.row : n.col));
  return (
    <div className="lp-grid-bg" aria-hidden="true">
      {GRID_ROUTES.map((r, i) => {
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
      {GRID_NODES.map((n, i) => {
        const t = timing(n);
        const style: Vars = { "--c": n.col, "--r": n.row };
        if (t) Object.assign(style, { "--dur": `${t.dur}s`, "--delay": `${t.delay}s` });
        return <span key={i} className="lp-node" data-state={n.state ?? (t ? "live" : "idle")} data-on={n.on} style={style} />;
      })}
    </div>
  );
}

export function Hero() {
  return (
    <section className="lp-hero-band" id="top">
      <HeroGrid />
      <div className="lp-wrap lp-hero">
        <h1 className="lp-h1">
          {c.hero.lead}
          <br className="lp-br" />{" "}
          <span className="lp-accent">
            {c.hero.accent}{" "}
            <span className="lp-nowrap">
              <FlipWords words={c.hero.flip} />.
            </span>
          </span>
        </h1>
        <p className="lp-hero-sub">{c.hero.subhead}</p>
        <div className="lp-hero-cta">
          <Button size="lg" href="#book">
            Book a call
          </Button>
          <Button variant="ghost" size="lg" href="#how" arrow={false}>
            See how it works
          </Button>
        </div>
      </div>
    </section>
  );
}

/** The product, on a full-bleed black band right under the hero. */
export function ProductBand() {
  return (
    <section className="vt-bleed lp-bleed lp-bleed--stage">
      <div className="lp-wrap lp-stage">
        <PortalTour data={c.portal} clipH={640} clipHMobile={860} />
        <span className="lp-illus">Illustrative data</span>
      </div>
    </section>
  );
}

export function Trust() {
  return (
    <section className="lp-wrap lp-trust">
      <LogoStrip heading="Trusted by high-risk brands" logos={c.logos} />
    </section>
  );
}

export function Problem() {
  return (
    <section className="vt-bleed lp-bleed">
      <div className="lp-wrap lp-sec lp-sec--flush">
        <div className="lp-head lp-head--split">
          <div className="lp-head-main">
            <span className="vt-eyebrow lp-eyebrow">{c.problem.eyebrow}</span>
            <h2 className="lp-h2">
              Keep selling when your account <RotatingWord words={c.problem.rotating} />
            </h2>
          </div>
          <p className="lp-lede lp-on-dark-muted">{c.problem.blurb}</p>
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
        <span className="vt-eyebrow lp-eyebrow">{c.how.eyebrow}</span>
        <h2 className="lp-h2">{c.how.title}</h2>
      </div>
      <HowFlow steps={c.how.steps} />
    </section>
  );
}

export function WhatYouGet() {
  return (
    <section className="lp-wrap lp-sec lp-wyg">
      <div className="lp-head lp-head--center">
        <span className="vt-eyebrow lp-eyebrow">{c.whatYouGet.eyebrow}</span>
        <h2 className="lp-h2">{c.whatYouGet.title}</h2>
        <p className="lp-blurb">{c.whatYouGet.blurb}</p>
      </div>
      <FeatureGridMotion items={c.whatYouGet.items} />
    </section>
  );
}

export function ForBrands() {
  return (
    <section className="vt-bleed lp-bleed">
      <div className="lp-wrap">
        <FeaturePanel {...c.forBrands} />
      </div>
    </section>
  );
}

export function Providers() {
  return (
    <section className="lp-wrap lp-sec">
      <div className="lp-head lp-head--center">
        <span className="vt-eyebrow lp-eyebrow">{c.providers.eyebrow}</span>
        <h2 className="lp-h2">{c.providers.title}</h2>
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
        <div className="lp-head-main">
          <span className="vt-eyebrow lp-eyebrow">{c.industries.eyebrow}</span>
          <h2 className="lp-h2">{c.industries.title}</h2>
        </div>
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
          <span className="vt-eyebrow lp-eyebrow">{c.testimonials.eyebrow}</span>
          <h2 className="lp-h2">{c.testimonials.title}</h2>
        </div>
        <MerchantStories items={c.testimonials.items} />
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="lp-wrap lp-sec">
      <FAQ blurb={c.faq.blurb} items={c.faq.items} ctaHref="#book" />
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="vt-bleed lp-bleed lp-bleed--cta" id="book">
      <div className="lp-wrap">
        <CTABand title={c.cta.title} points={c.cta.points} ctaHref="#book" />
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <div className="lp-wrap lp-footer" id="company">
      <Footer tagline={c.footer.tagline} columns={c.footer.columns} />
    </div>
  );
}
