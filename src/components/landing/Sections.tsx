import { Diamond, IndustryCards } from "@/components/vertlo";
import * as c from "@/content/landing";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { PortalTour } from "@/components/landing/PortalTour";
import {
  BookCall,
  Coupon,
  DataTable,
  FrontMast,
  Headline,
  Imprint,
  MadeFor,
  Notice,
  QA,
  RunningHead,
  Timeline,
} from "@/components/landing/Press";
import { Edition, Engraving, Page, RerouteBoard, Spread } from "@/components/landing/Edition";

/* Concept C, "the edition": the site is a paper you turn page by page (Edition.tsx). The front section
   (A1–A4) turns sideways: the front page, then Risk, Routing and Underwriting, each page one screen with
   its own composition and scene. The paper then opens to a centre spread that scrolls down: the portal on
   a laptop and how routing is wired. The back section (B1–B4) turns sideways again: the numbers, Letters,
   Q&A, and the Classifieds page with the clip-out coupon; the imprint closes the paper. Stipple engravings
   (public/images/press) print onto the pages. Copy is a headline and one line a page; figures carry the
   rest, numbered in reading order (Figure 1 routing board, 2 underwriting, 3 portal, 4 how it's wired). */

const folio = (id: string) => {
  const p = c.edition.pages.find((x) => x.id === id);
  if (!p) throw new Error(`No page "${id}" in the edition`);
  return p;
};

export function Head() {
  return <RunningHead nameplate={c.masthead.nameplate} pages={c.edition.pages} />;
}

/* A1–A4: the front section, turned sideways */
export function FrontSection() {
  const u = c.underwriting;
  return (
    <Edition label="Front section, pages A1 to A4">
      {/* A1: the lead story beside Exhibit A */}
      <Page {...folio("front")} folio={false} turn={c.edition.turn}>
        <FrontMast nameplate={c.masthead.nameplate} edition={c.masthead.edition} motto={c.masthead.motto} />
        <div className="pr-front">
          <div className="pr-front-story">
            <h1 className="pr-h1">
              {c.hero.headline.split(/(?<=\.)\s+/).map((line) => (
                <span key={line} className="pr-h1-line">
                  {line}{" "}
                </span>
              ))}
            </h1>
            <p className="pr-deck">{c.hero.deck}</p>
            <BookCall size="lg" />
          </div>
          <Notice {...c.notice} />
        </div>
      </Page>

      {/* A2: a secondary story set across the page: three briefs, and who it's made for on one ruled line */}
      <Page {...folio("risk")} scene="briefs" turn={c.edition.turn}>
        <div className="pr-risk">
          <div className="pr-risk-head">
            <Headline title={c.problem.title} deck={c.problem.blurb} />
            <Engraving src="/images/press/goods.jpg" />
          </div>
          <IndustryCards items={c.problem.items} className="pr-briefs" />
          <MadeFor {...c.problem.madeFor} />
        </div>
      </Page>

      {/* A3: the second lead: the routing board at the minute of the pause (Figure 1) */}
      <Page {...folio("routing")} scene="reroute" turn={c.edition.turn}>
        <div className="pr-split">
          <div className="pr-split-l">
            <Headline size="lead" title={c.routing.title} deck={c.routing.deck} />
            <Engraving src="/images/press/checkout.jpg" />
          </div>
          <RerouteBoard {...c.routing.board} notice={c.notice.reroute} />
        </div>
      </Page>

      {/* A4: one application's timeline, drawn across the page (Figure 2) */}
      <Page {...folio("underwriting")} scene="underwriting" turn="Scroll on: the paper opens">
        <div className="pr-uw">
          <div className="pr-uw-head">
            <Headline title={u.title} deck={u.deck} />
            <Engraving src="/images/press/pen.jpg" />
          </div>
          <figure className="pr-fig">
            <Timeline steps={u.steps} />
            <figcaption className="pr-cap">
              <b>{u.figure.label}.</b> {u.figure.caption} <span className="pr-cap-credit">{u.figure.credit}</span>
            </figcaption>
          </figure>
        </div>
      </Page>
    </Edition>
  );
}

