import { CrmSlice, Diamond, Icon, IndustryCards, ProviderFlow } from "@/components/vertlo";
import * as c from "@/content/landing";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { PortalTour } from "@/components/landing/PortalTour";
import {
  BookCall,
  Colophon,
  Coupon,
  DataTable,
  Fig,
  FrontMast,
  Headline,
  Inside,
  Notice,
  QA,
  RunningHead,
} from "@/components/landing/Press";
import { Count, Edition, Engraving, Page, RerouteBoard, Spread } from "@/components/landing/Edition";

/* Concept C, "the edition": the site is a paper you turn page by page (Edition.tsx). The front section
   (A1–A4) turns sideways: the front page, then Risk, Routing and Underwriting, each page one screen with
   its own scene. The paper then opens to a centre spread that scrolls down: the portal on a laptop, how
   routing is wired, the providers. The back section (B1–B5) turns sideways again: Markets, the numbers,
   Letters, Q&A, and the Classifieds page with the clip-out coupon. Stipple engravings (public/images/press)
   print onto each page. Copy is a headline and one line a page; figures carry the rest. */

const folio = (id: string) => {
  const p = c.edition.pages.find((x) => x.id === id);
  if (!p) throw new Error(`No page "${id}" in the edition`);
  return { id: p.id, no: p.no, section: p.section };
};

export function Head() {
  return <RunningHead nameplate={c.masthead.nameplate} pages={c.edition.pages} />;
}

/* A1–A4: the front section, turned sideways */
export function FrontSection() {
  const u = c.forBrands;
  return (
    <Edition label="Front section, pages A1 to A4">
      <Page {...folio("front")} folio={false} turn={c.edition.turn}>
        <FrontMast nameplate={c.masthead.nameplate} edition={c.masthead.edition} motto={c.masthead.motto} />
        <div className="pr-front">
          <div className="pr-front-story">
            <p className="pr-kicker">{c.hero.kicker}</p>
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
        <Inside pages={c.edition.pages.slice(1)} />
      </Page>

      <Page {...folio("risk")} scene="briefs" turn={c.edition.turn}>
        <div className="pr-split">
          <div className="pr-split-l">
            <Headline title={c.problem.title} deck={c.problem.blurb} />
            <Engraving src="/images/press/envelope.jpg" />
          </div>
          <IndustryCards items={c.problem.items} className="pr-briefs" />
        </div>
      </Page>

      <Page {...folio("routing")} scene="reroute" turn={c.edition.turn}>
        <div className="pr-split">
          <div className="pr-split-l">
            <Headline title={c.routing.title} deck={c.routing.deck} />
            <Engraving src="/images/press/terminal.jpg" />
          </div>
          <RerouteBoard {...c.routing.board} notice={c.notice.reroute} />
        </div>
      </Page>

      <Page {...folio("underwriting")} scene="underwriting" turn="Scroll on: the paper opens">
        <div className="pr-split">
          <div className="pr-split-l">
            <Headline title={u.title} deck={u.deck} />
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
          <div className="pr-uw-art">
            <Engraving src="/images/press/pen.jpg" className="pr-engraving--sm" />
            <Fig label="Figure 4" caption={u.figure}>
              <div className="pr-slices">
                <CrmSlice kind="underwriting" decorative />
                <CrmSlice kind="mids" decorative />
              </div>
            </Fig>
          </div>
        </div>
      </Page>
    </Edition>
  );
}

/* C: the centre spread, scrolled down: the portal on a laptop (Figure 1, pinned and toured), how routing
   is wired (Figure 2, HowFlow), and the providers (Figure 3) */
export function CentreSpread() {
  const fig2 = (
    <>
      <b>{c.figure2.label}.</b> {c.figure2.caption}
      <span className="pr-cap-credit">Illustrative</span>
    </>
  );
  return (
    <Spread {...folio("centre")}>
      <div className="lp-wrap pr-spread-head">
        <header className="pr-folio">
          <span>
            <b>C</b> Centre spread
          </span>
          <span className="pr-folio-r">Vertlo · Vol. 1 · No. 1</span>
        </header>
        <Headline title="The portal, opened up." deck={c.edition.centre} />
      </div>
      <section className="pr-figsec" aria-label="Figure 1: the Vertlo portal">
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
      <div className="lp-wrap pr-spread-part" id="how">
        <Headline title={c.how.title} deck={c.how.deck} />
        <HowFlow steps={c.how.steps} caption={fig2} />
        <p className="pr-cap pr-cap--m">{fig2}</p>
      </div>
      <div className="lp-wrap pr-spread-part">
        <Fig label={c.providers.label} caption={`${c.providers.title} ${c.providers.caption}`} credit="Diagram" className="pr-pf">
          <div className="lp-pf-d">
            <ProviderFlow />
          </div>
          <div className="lp-pf-m">
            <ProviderFlow layout="vertical" />
          </div>
        </Fig>
      </div>
    </Spread>
  );
}

/* B1–B5: the back section, turned sideways, ending on the coupon */
export function BackSection() {
  return (
    <Edition label="Back section, pages B1 to B5">
      <Page {...folio("markets")} scene="briefs" turn={c.edition.turn}>
        <div className="pr-split">
          <div className="pr-split-l">
            <Headline title={c.industries.title} deck="Supplements, subscriptions and digital goods, on the processors they already use." />
            <Engraving src="/images/press/shopfront.jpg" />
          </div>
          <IndustryCards items={c.industries.items} className="pr-briefs" />
        </div>
      </Page>

      <Page {...folio("numbers")} scene="numbers" turn={c.edition.turn}>
        <div className="pr-numbers">
          <Headline title={c.numbers.title} deck={c.numbers.deck} />
          <dl className="pr-figures">
            {c.numbers.figures.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>
                  <Count to={f.to} decimals={f.decimals} prefix={f.prefix} suffix={f.suffix} />
                  <small>{f.note}</small>
                </dd>
              </div>
            ))}
          </dl>
          <div className="pr-numbers-row">
            <DataTable {...c.table} />
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

      <Page {...folio("classifieds")} scene="classifieds">
        <div className="pr-classifieds" id="book">
          <Coupon label={c.cta.label} title={c.cta.title} blurb={c.cta.blurb} bring={c.cta.bring} terms={c.cta.terms} />
          <div className="pr-trust">
            <p className="pr-trust-h">
              <span>{c.trust.heading}</span>
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
          </div>
        </div>
      </Page>
    </Edition>
  );
}

export function SiteFooter() {
  return <Colophon nameplate={c.masthead.nameplate} tagline={c.footer.tagline} colophon={c.footer.colophon} columns={c.footer.columns} />;
}
