"use client";

import { useEditorStore } from "@/lib/store/editor-store";

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const SAFE = 0.05;

interface CanvasChromeProps {
  scale: number;
}

export function CanvasChrome({ scale }: CanvasChromeProps) {
  const showSafeZone = useEditorStore((s) => s.showSafeZone);
  const showRulers = useEditorStore((s) => s.showRulers);
  const guides = useEditorStore((s) => s.alignmentGuides);

  const safeLeft = CANVAS_W * SAFE;
  const safeTop = CANVAS_H * SAFE;
  const safeW = CANVAS_W * (1 - SAFE * 2);
  const safeH = CANVAS_H * (1 - SAFE * 2);

  return (
    <>
      {showRulers && (
        <div className="ss-canvas-rulers" style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}>
          <div className="ss-ruler-top" />
          <div className="ss-ruler-left" />
        </div>
      )}
      {showSafeZone && (
        <div
          className="ss-safe-zone-overlay"
          style={{
            left: safeLeft * scale,
            top: safeTop * scale,
            width: safeW * scale,
            height: safeH * scale,
          }}
          title="Action safe 5% (1920×1080)"
        />
      )}
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
