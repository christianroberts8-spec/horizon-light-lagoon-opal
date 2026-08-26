import {
  AOC_VERSION,
  type AocAlliance,
  type AocCity,
  type AocColor,
  type AocFile,
  type AocNation,
  type AocNationLife,
  type AocWar,
} from "./types.ts";
import { canvasToAocOrder, encodeRle } from "./rle.ts";

export type EditorNation = {
  id: number;
  name: string;
  color: AocColor;
  gold: number;
  combatEfficiency: number;
  ceLock: boolean;
  aiDisabled: boolean;
  flagId: number;
  capital: { x: number; y: number };
  originalCapital: { x: number; y: number };
  liegeId: number;
  puppetIds: number[];
  puppetIntegration: number;
  puppetRank: number;
  puppetLoyalty: number;
  isUnion: boolean;
  stress: number;
  destroyed: boolean;
  originId: number;
  startYear: number;
  endYear: number;
  killerId: number;
  revoltIds: number[];
  killedIds: number[];
  lives: AocNationLife[];
  maxArea: number;
  totalWars: number;
  storedBns: number;
  customBns: number;
  tempBns: number[];
};

export type EditorCity = {
  x: number;
  y: number;
  n: string;
  r: number;
  rp: number;
};

export type EditorStateSlice = {
  scenarioName: string;
  startingYear: number;
  startingMonth: number;
  width: number;
  height: number;
  terrain: ArrayLike<number>;
  owner: ArrayLike<number>;
  rightful: ArrayLike<number>;
  occupations: ArrayLike<number>;
  nations: EditorNation[];
  cities: EditorCity[];
  alliances: AocAlliance[];
  wars: AocWar[];
};

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function int(n: number) {
  return Math.round(Number(n) || 0);
}

function color(c: AocColor): AocColor {
  return { r: clamp01(c.r), g: clamp01(c.g), b: clamp01(c.b), a: clamp01(c.a ?? 1) };
}

function areaByNation(owner: ArrayLike<number>) {
  const area = new Map<number, number>();
  for (let i = 0; i < owner.length; i++) {
    const id = owner[i] | 0;
    if (id > 0) area.set(id, (area.get(id) ?? 0) + 1);
  }
  return area;
}

export function defaultNation(id: number, colorOverride?: AocColor): EditorNation {
  const hue = (id * 47) % 360;
  const c = colorOverride ?? {
    r: 0.35 + Math.cos((hue * Math.PI) / 180) * 0.25,
    g: 0.35 + Math.cos(((hue + 120) * Math.PI) / 180) * 0.25,
    b: 0.35 + Math.cos(((hue + 240) * Math.PI) / 180) * 0.25,
    a: 1,
  };
  return {
    id,
    name: `Nation ${id}`,
    color: c,
    gold: 80,
    combatEfficiency: 5,
    ceLock: false,
    aiDisabled: false,
    flagId: id,
    capital: { x: 0, y: 0 },
    originalCapital: { x: 0, y: 0 },
    liegeId: 0,
    puppetIds: [],
    puppetIntegration: 0,
    puppetRank: 30,
    puppetLoyalty: 50,
    isUnion: false,
    stress: 0,
    destroyed: false,
    originId: 0,
    startYear: 0,
    endYear: 0,
    killerId: 0,
    revoltIds: [],
    killedIds: [],
    lives: [],
    maxArea: 0,
    totalWars: 0,
    storedBns: 50,
    customBns: 0,
    tempBns: [],
  };
}

/**
 * Build a genuine v4.5.0 Ages of Conflict scenario object.
 * Map buffers are top-origin (canvas); encoding flips them to the game's
 * bottom-origin RLE order. Official files store RLE in terrain2/owner2.
 */
