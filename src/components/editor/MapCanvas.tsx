import { useEffect, useRef } from "react";
import { TERRAIN } from "@/lib/aoc/types";
import { useEditor } from "@/store/editor-store";

const TERRAIN_RGB: Record<number, [number, number, number]> = {
  0: [22, 32, 44],
  1: [86, 92, 72],
  2: [120, 132, 138],
  3: [92, 86, 70],
  4: [158, 138, 92],
  5: [72, 70, 66],
  6: [48, 72, 52],
  7: [168, 176, 180],
  8: [110, 122, 78],
};

function shade(c: { r: number; g: number; b: number }, k: number): [number, number, number] {
  return [
    Math.round(Math.min(255, c.r * 255 * k)),
    Math.round(Math.min(255, c.g * 255 * k)),
    Math.round(Math.min(255, c.b * 255 * k)),
  ];
}

export function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoom = useRef({ scale: 1, panX: 0, panY: 0 });
  const dragging = useRef(false);
  const panning = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const space = useRef(false);

  const width = useEditor((s) => s.width);
  const height = useEditor((s) => s.height);
  const mapVersion = useEditor((s) => s.mapVersion);
  const viewMode = useEditor((s) => s.viewMode);
  const nations = useEditor((s) => s.nations);
  const cities = useEditor((s) => s.cities);
  const selectedNationId = useEditor((s) => s.selectedNationId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  useEffect(() => {
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
      const k = s.selectedNationId && s.selectedNationId !== id ? 0.55 : 1;
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
  }, [width, height, mapVersion, viewMode, nations, cities, selectedNationId]);

  function mapPoint(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return null;
    const x = Math.floor(((clientX - rect.left) / rect.width) * width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * height);
    if (x < 0 || y < 0 || x >= width || y >= height) return { x, y, inside: false };
    return { x, y, inside: true };
  }

  function applyZoom() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const z = zoom.current;
    if (z.scale === 1 && z.panX === 0 && z.panY === 0) {
      canvas.style.transform = "";
      return;
    }
    canvas.style.transform = `translate(${z.panX}px, ${z.panY}px) scale(${z.scale})`;
  }

  function fitView() {
    zoom.current = { scale: 1, panX: 0, panY: 0 };
    applyZoom();
  }

  useEffect(() => {
    fitView();
  }, [width, height]);

  function onPointerDown(e: React.PointerEvent) {
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* capture is optional — some hosts reject synthetic/iframe pointers */
    }
    const pan = e.button === 1 || e.button === 2 || space.current || useEditor.getState().tool === "pan";
    panning.current = pan;
    dragging.current = !pan;
    last.current = { x: e.clientX, y: e.clientY };
    const p = mapPoint(e.clientX, e.clientY);
    if (p?.inside && dragging.current) {
      useEditor.getState().beginStroke();
      useEditor.getState().paintAt(p.x, p.y, false);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (panning.current) {
      zoom.current.panX += e.clientX - last.current.x;
      zoom.current.panY += e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      applyZoom();
      return;
    }
    const p = mapPoint(e.clientX, e.clientY);
    if (!p) return;
    useEditor.getState().setHover(p.inside ? { x: p.x, y: p.y } : null);
    if (dragging.current && p.inside) {
      useEditor.getState().paintAt(p.x, p.y, true);
    }
  }

  function onPointerUp() {
    dragging.current = false;
    panning.current = false;
    useEditor.getState().endStroke();
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const z = zoom.current;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.12 : 0.9;
    const next = Math.min(8, Math.max(1, z.scale * factor));
    const k = next / z.scale;
    z.panX = mx - (mx - z.panX) * k;
    z.panY = my - (my - z.panY) * k;
    z.scale = next;
    if (next === 1) {
      z.panX = 0;
      z.panY = 0;
    }
    applyZoom();
  }

  function onDoubleClick() {
    fitView();
  }

  return (
    <div
      className="map-stage"
      style={
        {
          "--map-w": width,
          "--map-h": height,
          "--map-max-h": "min(40dvh, calc(100dvh - 20rem))",
        } as React.CSSProperties
      }
    >
      <div
        ref={wrapRef}
        className="map-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        onContextMenu={(e) => e.preventDefault()}
        onWheel={onWheel}
      >
        <canvas
          ref={canvasRef}
          className="pixelated"
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}
