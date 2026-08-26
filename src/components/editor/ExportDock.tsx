import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Download, FileJson, Image as ImageIcon, ShieldAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AOC_VERSION } from "@/lib/aoc/types";
import { aocBlob, MOBILE_IMPORT_STEPS, packageMobileScenario } from "@/lib/aoc/package-mobile";
import { renderBordersPng, renderTerrainPng } from "@/lib/map/png";
import { addScenarioFile, canShareFile, cn, downloadBlob, fileFromBlob } from "@/lib/utils";
import { useEditor } from "@/store/editor-store";

type ReadyZip = { href: string; name: string; file: File };

export function ExportDock() {
  const scenarioName = useEditor((s) => s.scenarioName);
  const startingYear = useEditor((s) => s.startingYear);
  const startingMonth = useEditor((s) => s.startingMonth);
  const width = useEditor((s) => s.width);
  const height = useEditor((s) => s.height);
  const nations = useEditor((s) => s.nations);
  const mapVersion = useEditor((s) => s.mapVersion);
  const validation = useEditor((s) => s.validation);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [zip, setZip] = useState<ReadyZip | null>(null);
  const [raw, setRaw] = useState<ReadyZip | null>(null);
  const terrainRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<ReadyZip | null>(null);
  const rawRef = useRef<ReadyZip | null>(null);

  function drop(current: ReadyZip | null) {
    if (current?.href) URL.revokeObjectURL(current.href);
  }

  useEffect(() => {
    let live = true;
    const timer = window.setTimeout(() => {
      const living = useEditor.getState().nations.filter((n) => !n.destroyed);
      if (living.length < 1) {
        drop(zipRef.current);
        zipRef.current = null;
        setZip(null);
        return;
      }
      setBusy(true);
      try {
        const { json, result } = useEditor.getState().buildValidatedJson();
        if (!live) return;
        if (!result.ok) {
          drop(zipRef.current);
          zipRef.current = null;
          setZip(null);
          setRaw(null);
          setBusy(false);
          return;
        }
        void packageMobileScenario(useEditor.getState().scenarioName, json, {
          flagsPng: useEditor.getState().flagsPng,
          flagNamesText: useEditor.getState().flagNamesText,
          nations: living.map((n) => ({ name: n.name, color: n.color })),
        }).then((pack) => {
          if (!live) return;
          drop(zipRef.current);
          const next: ReadyZip = {
            href: URL.createObjectURL(pack.blob),
            name: pack.filename,
            file: fileFromBlob(pack.blob, pack.filename, "application/zip"),
          };
          zipRef.current = next;
          setZip(next);
          const aoc = aocBlob(json, useEditor.getState().scenarioName);
          drop(rawRef.current);
          const nextRaw: ReadyZip = {
            href: URL.createObjectURL(aoc.blob),
            name: aoc.filename,
            file: fileFromBlob(aoc.blob, aoc.filename, "application/json"),
          };
          rawRef.current = nextRaw;
          setRaw(nextRaw);
          setBusy(false);
        }).catch((e) => {
          if (!live) return;
          setBanner((e as Error).message);
          setBusy(false);
        });
      } catch (e) {
        if (!live) return;
        setBanner((e as Error).message);
        setBusy(false);
      }
    }, 180);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [mapVersion, scenarioName, nations.length]);

  useEffect(() => {
    return () => {
      drop(zipRef.current);
      drop(rawRef.current);
    };
  }, []);

  async function onAddZip(e: MouseEvent<HTMLAnchorElement>) {
    if (!zip) return;
    if (!canShareFile(zip.file)) return;
    e.preventDefault();
    try {
      await navigator.share({ files: [zip.file], title: zip.name });
      setBanner(null);
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      downloadBlob(zip.file, zip.name);
    }
  }

  async function onAddRaw(e: MouseEvent<HTMLAnchorElement>) {
    if (!raw) return;
    if (!canShareFile(raw.file)) return;
    e.preventDefault();
    try {
      await navigator.share({ files: [raw.file], title: raw.name });
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      downloadBlob(raw.file, raw.name);
    }
  }

  async function png(kind: "terrain" | "borders") {
    const s = useEditor.getState();
    const blob =
      kind === "terrain"
        ? await renderTerrainPng(s.terrain, s.width, s.height)
        : await renderBordersPng(s.owner, s.nations, s.width, s.height);
    const name = `${s.scenarioName}-${kind}.png`;
    await addScenarioFile(blob, name, "image/png");
  }

  const errors = validation?.errors ?? [];
  const warnings = validation?.warnings ?? [];
  const living = nations.filter((n) => !n.destroyed).length;
  const shareHint = zip && canShareFile(zip.file);

  return (
    <div className="space-y-4">
      <div>
        <p className="font-display text-lg text-fg">Ages of Conflict Mobile</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Tap to add a Custom Scenarios zip (v{AOC_VERSION} .aoc + flags). On iPad
          choose Save to Files. Invalid maps never download.
        </p>
      </div>

      <label className="block text-[11px] uppercase tracking-[0.14em] text-subtle">
        Scenario name
        <Input
          className="mt-1"
          value={scenarioName}
          onChange={(e) => useEditor.getState().setName(e.target.value)}
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[11px] uppercase tracking-[0.14em] text-subtle">
          Year
          <Input
            className="mt-1"
            type="number"
            value={startingYear}
            onChange={(e) => useEditor.getState().setYear(Number(e.target.value))}
          />
        </label>
        <label className="text-[11px] uppercase tracking-[0.14em] text-subtle">
          Month 0–11
          <Input
            className="mt-1"
            type="number"
            min={0}
            max={11}
            value={startingMonth}
            onChange={(e) => useEditor.getState().setMonth(Number(e.target.value))}
          />
        </label>
      </div>

      <p className="text-xs tabular-nums text-subtle">
        {width}×{height} · {living} nations · {width * height} px
      </p>

      {zip ? (
        <a
          href={zip.href}
          download={zip.name}
          type="application/zip"
          onClick={onAddZip}
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          <Download />
          Add scenario zip
        </a>
      ) : (
        <Button className="w-full" size="lg" disabled>
          <Download />
          {busy ? "Preparing zip…" : living < 1 ? "Paint a nation first" : "Preparing zip…"}
        </Button>
      )}

      {raw ? (
        <a
          href={raw.href}
          download={raw.name}
          onClick={onAddRaw}
          className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
        >
          <FileJson />
          Add .aoc only
        </a>
      ) : (
        <Button className="w-full" variant="secondary" disabled>
          <FileJson />
          Add .aoc only
        </Button>
      )}

      {zip && (
        <p className="text-sm text-muted">
          {shareHint
            ? "Tap Add scenario zip, then Save to Files."
            : `Your file is ready: ${zip.name}. Tap the button to download it.`}
        </p>
      )}

      {banner && (
        <div
          role="alert"
          className="flex gap-2 rounded-[var(--radius-md)] border border-danger/40 bg-danger/10 p-3 text-sm text-fg"
        >
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-danger" />
          <p>{banner}</p>
        </div>
      )}

      <Button
        className="w-full"
        variant="ghost"
        onClick={() => useEditor.getState().validateNow()}
      >
        Validate without downloading
      </Button>

      {errors.length > 0 && (
        <ul className="space-y-1 rounded-[var(--radius-md)] border border-danger/40 p-3 text-sm">
          {errors.map((e) => (
            <li key={e.code} className="text-danger">
              {e.message}
            </li>
          ))}
        </ul>
      )}
      {warnings.length > 0 && errors.length === 0 && (
        <ul className="space-y-1 text-xs text-warn">
          {warnings.map((w) => (
            <li key={w.code}>{w.message}</li>
          ))}
        </ul>
      )}
      {validation?.ok && (
        <p className="text-sm text-ok">Valid {AOC_VERSION} scenario. Safe to import.</p>
      )}

      <div className="space-y-2 border-t border-border pt-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">
          Put it in Custom Scenarios
        </p>
        <ol className="space-y-2 text-sm leading-relaxed text-muted">
          {MOBILE_IMPORT_STEPS.map((s) => (
            <li key={s.title}>
              <span className="text-fg">{s.title}.</span> {s.body}
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">
          Image tools
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={() => png("borders")}>
            <ImageIcon />
            Borders PNG
          </Button>
          <Button variant="secondary" size="sm" onClick={() => png("terrain")}>
            <ImageIcon />
            Terrain PNG
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => terrainRef.current?.click()}>
          Import terrain PNG
        </Button>
        <input
          ref={terrainRef}
          type="file"
          accept="image/png"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              await useEditor.getState().importTerrainPng(file);
            } catch (err) {
              setBanner((err as Error).message);
            }
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
