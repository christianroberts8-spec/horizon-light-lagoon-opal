import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { colorToHex, hexToColor, rgbCss } from "@/lib/utils";
import { useEditor } from "@/store/editor-store";
import { ExportDock } from "./ExportDock";

type Tab = "nations" | "cities" | "diplomacy" | "export";

export function Inspector() {
  const [tab, setTab] = useState<Tab>("export");
  const nations = useEditor((s) => s.nations);
  const selectedNationId = useEditor((s) => s.selectedNationId);
  const cities = useEditor((s) => s.cities);
  const alliances = useEditor((s) => s.alliances);
  const wars = useEditor((s) => s.wars);
  const nation = nations.find((n) => n.id === selectedNationId) ?? null;
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "nations", label: "Nations" },
    { id: "cities", label: "Cities" },
    { id: "diplomacy", label: "Diplomacy" },
    { id: "export", label: "Export" },
  ];

  return (
    <aside className="relative z-20 flex min-h-0 w-full flex-1 flex-col border-t border-border bg-bg-elevated">
      <div role="tablist" aria-label="Editor panels" className="flex shrink-0 border-b border-border">
        {tabs.map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              className={`h-12 min-h-11 flex-1 touch-manipulation px-1 text-xs font-medium capitalize ${
                on ? "border-b-2 border-primary text-fg" : "text-subtle"
              }`}
              onPointerDown={(e) => {
                e.preventDefault();
                setTab(t.id);
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        id={`panel-${tab}`}
        role="tabpanel"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"
      >
        {tab === "nations" && <NationsTab nationId={nation?.id ?? null} />}
        {tab === "cities" && (
          <ul className="space-y-1">
            {cities.map((c, i) => (
              <li
                key={`${c.x}-${c.y}-${i}`}
                className="flex min-h-11 items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm"
              >
                <span>
                  {c.n}
                  <span className="ml-2 text-xs tabular-nums text-subtle">
                    {c.x},{c.y} · r {c.r}
                  </span>
                </span>
                <button
                  type="button"
                  className="h-11 px-3 text-xs text-muted hover:text-danger"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    useEditor.getState().removeCity(i);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
            {cities.length === 0 && <p className="text-sm text-muted">No cities yet.</p>}
          </ul>
        )}
        {tab === "diplomacy" && (
          <DiplomacyTab
            nations={nations
              .filter((n) => !n.destroyed)
              .map((n) => ({ id: n.id, name: n.name }))}
            alliances={alliances}
            wars={wars}
          />
        )}
        {tab === "export" && <ExportDock />}
      </div>
    </aside>
  );
}

function NationsTab({ nationId }: { nationId: number | null }) {
  const nations = useEditor((s) => s.nations);
  const nation = nations.find((n) => n.id === nationId) ?? null;
  const [query, setQuery] = useState("");
  const [showDestroyed, setShowDestroyed] = useState(false);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nations.filter((n) => {
      if (!showDestroyed && n.destroyed) return false;
      if (!q) return true;
      return n.name.toLowerCase().includes(q) || String(n.id) === q;
    });
  }, [nations, query, showDestroyed]);
  const living = nations.filter((n) => !n.destroyed).length;

  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search nations"
        aria-label="Search nations"
      />
      <p className="text-[11px] tabular-nums text-subtle">
        {living} living · {nations.length - living} formable
      </p>
      <div className="space-y-1 overflow-y-auto">
        {filtered.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => useEditor.getState().selectNation(n.id)}
            className={`flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-left text-sm ${
              n.id === nationId ? "bg-bg-subtle text-fg" : "text-muted hover:text-fg"
            } ${n.destroyed ? "opacity-50" : ""}`}
          >
            <span
              className="size-3 rounded-sm"
              style={{ background: rgbCss(n.color) }}
            />
            <span className="truncate">{n.name}</span>
            <span className="ml-auto tabular-nums text-[11px] text-subtle">{n.id}</span>
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={showDestroyed}
          onChange={(e) => setShowDestroyed(e.target.checked)}
        />
        Show formable nations
      </label>
      <Button variant="secondary" size="sm" onClick={() => useEditor.getState().addNation()}>
        New nation
      </Button>
      {nation && (
        <div className="space-y-3 border-t border-border pt-4">
          <label className="block text-[11px] uppercase tracking-[0.14em] text-subtle">
            Name
            <Input
              className="mt-1"
              value={nation.name}
              onChange={(e) =>
                useEditor.getState().updateNation(nation.id, { name: e.target.value })
              }
            />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.14em] text-subtle">
            Color
            <input
              type="color"
              className="mt-1 h-11 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border bg-bg"
              value={colorToHex(nation.color)}
              onChange={(e) =>
                useEditor.getState().updateNation(nation.id, {
                  color: hexToColor(e.target.value),
                })
              }
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] uppercase tracking-[0.14em] text-subtle">
              Gold
              <Input
                className="mt-1"
                type="number"
                value={nation.gold}
                onChange={(e) =>
                  useEditor.getState().updateNation(nation.id, {
                    gold: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="text-[11px] uppercase tracking-[0.14em] text-subtle">
              CE
              <Input
                className="mt-1"
                type="number"
                min={1}
                max={20}
                value={nation.combatEfficiency}
                onChange={(e) =>
                  useEditor.getState().updateNation(nation.id, {
                    combatEfficiency: Number(e.target.value),
                  })
                }
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={nation.aiDisabled}
              onChange={(e) =>
                useEditor.getState().updateNation(nation.id, {
                  aiDisabled: e.target.checked,
                })
              }
            />
            AI disabled
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={nation.ceLock}
              onChange={(e) =>
                useEditor.getState().updateNation(nation.id, { ceLock: e.target.checked })
              }
            />
            Lock combat efficiency
          </label>
          <p className="text-xs tabular-nums text-subtle">
            Capital {nation.capital.x},{nation.capital.y} · id {nation.id}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => useEditor.getState().deleteNation(nation.id)}
          >
            Delete nation
          </Button>
        </div>
      )}
    </div>
  );
}

function DiplomacyTab({
  nations,
  alliances,
  wars,
}: {
  nations: Array<{ id: number; name: string }>;
  alliances: Array<{ name: string; ids: number[] }>;
  wars: Array<{ attackers: number[]; defenders: number[] }>;
}) {
  const [a, setA] = useState<number[]>([]);
  const [atk, setAtk] = useState<number[]>([]);
  const [def, setDef] = useState<number[]>([]);
  const [aname, setAname] = useState("Coalition");

  function toggle(list: number[], id: number, set: (n: number[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">Alliances</p>
        <ul className="mt-2 space-y-1 text-sm">
          {alliances.map((al, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span>
                {al.name}{" "}
                <span className="text-subtle">({al.ids.join(", ")})</span>
              </span>
              <button
                type="button"
                className="text-xs text-muted hover:text-danger"
                onClick={() => useEditor.getState().removeAlliance(i)}
              >
                Remove
              </button>
            </li>
          ))}
          {alliances.length === 0 && <li className="text-muted">None</li>}
        </ul>
        <Input className="mt-3" value={aname} onChange={(e) => setAname(e.target.value)} />
        <div className="mt-2 flex max-h-32 flex-wrap gap-1 overflow-y-auto">
          {nations.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => toggle(a, n.id, setA)}
              className={`rounded-full px-2 py-1 text-[11px] ${
                a.includes(n.id) ? "bg-primary text-primary-fg" : "bg-bg-subtle text-muted"
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>
        <Button
          className="mt-2"
          size="sm"
          variant="secondary"
          onClick={() => {
            useEditor.getState().addAlliance(a, aname);
            setA([]);
          }}
        >
          Form alliance
        </Button>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">Wars</p>
        <ul className="mt-2 space-y-1 text-sm">
          {wars.map((w, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span>
                {w.attackers.join(",")} vs {w.defenders.join(",")}
              </span>
              <button
                type="button"
                className="text-xs text-muted hover:text-danger"
                onClick={() => useEditor.getState().removeWar(i)}
              >
                Remove
              </button>
            </li>
          ))}
          {wars.length === 0 && <li className="text-muted">None</li>}
        </ul>
        <p className="mt-3 text-[11px] text-subtle">Attackers</p>
        <div className="mt-1 flex max-h-28 flex-wrap gap-1 overflow-y-auto">
          {nations.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => toggle(atk, n.id, setAtk)}
              className={`rounded-full px-2 py-1 text-[11px] ${
                atk.includes(n.id) ? "bg-danger text-fg" : "bg-bg-subtle text-muted"
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-subtle">Defenders</p>
        <div className="mt-1 flex max-h-28 flex-wrap gap-1 overflow-y-auto">
          {nations.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => toggle(def, n.id, setDef)}
              className={`rounded-full px-2 py-1 text-[11px] ${
                def.includes(n.id) ? "bg-ok text-bg" : "bg-bg-subtle text-muted"
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>
        <Button
          className="mt-2"
          size="sm"
          variant="secondary"
          onClick={() => {
            useEditor.getState().addWar(atk, def);
            setAtk([]);
            setDef([]);
          }}
        >
          Declare war
        </Button>
      </div>
    </div>
  );
}
