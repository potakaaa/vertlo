"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/motion";
import { Diamond } from "@/components/vertlo";
import { PORTAL_W, PORTAL_H, type PortalData } from "@/components/landing/portal/types";
import { Donut, KpiViz, VolumeChart, G, RED, ROUTE_COLORS } from "@/components/landing/portal/charts";

/* The portal's Overview page, drawn at 1240 × 860 and scaled by its container. Read top to
   bottom it follows the money: what came in (KPIs, left → right: volume, approvals, count,
   risk, cash out), how it moved (30-day volume with the approval line, split by MID), and what
   to do about it (health against limits, attention list). Server-rendered at final values;
   on first view the charts draw in and the numbers count up, then the transaction count ticks
   like a live feed. Reduced motion: final state, no ticker. */

const AVG_TICKET = 120.4; // $ per successful transaction: $1.71M net / 14,208

const NAV: [string, [string, { on?: boolean; dim?: boolean; badge?: number }?][]][] = [
  ["Overview", [["Overview", { on: true }]]],
  ["Payments", [["Transactions"], ["Performance", { dim: true }], ["Routing"], ["Settlements"], ["Reserves", { dim: true }]]],
  ["Operations", [["Disputes", { badge: 2 }], ["Subscriptions"], ["Customers", { dim: true }], ["Checkout Builder", { dim: true }]]],
  ["Account", [["Reports", { dim: true }], ["Documents", { dim: true }], ["Settings", { dim: true }]]],
];

const fmt = (v: number, k: { prefix?: string; suffix?: string; decimals?: number }) =>
  (k.prefix ?? "") + v.toLocaleString("en-US", { minimumFractionDigits: k.decimals ?? 0, maximumFractionDigits: k.decimals ?? 0 }) + (k.suffix ?? "");

