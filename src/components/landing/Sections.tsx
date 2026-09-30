import type { CSSProperties, ReactNode } from "react";
import { Footer } from "@/components/vertlo";
import * as c from "@/content/landing";
import { MerchantStories } from "@/components/landing/MerchantStories";
import { PortalTour } from "@/components/landing/PortalTour";
import { Questions } from "@/components/landing/Questions";

/* Concept: The Route. The page is one line, and you follow one order down it from checkout to payout
   (content/landing.ts holds the order's story). There are no section bands: each section is a stop on
   the line, with its copy beside it. The sections here only lay out copy and place points for the line:
   `data-rt` names a point, `data-lane` says which lane it sits in (route.css turns lanes into
   positions: centre, right and left on desktop, the left edge on phones), and `data-at` marks
   anything that changes once the line has passed a point. Route.tsx measures the points, draws the line
   through them and moves the order. Every section is a server component. Layout and look are in
   app/route.css (rt-*). */

type Lane = "c" | "r" | "l" | "d" | "x" | "b";
type PointProps = { name: string; lane: Lane; via?: "vh"; y?: string };
const at = (y?: string) => (y ? ({ "--y": y } as CSSProperties) : undefined);

/** A point the line passes through, with nothing drawn on it. */
function Anchor({ name, lane, via, y }: PointProps) {
  return <i className="rt-anchor" data-rt={name} data-lane={lane} data-via={via} style={at(y)} />;
}

/** A point drawn on the line: a small diamond that fills when the line reaches it, and a label beside it.
    `off`/`to` colour it as an account (live, stopped) before and after. */
function Node({
  name, lane, via, y, on, off, to, side, time, label, children,
}: PointProps & { on?: string; off?: "live"; to?: "live" | "stop"; side?: "right"; time?: string; label?: string; children?: ReactNode }) {
  return (
    <span className="rt-node" data-rt={name} data-at={on ?? name} data-lane={lane} data-via={via} data-off={off} data-to={to} data-side={side} style={at(y)}>
      <i className="rt-node-dot" />
      {(time || label || children) && (
        <span className="rt-node-label">
          {time && <span className="rt-node-time">{time}</span>}
          {label && <span>{label}</span>}
          {children}
        </span>
      )}
    </span>
  );
}

/** Text that changes once the line has passed `point`. */
function Swap({ point, off, on }: { point: string; off: ReactNode; on: ReactNode }) {
  return (
    <span className="rt-swap" data-at={point}>
      <span>{off}</span>
      <span>{on}</span>
    </span>
  );
}

/** What the system printed: each line appears when the line reaches its point. */
function Log({ lines, className }: { lines: c.LogLine[]; className?: string }) {
  return (
    <ol className={`rt-log${className ? ` ${className}` : ""}`}>
      {lines.map((l, i) => (
        <li key={i} data-at={l.at}>
          <time>{l.time}</time>
          <span>{l.text}</span>
        </li>
      ))}
    </ol>
  );
}

function Tick() {
  return (
    <svg className="rt-tick" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.5l3 3 6-7" pathLength="1" />
    </svg>
  );
}

function Btn({ href, size, children }: { href: string; size?: "sm" | "lg"; children: ReactNode }) {
  return (
    <a className={`rt-btn${size ? ` rt-btn--${size}` : ""}`} href={href}>
      <span>{children}</span>
      <svg className="rt-btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </a>
  );
}

/* Stop 1, Checkout: the headline, and the order on the line beside it. The card itself is drawn by
   RouteLine (it is the thing that moves); this leaves room for it and says it aloud. */
export function Hero() {
  const o = c.order;
  return (
    <section className="rt-hero" id="top">
      <div className="rt-row">
        <div className="rt-hero-copy">
          <h1 className="rt-h1">
            <span className="rt-h1-dim">{c.hero.lead}</span> <span>{c.hero.accent}</span>
          </h1>
          <p className="rt-sub">{c.hero.subhead}</p>
          <div className="rt-actions">
            <Btn href="#book" size="lg">
              Book a call
            </Btn>
            <a className="rt-link" href="#how">
              See how it works
            </a>
          </div>
        </div>
        <div className="rt-slot rt-slot--start">
          <i className="rt-anchor rt-anchor--slot" data-rt="checkout" />
          <p className="sr-only">
            {o.label} order {o.id}: {o.amount}, {o.card}, {o.merchant}, created {o.stages[0].time}. This page follows it from
            checkout to payout.
          </p>
        </div>
      </div>
    </section>
  );
}

/* The view right after checkout: the order is in the portal. The line runs in behind the laptop and
   out underneath it; the order is out of sight while it is inside (data-in / data-out are this
   section's top and bottom padding, the distance from its edges to the device). */
