"use client";

import { useCallback, useRef, useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";

const SNAP = 8;
const SNAP_DIST = 6;

function snapPx(n: number, enabled: boolean) {
  if (!enabled) return n;
  return Math.round(n / SNAP) * SNAP;
}

function snapToPeers(
  id: string,
  left: number,
  top: number,
  positions: Record<string, { left: string; top: string }>
): { left: number; top: number; guide?: { x?: number; y?: number } } {
  let bestL = left;
  let bestT = top;
  let guideX: number | undefined;
  let guideY: number | undefined;

  for (const [oid, pos] of Object.entries(positions)) {
    if (oid === id) continue;
    const ol = parseFloat(pos.left) || 0;
    const ot = parseFloat(pos.top) || 0;
    if (Math.abs(left - ol) < SNAP_DIST) {
      bestL = ol;
      guideX = ol;
    }
    if (Math.abs(top - ot) < SNAP_DIST) {
      bestT = ot;
      guideY = ot;
    }
  }
  return { left: bestL, top: bestT, guide: guideX != null || guideY != null ? { x: guideX, y: guideY } : undefined };
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
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const snapToElements = useEditorStore((s) => s.snapToElements);
  const positions = useEditorStore((s) => s.positions);
  const [guide, setGuide] = useState<{ x?: number; y?: number } | null>(null);
  const dragging = useRef(false);
  const historyPushed = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editable) return;
      e.stopPropagation();
      setSelectedId(id);
      dragging.current = true;
      historyPushed.current = false;
      const startX = e.clientX;
      const startY = e.clientY;
      const baseLeft = parseFloat(posLeft ?? styleLeft ?? "0") || 0;
      const baseTop = parseFloat(posTop ?? styleTop ?? "0") || 0;

      const onMove = (ev: PointerEvent) => {
        if (!historyPushed.current) {
          pushHistory();
          historyPushed.current = true;
        }
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let left = baseLeft + dx;
        let top = baseTop + dy;
        left = snapPx(left, snapToGrid);
        top = snapPx(top, snapToGrid);
        if (snapToElements) {
          const snapped = snapToPeers(id, left, top, positions);
          left = snapped.left;
          top = snapped.top;
          if (snapped.guide) setGuide(snapped.guide);
          else setGuide({ x: left, y: top });
        } else {
          setGuide({ x: left, y: top });
        }
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
    [
      editable,
      id,
      posLeft,
      posTop,
      styleLeft,
      styleTop,
      snapToGrid,
      snapToElements,
      positions,
      setPosition,
      setSelectedId,
      pushHistory,
    ]
  );

  return { onPointerDown, guide, isDragging: dragging.current };
}
