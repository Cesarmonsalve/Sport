"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { OverlayCanvas } from "@/components/overlay/overlay-canvas";
import { CanvasChrome } from "@/components/editor/canvas-chrome";
import { CanvasToolbar } from "@/components/editor/canvas-toolbar";
import { CanvasScaleContext } from "@/components/editor/canvas-scale-context";
import { GALLERY_DRAG_MIME } from "@/components/editor/player-gallery-panel";
import { useEditorStore } from "@/lib/store/editor-store";
import type { GalleryPlayer, Sport } from "@/types";

const CANVAS_W = 1920;
const CANVAS_H = 1080;

function rectsIntersect(
  a: { left: number; top: number; right: number; bottom: number },
  b: DOMRect
) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

interface EditorCanvasPreviewProps {
  sport: Sport;
}

export function EditorCanvasPreview({ sport }: EditorCanvasPreviewProps) {
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const placeFreeDrop = useEditorStore((s) => s.placeFreeDrop);
  const streamSafe = useEditorStore((s) => s.streamSafePreview);
  const canvasZoom = useEditorStore((s) => s.canvasZoom);
  const setCanvasZoom = useEditorStore((s) => s.setCanvasZoom);
  const canvasPan = useEditorStore((s) => s.canvasPan);
  const setCanvasPan = useEditorStore((s) => s.setCanvasPan);
  const setCanvasFitMode = useEditorStore((s) => s.setCanvasFitMode);
  const canvasFitMode = useEditorStore((s) => s.canvasFitMode);

  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  } | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const panning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const spaceHeld = useRef(false);

  const fitScale = useMemo(() => {
    if (typeof window === "undefined") return 0.5;
    const el = viewportRef.current;
    const maxW = (el?.clientWidth ?? Math.min(1100, window.innerWidth - 480)) - 48;
    const maxH = (el?.clientHeight ?? 600) - 80;
    const fitW = maxW / CANVAS_W;
    const fitH = maxH / CANVAS_H;
    return Math.min(fitW, fitH, 1);
  }, []);

  const scale = canvasFitMode === "manual" ? canvasZoom : fitScale;

  useEffect(() => {
    if (canvasFitMode === "fit" || canvasFitMode === "fit-width") {
      const s =
        canvasFitMode === "fit-width"
          ? Math.min((viewportRef.current?.clientWidth ?? 900) / CANVAS_W, 1)
          : fitScale;
      setCanvasZoom(s);
    }
  }, [canvasFitMode, fitScale, setCanvasZoom]);

  const onFit = useCallback(() => {
    setCanvasFitMode("fit");
    setCanvasZoom(fitScale);
    setCanvasPan({ x: 0, y: 0 });
  }, [fitScale, setCanvasFitMode, setCanvasPan, setCanvasZoom]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target as HTMLElement)?.closest("input,textarea,select")) {
        spaceHeld.current = true;
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") spaceHeld.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setCanvasFitMode("manual");
      setCanvasZoom(
        Math.min(2, Math.max(0.25, useEditorStore.getState().canvasZoom - e.deltaY * 0.001))
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setCanvasFitMode, setCanvasZoom]);

  const onCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData(GALLERY_DRAG_MIME);
      if (!raw || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      try {
        const player = JSON.parse(raw) as GalleryPlayer;
        placeFreeDrop(player, Math.max(0, x - 48), Math.max(0, y - 48));
      } catch {
        /* ignore */
      }
    },
    [placeFreeDrop, scale]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes(GALLERY_DRAG_MIME)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const onViewportPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (spaceHeld.current && e.button === 0) {
        panning.current = true;
        panStart.current = {
          x: e.clientX,
          y: e.clientY,
          panX: canvasPan.x,
          panY: canvasPan.y,
        };
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        return;
      }
      if (!e.shiftKey || e.button !== 0) return;
      if ((e.target as HTMLElement).closest("[data-editable]")) return;
      origin.current = { x: e.clientX, y: e.clientY };
      setBox({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY });

      const onMove = (ev: PointerEvent) => {
        if (!origin.current) return;
        setBox({
          x0: origin.current.x,
          y0: origin.current.y,
          x1: ev.clientX,
          y1: ev.clientY,
        });
      };
      const onUp = (ev: PointerEvent) => {
        if (!origin.current) return;
        const sel = {
          left: Math.min(origin.current.x, ev.clientX),
          top: Math.min(origin.current.y, ev.clientY),
          right: Math.max(origin.current.x, ev.clientX),
          bottom: Math.max(origin.current.y, ev.clientY),
        };
        const ids: string[] = [];
        document.querySelectorAll("[data-widget-id]").forEach((el) => {
          const id = el.getAttribute("data-widget-id");
          if (id && rectsIntersect(sel, el.getBoundingClientRect())) ids.push(id);
        });
        if (ids.length) setSelectedIds([...new Set(ids)]);
        origin.current = null;
        setBox(null);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [canvasPan.x, canvasPan.y, setSelectedIds]
  );

  const onViewportPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!panning.current) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setCanvasPan({
        x: panStart.current.panX + dx,
        y: panStart.current.panY + dy,
      });
    },
    [setCanvasPan]
  );

  const onViewportPointerUp = useCallback(() => {
    panning.current = false;
  }, []);

  const selBox = box
    ? {
        left: Math.min(box.x0, box.x1),
        top: Math.min(box.y0, box.y1),
        width: Math.abs(box.x1 - box.x0),
        height: Math.abs(box.y1 - box.y0),
      }
    : null;

  return (
    <div className="relative flex flex-1 flex-col min-h-0 ss-editor-viewport">
      <div
        ref={viewportRef}
        className="flex flex-1 items-center justify-center overflow-auto p-8"
        style={{ cursor: spaceHeld.current ? "grab" : undefined }}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={onViewportPointerUp}
      >
        <motion.div
          layout
          className="relative shrink-0 ss-editor-canvas-card"
          style={{
            width: CANVAS_W * scale,
            height: CANVAS_H * scale,
            transform: `translate(${canvasPan.x}px, ${canvasPan.y}px)`,
          }}
        >
          <CanvasScaleContext.Provider value={scale}>
            <div
              ref={canvasRef}
              className="relative overflow-hidden rounded-[11px] bg-zinc-950"
              style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}
              onDrop={onCanvasDrop}
              onDragOver={onDragOver}
            >
              <CanvasChrome scale={scale} />
              <OverlayCanvas
                sport={sport}
                scale={scale}
                interactive
                streamSafePreview={streamSafe}
              />
            </div>
          </CanvasScaleContext.Provider>
        </motion.div>
        {selBox && (
          <div
            className="pointer-events-none fixed z-[9999] border border-primary bg-primary/10"
            style={selBox}
          />
        )}
      </div>
      <CanvasToolbar
        onFit={onFit}
        onOpenShortcuts={() => window.dispatchEvent(new CustomEvent("editor:toggle-shortcuts"))}
      />
    </div>
  );
}
