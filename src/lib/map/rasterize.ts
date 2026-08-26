import type { Topology, GeometryCollection } from "topojson-specification";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import { CAPITALS, EXTRA_CITIES, NATION_COLORS } from "@/data/capitals";
import { TERRAIN } from "@/lib/aoc/types";
import type { EditorCity, EditorNation } from "@/lib/aoc/encode";
import { defaultNation } from "@/lib/aoc/encode";
import { paintBiomes } from "./terrain";
import { inBBox, project, type BBox, WORLD_BBOX } from "./projection";

type CountryProps = { name?: string };
type CountryTopo = Topology<{ countries: GeometryCollection<CountryProps> }>;

export type RasterResult = {
  width: number;
  height: number;
  terrain: Uint8Array;
  owner: Uint16Array;
  rightful: Uint16Array;
  occupations: Uint16Array;
  nations: EditorNation[];
  cities: EditorCity[];
};

export type MergeSpec = {
  /** ISO numeric ids to fold into the target. */
  from: string[];
  name: string;
  /** Keep the target's ISO id (and therefore color/capital when possible). */
  into: string;
};

let topoCache: CountryTopo | null = null;

export async function loadCountries(): Promise<CountryTopo> {
  if (topoCache) return topoCache;
  const res = await fetch("/data/countries-110m.json");
  if (!res.ok) throw new Error("Could not load world country outlines.");
  topoCache = (await res.json()) as CountryTopo;
  return topoCache;
}

function hashColor(id: number) {
  const hue = (id * 47) % 360;
  const s = 0.42 + (id % 5) * 0.07;
  const l = 0.36 + (id % 4) * 0.05;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return { r: f(0), g: f(8), b: f(4), a: 1 };
}

