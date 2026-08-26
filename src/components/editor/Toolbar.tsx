import {
  Droplet,
  Eraser,
  Eye,
  Hand,
  Landmark,
  MapPinned,
  Paintbrush,
  Pentagon,
  Mountain,
  Undo2,
  Redo2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TERRAIN_LABEL } from "@/lib/aoc/types";
import { cn } from "@/lib/utils";
import { useEditor, type Tool } from "@/store/editor-store";

const TOOLS: Array<{ id: Tool; label: string; icon: typeof Paintbrush }> = [
  { id: "paint", label: "Territory", icon: Paintbrush },
  { id: "cores", label: "Cores", icon: Pentagon },
  { id: "terrain", label: "Terrain", icon: Mountain },
  { id: "fill", label: "Fill", icon: Droplet },
  { id: "erase", label: "Erase", icon: Eraser },
  { id: "capital", label: "Capital", icon: Landmark },
  { id: "city", label: "City", icon: MapPinned },
  { id: "eyedropper", label: "Pick", icon: Eye },
  { id: "pan", label: "Pan", icon: Hand },
];

const BRUSHES = [1, 2, 3, 5, 8];
const TERRAINS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function Toolbar() {
  const tool = useEditor((s) => s.tool);
  const brush = useEditor((s) => s.brush);
  const terrainBrush = useEditor((s) => s.terrainBrush);
  const viewMode = useEditor((s) => s.viewMode);

  return (
    <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border bg-bg-elevated px-2 py-2">
      <div className="flex items-center gap-1">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const on = tool === t.id;
          return (
            <button
              key={t.id}
              type="button"
              title={t.label}
              aria-label={t.label}
              aria-pressed={on}
              onClick={() => useEditor.getState().setTool(t.id)}
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border text-muted",
                on
                  ? "border-primary bg-primary text-primary-fg"
                  : "border-transparent hover:bg-bg-subtle hover:text-fg",
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </button>
          );
        })}
      </div>
      <div className="hidden h-8 w-px shrink-0 bg-border sm:block" />
      <div className="flex items-center gap-1">
        {BRUSHES.map((b) => (
          <button
            key={b}
            type="button"
            aria-label={`Brush ${b}`}
            onClick={() => useEditor.getState().setBrush(b)}
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-[var(--radius-xs)] text-[11px] tabular-nums",
              brush === b ? "bg-bg-subtle text-fg" : "text-subtle hover:text-fg",
            )}
          >
            {b}
          </button>
        ))}
      </div>
      {(tool === "terrain" || viewMode === "terrain") && (
        <div className="flex items-center gap-1">
          {TERRAINS.map((id) => (
            <button
              key={id}
              type="button"
              title={TERRAIN_LABEL[id]}
              onClick={() => useEditor.getState().setTerrainBrush(id)}
              className={cn(
                "h-11 shrink-0 rounded-[var(--radius-xs)] px-3 text-[10px] tracking-wide",
                terrainBrush === id
                  ? "bg-primary text-primary-fg"
                  : "text-muted hover:bg-bg-subtle hover:text-fg",
              )}
            >
              {TERRAIN_LABEL[id]?.slice(0, 4)}
            </button>
          ))}
        </div>
      )}
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Undo"
          onClick={() => useEditor.getState().undo()}
        >
          <Undo2 />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Redo"
          onClick={() => useEditor.getState().redo()}
        >
          <Redo2 />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="New nation"
          onClick={() => useEditor.getState().addNation()}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}
