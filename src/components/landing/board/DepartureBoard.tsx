"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { Flaps, whileVisible, type FlipOpts } from "@/components/landing/board/flaps";
import { ArrowPicto, Units, type BoardSeg, type Tone } from "@/components/landing/board/Signage";

/* The hero's split-flap board: the merchant's accounts listed like departures. It powers up blank,
   fills with every account on time, then plays the pause and the reroute (content: `board`), after
   which only the approval figures tick; a crawl of the day's events runs along its foot. Reduced
   motion shows the final frame. Styles in app/board.css (bd-board, bd-row, bd-ticker). */

export type BoardRow = {
  account: string;
  processor: string;
  status: BoardSeg[];
  share: string;
  approval: string;
  /** The row's lamp: the account's own state. */
  lamp: Tone;
  blink?: boolean;
};
export type BoardFrame = { note: string; rows: BoardRow[] };
export type BoardData = {
  title: string;
  caption: string;
  merchant: string;
  clock: string;
  /** Column headings, in the order of the board's fields. */
  columns: [account: string, processor: string, status: string, share: string, approval: string];
  illustrative: string;
  /** What the board shows, for screen readers (the flaps are hidden from them). */
  summary: string;
  frames: BoardFrame[];
  /** The crawl along the board's foot: the rest of the day's events, each with its lamp. */
  ticker: { time: string; text: string; tone: Tone }[];
};

/** The board's fields: units per field, and which read right-aligned like figures on a real board. */
const FIELDS = [
  { key: "account", width: 5 },
  { key: "processor", width: 6 },
  { key: "status", width: 16 },
  { key: "share", width: 3, right: true },
  { key: "approval", width: 5, right: true },
] as const;
type Field = (typeof FIELDS)[number];
const APPROVAL = FIELDS[4];

const fit = (s: string, f: Field) => {
  const t = Array.from(s.toUpperCase()).slice(0, f.width).join("");
  return "right" in f ? t.padStart(f.width) : t.padEnd(f.width);
};

/** A row as what each field shows; the status carries a colour per character. */
function cellsOf(row: BoardRow) {
  return FIELDS.map((f) =>
    f.key === "status"
      ? { f, text: fit(row.status.map(([t]) => t).join(""), f), tones: row.status.flatMap(([t, tone]) => Array.from(t, () => tone)) }
      : { f, text: fit(row[f.key], f), tones: undefined },
  );
}

/** How long each frame holds before the next one turns: power up, then the pause, then the reroute. */
const HOLD = [600, 3600, 3400];

export function DepartureBoard({ data }: { data: BoardData }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const flaps = new Flaps(root);
    const note = root.querySelector<HTMLElement>(".bd-note-t");
    const lamps = Array.from(root.querySelectorAll<HTMLElement>(".bd-row .bd-lamp"));
    const final = data.frames[data.frames.length - 1];

    const lamp = (r: number, row: BoardRow) => {
      lamps[r].dataset.tone = row.lamp;
      lamps[r].toggleAttribute("data-blink", !!row.blink);
    };

    if (prefersReducedMotion()) {
      final.rows.forEach((row, r) => {
        for (const { f, text, tones } of cellsOf(row)) flaps.snap(`${r}.${f.key}`, text, tones);
        lamp(r, row);
      });
      if (note) note.textContent = final.note;
      return () => flaps.destroy();
    }

    let t = 0;
    data.frames.forEach((frame, i) => {
      t += HOLD[i];
      // the power-up sweeps left to right across whole rows; later frames turn only what changed, slower
      const first = i === 0;
      flaps.later(t, () => {
        frame.rows.forEach((row, r) => {
          const offset = first ? r * 170 : 0;
          let col = 0;
          for (const { f, text, tones } of cellsOf(row)) {
            const opts: FlipOpts = first ? { delay: offset + col * 24, stagger: 24, ms: 70 } : { stagger: 42, ms: 104, jitter: 30 };
            flaps.flip(`${r}.${f.key}`, text, tones, opts);
            col += f.width + 1;
          }
          flaps.later(offset + (first ? 900 : 500), () => lamp(r, row));
        });
        flaps.later(first ? 1400 : 900, () => {
          if (note) note.textContent = frame.note;
        });
      });
    });

    /* then the board stays live: an approval figure on one of the on-time accounts moves a tenth now and then */
    const live = final.rows.flatMap((row, r) => (row.lamp === "ok" ? [{ r, base: parseFloat(row.approval) }] : []));
    const tick = () => {
      const { r, base } = live[Math.floor(Math.random() * live.length)];
      flaps.flip(`${r}.approval`, fit(`${(base + (Math.floor(Math.random() * 5) - 2) / 10).toFixed(1)}%`, APPROVAL), undefined, { stagger: 40, ms: 96 });
      flaps.later(2600 + Math.random() * 1800, tick);
    };
    if (live.length) flaps.later(t + 4200, tick);

    return whileVisible(root, flaps);
  }, [data]);

  return (
    <figure ref={ref} className="bd-board bd-board--hero">
      <div className="bd-board-top" aria-hidden="true">
        <span className="bd-board-title">
          <span className="bd-picto">
            <ArrowPicto dir="ne" />
          </span>
          {data.title}
          <small>{data.caption}</small>
        </span>
        <span className="bd-board-meta">
          <span>{data.merchant}</span>
          <b>{data.clock}</b>
        </span>
      </div>
      <div className="bd-grid" aria-hidden="true">
        <div className="bd-row bd-row--head">
          {FIELDS.map((f, i) => (
            <span key={f.key} className={`bd-col bd-f--${f.key}`}>
              {data.columns[i]}
            </span>
          ))}
        </div>
        {data.frames[0].rows.map((_, r) => (
          <div key={r} className="bd-row">
            <i className="bd-lamp" />
            {FIELDS.map((f) => (
              <span key={f.key} className={`bd-f bd-f--${f.key}`} data-flap={`${r}.${f.key}`}>
                <Units n={f.width} />
              </span>
            ))}
          </div>
        ))}
      </div>
      <figcaption className="bd-note">
        <span className="bd-note-t" aria-hidden="true" />
        <span className="bd-illus">{data.illustrative}</span>
        <span className="sr-only">{data.summary}</span>
      </figcaption>
      {/* the crawl runs two copies end to end, so a -50% shift loops without a seam */}
      <div className="bd-ticker" aria-hidden="true">
        <div className="bd-ticker-run">
          {[0, 1].map((copy) => (
            <span key={copy} className="bd-ticker-set">
              {data.ticker.map((e) => (
                <span key={e.text} className="bd-ticker-item">
                  <i className="bd-lamp" data-tone={e.tone} />
                  <b>{e.time}</b>
                  {e.text}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
