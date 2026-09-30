"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import type { MerchantQuote, MerchantStory } from "@/content/landing";

/* Merchant stories: one quote at a time beside a line chart that draws what happened to that merchant's
   payments. Tabs advance on their own: the progress fill is a CSS animation and its `animationend` moves
   to the next story, so pausing (hover, focus, offscreen, background tab, the Pause button) is just `animation-play-state`.
   Reduced motion: no auto-advance, charts appear drawn, text appears without the fade. */

const STORY_MS = 7000;

export function MerchantStories({ items }: { items: MerchantQuote[] }) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setAuto(!prefersReducedMotion());
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const go = (n: number) => setI((n + items.length) % items.length);
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    go(n);
    document.getElementById(`${id}-tab-${n}`)?.focus();
  };

  const t = items[i];
  const running = auto && inView && !held && !paused;

  return (
    <div
      ref={rootRef}
      className="lp-ms"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      // Keyboard focus holds the story; a mouse click on a tab should not freeze auto-advance.
      onFocus={(e) => e.target.matches(":focus-visible") && setHeld(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
    >
      <div className="lp-ms-stage" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${i}`}>
        <div className="lp-ms-chart">
          <StoryChart key={i} story={t.story} />
        </div>

        <figure key={i} className="lp-ms-quote">
          <p className="lp-ms-metric">
            <span className="lp-ms-value">{t.value}</span> {t.label}
          </p>
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            <span className="lp-ms-avatar" aria-hidden="true">
              {initials(t.name)}
            </span>
            <span>
              <b>{t.name}</b>
              <span>{t.business}</span>
            </span>
          </figcaption>
        </figure>
      </div>

      {auto ? (
        <button type="button" className="lp-ms-pause" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
          {paused ? "Play" : "Pause"}
        </button>
      ) : null}

      <div className="lp-ms-tabs" role="tablist" aria-label="Merchant stories" onKeyDown={onKey}>
        {items.map((it, k) => (
          <button
            key={k}
            id={`${id}-tab-${k}`}
            type="button"
            role="tab"
            aria-selected={k === i}
            aria-controls={`${id}-panel`}
            tabIndex={k === i ? 0 : -1}
            className="lp-ms-tab"
            onClick={() => go(k)}
          >
            <span className="lp-ms-track" aria-hidden="true">
              {k === i && auto && (
                <span
                  key={i}
                  className="lp-ms-fill"
                  style={{ animationDuration: `${STORY_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                  onAnimationEnd={() => go(i + 1)}
                />
              )}
            </span>
            <span className="lp-ms-tab-n">{String(k + 1).padStart(2, "0")}</span>
            <span className="lp-ms-tab-t">{it.business}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Monogram for the avatar: initials of the name, brackets ignored while it is still a placeholder. */
function initials(name: string) {
  return name
    .replace(/[[\]]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/* ── charts: illustrative series on a 10-step x axis ── */

/** `null` = the account did not exist yet, so its line starts later. */
type Series = { name: string; values: (number | null)[]; tone: "total" | "acct" | "down" | "up" };
type Chart = {
  title: string;
  step: "Day" | "Week";
  unit: string;
  max: number;
  ticks: number[];
  event: { at: number; label: string; tone: "down" | "up" };
  series: Series[];
};

const CHARTS: Record<MerchantStory, Chart> = {
  // One account closes; the other two take its volume and total orders never dip.
  closed: {
    title: "Orders per day",
    step: "Day",
    unit: "",
    max: 110,
    ticks: [0, 50, 100],
    event: { at: 5, label: "US-01 paused", tone: "down" },
    series: [
      { name: "Orders", tone: "total", values: [100, 101, 100, 102, 101, 100, 101, 102, 101, 102] },
      { name: "UK-02", tone: "acct", values: [30, 31, 30, 29, 31, 46, 50, 51, 50, 52] },
      { name: "US-03", tone: "acct", values: [30, 28, 30, 30, 30, 54, 51, 51, 51, 50] },
      { name: "US-01", tone: "down", values: [40, 42, 40, 43, 40, 0, 0, 0, 0, 0] },
    ],
  },
  // Every provider on one screen: the weekly hours spent on payment ops fall away.
  hours: {
    title: "Payment ops, hours per week",
    step: "Week",
    unit: " hrs",
    max: 26,
    ticks: [0, 10, 20],
    event: { at: 4, label: "Moved to one CRM", tone: "up" },
    series: [{ name: "Hours", tone: "total", values: [22, 21, 23, 20, 18, 11, 8, 7, 6, 6] }],
  },
  // A new MID is issued in-house and picks up a share of volume without touching the total.
  newMid: {
    title: "Orders per day",
    step: "Day",
    unit: "",
    max: 110,
    ticks: [0, 50, 100],
    event: { at: 5, label: "US-04 approved", tone: "up" },
    series: [
      { name: "Orders", tone: "total", values: [100, 101, 100, 102, 101, 101, 102, 101, 102, 103] },
      { name: "UK-02", tone: "acct", values: [34, 33, 35, 34, 34, 31, 28, 27, 27, 28] },
      { name: "US-03", tone: "acct", values: [33, 34, 32, 34, 33, 30, 27, 27, 28, 27] },
      { name: "US-04", tone: "up", values: [null, null, null, null, 0, 8, 16, 20, 20, 21] },
    ],
  },
};

const STEPS = 10;
const W = 400, H = 196, PAD_L = 4, PAD_R = 30, PAD_T = 24, PAD_B = 6;
const x = (k: number) => PAD_L + (k / (STEPS - 1)) * (W - PAD_L - PAD_R);

/** Reads like a slice of the product: window header, before/after chart you can scrub, legend with values. */
function StoryChart({ story }: { story: MerchantStory }) {
  const c = CHARTS[story];
  const [hover, setHover] = useState<number | null>(null);
  const y = (v: number) => PAD_T + (1 - v / c.max) * (H - PAD_T - PAD_B);
  const path = (vals: (number | null)[]) =>
    vals
      .map((v, k) => (v === null ? null : `${k && vals[k - 1] !== null ? "L" : "M"}${x(k).toFixed(1)} ${y(v).toFixed(1)}`))
      .filter(Boolean)
      .join(" ");
  const ex = x(c.event.at);
  const total = c.series[0];
  const last = STEPS - 1;
  const fmt = (v: number | null, s: Series) => (v === null ? "—" : `${v}${c.unit}${s.tone === "down" && v === 0 ? " · paused" : ""}`);

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * (W - PAD_L - PAD_R);
    setHover(Math.max(0, Math.min(last, Math.round((px / (W - PAD_L - PAD_R)) * last))));
  };
  const hx = hover === null ? 0 : x(hover);

  return (
    <div className="lp-ms-win">
      <div className="lp-ms-win-head">
        <span>{c.title}</span>
        <span className="lp-ms-win-meta">Last 10 {c.step.toLowerCase()}s</span>
      </div>

      <div className="lp-ms-plot">
        <svg className="lp-ms-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Illustrative chart: ${c.title.toLowerCase()}, ${c.event.label.toLowerCase()}`}>
          {/* after the event: a quiet tint, so before/after reads at a glance */}
          <rect className="lp-ms-after" x={ex} y={PAD_T - 16} width={x(last) - ex} height={H - PAD_T - PAD_B + 16} />
          {c.ticks.map((t) => (
            <g key={t} className="lp-ms-tick">
              <line x1={PAD_L} x2={x(last)} y1={y(t)} y2={y(t)} />
              <text x={W - 2} y={y(t) + 3} textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          <text className="lp-ms-phase" x={PAD_L} y={PAD_T - 8}>
            Before
          </text>
          <g className="lp-ms-event" data-tone={c.event.tone}>
            <line x1={ex} x2={ex} y1={PAD_T - 16} y2={H - PAD_B} />
            <text x={ex + 7} y={PAD_T - 8}>
              {c.event.label}
            </text>
          </g>
          {/* single-series charts get a flat fill so the line has weight */}
          {c.series.length === 1 && (
            <path className="lp-ms-area" d={`${path(total.values)} L${x(last)} ${y(0)} L${x(0)} ${y(0)} Z`} />
          )}
          {c.series.map((s, k) => (
            <path key={s.name} className="lp-ms-line" data-tone={s.tone} d={path(s.values)} pathLength={1} style={{ animationDelay: `${120 + k * 110}ms` }} />
          ))}
          <circle className="lp-ms-dot" cx={x(last)} cy={y(total.values[last] ?? 0)} r={3.5} />

          {hover !== null && (
            <g className="lp-ms-cross">
              <line x1={hx} x2={hx} y1={PAD_T - 16} y2={H - PAD_B} />
              {c.series.map((s) =>
                s.values[hover] === null ? null : (
                  <circle key={s.name} data-tone={s.tone} cx={hx} cy={y(s.values[hover] as number)} r={3} />
                ),
              )}
            </g>
          )}
          <rect
            className="lp-ms-hit"
            x={PAD_L}
            y={0}
            width={W - PAD_L - PAD_R}
            height={H}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>

        {hover !== null && (
          <div
            className="lp-ms-tip"
            data-side={hover > 5 ? "left" : "right"}
            style={{ left: `${(hx / W) * 100}%` }}
            aria-hidden="true"
          >
            <b>
              {c.step} {hover + 1}
            </b>
            {c.series.map((s) => (
              <span key={s.name} data-tone={s.tone}>
                <i />
                {s.name}
                <em>{fmt(s.values[hover], s)}</em>
              </span>
            ))}
          </div>
        )}
      </div>

      <ul className="lp-ms-legend">
        {c.series.map((s) => (
          <li key={s.name} data-tone={s.tone}>
            <i aria-hidden="true" />
            {s.name}
            <em>{fmt(s.values[last], s)}</em>
          </li>
        ))}
        <li className="lp-ms-illus">Illustrative</li>
      </ul>
    </div>
  );
}