function drawRing(
  ctx: CanvasRenderingContext2D,
  ring: Position[],
  width: number,
  height: number,
  bbox: BBox,
) {
  ring.forEach((p, i) => {
    const { x, y } = project(p[0], p[1], width, height, bbox);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

function drawGeometry(
  ctx: CanvasRenderingContext2D,
  geom: Geometry,
  width: number,
  height: number,
  bbox: BBox,
) {
  if (geom.type === "Polygon") {
    ctx.beginPath();
    for (const ring of geom.coordinates) drawRing(ctx, ring, width, height, bbox);
    ctx.fill("evenodd");
  } else if (geom.type === "MultiPolygon") {
    for (const poly of geom.coordinates) {
      ctx.beginPath();
      for (const ring of poly) drawRing(ctx, ring, width, height, bbox);
      ctx.fill("evenodd");
    }
  }
}

function findOwnedPixel(
  owner: Uint16Array,
  terrain: Uint8Array,
  width: number,
  height: number,
  id: number,
  hintX: number,
  hintY: number,
): { x: number; y: number } | null {
  const hx = Math.max(0, Math.min(width - 1, Math.round(hintX)));
  const hy = Math.max(0, Math.min(height - 1, Math.round(hintY)));
  const maxR = Math.max(width, height);
  for (let r = 0; r < maxR; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (r > 0 && Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        const x = hx + dx;
        const y = hy + dy;
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        const i = y * width + x;
        if (owner[i] === id && terrain[i] !== TERRAIN.water) return { x, y };
      }
    }
  }
  for (let i = 0; i < owner.length; i++) {
    if (owner[i] === id && terrain[i] !== TERRAIN.water) {
      return { x: i % width, y: Math.floor(i / width) };
    }
  }
  return null;
}

function snapInvalid(
  isoOwner: Uint16Array,
  validIso: Set<number>,
  width: number,
) {
  const src = new Uint16Array(isoOwner);
  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    if (v === 0 || validIso.has(v)) continue;
    const x = i % width;
    const neigh: number[] = [];
    if (x > 0) neigh.push(src[i - 1]);
    if (x + 1 < width) neigh.push(src[i + 1]);
    if (i >= width) neigh.push(src[i - width]);
    if (i + width < src.length) neigh.push(src[i + width]);
    const counts = new Map<number, number>();
    for (const n of neigh) {
      if (n === 0 || validIso.has(n)) counts.set(n, (counts.get(n) ?? 0) + 1);
    }
    let best = 0;
    let bestC = -1;
    for (const [id, c] of counts) {
      if (c > bestC || (c === bestC && id !== 0 && best === 0)) {
        best = id;
        bestC = c;
      }
    }
    isoOwner[i] = best;
  }
}

function applyMerges(isoOwner: Uint16Array, merges: MergeSpec[]) {
  if (merges.length === 0) return;
  const map = new Map<number, number>();
  for (const m of merges) {
    const into = Number.parseInt(m.into, 10);
    for (const f of m.from) map.set(Number.parseInt(f, 10), into);
  }
  for (let i = 0; i < isoOwner.length; i++) {
    const next = map.get(isoOwner[i]);
    if (next) isoOwner[i] = next;
  }
}

export async function rasterizeWorld(opts: {
  width: number;
  height: number;
  bbox?: BBox;
  merges?: MergeSpec[];
  skipIso?: Set<string>;
  rename?: Record<string, string>;
  blankNations?: boolean;
}): Promise<RasterResult> {
  const width = opts.width;
  const height = opts.height;
  const bbox = opts.bbox ?? WORLD_BBOX;
  const topo = await loadCountries();
  const fc = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, CountryProps>;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas is unavailable.");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height);

  const features = fc.features.filter((f): f is Feature<Geometry, CountryProps> => !!f.geometry);
  const validIso = new Set<number>();

  for (const feat of features) {
    const iso = String(feat.id ?? "");
    if (!iso || iso === "010") continue; // Antarctica stays unclaimed tundra
    if (opts.skipIso?.has(iso)) continue;
    const n = Number.parseInt(iso, 10);
    if (!Number.isFinite(n) || n <= 0) continue;
    validIso.add(n);
    ctx.fillStyle = `rgb(${n & 255}, ${(n >> 8) & 255}, 0)`;
    drawGeometry(ctx, feat.geometry, width, height, bbox);
  }

  const img = ctx.getImageData(0, 0, width, height).data;
  const isoOwner = new Uint16Array(width * height);
  for (let p = 0, i = 0; p < img.length; p += 4, i++) {
    const iso = img[p] + img[p + 1] * 256;
    isoOwner[i] = iso;
  }

  snapInvalid(isoOwner, validIso, width);
  snapInvalid(isoOwner, validIso, width);
  for (let i = 0; i < isoOwner.length; i++) {
    if (isoOwner[i] !== 0 && !validIso.has(isoOwner[i])) isoOwner[i] = 0;
  }

  const terrain = new Uint8Array(width * height);
  for (let i = 0; i < isoOwner.length; i++) {
    terrain[i] = isoOwner[i] === 0 ? TERRAIN.water : TERRAIN.plains;
  }

  applyMerges(isoOwner, opts.merges ?? []);
  paintBiomes(terrain, width, height, bbox);

  if (opts.blankNations) {
    const owner = new Uint16Array(width * height);
    return {
      width,
      height,
      terrain,
      owner,
      rightful: new Uint16Array(width * height),
      occupations: new Uint16Array(width * height),
      nations: [],
      cities: [],
    };
  }

  const used = new Map<number, number>(); // iso -> area
  for (let i = 0; i < isoOwner.length; i++) {
    const iso = isoOwner[i];
    if (iso === 0 || terrain[i] === TERRAIN.water) {
      isoOwner[i] = 0;
      continue;
    }
    used.set(iso, (used.get(iso) ?? 0) + 1);
  }

  const isoList = [...used.entries()]
    .filter(([, area]) => area >= 1)
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([iso]) => iso);

  const isoToId = new Map<number, number>();
  isoList.forEach((iso, idx) => isoToId.set(iso, idx + 1));

  const owner = new Uint16Array(width * height);
  for (let i = 0; i < isoOwner.length; i++) {
    const id = isoToId.get(isoOwner[i]);
    owner[i] = id ?? 0;
  }

  const nameByIso = new Map<string, string>();
  for (const feat of features) {
    const iso = String(feat.id ?? "");
    if (feat.properties?.name) nameByIso.set(iso, feat.properties.name);
  }
  if (opts.rename) {
    for (const [iso, name] of Object.entries(opts.rename)) nameByIso.set(iso, name);
  }

  const nations: EditorNation[] = [];
  const cities: EditorCity[] = [];

  for (const isoNum of isoList) {
    const id = isoToId.get(isoNum);
    if (!id) continue;
    const iso = String(isoNum).padStart(3, "0");
    const name = nameByIso.get(iso) ?? `Nation ${id}`;
    const color = NATION_COLORS[iso] ?? hashColor(isoNum);
    const capMeta = CAPITALS[iso];
    let hint = { x: width / 2, y: height / 2 };
    if (capMeta && inBBox(capMeta.lon, capMeta.lat, bbox)) {
      hint = project(capMeta.lon, capMeta.lat, width, height, bbox);
    }
    const capital = findOwnedPixel(owner, terrain, width, height, id, hint.x, hint.y);
    if (!capital) continue;
    const nation = defaultNation(id, color);
    nation.name = name;
    nation.capital = capital;
    nation.originalCapital = { ...capital };
    nations.push(nation);
    cities.push({
      x: capital.x,
      y: capital.y,
      n: capMeta?.n ?? name,
      r: id,
      rp: 0,
    });
  }

  for (const extra of EXTRA_CITIES) {
    const isoNum = Number.parseInt(extra.iso, 10);
    const id = isoToId.get(isoNum);
    if (!id) continue;
    if (!inBBox(extra.lon, extra.lat, bbox)) continue;
    const { x, y } = project(extra.lon, extra.lat, width, height, bbox);
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || py < 0 || px >= width || py >= height) continue;
    const i = py * width + px;
    if (terrain[i] === TERRAIN.water) continue;
    if (owner[i] !== id) continue;
    if (cities.some((c) => Math.abs(c.x - px) + Math.abs(c.y - py) < 2)) continue;
    cities.push({ x: px, y: py, n: extra.n, r: id, rp: 0 });
  }

  return {
    width,
    height,
    terrain,
    owner,
    rightful: new Uint16Array(owner),
    occupations: new Uint16Array(width * height),
    nations,
    cities,
  };
}
