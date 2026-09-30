"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/vertlo";
import { MQ, ScrollTrigger, gsap, prefersReducedMotion } from "@/lib/motion";
import { Flaps, Units, whileVisible, type Tone } from "@/components/landing/Board";

/* One trading day: after the hero the page is a timeline of stops (08:58 before opening → 18:00 last
   call). A rail rides beside the stops like a small departures board: its split-flap clock turns to the
   time of the stop being read, the timetable marks where you are (and links to every stop), a line fills
   as the day passes, and four lamps show the accounts' states at that time. Two stops carry their own
   scroll-driven scenes (09:52 boarding, 10:07 dispute); DayMotion hangs the signs and tears the pass.
   Styles in app/board.css (bd-day, bd-rail, bd-lanes, bd-dsp). */

export type Lamp = Tone | "off";
export type DayStop = { id: string; time: string; label: string; lamps: Lamp[] };
export type DayData = { date: string; merchant: string; accounts: string[]; stops: DayStop[] };
export type Checkpoint = { label: string; date: string; icon: "doc" | "id" | "scan" | "check" };

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/* ── the rail ──────────────────────────────────────── */

/** Where the reading line sits: stops change as their top passes it. */
const READ_AT = 0.58;
const READ = "top 58%";
const READ_END = "bottom 58%";

