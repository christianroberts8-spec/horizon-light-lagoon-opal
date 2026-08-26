import { lazy, Suspense, useState } from "react";
import { TEMPLATES, type TemplateId } from "@/data/templates";
import { Badge } from "@/components/ui/badge";
import { useEditor } from "@/store/editor-store";
import { Inspector } from "./Inspector";
import { MapCanvas } from "./MapCanvas";
import { StartScreen } from "./StartScreen";
import { Toolbar } from "./Toolbar";

const DownloadButton = lazy(() =>
  import("./DownloadButton").then((m) => ({ default: m.DownloadButton })),
);

export function EditorApp() {
  const ready = useEditor((s) => s.ready);
  const loading = useEditor((s) => s.loading);
  if (!ready) return <StartScreen />;
  return <EditorShell loading={loading} />;
}

function MapPicker() {
  const [open, setOpen] = useState(false);
  const scenarioName = useEditor((s) => s.scenarioName);
  const current = TEMPLATES.find((t) => t.title === scenarioName);

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="World map"
        onPointerDown={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="h-11 min-w-[8.5rem] rounded-[var(--radius-sm)] border border-border bg-bg-subtle px-3 text-left text-sm text-fg"
      >
        {current?.title ?? scenarioName}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close map list"
            className="fixed inset-0 z-40 cursor-default"
            onPointerDown={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          />
          <ul
            role="listbox"
            className="absolute left-0 top-full z-50 mt-1 min-w-[14rem] rounded-[var(--radius-md)] border border-border bg-bg-elevated p-1 shadow-panel"
          >
          {TEMPLATES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                role="option"
                aria-selected={t.title === scenarioName}
                className="flex h-11 w-full items-center rounded-[var(--radius-sm)] px-3 text-left text-sm text-fg hover:bg-bg-subtle"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  void useEditor.getState().loadTemplate(t.id as TemplateId);
                }}
              >
                {t.title}
              </button>
            </li>
          ))}
          </ul>
        </>
      )}
    </div>
  );
}

function EditorShell({ loading }: { loading: boolean }) {
  const scenarioName = useEditor((s) => s.scenarioName);
  const status = useEditor((s) => s.status);
  const hover = useEditor((s) => s.hover);
  const width = useEditor((s) => s.width);
  const height = useEditor((s) => s.height);
  const nations = useEditor((s) => s.nations);
  const viewMode = useEditor((s) => s.viewMode);
  const selected = useEditor((s) => s.nations.find((n) => n.id === s.selectedNationId));

  return (
    <div className="app-shell flex h-dvh flex-col overflow-hidden">
      <header className="flex min-h-14 shrink-0 items-center gap-2 border-b border-border bg-bg-elevated px-3 md:gap-3 md:px-4">
        <button
          type="button"
          className="font-display text-lg tracking-tight text-fg"
          onClick={() => useEditor.setState({ ready: false })}
        >
          REMAP
        </button>
        <MapPicker />
        <span className="hidden truncate text-sm text-muted lg:inline">{scenarioName}</span>
        <Badge className="hidden sm:inline-flex tabular-nums">
          {width}×{height}
        </Badge>
        <Badge className="hidden md:inline-flex tabular-nums">
          {nations.filter((n) => !n.destroyed).length} nations
        </Badge>
        <div className="ml-auto flex items-center gap-1">
          {(["political", "cores", "terrain"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                useEditor.getState().setView(v);
              }}
              className={`hidden h-11 rounded-full px-3 text-xs capitalize sm:inline ${
                viewMode === v ? "bg-primary text-primary-fg" : "text-muted hover:text-fg"
              }`}
            >
              {v === "cores" ? "cores" : v}
            </button>
          ))}
          <Suspense
            fallback={
              <span className="aoc-download" aria-hidden>
                <span>Download for</span>
                Ages of Conflict Mobile
              </span>
            }
          >
            <DownloadButton />
          </Suspense>
        </div>
      </header>

      {loading && (
        <div className="border-b border-border bg-bg-subtle px-4 py-2 text-sm text-muted">
          Opening map…
        </div>
      )}

      <MapCanvas />

      <Toolbar />

      <footer className="flex h-8 shrink-0 items-center gap-3 border-b border-border bg-bg-elevated px-3 text-[11px] tabular-nums text-subtle">
        <span>
          {hover ? `${hover.x}, ${hover.y}` : "Scroll to zoom · double-tap to fit"}
        </span>
        {selected && <span className="truncate text-muted">{selected.name}</span>}
        <span className="ml-auto truncate">{status}</span>
      </footer>

      <Inspector />
    </div>
  );
}
