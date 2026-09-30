"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Notification, type LinkItem } from "@/components/vertlo";

/* The paper's printed pieces: the front page's masthead and index, the running head that follows the
   open page, headlines, numbered figures and tables, Exhibit A, the Q&A column, the clip-out coupon and
   the colophon. The page-turning edition that holds them is Edition.tsx; the scroll scenes are
   scenes.ts. Styles in app/press.css (pr-*). Outside the scenes, motion is print-like: the strike inks
   across, figures ink in (InkIn below); with reduced motion everything is simply printed. */

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

type Folio = { id: string; no: string; section: string; line: string };

/** The front page's masthead: the edition line and dateline over the nameplate, closed by a double rule. */
export function FrontMast({ nameplate, edition, motto }: { nameplate: string; edition: string; motto: string }) {
  return (
    <header className="pr-mast">
      <div className="pr-mast-ears">
        <span>
          {edition} <span className="pr-mast-dot">·</span> {motto}
        </span>
        <Dateline />
      </div>
      <p className="pr-nameplate">{nameplate}</p>
    </header>
  );
}

/** The running head, fixed over every page: the nameplate, the open page's folio, the page strip (every
    page by number, the open one marked), the contents on smaller screens, and the call. It follows the
    `press:page` events the edition sends as pages open. */
export function RunningHead({ nameplate, pages }: { nameplate: string; pages: Folio[] }) {
  const [cur, setCur] = useState(pages[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onPage = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail.id;
      setCur((c) => pages.find((p) => p.id === id) ?? c);
    };
    window.addEventListener("press:page", onPage);
    return () => window.removeEventListener("press:page", onPage);
  }, [pages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="pr-run">
      <div className="lp-wrap pr-run-in">
        <a className="pr-run-name" href={`#${pages[0].id}`}>
          {nameplate}
        </a>
        <span className="pr-run-folio" aria-live="polite">
          <b>{cur.no}</b> {cur.section}
        </span>
        <nav className="pr-run-pages" aria-label="Pages">
          <ol>
            {pages.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} aria-current={p.id === cur.id ? "page" : undefined} title={`${p.no} · ${p.section}`}>
                  {p.no}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <span className="pr-run-end">
          <button type="button" className="pr-run-menu" aria-expanded={open} aria-controls="pr-run-list" onClick={() => setOpen((v) => !v)}>
            Contents
          </button>
          <BookCall size="sm" />
        </span>
      </div>
      <ol id="pr-run-list" className="pr-run-list" data-open={open || undefined}>
        {pages.map((p) => (
          <li key={p.id}>
            <a href={`#${p.id}`} onClick={() => setOpen(false)} tabIndex={open ? undefined : -1} aria-current={p.id === cur.id ? "page" : undefined}>
              <b>{p.no}</b>
              <span>{p.section}</span>
            </a>
          </li>
        ))}
      </ol>
    </header>
  );
}

/** The front page's index: what's inside, by page number. */
export function Inside({ pages }: { pages: Folio[] }) {
  return (
    <nav className="pr-inside" aria-label="Inside this edition">
      <p className="pr-label">Inside</p>
      <ol>
        {pages.map((p) => (
          <li key={p.id}>
            <a href={`#${p.id}`}>
              <b>{p.no}</b>
              <span>{p.section}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── section furniture ────────────────────────────── */

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
  sender: string;
  address: string;
  date: string;
  subject: string;
  body: string[];
  signoff: string;
  reroute: { from: string; time: string; message: string };
};

/** Exhibit A: the termination email laid on the page and struck through in red as it scrolls in, with the
    portal's reroute notification landing on top of it once the strike has crossed the letter. */
export function Notice({ label, caption, sender, address, date, subject, body, signoff, reroute }: NoticeProps) {
  return (
    <figure className="pr-notice">
      <div className="pr-exhibit">
        <article className="pr-mail" data-ink="strike" aria-label={`Email: ${subject}`}>
          <header className="pr-mail-top">
            <span className="pr-mail-av" aria-hidden="true">
              {sender.charAt(0)}
            </span>
            <span className="pr-mail-from">
              <b>{sender}</b>
              <span>{address}</span>
            </span>
            <time>{date}</time>
          </header>
          <p className="pr-mail-subject">
            <span className="pr-strike">{subject}</span>
          </p>
          <div className="pr-mail-body">
            {[...body, signoff].map((p, i) => (
              <p key={i}>
                <span
                  className="pr-strike pr-strike--thin"
                  style={{ "--d": `${0.55 + i * 0.25}s` } as React.CSSProperties}
                >
                  {p}
                </span>
              </p>
            ))}
          </div>
        </article>
        <div className="pr-slip" data-ink="slip">
          <Notification from={reroute.from} time={reroute.time} message={reroute.message} animate={false} />
        </div>
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
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
