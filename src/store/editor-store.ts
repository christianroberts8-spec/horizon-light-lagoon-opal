import { create } from "zustand";
import type { AocAlliance, AocWar, ValidationResult } from "@/lib/aoc/types";
import { TERRAIN } from "@/lib/aoc/types";
import { buildAocFile, defaultNation, serializeAoc, type EditorCity, type EditorNation } from "@/lib/aoc/encode";
import { validateAoc } from "@/lib/aoc/validate";
import { templateById, type TemplateId } from "@/data/templates";
import {
  loadOfficialScenario,
  loadScenarioFlags,
  parseAocText,
  parseScenarioZip,
  stripToBlankEarth,
  type ScenarioBundle,
} from "@/lib/aoc/scenario-io";
import { repairForExport } from "@/lib/aoc/repair";
import {
  bordersFromImage,
  nationsFromColors,
  readImageFile,
  terrainFromImage,
} from "@/lib/map/png";

export type Tool =
  | "paint"
  | "cores"
  | "terrain"
  | "fill"
  | "erase"
  | "capital"
  | "city"
  | "eyedropper"
  | "pan";

export type ViewMode = "political" | "cores" | "terrain";

type Snapshot = {
  terrain: Uint8Array;
  owner: Uint16Array;
  rightful: Uint16Array;
  occupations: Uint16Array;
  nations: EditorNation[];
  cities: EditorCity[];
  alliances: AocAlliance[];
  wars: AocWar[];
};

export type EditorStore = {
  ready: boolean;
  loading: boolean;
  loadError: string | null;
  scenarioName: string;
  startingYear: number;
  startingMonth: number;
  width: number;
  height: number;
  terrain: Uint8Array;
  owner: Uint16Array;
  rightful: Uint16Array;
  occupations: Uint16Array;
  nations: EditorNation[];
  cities: EditorCity[];
  alliances: AocAlliance[];
  wars: AocWar[];
  selectedNationId: number | null;
  tool: Tool;
  viewMode: ViewMode;
  terrainBrush: number;
  brush: number;
  mapVersion: number;
  hover: { x: number; y: number } | null;
  validation: ValidationResult | null;
  status: string;
  undoStack: Snapshot[];
  redoStack: Snapshot[];
  flagsPng: Uint8Array | null;
  flagNamesText: string | null;
  loadTemplate: (id: TemplateId) => Promise<void>;
  cancelLoad: () => void;
  importAocText: (text: string, name?: string) => void;
  importScenarioFile: (file: File) => Promise<void>;
  importBorderPng: (file: File) => Promise<void>;
  importTerrainPng: (file: File) => Promise<void>;
  setTool: (t: Tool) => void;
  setView: (v: ViewMode) => void;
  setBrush: (n: number) => void;
  setTerrainBrush: (n: number) => void;
  setName: (n: string) => void;
  setYear: (y: number) => void;
  setMonth: (m: number) => void;
  selectNation: (id: number | null) => void;
  updateNation: (id: number, patch: Partial<EditorNation>) => void;
  addNation: (color?: { r: number; g: number; b: number; a: number }) => number;
  deleteNation: (id: number) => void;
  setHover: (p: { x: number; y: number } | null) => void;
  paintAt: (x: number, y: number, dragging: boolean) => void;
  beginStroke: () => void;
  endStroke: () => void;
  undo: () => void;
  redo: () => void;
  addCityAt: (x: number, y: number, name?: string) => void;
  removeCity: (index: number) => void;
  addAlliance: (ids: number[], name: string) => void;
  removeAlliance: (index: number) => void;
  addWar: (attackers: number[], defenders: number[]) => void;
  removeWar: (index: number) => void;
  validateNow: () => ValidationResult;
  buildValidatedJson: () => { json: string; result: ValidationResult };
};

const empty = (w: number, h: number) => ({
  terrain: new Uint8Array(w * h),
  owner: new Uint16Array(w * h),
  rightful: new Uint16Array(w * h),
  occupations: new Uint16Array(w * h),
});

