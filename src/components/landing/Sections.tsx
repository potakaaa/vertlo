import { Button, Diamond, FAQ, Footer, IndustryCards } from "@/components/vertlo";
import * as c from "@/content/landing";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { PortalTour } from "@/components/landing/PortalTour";
import { rich } from "@/components/landing/Rich";
import { Letter, Microprint, Sheet } from "@/components/landing/Paper";

/* Concept A, security paper. The page is a desk (the misty green ground) with papers laid on it:
   a banknote with the headline, the laptop running the portal, then a stack of documents, one per
   section, each sliding up and settling on the one before (sticky sheets, see Paper.tsx; the scroll
   motion is PaperMotion.tsx). Every sheet is a real document that says one thing: the termination
   letter (the problem), the statement (how it works, then the day it matters), the approval letter
   (underwriting), the register (who it's for), the questions, and the cheque (the call).
   All art is drawn in code: guilloché from scripts/paper-art.mjs, the dot-matrix scenes, the diamond.
   Layout classes are in app/landing.css (lp-*), the paper look in app/paper.css (pp-*). */

/* Hero and product in one pinned section: the page itself is the banknote, the portal on a laptop
   below it. No card: the bill is the ground the headline is printed on (engraved waves, a rosette
   running off each edge, a guilloché border along its foot), with a note's marks set around the
   centred copy: a medallion portrait between two lines of microprint, a serial, an engraved "1"
   (one account). Scrolling zooms into the laptop until its screen fills the view, then runs the
   portal tour (PortalTour, which fades `.lp-hero` out and back). */
