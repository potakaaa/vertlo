import type { ReactNode } from "react";
import { Button, Diamond, FAQ, Footer, IndustryCards, RotatingWord } from "@/components/vertlo";
import * as c from "@/content/landing";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { PortalTour } from "@/components/landing/PortalTour";
import { rich } from "@/components/landing/Rich";
import { BoardingPass, DepartureBoard, Sign, StatusKey } from "@/components/landing/Board";
import { BoardingScene, DayMotion, DayRail, DisputeScene, Perks, Stop } from "@/components/landing/Day";

/* One responsive page read as one trading day for one merchant. The hero's split-flap board plays the
   promise (an account pauses, its orders move); after it, the page is a timeline of stops from 08:58
   to 18:00 with a rail that keeps the time (Day.tsx). Each stop is a time sign, a headline with one
   line, and a picture that moves as you scroll: the pixel flow for the morning, the underwriting
   checkpoints, the dispute line, the portal on a laptop. The call is the last stop, a boarding pass.
   Accent words are set in the brand green (`*words*` in content, see Rich.tsx). Every section is a
   server component; the moving parts are client components. Layout classes are in app/landing.css
   (lp-*), the board look and the day in app/board.css (bd-*). */

const time = (id: string) => c.day.stops.find((s) => s.id === id)?.time ?? "";

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
              <Button variant="ghost" size="lg" href="#open" arrow={false}>
                Follow one day
              </Button>
            </div>
          </div>
        </div>
        <DepartureBoard data={c.board} />
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

/** A stop's headline with its one line beside it. */
function Head({ title, lede }: { title: ReactNode; lede?: string }) {
  return (
    <div className="lp-head lp-head--split bd-stop-head">
      <h2 className="lp-h2">{title}</h2>
      {lede && <p className="lp-lede">{lede}</p>}
    </div>
  );
}

/** The day: the rail beside every stop, 08:58 to the last call. */
export function Day() {
  return (
    <div className="bd-day">
      <div className="lp-wrap bd-day-in">
        <DayRail {...c.day} />
        <div className="bd-stops">
          <Stop id="open" dark>
            <Sign time={time("open")}>{c.problem.eyebrow}</Sign>
            <div className="lp-head lp-head--split bd-stop-head">
              <h2 className="lp-h2">
                Keep selling when your account{" "}
                <em className="bd-accent">
                  <RotatingWord words={c.problem.rotating} />
                </em>
              </h2>
              <p className="lp-lede">{c.problem.blurb}</p>
            </div>
            <IndustryCards tone="dark" items={c.problem.items} />
          </Stop>

          {/* 09:05 → 09:41 are the three steps of the flow; each step is a stop of its own */}
          <section className="bd-stop" id="how">
            <Sign time={time("checkin")} status={["On time", "ok"]}>
              {c.how.eyebrow}
            </Sign>
            <Head title={rich(c.how.title)} />
            <HowFlow steps={c.how.steps} />
          </section>

          <Stop id="boarding" dark>
            <Sign time={time("boarding")} status={["Boarding", "new"]}>
              {c.boarding.sign}
            </Sign>
            <Head title={rich(c.boarding.title)} lede={c.boarding.blurb} />
            <BoardingScene {...c.boarding} />
            <Perks items={c.boarding.items} />
          </Stop>

          <Stop id="dispute">
            <Sign time={time("dispute")} status={["Refunded", "ok"]}>
              {c.dispute.sign}
            </Sign>
            <Head title={rich(c.dispute.title)} lede={c.dispute.blurb} />
            <DisputeScene alert={c.dispute.alert} steps={c.dispute.steps} ratio={c.dispute.ratio} />
          </Stop>

          <Stop id="portal" className="bd-stop--portal">
            <div data-tour-copy>
              <Sign time={time("portal")}>{c.portalStop.sign}</Sign>
              <Head title={rich(c.portalStop.title)} lede={c.portalStop.blurb} />
            </div>
            <div className="lp-stage">
              <PortalTour data={c.portal} clipH={760} clipHMobile={860} />
              <span className="lp-illus">Illustrative data</span>
            </div>
          </Stop>

          <Stop id="industries">
            <Sign time={time("industries")}>{c.industries.eyebrow}</Sign>
            <Head title={rich(c.industries.title)} />
            <IndustryCards items={c.industries.items} />
          </Stop>

          <Stop id="reviews">
            <Sign time={time("reviews")}>{c.testimonials.eyebrow}</Sign>
            <Head title={rich(c.testimonials.title)} />
            <MerchantStories items={c.testimonials.items} />
          </Stop>

          <Stop id="desk">
            <Sign time={time("desk")}>{c.faq.eyebrow}</Sign>
            <FAQ title={rich(c.faq.title)} blurb={c.faq.blurb} items={c.faq.items} ctaHref="#book" />
          </Stop>

          <Stop id="book" className="bd-cta">
            <Sign time={time("book")} status={["Boarding", "new"]}>
              Book a call
            </Sign>
            <BoardingPass pass={c.cta.pass} title={rich(c.cta.title)} blurb={c.cta.blurb} points={c.cta.points} />
          </Stop>
        </div>
      </div>
      <DayMotion />
    </div>
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
