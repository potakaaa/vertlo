import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
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
   anything that changes once the line has passed a point. Each stop leads with one drawing (Figure),
   patent-sheet style, so the page is looked at more than read. Route.tsx measures the points, draws the line
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
  name, lane, via, y, on, off, to, side, lead, time, label, children,
}: PointProps & { on?: string; off?: "live"; to?: "live" | "stop"; side?: "right"; lead?: boolean; time?: string; label?: string; children?: ReactNode }) {
  return (
    <span
      className="rt-node"
      data-rt={name}
      data-at={on ?? name}
      data-lane={lane}
      data-via={via}
      data-off={off}
      data-to={to}
      data-side={side}
      data-lead={lead || undefined}
      style={at(y)}
    >
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

/** A drawing on the route, patent-sheet style: forest ink on transparency with its figure number and one
    line underneath. The line draws it (RouteLine sets --draw as the head passes), and on wide screens a
    leader runs to it from the node named by `leader`. Loaded eagerly so a jump link never lands on a blank. */
function Figure({ fig, leader, className }: { fig: c.Fig; leader?: string; className?: string }) {
  return (
    <figure className={`rt-fig${className ? ` ${className}` : ""}`} data-leader={leader}>
      <Image src={fig.src} alt={fig.alt} width={880} height={880} unoptimized loading="eager" />
      {fig.caption && (
        <figcaption>
          <span>Fig. {fig.n}</span>
          {fig.caption}
        </figcaption>
      )}
    </figure>
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
   goes dotted. The drawing of the locked terminal sits left of the fan of accounts the router splits across. */
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
      </div>
      <div className="rt-row rt-fan">
        <Figure fig={p.fig} className="rt-fig--fan" />
        <div className="rt-fan-map" role="img" aria-label={p.alt}>
          <Anchor name="pause" lane="c" y="calc(var(--f0) + 8px)" />
          <Anchor name="junction" lane="c" y="calc(var(--f0) + 64px)" />
          {p.accounts.map((a) => (
            <Node
              key={a.id}
              name={a.name}
              on={a.name === "us01" ? "pause" : undefined}
              lane={lanes[a.name]}
              y="calc(var(--f0) + 170px)"
              off="live"
              to={a.name === "us01" ? "stop" : "live"}
              side={a.name === "uk02" ? "right" : undefined}
            >
              <b>{a.id}</b>
              <Swap point={a.name === "us01" ? "pause" : "junction"} off={a.before} on={a.after} />
            </Node>
          ))}
          <Anchor name="rejoin" lane="r" via="vh" y="calc(var(--f0) + 236px)" />
        </div>
      </div>
    </section>
  );
}

/* Stop 3, Rerouted: the line has bent round the paused account. The switch, and how it works in three lines. */
export function Rerouted() {
  const h = c.how;
  return (
    <section className="rt-stop rt-stop--tight" id="how">
      <div className="rt-row rt-pair">
        <Node name="rerouted" lane="r" y="var(--lead-y)" lead time={h.node.time} label={h.node.label} />
        <Figure fig={h.fig} leader="rerouted" className="rt-fig--lead" />
        <div className="rt-copy rt-copy--beside">
          <h2 className="rt-h2">{h.title}</h2>
          <ol className="rt-steps">
            {h.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* Stop 4, Approved: the order passes four checks on the line, each a drawing, a title and what it printed.
   Then the providers feed in from the side. */
export function Approved() {
  const w = c.whatYouGet;
  return (
    <section className="rt-stop" id="approved">
      <div className="rt-row">
        <Node name="approved" lane="r" y="var(--node-h2)" time={w.node.time} label={w.node.label} />
        <div className="rt-copy rt-copy--wide">
          <h2 className="rt-h2">{w.title}</h2>
          <p className="rt-lede">{w.blurb}</p>
        </div>
      </div>
      <ol className="rt-checks">
        {w.items.map((it, i) => (
          <li key={it.key} className="rt-row rt-check">
            <Node name={`cp${i}`} lane="r" y="var(--lead-y)" lead time={it.node.time} label={it.node.label} />
            <Figure fig={it.fig} leader={`cp${i}`} className="rt-fig--check" />
            <div className="rt-check-copy">
              <h3 className="rt-h3">{it.title}</h3>
              <p>{it.body}</p>
              <p className="rt-result" data-at={`cp${i}`}>
                <Tick />
                <span>{it.result}</span>
              </p>
            </div>
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
              {name}
              <i className="rt-anchor rt-anchor--in" data-rt={`prov${i}`} />
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
        <div className="rt-copy rt-copy--wide">
          <h2 className="rt-h2">{f.title}</h2>
          <p className="rt-lede">{f.description}</p>
        </div>
      </div>
      <div className="rt-row rt-branch">
        <Figure fig={f.fig} leader="us04" className="rt-fig--branch" />
        <div className="rt-art" role="img" aria-label={f.alt}>
          <Node name="split" lane="r" y="var(--split-y)" side="right" time={f.split.time} label={f.split.label} />
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

/* Stop 6, Settled: the line sweeps across to the left edge, the order docks, and the payout amount is the stop. */
export function Settled() {
  const s = c.settled;
  const p = s.payout;
  return (
    <section className="rt-stop" id="settled">
      <div className="rt-row rt-sweep">
        <Anchor name="home" lane="l" via="vh" />
        <div className="rt-slot rt-slot--dock" aria-hidden="true">
          <i className="rt-anchor rt-anchor--slot" data-rt="payout" />
        </div>
        <div className="rt-copy rt-copy--payout">
          <h2 className="rt-h2">{s.title}</h2>
          <p className="rt-lede">{s.blurb}</p>
          <div className="rt-payout" data-at="payout">
            <span className="rt-payout-amount">{p.amount}</span>
            <span className="rt-payout-meta">
              <span>
                Payout {p.id} · {p.date} · <Swap point="payout" off={p.before} on={p.after} />
              </span>
              <span>{p.includes}</span>
            </span>
          </div>
          <p className="rt-note">{s.note}</p>
        </div>
        <Figure fig={s.fig} className="rt-fig--payout" />
      </div>
    </section>
  );
}

/* At the arrival: who it's for. Each industry is its own stop on the line, its drawing hung off the node. */
export function Industries() {
  const n = c.industries;
  return (
    <section className="rt-stop" id="industries">
      <div className="rt-row">
        <Node name="ind0" lane="l" y="var(--node-h2)" />
        <div className="rt-copy rt-copy--l">
          <h2 className="rt-h2">{n.title}</h2>
        </div>
      </div>
      <ul className="rt-kinds">
        {n.items.map((it, i) => (
          <li key={it.title} className="rt-row rt-kind">
            <Node name={`ind${i + 1}`} lane="l" y="var(--lead-y)" lead />
            <Figure fig={it.fig} leader={`ind${i + 1}`} className="rt-fig--kind" />
            <div className="rt-kind-copy">
              <h3 className="rt-h3">{it.title}</h3>
              <p>{it.body}</p>
            </div>
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
