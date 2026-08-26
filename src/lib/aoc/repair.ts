import { TERRAIN } from "./types.ts";
import type { EditorNation, EditorStateSlice } from "./encode.ts";

function inMap(x: number, y: number, w: number, h: number) {
  return x >= 0 && y >= 0 && x < w && y < h;
}

function capitalOk(
  n: EditorNation,
  owner: ArrayLike<number>,
  terrain: ArrayLike<number>,
  width: number,
  height: number,
) {
  const { x, y } = n.capital;
  if (!inMap(x, y, width, height)) return false;
  const i = y * width + x;
  return owner[i] === n.id && terrain[i] !== TERRAIN.water;
}

/** First land pixel of a nation, or null if it has none. */
export function firstLandPixel(
  owner: ArrayLike<number>,
  terrain: ArrayLike<number>,
  width: number,
  nationId: number,
): { x: number; y: number } | null {
  const len = owner.length;
  for (let i = 0; i < len; i++) {
    if (owner[i] === nationId && terrain[i] !== TERRAIN.water) {
      return { x: i % width, y: (i / width) | 0 };
    }
  }
  return null;
}

/**
 * Make a scenario downloadable: snap living capitals onto their land,
 * mark landless nations as formable (destroyed).
 */
export function repairForExport(state: EditorStateSlice): {
  nations: EditorNation[];
  cities: EditorStateSlice["cities"];
  changed: number;
} {
  const { width, height, owner, terrain, nations, cities } = state;
  let changed = 0;
  const next = nations.map((n) => {
    if (n.destroyed) return n;
    if (capitalOk(n, owner, terrain, width, height)) return n;
    const land = firstLandPixel(owner, terrain, width, n.id);
    if (!land) {
      changed += 1;
      return { ...n, destroyed: true };
    }
    changed += 1;
    return { ...n, capital: land, originalCapital: n.originalCapital ?? land };
  });

  const living = new Set(next.filter((n) => !n.destroyed).map((n) => n.id));
  const nextCities = cities.filter((c) => {
    if (!inMap(c.x, c.y, width, height)) return false;
    if (terrain[c.y * width + c.x] === TERRAIN.water) return false;
    if (c.r !== 0 && !living.has(c.r) && !next.some((n) => n.id === c.r)) return false;
    return true;
  });
  if (nextCities.length !== cities.length) changed += 1;

  return { nations: next, cities: nextCities, changed };
}
