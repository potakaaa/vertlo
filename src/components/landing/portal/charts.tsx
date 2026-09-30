/* The Overview's charts, as plain SVG at fixed sizes (the whole page is scaled as one).
   Animated parts carry the classes PortalOverview's intro targets: lpo-draw (stroke draws in),
   lpo-pop, lpo-fill (meters), lpo-bar, lpo-note, lpo-arc (donut, data-len = its share). */

import type { PortalData } from "@/components/landing/portal/types";

export const G = "#16c45a", G2 = "#0e8c40", MINT = "#7cf0a8", RED = "#f87171", AMBER = "#f5b544";
/** Routing colours, in the order of data.routing */
export const ROUTE_COLORS = [G, G2, MINT];

/** Smooth path through points (horizontal-tangent cubic segments). */
function smoothPath(pts: [number, number][]) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], mx = (ax + bx) / 2;
    d += ` C${mx.toFixed(1)} ${ay.toFixed(1)} ${mx.toFixed(1)} ${by.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  return d;
}
function scale(vals: number[], w: number, h: number, pad = 2): [number, number][] {
  const lo = Math.min(...vals), hi = Math.max(...vals), span = hi - lo || 1;
  return vals.map((v, i) => [(i / (vals.length - 1)) * w, pad + (1 - (v - lo) / span) * (h - pad * 2)]);
}

/* ── KPI strip ── */
function Spark({ vals, color, fill }: { vals: number[]; color: string; fill?: boolean }) {
  const W = 150, H = 26, pts = scale(vals, W, H), d = smoothPath(pts), last = pts[pts.length - 1];
  return (
    <svg className="lpo-spark" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true">
      {fill ? <path className="lpo-spark-area" d={`${d} V${H} H0Z`} fill={color} opacity={0.12} /> : null}
      <path className="lpo-draw" d={d} fill="none" stroke={color} strokeWidth={1.5} pathLength={1} strokeLinecap="round" />
      <circle className="lpo-pop" cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  );
}
export function KpiViz({ k, data }: { k: PortalData["kpis"][number]; data: PortalData }) {
  if (k.viz === "volume") return <Spark vals={data.volume} color={G} fill />;
  if (k.viz === "approval") return <Spark vals={data.approval} color={AMBER} />;
  if (k.viz === "count") return <Spark vals={data.volume.map((v, i) => (v * data.approval[i]) / 100)} color={MINT} fill />;
  if ("limit" in k.viz)
    return (
      <div className="lpo-meter-wrap">
        <div className="lpo-meter"><b className="lpo-fill" style={{ width: `${(k.to / k.viz.limit) * 100}%` }} /><i style={{ left: "100%" }} /></div>
        <span>{k.viz.label}</span>
      </div>
    );
  const avail = k.to / (k.to + k.viz.payout);
  return (
    <div className="lpo-meter-wrap">
      <div className="lpo-meter lpo-meter--split"><b className="lpo-fill" style={{ width: `${avail * 100}%` }} /><b className="lpo-fill lpo-fill--pending" style={{ width: `${(1 - avail) * 100}%` }} /></div>
      <span>{k.viz.label}</span>
    </div>
  );
}

/* ── 30-day volume: approval-rate line on top, approved/declined bars below, notes across both ── */
export function VolumeChart({ data }: { data: PortalData }) {
  const W = 584, LINE_H = 44, GAP = 14, BAR_H = 100, H = LINE_H + GAP + BAR_H, n = data.volume.length;
  const slot = W / n, bw = Math.max(4, slot * 0.58), vmax = Math.max(...data.volume) * 1.08;
  const lo = 88.5, hi = 94.5;
  const ly = (a: number) => 4 + (1 - (a - lo) / (hi - lo)) * (LINE_H - 8);
  const pts = data.approval.map((a, i) => [i * slot + slot / 2, ly(a)] as [number, number]);
  return (
    <svg className="lpo-vol" viewBox={`0 0 ${W} ${H + 18}`} width={W} height={H + 18} aria-hidden="true">
      {/* approval strip */}
      <line x1={0} x2={W} y1={ly(93)} y2={ly(93)} className="lpo-grid" />
      <text className="lpo-ax lpo-ax--r" x={W} y={ly(93) - 4}>93%</text>
      <path className="lpo-draw" d={smoothPath(pts)} fill="none" stroke="#e8efe9" strokeWidth={1.6} pathLength={1} />
      {/* notes: a dashed marker through both strips and a numbered pin on the line; the text sits under the axis */}
      {data.notes.map((nt, i) => {
        const x = nt.day * slot + slot / 2, y = ly(data.approval[nt.day]), c = nt.tone === "warn" ? AMBER : G;
        return (
          <g key={nt.day} className="lpo-note">
            <line x1={x} x2={x} y1={y + 8} y2={H} stroke={c} strokeOpacity={0.55} strokeDasharray="2 3" />
            <circle cx={x} cy={y} r={7.5} fill={c} stroke="#0c110e" strokeWidth={2} />
            <text x={x} y={y + 3.5} textAnchor="middle" className="lpo-pin">{i + 1}</text>
          </g>
        );
      })}
      {/* bars */}
      {[0.5, 1].map((f) => <line key={f} x1={0} x2={W} y1={H - BAR_H * f} y2={H - BAR_H * f} className="lpo-grid" />)}
      {data.volume.map((v, i) => {
        const h = (v / vmax) * BAR_H, ok = h * (data.approval[i] / 100), x = i * slot + (slot - bw) / 2;
        return (
          <g key={i} className="lpo-bar">
            <rect x={x} y={H - ok} width={bw} height={ok} rx={1.5} fill={i === n - 1 ? G : "rgba(22,196,90,.55)"} />
            <rect x={x} y={H - h} width={bw} height={Math.max(1, h - ok - 1)} rx={1} fill={RED} fillOpacity={0.75} />
          </g>
        );
      })}
      <text className="lpo-ax" x={0} y={H + 14}>{data.period.from}</text>
      <text className="lpo-ax" x={W / 2} y={H + 14} textAnchor="middle">{data.period.mid}</text>
      <text className="lpo-ax lpo-ax--r" x={W} y={H + 14}>{data.period.to}</text>
    </svg>
  );
}

/* ── routing split by MID ── */
export function Donut({ rows }: { rows: PortalData["routing"] }) {
  let acc = 0;
  const live = rows.filter((r) => r.share > 0);
  return (
    <div className="lpo-donut">
      <svg viewBox="0 0 120 120" width={120} height={120} aria-hidden="true">
        <circle cx={60} cy={60} r={48} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={13} />
        {live.map((r, i) => {
          const seg = (
            <circle key={r.id} className="lpo-arc" cx={60} cy={60} r={48} fill="none" stroke={ROUTE_COLORS[i]} strokeWidth={13}
              pathLength={100} strokeDasharray={`${r.share - 1.2} 100`} strokeDashoffset={-acc} transform="rotate(-90 60 60)" data-len={r.share - 1.2} />
          );
          acc += r.share;
          return seg;
        })}
      </svg>
      <div className="lpo-donut-c"><b>{live.length} live</b><span>of {rows.length} MIDs</span></div>
    </div>
  );
}