function cloneNations(n: EditorNation[]): EditorNation[] {
  return n.map((x) => ({
    ...x,
    color: { ...x.color },
    capital: { ...x.capital },
    originalCapital: { ...x.originalCapital },
    puppetIds: [...x.puppetIds],
    revoltIds: [...x.revoltIds],
    killedIds: [...x.killedIds],
    lives: x.lives.map((l) => ({ ...l })),
    tempBns: [...x.tempBns],
  }));
}

function snap(s: EditorStore): Snapshot {
  return {
    terrain: new Uint8Array(s.terrain),
    owner: new Uint16Array(s.owner),
    rightful: new Uint16Array(s.rightful),
    occupations: new Uint16Array(s.occupations),
    nations: cloneNations(s.nations),
    cities: s.cities.map((c) => ({ ...c })),
    alliances: s.alliances.map((a) => ({ ...a, ids: [...a.ids] })),
    wars: s.wars.map((w) => ({
      ...w,
      attackers: [...w.attackers],
      attackersLeft: [...w.attackersLeft],
      defenders: [...w.defenders],
      defendersLeft: [...w.defendersLeft],
    })),
  };
}

function applySnap(s: Snapshot) {
  return {
    terrain: s.terrain,
    owner: s.owner,
    rightful: s.rightful,
    occupations: s.occupations,
    nations: s.nations,
    cities: s.cities,
    alliances: s.alliances,
    wars: s.wars,
    mapVersion: Date.now(),
  };
}

function inMap(x: number, y: number, w: number, h: number) {
  return x >= 0 && y >= 0 && x < w && y < h;
}

function applyRepair(s: EditorStore): EditorStore {
  const { nations, cities } = repairForExport(s);
  return { ...s, nations, cities };
}

function applyBundle(bundle: ScenarioBundle) {
  const d = bundle.decoded;
  return {
    ready: true,
    loading: false,
    loadError: null,
    scenarioName: bundle.name || d.scenarioName,
    startingYear: d.startingYear,
    startingMonth: d.startingMonth,
    width: d.width,
    height: d.height,
    terrain: d.terrain,
    owner: d.owner,
    rightful: d.rightful,
    occupations: d.occupations,
    nations: d.nations,
    cities: d.cities,
    alliances: d.alliances,
    wars: d.wars,
    selectedNationId: d.nations.find((n) => !n.destroyed)?.id ?? d.nations[0]?.id ?? null,
    mapVersion: Date.now(),
    undoStack: [] as Snapshot[],
    redoStack: [] as Snapshot[],
    validation: bundle.validation,
    flagsPng: bundle.flagsPng,
    flagNamesText: bundle.flagNamesText,
    status: `${bundle.name || d.scenarioName} · ${d.nations.filter((n) => !n.destroyed).length} nations · ${d.width}×${d.height}`,
  };
}

function floodFill(
  buf: Uint16Array | Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  from: number,
  to: number,
) {
  if (from === to) return;
  const stack = [y * width + x];
  const seen = new Uint8Array(width * height);
  while (stack.length) {
    const i = stack.pop() as number;
    if (seen[i]) continue;
    seen[i] = 1;
    if (buf[i] !== from) continue;
    buf[i] = to;
    const px = i % width;
    const py = (i / width) | 0;
    if (px > 0) stack.push(i - 1);
    if (px + 1 < width) stack.push(i + 1);
    if (py > 0) stack.push(i - width);
    if (py + 1 < height) stack.push(i + width);
  }
}

let strokeOpen = false;
let loadGen = 0;

const tick = () => new Promise<void>((r) => window.setTimeout(r, 40));

