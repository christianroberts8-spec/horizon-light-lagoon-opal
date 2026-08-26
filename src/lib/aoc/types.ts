/** Ages of Conflict: World War Simulator — current mobile version. */
export const AOC_VERSION = "4.5.0";

/** In-game map editor overall cap is ~360k px; imported files may go higher. */
export const AOC_EDITOR_PIXEL_CAP = 360_000;
export const AOC_WARN_PIXELS = 500_000;
export const AOC_IMPORT_PIXEL_CAP = 4_000_000;
export const AOC_MIN_SIZE = 16;
export const AOC_MAX_DIM = 2048;

/** Terrain IDs from the official save-file documentation (v4.0+). */
export const TERRAIN = {
  water: 0,
  plains: 1,
  crossing: 2,
  hills: 3,
  desert: 4,
  mountains: 5,
  forest: 6,
  tundra: 7,
  grasslands: 8,
} as const;

export type TerrainId = (typeof TERRAIN)[keyof typeof TERRAIN];

/** Hex codes the game uses in map images (wiki Save File). */
export const TERRAIN_HEX: Record<number, string> = {
  0: "#FFFFFF",
  1: "#000000",
  2: "#CCCCCC",
  3: "#333333",
  4: "#666666",
  5: "#999999",
  6: "#1F1F1F",
  7: "#808080",
  8: "#4C4C4C",
};

export const TERRAIN_LABEL: Record<number, string> = {
  0: "Water",
  1: "Plains",
  2: "Crossing",
  3: "Hills",
  4: "Desert",
  5: "Mountains",
  6: "Forest",
  7: "Tundra",
  8: "Grasslands",
};

export type AocColor = { r: number; g: number; b: number; a: number };
export type AocPos = { x: number; y: number };

export type AocRle = {
  amounts: number[];
  values: number[];
};

/** Official v4.5 files leave terrain/owner as [] and put the RLE in *2. */
export type AocMapLayer = AocRle | number[];

export type AocNationLife = { s: number; e: number; o: number; k: number };

export type AocNation = {
  id: number;
  name: string;
  destroyed: boolean;
  pos: AocPos;
  originalPos: AocPos;
  gold: number;
  flagId: number;
  color: AocColor;
  startYear: number;
  endYear: number;
  killerId: number;
  originId: number;
  revoltIds: number[];
  killedIds: number[];
  combatEfficiency: number;
  ceLock: boolean;
  maxArea: number;
  aiDisabled: boolean;
  stress: number;
  totalWars: number;
  lives: AocNationLife[];
  liegeId: number;
  puppetIds: number[];
  puppetIntegration: number;
  puppetRank: number;
  puppetLoyalty: number;
  isUnion: boolean;
  storedBns: number;
  customBns: number;
  tempBns: number[];
};

export type AocCity = {
  x: number;
  y: number;
  n: string;
  r: number;
  rp: number;
};

export type AocAlliance = {
  name: string;
  color: AocColor;
  ids: number[];
  /** Official v4.5.0 key. */
  inUnion: boolean;
  /** Legacy key some community files still use. */
  unified?: boolean;
  unity: number;
  ne: boolean;
  ce: boolean;
};

/**
 * War block. `dIntiArea` is the real key (typo) used by the game — do not
 * “fix” it to dInitArea or mobile will drop defender area.
 */
export type AocWar = {
  attackers: number[];
  attackersLeft: number[];
  defenders: number[];
  defendersLeft: number[];
  targetLength: number;
  startTime: number;
  aInitArea: number;
  dIntiArea: number;
};

export type AocAchData = {
  ironMan: boolean;
  smallIds: number[];
  starters: number;
};

export type AocHistoryEntry = {
  type: number;
  strings: string[];
  time: number;
};

/**
 * Canonical v4.5.0 scenario object.
 *
 * Map arrays are run-length encoded since 4.0.0, read left→right, bottom→top.
 * Current official files keep `terrain`/`owner` as empty arrays and store the
 * real RLE in `terrain2`/`owner2`. `rightful` is the v4.4 cores layer — optional.
 */
export type AocFile = {
  version: string;
  width: number;
  height: number;
  startingYear: number;
  startingMonth: number;
  currentGameTime: number;
  achData: AocAchData;
  nations: AocNation[];
  cities: AocCity[];
  alliances: AocAlliance[];
  wars: AocWar[];
  terrain: AocMapLayer;
  terrain2?: AocRle;
  owner: AocMapLayer;
  owner2?: AocRle;
  occupations: AocRle;
  rightful?: AocRle;
  history: AocHistoryEntry[];
};

export type ValidationIssue = {
  level: "error" | "warning";
  code: string;
  message: string;
};

export type ValidationResult = {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};
