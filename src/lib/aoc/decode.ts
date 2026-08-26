import { encodeRle, aocOrderToCanvas, decodeRle, pickRle } from "./rle.ts";
import type { AocAlliance, AocColor, AocFile, AocRle } from "./types.ts";
import type { EditorCity, EditorNation, EditorStateSlice } from "./encode.ts";
import { validateAoc } from "./validate.ts";

function zeros(n: number): AocRle {
  return encodeRle(new Uint16Array(n));
}

const DEFAULT_COLOR: AocColor = { r: 0.3, g: 0.3, b: 0.3, a: 1 };

function asColor(v: unknown): AocColor {
  if (!v || typeof v !== "object") return { ...DEFAULT_COLOR };
  const c = v as Partial<AocColor>;
  return {
    r: Number(c.r) || 0,
    g: Number(c.g) || 0,
    b: Number(c.b) || 0,
    a: Number.isFinite(Number(c.a)) ? Number(c.a) : 1,
  };
}

function normalizeAlliance(raw: unknown): AocAlliance {
  const a = (raw && typeof raw === "object" ? raw : {}) as Partial<AocAlliance> & {
    unified?: boolean;
  };
  const inUnion = Boolean(a.inUnion ?? a.unified ?? false);
  return {
    name: String(a.name ?? "Alliance"),
    color: asColor(a.color),
    ids: Array.isArray(a.ids) ? a.ids.map(Number) : [],
    inUnion,
    unified: inUnion,
    unity: Number.isFinite(Number(a.unity)) ? Number(a.unity) : 0,
    ne: Boolean(a.ne ?? true),
    ce: Boolean(a.ce ?? false),
  };
}

/** Fill fields older community files omit so they can be edited and re-exported. */
export function normalizeAoc(raw: unknown): AocFile {
  if (!raw || typeof raw !== "object") throw new Error("Not an object.");
  const f = raw as Partial<AocFile> & { cores?: AocRle };
  const width = Number(f.width);
  const height = Number(f.height);
  const pixels = width * height;
  const terrain = pickRle(f.terrain2, f.terrain) ?? zeros(Number.isFinite(pixels) ? pixels : 0);
  const owner = pickRle(f.owner2, f.owner) ?? zeros(Number.isFinite(pixels) ? pixels : 0);
  const rightful = pickRle(f.rightful, f.cores, owner) ?? owner;
  const occupations =
    pickRle(f.occupations) ?? (Number.isFinite(pixels) ? zeros(pixels) : { amounts: [], values: [] });
  return {
    version: String(f.version ?? "4.5.0"),
    width,
    height,
    startingYear: Number(f.startingYear ?? 1),
    startingMonth: Number(f.startingMonth ?? 0),
    currentGameTime: Number(f.currentGameTime ?? 0),
    achData: f.achData ?? {
      ironMan: false,
      smallIds: [],
      starters: Array.isArray(f.nations) ? f.nations.length : 0,
    },
    nations: Array.isArray(f.nations) ? f.nations : [],
    cities: Array.isArray(f.cities) ? f.cities : [],
    alliances: Array.isArray(f.alliances) ? f.alliances.map(normalizeAlliance) : [],
    wars: Array.isArray(f.wars) ? f.wars : [],
    terrain: [],
    terrain2: terrain,
    owner: [],
    owner2: owner,
    occupations,
    rightful,
    history: Array.isArray(f.history) ? f.history : [],
  };
}

export type DecodedScenario = Omit<
  EditorStateSlice,
  "terrain" | "owner" | "rightful" | "occupations"
> & {
  terrain: Uint8Array;
  owner: Uint16Array;
  rightful: Uint16Array;
  occupations: Uint16Array;
};

export function decodeAocFile(file: AocFile, opts?: { skipValidate?: boolean }): DecodedScenario {
  if (!opts?.skipValidate) {
    const result = validateAoc(file);
    if (!result.ok) {
      const first = result.errors[0]?.message ?? "Invalid .aoc file";
      throw new Error(first);
    }
  }
  const { width, height } = file;
  const pixels = width * height;
  const terrainRle = pickRle(file.terrain2, file.terrain);
  const ownerRle = pickRle(file.owner2, file.owner);
  const rightfulRle = pickRle(file.rightful, ownerRle);
  const occRle = pickRle(file.occupations) ?? zeros(pixels);
  if (!terrainRle || !ownerRle) {
    throw new Error("Scenario is missing terrain/owner map data.");
  }

  const terrainAoc = decodeRle(terrainRle, pixels);
  const ownerAoc = decodeRle(ownerRle, pixels);
  const rightfulAoc = decodeRle(rightfulRle ?? ownerRle, pixels);
  const occAoc = decodeRle(occRle, pixels);

  const terrain = Uint8Array.from(aocOrderToCanvas(terrainAoc, width, height));
  const owner = Uint16Array.from(aocOrderToCanvas(ownerAoc, width, height));
  const rightful = Uint16Array.from(aocOrderToCanvas(rightfulAoc, width, height));
  const occupations = Uint16Array.from(aocOrderToCanvas(occAoc, width, height));

  const nations: EditorNation[] = file.nations.map((n) => ({
    id: n.id,
    name: n.name,
    color: asColor(n.color),
    gold: n.gold,
    combatEfficiency: n.combatEfficiency,
    ceLock: Boolean(n.ceLock),
    aiDisabled: Boolean(n.aiDisabled),
    flagId: n.flagId ?? 0,
    capital: { x: n.pos.x, y: height - 1 - n.pos.y },
    originalCapital: {
      x: n.originalPos?.x ?? n.pos.x,
      y: height - 1 - (n.originalPos?.y ?? n.pos.y),
    },
    liegeId: n.liegeId ?? 0,
    puppetIds: Array.isArray(n.puppetIds) ? [...n.puppetIds] : [],
    puppetIntegration: n.puppetIntegration ?? 0,
    puppetRank: n.puppetRank ?? 30,
    puppetLoyalty: n.puppetLoyalty ?? 50,
    isUnion: Boolean(n.isUnion),
    stress: n.stress ?? 0,
    destroyed: Boolean(n.destroyed),
    originId: n.originId ?? 0,
    startYear: n.startYear ?? 0,
    endYear: n.endYear ?? 0,
    killerId: n.killerId ?? 0,
    revoltIds: Array.isArray(n.revoltIds) ? [...n.revoltIds] : [],
    killedIds: Array.isArray(n.killedIds) ? [...n.killedIds] : [],
    lives: Array.isArray(n.lives) ? n.lives.map((l) => ({ ...l })) : [],
    maxArea: n.maxArea ?? 0,
    totalWars: n.totalWars ?? 0,
    storedBns: n.storedBns ?? 50,
    customBns: n.customBns ?? 0,
    tempBns: Array.isArray(n.tempBns) ? [...n.tempBns] : [],
  }));

  const cities: EditorCity[] = file.cities.map((c) => ({
    x: c.x,
    y: height - 1 - c.y,
    n: c.n,
    r: c.r,
    rp: c.rp,
  }));

  return {
    scenarioName: "Imported",
    startingYear: file.startingYear,
    startingMonth: file.startingMonth,
    width,
    height,
    terrain,
    owner,
    rightful,
    occupations,
    nations,
    cities,
    alliances: file.alliances.map(normalizeAlliance),
    wars: file.wars.map((w) => ({
      ...w,
      attackers: [...w.attackers],
      attackersLeft: [...w.attackersLeft],
      defenders: [...w.defenders],
      defendersLeft: [...w.defendersLeft],
    })),
  };
}
