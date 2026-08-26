export type TemplateId =
  | "world-2026"
  | "world-1956"
  | "world-1938"
  | "world-1914"
  | "world-classic"
  | "blank";

export type Template = {
  id: TemplateId;
  title: string;
  year: number;
  month: number;
  blurb: string;
  width: number;
  height: number;
  nations: number;
  /** Path under /public to the official .aoc. Blank uses world-2026 terrain. */
  scenarioUrl: string;
  flagsUrl: string | null;
  flagNamesUrl: string | null;
  thumbUrl: string;
  stripNations: boolean;
};

export const TEMPLATES: Template[] = [
  {
    id: "world-2026",
    title: "World 2026",
    year: 2026,
    month: 0,
    blurb: "Official 2026 borders — 247 nations, live wars, CSTO and regional pacts.",
    width: 950,
    height: 373,
    nations: 247,
    scenarioUrl: "/scenarios/world-2026/scenario.json",
    flagsUrl: "/scenarios/world-2026/flags.png",
    flagNamesUrl: "/scenarios/world-2026/flagNames.txt",
    thumbUrl: "/scenarios/world-2026/thumb.png",
    stripNations: false,
  },
  {
    id: "world-1956",
    title: "World 1956",
    year: 1956,
    month: 0,
    blurb: "Cold War — NATO, Warsaw Pact, and a world still shaking off empires.",
    width: 950,
    height: 373,
    nations: 259,
    scenarioUrl: "/scenarios/world-1956/scenario.json",
    flagsUrl: "/scenarios/world-1956/flags.png",
    flagNamesUrl: "/scenarios/world-1956/flagNames.txt",
    thumbUrl: "/scenarios/world-1956/thumb.png",
    stripNations: false,
  },
  {
    id: "world-1938",
    title: "World 1938",
    year: 1938,
    month: 0,
    blurb: "Anschluss Germany, the Axis, Chinese United Front, and the last peace.",
    width: 950,
    height: 373,
    nations: 243,
    scenarioUrl: "/scenarios/world-1938/scenario.json",
    flagsUrl: "/scenarios/world-1938/flags.png",
    flagNamesUrl: "/scenarios/world-1938/flagNames.txt",
    thumbUrl: "/scenarios/world-1938/thumb.png",
    stripNations: false,
  },
  {
    id: "world-1914",
    title: "World 1914",
    year: 1914,
    month: 0,
    blurb: "July Crisis — Entente vs Central Powers, empires still on the map.",
    width: 950,
    height: 373,
    nations: 232,
    scenarioUrl: "/scenarios/world-1914/scenario.json",
    flagsUrl: "/scenarios/world-1914/flags.png",
    flagNamesUrl: "/scenarios/world-1914/flagNames.txt",
    thumbUrl: "/scenarios/world-1914/thumb.png",
    stripNations: false,
  },
  {
    id: "world-classic",
    title: "World Classic",
    year: 2026,
    month: 0,
    blurb: "The original compact world map. 168 nations, 750×400, no diplomacy preset.",
    width: 750,
    height: 400,
    nations: 168,
    scenarioUrl: "/scenarios/world-classic/scenario.json",
    flagsUrl: "/scenarios/world-classic/flags.png",
    flagNamesUrl: "/scenarios/world-classic/flagNames.txt",
    thumbUrl: "/scenarios/world-classic/thumb.png",
    stripNations: false,
  },
  {
    id: "blank",
    title: "Blank Earth",
    year: 1,
    month: 0,
    blurb: "Official world terrain with the nations wiped. Paint your own history.",
    width: 950,
    height: 373,
    nations: 0,
    scenarioUrl: "/scenarios/world-2026/scenario.json",
    flagsUrl: null,
    flagNamesUrl: null,
    thumbUrl: "/scenarios/blank/thumb.png",
    stripNations: true,
  },
];

export function templateById(id: TemplateId) {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown template ${id}`);
  return t;
}
