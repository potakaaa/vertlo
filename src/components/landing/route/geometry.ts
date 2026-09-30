/* The route's geometry: a path through a list of points, made only of horizontal and vertical runs
   joined by quarter-circle corners (a route map, not a curve). Pure data, no DOM: Route.tsx measures
   the points and draws the result. Lengths are analytic, so a position on the line never needs
   the browser's getPointAtLength. The main line never travels upwards, which is what lets
   lenAtY map a scroll position to a place on it. */

export type Pt = { x: number; y: number; via?: string };

type Seg = {
  /** length along the path where this segment starts */
  at: number;
  len: number;
  x1: number; y1: number; x2: number; y2: number;
  /** a corner: centre, radius, and the unit directions in (u) and out (v) */
  arc?: { cx: number; cy: number; r: number; ux: number; uy: number; vx: number; vy: number };
};

export type Path = {
  d: string;
  len: number;
  segs: Seg[];
  /** length at which the path passes each input point (a rounded corner counts at its middle) */
  at: number[];
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const f = (n: number) => Math.round(n * 100) / 100;

/** A point that is off both axes from the one before it is reached by one corner: `via` says which
    way to leave, "hv" (across, then down: the default) or "vh" (down, then across). */
export function buildPath(pts: Pt[], radius = 14): Path {
  type V = { x: number; y: number; ids: number[] };
  const v: V[] = [];
  pts.forEach((p, i) => {
    const a = v[v.length - 1];
    if (!a) { v.push({ x: p.x, y: p.y, ids: [i] }); return; }
    const dx = Math.abs(p.x - a.x), dy = Math.abs(p.y - a.y);
    if (dx <= 0.5 && dy <= 0.5) { a.ids.push(i); return; }
    if (dx > 0.5 && dy > 0.5) v.push(p.via === "vh" ? { x: a.x, y: p.y, ids: [] } : { x: p.x, y: a.y, ids: [] });
    v.push({ x: dx <= 0.5 ? a.x : p.x, y: dy <= 0.5 ? a.y : p.y, ids: [i] });
  });

  const segs: Seg[] = [], at: number[] = [];
  if (!v.length) return { d: "", len: 0, segs, at };
  let cur = { x: v[0].x, y: v[0].y }, L = 0;
  let d = `M${f(cur.x)} ${f(cur.y)}`;
  v[0].ids.forEach((i) => { at[i] = 0; });

  for (let k = 1; k < v.length; k++) {
    const b = v[k], n = v[k + 1];
    const ux = Math.sign(b.x - cur.x), uy = Math.sign(b.y - cur.y);
    const dist = Math.abs(b.x - cur.x) + Math.abs(b.y - cur.y);
    let r = 0, vx = 0, vy = 0;
    if (n) {
      vx = Math.sign(n.x - b.x); vy = Math.sign(n.y - b.y);
      if (vx !== ux || vy !== uy) {
        /* half the next run, so its own corner fits, unless it is the last run and has none */
        const nl = Math.abs(n.x - b.x) + Math.abs(n.y - b.y);
        r = Math.min(radius, dist, v[k + 2] ? nl / 2 : nl);
      }
    }
    const ex = b.x - ux * r, ey = b.y - uy * r;
    const ll = Math.abs(ex - cur.x) + Math.abs(ey - cur.y);
    if (ll > 0) {
      segs.push({ at: L, len: ll, x1: cur.x, y1: cur.y, x2: ex, y2: ey });
      d += `L${f(ex)} ${f(ey)}`;
      L += ll;
    }
    if (r > 0) {
      const sx = b.x + vx * r, sy = b.y + vy * r, al = (r * Math.PI) / 2;
      d += `A${f(r)} ${f(r)} 0 0 ${ux * vy - uy * vx > 0 ? 1 : 0} ${f(sx)} ${f(sy)}`;
      segs.push({ at: L, len: al, x1: ex, y1: ey, x2: sx, y2: sy, arc: { cx: ex + vx * r, cy: ey + vy * r, r, ux, uy, vx, vy } });
      b.ids.forEach((i) => { at[i] = L + al / 2; });
      L += al;
      cur = { x: sx, y: sy };
    } else {
      b.ids.forEach((i) => { at[i] = L; });
      cur = { x: b.x, y: b.y };
    }
  }
  return { d, len: L, segs, at };
}

export function pointAt(p: Path, l: number): { x: number; y: number } {
  if (!p.segs.length) return { x: 0, y: 0 };
  l = clamp(l, 0, p.len);
  /* the segment holding l: the last one that starts at or before it */
  let lo = 0, hi = p.segs.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (p.segs[mid].at <= l) lo = mid; else hi = mid - 1;
  }
  const s = p.segs[lo], t = l - s.at;
  if (!s.arc) {
    const k = s.len ? t / s.len : 0;
    return { x: s.x1 + (s.x2 - s.x1) * k, y: s.y1 + (s.y2 - s.y1) * k };
  }
  const { cx, cy, r, ux, uy, vx, vy } = s.arc, th = t / r;
  return { x: cx + r * (-vx * Math.cos(th) + ux * Math.sin(th)), y: cy + r * (-vy * Math.cos(th) + uy * Math.sin(th)) };
}

/** The furthest length along a downward-only path that is still at or above `y`. A run across the
    page sits at one height, so reaching it returns its far end: the caller eases along it. */
export function lenAtY(p: Path, y: number): number {
  for (let i = p.segs.length - 1; i >= 0; i--) {
    const s = p.segs[i];
    if (s.y1 > y) continue;
    if (!s.arc) return s.at + (s.y2 === s.y1 ? s.len : clamp(y - s.y1, 0, s.len));
    const { cy, r, uy } = s.arc;
    const th = uy ? Math.asin(clamp((y - cy) / r, -1, 1)) : Math.acos(clamp((cy - y) / r, -1, 1));
    return s.at + clamp(th * r, 0, s.len);
  }
  return 0;
}
