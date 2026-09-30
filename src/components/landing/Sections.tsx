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
import { FlipWords } from "@/components/landing/FlipWords";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { FeatureGridMotion } from "@/components/landing/FeatureGridMotion";
import { PortalTour } from "@/components/landing/PortalTour";
import { rich } from "@/components/landing/Rich";
import { Microprint, SectionRule, Stamp } from "@/components/landing/Paper";

/* One responsive page dressed as security paper: a misty green ground printed in forest ink, with
   guilloché patterns where photos used to be (public/images/paper, from scripts/paper-art.mjs). Sections
   open on a numbered ledger rule; accent words are set in the ink colour (`*words*` in content, see
   Rich.tsx). Two full-bleed dark bands stay for the stealth side (`vt-bleed`: the section itself is the
   backdrop). Every section is a server component; the interactive bits are client components.
   Layout classes are in app/landing.css (lp-*), the paper look in app/paper.css (pp-*). */

/* Hero and product in one pinned section: a guilloché rosette behind the headline, the portal on a
   laptop. Scrolling zooms into the laptop until its screen fills the view, then runs the portal tour
   (PortalTour). */
export function Hero() {
  return (
    <section className="lp-hero-band" id="top">
      <div className="pp-hero-bg" aria-hidden="true" />
      <div className="lp-wrap lp-hero">
        <p className="pp-serial" aria-hidden="true">
          <span>{c.hero.series}</span>
          <Microprint />
          <span>{c.hero.serial}</span>
        </p>
        <h1 className="lp-h1">
          {c.hero.lead}{" "}
          <Stamp tone="red" className="pp-hero-stamp">
            {c.hero.stamp}
          </Stamp>
          <br className="lp-br" />{" "}
          {c.hero.accent}{" "}
          <span className="lp-nowrap">
            <em className="pp-ink">
              <FlipWords words={c.hero.flip} />
            </em>
            .
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
        <SectionRule no="01">{c.problem.eyebrow}</SectionRule>
        <div className="lp-head lp-head--split">
          <div className="lp-head-main">
            <h2 className="lp-h2">
              Keep selling when your account{" "}
              <em className="pp-ink">
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
      <SectionRule no="02">{c.how.eyebrow}</SectionRule>
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
      <SectionRule no="03">{c.whatYouGet.eyebrow}</SectionRule>
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
        <SectionRule no="04">{eyebrow}</SectionRule>
        <FeaturePanel {...panel} title={rich(panel.title)} />
      </div>
    </section>
  );
}

export function Providers() {
  return (
    <section className="lp-wrap lp-sec">
      <SectionRule no="05">{c.providers.eyebrow}</SectionRule>
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
      <SectionRule no="06">{c.industries.eyebrow}</SectionRule>
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
    <section className="lp-band lp-band--dots" id="reviews">
      <div className="lp-wrap lp-sec">
        <SectionRule no="07">{c.testimonials.eyebrow}</SectionRule>
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
      <SectionRule no="08">{c.faq.eyebrow}</SectionRule>
      <FAQ title={rich(c.faq.title)} blurb={c.faq.blurb} items={c.faq.items} ctaHref="#book" />
    </section>
  );
}

/* The closing call, drawn as a cheque made out to the merchant's checkout: guilloché ground, serial,
   a pay line, a memo, a signature line with the one CTA on it, and the approval stamped across. */
export function FinalCTA() {
  const { cheque } = c.cta;
  return (
    <section className="lp-wrap pp-cta" id="book">
      <div className="pp-cheque">
        <div className="pp-cheque-top">
          <span className="pp-cheque-issuer">
            <Diamond size={11} />
            {cheque.issuer}
          </span>
          <span className="pp-cheque-no">
            Nº {cheque.no}
            <span>{cheque.date}</span>
          </span>
        </div>
        <div className="pp-cheque-body">
          <h2 className="lp-h2">{rich(c.cta.title)}</h2>
          <p className="lp-blurb">{c.cta.blurb}</p>
        </div>
        <div className="pp-cheque-pay">
          <span className="pp-cheque-k">{cheque.payLabel}</span>
          <span className="pp-cheque-line">{cheque.payee}</span>
          <span className="pp-cheque-amount">{cheque.amount}</span>
        </div>
        <div className="pp-cheque-foot">
          <p className="pp-cheque-memo">
            <span className="pp-cheque-k">Memo</span>
            {c.cta.points.join(" · ")}
          </p>
          <div className="pp-cheque-sign">
            <Button size="lg" href="#book">
              Book a call
            </Button>
            <span className="pp-cheque-k">{cheque.signLabel}</span>
          </div>
        </div>
        <p className="pp-cheque-micr" aria-hidden="true">
          {cheque.micr}
        </p>
        <Stamp className="pp-cheque-stamp">{cheque.stamp}</Stamp>
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
