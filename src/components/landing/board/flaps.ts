/* The split-flap engine, no React. Split-flap units are real mechanics, not a text effect: each unit is
   a drum of characters, and every change turns one flap at a time (the top leaf falls, the next bottom
   leaf lands) until the new character shows. Timing is a fixed tick with a little per-unit play, no
   easing blur. Markup comes from <Units> (Signage.tsx); styles from app/board.css (.bd-u, .bd-face).
   Only the hero board and the day's clock turn; both stop offscreen and in background tabs. */

/** The characters on every unit's drum, in the order the flaps turn. */
const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:-%→";
/** Flaps a unit turns before it lands. A real unit runs the whole drum; this keeps a change under a second. */
const MAX_TURNS = 8;
/** The signage arrow. The board fonts' latin subset has no →, so a flap showing one draws this instead. */
export const ARROW_PATH = "M3 10.4h12.2l-4.5-4.5 2.2-2.2L21 12l-8.1 8.3-2.2-2.2 4.5-4.5H3z";
const ARROW_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ARROW_PATH}" fill="currentColor"/></svg>`;

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

export type FlipOpts = { delay?: number; stagger?: number; ms?: number; jitter?: number };

/** Drives every unit inside `root` that sits in a `[data-flap]` field, on its own clock. The clock only
    runs while the board is on (visible), so a paused board resumes exactly where it stopped. Tones are
    per character and land with it (`data-tone` on the unit). */
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
  snap(field: string, text: string, tones?: readonly string[]) {
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
  flip(field: string, text: string, tones?: readonly string[], { delay = 0, stagger = 30, ms = 80, jitter = 40 }: FlipOpts = {}) {
    this.fields.get(field)?.forEach((u, i) => {
      const ch = text[i] ?? " ";
      const tone = tones?.[i] ?? "";
      const path = turns(u.path.at(-1) ?? u.ch, ch);
      if (!path.length) {
        if (!u.path.length) this.tone(u, tone);
        return;
      }
      u.path = [...u.path, ...path];
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

/** Runs a board's Flaps only while it is on screen and the tab is visible, and marks the board
    `data-live` meanwhile (its CSS loops, blinking lamps and the crawl, key off that). Returns the cleanup. */
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
