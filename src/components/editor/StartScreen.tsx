import { useEffect, useRef, useState } from "react";
import { TEMPLATES, type TemplateId } from "@/data/templates";
import { preloadOfficialMaps } from "@/data/maps/load-official";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/store/editor-store";

export function StartScreen() {
  const loading = useEditor((s) => s.loading);
  const loadError = useEditor((s) => s.loadError);
  const status = useEditor((s) => s.status);
  const fileRef = useRef<HTMLInputElement>(null);
  const pngRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const lastOpen = useRef(0);

  useEffect(() => {
    preloadOfficialMaps();
  }, []);

  async function openFile(file: File) {
    const lower = file.name.toLowerCase();
    if (lower.endsWith(".png")) {
      await useEditor.getState().importBorderPng(file);
      return;
    }
    await useEditor.getState().importScenarioFile(file);
  }

  function openTemplate(id: TemplateId) {
    const now = Date.now();
    if (now - lastOpen.current < 400) return;
    if (useEditor.getState().loading || useEditor.getState().ready) return;
    lastOpen.current = now;
    void useEditor.getState().loadTemplate(id);
  }

  return (
    <div
      className="app-shell flex min-h-dvh flex-col"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await openFile(file);
      }}
    >
      <header className="mx-auto flex w-full max-w-5xl items-end justify-between gap-6 px-5 pb-2 pt-8 md:pt-14">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
            Scenario studio
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] text-fg md:text-5xl">
            REMAP
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Tap a world map to open it. Then paint, and download a genuine mobile{" "}
            <span className="text-fg">.aoc</span> for Ages of Conflict 4.5.0.
          </p>
        </div>
      </header>

      {loadError && (
        <p className="mx-auto w-full max-w-5xl px-5 pt-4 text-sm text-danger" role="alert">
          {loadError} Tap a map to try again.
        </p>
      )}

      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-3 px-5 py-8 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            className="template-card overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg-elevated text-left"
            aria-label={`Open ${t.title}`}
            disabled={loading}
            onClick={() => openTemplate(t.id)}
            onPointerUp={(e) => {
              if (e.pointerType === "mouse" && e.button !== 0) return;
              if (e.pointerType === "touch" || e.pointerType === "pen") {
                openTemplate(t.id);
              }
            }}
          >
            <div
              className="template-thumb pixelated aspect-[2.4/1] bg-bg bg-cover bg-center"
              style={{ backgroundImage: `url(${t.thumbUrl})` }}
              aria-hidden
            />
            <div className="p-5">
              <p className="font-display text-xl text-fg">{t.title}</p>
              <p className="mt-1 text-[11px] tabular-nums text-subtle">
                {t.width}×{t.height}
                {t.nations > 0 ? ` · ${t.nations} nations` : ""} · {t.year}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t.blurb}</p>
              <span className="template-open mt-4 inline-flex h-11 items-center rounded-[var(--radius-sm)] bg-primary px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-fg">
                Tap to open
              </span>
            </div>
          </button>
        ))}
        <div
          className={`rounded-[var(--radius-xl)] border border-dashed bg-bg-elevated p-5 ${
            dragOver ? "border-primary" : "border-border-strong"
          }`}
        >
          <p className="font-display text-xl text-fg">Open existing</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Import a real .aoc, a Custom Scenarios zip (with flags.png), or drop
            a file anywhere on this page.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={() => fileRef.current?.click()}
              disabled={loading}
            >
              Import .aoc / zip
            </Button>
            <Button
              variant="ghost"
              onClick={() => pngRef.current?.click()}
              disabled={loading}
            >
              Import border PNG
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".aoc,.zip,.json,application/json,application/zip,text/plain"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await openFile(file);
              e.target.value = "";
            }}
          />
          <input
            ref={pngRef}
            type="file"
            accept="image/png"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await openFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </main>

      {loading && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-bg/80 px-6"
          role="status"
        >
          <p className="font-display text-2xl text-fg">Opening map…</p>
          <p className="max-w-sm text-center text-sm text-muted">{status}</p>
          <Button variant="secondary" onClick={() => useEditor.getState().cancelLoad()}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
