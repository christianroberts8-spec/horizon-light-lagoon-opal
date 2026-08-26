import type { AocColor } from "./types.ts";

/** Websim AoC Exporter flag sheet: 36×24 cells, columns of 10, bottom to top. */
export const FLAG_CELL_W = 36;
export const FLAG_CELL_H = 24;
export const FLAG_COL_H = 10;

export function flagSheetSize(nationCount: number) {
  const n = Math.max(1, nationCount);
  return {
    width: Math.ceil(n / FLAG_COL_H) * FLAG_CELL_W,
    height: Math.min(n, FLAG_COL_H) * FLAG_CELL_H,
  };
}

function cssColor(c: AocColor) {
  const r = Math.round(Math.min(1, Math.max(0, c.r)) * 255);
  const g = Math.round(Math.min(1, Math.max(0, c.g)) * 255);
  const b = Math.round(Math.min(1, Math.max(0, c.b)) * 255);
  return `rgb(${r} ${g} ${b})`;
}

export async function makeFlagSheet(
  nations: Array<{ color: AocColor }>,
): Promise<Blob> {
  const { width, height } = flagSheetSize(nations.length);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Could not encode flags.png.");
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, width, height);
  nations.forEach((nation, index) => {
    const column = Math.floor(index / FLAG_COL_H);
    const rowFromBottom = index % FLAG_COL_H;
    const y = height - (rowFromBottom + 1) * FLAG_CELL_H;
    const x = column * FLAG_CELL_W;
    ctx.fillStyle = cssColor(nation.color);
    ctx.fillRect(x, y, FLAG_CELL_W, FLAG_CELL_H);
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.fillRect(x, y, FLAG_CELL_W, 4);
    ctx.fillStyle = "rgba(0,0,0,.15)";
    ctx.fillRect(x, y + FLAG_CELL_H - 4, FLAG_CELL_W, 4);
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode flags.png."))),
      "image/png",
    );
  });
}

export function makeFlagNames(nations: Array<{ name: string }>) {
  const lines = [
    "NOTE: This file is only for personal use! You don't need to share this with other scenario files.",
    "This file includes all nations with flags. They follow the same order as the saved flag canvas, in columns of 10, from bottom to top.",
    "This file is useful for editing flags in outside programs.",
    "",
  ];
  nations.forEach((nation, index) => {
    lines.push(`${index + 1}. ${nation.name}`);
    if ((index + 1) % FLAG_COL_H === 0) lines.push("");
  });
  return `${lines.join("\n").trim()}\n`;
}

export async function validatePng(
  blob: Blob,
  expectedWidth: number,
  expectedHeight: number,
): Promise<string[]> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.length < 24 || signature.some((byte, index) => bytes[index] !== byte)) {
    return ["flags.png is not a PNG file."];
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  return width === expectedWidth && height === expectedHeight
    ? []
    : [`flags.png is ${width}×${height}; expected ${expectedWidth}×${expectedHeight}.`];
}
