import { TERRAIN } from "@/lib/aoc/types";
import { unproject, type BBox } from "./projection";

type Box = [number, number, number, number]; // west, south, east, north

const DESERT: Box[] = [
  [-18, 8, 32, 32],
  [35, 12, 60, 34],
  [113, -32, 148, -18],
  [90, 37, 115, 48],
  [14, -30, 26, -18],
  [-118, 24, -102, 36],
  [44, 22, 65, 30],
];
const FOREST: Box[] = [
  [-75, -15, -50, 5],
  [10, -5, 30, 5],
  [60, 50, 140, 66],
  [-130, 48, -60, 60],
  [95, -8, 140, 8],
  [-90, 10, -78, 18],
];
const MOUNTAIN: Box[] = [
  [70, 26, 95, 38],
  [-80, -40, -65, 10],
  [-125, 32, -105, 55],
  [5, 44, 15, 48],
  [6, 36, 10, 44],
  [100, 25, 105, 32],
  [65, 36, 78, 44],
];
const GRASS: Box[] = [
  [30, 44, 90, 55],
  [-110, 32, -90, 49],
  [20, -30, 32, -20],
  [135, -38, 150, -25],
];

function inside(lon: number, lat: number, boxes: Box[]) {
  for (const [w, s, e, n] of boxes) {
    if (lon >= w && lon <= e && lat >= s && lat <= n) return true;
  }
  return false;
}

export function paintBiomes(
  terrain: Uint8Array,
  width: number,
  height: number,
  bbox: BBox,
) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (terrain[i] === TERRAIN.water) continue;
      const { lon, lat } = unproject(x + 0.5, y + 0.5, width, height, bbox);
      if (lat > 66 || lat < -60) {
        terrain[i] = TERRAIN.tundra;
        continue;
      }
      if (inside(lon, lat, MOUNTAIN)) {
        terrain[i] = TERRAIN.mountains;
        continue;
      }
      if (inside(lon, lat, DESERT)) {
        terrain[i] = TERRAIN.desert;
        continue;
      }
      if (inside(lon, lat, FOREST) || (lat > 55 && lat <= 66 && lon > 30)) {
        terrain[i] = TERRAIN.forest;
        continue;
      }
      if (inside(lon, lat, GRASS)) {
        terrain[i] = TERRAIN.grasslands;
        continue;
      }
      terrain[i] = TERRAIN.plains;
    }
  }

  // Hills: plains adjacent to mountains.
  const next = new Uint8Array(terrain);
  const dirs = [1, -1, width, -width, width + 1, width - 1, -width + 1, -width - 1];
  for (let i = 0; i < terrain.length; i++) {
    if (terrain[i] !== TERRAIN.plains && terrain[i] !== TERRAIN.grasslands) continue;
    for (const d of dirs) {
      const j = i + d;
      if (j >= 0 && j < terrain.length && terrain[j] === TERRAIN.mountains) {
        next[i] = TERRAIN.hills;
        break;
      }
    }
  }
  terrain.set(next);
}
