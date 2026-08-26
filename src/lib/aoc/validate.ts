import {
  AOC_IMPORT_PIXEL_CAP,
  AOC_MAX_DIM,
  AOC_MIN_SIZE,
  AOC_VERSION,
  AOC_WARN_PIXELS,
  type AocFile,
  type AocRle,
  type ValidationIssue,
  type ValidationResult,
} from "./types.ts";
import { decodeRle, pickRle, rlePixelCount } from "./rle.ts";

function err(code: string, message: string): ValidationIssue {
  return { level: "error", code, message };
}
function warn(code: string, message: string): ValidationIssue {
  return { level: "warning", code, message };
}

function isColor(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const c = v as { r: unknown; g: unknown; b: unknown; a: unknown };
  return [c.r, c.g, c.b, c.a].every(
    (n) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1.0001,
  );
}

function isPos(v: unknown, w: number, h: number): boolean {
  if (!v || typeof v !== "object") return false;
  const p = v as { x: unknown; y: unknown };
  return (
    Number.isInteger(p.x) &&
    Number.isInteger(p.y) &&
    (p.x as number) >= 0 &&
    (p.y as number) >= 0 &&
    (p.x as number) < w &&
    (p.y as number) < h
  );
}

/**
 * Validate a parsed Ages of Conflict scenario before download/import.
 * Errors block download; warnings do not.
 */
