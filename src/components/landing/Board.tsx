"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { Button, Diamond } from "@/components/vertlo";
import { prefersReducedMotion } from "@/lib/motion";

/* Departure-board pieces: the site reads like the control room of a station, where payments get
   rerouted the way flights do. A split-flap board in the hero, time signs over the day's stops,
   a boarding pass for the call and a small status key over the footer. The day's rail and scenes are
   in Day.tsx. Styles in app/board.css (bd-*).

   Split-flap units are real mechanics, not a text effect: each unit is a drum of characters, and every
   change turns one flap at a time (the top leaf falls, the next bottom leaf lands) until the new
   character shows. Timing is a fixed tick with a little per-unit play, no easing blur. Only the hero
   board and the day clock turn (the status key's units are printed); both stop offscreen and in
   background tabs, and reduced motion shows the final state without turning. */

export type Tone = "ok" | "warn" | "bad" | "new";
/** A run of text on the board and the colour it lands in. */
export type BoardSeg = [text: string, tone: Tone];
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
  columns: [account: string, processor: string, status: string, share: string, approval: string];
  illustrative: string;
  /** What the board shows, for screen readers (the flaps are hidden from them). */
  summary: string;
  frames: BoardFrame[];
};
export type KeyRow = { word: string; tone: Tone; state: string; example: string };
export type PassData = {
  label: string;
  no: string;
  passenger: string;
  from: string;
  to: string;
  flight: string;
  date: string;
  boarding: string;
  gate: string;
  seat: string;
  /** Printed under the barcode, and the pattern the barcode is drawn from. */
  code: string;
};

/* ── split-flap engine ─────────────────────────────── */

/** The characters on every unit's drum, in the order the flaps turn. */
const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:-%→";
/** Flaps a unit turns before it lands. A real unit runs the whole drum; this keeps a change under a second. */
const MAX_TURNS = 8;
/** The board fonts' latin subset has no →, so arrows are drawn as a pictogram. */
const ARROW_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.4h12.2l-4.5-4.5 2.2-2.2L21 12l-8.1 8.3-2.2-2.2 4.5-4.5H3z" fill="currentColor"/></svg>';

const slot = (ch: string) => Math.max(0, DRUM.indexOf(ch));
const paint = (el: Element, ch: string) => {
  if (ch === "→") el.innerHTML = ARROW_SVG;
  else el.textContent = ch;
};

/** The flaps a unit shows on its way from one character to another, ending on `to`. */
function turns(from: string, to: string) {
  const n = DRUM.length, b = slot(to);
  const k = Math.min((b - slot(from) + n) % n, MAX_TURNS);
  return Array.from({ length: k }, (_, i) => DRUM[(b - (k - 1 - i) + n) % n]);
}

type Unit = {
  el: HTMLElement;
  /** Faces: static top, static bottom, the falling top leaf, the landing bottom leaf. */
  top: Element;
  bot: Element;
  fall: Element;
  land: Element;
  fallLeaf: HTMLElement;
  landLeaf: HTMLElement;
  ch: string;
  path: string[];
  due: number;
  ms: number;
  tone: string;
  anims: Animation[];
};

function unitOf(el: HTMLElement): Unit {
  const [t, b, f, l] = Array.from(el.children) as HTMLElement[];
  return {
    el,
    top: t.firstElementChild!,
    bot: b.firstElementChild!,
    fall: f.firstElementChild!,
    land: l.firstElementChild!,
    fallLeaf: f,
    landLeaf: l,
    ch: t.textContent || " ",
    path: [],
    due: 0,
    ms: 80,
    tone: "",
    anims: [],
  };
}

type FlipOpts = { delay?: number; stagger?: number; ms?: number; jitter?: number };

/** Drives every unit inside `root` that sits in a `[data-flap]` field, on its own clock. The clock only
    runs while the board is on (visible), so a paused board resumes exactly where it stopped. */
