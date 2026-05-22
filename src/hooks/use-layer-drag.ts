"use client";

import { useCallback, useRef } from "react";
import {
  buildElementRects,
  parsePx,
  snapPosition,
} from "@/lib/overlay/snap-engine";
import { useEditorStore } from "@/lib/store/editor-store";

export function useLayerDrag(
  id: string,
  editable: boolean,
  posLeft?: string,
  posTop?: string,
  styleLeft?: string,
  styleTop?: string,
  width?: number,
  height?: number,
  canvasScale = 1
) {
  const setPosition = useEditorStore((s) => s.setPosition);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const snapMode = useEditorStore((s) => s.snapMode);
  const positions = useEditorStore((s) => s.positions);
  const elements = useEditorStore((s) => s.elements);
  const setAlignmentGuides = useEditorStore((s) => s.setAlignmentGuides);
  const dragging = useRef(false);
  const historyPushed = useRef(false);

  const snapGrid = snapMode === "grid" || snapMode === "both";
  const snapElements = snapMode === "elements" || snapMode === "both";

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editable) return;
      e.stopPropagation();
      setSelectedId(id);
      dragging.current = true;
      historyPushed.current = false;
      const startX = e.clientX;
      const startY = e.clientY;
      const baseLeft = parsePx(posLeft ?? styleLeft, 0);
      const baseTop = parsePx(posTop ?? styleTop, 0);
      const w = width ?? parsePx(elements[id]?.width, 120);
      const h = height ?? parsePx(elements[id]?.height, 64);
      const scale = canvasScale > 0 ? canvasScale : 1;

      const onMove = (ev: PointerEvent) => {
        if (!historyPushed.current) {
          pushHistory();
          historyPushed.current = true;
        }
        const dx = (ev.clientX - startX) / scale;
        const dy = (ev.clientY - startY) / scale;
        let left = baseLeft + dx;
        let top = baseTop + dy;

        const peers = buildElementRects(positions, elements, id);
        const snapped = snapPosition({
          id,
          left,
          top,
          width: w,
          height: h,
          peers,
          snapGrid,
          snapElements,
        });
        left = snapped.left;
        top = snapped.top;
        if (snapElements && (snapped.guides.vertical.length || snapped.guides.horizontal.length)) {
          setAlignmentGuides(snapped.guides);
        } else {
          setAlignmentGuides(null);
        }
        setPosition(id, { left: `${Math.round(left)}px`, top: `${Math.round(top)}px` });
      };
      const onUp = () => {
        dragging.current = false;
        setAlignmentGuides(null);
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
      width,
      height,
      canvasScale,
      snapGrid,
      snapElements,
      positions,
      elements,
      setPosition,
      setSelectedId,
      pushHistory,
      setAlignmentGuides,
    ]
  );

  return { onPointerDown, isDragging: dragging.current };
}