export function validateAoc(input: unknown): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!input || typeof input !== "object") {
    return {
      ok: false,
      errors: [err("not-object", "Scenario is not a JSON object.")],
      warnings,
    };
  }

  const file = input as Partial<AocFile>;

  if (typeof file.version !== "string" || !file.version.trim()) {
    errors.push(err("version", "Missing version string."));
  } else if (file.version !== AOC_VERSION) {
    warnings.push(
      warn(
        "version-mismatch",
        `Version is ${file.version}; current mobile is ${AOC_VERSION}. The game usually still loads it.`,
      ),
    );
  }

  const width = file.width as number;
  const height = file.height as number;
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    errors.push(err("size", "width and height must be integers."));
  } else {
    if (width < AOC_MIN_SIZE || height < AOC_MIN_SIZE) {
      errors.push(
        err("size-min", `Map must be at least ${AOC_MIN_SIZE}×${AOC_MIN_SIZE}.`),
      );
    }
    if (width > AOC_MAX_DIM || height > AOC_MAX_DIM) {
      errors.push(
        err("size-max", `Each dimension must be ≤ ${AOC_MAX_DIM} pixels.`),
      );
    }
    const pixels = width * height;
    if (pixels > AOC_IMPORT_PIXEL_CAP) {
      errors.push(
        err(
          "size-cap",
          `Map is ${pixels} pixels; Ages of Conflict refuses imports above ${AOC_IMPORT_PIXEL_CAP}.`,
        ),
      );
    } else if (pixels > AOC_WARN_PIXELS) {
      warnings.push(
        warn(
          "size-perf",
          `Map is ${pixels} pixels. The game warns above ${AOC_WARN_PIXELS}; mobile may stutter.`,
        ),
      );
    }
  }

  if (typeof file.startingYear !== "number" || !Number.isFinite(file.startingYear)) {
    errors.push(err("year", "startingYear must be a number."));
  }
  if (
    typeof file.startingMonth !== "number" ||
    !Number.isInteger(file.startingMonth) ||
    file.startingMonth < 0 ||
    file.startingMonth > 11
  ) {
    errors.push(err("month", "startingMonth must be an integer 0–11."));
  }
  if (typeof file.currentGameTime !== "number") {
    errors.push(err("time", "currentGameTime must be a number (0 for a new scenario)."));
  }

  if (!file.achData || typeof file.achData !== "object") {
    errors.push(err("ach", "Missing achData block."));
  } else if (typeof file.achData.starters !== "number") {
    errors.push(err("ach-starters", "achData.starters must be a number."));
  }

  if (!Array.isArray(file.nations) || file.nations.length < 1) {
    errors.push(err("nations", "Scenario needs at least one nation."));
  }

  const terrainRle = pickRle(file.terrain2, file.terrain);
  const ownerRle = pickRle(file.owner2, file.owner);
  const occRle = pickRle(file.occupations);
  const extra = file as AocFile & { cores?: AocRle };
  const rightfulRle = pickRle(file.rightful, extra.cores, ownerRle);

  if (!terrainRle) {
    errors.push(
      err(
        "rle-terrain",
        "Missing terrain2 (or terrain) run-length block. Required for v4.0+ / mobile.",
      ),
    );
  }
  if (!ownerRle) {
    errors.push(
      err(
        "rle-owner",
        "Missing owner2 (or owner) run-length block. Required for v4.0+ / mobile.",
      ),
    );
  }
  if (!occRle) {
    errors.push(
      err(
        "rle-occupations",
        "Missing occupations run-length block (amounts + values). Required for v4.0+ / mobile.",
      ),
    );
  }

  if (!Array.isArray(file.cities)) errors.push(err("cities", "cities must be an array."));
  if (!Array.isArray(file.alliances))
    errors.push(err("alliances", "alliances must be an array."));
  if (!Array.isArray(file.wars)) errors.push(err("wars", "wars must be an array."));
  if (!Array.isArray(file.history)) errors.push(err("history", "history must be an array."));

  if (!terrainRle || !ownerRle || !occRle || errors.some((e) => e.code.startsWith("size"))) {
    return { ok: false, errors, warnings };
  }

  const pixels = width * height;
  const layers: Array<{ key: string; rle: AocRle }> = [
    { key: "terrain", rle: terrainRle },
    { key: "owner", rle: ownerRle },
    { key: "occupations", rle: occRle },
  ];
  if (rightfulRle) layers.push({ key: "rightful", rle: rightfulRle });

  let terrain: number[] | null = null;
  let owner: number[] | null = null;
  let rightful: number[] | null = null;
  let occupations: number[] | null = null;

  for (const layer of layers) {
    const { key, rle } = layer;
    if (rle.amounts.length !== rle.values.length) {
      errors.push(
        err(
          `rle-pair-${key}`,
          `${key}: amounts (${rle.amounts.length}) and values (${rle.values.length}) must match.`,
        ),
      );
      continue;
    }
    const count = rlePixelCount(rle);
    if (count !== pixels) {
      errors.push(
        err(
          `rle-count-${key}`,
          `${key} covers ${count} pixels but the map is ${width}×${height} = ${pixels}.`,
        ),
      );
      continue;
    }
    try {
      const decoded = decodeRle(rle, pixels);
      if (key === "terrain") terrain = decoded;
      if (key === "owner") owner = decoded;
      if (key === "rightful") rightful = decoded;
      if (key === "occupations") occupations = decoded;
    } catch (e) {
      errors.push(err(`rle-decode-${key}`, `${key}: ${(e as Error).message}`));
    }
  }

  const nations = Array.isArray(file.nations) ? file.nations : [];
  const ids = new Set<number>();
  const byId = new Map<number, (typeof nations)[number]>();

  for (const [i, n] of nations.entries()) {
    if (!n || typeof n !== "object") {
      errors.push(err("nation-obj", `Nation at index ${i} is not an object.`));
      continue;
    }
    if (!Number.isInteger(n.id) || n.id < 1) {
      errors.push(err("nation-id", `Nation "${n.name ?? i}" must have integer id ≥ 1 (0 is unclaimed).`));
      continue;
    }
    if (ids.has(n.id)) {
      errors.push(err("nation-dup", `Duplicate nation id ${n.id}.`));
    }
    ids.add(n.id);
    byId.set(n.id, n);
    if (typeof n.name !== "string" || !n.name.trim()) {
      errors.push(err("nation-name", `Nation id ${n.id} has no name.`));
    }
    if (typeof n.destroyed !== "boolean") {
      errors.push(err("nation-destroyed", `Nation ${n.id} missing destroyed boolean.`));
    }
    if (!isColor(n.color)) {
      errors.push(err("nation-color", `Nation ${n.id} color must be {r,g,b,a} floats 0–1.`));
    }
    if (!isPos(n.pos, width, height) || !isPos(n.originalPos, width, height)) {
      errors.push(
        err(
          "nation-capital",
          `Nation ${n.id} capital pos/originalPos must be integer pixels inside the map.`,
        ),
      );
    }
    for (const field of [
      "gold",
      "flagId",
      "startYear",
      "endYear",
      "killerId",
      "originId",
      "combatEfficiency",
      "maxArea",
      "stress",
      "totalWars",
      "liegeId",
      "puppetIntegration",
    ] as const) {
      if (typeof n[field] !== "number") {
        errors.push(err("nation-field", `Nation ${n.id} missing numeric field ${field}.`));
      }
    }
    if (typeof n.ceLock !== "boolean" || typeof n.aiDisabled !== "boolean" || typeof n.isUnion !== "boolean") {
      errors.push(err("nation-flags", `Nation ${n.id} is missing ceLock/aiDisabled/isUnion booleans.`));
    }
    if (!Array.isArray(n.revoltIds) || !Array.isArray(n.killedIds) || !Array.isArray(n.puppetIds) || !Array.isArray(n.lives)) {
      errors.push(err("nation-arrays", `Nation ${n.id} is missing revoltIds/killedIds/puppetIds/lives arrays.`));
    }
  }

  if (owner && terrain) {
    const area = new Map<number, number>();
    for (let i = 0; i < owner.length; i++) {
      const o = owner[i] | 0;
      const t = terrain[i] | 0;
      if (t < 0 || t > 8) {
        errors.push(err("terrain-id", `Unknown terrain id ${t} at pixel ${i}.`));
        break;
      }
      if (o < 0) {
        errors.push(err("owner-neg", "Owner ids cannot be negative."));
        break;
      }
      if (o !== 0 && !ids.has(o)) {
        errors.push(err("owner-unknown", `Pixel owned by unknown nation id ${o}.`));
        break;
      }
      if (t === 0 && o !== 0) {
        errors.push(
          err("owner-water", `Water pixel is owned by nation ${o}. Water must stay unclaimed (0).`),
        );
        break;
      }
      if (o !== 0) area.set(o, (area.get(o) ?? 0) + 1);
    }
    for (const id of ids) {
      const n = byId.get(id);
      if (!n) continue;
      const a = area.get(id) ?? 0;
      if (!n.destroyed && a < 1) {
        errors.push(err("nation-land", `Living nation ${id} (${n.name}) has no land pixels.`));
      }
      if (Number.isInteger(n.maxArea) && n.maxArea < a) {
        warnings.push(
          warn("max-area", `Nation ${id} maxArea (${n.maxArea}) is below current area (${a}).`),
        );
      }
      if (n.pos && isPos(n.pos, width, height) && !n.destroyed) {
        const idx = n.pos.y * width + n.pos.x;
        if (owner[idx] !== id) {
          errors.push(
            err(
              "capital-owner",
              `Capital of ${n.name} (${id}) at ${n.pos.x},${n.pos.y} is not on that nation's land.`,
            ),
          );
        }
        if (terrain[idx] === 0) {
          errors.push(err("capital-water", `Capital of ${n.name} sits on water.`));
        }
      }
    }
  }

  if (rightful && owner) {
    for (let i = 0; i < rightful.length; i++) {
      const c = rightful[i] | 0;
      if (c !== 0 && !ids.has(c)) {
        errors.push(err("core-unknown", `Core/rightful pixel references unknown nation ${c}.`));
        break;
      }
    }
  }

  if (occupations) {
    for (const v of occupations) {
      if ((v | 0) !== 0 && !ids.has(v | 0)) {
        errors.push(err("occ-unknown", `Occupation references unknown nation ${v}.`));
        break;
      }
    }
  }

  const cities = Array.isArray(file.cities) ? file.cities : [];
  for (const [i, c] of cities.entries()) {
    if (!c || typeof c !== "object") {
      errors.push(err("city-obj", `City ${i} is not an object.`));
      continue;
    }
    if (!Number.isInteger(c.x) || !Number.isInteger(c.y) || c.x < 0 || c.y < 0 || c.x >= width || c.y >= height) {
      errors.push(err("city-pos", `City ${c.n ?? i} coordinates are outside the map.`));
      continue;
    }
    if (typeof c.n !== "string" || !c.n.trim()) {
      errors.push(err("city-name", `City at ${c.x},${c.y} has no name.`));
    }
    if (!Number.isInteger(c.r) || (c.r !== 0 && !ids.has(c.r))) {
      errors.push(err("city-owner", `City ${c.n ?? i} rightful owner r=${c.r} is not a nation id.`));
    }
    if (typeof c.rp !== "number") {
      errors.push(err("city-rp", `City ${c.n ?? i} missing revolt chance rp.`));
    }
    if (terrain) {
      const idx = c.y * width + c.x;
      if (terrain[idx] === 0) {
        errors.push(err("city-water", `City ${c.n} is on water.`));
      }
    }
  }

  const alliances = Array.isArray(file.alliances) ? file.alliances : [];
  for (const [i, a] of alliances.entries()) {
    if (!a || typeof a !== "object") {
      errors.push(err("ally-obj", `Alliance ${i} is not an object.`));
      continue;
    }
    if (typeof a.name !== "string" || !a.name.trim()) {
      errors.push(err("ally-name", `Alliance ${i} has no name.`));
    }
    if (!Array.isArray(a.ids) || a.ids.length < 2) {
      errors.push(err("ally-ids", `Alliance ${a.name ?? i} needs at least two member ids.`));
    } else {
      for (const id of a.ids) {
        if (!ids.has(id)) errors.push(err("ally-member", `Alliance ${a.name} references missing nation ${id}.`));
      }
    }
    const unified = typeof a.inUnion === "boolean" ? a.inUnion : a.unified;
    if (typeof unified !== "boolean" || typeof a.unity !== "number" || typeof a.ne !== "boolean") {
      errors.push(err("ally-fields", `Alliance ${a.name ?? i} missing inUnion/unity/ne.`));
    }
  }

  const wars = Array.isArray(file.wars) ? file.wars : [];
  for (const [i, w] of wars.entries()) {
    if (!w || typeof w !== "object") {
      errors.push(err("war-obj", `War ${i} is not an object.`));
      continue;
    }
    if (!("dIntiArea" in w)) {
      errors.push(
        err(
          "war-typo",
          `War ${i} is missing dIntiArea (the real game key — not dInitArea).`,
        ),
      );
    }
    const sides = [...(w.attackers ?? []), ...(w.defenders ?? [])];
    if (!Array.isArray(w.attackers) || !Array.isArray(w.defenders) || w.attackers.length < 1 || w.defenders.length < 1) {
      errors.push(err("war-sides", `War ${i} needs attackers and defenders arrays.`));
    }
    for (const id of sides) {
      if (!ids.has(id)) errors.push(err("war-nation", `War ${i} references missing nation ${id}.`));
    }
  }

  if (file.achData && Array.isArray(file.nations) && file.achData.starters !== file.nations.length) {
    warnings.push(
      warn(
        "starters",
        `achData.starters is ${file.achData.starters} but there are ${file.nations.length} nations.`,
      ),
    );
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function parseAndValidate(text: string): { file?: AocFile; result: ValidationResult } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return {
      result: {
        ok: false,
        errors: [err("json", `Not valid JSON: ${(e as Error).message}`)],
        warnings: [],
      },
    };
  }
  const result = validateAoc(parsed);
  return { file: result.ok ? (parsed as AocFile) : (parsed as AocFile), result };
}
