import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Download, a as Plus, c as Mountain, d as Image$1, f as Hand, g as Droplet, h as Eraser, i as Redo2, l as MapPinned, m as Eye, o as Pentagon, p as FileJson, r as ShieldAlert, s as Paintbrush, t as Undo2, u as Landmark } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BRNlo_Jp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var TEMPLATES = [
	{
		id: "world-2026",
		title: "World 2026",
		year: 2026,
		month: 0,
		blurb: "Official 2026 borders — 247 nations, live wars, CSTO and regional pacts.",
		width: 950,
		height: 373,
		nations: 247,
		scenarioUrl: "/scenarios/world-2026/scenario.aoc",
		flagsUrl: "/scenarios/world-2026/flags.png",
		flagNamesUrl: "/scenarios/world-2026/flagNames.txt",
		thumbUrl: "/scenarios/world-2026/thumb.png",
		stripNations: false
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
		scenarioUrl: "/scenarios/world-1956/scenario.aoc",
		flagsUrl: "/scenarios/world-1956/flags.png",
		flagNamesUrl: "/scenarios/world-1956/flagNames.txt",
		thumbUrl: "/scenarios/world-1956/thumb.png",
		stripNations: false
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
		scenarioUrl: "/scenarios/world-1938/scenario.aoc",
		flagsUrl: "/scenarios/world-1938/flags.png",
		flagNamesUrl: "/scenarios/world-1938/flagNames.txt",
		thumbUrl: "/scenarios/world-1938/thumb.png",
		stripNations: false
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
		scenarioUrl: "/scenarios/world-1914/scenario.aoc",
		flagsUrl: "/scenarios/world-1914/flags.png",
		flagNamesUrl: "/scenarios/world-1914/flagNames.txt",
		thumbUrl: "/scenarios/world-1914/thumb.png",
		stripNations: false
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
		scenarioUrl: "/scenarios/world-classic/scenario.aoc",
		flagsUrl: "/scenarios/world-classic/flags.png",
		flagNamesUrl: "/scenarios/world-classic/flagNames.txt",
		thumbUrl: "/scenarios/world-classic/thumb.png",
		stripNations: false
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
		scenarioUrl: "/scenarios/world-2026/scenario.aoc",
		flagsUrl: null,
		flagNamesUrl: null,
		thumbUrl: "/scenarios/blank/thumb.png",
		stripNations: true
	}
];
function templateById(id) {
	const t = TEMPLATES.find((x) => x.id === id);
	if (!t) throw new Error(`Unknown template ${id}`);
	return t;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	a.target = "_blank";
	a.style.display = "none";
	document.body.appendChild(a);
	a.dispatchEvent(new MouseEvent("click", {
		bubbles: true,
		cancelable: true,
		view: window
	}));
	a.remove();
	return url;
}
function inIframe() {
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}
/** Prefer the OS save dialog when top-level; always keep a blob URL fallback. */
async function saveBlob(blob, filename, mime) {
	if (!inIframe()) {
		const picker = window.showSaveFilePicker;
		if (typeof picker === "function") try {
			const writable = await (await picker({
				suggestedName: filename,
				types: [{
					description: "Ages of Conflict scenario",
					accept: { [mime]: [filename.endsWith(".zip") ? ".zip" : ".aoc"] }
				}]
			})).createWritable();
			await writable.write(blob);
			await writable.close();
			return {
				mode: "picker",
				url: URL.createObjectURL(blob)
			};
		} catch {}
	}
	return {
		mode: "link",
		url: downloadBlob(blob, filename)
	};
}
function sanitizeFilename(name) {
	return name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "").replace(/\s+/g, "_").replace(/_+/g, "_").replace(/^\.+/, "").slice(0, 80) || "Scenario";
}
function rgbCss(c) {
	return `rgb(${Math.round(c.r * 255)} ${Math.round(c.g * 255)} ${Math.round(c.b * 255)})`;
}
function hexToColor(hex) {
	const h = hex.replace("#", "");
	return {
		r: Number.parseInt(h.slice(0, 2), 16) / 255,
		g: Number.parseInt(h.slice(2, 4), 16) / 255,
		b: Number.parseInt(h.slice(4, 6), 16) / 255,
		a: 1
	};
}
function colorToHex(c) {
	const n = (v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0");
	return `#${n(c.r)}${n(c.g)}${n(c.b)}`;
}
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border bg-bg-subtle px-2 py-0.5 text-[11px] font-medium tracking-wide text-muted", className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-bg-subtle text-fg border border-border hover:border-border-strong",
			ghost: "text-muted hover:text-fg hover:bg-bg-subtle",
			danger: "bg-danger text-fg hover:opacity-90",
			outline: "border border-border-strong text-fg hover:bg-bg-subtle"
		},
		size: {
			default: "h-11 rounded-[var(--radius-sm)] px-4 text-sm",
			sm: "h-9 rounded-[var(--radius-xs)] px-3 text-xs",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-sm",
			icon: "size-11 rounded-[var(--radius-sm)]",
			"icon-sm": "size-9 rounded-[var(--radius-xs)]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
/** Ages of Conflict: World War Simulator — current mobile version. */
var AOC_VERSION = "4.5.0";
var AOC_WARN_PIXELS = 5e5;
var AOC_IMPORT_PIXEL_CAP = 4e6;
var AOC_MAX_DIM = 2048;
/** Terrain IDs from the official save-file documentation (v4.0+). */
var TERRAIN = {
	water: 0,
	plains: 1,
	crossing: 2,
	hills: 3,
	desert: 4,
	mountains: 5,
	forest: 6,
	tundra: 7,
	grasslands: 8
};
/** Hex codes the game uses in map images (wiki Save File). */
var TERRAIN_HEX = {
	0: "#FFFFFF",
	1: "#000000",
	2: "#CCCCCC",
	3: "#333333",
	4: "#666666",
	5: "#999999",
	6: "#1F1F1F",
	7: "#808080",
	8: "#4C4C4C"
};
var TERRAIN_LABEL = {
	0: "Water",
	1: "Plains",
	2: "Crossing",
	3: "Hills",
	4: "Desert",
	5: "Mountains",
	6: "Forest",
	7: "Tundra",
	8: "Grasslands"
};
/** Run-length encode a row-major bottom-origin map buffer. */
function encodeRle(data) {
	const amounts = [];
	const values = [];
	const len = data.length;
	if (len === 0) return {
		amounts,
		values
	};
	let current = data[0] | 0;
	let count = 1;
	for (let i = 1; i < len; i++) {
		const v = data[i] | 0;
		if (v === current && count < 2147483647) count += 1;
		else {
			amounts.push(count);
			values.push(current);
			current = v;
			count = 1;
		}
	}
	amounts.push(count);
	values.push(current);
	return {
		amounts,
		values
	};
}
function isRle(v) {
	return !!v && typeof v === "object" && Array.isArray(v.amounts) && Array.isArray(v.values);
}
/** v4.5.0 stores the real map in terrain2/owner2; terrain/owner are empty arrays. */
function pickRle(...candidates) {
	let empty = null;
	for (const c of candidates) {
		if (!isRle(c)) continue;
		if (c.amounts.length > 0) return c;
		if (!empty) empty = c;
	}
	return empty;
}
function decodeRle(rle, expected) {
	const { amounts, values } = rle;
	if (!Array.isArray(amounts) || !Array.isArray(values)) throw new Error("RLE block is missing amounts/values arrays");
	if (amounts.length !== values.length) throw new Error(`RLE amounts (${amounts.length}) and values (${values.length}) length mismatch`);
	let total = 0;
	for (const n of amounts) {
		if (!Number.isInteger(n) || n < 0) throw new Error("RLE amount is not a non-negative integer");
		total += n;
	}
	if (expected !== void 0 && total !== expected) throw new Error(`RLE covers ${total} pixels, expected ${expected}`);
	const out = new Array(total);
	let o = 0;
	for (let i = 0; i < amounts.length; i++) {
		const n = amounts[i] | 0;
		const v = values[i] | 0;
		if (typeof out.fill === "function") {
			out.fill(v, o, o + n);
			o += n;
		} else for (let k = 0; k < n; k++) out[o++] = v;
	}
	return out;
}
function rlePixelCount(rle) {
	if (!rle || !Array.isArray(rle.amounts)) return -1;
	let t = 0;
	for (const n of rle.amounts) t += n | 0;
	return t;
}
/**
* Convert a top-origin canvas buffer (row 0 = north) into the game's
* bottom-origin order (row 0 = south), left to right.
*/
function canvasToAocOrder(topOrigin, width, height) {
	const out = new Array(width * height);
	let o = 0;
	for (let y = height - 1; y >= 0; y--) {
		const row = y * width;
		for (let x = 0; x < width; x++) out[o++] = topOrigin[row + x] | 0;
	}
	return out;
}
/** Inverse of canvasToAocOrder. */
function aocOrderToCanvas(bottomOrigin, width, height) {
	const out = new Array(width * height);
	let i = 0;
	for (let y = height - 1; y >= 0; y--) {
		const row = y * width;
		for (let x = 0; x < width; x++) out[row + x] = bottomOrigin[i++] | 0;
	}
	return out;
}
function clamp01(n) {
	if (!Number.isFinite(n)) return 0;
	return Math.min(1, Math.max(0, n));
}
function int(n) {
	return Math.round(Number(n) || 0);
}
function color(c) {
	return {
		r: clamp01(c.r),
		g: clamp01(c.g),
		b: clamp01(c.b),
		a: clamp01(c.a ?? 1)
	};
}
function areaByNation(owner) {
	const area = /* @__PURE__ */ new Map();
	for (let i = 0; i < owner.length; i++) {
		const id = owner[i] | 0;
		if (id > 0) area.set(id, (area.get(id) ?? 0) + 1);
	}
	return area;
}
function defaultNation(id, colorOverride) {
	const hue = id * 47 % 360;
	const c = colorOverride ?? {
		r: .35 + Math.cos(hue * Math.PI / 180) * .25,
		g: .35 + Math.cos((hue + 120) * Math.PI / 180) * .25,
		b: .35 + Math.cos((hue + 240) * Math.PI / 180) * .25,
		a: 1
	};
	return {
		id,
		name: `Nation ${id}`,
		color: c,
		gold: 80,
		combatEfficiency: 5,
		ceLock: false,
		aiDisabled: false,
		flagId: 0,
		capital: {
			x: 0,
			y: 0
		},
		originalCapital: {
			x: 0,
			y: 0
		},
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
		tempBns: []
	};
}
/**
* Build a genuine v4.5.0 Ages of Conflict scenario object.
* Map buffers are top-origin (canvas); encoding flips them to the game's
* bottom-origin RLE order. Official files store RLE in terrain2/owner2.
*/
function buildAocFile(state) {
	const { width, height } = state;
	const terrain = canvasToAocOrder(state.terrain, width, height);
	const owner = canvasToAocOrder(state.owner, width, height);
	const rightful = canvasToAocOrder(state.rightful, width, height);
	const occupations = canvasToAocOrder(state.occupations, width, height);
	for (let i = 0; i < terrain.length; i++) if (terrain[i] === 0) {
		owner[i] = 0;
		rightful[i] = 0;
		occupations[i] = 0;
	}
	const area = areaByNation(owner);
	const nations = [...state.nations].sort((a, b) => a.id - b.id).map((n) => {
		const cap = {
			x: int(Math.min(width - 1, Math.max(0, n.capital.x))),
			y: int(Math.min(height - 1, Math.max(0, n.capital.y)))
		};
		const orig = n.originalCapital ?? n.capital;
		const origCap = {
			x: int(Math.min(width - 1, Math.max(0, orig.x))),
			y: int(Math.min(height - 1, Math.max(0, orig.y)))
		};
		const filePos = {
			x: cap.x,
			y: height - 1 - cap.y
		};
		const fileOrig = {
			x: origCap.x,
			y: height - 1 - origCap.y
		};
		const land = area.get(n.id) ?? 0;
		const maxArea = Math.max(land, int(n.maxArea), n.destroyed ? 0 : 1);
		return {
			id: int(n.id),
			name: String(n.name || `Nation ${n.id}`).slice(0, 40),
			destroyed: Boolean(n.destroyed),
			pos: filePos,
			originalPos: fileOrig,
			gold: int(n.gold),
			flagId: int(n.flagId),
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
			tempBns: Array.isArray(n.tempBns) ? n.tempBns.map(int) : []
		};
	});
	const cities = state.cities.map((c) => ({
		x: int(c.x),
		y: int(height - 1 - c.y),
		n: String(c.n || "City").slice(0, 32),
		r: int(c.r),
		rp: int(c.rp)
	}));
	const alliances = state.alliances.map((a) => {
		const inUnion = Boolean(a.inUnion ?? a.unified ?? false);
		return {
			name: String(a.name || "Alliance").slice(0, 40),
			color: color(a.color ?? {
				r: .3,
				g: .3,
				b: .3,
				a: 1
			}),
			ids: a.ids.map(int),
			inUnion,
			unity: Number.isFinite(a.unity) ? a.unity : 0,
			ne: Boolean(a.ne),
			ce: Boolean(a.ce)
		};
	});
	const wars = state.wars.map((w) => ({
		attackers: w.attackers.map(int),
		attackersLeft: (w.attackersLeft ?? w.attackers).map(int),
		defenders: w.defenders.map(int),
		defendersLeft: (w.defendersLeft ?? w.defenders).map(int),
		targetLength: Number(w.targetLength) || 36,
		startTime: Number(w.startTime) || 0,
		aInitArea: int(w.aInitArea),
		dIntiArea: int(w.dIntiArea)
	}));
	const terrainRle = encodeRle(terrain);
	const ownerRle = encodeRle(owner);
	const occRle = encodeRle(occupations);
	const rightfulRle = encodeRle(rightful);
	return {
		version: AOC_VERSION,
		width: int(width),
		height: int(height),
		startingYear: int(state.startingYear),
		startingMonth: int(state.startingMonth),
		currentGameTime: 0,
		achData: {
			ironMan: false,
			smallIds: [],
			starters: nations.length
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
		history: []
	};
}
function serializeAoc(file) {
	return JSON.stringify(file);
}
function err(code, message) {
	return {
		level: "error",
		code,
		message
	};
}
function warn(code, message) {
	return {
		level: "warning",
		code,
		message
	};
}
function isColor(v) {
	if (!v || typeof v !== "object") return false;
	const c = v;
	return [
		c.r,
		c.g,
		c.b,
		c.a
	].every((n) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1.0001);
}
function isPos(v, w, h) {
	if (!v || typeof v !== "object") return false;
	const p = v;
	return Number.isInteger(p.x) && Number.isInteger(p.y) && p.x >= 0 && p.y >= 0 && p.x < w && p.y < h;
}
/**
* Validate a parsed Ages of Conflict scenario before download/import.
* Errors block download; warnings do not.
*/
function validateAoc(input) {
	const errors = [];
	const warnings = [];
	if (!input || typeof input !== "object") return {
		ok: false,
		errors: [err("not-object", "Scenario is not a JSON object.")],
		warnings
	};
	const file = input;
	if (typeof file.version !== "string" || !file.version.trim()) errors.push(err("version", "Missing version string."));
	else if (file.version !== "4.5.0") warnings.push(warn("version-mismatch", `Version is ${file.version}; current mobile is ${AOC_VERSION}. The game usually still loads it.`));
	const width = file.width;
	const height = file.height;
	if (!Number.isInteger(width) || !Number.isInteger(height)) errors.push(err("size", "width and height must be integers."));
	else {
		if (width < 16 || height < 16) errors.push(err("size-min", `Map must be at least 16×16.`));
		if (width > 2048 || height > 2048) errors.push(err("size-max", `Each dimension must be ≤ ${AOC_MAX_DIM} pixels.`));
		const pixels = width * height;
		if (pixels > 4e6) errors.push(err("size-cap", `Map is ${pixels} pixels; Ages of Conflict refuses imports above ${AOC_IMPORT_PIXEL_CAP}.`));
		else if (pixels > 5e5) warnings.push(warn("size-perf", `Map is ${pixels} pixels. The game warns above ${AOC_WARN_PIXELS}; mobile may stutter.`));
	}
	if (typeof file.startingYear !== "number" || !Number.isFinite(file.startingYear)) errors.push(err("year", "startingYear must be a number."));
	if (typeof file.startingMonth !== "number" || !Number.isInteger(file.startingMonth) || file.startingMonth < 0 || file.startingMonth > 11) errors.push(err("month", "startingMonth must be an integer 0–11."));
	if (typeof file.currentGameTime !== "number") errors.push(err("time", "currentGameTime must be a number (0 for a new scenario)."));
	if (!file.achData || typeof file.achData !== "object") errors.push(err("ach", "Missing achData block."));
	else if (typeof file.achData.starters !== "number") errors.push(err("ach-starters", "achData.starters must be a number."));
	if (!Array.isArray(file.nations) || file.nations.length < 1) errors.push(err("nations", "Scenario needs at least one nation."));
	const terrainRle = pickRle(file.terrain2, file.terrain);
	const ownerRle = pickRle(file.owner2, file.owner);
	const occRle = pickRle(file.occupations);
	const extra = file;
	const rightfulRle = pickRle(file.rightful, extra.cores, ownerRle);
	if (!terrainRle) errors.push(err("rle-terrain", "Missing terrain2 (or terrain) run-length block. Required for v4.0+ / mobile."));
	if (!ownerRle) errors.push(err("rle-owner", "Missing owner2 (or owner) run-length block. Required for v4.0+ / mobile."));
	if (!occRle) errors.push(err("rle-occupations", "Missing occupations run-length block (amounts + values). Required for v4.0+ / mobile."));
	if (!Array.isArray(file.cities)) errors.push(err("cities", "cities must be an array."));
	if (!Array.isArray(file.alliances)) errors.push(err("alliances", "alliances must be an array."));
	if (!Array.isArray(file.wars)) errors.push(err("wars", "wars must be an array."));
	if (!Array.isArray(file.history)) errors.push(err("history", "history must be an array."));
	if (!terrainRle || !ownerRle || !occRle || errors.some((e) => e.code.startsWith("size"))) return {
		ok: false,
		errors,
		warnings
	};
	const pixels = width * height;
	const layers = [
		{
			key: "terrain",
			rle: terrainRle
		},
		{
			key: "owner",
			rle: ownerRle
		},
		{
			key: "occupations",
			rle: occRle
		}
	];
	if (rightfulRle) layers.push({
		key: "rightful",
		rle: rightfulRle
	});
	let terrain = null;
	let owner = null;
	let rightful = null;
	let occupations = null;
	for (const layer of layers) {
		const { key, rle } = layer;
		if (rle.amounts.length !== rle.values.length) {
			errors.push(err(`rle-pair-${key}`, `${key}: amounts (${rle.amounts.length}) and values (${rle.values.length}) must match.`));
			continue;
		}
		const count = rlePixelCount(rle);
		if (count !== pixels) {
			errors.push(err(`rle-count-${key}`, `${key} covers ${count} pixels but the map is ${width}×${height} = ${pixels}.`));
			continue;
		}
		try {
			const decoded = decodeRle(rle, pixels);
			if (key === "terrain") terrain = decoded;
			if (key === "owner") owner = decoded;
			if (key === "rightful") rightful = decoded;
			if (key === "occupations") occupations = decoded;
		} catch (e) {
			errors.push(err(`rle-decode-${key}`, `${key}: ${e.message}`));
		}
	}
	const nations = Array.isArray(file.nations) ? file.nations : [];
	const ids = /* @__PURE__ */ new Set();
	const byId = /* @__PURE__ */ new Map();
	for (const [i, n] of nations.entries()) {
		if (!n || typeof n !== "object") {
			errors.push(err("nation-obj", `Nation at index ${i} is not an object.`));
			continue;
		}
		if (!Number.isInteger(n.id) || n.id < 1) {
			errors.push(err("nation-id", `Nation "${n.name ?? i}" must have integer id ≥ 1 (0 is unclaimed).`));
			continue;
		}
		if (ids.has(n.id)) errors.push(err("nation-dup", `Duplicate nation id ${n.id}.`));
		ids.add(n.id);
		byId.set(n.id, n);
		if (typeof n.name !== "string" || !n.name.trim()) errors.push(err("nation-name", `Nation id ${n.id} has no name.`));
		if (typeof n.destroyed !== "boolean") errors.push(err("nation-destroyed", `Nation ${n.id} missing destroyed boolean.`));
		if (!isColor(n.color)) errors.push(err("nation-color", `Nation ${n.id} color must be {r,g,b,a} floats 0–1.`));
		if (!isPos(n.pos, width, height) || !isPos(n.originalPos, width, height)) errors.push(err("nation-capital", `Nation ${n.id} capital pos/originalPos must be integer pixels inside the map.`));
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
			"puppetIntegration"
		]) if (typeof n[field] !== "number") errors.push(err("nation-field", `Nation ${n.id} missing numeric field ${field}.`));
		if (typeof n.ceLock !== "boolean" || typeof n.aiDisabled !== "boolean" || typeof n.isUnion !== "boolean") errors.push(err("nation-flags", `Nation ${n.id} is missing ceLock/aiDisabled/isUnion booleans.`));
		if (!Array.isArray(n.revoltIds) || !Array.isArray(n.killedIds) || !Array.isArray(n.puppetIds) || !Array.isArray(n.lives)) errors.push(err("nation-arrays", `Nation ${n.id} is missing revoltIds/killedIds/puppetIds/lives arrays.`));
	}
	if (owner && terrain) {
		const area = /* @__PURE__ */ new Map();
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
				errors.push(err("owner-water", `Water pixel is owned by nation ${o}. Water must stay unclaimed (0).`));
				break;
			}
			if (o !== 0) area.set(o, (area.get(o) ?? 0) + 1);
		}
		for (const id of ids) {
			const n = byId.get(id);
			if (!n) continue;
			const a = area.get(id) ?? 0;
			if (!n.destroyed && a < 1) errors.push(err("nation-land", `Living nation ${id} (${n.name}) has no land pixels.`));
			if (Number.isInteger(n.maxArea) && n.maxArea < a) warnings.push(warn("max-area", `Nation ${id} maxArea (${n.maxArea}) is below current area (${a}).`));
			if (n.pos && isPos(n.pos, width, height) && !n.destroyed) {
				const idx = n.pos.y * width + n.pos.x;
				if (owner[idx] !== id) errors.push(err("capital-owner", `Capital of ${n.name} (${id}) at ${n.pos.x},${n.pos.y} is not on that nation's land.`));
				if (terrain[idx] === 0) errors.push(err("capital-water", `Capital of ${n.name} sits on water.`));
			}
		}
	}
	if (rightful && owner) for (let i = 0; i < rightful.length; i++) {
		const c = rightful[i] | 0;
		if (c !== 0 && !ids.has(c)) {
			errors.push(err("core-unknown", `Core/rightful pixel references unknown nation ${c}.`));
			break;
		}
	}
	if (occupations) {
		for (const v of occupations) if ((v | 0) !== 0 && !ids.has(v | 0)) {
			errors.push(err("occ-unknown", `Occupation references unknown nation ${v}.`));
			break;
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
		if (typeof c.n !== "string" || !c.n.trim()) errors.push(err("city-name", `City at ${c.x},${c.y} has no name.`));
		if (!Number.isInteger(c.r) || c.r !== 0 && !ids.has(c.r)) errors.push(err("city-owner", `City ${c.n ?? i} rightful owner r=${c.r} is not a nation id.`));
		if (typeof c.rp !== "number") errors.push(err("city-rp", `City ${c.n ?? i} missing revolt chance rp.`));
		if (terrain) {
			const idx = c.y * width + c.x;
			if (terrain[idx] === 0) errors.push(err("city-water", `City ${c.n} is on water.`));
		}
	}
	const alliances = Array.isArray(file.alliances) ? file.alliances : [];
	for (const [i, a] of alliances.entries()) {
		if (!a || typeof a !== "object") {
			errors.push(err("ally-obj", `Alliance ${i} is not an object.`));
			continue;
		}
		if (typeof a.name !== "string" || !a.name.trim()) errors.push(err("ally-name", `Alliance ${i} has no name.`));
		if (!Array.isArray(a.ids) || a.ids.length < 2) errors.push(err("ally-ids", `Alliance ${a.name ?? i} needs at least two member ids.`));
		else for (const id of a.ids) if (!ids.has(id)) errors.push(err("ally-member", `Alliance ${a.name} references missing nation ${id}.`));
		if (typeof (typeof a.inUnion === "boolean" ? a.inUnion : a.unified) !== "boolean" || typeof a.unity !== "number" || typeof a.ne !== "boolean") errors.push(err("ally-fields", `Alliance ${a.name ?? i} missing inUnion/unity/ne.`));
	}
	const wars = Array.isArray(file.wars) ? file.wars : [];
	for (const [i, w] of wars.entries()) {
		if (!w || typeof w !== "object") {
			errors.push(err("war-obj", `War ${i} is not an object.`));
			continue;
		}
		if (!("dIntiArea" in w)) errors.push(err("war-typo", `War ${i} is missing dIntiArea (the real game key — not dInitArea).`));
		const sides = [...w.attackers ?? [], ...w.defenders ?? []];
		if (!Array.isArray(w.attackers) || !Array.isArray(w.defenders) || w.attackers.length < 1 || w.defenders.length < 1) errors.push(err("war-sides", `War ${i} needs attackers and defenders arrays.`));
		for (const id of sides) if (!ids.has(id)) errors.push(err("war-nation", `War ${i} references missing nation ${id}.`));
	}
	if (file.achData && Array.isArray(file.nations) && file.achData.starters !== file.nations.length) warnings.push(warn("starters", `achData.starters is ${file.achData.starters} but there are ${file.nations.length} nations.`));
	return {
		ok: errors.length === 0,
		errors,
		warnings
	};
}
function zeros(n) {
	return encodeRle(new Uint16Array(n));
}
var DEFAULT_COLOR = {
	r: .3,
	g: .3,
	b: .3,
	a: 1
};
function asColor(v) {
	if (!v || typeof v !== "object") return { ...DEFAULT_COLOR };
	const c = v;
	return {
		r: Number(c.r) || 0,
		g: Number(c.g) || 0,
		b: Number(c.b) || 0,
		a: Number.isFinite(Number(c.a)) ? Number(c.a) : 1
	};
}
function normalizeAlliance(raw) {
	const a = raw && typeof raw === "object" ? raw : {};
	const inUnion = Boolean(a.inUnion ?? a.unified ?? false);
	return {
		name: String(a.name ?? "Alliance"),
		color: asColor(a.color),
		ids: Array.isArray(a.ids) ? a.ids.map(Number) : [],
		inUnion,
		unified: inUnion,
		unity: Number.isFinite(Number(a.unity)) ? Number(a.unity) : 0,
		ne: Boolean(a.ne ?? true),
		ce: Boolean(a.ce ?? false)
	};
}
/** Fill fields older community files omit so they can be edited and re-exported. */
function normalizeAoc(raw) {
	if (!raw || typeof raw !== "object") throw new Error("Not an object.");
	const f = raw;
	const width = Number(f.width);
	const height = Number(f.height);
	const pixels = width * height;
	const terrain = pickRle(f.terrain2, f.terrain) ?? zeros(Number.isFinite(pixels) ? pixels : 0);
	const owner = pickRle(f.owner2, f.owner) ?? zeros(Number.isFinite(pixels) ? pixels : 0);
	const rightful = pickRle(f.rightful, f.cores, owner) ?? owner;
	const occupations = pickRle(f.occupations) ?? (Number.isFinite(pixels) ? zeros(pixels) : {
		amounts: [],
		values: []
	});
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
			starters: Array.isArray(f.nations) ? f.nations.length : 0
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
		history: Array.isArray(f.history) ? f.history : []
	};
}
function decodeAocFile(file, opts) {
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
	if (!terrainRle || !ownerRle) throw new Error("Scenario is missing terrain/owner map data.");
	const terrainAoc = decodeRle(terrainRle, pixels);
	const ownerAoc = decodeRle(ownerRle, pixels);
	const rightfulAoc = decodeRle(rightfulRle ?? ownerRle, pixels);
	const occAoc = decodeRle(occRle, pixels);
	const terrain = Uint8Array.from(aocOrderToCanvas(terrainAoc, width, height));
	const owner = Uint16Array.from(aocOrderToCanvas(ownerAoc, width, height));
	const rightful = Uint16Array.from(aocOrderToCanvas(rightfulAoc, width, height));
	const occupations = Uint16Array.from(aocOrderToCanvas(occAoc, width, height));
	const nations = file.nations.map((n) => ({
		id: n.id,
		name: n.name,
		color: asColor(n.color),
		gold: n.gold,
		combatEfficiency: n.combatEfficiency,
		ceLock: Boolean(n.ceLock),
		aiDisabled: Boolean(n.aiDisabled),
		flagId: n.flagId ?? 0,
		capital: {
			x: n.pos.x,
			y: height - 1 - n.pos.y
		},
		originalCapital: {
			x: n.originalPos?.x ?? n.pos.x,
			y: height - 1 - (n.originalPos?.y ?? n.pos.y)
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
		tempBns: Array.isArray(n.tempBns) ? [...n.tempBns] : []
	}));
	const cities = file.cities.map((c) => ({
		x: c.x,
		y: height - 1 - c.y,
		n: c.n,
		r: c.r,
		rp: c.rp
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
			defendersLeft: [...w.defendersLeft]
		}))
	};
}
var LOADERS = {
	"world-2026": () => import("./world-2026-41dfgJ5x.mjs"),
	"world-1956": () => import("./world-1956-CZmgsQ-1.mjs"),
	"world-1938": () => import("./world-1938-Bo_K3zal.mjs"),
	"world-1914": () => import("./world-1914-BLQi03wy.mjs"),
	"world-classic": () => import("./world-classic-Hl443Puw.mjs")
};
/** Load an official map from the JS bundle — never depends on .aoc static MIME. */
async function loadOfficialRaw(id) {
	const loader = LOADERS[id === "blank" ? "world-2026" : id];
	const mod = await loader();
	return mod.default ?? mod;
}
async function readFlags(res) {
	if (!res.ok) return null;
	return new Uint8Array(await res.arrayBuffer());
}
function parseAocObject(raw, name) {
	const file = normalizeAoc(raw);
	const validation = validateAoc(file);
	if (!validation.ok) throw new Error(validation.errors[0]?.message ?? "Invalid .aoc");
	const decoded = decodeAocFile(file, { skipValidate: true });
	decoded.scenarioName = name?.replace(/\.aoc$/i, "") || decoded.scenarioName;
	return {
		decoded,
		validation,
		name: decoded.scenarioName,
		flagsPng: null,
		flagNamesText: null
	};
}
async function loadOfficialScenario(id, flagsUrl, flagNamesUrl, name) {
	const bundle = parseAocObject(await loadOfficialRaw(id), name);
	if (flagsUrl) try {
		bundle.flagsPng = await readFlags(await fetch(flagsUrl));
	} catch {
		bundle.flagsPng = null;
	}
	if (flagNamesUrl) try {
		const r = await fetch(flagNamesUrl);
		bundle.flagNamesText = r.ok ? await r.text() : null;
	} catch {
		bundle.flagNamesText = null;
	}
	return bundle;
}
function parseAocText(text, name) {
	let parsed;
	try {
		parsed = JSON.parse(text);
	} catch {
		throw new Error("That file is not valid JSON.");
	}
	return parseAocObject(parsed, name);
}
async function parseScenarioZip(file) {
	const zip = await import_lib.default.loadAsync(file);
	let aocName = "";
	let aocText = "";
	let flagsPng = null;
	let flagNamesText = null;
	const entries = Object.values(zip.files).filter((f) => !f.dir);
	for (const entry of entries) {
		const base = entry.name.split("/").pop() ?? entry.name;
		if (base.toLowerCase().endsWith(".aoc") || base.toLowerCase().endsWith(".json")) {
			aocText = await entry.async("string");
			aocName = base.replace(/\.(aoc|json)$/i, "");
		} else if (base.toLowerCase() === "flags.png") flagsPng = await entry.async("uint8array");
		else if (base.toLowerCase() === "flagnames.txt") flagNamesText = await entry.async("string");
	}
	if (!aocText) throw new Error("That zip has no .aoc scenario file inside.");
	const bundle = parseAocText(aocText, aocName);
	bundle.flagsPng = flagsPng;
	bundle.flagNamesText = flagNamesText;
	return bundle;
}
function stripToBlankEarth(bundle) {
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
			wars: []
		}
	};
}
function inMap$1(x, y, w, h) {
	return x >= 0 && y >= 0 && x < w && y < h;
}
function capitalOk(n, owner, terrain, width, height) {
	const { x, y } = n.capital;
	if (!inMap$1(x, y, width, height)) return false;
	const i = y * width + x;
	return owner[i] === n.id && terrain[i] !== TERRAIN.water;
}
/** First land pixel of a nation, or null if it has none. */
function firstLandPixel(owner, terrain, width, nationId) {
	const len = owner.length;
	for (let i = 0; i < len; i++) if (owner[i] === nationId && terrain[i] !== TERRAIN.water) return {
		x: i % width,
		y: i / width | 0
	};
	return null;
}
/**
* Make a scenario downloadable: snap living capitals onto their land,
* mark landless nations as formable (destroyed).
*/
function repairForExport(state) {
	const { width, height, owner, terrain, nations, cities } = state;
	let changed = 0;
	const next = nations.map((n) => {
		if (n.destroyed) return n;
		if (capitalOk(n, owner, terrain, width, height)) return n;
		const land = firstLandPixel(owner, terrain, width, n.id);
		if (!land) {
			changed += 1;
			return {
				...n,
				destroyed: true
			};
		}
		changed += 1;
		return {
			...n,
			capital: land,
			originalCapital: n.originalCapital ?? land
		};
	});
	const living = new Set(next.filter((n) => !n.destroyed).map((n) => n.id));
	const nextCities = cities.filter((c) => {
		if (!inMap$1(c.x, c.y, width, height)) return false;
		if (terrain[c.y * width + c.x] === TERRAIN.water) return false;
		if (c.r !== 0 && !living.has(c.r) && !next.some((n) => n.id === c.r)) return false;
		return true;
	});
	if (nextCities.length !== cities.length) changed += 1;
	return {
		nations: next,
		cities: nextCities,
		changed
	};
}
function hexToRgb(hex) {
	const h = hex.replace("#", "");
	return [
		Number.parseInt(h.slice(0, 2), 16),
		Number.parseInt(h.slice(2, 4), 16),
		Number.parseInt(h.slice(4, 6), 16)
	];
}
var TERRAIN_RGB$1 = Object.fromEntries(Object.entries(TERRAIN_HEX).map(([id, hex]) => [id, hexToRgb(hex)]));
function dist2(a, r, g, b) {
	const dr = a[0] - r;
	const dg = a[1] - g;
	const db = a[2] - b;
	return dr * dr + dg * dg + db * db;
}
function nearestTerrain(r, g, b) {
	let best = 0;
	let bestD = Infinity;
	for (const [id, rgb] of Object.entries(TERRAIN_RGB$1)) {
		const d = dist2(rgb, r, g, b);
		if (d < bestD) {
			bestD = d;
			best = Number(id);
		}
	}
	return best;
}
function colorKey(r, g, b) {
	return (r << 16 | g << 8 | b) >>> 0;
}
function isIgnoredBorderColor(r, g, b) {
	const key = colorKey(r, g, b);
	return key === 0 || key === 16777215 || key === 39423;
}
async function readImageFile(file) {
	const url = URL.createObjectURL(file);
	try {
		const img = new Image();
		img.crossOrigin = "anonymous";
		await new Promise((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Could not read image."));
			img.src = url;
		});
		const canvas = document.createElement("canvas");
		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas is unavailable.");
		ctx.drawImage(img, 0, 0);
		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	} finally {
		URL.revokeObjectURL(url);
	}
}
function terrainFromImage(data) {
	const out = new Uint8Array(data.width * data.height);
	const px = data.data;
	for (let i = 0, p = 0; i < out.length; i++, p += 4) out[i] = nearestTerrain(px[p], px[p + 1], px[p + 2]);
	return out;
}
function bordersFromImage(data) {
	const { width, height } = data;
	const owner = new Uint16Array(width * height);
	const colorToId = /* @__PURE__ */ new Map();
	const colors = /* @__PURE__ */ new Map();
	const firstPixel = /* @__PURE__ */ new Map();
	let next = 1;
	const px = data.data;
	for (let y = 0, i = 0, p = 0; y < height; y++) for (let x = 0; x < width; x++, i++, p += 4) {
		const r = px[p];
		const g = px[p + 1];
		const b = px[p + 2];
		if (px[p + 3] < 16 || isIgnoredBorderColor(r, g, b)) {
			owner[i] = 0;
			continue;
		}
		const key = colorKey(r, g, b);
		let id = colorToId.get(key);
		if (!id) {
			id = next++;
			colorToId.set(key, id);
			colors.set(id, {
				r: r / 255,
				g: g / 255,
				b: b / 255,
				a: 1
			});
			firstPixel.set(id, {
				x,
				y
			});
		}
		owner[i] = id;
	}
	return {
		owner,
		colors,
		firstPixel
	};
}
function nationsFromColors(colors, firstPixel) {
	return [...colors.entries()].map(([id, color]) => {
		const cap = firstPixel.get(id) ?? {
			x: 0,
			y: 0
		};
		const n = defaultNation(id, color);
		n.capital = { ...cap };
		n.originalCapital = { ...cap };
		return n;
	});
}
function renderTerrainPng(terrain, width, height) {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return Promise.reject(/* @__PURE__ */ new Error("Canvas is unavailable."));
	const img = ctx.createImageData(width, height);
	const d = img.data;
	for (let i = 0, p = 0; i < terrain.length; i++, p += 4) {
		const rgb = TERRAIN_RGB$1[terrain[i] | 0] ?? TERRAIN_RGB$1[1];
		d[p] = rgb[0];
		d[p + 1] = rgb[1];
		d[p + 2] = rgb[2];
		d[p + 3] = 255;
	}
	ctx.putImageData(img, 0, 0);
	return new Promise((resolve, reject) => {
		canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("PNG encode failed")), "image/png");
	});
}
function renderBordersPng(owner, nations, width, height) {
	const byId = new Map(nations.map((n) => [n.id, n]));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return Promise.reject(/* @__PURE__ */ new Error("Canvas is unavailable."));
	const img = ctx.createImageData(width, height);
	const d = img.data;
	for (let i = 0, p = 0; i < owner.length; i++, p += 4) {
		const id = owner[i] | 0;
		if (id === 0) {
			d[p] = 255;
			d[p + 1] = 255;
			d[p + 2] = 255;
			d[p + 3] = 255;
			continue;
		}
		const c = byId.get(id)?.color ?? {
			r: .5,
			g: .5,
			b: .5,
			a: 1
		};
		d[p] = Math.round(c.r * 255);
		d[p + 1] = Math.round(c.g * 255);
		d[p + 2] = Math.round(c.b * 255);
		d[p + 3] = 255;
	}
	ctx.putImageData(img, 0, 0);
	return new Promise((resolve, reject) => {
		canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("PNG encode failed")), "image/png");
	});
}
var empty = (w, h) => ({
	terrain: new Uint8Array(w * h),
	owner: new Uint16Array(w * h),
	rightful: new Uint16Array(w * h),
	occupations: new Uint16Array(w * h)
});
function cloneNations(n) {
	return n.map((x) => ({
		...x,
		color: { ...x.color },
		capital: { ...x.capital },
		originalCapital: { ...x.originalCapital },
		puppetIds: [...x.puppetIds],
		revoltIds: [...x.revoltIds],
		killedIds: [...x.killedIds],
		lives: x.lives.map((l) => ({ ...l })),
		tempBns: [...x.tempBns]
	}));
}
function snap(s) {
	return {
		terrain: new Uint8Array(s.terrain),
		owner: new Uint16Array(s.owner),
		rightful: new Uint16Array(s.rightful),
		occupations: new Uint16Array(s.occupations),
		nations: cloneNations(s.nations),
		cities: s.cities.map((c) => ({ ...c })),
		alliances: s.alliances.map((a) => ({
			...a,
			ids: [...a.ids]
		})),
		wars: s.wars.map((w) => ({
			...w,
			attackers: [...w.attackers],
			attackersLeft: [...w.attackersLeft],
			defenders: [...w.defenders],
			defendersLeft: [...w.defendersLeft]
		}))
	};
}
function applySnap(s) {
	return {
		terrain: s.terrain,
		owner: s.owner,
		rightful: s.rightful,
		occupations: s.occupations,
		nations: s.nations,
		cities: s.cities,
		alliances: s.alliances,
		wars: s.wars,
		mapVersion: Date.now()
	};
}
function inMap(x, y, w, h) {
	return x >= 0 && y >= 0 && x < w && y < h;
}
function applyRepair(s) {
	const { nations, cities } = repairForExport(s);
	return {
		...s,
		nations,
		cities
	};
}
function applyBundle(bundle) {
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
		undoStack: [],
		redoStack: [],
		validation: bundle.validation,
		flagsPng: bundle.flagsPng,
		flagNamesText: bundle.flagNamesText,
		status: `${bundle.name || d.scenarioName} · ${d.nations.filter((n) => !n.destroyed).length} nations · ${d.width}×${d.height}`
	};
}
function floodFill(buf, width, height, x, y, from, to) {
	if (from === to) return;
	const stack = [y * width + x];
	const seen = new Uint8Array(width * height);
	while (stack.length) {
		const i = stack.pop();
		if (seen[i]) continue;
		seen[i] = 1;
		if (buf[i] !== from) continue;
		buf[i] = to;
		const px = i % width;
		const py = i / width | 0;
		if (px > 0) stack.push(i - 1);
		if (px + 1 < width) stack.push(i + 1);
		if (py > 0) stack.push(i - width);
		if (py + 1 < height) stack.push(i + width);
	}
}
var strokeOpen = false;
var useEditor = create((set, get) => ({
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
		set({
			loading: true,
			loadError: null,
			status: "Loading official map…"
		});
		try {
			const t = templateById(id);
			let bundle = await loadOfficialScenario(id, t.flagsUrl, t.flagNamesUrl, t.title);
			if (t.stripNations) bundle = stripToBlankEarth(bundle);
			set({
				...applyBundle(bundle),
				scenarioName: t.title,
				startingYear: t.year,
				startingMonth: t.month
			});
		} catch (e) {
			set({
				loading: false,
				loadError: e.message,
				status: "Could not load template."
			});
		}
	},
	importAocText(text, name) {
		try {
			set(applyBundle(parseAocText(text, name)));
		} catch (e) {
			set({
				status: e.message,
				loadError: e.message
			});
		}
	},
	async importScenarioFile(file) {
		set({
			loading: true,
			loadError: null,
			status: "Opening scenario…"
		});
		try {
			set(applyBundle(file.name.toLowerCase().endsWith(".zip") ? await parseScenarioZip(file) : parseAocText(await file.text(), file.name)));
		} catch (e) {
			set({
				loading: false,
				loadError: e.message,
				status: "Could not open that file."
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
			for (let i = 0; i < owner.length; i++) if (owner[i] === 0) terrain[i] = TERRAIN.water;
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
				rp: 0
			})),
			selectedNationId: nations[0]?.id ?? null,
			mapVersion: Date.now(),
			undoStack: [],
			redoStack: [],
			flagsPng: null,
			flagNamesText: null,
			status: `Imported borders · ${nations.length} nations · ${img.width}×${img.height}`
		});
	},
	async importTerrainPng(file) {
		const img = await readImageFile(file);
		const terrain = terrainFromImage(img);
		const s = get();
		if (s.width !== img.width || s.height !== img.height) throw new Error(`Terrain image is ${img.width}×${img.height} but the map is ${s.width}×${s.height}.`);
		const owner = new Uint16Array(s.owner);
		const rightful = new Uint16Array(s.rightful);
		for (let i = 0; i < terrain.length; i++) if (terrain[i] === TERRAIN.water) {
			owner[i] = 0;
			rightful[i] = 0;
		}
		set({
			terrain,
			owner,
			rightful,
			mapVersion: Date.now(),
			status: "Imported terrain layer."
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
		set((s) => ({ nations: s.nations.map((n) => n.id === id ? {
			...n,
			...patch
		} : n) }));
	},
	addNation(color) {
		const s = get();
		const id = (s.nations.reduce((m, n) => Math.max(m, n.id), 0) || 0) + 1;
		const nation = defaultNation(id, color);
		set({
			nations: [...s.nations, nation],
			selectedNationId: id,
			tool: "paint",
			status: `Paint land for ${nation.name}.`
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
			alliances: s.alliances.map((a) => ({
				...a,
				ids: a.ids.filter((x) => x !== id)
			})).filter((a) => a.ids.length >= 2),
			wars: s.wars.filter((w) => !w.attackers.includes(id) && !w.defenders.includes(id)),
			selectedNationId: s.selectedNationId === id ? null : s.selectedNationId,
			mapVersion: Date.now()
		});
	},
	beginStroke() {
		if (strokeOpen) return;
		strokeOpen = true;
		const s = get();
		set({
			undoStack: [...s.undoStack.slice(-29), snap(s)],
			redoStack: []
		});
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
			redoStack: [...s.redoStack, snap(s)]
		});
	},
	redo() {
		const s = get();
		const next = s.redoStack[s.redoStack.length - 1];
		if (!next) return;
		set({
			...applySnap(next),
			redoStack: s.redoStack.slice(0, -1),
			undoStack: [...s.undoStack, snap(s)]
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
			if (id) set({
				selectedNationId: id,
				tool: "paint"
			});
			return;
		}
		if (tool === "capital") {
			const id = s.selectedNationId;
			if (!id) return;
			if (s.owner[i0] !== id || s.terrain[i0] === TERRAIN.water) return;
			set({
				nations: s.nations.map((n) => n.id === id ? {
					...n,
					capital: {
						x,
						y
					}
				} : n),
				mapVersion: Date.now()
			});
			return;
		}
		if (tool === "city") {
			get().addCityAt(x, y);
			return;
		}
		if (tool === "fill") {
			if (s.viewMode === "terrain" || s.tool === "terrain") floodFill(s.terrain, width, height, x, y, s.terrain[i0], s.terrainBrush);
			else if (s.viewMode === "cores" || s.tool === "cores") {
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
		for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
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
		let nations = s.nations;
		if (tool === "paint" && nationId) {
			const n = nations.find((x) => x.id === nationId);
			if (n) {
				const ci = n.capital.y * width + n.capital.x;
				if (!inMap(n.capital.x, n.capital.y, width, height) || owner[ci] !== nationId || terrain[ci] === TERRAIN.water) nations = nations.map((nn) => nn.id === nationId ? {
					...nn,
					capital: {
						x,
						y
					}
				} : nn);
			}
		}
		set({
			mapVersion: Date.now(),
			nations
		});
	},
	addCityAt(x, y, name) {
		const s = get();
		if (!inMap(x, y, s.width, s.height)) return;
		if (s.terrain[y * s.width + x] === TERRAIN.water) return;
		const r = s.owner[y * s.width + x] || s.selectedNationId || 0;
		if (!r) return;
		if (s.cities.some((c) => c.x === x && c.y === y)) return;
		const nation = s.nations.find((n) => n.id === r);
		set({
			cities: [...s.cities, {
				x,
				y,
				n: name || nation?.name || "City",
				r,
				rp: 0
			}],
			mapVersion: Date.now()
		});
	},
	removeCity(index) {
		set((s) => ({ cities: s.cities.filter((_, i) => i !== index) }));
	},
	addAlliance(ids, name) {
		if (ids.length < 2) return;
		set((s) => ({ alliances: [...s.alliances, {
			name,
			color: {
				r: .32,
				g: .4,
				b: .52,
				a: 1
			},
			ids: [...ids],
			inUnion: false,
			unity: 20,
			ne: true,
			ce: false
		}] }));
	},
	removeAlliance(index) {
		set((s) => ({ alliances: s.alliances.filter((_, i) => i !== index) }));
	},
	addWar(attackers, defenders) {
		if (!attackers.length || !defenders.length) return;
		const s = get();
		const area = (id) => {
			let n = 0;
			for (let i = 0; i < s.owner.length; i++) if (s.owner[i] === id) n++;
			return n;
		};
		set({ wars: [...s.wars, {
			attackers: [...attackers],
			attackersLeft: [...attackers],
			defenders: [...defenders],
			defendersLeft: [...defenders],
			targetLength: 36,
			startTime: 0,
			aInitArea: attackers.reduce((a, id) => a + area(id), 0),
			dIntiArea: defenders.reduce((a, id) => a + area(id), 0)
		}] });
	},
	removeWar(index) {
		set((s) => ({ wars: s.wars.filter((_, i) => i !== index) }));
	},
	validateNow() {
		const repaired = applyRepair(get());
		const result = validateAoc(buildAocFile(repaired));
		set({
			validation: result,
			nations: repaired.nations,
			cities: repaired.cities
		});
		return result;
	},
	buildValidatedJson() {
		const repaired = applyRepair(get());
		const file = buildAocFile(repaired);
		const result = validateAoc(file);
		set({
			validation: result,
			nations: repaired.nations,
			cities: repaired.cities
		});
		return {
			json: serializeAoc(file),
			result
		};
	}
}));
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm text-fg", "placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40", className),
		...props
	});
}
/**
* Package a scenario the way current Ages of Conflict Mobile expects it
* inside Custom Scenarios: a folder named after the scenario containing
* the .aoc JSON plus optional flags.png / flagNames.txt.
*/
async function packageMobileScenario(scenarioName, aocJson, extras) {
	const folder = sanitizeFilename(scenarioName);
	const aocName = `${folder}.aoc`;
	const zip = new import_lib.default();
	const dir = zip.folder(folder);
	if (!dir) throw new Error("Could not create scenario folder in the zip.");
	dir.file(aocName, aocJson);
	if (extras?.flagsPng && extras.flagsPng.byteLength > 0) dir.file("flags.png", extras.flagsPng);
	if (extras?.flagNamesText) dir.file("flagNames.txt", extras.flagNamesText);
	return {
		blob: await zip.generateAsync({
			type: "blob",
			compression: "DEFLATE",
			compressionOptions: { level: 6 },
			mimeType: "application/zip"
		}),
		filename: `${folder}-aoc-mobile.zip`,
		folder,
		aocName
	};
}
function aocBlob(json, scenarioName) {
	const name = `${sanitizeFilename(scenarioName)}.aoc`;
	return {
		blob: new Blob([json], { type: "application/json" }),
		filename: name
	};
}
var MOBILE_IMPORT_STEPS = [
	{
		title: "Unzip",
		body: `Open the zip. Inside is a folder with a .aoc file written for Ages of Conflict ${AOC_VERSION}, plus flags if this map shipped with them.`
	},
	{
		title: "Copy into Custom Scenarios",
		body: "Copy the whole folder (or just the .aoc) into the game’s Custom Scenarios directory, then restart the game."
	},
	{
		title: "iOS / iPadOS",
		body: "Files → Browse → On My iPhone/iPad → Ages of Conflict → Custom Scenarios."
	},
	{
		title: "Android",
		body: "Android/data/com.JoySparkGames.AgesofConflict/files/Custom Scenarios (or the Ages of Conflict folder the game exposes in Files)."
	}
];
function ExportDock() {
	const scenarioName = useEditor((s) => s.scenarioName);
	const startingYear = useEditor((s) => s.startingYear);
	const startingMonth = useEditor((s) => s.startingMonth);
	const width = useEditor((s) => s.width);
	const height = useEditor((s) => s.height);
	const nations = useEditor((s) => s.nations);
	const validation = useEditor((s) => s.validation);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [banner, setBanner] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(null);
	const terrainRef = (0, import_react.useRef)(null);
	const readyRef = (0, import_react.useRef)(null);
	function remember(file) {
		if (readyRef.current?.href) URL.revokeObjectURL(readyRef.current.href);
		readyRef.current = file;
		setReady(file);
	}
	function failMessage(result) {
		const first = result.errors[0];
		if (!first) return "Scenario is invalid. Nothing was downloaded.";
		if (first.code === "nations") return "Add a nation and paint some land first, then download.";
		if (first.code === "capital-owner" || first.code === "capital-water") return "Capitals were off the nation's land. Paint territory, then try again — they snap automatically.";
		return first.message;
	}
	async function downloadMobile() {
		setBanner(null);
		if (useEditor.getState().nations.filter((n) => !n.destroyed).length < 1) {
			setBanner("Add a nation and paint some land first, then download.");
			return;
		}
		const { json, result } = useEditor.getState().buildValidatedJson();
		if (!result.ok) {
			setBanner(failMessage(result));
			return;
		}
		setBusy(true);
		try {
			const pack = await packageMobileScenario(useEditor.getState().scenarioName, json, {
				flagsPng: useEditor.getState().flagsPng,
				flagNamesText: useEditor.getState().flagNamesText
			});
			remember({
				href: (await saveBlob(pack.blob, pack.filename, "application/zip")).url,
				name: pack.filename,
				label: "Tap here if the download did not start"
			});
			setBanner(null);
		} catch (e) {
			setBanner(e.message);
		} finally {
			setBusy(false);
		}
	}
	async function downloadRaw() {
		setBanner(null);
		if (useEditor.getState().nations.filter((n) => !n.destroyed).length < 1) {
			setBanner("Add a nation and paint some land first, then download.");
			return;
		}
		const { json, result } = useEditor.getState().buildValidatedJson();
		if (!result.ok) {
			setBanner(failMessage(result));
			return;
		}
		const file = aocBlob(json, useEditor.getState().scenarioName);
		remember({
			href: (await saveBlob(file.blob, file.filename, "application/json")).url,
			name: file.filename,
			label: "Tap here if the download did not start"
		});
	}
	async function png(kind) {
		const s = useEditor.getState();
		const blob = kind === "terrain" ? await renderTerrainPng(s.terrain, s.width, s.height) : await renderBordersPng(s.owner, s.nations, s.width, s.height);
		const name = `${s.scenarioName}-${kind}.png`;
		remember({
			href: downloadBlob(blob, name),
			name,
			label: `Tap to save ${kind} PNG`
		});
	}
	const errors = validation?.errors ?? [];
	const warnings = validation?.warnings ?? [];
	const living = nations.filter((n) => !n.destroyed).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg text-fg",
				children: "Ages of Conflict Mobile"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: [
					"Writes a real v",
					AOC_VERSION,
					" scenario: terrain2/owner2 RLE matching current mobile, occupations, nations, capitals, cities, flags and diplomacy. Invalid files never download."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-[11px] uppercase tracking-[0.14em] text-subtle",
				children: ["Scenario name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1",
					value: scenarioName,
					onChange: (e) => useEditor.getState().setName(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-[11px] uppercase tracking-[0.14em] text-subtle",
					children: ["Year", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						type: "number",
						value: startingYear,
						onChange: (e) => useEditor.getState().setYear(Number(e.target.value))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-[11px] uppercase tracking-[0.14em] text-subtle",
					children: ["Month 0–11", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						type: "number",
						min: 0,
						max: 11,
						value: startingMonth,
						onChange: (e) => useEditor.getState().setMonth(Number(e.target.value))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tabular-nums text-subtle",
				children: [
					width,
					"×",
					height,
					" · ",
					living,
					" nations · ",
					width * height,
					" px"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full",
				size: "lg",
				disabled: busy,
				onClick: downloadMobile,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Download for Ages of Conflict Mobile"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full",
				variant: "secondary",
				disabled: busy,
				onClick: downloadRaw,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileJson, {}), "Download .aoc only"]
			}),
			ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: ready.href,
				download: ready.name,
				className: "flex h-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-bg-subtle px-4 text-sm text-fg hover:border-primary",
				children: ready.label
			}),
			banner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "alert",
				className: "flex gap-2 rounded-[var(--radius-md)] border border-danger/40 bg-danger/10 p-3 text-sm text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mt-0.5 size-4 shrink-0 text-danger" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: banner })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				variant: "ghost",
				onClick: () => useEditor.getState().validateNow(),
				children: "Validate without downloading"
			}),
			errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 rounded-[var(--radius-md)] border border-danger/40 p-3 text-sm",
				children: errors.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-danger",
					children: e.message
				}, e.code))
			}),
			warnings.length > 0 && errors.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-xs text-warn",
				children: warnings.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: w.message }, w.code))
			}),
			validation?.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-ok",
				children: [
					"Valid ",
					"4.5.0",
					" scenario. Safe to import."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.14em] text-subtle",
					children: "Put it in Custom Scenarios"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-2 text-sm leading-relaxed text-muted",
					children: MOBILE_IMPORT_STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-fg",
							children: [s.title, "."]
						}),
						" ",
						s.body
					] }, s.title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-border pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.14em] text-subtle",
						children: "Image tools"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => png("borders"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, {}), "Borders PNG"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => png("terrain"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, {}), "Terrain PNG"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => terrainRef.current?.click(),
						children: "Import terrain PNG"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: terrainRef,
						type: "file",
						accept: "image/png",
						className: "hidden",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							try {
								await useEditor.getState().importTerrainPng(file);
							} catch (err) {
								setBanner(err.message);
							}
							e.target.value = "";
						}
					})
				]
			})
		]
	});
}
function Inspector() {
	const [tab, setTab] = (0, import_react.useState)("export");
	const nations = useEditor((s) => s.nations);
	const selectedNationId = useEditor((s) => s.selectedNationId);
	const cities = useEditor((s) => s.cities);
	const alliances = useEditor((s) => s.alliances);
	const wars = useEditor((s) => s.wars);
	const nation = nations.find((n) => n.id === selectedNationId) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex min-h-0 w-full flex-col border-t border-border bg-bg-elevated md:w-[340px] md:border-l md:border-t-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex border-b border-border",
			children: [
				"nations",
				"cities",
				"diplomacy",
				"export"
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(t),
				className: `h-12 flex-1 text-[11px] font-medium uppercase tracking-[0.14em] ${tab === t ? "text-fg border-b-2 border-primary" : "text-subtle"}`,
				children: t
			}, t))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-4",
			children: [
				tab === "nations" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NationsTab, { nationId: nation?.id ?? null }),
				tab === "cities" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-1",
					children: [cities.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.n, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-xs tabular-nums text-subtle",
							children: [
								c.x,
								",",
								c.y,
								" · r ",
								c.r
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs text-muted hover:text-danger",
							onClick: () => useEditor.getState().removeCity(i),
							children: "Remove"
						})]
					}, `${c.x}-${c.y}-${i}`)), cities.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No cities yet."
					})]
				}),
				tab === "diplomacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiplomacyTab, {
					nations: nations.filter((n) => !n.destroyed).map((n) => ({
						id: n.id,
						name: n.name
					})),
					alliances,
					wars
				}),
				tab === "export" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportDock, {})
			]
		})]
	});
}
function NationsTab({ nationId }) {
	const nations = useEditor((s) => s.nations);
	const nation = nations.find((n) => n.id === nationId) ?? null;
	const [query, setQuery] = (0, import_react.useState)("");
	const [showDestroyed, setShowDestroyed] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return nations.filter((n) => {
			if (!showDestroyed && n.destroyed) return false;
			if (!q) return true;
			return n.name.toLowerCase().includes(q) || String(n.id) === q;
		});
	}, [
		nations,
		query,
		showDestroyed
	]);
	const living = nations.filter((n) => !n.destroyed).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Search nations",
				"aria-label": "Search nations"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] tabular-nums text-subtle",
				children: [
					living,
					" living · ",
					nations.length - living,
					" formable"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-48 space-y-1 overflow-y-auto",
				children: filtered.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => useEditor.getState().selectNation(n.id),
					className: `flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-left text-sm ${n.id === nationId ? "bg-bg-subtle text-fg" : "text-muted hover:text-fg"} ${n.destroyed ? "opacity-50" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-3 rounded-sm",
							style: { background: rgbCss(n.color) }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: n.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto tabular-nums text-[11px] text-subtle",
							children: n.id
						})
					]
				}, n.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: showDestroyed,
					onChange: (e) => setShowDestroyed(e.target.checked)
				}), "Show formable nations"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "sm",
				onClick: () => useEditor.getState().addNation(),
				children: "New nation"
			}),
			nation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 border-t border-border pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-[11px] uppercase tracking-[0.14em] text-subtle",
						children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: nation.name,
							onChange: (e) => useEditor.getState().updateNation(nation.id, { name: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-[11px] uppercase tracking-[0.14em] text-subtle",
						children: ["Color", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "color",
							className: "mt-1 h-11 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border bg-bg",
							value: colorToHex(nation.color),
							onChange: (e) => useEditor.getState().updateNation(nation.id, { color: hexToColor(e.target.value) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-[11px] uppercase tracking-[0.14em] text-subtle",
							children: ["Gold", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								type: "number",
								value: nation.gold,
								onChange: (e) => useEditor.getState().updateNation(nation.id, { gold: Number(e.target.value) })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-[11px] uppercase tracking-[0.14em] text-subtle",
							children: ["CE", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								type: "number",
								min: 1,
								max: 20,
								value: nation.combatEfficiency,
								onChange: (e) => useEditor.getState().updateNation(nation.id, { combatEfficiency: Number(e.target.value) })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: nation.aiDisabled,
							onChange: (e) => useEditor.getState().updateNation(nation.id, { aiDisabled: e.target.checked })
						}), "AI disabled"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: nation.ceLock,
							onChange: (e) => useEditor.getState().updateNation(nation.id, { ceLock: e.target.checked })
						}), "Lock combat efficiency"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tabular-nums text-subtle",
						children: [
							"Capital ",
							nation.capital.x,
							",",
							nation.capital.y,
							" · id ",
							nation.id
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => useEditor.getState().deleteNation(nation.id),
						children: "Delete nation"
					})
				]
			})
		]
	});
}
function DiplomacyTab({ nations, alliances, wars }) {
	const [a, setA] = (0, import_react.useState)([]);
	const [atk, setAtk] = (0, import_react.useState)([]);
	const [def, setDef] = (0, import_react.useState)([]);
	const [aname, setAname] = (0, import_react.useState)("Coalition");
	function toggle(list, id, set) {
		set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.14em] text-subtle",
				children: "Alliances"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 space-y-1 text-sm",
				children: [alliances.map((al, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						al.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-subtle",
							children: [
								"(",
								al.ids.join(", "),
								")"
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-muted hover:text-danger",
						onClick: () => useEditor.getState().removeAlliance(i),
						children: "Remove"
					})]
				}, i)), alliances.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted",
					children: "None"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-3",
				value: aname,
				onChange: (e) => setAname(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex max-h-32 flex-wrap gap-1 overflow-y-auto",
				children: nations.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => toggle(a, n.id, setA),
					className: `rounded-full px-2 py-1 text-[11px] ${a.includes(n.id) ? "bg-primary text-primary-fg" : "bg-bg-subtle text-muted"}`,
					children: n.name
				}, n.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-2",
				size: "sm",
				variant: "secondary",
				onClick: () => {
					useEditor.getState().addAlliance(a, aname);
					setA([]);
				},
				children: "Form alliance"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.14em] text-subtle",
				children: "Wars"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 space-y-1 text-sm",
				children: [wars.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						w.attackers.join(","),
						" vs ",
						w.defenders.join(",")
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-muted hover:text-danger",
						onClick: () => useEditor.getState().removeWar(i),
						children: "Remove"
					})]
				}, i)), wars.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted",
					children: "None"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[11px] text-subtle",
				children: "Attackers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 flex max-h-28 flex-wrap gap-1 overflow-y-auto",
				children: nations.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => toggle(atk, n.id, setAtk),
					className: `rounded-full px-2 py-1 text-[11px] ${atk.includes(n.id) ? "bg-danger text-fg" : "bg-bg-subtle text-muted"}`,
					children: n.name
				}, n.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[11px] text-subtle",
				children: "Defenders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 flex max-h-28 flex-wrap gap-1 overflow-y-auto",
				children: nations.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => toggle(def, n.id, setDef),
					className: `rounded-full px-2 py-1 text-[11px] ${def.includes(n.id) ? "bg-ok text-bg" : "bg-bg-subtle text-muted"}`,
					children: n.name
				}, n.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-2",
				size: "sm",
				variant: "secondary",
				onClick: () => {
					useEditor.getState().addWar(atk, def);
					setAtk([]);
					setDef([]);
				},
				children: "Declare war"
			})
		] })]
	});
}
var TERRAIN_RGB = {
	0: [
		22,
		32,
		44
	],
	1: [
		86,
		92,
		72
	],
	2: [
		120,
		132,
		138
	],
	3: [
		92,
		86,
		70
	],
	4: [
		158,
		138,
		92
	],
	5: [
		72,
		70,
		66
	],
	6: [
		48,
		72,
		52
	],
	7: [
		168,
		176,
		180
	],
	8: [
		110,
		122,
		78
	]
};
function shade(c, k) {
	return [
		Math.round(Math.min(255, c.r * 255 * k)),
		Math.round(Math.min(255, c.g * 255 * k)),
		Math.round(Math.min(255, c.b * 255 * k))
	];
}
function MapCanvas() {
	const canvasRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const view = (0, import_react.useRef)({
		scale: 1,
		panX: 0,
		panY: 0
	});
	const dragging = (0, import_react.useRef)(false);
	const panning = (0, import_react.useRef)(false);
	const last = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const space = (0, import_react.useRef)(false);
	const width = useEditor((s) => s.width);
	const height = useEditor((s) => s.height);
	const mapVersion = useEditor((s) => s.mapVersion);
	const viewMode = useEditor((s) => s.viewMode);
	const nations = useEditor((s) => s.nations);
	const cities = useEditor((s) => s.cities);
	const selectedNationId = useEditor((s) => s.selectedNationId);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			space.current = e.code === "Space" ? e.type === "keydown" : space.current;
			if (e.type === "keyup" && e.code === "Space") space.current = false;
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
				e.preventDefault();
				if (e.shiftKey) useEditor.getState().redo();
				else useEditor.getState().undo();
			}
		};
		window.addEventListener("keydown", onKey);
		window.addEventListener("keyup", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("keyup", onKey);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
		}
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const s = useEditor.getState();
		const img = ctx.createImageData(width, height);
		const d = img.data;
		const byId = new Map(s.nations.map((n) => [n.id, n]));
		const layer = s.viewMode === "cores" ? s.rightful : s.owner;
		for (let i = 0, p = 0; i < s.terrain.length; i++, p += 4) {
			const t = s.terrain[i];
			if (s.viewMode === "terrain") {
				const rgb = TERRAIN_RGB[t] ?? TERRAIN_RGB[1];
				d[p] = rgb[0];
				d[p + 1] = rgb[1];
				d[p + 2] = rgb[2];
				d[p + 3] = 255;
				continue;
			}
			if (t === TERRAIN.water) {
				d[p] = 22;
				d[p + 1] = 32;
				d[p + 2] = 44;
				d[p + 3] = 255;
				continue;
			}
			const id = layer[i];
			const n = byId.get(id);
			if (!n) {
				d[p] = 58;
				d[p + 1] = 61;
				d[p + 2] = 66;
				d[p + 3] = 255;
				continue;
			}
			const k = s.selectedNationId && s.selectedNationId !== id ? .55 : 1;
			const rgb = shade(n.color, k);
			d[p] = rgb[0];
			d[p + 1] = rgb[1];
			d[p + 2] = rgb[2];
			d[p + 3] = 255;
		}
		ctx.putImageData(img, 0, 0);
		for (const c of s.cities) {
			ctx.fillStyle = "rgb(236 232 225)";
			ctx.fillRect(c.x - 1, c.y - 1, 2, 2);
		}
		for (const n of s.nations) {
			if (n.destroyed) continue;
			const { x, y } = n.capital;
			ctx.strokeStyle = n.id === s.selectedNationId ? "rgb(236 232 225)" : "rgb(12 13 15)";
			ctx.lineWidth = 1;
			ctx.strokeRect(x - 2, y - 2, 4, 4);
		}
	}, [
		width,
		height,
		mapVersion,
		viewMode,
		nations,
		cities,
		selectedNationId
	]);
	function mapPoint(clientX, clientY) {
		const wrap = wrapRef.current;
		const canvas = canvasRef.current;
		if (!wrap || !canvas) return null;
		const rect = wrap.getBoundingClientRect();
		const v = view.current;
		const cx = clientX - rect.left - v.panX;
		const cy = clientY - rect.top - v.panY;
		const x = Math.floor(cx / v.scale);
		const y = Math.floor(cy / v.scale);
		if (x < 0 || y < 0 || x >= width || y >= height) return {
			x,
			y,
			inside: false
		};
		return {
			x,
			y,
			inside: true
		};
	}
	function applyView() {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const v = view.current;
		canvas.style.transform = `translate(${v.panX}px, ${v.panY}px) scale(${v.scale})`;
	}
	function fitView() {
		const wrap = wrapRef.current;
		if (!wrap || width < 1 || height < 1) return;
		const rect = wrap.getBoundingClientRect();
		if (rect.width < 8 || rect.height < 8) return;
		const scale = Math.max(.35, Math.min((rect.width - 36) / width, (rect.height - 36) / height));
		view.current.scale = scale;
		view.current.panX = (rect.width - width * scale) / 2;
		view.current.panY = (rect.height - height * scale) / 2;
		applyView();
	}
	(0, import_react.useEffect)(() => {
		const wrap = wrapRef.current;
		if (!wrap) return;
		const run = () => fitView();
		run();
		const ro = new ResizeObserver(run);
		ro.observe(wrap);
		return () => ro.disconnect();
	}, [width, height]);
	function onPointerDown(e) {
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
		const pan = e.button === 1 || e.button === 2 || space.current || useEditor.getState().tool === "pan";
		panning.current = pan;
		dragging.current = !pan;
		last.current = {
			x: e.clientX,
			y: e.clientY
		};
		const p = mapPoint(e.clientX, e.clientY);
		if (p?.inside && dragging.current) {
			useEditor.getState().beginStroke();
			useEditor.getState().paintAt(p.x, p.y, false);
		}
	}
	function onPointerMove(e) {
		if (panning.current) {
			view.current.panX += e.clientX - last.current.x;
			view.current.panY += e.clientY - last.current.y;
			last.current = {
				x: e.clientX,
				y: e.clientY
			};
			applyView();
			return;
		}
		const p = mapPoint(e.clientX, e.clientY);
		if (!p) return;
		useEditor.getState().setHover(p.inside ? {
			x: p.x,
			y: p.y
		} : null);
		if (dragging.current && p.inside) useEditor.getState().paintAt(p.x, p.y, true);
	}
	function onPointerUp() {
		dragging.current = false;
		panning.current = false;
		useEditor.getState().endStroke();
	}
	function onWheel(e) {
		e.preventDefault();
		const wrap = wrapRef.current;
		if (!wrap) return;
		const rect = wrap.getBoundingClientRect();
		const v = view.current;
		const mx = e.clientX - rect.left;
		const my = e.clientY - rect.top;
		const factor = e.deltaY < 0 ? 1.12 : .9;
		const next = Math.min(18, Math.max(.4, v.scale * factor));
		const k = next / v.scale;
		v.panX = mx - (mx - v.panX) * k;
		v.panY = my - (my - v.panY) * k;
		v.scale = next;
		applyView();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapRef,
		className: "relative min-h-0 flex-1 overflow-hidden bg-bg touch-none",
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel: onPointerUp,
		onContextMenu: (e) => e.preventDefault(),
		onWheel,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "pixelated origin-top-left",
			style: {
				width,
				height,
				transform: `translate(${view.current.panX}px, ${view.current.panY}px) scale(${view.current.scale})`
			}
		})
	});
}
function StartScreen() {
	const loading = useEditor((s) => s.loading);
	const loadError = useEditor((s) => s.loadError);
	const fileRef = (0, import_react.useRef)(null);
	const pngRef = (0, import_react.useRef)(null);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	async function openFile(file) {
		if (file.name.toLowerCase().endsWith(".png")) {
			await useEditor.getState().importBorderPng(file);
			return;
		}
		await useEditor.getState().importScenarioFile(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell flex min-h-dvh flex-col",
		onDragOver: (e) => {
			e.preventDefault();
			setDragOver(true);
		},
		onDragLeave: () => setDragOver(false),
		onDrop: async (e) => {
			e.preventDefault();
			setDragOver(false);
			const file = e.dataTransfer.files?.[0];
			if (file) await openFile(file);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "mx-auto flex w-full max-w-5xl items-end justify-between gap-6 px-5 pb-2 pt-8 md:pt-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.22em] text-muted",
						children: "Scenario studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl tracking-[-0.03em] text-fg md:text-5xl",
						children: "REMAP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
						children: [
							"Official Ages of Conflict world maps — 1914, 1938, 1956, 2026 and Classic. Paint over them, then download a genuine mobile",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: ".aoc"
							}),
							" (v4.5.0, terrain2/owner2, flags)."
						]
					})
				] })
			}),
			loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto w-full max-w-5xl px-5 pt-4 text-sm text-danger",
				role: "alert",
				children: loadError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative mx-auto grid w-full max-w-5xl flex-1 gap-3 px-5 py-8 md:grid-cols-2 lg:grid-cols-3",
				children: [
					TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: loading,
						onClick: () => useEditor.getState().loadTemplate(t.id),
						className: "group overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg-elevated text-left transition-colors duration-200 hover:border-border-strong hover:bg-bg-subtle disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative aspect-[2.4/1] overflow-hidden bg-bg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: t.thumbUrl,
								alt: "",
								className: "pixelated h-full w-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-100"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl text-fg",
									children: t.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] tabular-nums text-subtle",
									children: [
										t.width,
										"×",
										t.height,
										t.nations > 0 ? ` · ${t.nations} nations` : "",
										" · ",
										t.year
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted",
									children: t.blurb
								})
							]
						})]
					}, t.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-[var(--radius-xl)] border border-dashed bg-bg-elevated p-5 ${dragOver ? "border-primary" : "border-border-strong"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl text-fg",
								children: "Open existing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted",
								children: "Import a real .aoc, a Custom Scenarios zip (with flags.png), or drop a file anywhere on this page."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => fileRef.current?.click(),
									disabled: loading,
									children: "Import .aoc / zip"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => pngRef.current?.click(),
									disabled: loading,
									children: "Import border PNG"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: ".aoc,.zip,.json,application/json,application/zip,text/plain",
								className: "hidden",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									await openFile(file);
									e.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: pngRef,
								type: "file",
								accept: "image/png",
								className: "hidden",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									await openFile(file);
									e.target.value = "";
								}
							})
						]
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center bg-bg/70 text-sm text-fg",
						children: "Opening map…"
					})
				]
			})
		]
	});
}
var TOOLS = [
	{
		id: "paint",
		label: "Territory",
		icon: Paintbrush
	},
	{
		id: "cores",
		label: "Cores",
		icon: Pentagon
	},
	{
		id: "terrain",
		label: "Terrain",
		icon: Mountain
	},
	{
		id: "fill",
		label: "Fill",
		icon: Droplet
	},
	{
		id: "erase",
		label: "Erase",
		icon: Eraser
	},
	{
		id: "capital",
		label: "Capital",
		icon: Landmark
	},
	{
		id: "city",
		label: "City",
		icon: MapPinned
	},
	{
		id: "eyedropper",
		label: "Pick",
		icon: Eye
	},
	{
		id: "pan",
		label: "Pan",
		icon: Hand
	}
];
var BRUSHES = [
	1,
	2,
	3,
	5,
	8
];
var TERRAINS = [
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8
];
function Toolbar() {
	const tool = useEditor((s) => s.tool);
	const brush = useEditor((s) => s.brush);
	const terrainBrush = useEditor((s) => s.terrainBrush);
	const viewMode = useEditor((s) => s.viewMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 border-b border-border bg-bg-elevated px-3 py-3 md:border-b-0 md:border-r md:w-[76px] md:px-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1 md:flex-col md:items-center",
				children: TOOLS.map((t) => {
					const Icon = t.icon;
					const on = tool === t.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: t.label,
						"aria-label": t.label,
						"aria-pressed": on,
						onClick: () => useEditor.getState().setTool(t.id),
						className: cn("flex size-11 items-center justify-center rounded-[var(--radius-sm)] border text-muted", on ? "border-primary bg-primary text-primary-fg" : "border-transparent hover:bg-bg-subtle hover:text-fg"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-4",
							strokeWidth: 1.75
						})
					}, t.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-px w-10 bg-border md:block" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-1 md:flex-col",
				children: BRUSHES.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Brush ${b}`,
					onClick: () => useEditor.getState().setBrush(b),
					className: cn("grid size-9 place-items-center rounded-[var(--radius-xs)] text-[11px] tabular-nums", brush === b ? "bg-bg-subtle text-fg" : "text-subtle hover:text-fg"),
					children: b
				}, b))
			}),
			(tool === "terrain" || viewMode === "terrain") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1 md:flex-col",
				children: TERRAINS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: TERRAIN_LABEL[id],
					onClick: () => useEditor.getState().setTerrainBrush(id),
					className: cn("h-8 rounded-[var(--radius-xs)] px-2 text-[10px] tracking-wide md:w-full", terrainBrush === id ? "bg-primary text-primary-fg" : "text-muted hover:bg-bg-subtle hover:text-fg"),
					children: TERRAIN_LABEL[id]?.slice(0, 4)
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto hidden flex-col gap-1 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Undo",
						onClick: () => useEditor.getState().undo(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Redo",
						onClick: () => useEditor.getState().redo(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo2, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "New nation",
						onClick: () => useEditor.getState().addNation(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
					})
				]
			})
		]
	});
}
function EditorApp() {
	const ready = useEditor((s) => s.ready);
	const loading = useEditor((s) => s.loading);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorShell, { loading });
}
function EditorShell({ loading }) {
	const scenarioName = useEditor((s) => s.scenarioName);
	const status = useEditor((s) => s.status);
	const hover = useEditor((s) => s.hover);
	const width = useEditor((s) => s.width);
	const height = useEditor((s) => s.height);
	const nations = useEditor((s) => s.nations);
	const viewMode = useEditor((s) => s.viewMode);
	const selected = useEditor((s) => s.nations.find((n) => n.id === s.selectedNationId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell flex h-dvh flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-3 border-b border-border bg-bg-elevated px-3 md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "font-display text-lg tracking-tight text-fg",
						onClick: () => useEditor.setState({ ready: false }),
						children: "REMAP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden truncate text-sm text-muted sm:inline",
						children: scenarioName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "hidden sm:inline-flex",
						children: [
							width,
							"×",
							height
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "hidden md:inline-flex tabular-nums",
						children: [nations.filter((n) => !n.destroyed).length, " nations"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto flex items-center gap-1",
						children: [
							"political",
							"cores",
							"terrain"
						].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => useEditor.getState().setView(v),
							className: `h-9 rounded-full px-3 text-xs capitalize ${viewMode === v ? "bg-primary text-primary-fg" : "text-muted hover:text-fg"}`,
							children: v === "cores" ? "cores" : v
						}, v))
					})
				]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-bg-subtle px-4 py-2 text-sm text-muted",
				children: "Opening map…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col md:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-0 min-w-0 flex-1 flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCanvas, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
							className: "flex h-10 shrink-0 items-center gap-3 border-t border-border bg-bg-elevated px-3 text-[11px] tabular-nums text-subtle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hover ? `${hover.x}, ${hover.y}` : "Scroll to zoom · drag with pan or space" }),
								selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-muted",
									children: selected.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto truncate",
									children: status
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto border-t border-border bg-bg-elevated px-2 py-2 md:hidden",
				children: TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => useEditor.getState().loadTemplate(t.id),
					children: t.title
				}, t.id))
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorApp, {});
}
//#endregion
export { Home as component };