export class Flaps {
  private fields = new Map<string, Unit[]>();
  private busy = new Set<Unit>();
  private events: { at: number; fn: () => void }[] = [];
  private now = 0;
  private last = 0;
  private raf = 0;
  private timer = 0;
  private idleSince = 0;
  private on = false;
  private inFrame = false;

  constructor(root: HTMLElement) {
    root.querySelectorAll<HTMLElement>("[data-flap]").forEach((f) => {
      this.fields.set(f.dataset.flap!, Array.from(f.children as HTMLCollectionOf<HTMLElement>, unitOf));
    });
  }

  /** Shows `text` at once. */
  snap(field: string, text: string, tones?: string[]) {
    this.fields.get(field)?.forEach((u, i) => {
      const ch = text[i] ?? " ";
      for (const a of u.anims) a.cancel();
      u.anims = [];
      u.path = [];
      this.busy.delete(u);
      if (u.ch !== ch) [u.top, u.bot, u.fall, u.land].forEach((f) => paint(f, ch));
      u.ch = ch;
      this.tone(u, tones?.[i] ?? "");
    });
  }

  /** Turns the field's units to `text`, left to right, starting `delay` ms from now on the board clock. */
  flip(field: string, text: string, tones: string[] | undefined, { delay = 0, stagger = 30, ms = 80, jitter = 40 }: FlipOpts = {}) {
    this.fields.get(field)?.forEach((u, i) => {
      const ch = text[i] ?? " ";
      const tone = tones?.[i] ?? "";
      const path = turns(u.path.at(-1) ?? u.ch, ch);
      if (!path.length) {
        if (!u.path.length) this.tone(u, tone);
        return;
      }
      u.path = u.path.length ? [...u.path, ...path] : path;
      if (!this.busy.has(u)) {
        u.due = this.now + delay + i * stagger + Math.random() * jitter;
        delete u.el.dataset.tone; // flaps turn in the board's plain ink, then land in their colour
      }
      u.ms = ms;
      u.tone = tone;
      this.busy.add(u);
    });
    this.wake();
  }

  /** Runs `fn` `ms` from now on the board clock. */
  later(ms: number, fn: () => void) {
    this.events.push({ at: this.now + ms, fn });
    this.events.sort((a, b) => a.at - b.at);
    this.wake();
  }

  run(on: boolean) {
    if (on === this.on) return;
    this.on = on;
    if (on) this.wake();
    else this.sleep();
  }

  destroy() {
    this.sleep();
    this.events = [];
    for (const u of this.busy) for (const a of u.anims) a.cancel();
    this.busy.clear();
  }

  private tone(u: Unit, tone: string) {
    if (tone) u.el.dataset.tone = tone;
    else delete u.el.dataset.tone;
  }

  private sleep() {
    if (this.idleSince) this.now += performance.now() - this.idleSince;
    this.idleSince = 0;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.timer);
    this.raf = this.timer = 0;
  }

  private wake() {
    if (!this.on || this.raf || this.inFrame) return;
    clearTimeout(this.timer);
    this.timer = 0;
    if (this.idleSince) this.now += performance.now() - this.idleSince;
    this.idleSince = 0;
    const next = this.events[0];
    if (this.busy.size || (next && next.at <= this.now)) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else if (next) {
      // nothing turning: sleep until the next event instead of spinning frames
      this.idleSince = performance.now();
      this.timer = window.setTimeout(() => {
        this.timer = 0;
        this.wake();
      }, next.at - this.now);
    }
  }

  private frame = (ts: number) => {
    this.raf = 0;
    this.inFrame = true;
    // a long frame (or a slow device) holds the clock back rather than skipping flaps
    this.now += Math.min(Math.max(0, ts - this.last), 64);
    this.last = ts;
    while (this.events.length && this.events[0].at <= this.now) this.events.shift()!.fn();
    for (const u of this.busy) this.step(u);
    this.inFrame = false;
    if (this.busy.size) this.raf = requestAnimationFrame(this.frame);
    else this.wake();
  };

  /** One flap: the top leaf (current character) falls, the bottom leaf (next character) lands. */
  private step(u: Unit) {
    if (this.now < u.due) return;
    const next = u.path.shift();
    for (const a of u.anims) a.cancel();
    u.anims = [];
    if (next === undefined) {
      paint(u.bot, u.ch);
      this.tone(u, u.tone);
      this.busy.delete(u);
      return;
    }
    paint(u.top, next);
    paint(u.bot, u.ch);
    paint(u.fall, u.ch);
    paint(u.land, next);
    const half = u.ms / 2;
    u.anims = [
      u.fallLeaf.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }], {
        duration: half,
        easing: "cubic-bezier(.55,0,1,.45)",
        fill: "forwards",
      }),
      u.landLeaf.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }], {
        duration: half,
        delay: half,
        easing: "cubic-bezier(0,.55,.45,1)",
        fill: "both",
      }),
    ];
    u.ch = next;
    u.due += u.ms;
  }
}