export function PortalOverview({ data }: { data: PortalData }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.motionOk, () => {
      const counters = [...root.querySelectorAll<HTMLElement>("[data-count]")];
      const finals = counters.map((el) => el.textContent ?? "");
      const q = <T extends Element>(s: string) => [...root.querySelectorAll<T>(s)];

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.fromTo(q(".lpo-kpi"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0);
      counters.forEach((el) => {
        const o = { v: 0 }, k = { prefix: el.dataset.prefix, suffix: el.dataset.suffix, decimals: Number(el.dataset.decimals || 0) };
        el.textContent = fmt(0, k);
        tl.to(o, { v: Number(el.dataset.count), duration: 1.6, ease: "power4.out", onUpdate: () => { el.textContent = fmt(o.v, k); } }, 0.15);
      });
      tl.fromTo(q(".lpo-draw"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.05 }, 0.3)
        .fromTo(q(".lpo-spark-area"), { opacity: 0 }, { opacity: 0.12, duration: 1 }, 0.9)
        .fromTo(q(".lpo-pop"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.05 }, 1.4)
        .fromTo(q(".lpo-fill"), { scaleX: 0, transformOrigin: "0 50%" }, { scaleX: 1, duration: 1.2, ease: "expo.out", stagger: 0.06 }, 0.5)
        .fromTo(q(".lpo-panel"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.35)
        .fromTo(q(".lpo-bar"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.9, ease: "expo.out", stagger: 0.022 }, 0.6)
        .fromTo(q(".lpo-note"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.25 }, 1.8)
        .fromTo(q(".lpo-notes-i"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.25 }, 1.9);
      q<SVGCircleElement>(".lpo-arc").forEach((arc, i) => {
        tl.fromTo(arc, { strokeDasharray: "0 100" }, { strokeDasharray: `${arc.dataset.len} 100`, duration: 1.1, ease: "power2.inOut" }, 0.8 + i * 0.25);
      });
      tl.fromTo(q(".lpo-route"), { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.08 }, 0.9)
        .fromTo(q(".lpo-attn-row"), { autoAlpha: 0, x: 14 }, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.1 }, 1.1);

      /* after the intro: successful transactions tick up like a live feed, the volume follows */
      const count = root.querySelector<HTMLElement>('[data-live="count"]'), gross = root.querySelector<HTMLElement>('[data-live="gross"]');
      let live = 0, n = Number(count?.dataset.count ?? 0), g = Number(gross?.dataset.count ?? 0);
      const tick = () => {
        live = window.setTimeout(tick, 1800 + Math.random() * 2200);
        if (!count || !gross || root.closest('[data-paused="true"]')) return;
        const add = 1 + Math.floor(Math.random() * 3);
        n += add; g += (add * AVG_TICKET) / 1e6;
        count.textContent = fmt(n, {});
        gross.textContent = fmt(g, { prefix: "$", suffix: "M", decimals: 2 });
        gsap.fromTo(count, { color: "#4ade80" }, { color: "#f2f6f3", duration: 1.2, ease: "power2.out" });
      };
      tl.eventCallback("onComplete", () => { live = window.setTimeout(tick, 1600); });

      ScrollTrigger.create({ trigger: root, start: "top 90%", once: true, onEnter: () => tl.play() });
      return () => {
        clearTimeout(live);
        counters.forEach((el, i) => { el.textContent = finals[i]; });
      };
    });
    return () => mm.revert();
  }, []);

  const volTotal = data.volume.reduce((a, b) => a + b, 0);

  return (
    <div ref={ref} className="vtp lpo" style={{ width: PORTAL_W, height: PORTAL_H }}>
      <aside className="vtp-side">
        <div className="vtp-brand"><Diamond size={9} glow /><b>Vertlo</b><span>Portal</span></div>
        {NAV.map(([group, items]) => (
          <div key={group} className="vtp-group">
            <div className="vtp-group-t">{group}</div>
            {items.map(([label, o]) => (
              <div key={label} className={`vtp-nav${o?.on ? " vtp-nav--on" : ""}${o?.dim ? " vtp-nav--dim" : ""}`}>
                {label}{o?.badge ? <span className="vtp-badge">{o.badge}</span> : null}
              </div>
            ))}
          </div>
        ))}
        <div className="vtp-side-foot">
          <div className="vtp-user"><span className="vtp-av">JR</span><div><div className="lpo-user-n">Jordan Reyes</div><div className="lpo-user-r">Owner</div></div></div>
        </div>
      </aside>

      <main className="vtp-main">
        <div className="vtp-top">
          <div><b>{data.merchant}</b><span>All brands</span></div>
          <div className="vtp-top-r"><span className="vtp-chip">Last 30 days</span><span className="vtp-chip">USD</span><span className="vtp-chip vtp-chip--w">Download statement</span></div>
        </div>

        <div className="lpo-body">
          <div className="vtp-h">Overview</div>

          <div className="lpo-kpis">
            {data.kpis.map((k, i) => (
              <div key={k.label} className="lpo-kpi">
                <div className="lpo-kpi-l">{k.label}</div>
                <div className="lpo-kpi-v">
                  <span data-count={k.to} data-prefix={k.prefix} data-suffix={k.suffix} data-decimals={k.decimals}
                    data-live={i === 0 ? "gross" : k.viz === "count" ? "count" : undefined}>{fmt(k.to, k)}</span>
                </div>
                <div className={`lpo-kpi-d lpo-${k.trend}`}>{k.delta}{k.trend !== "flat" ? <span> vs prior 30d</span> : null}</div>
                <KpiViz k={k} data={data} />
              </div>
            ))}
          </div>

          <div className="lpo-rowb">
            <section className="lpo-panel lpo-volume">
              <div className="lpo-panel-h">
                <div>Payment volume<small>${(volTotal / 1000).toFixed(2)}M processed · 92.6% approved</small></div>
                <div className="lpo-legend"><span><i style={{ background: G }} />Approved</span><span><i style={{ background: RED }} />Declined</span><span><i className="lpo-legend-line" />Approval rate</span></div>
              </div>
              <div className="lpo-vol-wrap">
                <VolumeChart data={data} />
              </div>
              <div className="lpo-notes">
                {data.notes.map((nt, i) => (
                  <span key={nt.day} className={`lpo-notes-i lpo-notes-i--${nt.tone}`}><b>{i + 1}</b>{nt.date} · {nt.label}</span>
                ))}
              </div>
            </section>

            <section className="lpo-panel lpo-routing">
              <div className="lpo-panel-h"><div>Routing split<small>By volume · failover on</small></div></div>
              <div className="lpo-routing-in">
                <Donut rows={data.routing} />
                <div className="lpo-routes">
                  {data.routing.map((r, i) => (
                    <div key={r.id} className={`lpo-route lpo-route--${r.state}`}>
                      <i style={{ background: r.state === "paused" ? RED : ROUTE_COLORS[i] }} />
                      <span className="lpo-mono">{r.id}</span>
                      <span className="lpo-route-s">{r.state === "paused" ? "Paused" : `${r.approval}% appr.`}</span>
                      <b>{r.state === "paused" ? "0%" : `${r.share}%`}</b>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lpo-route-foot"><i />US-01 paused Jul 10 · its traffic moved to US-03 and UK-02, approvals held</div>
            </section>
          </div>

          <div className="lpo-rowc">
            <section className="lpo-panel lpo-health">
              <div className="lpo-panel-h"><div>Payment health<small>Against your limits and targets</small></div><span className="vtp-healthy"><i />Healthy</span></div>
              {data.health.map((m) => (
                <div key={m.label} className="lpo-hrow">
                  <div className="lpo-hrow-t"><span>{m.label}</span><b>{m.value}<small> · {m.of}</small></b><em className={`lpo-${m.tone}`}>{m.status}</em></div>
                  <div className="lpo-meter"><b className={`lpo-fill lpo-fill--${m.tone}`} style={{ width: `${m.fill * 100}%` }} /></div>
                </div>
              ))}
              <div className="lpo-settle">
                <span>Pending <b>{data.settlement.pending}</b></span><i />
                <span>Available <b>{data.settlement.available}</b></span><i />
                <span className="lpo-ok">{data.settlement.next}</span>
              </div>
            </section>

            <section className="lpo-panel lpo-attn">
              <div className="lpo-panel-h"><div>Attention required<small>Sorted by what costs you first</small></div><span className="lpo-count">{data.attention.length} items</span></div>
              {data.attention.map((a) => (
                <div key={a.title} className="lpo-attn-row">
                  <span className={`vtp-dot vtp-dot--${a.tone}`} />
                  <div className="lpo-attn-x"><div className="vtp-attn-t">{a.title}</div><div className="vtp-attn-s">{a.meta}</div></div>
                  <span className={`vtp-mini${a.on ? " vtp-mini--on" : ""}`}>{a.action}</span>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
