"use client";

import { useEditorStore } from "@/lib/store/editor-store";

const CANVAS_W = 1920;
const CANVAS_H = 1080;

interface CanvasChromeProps {
  scale: number;
}

/** Snap alignment guides only — no safe zone / rulers */
export function CanvasChrome({ scale }: CanvasChromeProps) {
  const guides = useEditorStore((s) => s.alignmentGuides);

  return (
    <>
      {guides?.vertical.map((x, i) => (
        <div
          key={`v-${i}-${x}`}
          className="ss-align-guide-v"
          style={{ left: x * scale, height: CANVAS_H * scale }}
        />
      ))}
      {guides?.horizontal.map((y, i) => (
        <div
          key={`h-${i}-${y}`}
          className="ss-align-guide-h"
          style={{ top: y * scale, width: CANVAS_W * scale }}
        />
      ))}
    </>
  );
}