export function Portal() {
  return (
    <div className="rt-zone" id="portal" data-rt-zone="" data-in="28" data-out="36">
      <section className="rt-portal">
        <div className="rt-portal-in">
          <PortalTour data={c.portal} clipH={760} clipHMobile={860} />
          <span className="lp-illus">Illustrative data</span>
        </div>
      </section>
    </div>
  );
}

/* Stop 2, Paused: the order is sent to US-01, and US-01 closes. Its node turns red and the line to it
   goes dotted; the log prints what happened. The fan below is the three accounts the router splits across. */
export function Paused() {
  const p = c.paused;
  const lanes: Record<string, Lane> = { us01: "c", us03: "d", uk02: "x" };
  return (
    <section className="rt-stop" id="paused">
      <div className="rt-row">
        <Node name="router" lane="c" y="var(--node-h2)" time={p.node.time} label={p.node.label} />
        <div className="rt-copy rt-copy--c">
          <h2 className="rt-h2">{p.title}</h2>
          <p className="rt-lede">{p.blurb}</p>
        </div>
        <Log lines={p.log} className="rt-log--side" />
      </div>
      <div className="rt-row rt-fan" role="img" aria-label={p.alt}>
        <Anchor name="pause" lane="c" y="8px" />
        <Anchor name="junction" lane="c" y="64px" />
        {p.accounts.map((a) => (
          <Node
            key={a.id}
            name={a.name}
            on={a.name === "us01" ? "pause" : undefined}
            lane={lanes[a.name]}
            y="170px"
            off="live"
            to={a.name === "us01" ? "stop" : "live"}
            side={a.name === "uk02" ? "right" : undefined}
          >
            <b>{a.id}</b>
            <Swap point={a.name === "us01" ? "pause" : "junction"} off={a.before} on={a.after} />
          </Node>
        ))}
        <Anchor name="rejoin" lane="r" via="vh" y="236px" />
      </div>
    </section>
  );
}

