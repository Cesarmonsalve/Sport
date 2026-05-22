"use client";

import { useCallback } from "react";
import { useEditorStore } from "@/lib/store/editor-store";

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const HANDLES: { id: Handle; className: string; cursor: string }[] = [
  { id: "nw", className: "-left-1 -top-1", cursor: "nwse-resize" },
  { id: "n", className: "left-1/2 -top-1 -translate-x-1/2", cursor: "ns-resize" },
  { id: "ne", className: "-right-1 -top-1", cursor: "nesw-resize" },
  { id: "e", className: "-right-1 top-1/2 -translate-y-1/2", cursor: "ew-resize" },
  { id: "se", className: "-right-1 -bottom-1", cursor: "nwse-resize" },
  { id: "s", className: "left-1/2 -bottom-1 -translate-x-1/2", cursor: "ns-resize" },
  { id: "sw", className: "-left-1 -bottom-1", cursor: "nesw-resize" },
  { id: "w", className: "-left-1 top-1/2 -translate-y-1/2", cursor: "ew-resize" },
];

interface Props {
  id: string;
  width: number;
  height: number;
}

export function LayerTransformHandles({ id, width, height }: Props) {
  const setElementStyle = useEditorStore((s) => s.setElementStyle);

  const onResize = useCallback(
    (handle: Handle, e: React.PointerEvent) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const ratio = height / width || 1;
      let w = width;
      let h = height;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (handle.includes("e")) w = Math.max(24, width + dx);
        if (handle.includes("w")) w = Math.max(24, width - dx);
        if (handle.includes("s")) h = Math.max(24, height + dy);
        if (handle.includes("n")) h = Math.max(24, height - dy);
        if (ev.shiftKey && w > 0) h = w * ratio;
        setElementStyle(id, {
          width: `${Math.round(w)}px`,
          height: `${Math.round(h)}px`,
        });
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [id, width, height, setElementStyle]
  );

  return (
    <>
      {HANDLES.map((h) => (
        <span
          key={h.id}
          role="presentation"
          className={`absolute z-50 h-2.5 w-2.5 rounded-sm border border-primary bg-background ${h.className}`}
          style={{ cursor: h.cursor }}
          onPointerDown={(e) => onResize(h.id, e)}
        />
      ))}
    </>
  );
}
