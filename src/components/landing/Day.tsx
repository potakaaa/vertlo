"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Icon } from "@/components/vertlo";
import { MQ, ScrollTrigger, gsap, prefersReducedMotion } from "@/lib/motion";
import { Flaps, whileVisible } from "@/components/landing/board/flaps";
import { Pictogram, Units, type PictoName, type Tone } from "@/components/landing/board/Signage";

/* One trading day, the moving parts: after the hero the page is a timeline of stops (08:58 before
   opening → 18:00 last call; the stops themselves are server markup in Sections.tsx). DayRoot owns
   the day's motion; the rail rides beside the stops like a small departures board, its split-flap
   clock turning to the time of the stop being read; two stops carry scroll-scrubbed scenes (09:52
   boarding, 10:07 dispute). Styles in app/board.css (bd-day, bd-rail, bd-lanes, bd-dsp). */

export type Lamp = Tone | "off";
export type DayStop = { id: string; time: string; label: string; lamps: Lamp[] };
export type DayData = { date: string; merchant: string; accounts: string[]; stops: DayStop[] };
export type Checkpoint = { label: string; date: string; icon: PictoName };

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/* ── the day ───────────────────────────────────────── */

/** The day's wrapper. Its motion is scoped to it: each stop's sign swings down on its top edge like a
    hinged sign, each headline lifts in, and the painted wall times drift slower than the page. */
