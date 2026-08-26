import type { AocRle } from "./types.ts";

/** Run-length encode a row-major bottom-origin map buffer. */
export function encodeRle(data: ArrayLike<number>): AocRle {
  const amounts: number[] = [];
  const values: number[] = [];
  const len = data.length;
  if (len === 0) return { amounts, values };

  let current = data[0] | 0;
  let count = 1;
  for (let i = 1; i < len; i++) {
    const v = data[i] | 0;
    if (v === current && count < 0x7fffffff) {
      count += 1;
    } else {
      amounts.push(count);
      values.push(current);
      current = v;
      count = 1;
    }
  }
  amounts.push(count);
  values.push(current);
  return { amounts, values };
}

export function isRle(v: unknown): v is AocRle {
  return (
    !!v &&
    typeof v === "object" &&
    Array.isArray((v as AocRle).amounts) &&
    Array.isArray((v as AocRle).values)
  );
}

/** v4.5.0 stores the real map in terrain2/owner2; terrain/owner are empty arrays. */
export function pickRle(...candidates: unknown[]): AocRle | null {
  let empty: AocRle | null = null;
  for (const c of candidates) {
    if (!isRle(c)) continue;
    if (c.amounts.length > 0) return c;
    if (!empty) empty = c;
  }
  return empty;
}

export function decodeRle(rle: AocRle, expected?: number): number[] {
  const { amounts, values } = rle;
  if (!Array.isArray(amounts) || !Array.isArray(values)) {
    throw new Error("RLE block is missing amounts/values arrays");
  }
  if (amounts.length !== values.length) {
    throw new Error(
      `RLE amounts (${amounts.length}) and values (${values.length}) length mismatch`,
    );
  }
  let total = 0;
  for (const n of amounts) {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error("RLE amount is not a non-negative integer");
    }
    total += n;
  }
  if (expected !== undefined && total !== expected) {
    throw new Error(`RLE covers ${total} pixels, expected ${expected}`);
  }
  const out = new Array<number>(total);
  let o = 0;
  for (let i = 0; i < amounts.length; i++) {
    const n = amounts[i] | 0;
    const v = values[i] | 0;
    if (typeof out.fill === "function") {
      out.fill(v, o, o + n);
      o += n;
    } else {
      for (let k = 0; k < n; k++) out[o++] = v;
    }
  }
  return out;
}

export function rlePixelCount(rle: AocRle): number {
  if (!rle || !Array.isArray(rle.amounts)) return -1;
  let t = 0;
  for (const n of rle.amounts) t += n | 0;
  return t;
}

/**
 * Convert a top-origin canvas buffer (row 0 = north) into the game's
 * bottom-origin order (row 0 = south), left to right.
 */
export function canvasToAocOrder(
  topOrigin: ArrayLike<number>,
  width: number,
  height: number,
): number[] {
  const out = new Array<number>(width * height);
  let o = 0;
  for (let y = height - 1; y >= 0; y--) {
    const row = y * width;
    for (let x = 0; x < width; x++) out[o++] = topOrigin[row + x] | 0;
  }
  return out;
}

/** Inverse of canvasToAocOrder. */
export function aocOrderToCanvas(
  bottomOrigin: ArrayLike<number>,
  width: number,
  height: number,
): number[] {
  const out = new Array<number>(width * height);
  let i = 0;
  for (let y = height - 1; y >= 0; y--) {
    const row = y * width;
    for (let x = 0; x < width; x++) out[row + x] = bottomOrigin[i++] | 0;
  }
  return out;
}
