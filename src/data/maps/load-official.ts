import type { TemplateId } from "@/data/templates";

function scenarioKey(id: TemplateId): Exclude<TemplateId, "blank"> {
  return id === "blank" ? "world-2026" : id;
}

async function fetchJson(url: string, ms: number): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text || text.trimStart().startsWith("<")) {
      throw new Error("Got a web page instead of a map file.");
    }
    return JSON.parse(text);
  } finally {
    window.clearTimeout(timer);
  }
}

/** Fetch the official map JSON. Never uses import() — Safari iPad fails those. */
export async function loadOfficialRaw(id: TemplateId): Promise<unknown> {
  const key = scenarioKey(id);
  const urls = [`/scenarios/${key}/scenario.json`, `/scenarios/${key}/scenario.aoc`];
  let last = "Could not load that world map.";
  for (const url of urls) {
    try {
      return await fetchJson(url, 20000);
    } catch (e) {
      last = (e as Error).name === "AbortError" ? "Opening timed out." : (e as Error).message;
    }
  }
  throw new Error(last);
}

export function preloadOfficialMaps() {
  if (typeof window === "undefined") return;
  for (const id of ["world-2026", "world-1956", "world-1938", "world-1914", "world-classic"] as const) {
    void fetch(`/scenarios/${id}/scenario.json`, { cache: "force-cache" }).catch(() => {});
  }
}
