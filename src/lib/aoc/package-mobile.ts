import { AOC_VERSION } from "./types.ts";
import { sanitizeFilename } from "../utils.ts";
import { flagSheetSize, makeFlagNames, makeFlagSheet, validatePng } from "./flags.ts";
import type { AocColor } from "./types.ts";

export function scenarioFolderName(scenarioName: string) {
  return sanitizeFilename(scenarioName).slice(0, 35);
}

/**
 * Package the way Ages of Conflict Mobile Custom Scenarios expects:
 *   FolderName/FolderName.aoc
 *   FolderName/flags.png
 *   FolderName/flagNames.txt
 * Then download FolderName.zip — same layout as the working Websim exporter.
 */
export async function packageMobileScenario(
  scenarioName: string,
  aocJson: string,
  extras?: {
    flagsPng?: Uint8Array | null;
    flagNamesText?: string | null;
    nations?: Array<{ name: string; color: AocColor }>;
  },
): Promise<{ blob: Blob; filename: string; folder: string; aocName: string }> {
  const folder = scenarioFolderName(scenarioName);
  if (!folder) throw new Error("Scenario name contains no usable filename characters.");
  const aocName = `${folder}.aoc`;
  const nations = extras?.nations ?? [];
  const zipLib = await import("jszip");
  const JSZip = zipLib.default;

  let flagsBlob: Blob;
  if (extras?.flagsPng && extras.flagsPng.byteLength > 0) {
    flagsBlob = new Blob([Uint8Array.from(extras.flagsPng)], { type: "image/png" });
  } else {
    flagsBlob = await makeFlagSheet(nations.length ? nations : [{ name: "Nation", color: { r: 0.8, g: 0.2, b: 0.2, a: 1 } }]);
  }
  const flagNames =
    extras?.flagNamesText?.trim() ||
    makeFlagNames(nations.length ? nations : [{ name: "Nation" }]);

  const zip = new JSZip();
  const dir = zip.folder(folder);
  if (!dir) throw new Error("Could not create scenario folder in the zip.");
  dir.file(aocName, aocJson);
  dir.file("flags.png", flagsBlob);
  dir.file("flagNames.txt", flagNames);

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
    mimeType: "application/zip",
    platform: "DOS",
  });

  const audit = await JSZip.loadAsync(blob);
  const expected = [`${folder}/`, `${folder}/${aocName}`, `${folder}/flagNames.txt`, `${folder}/flags.png`].sort();
  const actual = Object.keys(audit.files).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("ZIP folder layout does not match Custom Scenarios.");
  }
  const packedAoc = await audit.file(`${folder}/${aocName}`)?.async("string");
  if (!packedAoc) throw new Error("Packaged .aoc file is missing.");
  try {
    JSON.parse(packedAoc);
  } catch {
    throw new Error("Packaged .aoc payload is not valid JSON.");
  }
  const packedFlags = await audit.file(`${folder}/flags.png`)?.async("blob");
  if (!packedFlags) throw new Error("Packaged flags.png is missing.");
  if (nations.length && !extras?.flagsPng) {
    const size = flagSheetSize(nations.length);
    const pngErrors = await validatePng(packedFlags, size.width, size.height);
    if (pngErrors.length) throw new Error(pngErrors[0]);
  }

  return {
    blob,
    filename: `${folder}.zip`,
    folder,
    aocName,
  };
}

export function aocBlob(json: string, scenarioName: string): { blob: Blob; filename: string } {
  const name = `${scenarioFolderName(scenarioName)}.aoc`;
  return {
    blob: new Blob([json], { type: "application/json" }),
    filename: name,
  };
}

export const MOBILE_IMPORT_STEPS = [
  {
    title: "Unzip",
    body: `Open the zip. Inside is a folder with a .aoc file written for Ages of Conflict ${AOC_VERSION}, plus flags.png and flagNames.txt.`,
  },
  {
    title: "Copy into Custom Scenarios",
    body: "Copy the whole folder into the game’s Custom Scenarios directory, then restart the game.",
  },
  {
    title: "iOS / iPadOS",
    body: "Files → Browse → On My iPhone/iPad → Ages of Conflict → Custom Scenarios.",
  },
  {
    title: "Android",
    body: "Android/data/com.JoySparkGames.AgesofConflict/files/Custom Scenarios (or the Ages of Conflict folder the game exposes in Files).",
  },
] as const;
