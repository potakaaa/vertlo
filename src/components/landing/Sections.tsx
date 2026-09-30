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
import * as c from "@/content/landing";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { FeatureGridMotion } from "@/components/landing/FeatureGridMotion";
import { PortalTour } from "@/components/landing/PortalTour";
import { rich } from "@/components/landing/Rich";
import { BoardingPass, DepartureBoard, Sign, StatusKey } from "@/components/landing/Board";

/* One responsive page read like a departures hall for merchant accounts: a split-flap board in the
   hero, sections that open on wayfinding signs (gate numbers in content: `gates`), the call as a
   boarding pass and a status key over the footer. Accent words are set in the brand green (`*words*`
   in content, see Rich.tsx). Two full-bleed board-black bands stay for the stealth side (`vt-bleed`:
   the section itself is the backdrop). Every section is a server component; the interactive bits are
   client components. Layout classes are in app/landing.css (lp-*), the board look in app/board.css (bd-*). */

/* The headline and the board: the board plays the page's promise (an account pauses, its orders move). */
export function Hero() {
  return (
    <section className="bd-hero" id="top">
      <div className="lp-wrap bd-hero-in">
        <div className="bd-hero-head">
          <h1 className="lp-h1">
            <span>{c.hero.lead}</span> <em className="bd-accent">{c.hero.accent}</em>
          </h1>
          <div className="bd-hero-side">
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
        </div>
        <DepartureBoard data={c.board} />
      </div>
    </section>
  );
}

/* The product under the board: the portal on a laptop. The section pins; scrolling zooms into the
   laptop until its screen fills the view, then runs the portal tour (PortalTour). */
export function Tour() {
  return (
    <section className="lp-hero-band bd-tour" aria-label="The Vertlo portal">
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
            <Diamond size={9} outline />
            {l}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Problem() {
  return (
    <section className="vt-bleed lp-bleed">
      <div className="lp-wrap lp-sec lp-sec--flush">
        <Sign gate={c.gates.problem}>{c.problem.eyebrow}</Sign>
        <div className="lp-head lp-head--split">
          <div className="lp-head-main">
            <h2 className="lp-h2">
              Keep selling when your account{" "}
              <em className="bd-accent">
                <RotatingWord words={c.problem.rotating} />
              </em>
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
      <Sign gate={c.gates.how}>{c.how.eyebrow}</Sign>
      <div className="lp-head">
        <h2 className="lp-h2">{rich(c.how.title)}</h2>
      </div>
      <HowFlow steps={c.how.steps} />
    </section>
  );
}

export function WhatYouGet() {
  return (
    <section className="lp-wrap lp-sec lp-wyg">
      <Sign gate={c.gates.whatYouGet}>{c.whatYouGet.eyebrow}</Sign>
      <div className="lp-head lp-head--split">
        <div className="lp-head-main">
          <h2 className="lp-h2">{rich(c.whatYouGet.title)}</h2>
        </div>
        <p className="lp-lede">{c.whatYouGet.blurb}</p>
      </div>
      <FeatureGridMotion items={c.whatYouGet.items} />
    </section>
  );
}

export function ForBrands() {
  const { eyebrow, ...panel } = c.forBrands;
  return (
    <section className="vt-bleed lp-bleed lp-velvet">
      <div className="lp-wrap">
        <Sign gate={c.gates.forBrands}>{eyebrow}</Sign>
        <FeaturePanel {...panel} title={rich(panel.title)} />
      </div>
    </section>
  );
}

export function Providers() {
  return (
    <section className="lp-wrap lp-sec">
      <Sign gate={c.gates.providers}>{c.providers.eyebrow}</Sign>
      <div className="lp-head">
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
      <Sign gate={c.gates.industries}>{c.industries.eyebrow}</Sign>
      <div className="lp-head lp-head--split lp-head--end">
        <div className="lp-head-main">
          <h2 className="lp-h2">{rich(c.industries.title)}</h2>
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
    <section className="lp-band" id="reviews">
      <div className="lp-wrap lp-sec">
        <Sign gate={c.gates.testimonials}>{c.testimonials.eyebrow}</Sign>
        <div className="lp-head">
          <h2 className="lp-h2">{rich(c.testimonials.title)}</h2>
        </div>
        <MerchantStories items={c.testimonials.items} />
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="lp-wrap lp-sec">
      <Sign gate={c.gates.faq}>{c.faq.eyebrow}</Sign>
      <FAQ title={rich(c.faq.title)} blurb={c.faq.blurb} items={c.faq.items} ctaHref="#book" />
    </section>
  );
}

/* The closing call, drawn as a boarding pass: the pitch and the one CTA on the pass, the flight
   details repeated on the stub past the tear line. */
export function FinalCTA() {
  return (
    <section className="lp-wrap lp-sec bd-cta" id="book">
      <Sign gate={c.gates.book}>Book a call</Sign>
      <BoardingPass pass={c.cta.pass} title={rich(c.cta.title)} blurb={c.cta.blurb} points={c.cta.points} />
    </section>
  );
}

export function SiteFooter() {
  return (
    <div className="lp-wrap lp-footer" id="company">
      <StatusKey {...c.footer.key} />
      <Footer tagline={c.footer.tagline} columns={c.footer.columns} wordmark={false} />
    </div>
  );
}
