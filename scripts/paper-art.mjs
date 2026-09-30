/*
 * Generates the security-paper artwork in public/images/paper: guilloché patterns like the ones printed
 * on banknotes and cheques, plus the ink grain for rubber stamps. Deterministic, so re-running it gives
 * the same files (scripts/ink-vignette.py inks the engraved vignettes separately). Colour is baked in (forest ink, or mint for the dark bands) because CSS can't recolour
 * an SVG used as a background.
 *
 *   node scripts/paper-art.mjs
 *
 * Rosettes and bands draw one base curve and repeat it with <use>: turning (or sliding) copies of the
 * same wave is what makes the woven moiré, and it keeps each file a few KB.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "paper");
mkdirSync(OUT, { recursive: true });

const INK = "#1f3b2b";
const MINT = "#a8e6bf";
const TAU = Math.PI * 2;
const f = (n) => +n.toFixed(1);

/** A closed polar curve r(θ) as a path, `steps` samples round the circle. */
function polar(r, steps) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU;
    const rr = r(t);
    d += `${i ? "L" : "M"}${f(rr * Math.cos(t))} ${f(rr * Math.sin(t))}`;
  }
  return d + "Z";
}

/** A ring of `copies` turned copies of one polar wave: the classic guilloché rosette band. */
function ring(id, r, lobes, copies, steps = lobes * 14) {
  const def = `<path id="${id}" d="${polar(r, steps)}"/>`;
  const step = 360 / (lobes * copies);
  const uses = Array.from({ length: copies }, (_, k) => `<use href="#${id}" transform="rotate(${f(k * step)})"/>`).join("");
  return { def, uses };
}

function rosette(color, name) {
  const rings = [
    // outer woven rope
    ring("a", (t) => 372 + 20 * Math.sin(36 * t), 36, 10),
    // middle band: two frequencies beat against each other
    ring("b", (t) => 290 + 30 * Math.sin(24 * t + 0.6) + 10 * Math.sin(48 * t), 24, 12),
    // the inner flower
    ring("c", (t) => 170 + 42 * Math.sin(12 * t) + 12 * Math.sin(36 * t), 12, 14),
    ring("d", (t) => 86 + 26 * Math.sin(9 * t + 1), 9, 12),
  ];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-400 -400 800 800" width="800" height="800">` +
    `<defs>${rings.map((r) => r.def).join("")}</defs>` +
    `<g fill="none" stroke="${color}" stroke-width=".55">${rings.map((r) => r.uses).join("")}` +
    `<circle r="394" stroke-width=".8"/><circle r="398" stroke-width=".4"/><circle r="236" stroke-width=".5"/><circle r="128" stroke-width=".5"/></g></svg>`;
  writeFileSync(join(OUT, name), svg);
}

/**
 * A horizontal border strip that tiles along x: interlaced sine waves slid across one period.
 * The base curve spans three periods so every slid copy still covers the tile.
 */
function band(color, name) {
  const W = 96, H = 28, mid = H / 2;
  const wave = (fn) => {
    let d = "";
    for (let x = -W; x <= 2 * W; x += 2) d += `${x === -W ? "M" : "L"}${x} ${f(mid + fn(x))}`;
    return d;
  };
  const a = wave((x) => 10 * Math.sin((TAU * x) / W));
  const b = wave((x) => 6 * Math.sin((TAU * 2 * x) / W + 1.2));
  const copies = 8;
  const uses = (id) => Array.from({ length: copies }, (_, k) => `<use href="#${id}" x="${f((k * W) / copies)}"/>`).join("");
  const art =
    `<defs><path id="a" d="${a}"/><path id="b" d="${b}"/></defs>` +
    `<g fill="none" stroke="${color}" stroke-width=".5">${uses("a")}<g stroke-width=".4">${uses("b")}</g>` +
    `<path d="M0 .5H${W}M0 ${H - 0.5}H${W}" stroke-width=".8"/></g>`;
  writeFileSync(join(OUT, name), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${art}</svg>`);
  // the same strip standing up, for the left and right edges of a frame
  const vname = name.replace(".svg", "-v.svg");
  writeFileSync(join(OUT, vname), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${H} ${W}" width="${H}" height="${W}"><g transform="translate(${H} 0) rotate(90)">${art}</g></svg>`);
}

/** Paper fibre: a faint fractal noise tile in forest ink, so sheets read as paper, not flat fills. */
function fibre(name) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">` +
    `<filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="7" stitchTiles="stitch"/>` +
    `<feColorMatrix values="0 0 0 0 .12 0 0 0 0 .23 0 0 0 0 .17 0 0 0 .09 0"/></filter>` +
    `<rect width="240" height="240" filter="url(#f)"/></svg>`;
  writeFileSync(join(OUT, name), svg);
}

/**
 * The wave field: close horizontal lines, each bent by two slow waves and nudged in phase from the one
 * above, so they bunch and open into the engraved moiré behind a note's portrait. Tiles in both axes:
 * the phase nudge adds up to whole turns over the tile height, and both waves repeat within the width.
 */
function field(color, name, opacity = 1) {
  const W = 480, N = 48, S = 7, H = N * S;
  let d = "";
  for (let j = 0; j <= N; j++) {
    const ph = (j / N) * TAU * 3; // whole phase turns over the tile, so row N matches row 0 one tile down
    for (let x = 0; x <= W; x += 6) {
      const y = j * S + 12 * Math.sin((TAU * x) / W + ph) + 5 * Math.sin((TAU * 3 * x) / W - 2 * ph);
      d += `${x ? "L" : "M"}${x} ${f(y)}`;
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    `<path d="${d}" fill="none" stroke="${color}" stroke-width=".6" opacity="${opacity}"/></svg>`;
  writeFileSync(join(OUT, name), svg);
}

/**
 * Stamp grain: an opaque tile with small ragged holes, used as a mask so a stamp reads as ink pressed
 * onto paper, a little patchy. Seeded, so the grain is the same on every build.
 */
function grain(name) {
  let s = 20260930;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const W = 160;
  let holes = "";
  for (let i = 0; i < 260; i++) {
    const x = f(rnd() * W), y = f(rnd() * W), r = f(0.4 + rnd() * rnd() * 2.4);
    holes += `M${x} ${y}m-${r} 0a${r} ${r} 0 1 0 ${f(r * 2)} 0a${r} ${r} 0 1 0 -${f(r * 2)} 0`;
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}">` +
    `<path fill-rule="evenodd" d="M0 0H${W}V${W}H0Z${holes}"/></svg>`;
  writeFileSync(join(OUT, name), svg);
}

rosette(INK, "rosette.svg");
rosette(MINT, "rosette-mint.svg");
band(INK, "band.svg");
band(MINT, "band-mint.svg");
field(INK, "field.svg");
field(MINT, "field-mint.svg");
grain("grain.svg");
fibre("fibre.svg");
console.log("paper art written to", OUT);
