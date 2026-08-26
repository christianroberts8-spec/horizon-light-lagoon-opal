import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { buildAocFile, defaultNation, serializeAoc } from "./encode.ts";
import { decodeAocFile, normalizeAoc } from "./decode.ts";
import { canvasToAocOrder, decodeRle, encodeRle, pickRle, rlePixelCount } from "./rle.ts";
import { AOC_VERSION, type AocWar } from "./types.ts";
import { parseAndValidate, validateAoc } from "./validate.ts";

function paintRect(
  buf: Uint16Array | Uint8Array,
  w: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  v: number,
) {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) buf[y * w + x] = v;
  }
}

function miniState() {
  const width = 32;
  const height = 16;
  const terrain = new Uint8Array(width * height);
  const owner = new Uint16Array(width * height);
  const rightful = new Uint16Array(width * height);
  const occupations = new Uint16Array(width * height);
  paintRect(terrain, width, 0, 0, width, 8, 1);
  paintRect(owner, width, 0, 0, 16, 8, 1);
  paintRect(owner, width, 16, 0, 32, 8, 2);
  paintRect(rightful, width, 0, 0, 16, 8, 1);
  paintRect(rightful, width, 16, 0, 32, 8, 2);
  const west = defaultNation(1, { r: 0.2, g: 0.3, b: 0.8, a: 1 });
  west.name = "Westland";
  west.capital = { x: 8, y: 3 };
  west.originalCapital = { x: 8, y: 3 };
  const east = defaultNation(2, { r: 0.8, g: 0.2, b: 0.2, a: 1 });
  east.name = "Eastmark";
  east.capital = { x: 24, y: 3 };
  east.originalCapital = { x: 24, y: 3 };
  return {
    scenarioName: "Test Front",
    startingYear: 1938,
    startingMonth: 8,
    width,
    height,
    terrain,
    owner,
    rightful,
    occupations,
    nations: [west, east],
    cities: [
      { x: 8, y: 3, n: "Westkeep", r: 1, rp: 0 },
      { x: 24, y: 3, n: "Eastkeep", r: 2, rp: 0 },
    ],
    alliances: [
      {
        name: "Western Pact",
        color: { r: 0.2, g: 0.3, b: 0.5, a: 1 },
        ids: [1, 2],
        inUnion: false,
        unity: 12,
        ne: true,
        ce: false,
      },
    ],
    wars: [] as AocWar[],
  };
}

test("RLE round-trips and counts pixels", () => {
  const src = [1, 1, 1, 0, 0, 2, 2, 2, 2];
  const rle = encodeRle(src);
  assert.deepEqual(rle.amounts, [3, 2, 4]);
  assert.deepEqual(rle.values, [1, 0, 2]);
  assert.equal(rlePixelCount(rle), 9);
  assert.deepEqual(decodeRle(rle, 9), src);
});

test("canvas origin flips so row 0 is south in the .aoc buffer", () => {
  const canvas = [7, 7, 8, 9];
  const aoc = canvasToAocOrder(canvas, 2, 2);
  assert.deepEqual(aoc, [8, 9, 7, 7]);
});

test("buildAocFile writes a valid v4.5.0 scenario with terrain2/owner2", () => {
  const file = buildAocFile(miniState());
  assert.equal(file.version, AOC_VERSION);
  assert.equal(file.width, 32);
  assert.equal(file.height, 16);
  assert.equal(file.startingYear, 1938);
  assert.equal(file.startingMonth, 8);
  assert.equal(file.currentGameTime, 0);
  assert.equal(file.nations.length, 2);
  assert.equal(file.nations[0].id, 1);
  assert.equal(file.nations[0].name, "Westland");
  assert.equal(file.nations[0].destroyed, false);
  assert.ok(file.nations[0].pos.x >= 0);
  assert.equal(file.cities.length, 2);
  assert.equal(file.cities[0].n, "Westkeep");
  assert.ok("r" in file.cities[0]);
  assert.ok("rp" in file.cities[0]);
  assert.equal(file.alliances[0].ids.length, 2);
  assert.equal(file.alliances[0].inUnion, false);
  assert.deepEqual(file.history, []);
  assert.equal(file.achData.ironMan, false);
  assert.equal(file.achData.starters, 2);

  const pixels = 32 * 16;
  const terrain = pickRle(file.terrain2, file.terrain);
  const owner = pickRle(file.owner2, file.owner);
  assert.ok(terrain);
  assert.ok(owner);
  assert.equal(rlePixelCount(terrain), pixels);
  assert.equal(rlePixelCount(owner), pixels);
  assert.equal(rlePixelCount(file.occupations), pixels);
  assert.ok(Array.isArray(file.terrain));
  assert.equal((file.terrain as number[]).length, 0);
  assert.ok(Array.isArray(file.owner));
  assert.equal((file.owner as number[]).length, 0);

  const result = validateAoc(file);
  assert.equal(result.ok, true, result.errors.map((e) => e.message).join("; "));
  assert.equal(result.errors.length, 0);

  const json = serializeAoc(file);
  assert.equal(json.includes("\"version\":\"4.5.0\""), true);
  assert.equal(json.includes("\"terrain2\""), true);
  assert.equal(json.includes("\"owner2\""), true);
  assert.equal(json.includes("\"occupations\""), true);
  assert.equal(json.includes("\"dIntiArea\"") || file.wars.length === 0, true);
  const round = parseAndValidate(json);
  assert.equal(round.result.ok, true);

  const decoded = decodeAocFile(file);
  assert.equal(decoded.nations[0].name, "Westland");
  assert.equal(decoded.owner[3 * 32 + 8], 1);
  assert.equal(decoded.terrain[15 * 32 + 0], 0, "bottom canvas row is water");
  assert.equal(decoded.terrain[0], 1, "top canvas row is land");
});

