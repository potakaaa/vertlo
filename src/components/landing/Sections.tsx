import { CrmSlice, Diamond, Icon, IndustryCards, ProviderFlow } from "@/components/vertlo";
import * as c from "@/content/landing";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { FeatureGridMotion } from "@/components/landing/FeatureGridMotion";
import { PortalTour } from "@/components/landing/PortalTour";
import {
  BookCall,
  Colophon,
  Coupon,
  DataTable,
  Fig,
  Flag,
  Headline,
  Masthead,
  Notice,
  PullQuote,
  QA,
} from "@/components/landing/Press";

/* One responsive page set as a financial trade paper: a masthead, a lead story with its exhibit, the
   portal as Figure 1, then sections under newspaper flags (Risk, Routing, The portal, Underwriting,
   Markets, Merchants, Q&A) and a clip-out coupon to close. Headlines are whole sentences in one serif
   with one line under them; numbers sit in Table 1. The product (portal, HowFlow, feature grid,
   dot-matrix art) is printed on the page as figures. Every section is a server component; the
   interactive bits are client components. Pieces in Press.tsx, styles in app/press.css (pr-*),
   component layout in app/landing.css (lp-*). */

export function Front() {
  return (
    <Masthead
      nameplate={c.masthead.nameplate}
      edition={c.masthead.edition}
      motto={c.masthead.motto}
      links={c.navLinks}
    />
  );
}

/* The lead story: the headline across the page, one sentence to a line; under a hairline, the deck,
   three numbered points and the call beside Exhibit A (the termination email, struck through, with
   the reroute landing on it). */
