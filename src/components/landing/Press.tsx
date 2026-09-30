"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LinkItem } from "@/components/vertlo";

/* The broadsheet's pieces: the page is set as a trade paper for high-risk merchants, so it opens on a
   masthead, sections open on a flag and a rule, figures and tables carry numbered captions, and the
   closing call is a coupon. Copy stays short: headlines and one line; the figures carry the rest.
   Styles in app/press.css (pr-*). Motion is print-like and small: rules draw in, the strike-through
   inks across, figures ink in (InkIn below); with reduced motion everything is simply printed. */

/* ── masthead and running head ────────────────────── */

/** Today's date, set like a paper's dateline. Filled in on the reader's clock, so a static page never goes stale. */
export function Dateline({ className }: { className?: string }) {
  const [date, setDate] = useState<{ iso: string; text: string } | null>(null);
  useEffect(() => {
    const d = new Date();
    setDate({
      iso: d.toISOString().slice(0, 10),
      text: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    });
  }, []);
  return (
    <time className={className} dateTime={date?.iso}>
      {date?.text ?? " "}
    </time>
  );
}

/** The call to action, set as a plain printed button. The page has only this one. */
export function BookCall({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <a className={`pr-btn pr-btn--${size}${className ? ` ${className}` : ""}`} href="#book">
      Book a call
    </a>
  );
}

type MastheadProps = {
  nameplate: string;
  edition: string;
  motto: string;
  tagline: string;
  links: LinkItem[];
};

/** The front page's masthead: ears, the nameplate, the edition line with the dateline, the section index.
    Once it scrolls away a slim running head takes over at the top: nameplate, sections, the call. */
export function Masthead({ nameplate, edition, motto, tagline, links }: MastheadProps) {
  const indexRef = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = indexRef.current;
    if (!el) return;
    // The running head shows once the section index has scrolled above the top edge.
    const io = new IntersectionObserver(([e]) => setPinned(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!pinned) setOpen(false);
  }, [pinned]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="pr-mast" id="top">
        <div className="lp-wrap">
          <div className="pr-mast-ears">
            <span className="pr-mast-tag">{tagline}</span>
            <span className="pr-mast-acts">
              <a className="pr-mast-login" href="#book">
                Login
              </a>
              <BookCall size="sm" />
            </span>
          </div>
          <p className="pr-nameplate">
            <a href="#top" aria-label={`${nameplate} home`}>
              {nameplate}
            </a>
          </p>
          <div className="pr-mast-line">
            <span>
              {edition} <span className="pr-mast-dot">·</span> {motto}
            </span>
            <Dateline />
          </div>
          <nav className="pr-index" aria-label="Sections" ref={indexRef}>
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="pr-run" data-show={pinned || undefined} aria-hidden={!pinned}>
        <div className="lp-wrap pr-run-in">
          <a className="pr-run-name" href="#top" tabIndex={pinned ? undefined : -1}>
            {nameplate}
          </a>
          <ul className="pr-run-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} tabIndex={pinned ? undefined : -1}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <span className="pr-run-end">
            <button
              type="button"
              className="pr-run-menu"
              aria-expanded={open}
              aria-controls="pr-run-list"
              tabIndex={pinned ? undefined : -1}
              onClick={() => setOpen((v) => !v)}
            >
              Sections
            </button>
            <a className="pr-btn pr-btn--sm" href="#book" tabIndex={pinned ? undefined : -1}>
              Book a call
            </a>
          </span>
        </div>
        <ul id="pr-run-list" className="pr-run-list" data-open={open || undefined}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} tabIndex={open ? undefined : -1}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/** The market strip under the masthead: rows of the demo account's routing, like a prices table. */