/* C: the centre spread, scrolled down: the portal on a laptop (Figure 3, pinned and toured) and how
   routing is wired (Figure 4, HowFlow) */
export function CentreSpread() {
  const flowCaption = (
    <>
      <b>{c.flowFigure.label}.</b> {c.flowFigure.caption} <span className="pr-cap-credit">{c.flowFigure.credit}</span>
    </>
  );
  const page = folio("centre");
  return (
    <Spread {...page}>
      <div className="lp-wrap pr-spread-head">
        <header className="pr-folio">
          <b>{page.no}</b> {page.section}
        </header>
        <Headline size="lead" title="The portal, opened up." deck={c.edition.centre} />
      </div>
      <section className="pr-figsec" aria-label={`${c.portalFigure.label}: the Vertlo portal`}>
        <div className="lp-wrap lp-stage">
          <PortalTour data={c.portal} clipH={760} clipHMobile={860} />
        </div>
        <div className="lp-wrap">
          <p className="pr-cap pr-cap--fig">
            <b>{c.portalFigure.label}.</b> {c.portalFigure.caption} <span className="pr-cap-credit">{c.portalFigure.credit}</span>
          </p>
        </div>
      </section>
      <div className="lp-wrap pr-spread-part" id="how">
        <Headline title={c.how.title} deck={c.how.deck} />
        <HowFlow steps={c.how.steps} caption={flowCaption} />
        <p className="pr-cap pr-cap--m">{flowCaption}</p>
      </div>
    </Spread>
  );
}

/* B1–B4: the back section, turned sideways, ending on the coupon */
export function BackSection() {
  return (
    <Edition label="Back section, pages B1 to B4">
      {/* B1: a table-led page: Table 1 large, the headline in the margin */}
      <Page {...folio("numbers")} scene="numbers" turn={c.edition.turn}>
        <div className="pr-numbers">
          <DataTable {...c.table} />
          <div className="pr-numbers-side">
            <Headline title={c.numbers.title} deck={c.numbers.deck} />
            <Engraving src="/images/press/parcels.jpg" />
          </div>
        </div>
      </Page>

      <Page {...folio("letters")} turn={c.edition.turn}>
        <div className="pr-letters">
          <div className="pr-letters-h">
            <Headline title={c.testimonials.title} />
            <p className="pr-note">{c.testimonials.note}</p>
          </div>
          <MerchantStories items={c.testimonials.items} />
        </div>
      </Page>

      <Page {...folio("questions")} scene="qa" turn={c.edition.turn}>
        <div className="pr-split pr-split--qa">
          <div className="pr-split-l">
            <Headline title={c.faq.title} deck={c.faq.blurb} />
            <Engraving src="/images/press/magnifier.jpg" />
          </div>
          <QA items={c.faq.items} />
        </div>
      </Page>

      {/* B4: the merchants' register, then the coupon as the last thing printed */}
      <Page {...folio("classifieds")} scene="classifieds">
        <div className="pr-classifieds">
          <div className="pr-trust">
            <p className="pr-trust-h">
              <span>{c.trust.heading}</span>
              <span>{c.trust.note}</span>
            </p>
            <ul className="pr-logos">
              {c.logos.map((l) => (
                <li key={l}>
                  <Diamond size={8} outline />
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div id="book">
            <Coupon title={c.cta.title} blurb={c.cta.blurb} bring={c.cta.bring} terms={c.cta.terms} />
          </div>
        </div>
      </Page>
    </Edition>
  );
}

export function SiteFooter() {
  return <Imprint nameplate={c.masthead.nameplate} tagline={c.imprint.tagline} notes={c.imprint.notes} pages={c.edition.pages} />;
}
