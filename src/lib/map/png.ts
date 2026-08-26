import { TERRAIN_HEX } from "@/lib/aoc/types";
import type { AocColor } from "@/lib/aoc/types";
import { defaultNation, type EditorNation } from "@/lib/aoc/encode";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

const TERRAIN_RGB = Object.fromEntries(
  Object.entries(TERRAIN_HEX).map(([id, hex]) => [id, hexToRgb(hex)]),
) as Record<number, [number, number, number]>;

function dist2(a: [number, number, number], r: number, g: number, b: number) {
  const dr = a[0] - r;
  const dg = a[1] - g;
  const db = a[2] - b;
  return dr * dr + dg * dg + db * db;
}

export function nearestTerrain(r: number, g: number, b: number) {
  let best = 0;
  let bestD = Infinity;
  for (const [id, rgb] of Object.entries(TERRAIN_RGB)) {
    const d = dist2(rgb, r, g, b);
    if (d < bestD) {
      bestD = d;
      best = Number(id);
    }
  }
  return best;
}

export function colorKey(r: number, g: number, b: number) {
  return ((r << 16) | (g << 8) | b) >>> 0;
}

export function isIgnoredBorderColor(r: number, g: number, b: number) {
  const key = colorKey(r, g, b);
  return key === 0x000000 || key === 0xffffff || key === 0x0099ff;
}

export async function readImageFile(file: File): Promise<ImageData> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not read image."));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is unavailable.");
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function terrainFromImage(data: ImageData): Uint8Array {
  const out = new Uint8Array(data.width * data.height);
  const px = data.data;
  for (let i = 0, p = 0; i < out.length; i++, p += 4) {
    out[i] = nearestTerrain(px[p], px[p + 1], px[p + 2]);
  }
  return out;
}

export function bordersFromImage(data: ImageData): {
  owner: Uint16Array;
  colors: Map<number, AocColor>;
  firstPixel: Map<number, { x: number; y: number }>;
} {
  const { width, height } = data;
  const owner = new Uint16Array(width * height);
  const colorToId = new Map<number, number>();
  const colors = new Map<number, AocColor>();
  const firstPixel = new Map<number, { x: number; y: number }>();
  let next = 1;
  const px = data.data;
  for (let y = 0, i = 0, p = 0; y < height; y++) {
    for (let x = 0; x < width; x++, i++, p += 4) {
      const r = px[p];
      const g = px[p + 1];
      const b = px[p + 2];
      if (px[p + 3] < 16 || isIgnoredBorderColor(r, g, b)) {
        owner[i] = 0;
        continue;
      }
      const key = colorKey(r, g, b);
      let id = colorToId.get(key);
      if (!id) {
        id = next++;
        colorToId.set(key, id);
        colors.set(id, { r: r / 255, g: g / 255, b: b / 255, a: 1 });
        firstPixel.set(id, { x, y });
      }
      owner[i] = id;
    }
  }
  return { owner, colors, firstPixel };
}

export function nationsFromColors(
  colors: Map<number, AocColor>,
  firstPixel: Map<number, { x: number; y: number }>,
): EditorNation[] {
  return [...colors.entries()].map(([id, color]) => {
    const cap = firstPixel.get(id) ?? { x: 0, y: 0 };
    const n = defaultNation(id, color);
    n.capital = { ...cap };
    n.originalCapital = { ...cap };
    return n;
  });
}

export function renderTerrainPng(
  terrain: ArrayLike<number>,
  width: number,
  height: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas is unavailable."));
  const img = ctx.createImageData(width, height);
  const d = img.data;
  for (let i = 0, p = 0; i < terrain.length; i++, p += 4) {
    const rgb = TERRAIN_RGB[terrain[i] | 0] ?? TERRAIN_RGB[1];
    d[p] = rgb[0];
    d[p + 1] = rgb[1];
    d[p + 2] = rgb[2];
    d[p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG encode failed"))), "image/png");
  });
}

export function renderBordersPng(
  owner: ArrayLike<number>,
  nations: EditorNation[],
  width: number,
  height: number,
): Promise<Blob> {
  const byId = new Map(nations.map((n) => [n.id, n]));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas is unavailable."));
  const img = ctx.createImageData(width, height);
  const d = img.data;
  for (let i = 0, p = 0; i < owner.length; i++, p += 4) {
    const id = owner[i] | 0;
    if (id === 0) {
      d[p] = 255;
      d[p + 1] = 255;
      d[p + 2] = 255;
      d[p + 3] = 255;
      continue;
    }
    const c = byId.get(id)?.color ?? { r: 0.5, g: 0.5, b: 0.5, a: 1 };
    d[p] = Math.round(c.r * 255);
    d[p + 1] = Math.round(c.g * 255);
    d[p + 2] = Math.round(c.b * 255);
    d[p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG encode failed"))), "image/png");
  });
}
