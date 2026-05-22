"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { OverlayCanvas } from "@/components/overlay/overlay-canvas";
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
  const showHints = useEditorStore((s) => s.showEditorHints);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  } | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const scale = useMemo(() => {
    if (typeof window === "undefined") return 0.5;
    const maxW = Math.min(1100, window.innerWidth - 480);
    return Math.min(maxW / CANVAS_W, 0.55);
  }, []);

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

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
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
    [setSelectedIds]
  );

  const selBox = box
    ? {
        left: Math.min(box.x0, box.x1),
        top: Math.min(box.y0, box.y1),
        width: Math.abs(box.x1 - box.x0),
        height: Math.abs(box.y1 - box.y0),
      }
    : null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#06070a] p-4">
      {showHints && (
        <p className="mb-2 max-w-lg text-center text-[10px] text-muted-foreground">
          Galería colapsable en sidebar · suelta foto en cualquier punto del canvas · Ctrl+Z deshacer
        </p>
      )}
      <motion.div
        layout
        className="relative rounded-lg border border-border shadow-2xl"
        style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}
        onPointerDown={onPointerDown}
      >
        <div
          ref={canvasRef}
          className="relative overflow-hidden rounded-lg bg-black/40"
          style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}
          onDrop={onCanvasDrop}
          onDragOver={onDragOver}
        >
          <OverlayCanvas
            sport={sport}
            scale={scale}
            interactive
            streamSafePreview={streamSafe}
          />
        </div>
        {selBox && (
          <div
            className="pointer-events-none fixed z-[9999] border border-primary bg-primary/10"
            style={selBox}
          />
        )}
        <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-muted-foreground">
          Suelta foto libre · Shift+box · Ctrl+Z/Y undo
        </div>
      </motion.div>
    </div>
  );
}