test("capital is stored in bottom-origin coordinates", () => {
  const file = buildAocFile(miniState());
  const west = file.nations[0];
  assert.equal(west.pos.x, 8);
  assert.equal(west.pos.y, 12);
  assert.equal(west.originalPos.x, 8);
  assert.equal(west.originalPos.y, 12);
});

test("water cannot stay owned after encode", () => {
  const s = miniState();
  s.owner[15 * 32 + 4] = 1;
  const file = buildAocFile(s);
  const ownerRle = pickRle(file.owner2, file.owner);
  const terrainRle = pickRle(file.terrain2, file.terrain);
  assert.ok(ownerRle && terrainRle);
  const owner = decodeRle(ownerRle, 32 * 16);
  const terrain = decodeRle(terrainRle, 32 * 16);
  for (let i = 0; i < owner.length; i++) {
    if (terrain[i] === 0) assert.equal(owner[i], 0);
  }
  assert.equal(validateAoc(file).ok, true);
});

test("validate rejects a fake renamed JSON stub", () => {
  const fake = {
    version: "4.5.0",
    name: "not-a-scenario",
    nations: [{ id: 1 }],
  };
  const result = validateAoc(fake);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.code === "size"));
  assert.ok(result.errors.some((e) => e.code.startsWith("rle-")));
});

test("validate rejects RLE that does not cover the map", () => {
  const file = buildAocFile(miniState());
  file.owner2 = { amounts: [4], values: [1] };
  file.owner = [];
  const result = validateAoc(file);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.code === "rle-count-owner"));
});

test("validate rejects capital on another nation's land", () => {
  const s = miniState();
  s.nations[0].capital = { x: 24, y: 3 };
  const file = buildAocFile(s);
  const result = validateAoc(file);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.code === "capital-owner"));
});

test("war block keeps the dIntiArea key the game expects", () => {
  const s = miniState();
  s.wars = [
    {
      attackers: [1],
      attackersLeft: [1],
      defenders: [2],
      defendersLeft: [2],
      targetLength: 40,
      startTime: 0,
      aInitArea: 100,
      dIntiArea: 90,
    },
  ];
  const file = buildAocFile(s);
  assert.equal(file.wars[0].dIntiArea, 90);
  assert.equal("dInitArea" in file.wars[0], false);
  const json = serializeAoc(file);
  assert.equal(json.includes("dIntiArea"), true);
  assert.equal(json.includes("dInitArea"), false);
  assert.equal(validateAoc(file).ok, true);
});

test("official World 2026 file loads through terrain2/owner2", () => {
  const raw = JSON.parse(
    readFileSync("public/scenarios/world-2026/scenario.aoc", "utf8"),
  );
  const normalized = normalizeAoc(raw);
  const result = validateAoc(normalized);
  assert.equal(result.ok, true, result.errors.map((e) => e.message).join("; "));
  const decoded = decodeAocFile(normalized);
  assert.equal(decoded.width, 950);
  assert.equal(decoded.height, 373);
  assert.equal(decoded.nations.length, 247);
  assert.equal(decoded.nations[0].name, "United States");
  const living = decoded.nations.filter((n) => !n.destroyed);
  assert.ok(living.length > 150);
  assert.equal(decoded.alliances[0].inUnion, false);
  assert.ok(decoded.alliances.length >= 1);
  const rebuilt = buildAocFile(decoded);
  const again = validateAoc(rebuilt);
  assert.equal(again.ok, true, again.errors.map((e) => e.message).join("; "));
});

test("repair snaps a new nation's capital off water onto its land", async () => {
  const { repairForExport } = await import("./repair.ts");
  const s = miniState();
  s.nations[0].capital = { x: 0, y: 15 }; // water
  const broken = buildAocFile(s);
  assert.equal(validateAoc(broken).ok, false);
  const { nations, changed } = repairForExport(s);
  assert.ok(changed >= 1);
  const fixed = buildAocFile({ ...s, nations });
  assert.equal(validateAoc(fixed).ok, true, validateAoc(fixed).errors.map((e) => e.message).join("; "));
  assert.equal(fixed.nations[0].pos.y > 7, true); // land is top half of canvas → bottom-origin y is high
});