/** Runs a board's Flaps only while it is on screen and the tab is visible. Returns the cleanup. */
export function whileVisible(root: HTMLElement, flaps: Flaps, threshold = 0.15) {
  let seen = false;
  const sync = () => flaps.run(seen && document.visibilityState === "visible");
  const io = new IntersectionObserver(
    ([e]) => {
      seen = e.isIntersecting;
      root.toggleAttribute("data-live", seen);
      sync();
    },
    { threshold },
  );
  io.observe(root);
  document.addEventListener("visibilitychange", sync);
  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", sync);
    flaps.destroy();
  };
}

/** A field of `n` split-flap units, blank or already showing `text` (for units that never turn). */
export function Units({ n, text = "" }: { n: number; text?: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const ch = text[i] ?? "";
        return (
          <span key={i} className="bd-u">
            <span className="bd-face bd-face--t"><b>{ch}</b></span>
            <span className="bd-face bd-face--b"><b>{ch}</b></span>
            <span className="bd-face bd-face--t bd-leaf bd-leaf--fall"><b>{ch}</b></span>
            <span className="bd-face bd-face--b bd-leaf bd-leaf--land"><b>{ch}</b></span>
          </span>
        );
      })}
    </>
  );
}

/* ── the hero board ────────────────────────────────── */

const FIELDS = ["account", "processor", "status", "share", "approval"] as const;
type Field = (typeof FIELDS)[number];
/** Units per field; share and approval read right-aligned, like figures on a real board. */
const WIDTH: Record<Field, number> = { account: 5, processor: 6, status: 16, share: 3, approval: 5 };
const RIGHT: Partial<Record<Field, true>> = { share: true, approval: true };

const fit = (s: string, k: Field) => {
  const t = Array.from(s.toUpperCase()).slice(0, WIDTH[k]).join("");
  return RIGHT[k] ? t.padStart(WIDTH[k]) : t.padEnd(WIDTH[k]);
};

/** A row as [field, text, per-character tones]. */
function cellsOf(row: BoardRow): [Field, string, string[] | undefined][] {
  const status = row.status.map(([t]) => t).join("");
  const tones = row.status.flatMap(([t, tone]) => Array.from(t, () => tone as string));
  return [
    ["account", fit(row.account, "account"), undefined],
    ["processor", fit(row.processor, "processor"), undefined],
    ["status", fit(status, "status"), tones],
    ["share", fit(row.share, "share"), undefined],
    ["approval", fit(row.approval, "approval"), undefined],
  ];
}

/** The hero's split-flap board. It powers up blank, fills with every account on time, then plays the
    pause and the reroute (content: `board`), and after that only the approval figures tick. */