export function Hero() {
  const lines = c.hero.headline.split(/(?<=\.)\s+/);
  return (
    <section className="lp-wrap pr-lead" aria-labelledby="lead-t">
      <p className="pr-kicker">{c.hero.kicker}</p>
      <h1 className="pr-h1" id="lead-t">
        {lines.map((l, i) => (
          <span key={i} className="pr-h1-line">
            {l}{" "}
          </span>
        ))}
      </h1>
      <div className="pr-lead-row">
        <div className="pr-lead-story">
          <p className="pr-deck">{c.hero.deck}</p>
          <ol className="pr-lead-points">
            {c.hero.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <BookCall size="lg" />
        </div>
        <Notice {...c.notice} />
      </div>
    </section>
  );
}

/* Figure 1: the portal on a laptop. The section pins while scrolling zooms into the screen and tours it
   (PortalTour); it's its own section so the pin starts with the laptop at the top of the view. */
export function Portal() {
  return (
    <section className="pr-figsec" id="figure-1" aria-label="Figure 1: the Vertlo portal">
      <div className="lp-wrap lp-stage">
        <PortalTour data={c.portal} clipH={760} clipHMobile={860} />
      </div>
      <div className="lp-wrap">
        <p className="pr-cap pr-cap--fig1">
          <b>{c.figure1.label}.</b> {c.figure1.caption}
          <span className="pr-cap-credit">{c.figure1.credit}</span>
        </p>
      </div>
    </section>
  );
}

export function Trust() {
  return (
    <section className="lp-wrap pr-trust" aria-labelledby="trust-t">
      <p className="pr-trust-h">
        <span id="trust-t">{c.trust.heading}</span>
        <span className="pr-trust-note">{c.trust.note}</span>
      </p>
      <ul className="pr-logos">
        {c.logos.map((l) => (
          <li key={l}>
            <Diamond size={8} outline />
            {l}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Problem() {
  return (
    <section className="lp-wrap pr-sec" aria-labelledby="risk-t">
      <Flag>{c.problem.eyebrow}</Flag>
      <div className="pr-head">
        <Headline id="risk-t" title={c.problem.title} deck={c.problem.blurb} />
      </div>
      <IndustryCards items={c.problem.items} className="pr-briefs" />
    </section>
  );
}

/* Routing: the HowFlow scene as Figure 2, then Table 1 with a pull quote beside it. */
export function How() {
  const fig2 = (
    <>
      <b>{c.figure2.label}.</b> {c.figure2.caption}
      <span className="pr-cap-credit">Illustrative</span>
    </>
  );
  return (
    <section className="lp-wrap pr-sec" id="how" aria-labelledby="how-t">
      <Flag>{c.how.eyebrow}</Flag>
      <div className="pr-head">
        <Headline id="how-t" title={c.how.title} deck={c.how.deck} />
      </div>
      <div className="pr-flowfig">
        <HowFlow steps={c.how.steps} caption={fig2} />
        <p className="pr-cap pr-cap--m">{fig2}</p>
      </div>
      <div className="pr-tablerow">
        <DataTable {...c.table} />
        <PullQuote label="In brief" source="When a MID pauses">
          {c.hero.pull}
        </PullQuote>
      </div>
    </section>
  );
}

export function WhatYouGet() {
  return (
    <section className="lp-wrap pr-sec lp-wyg" id="portal" aria-labelledby="wyg-t">
      <Flag>{c.whatYouGet.eyebrow}</Flag>
      <div className="pr-head">
        <Headline id="wyg-t" title={c.whatYouGet.title} deck={c.whatYouGet.blurb} />
      </div>
      <FeatureGridMotion items={c.whatYouGet.items} />
    </section>
  );
}

/* Underwriting: headline beside the four points as a ruled 2 × 2, then the portal's underwriting queue
   and MIDs side by side on a dark screen as Figure 4. */
export function ForBrands() {
  const u = c.forBrands;
  return (
    <section className="lp-wrap pr-sec" id="underwriting" aria-labelledby="uw-t">
      <Flag>{u.eyebrow}</Flag>
      <div className="pr-uw">
        <Headline id="uw-t" title={u.title} deck={u.deck} />
        <ul className="pr-points">
          {u.items.map((it) =>
            typeof it === "string" ? null : (
              <li key={it.label}>
                <Icon name={it.icon ?? "layers"} size={20} />
                <span>
                  <b>{it.label}</b>
                  {it.meta}
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
      <Fig label="Figure 4" caption={u.figure}>
        <div className="pr-slices">
          <CrmSlice kind="underwriting" decorative />
          <CrmSlice kind="mids" decorative />
        </div>
      </Fig>
    </section>
  );
}

export function Industries() {
  return (
    <section className="lp-wrap pr-sec" id="industries" aria-labelledby="mk-t">
      <Flag>{c.industries.eyebrow}</Flag>
      <div className="pr-head">
        <Headline id="mk-t" title={c.industries.title} />
      </div>
      <IndustryCards items={c.industries.items} className="pr-briefs" />
      <Fig
        label={c.providers.label}
        caption={`${c.providers.title} ${c.providers.caption}`}
        credit="Diagram"
        className="pr-pf"
      >
        <div className="lp-pf-d">
          <ProviderFlow />
        </div>
        <div className="lp-pf-m">
          <ProviderFlow layout="vertical" />
        </div>
      </Fig>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="lp-wrap pr-sec" id="reviews" aria-labelledby="ms-t">
      <Flag aside={c.testimonials.note}>{c.testimonials.eyebrow}</Flag>
      <div className="pr-head">
        <Headline id="ms-t" title={c.testimonials.title} />
      </div>
      <MerchantStories items={c.testimonials.items} />
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="lp-wrap pr-sec" id="questions" aria-labelledby="qa-t">
      <Flag>{c.faq.eyebrow}</Flag>
      <div className="pr-qa-wrap">
        <div className="pr-qa-side">
          <Headline id="qa-t" title={c.faq.title} deck={c.faq.blurb} />
        </div>
        <QA items={c.faq.items} />
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="lp-wrap pr-cta" id="book" aria-labelledby="book-t">
      <Coupon label={c.cta.label} title={c.cta.title} blurb={c.cta.blurb} bring={c.cta.bring} terms={c.cta.terms} />
    </section>
  );
}

export function SiteFooter() {
  return (
    <Colophon
      nameplate={c.masthead.nameplate}
      tagline={c.footer.tagline}
      colophon={c.footer.colophon}
      columns={c.footer.columns}
    />
  );
}