/* Stop 3, Rerouted: the line has bent round the paused account. How it works, in three lines. */
export function Rerouted() {
  const h = c.how;
  return (
    <section className="rt-stop rt-stop--tight" id="how">
      <div className="rt-row">
        <Node name="rerouted" lane="r" y="var(--node-h2)" time={h.node.time} label={h.node.label} />
        <div className="rt-copy">
          <h2 className="rt-h2">{h.title}</h2>
          <dl className="rt-steps">
            {h.steps.map((s) => (
              <div key={s.title}>
                <dt>{s.title}</dt>
                <dd>{s.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/** The record a check leaves; its last line is printed when the order passes the check. */
function Panel({ item, point }: { item: c.Check; point: string }) {
  return (
    <div className="rt-panel" data-art={item.art}>
      <p className="rt-panel-head">{item.head}</p>
      <ul>
        {item.rows.map((r) => (
          <li key={r.k + r.v} data-tone={r.tone} data-bar={r.bar !== undefined ? "" : undefined}>
            <span>{r.k}</span>
            {r.bar !== undefined && (
              <i className="rt-bar">
                <i style={{ width: `${r.bar}%` }} />
              </i>
            )}
            <span>{r.v}</span>
          </li>
        ))}
      </ul>
      <p className="rt-panel-result" data-at={point}>
        <Tick />
        <span>{item.result}</span>
      </p>
    </div>
  );
}

/* Stop 4, Approved: the order passes four checks on the line, then the providers feed in from the side. */
export function Approved() {
  const w = c.whatYouGet;
  return (
    <section className="rt-stop" id="approved">
      <div className="rt-row">
        <Node name="approved" lane="r" y="var(--node-h2)" time={w.node.time} label={w.node.label} />
        <div className="rt-copy">
          <h2 className="rt-h2">{w.title}</h2>
          <p className="rt-lede">{w.blurb}</p>
        </div>
      </div>
      <ol className="rt-checks">
        {w.items.map((it, i) => (
          <li key={it.art} className="rt-row rt-check">
            <Node name={`cp${i}`} lane="r" y="12px" time={it.node.time} label={it.node.label} />
            <div className="rt-check-copy">
              <h3 className="rt-h3">{it.title}</h3>
              <p>{it.body}</p>
            </div>
            <Panel item={it} point={`cp${i}`} />
          </li>
        ))}
      </ol>
      <div className="rt-row">
        <p className="rt-note rt-note--checks">{w.note}</p>
      </div>
      <div className="rt-row rt-feed">
        <Anchor name="feed" lane="r" />
        <h3 className="rt-h2 rt-feed-title">{c.providers.title}</h3>
        <ul className="rt-providers">
          {c.providers.items.map((name, i) => (
            <li key={name} data-at={`prov${i}`}>
              <i className="rt-anchor rt-anchor--in" data-rt={`prov${i}`} />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Stop 5, Underwritten: a branch leaves the line, US-04 is issued on it and goes live, and it joins again. */
export function Underwritten() {
  const f = c.forBrands;
  return (
    <section className="rt-stop" id="underwriting">
      <div className="rt-row">
        <Node name="uw" lane="r" y="var(--node-h2)" time={f.node.time} label={f.node.label} />
        <div className="rt-copy">
          <h2 className="rt-h2">{f.title}</h2>
          <p className="rt-lede">{f.description}</p>
          <ul className="rt-facts">
            {f.items.map((it) => (
              <li key={it.label}>
                <b>{it.label}</b>
                <span>{it.meta}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rt-row rt-branch">
        <Log lines={f.log} />
        <div className="rt-art" role="img" aria-label={f.alt}>
          <Node name="split" lane="r" y="var(--split-y)" time={f.split.time} label={f.split.label} />
          <Node name="us04" lane="b" y="var(--us04-y)" to="live" side="right">
            <b>{f.account.id}</b>
            <Swap point="us04" off={f.account.before} on={f.account.after} />
          </Node>
          <Anchor name="join" lane="r" y="var(--join-y)" />
        </div>
      </div>
    </section>
  );
}

/* Stop 6, Settled: the line sweeps across to the left edge and the order docks beside the payout it is in. */
export function Settled() {
  const s = c.settled;
  return (
    <section className="rt-stop" id="settled">
      <div className="rt-row rt-sweep">
        <Anchor name="home" lane="l" via="vh" />
        <div className="rt-slot rt-slot--dock" aria-hidden="true">
          <i className="rt-anchor rt-anchor--slot" data-rt="payout" />
        </div>
        <div className="rt-copy rt-copy--statement">
          <h2 className="rt-h2">{s.title}</h2>
          <p className="rt-lede">{s.blurb}</p>
          <div className="rt-statement" role="table" aria-label="Payout statement">
            {s.rows.map((r) => (
              <div key={r.what} role="row" data-at={r.after ? "payout" : undefined}>
                <span role="cell">{r.date}</span>
                <span role="cell">{r.what}</span>
                <span role="cell">{r.to}</span>
                <span role="cell">{r.amount}</span>
                <span role="cell">{r.after && <Swap point="payout" off={r.before} on={r.after} />}</span>
              </div>
            ))}
          </div>
          <p className="rt-note">{s.note}</p>
        </div>
      </div>
    </section>
  );
}

/* At the arrival: who it's for, as three stations on the line. */
export function Industries() {
  const n = c.industries;
  return (
    <section className="rt-stop" id="industries">
      <div className="rt-row">
        <div className="rt-copy rt-copy--l">
          <h2 className="rt-h2">{n.title}</h2>
        </div>
      </div>
      <ul className="rt-stations">
        {n.items.map((it, i) => (
          <li key={it.title} className="rt-row rt-station">
            <Node name={`ind${i}`} lane="l" y="50%" />
            <h3 className="rt-h3">{it.title}</h3>
            <p>{it.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Merchants' own accounts of it (placeholders until real quotes exist), and who else is on it. */
export function Stories() {
  return (
    <section className="rt-stop" id="reviews">
      <div className="rt-row">
        <div className="rt-copy rt-copy--l">
          <h2 className="rt-h2">{c.testimonials.title}</h2>
        </div>
        <div className="rt-wide rt-stories">
          <MerchantStories items={c.testimonials.items} />
        </div>
        <div className="rt-wide rt-trust">
          <h3>{c.trust.heading}</h3>
          <ul>
            {c.logos.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="rt-stop" id="faq">
      <div className="rt-row rt-faq">
        <div className="rt-faq-side">
          <h2 className="rt-h2">{c.faq.title}</h2>
          <p className="rt-lede">{c.faq.blurb}</p>
        </div>
        <Questions items={c.faq.items} />
      </div>
    </section>
  );
}

/* Where the line ends: it runs into the one button. */
export function Book() {
  const b = c.cta;
  return (
    <section className="rt-stop rt-book" id="book">
      <div className="rt-row">
        <div className="rt-copy rt-copy--l rt-copy--book">
          <h2 className="rt-h2 rt-h2--lg">{b.title}</h2>
          <p className="rt-lede">{b.blurb}</p>
          <div className="rt-actions">
            <span className="rt-terminus">
              <i className="rt-anchor rt-anchor--in" data-rt="end" data-via="vh" />
              <Btn href="#book" size="lg">
                Book a call
              </Btn>
            </span>
            <span className="rt-next">
              <i />
              <b>{b.next.id}</b>
              {b.next.label}
            </span>
          </div>
          <ul className="rt-points">
            {b.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <div className="rt-footer" id="company">
      <Footer tagline={c.footer.tagline} columns={c.footer.columns} wordmark={false} />
    </div>
  );
}