export function DepartureBoard({ data }: { data: BoardData }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const flaps = new Flaps(root);
    const note = root.querySelector<HTMLElement>(".bd-note-t");
    const lamps = Array.from(root.querySelectorAll<HTMLElement>(".bd-lamp"));
    const frames = data.frames;
    const final = frames[frames.length - 1];

    const lamp = (r: number, row: BoardRow) => {
      const l = lamps[r];
      if (!l) return;
      l.dataset.tone = row.lamp;
      l.toggleAttribute("data-blink", !!row.blink);
    };

    if (prefersReducedMotion()) {
      final.rows.forEach((row, r) => {
        for (const [k, text, tones] of cellsOf(row)) flaps.snap(`${r}.${k}`, text, tones);
        lamp(r, row);
      });
      if (note) note.textContent = final.note;
      return () => flaps.destroy();
    }

    /* the story, on the board's clock: power up, hold, pause, hold, reroute */
    const HOLD = [600, 3600, 3400];
    let t = 0;
    frames.forEach((frame, f) => {
      t += HOLD[f] ?? 2800;
      const first = f === 0;
      flaps.later(t, () => {
        frame.rows.forEach((row, r) => {
          const offset = first ? r * 170 : 0;
          let col = 0;
          for (const [k, text, tones] of cellsOf(row)) {
            // power-up sweeps left to right across the whole row; later frames turn only what changed, slower
            flaps.flip(`${r}.${k}`, text, tones, first ? { delay: offset + col * 24, stagger: 24, ms: 70 } : { stagger: 42, ms: 104, jitter: 30 });
            col += WIDTH[k] + 1;
          }
          flaps.later(offset + (first ? 900 : 500), () => lamp(r, row));
        });
        flaps.later(first ? 1400 : 900, () => {
          if (note) note.textContent = frame.note;
        });
      });
    });

    /* then the board stays live: an approval figure on one of the on-time accounts moves a tenth now and then */
    const live = final.rows
      .map((row, r) => ({ r, base: parseFloat(row.approval) }))
      .filter(({ r, base }) => final.rows[r].lamp === "ok" && !Number.isNaN(base));
    const tick = () => {
      const { r, base } = live[Math.floor(Math.random() * live.length)];
      const v = `${(base + (Math.floor(Math.random() * 5) - 2) / 10).toFixed(1)}%`;
      flaps.flip(`${r}.approval`, fit(v, "approval"), undefined, { stagger: 40, ms: 96 });
      flaps.later(2600 + Math.random() * 1800, tick);
    };
    if (live.length) flaps.later(t + 4200, tick);

    return whileVisible(root, flaps);
  }, [data]);

  const [cAccount, cProcessor, cStatus, cShare, cApproval] = data.columns;
  const heads: Record<Field, string> = { account: cAccount, processor: cProcessor, status: cStatus, share: cShare, approval: cApproval };

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
          {FIELDS.map((k) => (
            <span key={k} className={`bd-col bd-f--${k}`}>
              {heads[k]}
            </span>
          ))}
        </div>
        {data.frames[0].rows.map((_, r) => (
          <div key={r} className="bd-row">
            <i className="bd-lamp" />
            {FIELDS.map((k) => (
              <span key={k} className={`bd-f bd-f--${k}`} data-flap={`${r}.${k}`}>
                <Units n={WIDTH[k]} />
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
    </figure>
  );
}

/* ── small board over the footer ───────────────────── */

const KEY_W = 8;

/** The board's words and what they mean in Vertlo. Printed units that never turn: the hero board and
    the day clock are the only ones that move. */
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

/* ── wayfinding ────────────────────────────────────── */

/** The bold arrow from station signage. `dir` turns it: e (right), ne (departures), s (down). */
export function ArrowPicto({ dir = "e", className }: { dir?: "e" | "ne" | "s"; className?: string }) {
  const rot = { e: 0, ne: -45, s: 90 }[dir];
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" style={rot ? { transform: `rotate(${rot}deg)` } : undefined}>
      <path d="M3 10.4h12.2l-4.5-4.5 2.2-2.2L21 12l-8.1 8.3-2.2-2.2 4.5-4.5H3z" fill="currentColor" />
    </svg>
  );
}

/** A stop's sign: its time on the board, an arrow and what it's about, hung on a rule that runs to the
    edge, with the board's status word at the end of the rule. */
export function Sign({ time, status, children }: { time: string; status?: BoardSeg; children: ReactNode }) {
  return (
    <p className="bd-sign">
      <span className="bd-sign-plate">
        <span className="bd-sign-gate">{time}</span>
        <ArrowPicto className="bd-sign-arrow" />
        <span className="bd-sign-label">{children}</span>
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

/* ── the boarding pass ─────────────────────────────── */

/** A barcode drawn from `code`: guard bars, then three bars and three spaces per character, widths from its code point. */
function Barcode({ code }: { code: string }) {
  const runs: number[] = [2, 1, 1, 1];
  for (const ch of code) {
    const c = ch.charCodeAt(0);
    runs.push(1 + (c % 3), 1 + ((c >> 2) % 2), 1 + ((c >> 3) % 3), 1 + ((c >> 1) % 2), 1 + ((c >> 4) % 3), 1 + ((c >> 5) % 2));
  }
  runs.push(2, 1, 1, 2);
  let x = 0;
  const bars: [number, number][] = [];
  runs.forEach((w, i) => {
    if (i % 2 === 0) bars.push([x, w]);
    x += w;
  });
  return (
    <svg className="bd-barcode" viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden="true">
      {bars.map(([bx, w]) => (
        <rect key={bx} x={bx} width={w} height={40} />
      ))}
    </svg>
  );
}

function PassField({ k, v, className }: { k: string; v: ReactNode; className?: string }) {
  return (
    <div className={className ? `bd-pf ${className}` : "bd-pf"}>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

/** The closing call as a boarding pass: the pass itself carries the pitch and the one CTA; the stub,
    past a perforated tear line, repeats the flight details over a barcode. */
export function BoardingPass({ pass, title, blurb, points }: { pass: PassData; title: ReactNode; blurb: string; points: string[] }) {
  return (
    <div className="bd-pass">
      <div className="bd-pass-main">
        <div className="bd-pass-strip">
          <span className="bd-pass-brand">
            <Diamond size={10} />
            Vertlo
          </span>
          <span className="bd-pass-label">{pass.label}</span>
          <span className="bd-pass-no">{pass.no}</span>
        </div>
        <div className="bd-pass-body">
          <div className="bd-pass-copy">
            <h2 className="lp-h2">{title}</h2>
            <p className="lp-blurb">{blurb}</p>
          </div>
          <dl className="bd-pass-route">
            <PassField k="From" v={pass.from} />
            <ArrowPicto className="bd-pass-arrow" />
            <PassField k="To" v={pass.to} />
          </dl>
          <dl className="bd-pass-fields">
            <PassField k="Passenger" v={pass.passenger} />
            <PassField k="Flight" v={pass.flight} />
            <PassField k="Date" v={pass.date} />
            <PassField k="Boarding" v={pass.boarding} />
            <PassField k="Gate" v={pass.gate} />
            <PassField k="Seat" v={pass.seat} />
          </dl>
          <div className="bd-pass-foot">
            <p className="bd-pass-incl">
              <span>Includes</span>
              {points.map((p, i) => (
                <Fragment key={p}>
                  {i > 0 && <i aria-hidden="true" />}
                  {p}
                </Fragment>
              ))}
            </p>
            <Button size="lg" href="#book">
              Book a call
            </Button>
          </div>
        </div>
      </div>
      <div className="bd-pass-stub" aria-hidden="true">
        <div className="bd-pass-strip">
          <span className="bd-pass-label">{pass.label}</span>
        </div>
        <dl className="bd-pass-stub-fields">
          <PassField k="Passenger" v={pass.passenger} className="bd-pf--wide" />
          <PassField k="Flight" v={pass.flight} />
          <PassField k="Boarding" v={pass.boarding} />
          <PassField k="Gate" v={pass.gate} className="bd-pf--big" />
          <PassField k="Seat" v={pass.seat} className="bd-pf--big" />
        </dl>
        <div className="bd-pass-code">
          <Barcode code={pass.code} />
          <span>{pass.code}</span>
        </div>
      </div>
    </div>
  );
}
