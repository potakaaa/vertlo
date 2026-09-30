/* The How it works scene: a 64 × 48 grid of 8px pixel cells, as pure data plus one canvas
   painter. scene(p) lays out what is on screen at scroll progress p (0 → 1): providers connect
   into Vertlo (step 1), Vertlo splits volume across MIDs (step 2), MID 2 pauses and the rest take
   its traffic (step 3). tk is the ambient packet tick; the focus rect dims what the active step
   is not about. No React, no GSAP: HowFlow owns sizing, scheduling and scroll. */

/* ── scene grid: 64 × 48 cells of 8px ── */
const S = 8, C = 64, R = 48;
export const SCENE_W = C * S, SCENE_H = R * S;
const W = SCENE_W;
const ROWS = [8, 23, 38];
const HUB = [25, 23] as const;
const SOURCES = ["VISA", "MC", "PAYPAL"];
const SHARE_ROUTE = [42, 38, 20];
const SHARE_REROUTE = [61, 0, 39];
const BAR = 18; // bar cells = 100%

type Cell = [number, number];
type Col = "w" | "g" | "r";
type Px = [number, number, Col, number];
type Tx = [number, number, string, Col, number, CanvasTextAlign];

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const partial = (cells: Cell[], t: number) => cells.slice(0, Math.round(cells.length * t));