export function buildAocFile(state: EditorStateSlice): AocFile {
  const { width, height } = state;
  const terrain = canvasToAocOrder(state.terrain, width, height);
  const owner = canvasToAocOrder(state.owner, width, height);
  const rightful = canvasToAocOrder(state.rightful, width, height);
  const occupations = canvasToAocOrder(state.occupations, width, height);

  // Water may never be owned — force 0 so the file cannot fail in-game.
  for (let i = 0; i < terrain.length; i++) {
    if (terrain[i] === 0) {
      owner[i] = 0;
      rightful[i] = 0;
      occupations[i] = 0;
    }
  }

  const area = areaByNation(owner);

  const nations: AocNation[] = [...state.nations]
    .sort((a, b) => a.id - b.id)
    .map((n) => {
      const cap = {
        x: int(Math.min(width - 1, Math.max(0, n.capital.x))),
        y: int(Math.min(height - 1, Math.max(0, n.capital.y))),
      };
      const orig = n.originalCapital ?? n.capital;
      const origCap = {
        x: int(Math.min(width - 1, Math.max(0, orig.x))),
        y: int(Math.min(height - 1, Math.max(0, orig.y))),
      };
      const filePos = { x: cap.x, y: height - 1 - cap.y };
      const fileOrig = { x: origCap.x, y: height - 1 - origCap.y };
      const land = area.get(n.id) ?? 0;
      const maxArea = Math.max(land, int(n.maxArea), n.destroyed ? 0 : 1);
      return {
        id: int(n.id),
        name: String(n.name || `Nation ${n.id}`).slice(0, 40),
        destroyed: Boolean(n.destroyed),
        pos: filePos,
        originalPos: fileOrig,
        gold: int(n.gold),
        flagId: int(n.flagId) || int(n.id),
        color: color(n.color),
        startYear: Number(n.startYear) || 0,
        endYear: Number.isFinite(Number(n.endYear)) ? Number(n.endYear) : 0,
        killerId: int(n.killerId),
        originId: int(n.originId),
        revoltIds: (n.revoltIds ?? []).map(int),
        killedIds: (n.killedIds ?? []).map(int),
        combatEfficiency: int(n.combatEfficiency),
        ceLock: Boolean(n.ceLock),
        maxArea,
        aiDisabled: Boolean(n.aiDisabled),
        stress: int(n.stress),
        totalWars: int(n.totalWars),
        lives: Array.isArray(n.lives) ? n.lives.map((l) => ({ ...l })) : [],
        liegeId: int(n.liegeId),
        puppetIds: (n.puppetIds ?? []).map(int).filter((id) => id > 0),
        puppetIntegration: int(n.puppetIntegration),
        puppetRank: int(n.puppetRank ?? 30),
        puppetLoyalty: int(n.puppetLoyalty ?? 50),
        isUnion: Boolean(n.isUnion),
        storedBns: int(n.storedBns ?? 50),
        customBns: int(n.customBns ?? 0),
        tempBns: Array.isArray(n.tempBns) ? n.tempBns.map(int) : [],
      };
    });

  const cities: AocCity[] = state.cities.map((c) => ({
    x: int(c.x),
    y: int(height - 1 - c.y),
    n: String(c.n || "City").slice(0, 32),
    r: int(c.r),
    rp: int(c.rp),
  }));

  const alliances: AocAlliance[] = state.alliances.map((a) => {
    const inUnion = Boolean(a.inUnion ?? a.unified ?? false);
    return {
      name: String(a.name || "Alliance").slice(0, 40),
      color: color(a.color ?? { r: 0.3, g: 0.3, b: 0.3, a: 1 }),
      ids: a.ids.map(int),
      inUnion,
      unity: Number.isFinite(a.unity) ? a.unity : 0,
      ne: Boolean(a.ne),
      ce: Boolean(a.ce),
    };
  });

  const wars: AocWar[] = state.wars.map((w) => ({
    attackers: w.attackers.map(int),
    attackersLeft: (w.attackersLeft ?? w.attackers).map(int),
    defenders: w.defenders.map(int),
    defendersLeft: (w.defendersLeft ?? w.defenders).map(int),
    targetLength: Number(w.targetLength) || 36,
    startTime: Number(w.startTime) || 0,
    aInitArea: int(w.aInitArea),
    dIntiArea: int(w.dIntiArea),
  }));

  const terrainRle = encodeRle(terrain);
  const ownerRle = encodeRle(owner);
  const occRle = encodeRle(occupations);
  const rightfulRle = encodeRle(rightful);

  // Official v4.5.0 key order: empty terrain/owner + RLE in *2.
  const file: AocFile = {
    version: AOC_VERSION,
    width: int(width),
    height: int(height),
    startingYear: int(state.startingYear),
    startingMonth: int(state.startingMonth),
    currentGameTime: 0,
    achData: {
      ironMan: false,
      smallIds: [],
      starters: nations.length,
    },
    nations,
    cities,
    alliances,
    wars,
    terrain: [],
    terrain2: terrainRle,
    owner: [],
    owner2: ownerRle,
    occupations: occRle,
    rightful: rightfulRle,
    history: [],
  };

  return file;
}

export function serializeAoc(file: AocFile): string {
  return JSON.stringify(file);
}