export function Markets({
  label,
  note,
  rows,
}: {
  label: string;
  note: string;
  rows: { id: string; share: string; approval: string; move: "up" | "down" | "new" | "paused" }[];
}) {
  const mark = { up: "▲", down: "▼", new: "New", paused: "Paused" } as const;
  return (
    <aside className="lp-wrap pr-markets" aria-label={`${label}, ${note.toLowerCase()} data`}>
      <p className="pr-markets-h">
        {label} <span>{note}</span>
      </p>
      <ul>
        {rows.map((r) => (
          <li key={r.id} data-move={r.move}>
            <b>{r.id}</b>
            <span>{r.share} of volume</span>
            <span className="pr-markets-v">
              {r.move === "paused" ? null : r.approval}
              <i>{mark[r.move]}</i>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ── section furniture ────────────────────────────── */

/** A section's flag: its name on a heavy rule, as a paper marks its sections. The rule draws in. */
export function Flag({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="pr-flag">
      <span className="pr-flag-rule" data-ink="rule" aria-hidden="true" />
      <span className="pr-flag-label">{children}</span>
      {aside ? <span className="pr-flag-aside">{aside}</span> : null}
    </div>
  );
}

/** A story's headline block: kicker, headline, deck. `as` sets the heading level. */
export function Headline({
  kicker,
  title,
  deck,
  as: H = "h2",
  id,
}: {
  kicker?: string;
  title: string;
  deck?: string;
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <div className="pr-hl">
      {kicker ? <p className="pr-kicker">{kicker}</p> : null}
      <H className={H === "h1" ? "pr-h1" : "pr-h2"} id={id}>
        {title}
      </H>
      {deck ? <p className="pr-deck">{deck}</p> : null}
    </div>
  );
}

/** A numbered figure: the art, then "Figure n." and its caption, with the credit set small. The art inks in. */
export function Fig({
  label,
  caption,
  credit,
  id,
  className,
  children,
}: {
  label: string;
  caption: ReactNode;
  credit?: string;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className={`pr-fig${className ? ` ${className}` : ""}`} id={id}>
      <div className="pr-fig-art" data-ink="fig">
        {children}
      </div>
      <figcaption className="pr-cap">
        <b>{label}.</b> {caption}
        {credit ? <span className="pr-cap-credit">{credit}</span> : null}
      </figcaption>
    </figure>
  );
}

/* ── the lead story's exhibit ─────────────────────── */

type NoticeProps = {
  label: string;
  caption: string;
  from: string;
  date: string;
  subject: string;
  body: string[];
  reroute: { from: string; time: string; message: string };
};

/** Exhibit A: a termination email, struck through in red as it scrolls in, and Vertlo's reroute notice under it. */
export function Notice({ label, caption, from, date, subject, body, reroute }: NoticeProps) {
  return (
    <figure className="pr-notice">
      <p className="pr-notice-label">{label}</p>
      <div className="pr-mail" data-ink="strike">
        <dl className="pr-mail-head">
          <div>
            <dt>From</dt>
            <dd>{from}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{date}</dd>
          </div>
        </dl>
        <p className="pr-mail-subject">
          <span className="pr-strike">{subject}</span>
        </p>
        <div className="pr-mail-body">
          {body.map((p, i) => (
            <p key={i}>
              <span className="pr-strike pr-strike--thin" style={{ "--d": `${0.5 + i * 0.3}s` } as React.CSSProperties}>
                {p}
              </span>
            </p>
          ))}
        </div>
      </div>
      <div className="pr-reroute" data-ink="fig">
        <p className="pr-reroute-h">
          <span className="pr-signal" aria-hidden="true" />
          {reroute.from}
          <time>{reroute.time}</time>
        </p>
        <p className="pr-reroute-m">{reroute.message}</p>
      </div>
      <figcaption className="pr-cap">
        <b>{label}.</b> {caption}
      </figcaption>
    </figure>
  );
}

/* ── tables, Q&A, coupon ──────────────────────────── */

/** A numbered data table: label and title over the rules, figures in tabular numerals, a total row, a source note. */
export function DataTable({
  label,
  title,
  note,
  footnote,
  head,
  rows,
  foot,
}: {
  label: string;
  title: string;
  note: string;
  footnote?: string;
  head: string[];
  rows: string[][];
  foot?: string[];
}) {
  return (
    <figure className="pr-table" data-ink="fig">
      <figcaption className="pr-table-cap">
        <b>{label}.</b> {title}
      </figcaption>
      <div className="pr-table-scroll">
        <table>
          <thead>
            <tr>
              {head.map((h, i) => (
                <th key={i} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
          {foot ? (
            <tfoot>
              <tr>
                {foot.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i}>{cell}</td>
                  ),
                )}
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
      <p className="pr-table-note">
        {footnote ? <>¹ {footnote} </> : null}
        Source: {note}
      </p>
    </figure>
  );
}

/** A pull quote set beside a table: the same head and heavy rule as the table's caption, so the rules line up.
    A line lifted from the page's own copy, never a customer quote. */
export function PullQuote({ label, source, children }: { label: string; source: string; children: ReactNode }) {
  return (
    <figure className="pr-pull">
      <figcaption className="pr-table-cap">
        <b>{label}.</b> {source}
      </figcaption>
      <blockquote>{children}</blockquote>
    </figure>
  );
}

/** The FAQ set as an interview column: every question and answer printed, Q. and A. in the margin. */
export function QA({ items }: { items: { q: string; a: string }[] }) {
  return (
    <dl className="pr-qa">
      {items.map((it, i) => (
        <div key={i} className="pr-qa-item">
          <dt>
            <span className="pr-qa-k" aria-hidden="true">
              Q.
            </span>
            {it.q}
          </dt>
          <dd>
            <span className="pr-qa-k" aria-hidden="true">
              A.
            </span>
            {it.a}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** The closing call as a clip-out coupon: dashed cut line, scissors, what to bring, the one button. */
export function Coupon({
  label,
  title,
  blurb,
  bring,
  terms,
}: {
  label: string;
  title: string;
  blurb: string;
  bring: string[];
  terms: string;
}) {
  return (
    <div className="pr-coupon">
      <span className="pr-scissors" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
        </svg>
      </span>
      <div className="pr-coupon-in">
        <div className="pr-coupon-main">
          <p className="pr-kicker">{label}</p>
          <h2 className="pr-h2" id="book-t">
            {title}
          </h2>
          <p className="pr-deck">{blurb}</p>
        </div>
        <div className="pr-coupon-bring">
          <p className="pr-label">Bring to the call</p>
          <ul>
            {bring.map((b) => (
              <li key={b}>
                <span className="pr-box" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="pr-coupon-act">
          <BookCall size="lg" />
          <p className="pr-coupon-terms">{terms}</p>
        </div>
      </div>
    </div>
  );
}

/** The back page's colophon: nameplate, the paper's sections as links, the fine print. */
export function Colophon({
  nameplate,
  tagline,
  colophon,
  columns,
}: {
  nameplate: string;
  tagline: string;
  colophon: string;
  columns: { title: string; links: LinkItem[] }[];
}) {
  return (
    <footer className="lp-wrap pr-foot" id="company">
      <div className="pr-foot-top">
        <div className="pr-foot-brand">
          <a className="pr-foot-name" href="#top">
            {nameplate}
          </a>
          <p>{tagline}</p>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="pr-label">{c.title}</p>
            <ul>
              {c.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="pr-foot-legal">
        <span>© {new Date().getFullYear()} Vertlo</span>
        <span>{colophon}</span>
        <span className="pr-foot-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </span>
      </div>
    </footer>
  );
}

/* ── motion ───────────────────────────────────────── */

/** Inks each `[data-ink]` element once it scrolls into view (rules draw, strikes cross, figures ink in).
    The hidden starting states only apply under `html.pr-js` (set before paint in layout.tsx) and when
    motion is allowed, so without JS or with reduced motion the page is simply printed. */
export function InkIn() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-ink]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-inked", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
