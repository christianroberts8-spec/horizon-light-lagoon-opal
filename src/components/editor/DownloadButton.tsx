import { useEffect, useRef, useState, type MouseEvent } from "react";
import { packageMobileScenario } from "@/lib/aoc/package-mobile";
import {
  canShareFile,
  downloadBlob,
  fileFromBlob,
  inIframe,
  isAppleTouch,
  publishDownload,
} from "@/lib/utils";
import { useEditor } from "@/store/editor-store";

type Ready = { href: string; name: string; file: File; http: string | null };

export function DownloadButton() {
  const mapVersion = useEditor((s) => s.mapVersion);
  const scenarioName = useEditor((s) => s.scenarioName);
  const nations = useEditor((s) => s.nations);
  const [ready, setReady] = useState<Ready | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [saved, setSaved] = useState(false);
  const readyRef = useRef<Ready | null>(null);

  useEffect(() => {
    let live = true;
    const timer = window.setTimeout(() => {
      const living = useEditor.getState().nations.filter((n) => !n.destroyed);
      if (living.length < 1) {
        if (readyRef.current?.href) URL.revokeObjectURL(readyRef.current.href);
        readyRef.current = null;
        setReady(null);
        setError("Add a nation first");
        return;
      }
      setBusy(true);
      const { json, result } = useEditor.getState().buildValidatedJson();
      if (!live) return;
      if (!result.ok) {
        if (readyRef.current?.href) URL.revokeObjectURL(readyRef.current.href);
        readyRef.current = null;
        setReady(null);
        setError(result.errors[0]?.message ?? "Invalid scenario");
        setBusy(false);
        return;
      }
      void packageMobileScenario(useEditor.getState().scenarioName, json, {
        flagsPng: useEditor.getState().flagsPng,
        flagNamesText: useEditor.getState().flagNamesText,
        nations: living.map((n) => ({ name: n.name, color: n.color })),
      })
        .then(async (pack) => {
          if (!live) return;
          if (readyRef.current?.href) URL.revokeObjectURL(readyRef.current.href);
          const file = fileFromBlob(pack.blob, pack.filename, "application/zip");
          const href = URL.createObjectURL(pack.blob);
          const http = await publishDownload(pack.blob, pack.filename);
          if (!live) {
            URL.revokeObjectURL(href);
            return;
          }
          const next: Ready = { href, name: pack.filename, file, http };
          readyRef.current = next;
          setReady(next);
          setError(null);
          setBusy(false);
        })
        .catch((e) => {
          if (!live) return;
          setError((e as Error).message);
          setBusy(false);
        });
    }, 200);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [mapVersion, scenarioName, nations.length]);

  useEffect(() => {
    return () => {
      if (readyRef.current?.href) URL.revokeObjectURL(readyRef.current.href);
    };
  }, []);

  const saveHref = ready?.http ?? ready?.href ?? "";

  async function onGoldClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!ready) return;
    setSaved(false);
    if (canShareFile(ready.file)) {
      e.preventDefault();
      try {
        await navigator.share({
          files: [ready.file],
          title: ready.name,
          text: "Ages of Conflict Custom Scenario",
        });
        setSaved(true);
        setSheet(false);
        return;
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
      }
      downloadBlob(ready.file, ready.name);
      setSheet(true);
      return;
    }
    if (inIframe() || isAppleTouch()) setSheet(true);
  }

  if (!ready) {
    return (
      <button type="button" className="aoc-download" disabled title={error ?? "Preparing zip"}>
        <span>{busy ? "Preparing" : error ? "Fix map" : "Preparing"}</span>
        {busy ? "Scenario zip…" : error ? error : "Ages of Conflict Mobile"}
      </button>
    );
  }

  return (
    <>
      <a
        href={saveHref}
        download={ready.name}
        target="_blank"
        rel="noopener"
        onClick={onGoldClick}
        className="aoc-download"
        title={`Save ${ready.name}`}
      >
        <span>Download for</span>
        Ages of Conflict Mobile
      </a>

      {saved && (
        <span className="hidden text-xs text-ok lg:inline">Saved {ready.name}</span>
      )}

      {sheet && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-bg/80 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5 shadow-panel">
            <p className="font-display text-xl text-fg">Save scenario zip</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {ready.name} is ready. On iPad tap the button, then{" "}
              <span className="text-fg">Save to Files</span>. Put the folder in
              Ages of Conflict → Custom Scenarios.
            </p>
            <a
              href={saveHref}
              download={ready.name}
              target="_blank"
              rel="noopener"
              className="aoc-download mt-4 w-full items-center"
              onClick={async (e) => {
                if (canShareFile(ready.file)) {
                  e.preventDefault();
                  try {
                    await navigator.share({
                      files: [ready.file],
                      title: ready.name,
                    });
                    setSaved(true);
                    setSheet(false);
                    return;
                  } catch (err) {
                    if ((err as { name?: string }).name === "AbortError") return;
                  }
                }
              }}
            >
              <span>Tap to save</span>
              {ready.name}
            </a>
            <button
              type="button"
              className="mt-3 h-11 w-full text-sm text-muted"
              onClick={() => setSheet(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