export const useEditor = create<EditorStore>((set, get) => ({
  ready: false,
  loading: false,
  loadError: null,
  scenarioName: "World 2026",
  startingYear: 2026,
  startingMonth: 0,
  width: 640,
  height: 320,
  ...empty(640, 320),
  nations: [],
  cities: [],
  alliances: [],
  wars: [],
  selectedNationId: null,
  tool: "paint",
  viewMode: "political",
  terrainBrush: TERRAIN.plains,
  brush: 2,
  mapVersion: 1,
  hover: null,
  validation: null,
  status: "Pick a world map to begin.",
  undoStack: [],
  redoStack: [],
  flagsPng: null,
  flagNamesText: null,

  async loadTemplate(id) {
    const gen = ++loadGen;
    set({ loading: true, loadError: null, status: "Opening map…" });
    await tick();
    if (gen !== loadGen) return;
    try {
      const t = templateById(id);
      let bundle = await loadOfficialScenario(id, null, null, t.title);
      if (gen !== loadGen) return;
      if (t.stripNations) bundle = stripToBlankEarth(bundle);
      set({
        ...applyBundle(bundle),
        scenarioName: t.title,
        startingYear: t.year,
        startingMonth: t.month,
      });
      if (t.flagsUrl || t.flagNamesUrl) {
        void loadScenarioFlags(t.flagsUrl, t.flagNamesUrl).then((flags) => {
          if (gen !== loadGen) return;
          set(flags);
        });
      }
    } catch (e) {
      if (gen !== loadGen) return;
      set({
        loading: false,
        loadError: (e as Error).message || "Could not open that map.",
        status: "Could not load template.",
      });
    }
  },

  cancelLoad() {
    loadGen += 1;
    set({ loading: false, loadError: null, status: "Pick a world map to begin." });
  },

  importAocText(text, name) {
    try {
      const bundle = parseAocText(text, name);
      set(applyBundle(bundle));
    } catch (e) {
      set({
        status: (e as Error).message,
        loadError: (e as Error).message,
      });
    }
  },

  async importScenarioFile(file) {
    set({ loading: true, loadError: null, status: "Opening scenario…" });
    try {
      const lower = file.name.toLowerCase();
      const bundle = lower.endsWith(".zip")
        ? await parseScenarioZip(file)
        : parseAocText(await file.text(), file.name);
      set(applyBundle(bundle));
    } catch (e) {
      set({
        loading: false,
        loadError: (e as Error).message,
        status: "Could not open that file.",
      });
    }
  },

  async importBorderPng(file) {
    const img = await readImageFile(file);
    const { owner, colors, firstPixel } = bordersFromImage(img);
    const nations = nationsFromColors(colors, firstPixel);
    const s = get();
    const same = s.width === img.width && s.height === img.height;
    const terrain = same ? s.terrain : new Uint8Array(img.width * img.height).fill(TERRAIN.plains);
    if (!same) {
      for (let i = 0; i < owner.length; i++) {
        if (owner[i] === 0) terrain[i] = TERRAIN.water;
      }
    }
    set({
      ready: true,
      width: img.width,
      height: img.height,
      owner,
      rightful: new Uint16Array(owner),
      occupations: new Uint16Array(img.width * img.height),
      terrain,
      nations,
      cities: nations.map((n) => ({
        x: n.capital.x,
        y: n.capital.y,
        n: n.name,
        r: n.id,
        rp: 0,
      })),
      selectedNationId: nations[0]?.id ?? null,
      mapVersion: Date.now(),
      undoStack: [],
      redoStack: [],
      flagsPng: null,
      flagNamesText: null,
      status: `Imported borders · ${nations.length} nations · ${img.width}×${img.height}`,
    });
  },

  async importTerrainPng(file) {
    const img = await readImageFile(file);
    const terrain = terrainFromImage(img);
    const s = get();
    if (s.width !== img.width || s.height !== img.height) {
      throw new Error(
        `Terrain image is ${img.width}×${img.height} but the map is ${s.width}×${s.height}.`,
      );
    }
    const owner = new Uint16Array(s.owner);
    const rightful = new Uint16Array(s.rightful);
    for (let i = 0; i < terrain.length; i++) {
      if (terrain[i] === TERRAIN.water) {
        owner[i] = 0;
        rightful[i] = 0;
      }
    }
    set({
      terrain,
      owner,
      rightful,
      mapVersion: Date.now(),
      status: "Imported terrain layer.",
    });
  },

  setTool: (tool) => set({ tool }),
  setView: (viewMode) => set({ viewMode }),
  setBrush: (brush) => set({ brush }),
  setTerrainBrush: (terrainBrush) => set({ terrainBrush }),
  setName: (scenarioName) => set({ scenarioName }),
  setYear: (startingYear) => set({ startingYear }),
  setMonth: (startingMonth) => set({ startingMonth }),
  selectNation: (selectedNationId) => set({ selectedNationId }),
  setHover: (hover) => set({ hover }),

  updateNation(id, patch) {
    set((s) => ({
      nations: s.nations.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));
  },

  addNation(color) {
    const s = get();
    const id = (s.nations.reduce((m, n) => Math.max(m, n.id), 0) || 0) + 1;
    const nation = defaultNation(id, color);
    set({
      nations: [...s.nations, nation],
      selectedNationId: id,
      tool: "paint",
      status: `Paint land for ${nation.name}.`,
    });
    return id;
  },

  deleteNation(id) {
    const s = get();
    const owner = new Uint16Array(s.owner);
    const rightful = new Uint16Array(s.rightful);
    for (let i = 0; i < owner.length; i++) {
      if (owner[i] === id) owner[i] = 0;
      if (rightful[i] === id) rightful[i] = 0;
    }
    set({
      owner,
      rightful,
      nations: s.nations.filter((n) => n.id !== id),
      cities: s.cities.filter((c) => c.r !== id),
      alliances: s.alliances
        .map((a) => ({ ...a, ids: a.ids.filter((x) => x !== id) }))
        .filter((a) => a.ids.length >= 2),
      wars: s.wars.filter(
        (w) => !w.attackers.includes(id) && !w.defenders.includes(id),
      ),
      selectedNationId: s.selectedNationId === id ? null : s.selectedNationId,
      mapVersion: Date.now(),
    });
  },

  beginStroke() {
    if (strokeOpen) return;
    strokeOpen = true;
    const s = get();
    set({ undoStack: [...s.undoStack.slice(-29), snap(s)], redoStack: [] });
  },
  endStroke() {
    strokeOpen = false;
  },

  undo() {
    const s = get();
    const prev = s.undoStack[s.undoStack.length - 1];
    if (!prev) return;
    set({
      ...applySnap(prev),
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, snap(s)],
    });
  },
  redo() {
    const s = get();
    const next = s.redoStack[s.redoStack.length - 1];
    if (!next) return;
    set({
      ...applySnap(next),
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, snap(s)],
    });
  },

  paintAt(x, y, dragging) {
    const s = get();
    if (!inMap(x, y, s.width, s.height)) return;
    if (!dragging) get().beginStroke();
    const { width, height, tool, brush } = s;
    const i0 = y * width + x;

    if (tool === "eyedropper") {
      const id = s.owner[i0];
      if (id) set({ selectedNationId: id, tool: "paint" });
      return;
    }
    if (tool === "capital") {
      const id = s.selectedNationId;
      if (!id) return;
      if (s.owner[i0] !== id || s.terrain[i0] === TERRAIN.water) return;
      set({
        nations: s.nations.map((n) =>
          n.id === id ? { ...n, capital: { x, y } } : n,
        ),
        mapVersion: Date.now(),
      });
      return;
    }
    if (tool === "city") {
      get().addCityAt(x, y);
      return;
    }
    if (tool === "fill") {
      if (s.viewMode === "terrain" || s.tool === "terrain") {
        floodFill(s.terrain, width, height, x, y, s.terrain[i0], s.terrainBrush);
      } else if (s.viewMode === "cores" || s.tool === "cores") {
        const id = s.selectedNationId ?? 0;
        floodFill(s.rightful, width, height, x, y, s.rightful[i0], id);
      } else {
        const id = s.selectedNationId ?? 0;
        const from = s.owner[i0];
        floodFill(s.owner, width, height, x, y, from, id);
        floodFill(s.rightful, width, height, x, y, from, id);
      }
      set({ mapVersion: Date.now() });
      return;
    }

    const r = Math.max(0, brush - 1);
    const terrain = s.terrain;
    const owner = s.owner;
    const rightful = s.rightful;
    const occupations = s.occupations;
    const nationId = s.selectedNationId ?? 0;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r + r) continue;
        const px = x + dx;
        const py = y + dy;
        if (!inMap(px, py, width, height)) continue;
        const i = py * width + px;
        if (tool === "terrain") {
          terrain[i] = s.terrainBrush;
          if (s.terrainBrush === TERRAIN.water) {
            owner[i] = 0;
            rightful[i] = 0;
            occupations[i] = 0;
          }
        } else if (tool === "erase") {
          owner[i] = 0;
          rightful[i] = 0;
          occupations[i] = 0;
        } else if (tool === "cores") {
          if (terrain[i] === TERRAIN.water) continue;
          rightful[i] = nationId;
        } else if (tool === "paint") {
          if (terrain[i] === TERRAIN.water) continue;
          if (!nationId) continue;
          const prev = owner[i];
          owner[i] = nationId;
          if (rightful[i] === 0 || rightful[i] === prev) rightful[i] = nationId;
        }
      }
    }
    let nations = s.nations;
    if (tool === "paint" && nationId) {
      const n = nations.find((x) => x.id === nationId);
      if (n) {
        const ci = n.capital.y * width + n.capital.x;
        const capBad =
          !inMap(n.capital.x, n.capital.y, width, height) ||
          owner[ci] !== nationId ||
          terrain[ci] === TERRAIN.water;
        if (capBad) {
          nations = nations.map((nn) =>
            nn.id === nationId ? { ...nn, capital: { x, y } } : nn,
          );
        }
      }
    }
    set({ mapVersion: Date.now(), nations });
  },

  addCityAt(x, y, name) {
    const s = get();
    if (!inMap(x, y, s.width, s.height)) return;
    if (s.terrain[y * s.width + x] === TERRAIN.water) return;
    const owner = s.owner[y * s.width + x];
    const r = owner || s.selectedNationId || 0;
    if (!r) return;
    if (s.cities.some((c) => c.x === x && c.y === y)) return;
    const nation = s.nations.find((n) => n.id === r);
    set({
      cities: [
        ...s.cities,
        { x, y, n: name || nation?.name || "City", r, rp: 0 },
      ],
      mapVersion: Date.now(),
    });
  },

  removeCity(index) {
    set((s) => ({ cities: s.cities.filter((_, i) => i !== index) }));
  },

  addAlliance(ids, name) {
    if (ids.length < 2) return;
    set((s) => ({
      alliances: [
        ...s.alliances,
        {
          name,
          color: { r: 0.32, g: 0.4, b: 0.52, a: 1 },
          ids: [...ids],
          inUnion: false,
          unity: 20,
          ne: true,
          ce: false,
        },
      ],
    }));
  },
  removeAlliance(index) {
    set((s) => ({ alliances: s.alliances.filter((_, i) => i !== index) }));
  },
  addWar(attackers, defenders) {
    if (!attackers.length || !defenders.length) return;
    const s = get();
    const area = (id: number) => {
      let n = 0;
      for (let i = 0; i < s.owner.length; i++) if (s.owner[i] === id) n++;
      return n;
    };
    set({
      wars: [
        ...s.wars,
        {
          attackers: [...attackers],
          attackersLeft: [...attackers],
          defenders: [...defenders],
          defendersLeft: [...defenders],
          targetLength: 36,
          startTime: 0,
          aInitArea: attackers.reduce((a, id) => a + area(id), 0),
          dIntiArea: defenders.reduce((a, id) => a + area(id), 0),
        },
      ],
    });
  },
  removeWar(index) {
    set((s) => ({ wars: s.wars.filter((_, i) => i !== index) }));
  },

  validateNow() {
    const repaired = applyRepair(get());
    const file = buildAocFile(repaired);
    const result = validateAoc(file);
    set({ validation: result, nations: repaired.nations, cities: repaired.cities });
    return result;
  },

  buildValidatedJson() {
    const repaired = applyRepair(get());
    const file = buildAocFile(repaired);
    const result = validateAoc(file);
    set({
      validation: result,
      nations: repaired.nations,
      cities: repaired.cities,
    });
    return { json: serializeAoc(file), result };
  },
}));