export function Hero() {
  return (
    <section className="lp-hero-band" id="top">
      <div className="pp-hero-bg" aria-hidden="true" />
      <div className="lp-wrap lp-hero">
        {/* the bill, full bleed behind the copy */}
        <div className="pp-bill" aria-hidden="true">
          <span className="pp-bill-rose pp-bill-rose--l" />
          <span className="pp-bill-rose pp-bill-rose--r" />
        </div>
        <div className="pp-note" data-note="">
          <span className="pp-note-serial" aria-hidden="true">
            {c.hero.serial}
          </span>
          <div className="pp-note-copy">
            <div className="pp-note-top" aria-hidden="true">
              <p className="pp-note-micro pp-note-micro--l">
                <Microprint text={c.hero.micro} />
              </p>
              {/* the note's portrait: a guilloché medallion around the Vertlo diamond */}
              <span className="pp-note-medallion">
                <Diamond size={22} />
              </span>
              <p className="pp-note-micro">
                <Microprint text={c.hero.micro} />
              </p>
            </div>
            <h1 className="lp-h1">
              {c.hero.lead}
              <br className="lp-br" /> {c.hero.accent}{" "}
              <span className="lp-nowrap">
                <em className="pp-ink">{c.hero.word}</em>.
              </span>
            </h1>
            <p className="lp-hero-sub">{c.hero.subhead}</p>
          </div>
          {/* the denomination, engraved in the corner: one account */}
          <span className="pp-note-numeral" aria-hidden="true">
            1
          </span>
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

/* Under the laptop, before the stack: what it connects to, the networks' own marks in grey. */
export function WorksWith() {
  return (
    <section className="lp-wrap pp-works" aria-label={c.worksWith.label}>
      <p className="pp-works-k">{c.worksWith.label}</p>
      <ul className="pp-works-list">
        {c.worksWith.logos.map((l) => (
          <li key={l.name}>
            {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG marks */}
            <img src={l.src} alt={l.name} width={l.w} height={l.h} />
          </li>
        ))}
        <li className="pp-works-rest">{c.worksWith.rest}</li>
      </ul>
    </section>
  );
}

/* Sheet 1, the problem: the termination letter every high-risk merchant dreads. Its lines type on as
   the sheet arrives, the verdict is struck through, and Vertlo's note is typed under it. */
export function Notice() {
  const n = c.notice;
  return (
    <Sheet id="notice">
      <div className="pp-pair">
        <Letter letter={n} tilt={-1.1} />
        <div className="pp-pair-copy">
          <h2 className="lp-h2">{n.title}</h2>
          <p className="lp-lede">{n.blurb}</p>
          <Button variant="text" href="#book">
            Book a call
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

/* Sheet 2, how it works: the scroll-scrubbed flow (HowFlow), then the day it matters written up as a
   statement's line items. */
export function Statement() {
  const p = c.portal;
  const s = c.statement;
  return (
    <Sheet id="statement" anchor="how">
      <div className="pp-sheet-head">
        <h2 className="lp-h2">{c.how.title}</h2>
        <dl className="pp-ledger-meta">
          <div>
            <dt>Account</dt>
            <dd>{p.merchant}</dd>
          </div>
          <div>
            <dt>Accounts</dt>
            <dd>
              {p.routing.length} MIDs, {p.routing.filter((r) => r.state !== "paused").length} live
            </dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>
              {p.period.from} to {p.period.to}
            </dd>
          </div>
        </dl>
      </div>
      <HowFlow steps={c.how.steps} />
      <table className="pp-ledger">
        <caption>
          <span className="pp-ledger-t">{s.title}</span>
          <span className="pp-illus">{s.label}</span>
        </caption>
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Entry</th>
            <th scope="col" className="pp-ledger-amt">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {s.entries.map((e) => (
            <tr key={e.time} data-tone={e.tone}>
              <td className="pp-ledger-time">{e.time}</td>
              <td>
                <b>{e.entry}</b>
                <span>{e.detail}</span>
              </td>
              <td className="pp-ledger-amt">{e.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Sheet>
  );
}

/* Sheet 3, underwriting: the letter that answers the termination, a new account approved. */
export function Approval() {
  const a = c.approval;
  return (
    <Sheet id="approval" anchor="underwriting">
      <div className="pp-pair pp-pair--flip">
        <div className="pp-pair-copy">
          <h2 className="lp-h2">{a.title}</h2>
          <p className="lp-lede">{a.blurb}</p>
          <Button variant="text" href="#book">
            Book a call
          </Button>
        </div>
        <Letter letter={a} tilt={0.9} />
      </div>
    </Sheet>
  );
}

/* Sheet 4, who it's for: a register, one ruled row per industry with its dot-matrix drawing. The
   merchant stories join it once real quotes are approved (testimonials.ready). */
export function Register() {
  return (
    <Sheet id="register" anchor="industries">
      <div className="pp-sheet-head">
        <h2 className="lp-h2">{c.industries.title}</h2>
      </div>
      <IndustryCards items={c.industries.items} className="pp-register" />
      {c.testimonials.ready ? (
        <div className="pp-register-stories" id="reviews">
          <h3 className="pp-sub">{c.testimonials.title}</h3>
          <MerchantStories items={c.testimonials.items} />
        </div>
      ) : null}
    </Sheet>
  );
}

/* Sheet 5, questions: kept short and plain. */
export function Questions() {
  return (
    <Sheet id="questions" anchor="questions">
      <FAQ title={rich(c.faq.title)} blurb={c.faq.blurb} items={c.faq.items} ctaHref="#book" />
    </Sheet>
  );
}

/* Sheet 6, the closing call: a cheque made out to the merchant's checkout, laid last on the stack.
   Guilloché ground, serial, a pay line, a memo, and the one CTA on the signature line (its signature
   writes itself in as the cheque lands). */
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
      <Footer
        tagline={c.footer.tagline}
        columns={c.footer.columns}
        legal={["Privacy", "Terms"]}
        fine={
          <dl className="pp-issuer">
            {c.footer.issuer.map((it) => (
              <div key={it.k}>
                <dt>{it.k}</dt>
                <dd>{it.v}</dd>
              </div>
            ))}
          </dl>
        }
      />
    </div>
  );
}