function lane(pts: Cell[]): Cell[] {
  const out: Cell[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const dx = Math.sign(bx - ax), dy = Math.sign(by - ay);
    let x = ax, y = ay;
    while (x !== bx || y !== by) { out.push([x, y]); x += dx; y += dy; }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
/** Box outline in drawing order, clockwise from the left edge's middle. */
function box(x0: number, y0: number, w: number, h: number): Cell[] {
  const x1 = x0 + w - 1, y1 = y0 + h - 1, my = y0 + Math.floor(h / 2);
  return lane([[x0, my], [x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, my + 1]]);
}
/** Diamond outline as two halves drawn left → right (over the top, under the bottom). */
function diamondHalves(cx: number, cy: number, r: number): [Cell[], Cell[]] {
  const up: Cell[] = [], down: Cell[] = [];
  for (let k = 0; k <= r; k++) { up.push([cx - r + k, cy - k]); down.push([cx - r + k, cy + k]); }
  for (let k = 1; k <= r; k++) { up.push([cx + k, cy - r + k]); down.push([cx + k, cy + r - k]); }
  return [up, down];
}
function ring(cx: number, cy: number, m: number): Cell[] {
  const out: Cell[] = [];
  for (let y = -m; y <= m; y++) for (let x = -m; x <= m; x++) if (Math.abs(x) + Math.abs(y) === m) out.push([cx + x, cy + y]);
  return out;
}
function hash(n: number) {
  n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15);
  return (n >>> 0) / 4294967296;
}

const IN_LANES = ROWS.map((ry) => lane([[11, ry], [15, ry], [15, HUB[1]], [18, HUB[1]]]));
const SRC_BOXES = ROWS.map((ry) => box(1, ry - 2, 10, 5));
const [DIA_UP, DIA_DOWN] = diamondHalves(HUB[0], HUB[1], 6);
const DIA_RING = ring(HUB[0], HUB[1], 3);
const CORE: Cell[] = [[25, 23], [24, 23], [26, 23], [25, 22], [25, 24]];
const OUT_LANE = lane([[32, 23], [36, 23]]);
const BRANCHES = ROWS.map((my) => lane([[36, 23], [36, my], [39, my]]));
const OUT_PATHS = ROWS.map((my) => lane([[32, 23], [36, 23], [36, my], [39, my]]));
const MID_BOXES = ROWS.map((my) => box(40, my - 2, 5, 5));

function scene(p: number, tk: number, live: boolean) {
  const P: Px[] = [], T: Tx[] = [];
  const put = (cells: Cell[], c: Col, a: number) => { for (const [x, y] of cells) P.push([x, y, c, a]); };
  const drawHead = (cells: Cell[]) => {
    const n = cells.length;
    if (n) P.push([cells[n - 1][0], cells[n - 1][1], "g", 1]);
    if (n > 1) P.push([cells[n - 2][0], cells[n - 2][1], "g", 0.45]);
  };

  /* 01 connect: sources, lanes into the hub, the hub itself */
  let connected = 0, hit = false;
  ROWS.forEach((ry, i) => {
    const bt = easeOut(seg(p, 0.02 + i * 0.03, 0.09 + i * 0.03));
    if (bt > 0) {
      put(partial(SRC_BOXES[i], bt), "w", 0.55);
      T.push([5.5 * S + 4, ry * S + 4, SOURCES[i], "w", 0.85 * bt, "center"]);
    }
    const lt = seg(p, 0.08 + i * 0.035, 0.2 + i * 0.035), ln = IN_LANES[i];
    if (lt <= 0) return;
    const shown = partial(ln, lt);
    put(shown, "w", 0.16);
    if (lt < 1) { drawHead(shown); return; }
    connected++;
    if (!live) return;
    const pos = (tk + i * 5) % (ln.length + 6);
    if (pos >= ln.length - 2 && pos < ln.length) hit = true;
    for (const [q, a] of [[pos, 1], [pos - 1, 0.45]] as const) { const c = ln[q]; if (c) P.push([c[0], c[1], "g", a]); }
  });
  const dt = easeOut(seg(p, 0.15, 0.26));
  if (dt > 0) {
    put(partial(DIA_UP, dt), "w", 0.7);
    put(partial(DIA_DOWN, dt), "w", 0.7);
    put(DIA_RING, "w", 0.18 * dt);
    T.push([HUB[0] * S + 4, 31.5 * S, "VERTLO", "w", 0.6 * dt, "center"]);
  }
  const ct = seg(p, 0.24, 0.3);
  if (ct > 0) put(CORE, "g", (0.35 + 0.65 * ct) * (hit ? 1 : 0.75));

  /* 02 route: out of the hub, split by approval, bars fill to the share */
  const ot = seg(p, 0.35, 0.4);
  if (ot > 0) { const shown = partial(OUT_LANE, ot); put(shown, "w", 0.16); if (ot < 1) drawHead(shown); }
  const grow = easeOut(seg(p, 0.52, 0.63));

  /* 03 keep: MID 2 pauses, its share moves to MID 1 and MID 3, orders keep going through */
  const pause = seg(p, 0.69, 0.72);
  const reroute = easeInOut(seg(p, 0.73, 0.86));
  const blink = live ? tk % 4 < 2 : true;

  ROWS.forEach((my, i) => {
    const paused = i === 1 && pause > 0;
    const share = (SHARE_ROUTE[i] + (SHARE_REROUTE[i] - SHARE_ROUTE[i]) * reroute) * grow;
    const brt = seg(p, 0.39 + i * 0.02, 0.47 + i * 0.02);
    if (brt > 0) {
      const shown = partial(BRANCHES[i], brt);
      put(shown, paused ? "r" : "w", paused ? 0.3 : 0.16);
      if (brt < 1) drawHead(shown);
    }
    const mt = easeOut(seg(p, 0.45 + i * 0.02, 0.52 + i * 0.02));
    if (mt <= 0) return;
    put(partial(MID_BOXES[i], mt), paused ? "r" : "w", paused ? (blink ? 0.9 : 0.4) : 0.55);
    P.push([42, my, paused ? "r" : "g", mt * (paused && !blink ? 0.4 : 1)]);
    T.push([46 * S, (my - 1) * S + 4, "MID " + (i + 1), "w", 0.8 * mt, "left"]);
    T.push([46 * S + 46, (my - 1) * S + 4, paused ? "PAUSED" : "LIVE", paused ? "r" : "g", 0.95 * mt, "left"]);
    if (grow > 0) T.push([W - 2, (my - 1) * S + 4, Math.round(share) + "%", paused ? "r" : "w", 0.9 * Math.max(grow, 0.3), "right"]);
    const filled = Math.round((share / 100) * BAR);
    for (let x = 0; x < BAR; x++) {
      const on = x < filled, head = on && x === filled - 1 && !paused;
      P.push([46 + x, my + 1, head ? "g" : "w", (head ? 1 : on ? 0.5 : 0.08) * mt]);
    }
    /* traffic: packet spacing follows the current share */
    if (live && grow > 0 && share >= 1) {
      const path = OUT_PATHS[i], gap = share >= 50 ? 3 : share >= 35 ? 4 : share >= 15 ? 7 : 12;
      for (let q = tk % gap; q < path.length; q += gap) P.push([path[q][0], path[q][1], "g", 1]);
    }
  });

  const cht = seg(p, 0.77, 0.9);
  if (cht > 0) {
    const shift = live ? Math.floor(tk / 3) : 0;
    for (let k = 0; k < 7; k++) {
      const idx = shift + k;
      const hgt = Math.min(7, 2 + Math.floor((idx % 20) * 0.25) + Math.floor(hash(idx * 13) * 3));
      const h = Math.round(hgt * easeOut(seg(cht, k * 0.08, k * 0.08 + 0.44)));
      for (let y = 0; y < h; y++) P.push([19 + k * 2, 43 - y, k === 6 ? "g" : "w", k === 6 ? 0.95 : 0.18 + 0.04 * k]);
    }
    for (let x = 18; x <= 32; x++) P.push([x, 44, "w", 0.2 * cht]);
    T.push([18 * S, 45.9 * S, "ORDERS STILL GOING THROUGH", "g", 0.9 * cht, "left"]);
  }

  /* hub caption follows the story */
  if (reroute > 0) T.push([HUB[0] * S + 4, 33.5 * S, "TRAFFIC REROUTED", "g", 0.9, "center"]);
  else if (ot > 0) T.push([HUB[0] * S + 4, 33.5 * S, "ROUTING BY APPROVAL", "w", 0.6, "center"]);
  else if (connected > 0) T.push([HUB[0] * S + 4, 33.5 * S, connected + " CONNECTED", "g", 0.9, "center"]);

  return { P, T };
}

/* ── focus: the part of the scene the active step is about, [x0, y0, x1, y1] in cells.
   It glides between steps; everything outside it softly dims. No frame, just contrast. ── */
type Rect = [number, number, number, number];
const FOCUS: Rect[] = [
  [0, 2, 33, 41],  // 01 providers → Vertlo
  [17, 2, 63, 42], // 02 Vertlo → MIDs, split by share
  [16, 2, 63, 47], // 03 MIDs + orders still going through
];
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerpRect = (a: Rect, b: Rect, t: number) => a.map((v, i) => v + (b[i] - v) * t) as Rect;
/** f: 0 → step 1, 1 → step 2, 2 → step 3; transitions happen around the step boundaries. */
function focusAt(f: number): Rect {
  const a = lerpRect(FOCUS[0], FOCUS[1], smooth(seg(f, 0.35, 0.65)));
  return lerpRect(a, FOCUS[2], smooth(seg(f, 1.35, 1.65)));
}
/** Alpha multiplier for a cell: 1 inside the focus, fading to DIM over 4 cells outside it. */
const DIM = 0.3;
function lit(x: number, y: number, [x0, y0, x1, y1]: Rect) {
  const d = Math.max(x0 - x, x - x1, y0 - y, y - y1, 0);
  return 1 - (1 - DIM) * smooth(clamp01(d / 4));
}

const INK = "11,20,16", GREEN = "22,196,90", MUTED = "92,104,98"; // paused prints muted: red is kept for the strike
const CELL: Record<Col, string> = { w: INK, g: GREEN, r: MUTED };
const TEXT: Record<Col, string> = { w: INK, g: "10,122,59", r: MUTED };

/** Focus position for scroll progress p: 0 → step 1 … 2 → step 3. Reduced motion parks p at each
    step's end, so the step reads straight off it; otherwise the focus moves around step boundaries. */
export const focusFor = (p: number, still: boolean) => Math.min(2, Math.max(0, p * 3 - (still ? 1 : 0.5)));

export function monoFont() {
  const f = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim();
  return f || '"Geist Mono", ui-monospace, monospace';
}

/** Paint the scene. ctx must already map scene units to canvas pixels; sc is that scale (for label size). */
export function paintScene(ctx: CanvasRenderingContext2D, o: { p: number; f: number; tk: number; live: boolean; sc: number; font: string }) {
  const cv = ctx.canvas;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore();
  const spot = focusAt(o.f);
  for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
    const ex = (x - C / 2) / (C / 2), ey = (y - R / 2) / (R / 2);
    const v = Math.max(0, 1 - Math.hypot(ex * 0.8, ey) * 0.85);
    if (v <= 0) continue;
    ctx.fillStyle = `rgba(${INK},${(0.09 * v * lit(x, y, spot)).toFixed(3)})`;
    ctx.fillRect(x * S + 3, y * S + 3, 2, 2);
  }
  const { P, T } = scene(o.p, o.tk, o.live);
  for (const [x, y, c, a] of P) { ctx.fillStyle = `rgba(${CELL[c]},${a * lit(x, y, spot)})`; ctx.fillRect(x * S + 1.5, y * S + 1.5, S - 3, S - 3); }
  /* keep labels ≥ ~9.5px on screen when the scene is scaled down (phones) */
  ctx.font = `500 ${Math.max(10.5, 9.5 / o.sc).toFixed(2)}px ${o.font}`;
  ctx.textBaseline = "middle";
  for (const [x, y, s, c, a, align] of T) { ctx.textAlign = align; ctx.fillStyle = `rgba(${TEXT[c]},${a * lit(x / S, y / S, spot)})`; ctx.fillText(s, x, y); }
}
