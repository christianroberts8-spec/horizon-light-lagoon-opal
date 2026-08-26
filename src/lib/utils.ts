import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadBlob(blob: Blob, filename: string): string {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.target = "_blank";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  return url;
}

export function fileFromBlob(blob: Blob, filename: string, mime: string): File {
  return new File([blob], filename, { type: mime, lastModified: Date.now() });
}

export function inIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function isAppleTouch() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function canShareFile(file: File): boolean {
  try {
    const nav = navigator as Navigator & {
      canShare?: (data: { files?: File[] }) => boolean;
    };
    return typeof nav.share === "function" && (nav.canShare ? nav.canShare({ files: [file] }) : false);
  } catch {
    return false;
  }
}

/** Upload zip so the gold button can point at a real HTTP attachment URL. */
export async function publishDownload(blob: Blob, filename: string): Promise<string | null> {
  try {
    const res = await fetch("/__aoc-download", {
      method: "POST",
      headers: { "x-filename": filename },
      body: blob,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    if (!data.url) return null;
    return `${data.url}?name=${encodeURIComponent(filename)}`;
  } catch {
    return null;
  }
}

/** iOS: share sheet → Save to Files. Else native download. Always returns a blob URL. */
export async function addScenarioFile(
  blob: Blob,
  filename: string,
  mime: string,
): Promise<{ mode: "share" | "link"; url: string; file: File }> {
  const file = fileFromBlob(blob, filename, mime);
  const url = URL.createObjectURL(blob);
  if (canShareFile(file)) {
    try {
      await navigator.share({ files: [file], title: filename });
      return { mode: "share", url, file };
    } catch (e) {
      if ((e as { name?: string }).name === "AbortError") {
        return { mode: "share", url, file };
      }
    }
  }
  downloadBlob(blob, filename);
  return { mode: "link", url, file };
}

export function sanitizeFilename(name: string) {
  const cleaned = name
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 80);
  return cleaned || "Scenario";
}

export function rgbCss(c: { r: number; g: number; b: number; a?: number }) {
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  return `rgb(${r} ${g} ${b})`;
}

export function hexToColor(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: Number.parseInt(h.slice(0, 2), 16) / 255,
    g: Number.parseInt(h.slice(2, 4), 16) / 255,
    b: Number.parseInt(h.slice(4, 6), 16) / 255,
    a: 1,
  };
}

export function colorToHex(c: { r: number; g: number; b: number }) {
  const n = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${n(c.r)}${n(c.g)}${n(c.b)}`;
}
