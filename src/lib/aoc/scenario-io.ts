import JSZip from "jszip";
import { decodeAocFile, normalizeAoc } from "./decode.ts";
import type { DecodedScenario } from "./decode.ts";
import { validateAoc } from "./validate.ts";
import type { ValidationResult } from "./types.ts";
import { loadOfficialRaw } from "@/data/maps/load-official";
import type { TemplateId } from "@/data/templates";

export type ScenarioBundle = {
  decoded: DecodedScenario;
  validation: ValidationResult;
  name: string;
  flagsPng: Uint8Array | null;
  flagNamesText: string | null;
};

async function readFlags(res: Response): Promise<Uint8Array | null> {
  if (!res.ok) return null;
  return new Uint8Array(await res.arrayBuffer());
}

export function parseAocObject(
  raw: unknown,
  name?: string,
  opts?: { skipValidate?: boolean },
): ScenarioBundle {
  const file = normalizeAoc(raw);
  const validation = opts?.skipValidate
    ? { ok: true as const, errors: [], warnings: [] }
    : validateAoc(file);
  if (!validation.ok) {
    throw new Error(validation.errors[0]?.message ?? "Invalid .aoc");
  }
  const decoded = decodeAocFile(file, { skipValidate: true });
  decoded.scenarioName = name?.replace(/\.aoc$/i, "") || decoded.scenarioName;
  return {
    decoded,
    validation,
    name: decoded.scenarioName,
    flagsPng: null,
    flagNamesText: null,
  };
}

export async function loadOfficialScenario(
  id: TemplateId,
  _flagsUrl?: string | null,
  _flagNamesUrl?: string | null,
  name?: string,
): Promise<ScenarioBundle> {
  const raw = await loadOfficialRaw(id);
  return parseAocObject(raw, name, { skipValidate: true });
}

export async function loadScenarioFlags(
  flagsUrl?: string | null,
  flagNamesUrl?: string | null,
): Promise<{ flagsPng: Uint8Array | null; flagNamesText: string | null }> {
  let flagsPng: Uint8Array | null = null;
  let flagNamesText: string | null = null;
  if (flagsUrl) {
    try {
      const ctrl = new AbortController();
      const t = window.setTimeout(() => ctrl.abort(), 8000);
      flagsPng = await readFlags(await fetch(flagsUrl, { signal: ctrl.signal }));
      window.clearTimeout(t);
    } catch {
      flagsPng = null;
    }
  }
  if (flagNamesUrl) {
    try {
      const r = await fetch(flagNamesUrl);
      flagNamesText = r.ok ? await r.text() : null;
    } catch {
      flagNamesText = null;
    }
  }
  return { flagsPng, flagNamesText };
}

export async function loadScenarioFromUrl(
  aocUrl: string,
  flagsUrl?: string | null,
  flagNamesUrl?: string | null,
  name?: string,
): Promise<ScenarioBundle> {
  const aocRes = await fetch(aocUrl);
  if (!aocRes.ok) throw new Error("Could not load that world map.");
  const text = await aocRes.text();
  const bundle = parseAocText(text, name);
  if (flagsUrl) {
    try {
      bundle.flagsPng = await readFlags(await fetch(flagsUrl));
    } catch {
      bundle.flagsPng = null;
    }
  }
  if (flagNamesUrl) {
    try {
      const r = await fetch(flagNamesUrl);
      bundle.flagNamesText = r.ok ? await r.text() : null;
    } catch {
      bundle.flagNamesText = null;
    }
  }
  return bundle;
}

export function parseAocText(text: string, name?: string): ScenarioBundle {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("That file is not valid JSON.");
  }
  return parseAocObject(parsed, name);
}

export async function parseScenarioZip(file: File): Promise<ScenarioBundle> {
  const zip = await JSZip.loadAsync(file);
  let aocName = "";
  let aocText = "";
  let flagsPng: Uint8Array | null = null;
  let flagNamesText: string | null = null;

  const entries = Object.values(zip.files).filter((f) => !f.dir);
  for (const entry of entries) {
    const base = entry.name.split("/").pop() ?? entry.name;
    if (base.toLowerCase().endsWith(".aoc") || base.toLowerCase().endsWith(".json")) {
      aocText = await entry.async("string");
      aocName = base.replace(/\.(aoc|json)$/i, "");
    } else if (base.toLowerCase() === "flags.png") {
      flagsPng = await entry.async("uint8array");
    } else if (base.toLowerCase() === "flagnames.txt") {
      flagNamesText = await entry.async("string");
    }
  }
  if (!aocText) throw new Error("That zip has no .aoc scenario file inside.");
  const bundle = parseAocText(aocText, aocName);
  bundle.flagsPng = flagsPng;
  bundle.flagNamesText = flagNamesText;
  return bundle;
}

export function stripToBlankEarth(bundle: ScenarioBundle): ScenarioBundle {
  const { decoded } = bundle;
  const n = decoded.width * decoded.height;
  const owner = new Uint16Array(n);
  const rightful = new Uint16Array(n);
  const occupations = new Uint16Array(n);
  return {
    ...bundle,
    name: "Blank Earth",
    flagsPng: null,
    flagNamesText: null,
    decoded: {
      ...decoded,
      scenarioName: "Blank Earth",
      startingYear: 1,
      startingMonth: 0,
      owner,
      rightful,
      occupations,
      nations: [],
      cities: [],
      alliances: [],
      wars: [],
    },
  };
}
