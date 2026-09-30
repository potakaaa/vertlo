import type { ReactNode } from "react";
import { ARROW_PATH } from "@/components/landing/board/flaps";

/* The static signage of the departures hall, all server-rendered: split-flap units (the engine in
   flaps.ts turns them on the client), the pictogram family, the stop signs and the status key.
   Styles in app/board.css (bd-*). */

/** Board colours for status: on time, watch, down, new. */
export type Tone = "ok" | "warn" | "bad" | "new";
/** A run of text on a board and the colour it lands in. */
export type BoardSeg = [text: string, tone: Tone];
export type KeyRow = { word: string; tone: Tone; state: string; example: string };

/** A field of `n` split-flap units, blank or already showing `text` (for units that never turn). */
export function Units({ n, text = "" }: { n: number; text?: string }) {
  return Array.from({ length: n }, (_, i) => {
    const ch = text[i] ?? "";
    return (
      <span key={i} className="bd-u">
        <span className="bd-face bd-face--t"><b>{ch}</b></span>
        <span className="bd-face bd-face--b"><b>{ch}</b></span>
        <span className="bd-face bd-face--t bd-leaf bd-leaf--fall"><b>{ch}</b></span>
        <span className="bd-face bd-face--b bd-leaf bd-leaf--land"><b>{ch}</b></span>
      </span>
    );
  });
}

/** The bold arrow from station signage. `dir` turns it: e (right), ne (departures). */
export function ArrowPicto({ dir = "e", className }: { dir?: "e" | "ne"; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" style={dir === "ne" ? { transform: "rotate(-45deg)" } : undefined}>
      <path d={ARROW_PATH} fill="currentColor" />
    </svg>
  );
}

/* One pictogram family for the whole hall: 24 grid, 2px stroke (it sits beside semibold caps). */
const PICTO = {
  // stop signs
  shutter: "M3 4.5h18v4H3zM5 8.5V20M19 8.5V20M5 12.5h14M5 16.25h14M5 20h14",
  desk: "M12 3.2a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2zM7 14.2c.7-2.5 2.6-4 5-4s4.3 1.5 5 4M3 14.2h18V20H3z",
  passport: "M6 3h12v18H6zM12 8.2a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zM9 17.6h6",
  bell: "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
  screen: "M3 4h18v12H3zM8.5 20h7M12 16v4",
  bag: "M4.5 8h15l-1.2 12.5H5.7zM9 8V6.5a3 3 0 0 1 6 0V8",
  log: "M5 3.5h12.5a1.5 1.5 0 0 1 1.5 1.5v15.5H6.5A1.5 1.5 0 0 1 5 19zM5 17.5h14M8.5 7.5h7M8.5 11h5",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 10.5v6.5M12 7v.4",
  ticket: "M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM15 7v2M15 11v2M15 15v2",
  // underwriting checkpoints
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 15.5h6M9 19h4",
  id: "M3 6h18v12H3zM7 10.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M5.5 15.5c.6-1.5 1.8-2.2 3.5-2.2s2.9.7 3.5 2.2M14 10h4.5M14 13.5h3",
  scan: "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M10.5 7a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7M13 13l3.5 3.5",
  check: "M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18M7.5 12.2l3 3 6-6.2",
} as const;
export type PictoName = keyof typeof PICTO;

export function Pictogram({ name, className }: { name: PictoName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={PICTO[name]} />
    </svg>
  );
}

/** A stop's sign, read like station signage: its time, a pictogram, what it's about and an arrow on,
    hung on a rule that runs to the edge, with the board's status word at the end of the rule. */
export function Sign({ time, picto, status, children }: { time: string; picto: PictoName; status?: BoardSeg; children: ReactNode }) {
  return (
    <p className="bd-sign">
      <span className="bd-sign-plate">
        <span className="bd-sign-gate">{time}</span>
        <Pictogram name={picto} className="bd-sign-picto" />
        <span className="bd-sign-label">{children}</span>
        <ArrowPicto className="bd-sign-arrow" />
      </span>
      <span className="bd-sign-rule" aria-hidden="true" />
      {status && (
        <span className="bd-sign-status" data-tone={status[1]}>
          {status[0]}
        </span>
      )}
    </p>
  );
}

const KEY_W = 8;

/** The board's words and what they mean in Vertlo, over the footer. Printed units that never turn. */
export function StatusKey({ title, caption, rows }: { title: string; caption: string; rows: KeyRow[] }) {
  return (
    <div className="bd-board bd-board--key">
      <div className="bd-board-top">
        <span className="bd-board-title">
          {title}
          <small>{caption}</small>
        </span>
      </div>
      <ul className="bd-key">
        {rows.map((row) => (
          <li key={row.word} className="bd-key-row">
            <i className="bd-lamp" data-tone={row.tone} />
            <span className="bd-f" data-tone={row.tone} aria-hidden="true">
              <Units n={KEY_W} text={row.word.toUpperCase()} />
            </span>
            <span className="sr-only">{row.word}: </span>
            <b className="bd-key-state">{row.state}</b>
            <span className="bd-key-ex">{row.example}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
