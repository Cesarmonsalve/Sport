"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { OverlayCanvas } from "@/components/overlay/overlay-canvas";
import type { Sport } from "@/types";

const CANVAS_W = 1920;
const CANVAS_H = 1080;

interface EditorCanvasPreviewProps {
  sport: Sport;
}

export function EditorCanvasPreview({ sport }: EditorCanvasPreviewProps) {
  const scale = useMemo(() => {
    if (typeof window === "undefined") return 0.5;
    const maxW = Math.min(960, window.innerWidth - 520);
    return Math.min(maxW / CANVAS_W, 0.55);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#06070a] p-6">
      <motion.div
        layout
        className="relative rounded-lg border border-border shadow-2xl"
        style={{
          width: CANVAS_W * scale,
          height: CANVAS_H * scale,
        }}
      >
        <div
          className="overflow-hidden rounded-lg bg-black/40"
          style={{
            width: CANVAS_W * scale,
            height: CANVAS_H * scale,
          }}
        >
          <OverlayCanvas sport={sport} scale={scale} interactive />
        </div>
        <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-muted-foreground">
          Preview 1920×1080 · escala {(scale * 100).toFixed(0)}%
        </div>
      </motion.div>
    </div>
  );
}
