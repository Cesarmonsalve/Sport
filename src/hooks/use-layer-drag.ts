"use client";

import { useCallback, useRef, useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";

const SNAP = 8;

function snapPx(n: number, enabled: boolean) {
  if (!enabled) return n;
  return Math.round(n / SNAP) * SNAP;
}

export function useLayerDrag(
  id: string,
  editable: boolean,
  posLeft?: string,
  posTop?: string,
  styleLeft?: string,
  styleTop?: string
) {
  const setPosition = useEditorStore((s) => s.setPosition);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const [guide, setGuide] = useState<{ x?: number; y?: number } | null>(null);
  const dragging = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editable) return;
      e.stopPropagation();
      setSelectedId(id);
      dragging.current = true;
      const startX = e.clientX;
      const startY = e.clientY;
      const baseLeft = parseFloat(posLeft ?? styleLeft ?? "0") || 0;
      const baseTop = parseFloat(posTop ?? styleTop ?? "0") || 0;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        const left = snapPx(baseLeft + dx, snapToGrid);
        const top = snapPx(baseTop + dy, snapToGrid);
        setGuide({ x: left, y: top });
        setPosition(id, { left: `${left}px`, top: `${top}px` });
      };
      const onUp = () => {
        dragging.current = false;
        setGuide(null);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [editable, id, posLeft, posTop, styleLeft, styleTop, snapToGrid, setPosition, setSelectedId]
  );

  return { onPointerDown, guide, isDragging: dragging.current };
}
