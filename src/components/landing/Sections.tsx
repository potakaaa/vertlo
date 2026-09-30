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
import { Microprint, Sheet, Stamp } from "@/components/landing/Paper";

/* Concept A, security paper. The page is a desk (the misty green ground) with papers laid on it:
   a banknote with the headline, the laptop running the portal, then a stack of documents, one per
   section, each sliding up and settling on the one before (sticky sheets, see Paper.tsx; the scroll
   motion is PaperMotion.tsx). Guilloché art and engraved vignettes are in public/images/paper
   (scripts/paper-art.mjs; the vignettes are generated engravings). Accent words are set in the ink
   colour (`*words*` in content, see Rich.tsx). Every section is a server component; the interactive
   bits are client components. Layout classes are in app/landing.css (lp-*), the paper look in
   app/paper.css (pp-*). */

/* Hero and product in one pinned section: the headline printed on a banknote, the portal on a laptop
   below it. Scrolling zooms into the laptop until its screen fills the view, then runs the portal
   tour (PortalTour, which fades `.lp-hero` out and back). */
export function Hero() {
  return (
    <section className="lp-hero-band" id="top">
      <div className="pp-hero-bg" aria-hidden="true" />
      <div className="lp-wrap lp-hero">
        <div className="pp-note" data-note="">
          <span className="pp-note-corner pp-note-corner--tl" aria-hidden="true">
            {c.hero.serial}
          </span>
          <span className="pp-note-corner pp-note-corner--br" aria-hidden="true">
            {c.hero.series}
          </span>
          <figure className="pp-note-vignette" aria-hidden="true" />
          <div className="pp-note-copy">
            <p className="pp-note-micro" aria-hidden="true">
              <Microprint />
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
          </div>
          <span className="pp-note-seal" aria-hidden="true" />
        </div>
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

/* Sheet 1, the problem: the termination letter every high-risk merchant dreads. Its lines type on as
   the sheet arrives, the verdict is struck through, and Vertlo's answer is stamped over it. */
export function Notice() {
  const n = c.notice;
  return (
    <Sheet id="notice">
      <div className="pp-notice">
        <article className="pp-letter" aria-label={n.label}>
          <header className="pp-letter-head">
            <span>
              <b>{n.from}</b>
              {n.fromSub}
            </span>
            <span>{n.date}</span>
          </header>
          <p className="pp-letter-ref">{n.ref}</p>
          {n.lines.map((l, i) => (
            <p key={i} className="pp-letter-line">
              {i > 0 ? <del>{l}</del> : l}
            </p>
          ))}
          <p className="pp-letter-sign">{n.sign}</p>
          <p className="pp-letter-reply">
            <Diamond size={8} />
            <span>{n.reply}</span>
          </p>
          <Stamp className="pp-letter-stamp">{n.stamp}</Stamp>
          <span className="pp-illus">{n.label}</span>
        </article>
        <div className="pp-notice-copy">
          <h2 className="lp-h2">
            Keep selling when your account{" "}
            <em className="pp-ink">
              <RotatingWord words={c.problem.rotating} />
            </em>
          </h2>
          <p className="lp-lede">{c.problem.blurb}</p>
        </div>
      </div>
      <IndustryCards items={c.problem.items} />
    </Sheet>
  );
}

/* Sheet 2, how it works: a statement of account, the flow scrubbed by scroll (HowFlow). */
export function Statement() {
  const p = c.portal;
  return (
    <Sheet id="statement" anchor="how">
      <div className="pp-sheet-head">
        <h2 className="lp-h2">{rich(c.how.title)}</h2>
        <dl className="pp-ledger-meta">
          <div>
            <dt>Account</dt>
            <dd>{p.merchant}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>
              {p.period.from} – {p.period.to}
            </dd>
          </div>
          <div>
            <dt>Accounts</dt>
            <dd>{p.routing.length} MIDs · {p.routing.filter((r) => r.state !== "paused").length} live</dd>
          </div>
        </dl>
      </div>
      <HowFlow steps={c.how.steps} />
    </Sheet>
  );
}

/* Sheet 3, what you get and the providers it connects: a certificate-style schedule with a seal. */
export function Schedule() {
  return (
    <Sheet id="schedule">
      <span className="pp-seal" aria-hidden="true" />
      <div className="pp-sheet-head pp-sheet-head--split">
        <h2 className="lp-h2">{rich(c.whatYouGet.title)}</h2>
        <p className="lp-lede">{c.whatYouGet.blurb}</p>
      </div>
      <div className="lp-wyg">
        <FeatureGridMotion items={c.whatYouGet.items} />
      </div>
      <div className="pp-schedule-b">
        <h3 className="pp-sub">
          <span className="pp-sub-k">Schedule B</span>
          {rich(c.providers.title)}
        </h3>
        <div className="lp-pf-d">
          <ProviderFlow />
        </div>
        <div className="lp-pf-m">
          <ProviderFlow layout="vertical" />
        </div>
      </div>
    </Sheet>
  );
}

/* Sheet 4, underwriting: the one dark document, a letter of approval with a vault engraving. */
export function Approval() {
  return (
    <Sheet id="approval" tone="dark">
      <span className="pp-approval-vault" aria-hidden="true" />
      <FeaturePanel {...c.forBrands} title={rich(c.forBrands.title)} />
    </Sheet>
  );
}

/* Sheet 5, who it's for: the register of industries, then merchants' own accounts of it. */
export function Register() {
  return (
    <Sheet id="register" anchor="industries">
      <div className="pp-sheet-head pp-sheet-head--split pp-register-head">
        <h2 className="lp-h2">{rich(c.industries.title)}</h2>
        <span className="pp-register-globe" aria-hidden="true" />
      </div>
      <IndustryCards items={c.industries.items} />
      <div className="pp-register-stories" id="reviews">
        <h3 className="pp-sub">
          <span className="pp-sub-k">{c.testimonials.eyebrow}</span>
          {rich(c.testimonials.title)}
        </h3>
        <MerchantStories items={c.testimonials.items} />
      </div>
    </Sheet>
  );
}

/* Sheet 6, questions: the terms, kept short and plain. */
export function Terms() {
  return (
    <Sheet id="terms">
      <FAQ title={rich(c.faq.title)} blurb={c.faq.blurb} items={c.faq.items} ctaHref="#book" />
    </Sheet>
  );
}

/* Sheet 7, the closing call: a cheque made out to the merchant's checkout, laid last on the stack.
   Guilloché ground, serial, a pay line, a memo, the one CTA on the signature line (its signature
   writes itself in as the cheque lands), and the approval stamped across. */
export function FinalCTA() {
  const { cheque } = c.cta;
  return (
    <Sheet id="cheque" anchor="book" bare>
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
            {/* the signature sits on its own line, under the button, where a cheque is signed */}
            <span className="pp-cheque-sigline" aria-hidden="true">
              <svg className="pp-signature" viewBox="0 0 260 64">
                <path d="M8 44c10-2 16-16 22-26 4-7 8-6 6 2-3 12-9 26-6 28 4 2 10-14 15-20 3-4 5-2 4 2-1 6-3 12 1 12 5 0 9-10 13-12 3-1 3 3 2 6-2 6 1 8 6 4 6-5 9-16 14-18 3-1 2 4 0 8-3 7-4 13 1 12 6-2 10-12 16-14 4-1 2 6 1 9-1 5 3 6 7 2 5-5 7-12 12-13 4 0 1 7 4 8 6 1 14-8 22-10 10-2 30 0 44-4" />
              </svg>
            </span>
            <span className="pp-cheque-k">{cheque.signLabel}</span>
          </div>
          <Stamp className="pp-cheque-stamp">{cheque.stamp}</Stamp>
        </div>
        <p className="pp-cheque-micr" aria-hidden="true">
          {cheque.micr}
        </p>
      </div>
    </Sheet>
  );
}

export function SiteFooter() {
  return (
    <div className="lp-wrap lp-footer" id="company">
      <Footer tagline={c.footer.tagline} columns={c.footer.columns} />
    </div>
  );
}