export function DayRail({ date, merchant, accounts, stops }: DayData) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const flaps = new Flaps(root);
    const reduce = prefersReducedMotion();
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".bd-rail-list li"));
    const now = root.querySelector<HTMLElement>(".bd-rail-now");
    const lamps = Array.from(root.querySelectorAll<HTMLElement>(".bd-rail-lamps .bd-lamp"));
    let cur = -1;

    const go = (i: number) => {
      if (i === cur) return;
      cur = i;
      const s = stops[i];
      if (reduce) flaps.snap("clock", s.time);
      else flaps.flip("clock", s.time, undefined, { stagger: 60, ms: 84, jitter: 16 });
      rows.forEach((r, k) => (r.dataset.state = k < i ? "past" : k === i ? "now" : "next"));
      if (now) now.textContent = s.label;
      lamps.forEach((l, k) => {
        l.dataset.tone = s.lamps[k];
        l.toggleAttribute("data-blink", s.lamps[k] === "new");
      });
    };
    go(0);

    /* The stop being read is the last one whose top has passed the reading line. Read from live
       positions on every scroll, so pinned stops (boarding, the portal) count while they're held. */
    const els = stops.map((s) => document.querySelector<HTMLElement>(`[data-stop="${s.id}"]`));
    const read = () => {
      const line = window.innerHeight * READ_AT;
      let i = 0;
      els.forEach((el, k) => {
        if (el && el.getBoundingClientRect().top <= line) i = k;
      });
      go(i);
    };
    // refreshPriority -1: measured after the pins above it (boarding, portal) have added their spacing
    const list = root.closest(".bd-day")?.querySelector(".bd-stops");
    const progress = list
      ? ScrollTrigger.create({
          trigger: list,
          start: READ,
          end: READ_END,
          refreshPriority: -1,
          onUpdate: (self) => {
            root.style.setProperty("--day", self.progress.toFixed(4));
            read();
          },
          onRefresh: read,
        })
      : null;
    const stop = whileVisible(root, flaps, 0);
    return () => {
      progress?.kill();
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

/** A stop on the day: its time sign, a headline with one line, then whatever carries it. */
export function Stop({ id, dark, className, children }: { id?: string; dark?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} data-stop={id} className={["bd-stop", dark && "vt-bleed bd-stop--dark", className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}

/* ── pictograms for the checkpoints ────────────────── */

const CP_ICON: Record<Checkpoint["icon"], ReactNode> = {
  doc: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 15.5h6M9 19h4" />,
  id: <path d="M3 6h18v12H3zM7 10.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M5.5 15.5c.6-1.5 1.8-2.2 3.5-2.2s2.9.7 3.5 2.2M14 10h4.5M14 13.5h3" />,
  scan: <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M10.5 7a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7M13 13l3.5 3.5" />,
  check: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18M7.5 12.2l3 3 6-6.2" />,
};

/* ── 09:52: a new account boards ───────────────────── */

type BoardingProps = { account: string; processor: string; share: string; checkpoints: Checkpoint[]; boardingWord: string; onTimeWord: string; joinedLabel: string };

/** US-04 walks the underwriting checkpoints like a passenger (a pass token on a track, each checkpoint
    lighting with its date), then lands on the board as a new row: BOARDING, then ON TIME. Scrubbed by
    scroll; pinned on desktop. */
export function BoardingScene({ account, processor, share, checkpoints, boardingWord, onTimeWord, joinedLabel }: BoardingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cps = Array.from(root.querySelectorAll<HTMLElement>(".bd-cp"));
    const out = root.querySelector<HTMLElement>(".bd-lanes-out");
    const n = cps.length - 1;
    const paint = (p: number) => {
      const t = seg(p, 0.04, 0.78);
      root.style.setProperty("--t", t.toFixed(4));
      cps.forEach((cp, i) => cp.toggleAttribute("data-on", t >= i / n - 0.001));
      out?.setAttribute("data-state", p < 0.84 ? "wait" : p < 0.95 ? "boarding" : "on");
    };
    if (prefersReducedMotion()) {
      paint(1);
      return;
    }
    const state = { p: 0 };
    paint(0);
    const mm = gsap.matchMedia();
    mm.add({ desktop: MQ.desktop, phone: MQ.phone }, (ctx) => {
      const { desktop } = ctx.conditions as { desktop: boolean };
      gsap.fromTo(
        state,
        { p: 0 },
        {
          p: 1,
          ease: "none",
          onUpdate: () => paint(state.p),
          scrollTrigger: desktop
            ? // the stop is a flex column, where GSAP drops pin spacing by default: keep it, so the next stop waits
              { trigger: root, start: "center 55%", end: "+=1100", pin: true, pinSpacing: true, scrub: 0.6 }
            : { trigger: root, start: "top 72%", end: "bottom 40%", scrub: 0.6 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="bd-lanes">
      <div className="bd-lanes-track">
        <span className="bd-lanes-line" aria-hidden="true">
          <i />
        </span>
        <ol className="bd-lanes-cps">
          {checkpoints.map((c) => (
            <li key={c.label} className="bd-cp">
              <span className="bd-cp-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">{CP_ICON[c.icon]}</svg>
              </span>
              <b>{c.label}</b>
              <time>{c.date}</time>
            </li>
          ))}
        </ol>
        <span className="bd-token" aria-hidden="true">
          <i className="bd-lamp" data-tone="new" />
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

/** Short list under a scene: an outline icon and a label per item. */
export function Perks({ items }: { items: { label: string; icon: IconName }[] }) {
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

/* ── 10:07: a dispute caught ───────────────────────── */

type DisputeProps = {
  alert: { id: string; amount: string; card: string; time: string };
  steps: { time: string; label: string; struck?: string }[];
  ratio: { now: number; without: number; limit: number; label: string };
};

/** The alert lands, the line runs from alert to refund to the chargeback date (which never comes), and
    the chargeback ratio settles where the refund leaves it instead of where the chargeback would have. */
export function DisputeScene({ alert, steps, ratio }: DisputeProps) {
  const ref = useRef<HTMLDivElement>(null);
  /** The meter reads 0 → 1.25× the limit, so the limit mark sits at 80%. */
  const scale = ratio.limit * 1.25;
  const pct = (v: number) => `${((v / scale) * 100).toFixed(2)}%`;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const marks = Array.from(root.querySelectorAll<HTMLElement>(".bd-dsp-line li"));
    const value = root.querySelector<HTMLElement>(".bd-dsp-value");
    const at = [0.14, 0.46, 0.74];
    const paint = (p: number) => {
      root.style.setProperty("--a", seg(p, 0, 0.14).toFixed(4));
      root.style.setProperty("--t", seg(p, 0.14, 0.78).toFixed(4));
      marks.forEach((m, i) => m.toggleAttribute("data-on", p >= at[i]));
      // the ghost is the chargeback that would have landed; it drains once the refund is in
      const g = 1 - seg(p, 0.5, 0.9);
      root.style.setProperty("--g", g.toFixed(4));
      if (value) value.textContent = `${(ratio.now + (ratio.without - ratio.now) * g).toFixed(2)}%`;
    };
    if (prefersReducedMotion()) {
      paint(1);
      return;
    }
    const state = { p: 0 };
    paint(0);
    const tw = gsap.fromTo(
      state,
      { p: 0 },
      { p: 1, ease: "none", onUpdate: () => paint(state.p), scrollTrigger: { trigger: root, start: "top 72%", end: "bottom 45%", scrub: 0.5, refreshPriority: -1 } },
    );
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, [ratio]);

  return (
    <div ref={ref} className="bd-dsp">
      <div className="bd-dsp-alert">
        <span className="bd-dsp-ico" aria-hidden="true">
          <Icon name="bell" size={18} />
        </span>
        <div>
          <b>Dispute alert · {alert.id}</b>
          <span>
            {alert.amount} · {alert.card}
          </span>
        </div>
        <time>{alert.time}</time>
      </div>
      <ol className="bd-dsp-line">
        <span className="bd-dsp-fill" aria-hidden="true" />
        {steps.map((s) => (
          <li key={s.label}>
            <time>{s.time}</time>
            <b>{s.label}</b>
            {s.struck && <em>{s.struck}</em>}
          </li>
        ))}
      </ol>
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

/* ── the day's motion ──────────────────────────────── */

/** Hangs each stop's sign (it swings down on its top edge like a hinged sign), lifts each headline in,
    and tears the boarding pass's stub a little as the day ends. Nothing moves with reduced motion. */
export function DayMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".bd-stop .bd-sign-plate").forEach((el) => {
        gsap.from(el, { rotateX: -96, transformOrigin: "50% 0%", duration: 0.8, ease: "back.out(2.2)", scrollTrigger: { trigger: el, start: "top 90%", once: true, refreshPriority: -1 } });
      });
      gsap.utils.toArray<HTMLElement>(".bd-stop .bd-stop-head").forEach((el) => {
        gsap.from(el.children, { y: 26, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true, refreshPriority: -1 } });
      });
      const stub = document.querySelector<HTMLElement>(".bd-pass-stub");
      if (stub) {
        mm.add({ desktop: MQ.desktop, phone: MQ.phone }, (c) => {
          const { desktop } = c.conditions as { desktop: boolean };
          gsap.fromTo(
            stub,
            { x: 0, y: 0, rotate: 0 },
            {
              ...(desktop ? { x: 16, rotate: 1.6 } : { y: 14, rotate: 1 }),
              transformOrigin: desktop ? "0% 100%" : "0% 0%",
              ease: "none",
              scrollTrigger: { trigger: stub, start: "top 85%", end: "center 45%", scrub: 0.6, refreshPriority: -1 },
            },
          );
        });
      }
    });
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);
  return null;
}