export function DayRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const once = (trigger: Element, start: string) => ({ trigger, start, once: true, refreshPriority: -1 });
      gsap.utils.toArray<HTMLElement>(".bd-sign-plate").forEach((el) => {
        gsap.from(el, { rotateX: -96, transformOrigin: "50% 0%", duration: 0.8, ease: "back.out(2.2)", scrollTrigger: once(el, "top 90%") });
      });
      gsap.utils.toArray<HTMLElement>(".bd-stop-head").forEach((el) => {
        gsap.from(el.children, { y: 26, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: once(el, "top 88%") });
      });
      gsap.utils.toArray<HTMLElement>(".bd-stop-wall").forEach((el) => {
        gsap.fromTo(el, { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true, refreshPriority: -1 } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="bd-day">
      {children}
    </div>
  );
}

/* ── the rail ──────────────────────────────────────── */

/** Where the reading line sits (share of the viewport height): a stop is read once its top passes it. */
const READ_AT = 0.58;

export function DayRail({ date, merchant, accounts, stops }: DayData) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    const day = root?.closest(".bd-day");
    const list = day?.querySelector(".bd-stops");
    if (!root || !day || !list) return;
    const flaps = new Flaps(root);
    const reduce = prefersReducedMotion();
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".bd-rail-list li"));
    const now = root.querySelector<HTMLElement>(".bd-rail-now")!;
    const lamps = Array.from(root.querySelectorAll<HTMLElement>(".bd-rail-lamps .bd-lamp"));
    const els = stops.map((s) => day.querySelector<HTMLElement>(`[data-stop="${s.id}"]`));
    let cur = 0;

    const go = (i: number) => {
      if (i === cur) return;
      cur = i;
      const s = stops[i];
      if (reduce) flaps.snap("clock", s.time);
      else flaps.flip("clock", s.time, undefined, { stagger: 60, ms: 84, jitter: 16 });
      rows.forEach((r, k) => (r.dataset.state = k < i ? "past" : k === i ? "now" : "next"));
      now.textContent = s.label;
      lamps.forEach((l, k) => {
        l.dataset.tone = s.lamps[k];
        l.toggleAttribute("data-blink", s.lamps[k] === "new");
      });
    };
    /* the stop being read is the last one whose top has passed the reading line; read from live
       positions, so pinned stops (boarding, the portal) count while they are held */
    const read = () => {
      const line = window.innerHeight * READ_AT;
      go(els.reduce((i, el, k) => (el && el.getBoundingClientRect().top <= line ? k : i), 0));
    };
    const at = `${READ_AT * 100}%`;
    // refreshPriority -1: measured after the pins in the day (boarding, portal) have added their spacing
    const progress = ScrollTrigger.create({
      trigger: list,
      start: `top ${at}`,
      end: `bottom ${at}`,
      refreshPriority: -1,
      onUpdate: (self) => {
        root.style.setProperty("--day", self.progress.toFixed(4));
        read();
      },
      onRefresh: read,
    });
    const stop = whileVisible(root, flaps, 0);
    return () => {
      progress.kill();
      stop();
    };
  }, [stops]);

  return (
    <aside ref={ref} className="bd-rail" aria-label="Timetable for the day">
      <div className="bd-rail-in">
        <p className="bd-rail-top">
          <span>{date}</span>
          <span>{merchant}</span>
        </p>
        <div className="bd-rail-clock">
          <span className="bd-f" data-flap="clock" aria-hidden="true">
            <Units n={5} text={stops[0].time} />
          </span>
          <p className="bd-rail-now">{stops[0].label}</p>
        </div>
        <ol className="bd-rail-list">
          {stops.map((s, i) => (
            <li key={s.id} data-state={i ? "next" : "now"}>
              <a href={`#${s.id}`}>
                <time>{s.time}</time>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <ul className="bd-rail-lamps" aria-label="Accounts">
          {accounts.map((a, k) => (
            <li key={a}>
              <i className="bd-lamp" data-tone={stops[0].lamps[k]} />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/* ── scrubbed scenes ───────────────────────────────── */

type ScrubTrigger = Omit<ScrollTrigger.Vars, "trigger" | "scrub">;

/** Paints a scene at scroll progress 0 → 1 as it passes: `setup` finds the scene's parts and returns its
    painter; `trigger` places the scrub per width. Reduced motion paints the end state. The scenes'
    inputs are static content, so this sets up once. */
function useScrub<T extends HTMLElement>(setup: (root: T) => (p: number) => void, trigger: (desktop: boolean) => ScrubTrigger) {
  const ref = useRef<T>(null);
  const init = useRef({ setup, trigger });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const paint = init.current.setup(root);
    if (prefersReducedMotion()) {
      paint(1);
      return;
    }
    paint(0);
    const state = { p: 0 };
    const mm = gsap.matchMedia();
    mm.add({ desktop: MQ.desktop, phone: MQ.phone }, (ctx) => {
      const { desktop } = ctx.conditions as { desktop: boolean };
      gsap.fromTo(state, { p: 0 }, { p: 1, ease: "none", onUpdate: () => paint(state.p), scrollTrigger: { trigger: root, scrub: 0.6, ...init.current.trigger(desktop) } });
    });
    return () => mm.revert();
  }, []);

  return ref;
}

/* 09:52: a new account boards */

type BoardingProps = { account: string; processor: string; share: string; checkpoints: Checkpoint[]; boardingWord: string; onTimeWord: string; joinedLabel: string };

/** US-04 walks the underwriting checkpoints like a passenger (a pass token on a track, each checkpoint
    lighting with its date), then lands on the board as a new row: BOARDING, then ON TIME. Pinned on desktop. */
export function BoardingScene({ account, processor, share, checkpoints, boardingWord, onTimeWord, joinedLabel }: BoardingProps) {
  const ref = useScrub<HTMLDivElement>(
    (root) => {
      const cps = Array.from(root.querySelectorAll<HTMLElement>(".bd-cp"));
      const out = root.querySelector<HTMLElement>(".bd-lanes-out")!;
      const last = cps.length - 1;
      return (p) => {
        const t = seg(p, 0.04, 0.78);
        root.style.setProperty("--t", t.toFixed(4));
        cps.forEach((cp, i) => cp.toggleAttribute("data-on", t >= i / last - 0.001));
        out.dataset.state = p < 0.84 ? "wait" : p < 0.95 ? "boarding" : "on";
      };
    },
    (desktop) =>
      desktop
        ? // the stop is a flex column, where GSAP drops pin spacing by default: keep it, so the next stop waits
          { start: "center 55%", end: "+=1100", pin: true, pinSpacing: true }
        : { start: "top 72%", end: "bottom 40%" },
  );

  return (
    <div ref={ref} className="bd-lanes">
      <div className="bd-lanes-track">
        <span className="bd-lanes-line" aria-hidden="true">
          <i />
        </span>
        <ol className="bd-lanes-cps">
          {checkpoints.map((c) => (
            <li key={c.label} className="bd-cp">
              <span className="bd-cp-icon">
                <Pictogram name={c.icon} />
              </span>
              <b>{c.label}</b>
              <time>{c.date}</time>
            </li>
          ))}
        </ol>
        <span className="bd-token" aria-hidden="true">
          <i className="bd-lamp" />
          {account}
        </span>
      </div>
      <div className="bd-lanes-out" data-state="wait">
        <span className="bd-lanes-k">{joinedLabel}</span>
        <div className="bd-lanes-row">
          <i className="bd-lamp" />
          <b>{account}</b>
          <span>{processor}</span>
          <span className="bd-lanes-word">
            <span data-w="boarding">{boardingWord}</span>
            <span data-w="on">{onTimeWord}</span>
          </span>
          <span className="bd-lanes-share">{share}</span>
        </div>
      </div>
    </div>
  );
}

/* 10:07: a dispute caught */

type DisputeProps = {
  alert: { id: string; amount: string; card: string; time: string };
  steps: { time: string; label: string; struck?: string }[];
  ratio: { now: number; without: number; limit: number; label: string };
};

/** When each step of the line lights, as scroll progress. */
const DISPUTE_MARKS = [0.14, 0.46, 0.74];

/** The alert lands, the line runs from alert to refund to the chargeback date (which never comes), and
    the chargeback ratio settles where the refund leaves it instead of where the chargeback would have. */
export function DisputeScene({ alert, steps, ratio }: DisputeProps) {
  /** The meter reads 0 → 1.25× the limit, so the limit mark sits at 80%. */
  const pct = (v: number) => `${((v / (ratio.limit * 1.25)) * 100).toFixed(2)}%`;
  const ref = useScrub<HTMLDivElement>(
    (root) => {
      const marks = Array.from(root.querySelectorAll<HTMLElement>(".bd-dsp-line li"));
      const value = root.querySelector<HTMLElement>(".bd-dsp-value")!;
      return (p) => {
        // the ghost is the chargeback that would have landed; it drains once the refund is in
        const g = 1 - seg(p, 0.5, 0.9);
        root.style.setProperty("--a", seg(p, 0, 0.14).toFixed(4));
        root.style.setProperty("--t", seg(p, 0.14, 0.78).toFixed(4));
        root.style.setProperty("--g", g.toFixed(4));
        marks.forEach((m, i) => m.toggleAttribute("data-on", p >= DISPUTE_MARKS[i]));
        value.textContent = `${(ratio.now + (ratio.without - ratio.now) * g).toFixed(2)}%`;
      };
    },
    () => ({ start: "top 72%", end: "bottom 45%", refreshPriority: -1 }),
  );

  return (
    <div ref={ref} className="bd-dsp">
      <div className="bd-dsp-alert">
        <span className="bd-dsp-ico" aria-hidden="true">
          <Icon name="bell" size={18} strokeWidth={2} />
        </span>
        <div>
          <b>Dispute alert · {alert.id}</b>
          <span>
            {alert.amount} · {alert.card}
          </span>
        </div>
        <time>{alert.time}</time>
      </div>
      <div className="bd-dsp-line">
        <span className="bd-dsp-fill" aria-hidden="true" />
        <ol>
          {steps.map((s) => (
            <li key={s.label}>
              <time>{s.time}</time>
              <b>{s.label}</b>
              {s.struck && <em>{s.struck}</em>}
            </li>
          ))}
        </ol>
      </div>
      <div className="bd-dsp-meter" style={{ "--now": pct(ratio.now), "--without": pct(ratio.without - ratio.now), "--limit": pct(ratio.limit) } as CSSProperties}>
        <span className="bd-dsp-k">{ratio.label}</span>
        <span className="bd-dsp-bar" aria-hidden="true">
          <i className="bd-dsp-now" />
          <i className="bd-dsp-ghost" />
          <i className="bd-dsp-limit" />
        </span>
        <span className="bd-dsp-read">
          <b className="bd-dsp-value">{ratio.now.toFixed(2)}%</b>
          <span>limit {ratio.limit.toFixed(1)}%</span>
        </span>
      </div>
    </div>
  );
}
