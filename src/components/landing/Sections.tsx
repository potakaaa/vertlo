import type { ReactNode } from "react";
import { Button, Diamond, FAQ, Footer, Icon, IndustryCards, RotatingWord, type IconName } from "@/components/vertlo";
import * as c from "@/content/landing";
import { HowFlow } from "@/components/landing/HowFlow";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { PortalTour } from "@/components/landing/PortalTour";
import { rich } from "@/components/landing/Rich";
import { DepartureBoard } from "@/components/landing/board/DepartureBoard";
import { BoardingPass } from "@/components/landing/board/BoardingPass";
import { Sign, StatusKey, type BoardSeg, type PictoName } from "@/components/landing/board/Signage";
import { BoardingScene, DayRail, DayRoot, DisputeScene } from "@/components/landing/Day";

/* One responsive page read as one trading day for one merchant. The hero's split-flap board plays the
   promise (an account pauses, its orders move); after it, the page is a timeline of stops from 08:58
   to 18:00 with a rail that keeps the time (Day.tsx). Each stop is a time sign, a headline with one
   line, and a picture that moves as you scroll: the pixel flow for the morning, the underwriting
   checkpoints, the dispute line, the portal on a laptop. The call is the last stop, a boarding pass.
   Accent words are set in the brand green (`*words*` in content, see Rich.tsx). Every section is a
   server component; the moving parts are client components. Layout classes are in app/landing.css
   (lp-*), the board look and the day in app/board.css (bd-*). */

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

type StopSign = { label: ReactNode; picto: PictoName; status?: BoardSeg };

/** A stop on the day: its time on a sign and outlined large on the wall behind it (like the platform
    numbers in a station hall), then the stop's content. The anchor id is the stop's id, which the
    rail links to and reads. */
function Stop({ at, sign, dark, className, children }: { at: c.StopId; sign: StopSign; dark?: boolean; className?: string; children: ReactNode }) {
  const { time } = c.stops[at];
  return (
    <section id={at} data-stop={at} className={["bd-stop", dark && "vt-bleed bd-stop--dark", className].filter(Boolean).join(" ")}>
      <span className="bd-stop-wall" aria-hidden="true">
        {time}
      </span>
      <Sign time={time} picto={sign.picto} status={sign.status}>
        {sign.label}
      </Sign>
      {children}
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

/** Short list under a scene: an outline icon and a label per item. */
function Perks({ items }: { items: { label: string; icon: IconName }[] }) {
  return (
    <ul className="bd-perks">
      {items.map((it) => (
        <li key={it.label}>
          <span className="vt-pc-icon">
            <Icon name={it.icon} size={18} />
          </span>
          {it.label}
        </li>
      ))}
    </ul>
  );
}

/** The day: the rail beside every stop, 08:58 to the last call. */
export function Day() {
  return (
    <DayRoot>
      <div className="lp-wrap bd-day-in">
        <DayRail {...c.day} />
        <div className="bd-stops">
          <Stop at="open" sign={{ label: c.problem.eyebrow, picto: "shutter" }} dark>
            <Head
              title={
                <>
                  Keep selling when your account{" "}
                  <em className="bd-accent">
                    <RotatingWord words={c.problem.rotating} />
                  </em>
                </>
              }
              lede={c.problem.blurb}
            />
            <IndustryCards tone="dark" items={c.problem.items} />
          </Stop>

          {/* 09:05 → 09:41: the flow's three steps; routing and paused are stops of their own */}
          <Stop at="checkin" sign={{ label: c.how.eyebrow, picto: "desk", status: ["On time", "ok"] }}>
            <Head title={rich(c.how.title)} />
            <HowFlow steps={c.how.steps} />
          </Stop>

          <Stop at="boarding" sign={{ label: c.boarding.sign, picto: "passport", status: ["Boarding", "new"] }} dark>
            <Head title={rich(c.boarding.title)} lede={c.boarding.blurb} />
            <BoardingScene {...c.boarding} />
            <Perks items={c.boarding.items} />
          </Stop>

          <Stop at="dispute" sign={{ label: c.dispute.sign, picto: "bell", status: ["Refunded", "ok"] }}>
            <Head title={rich(c.dispute.title)} lede={c.dispute.blurb} />
            <DisputeScene alert={c.dispute.alert} steps={c.dispute.steps} ratio={c.dispute.ratio} />
          </Stop>

          <Stop at="portal" sign={{ label: c.portalStop.sign, picto: "screen" }} className="bd-stop--portal">
            {/* the tour lifts this away while it zooms into the laptop */}
            <div data-tour-copy>
              <Head title={rich(c.portalStop.title)} lede={c.portalStop.blurb} />
            </div>
            <div className="lp-stage">
              <PortalTour data={c.portal} clipH={760} clipHMobile={860} />
              <span className="lp-illus">Illustrative data</span>
            </div>
          </Stop>

          <Stop at="industries" sign={{ label: c.industries.eyebrow, picto: "bag" }}>
            <Head title={rich(c.industries.title)} />
            <IndustryCards items={c.industries.items} />
          </Stop>

          <Stop at="reviews" sign={{ label: c.testimonials.eyebrow, picto: "log" }}>
            <Head title={rich(c.testimonials.title)} />
            <MerchantStories items={c.testimonials.items} />
          </Stop>

          <Stop at="desk" sign={{ label: c.faq.eyebrow, picto: "info" }}>
            <FAQ title={rich(c.faq.title)} blurb={c.faq.blurb} items={c.faq.items} ctaHref="#book" />
          </Stop>

          <Stop at="book" sign={{ label: "Book a call", picto: "ticket", status: ["Boarding", "new"] }}>
            <BoardingPass pass={c.cta.pass} title={rich(c.cta.title)} blurb={c.cta.blurb} points={c.cta.points} />
          </Stop>
        </div>
      </div>
    </DayRoot>
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
