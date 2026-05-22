"use client";

import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";

interface CanvasToolbarProps {
  onFit: () => void;
}

/** Minimal floating zoom — fit + percentage only */
export function CanvasToolbar({ onFit }: CanvasToolbarProps) {
  const canvasZoom = useEditorStore((s) => s.canvasZoom);
  const setCanvasZoom = useEditorStore((s) => s.setCanvasZoom);
  const canvasFitMode = useEditorStore((s) => s.canvasFitMode);

  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/95 px-2 py-1 shadow-lg backdrop-blur-md">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-full px-3 text-xs text-zinc-300 hover:text-white"
          onClick={onFit}
          title="Ajustar al viewport (F)"
        >
          <Maximize2 className="h-3.5 w-3.5 mr-1.5" />
          Fit
        </Button>
        <span className="h-4 w-px bg-zinc-700" />
        <span className="min-w-[3rem] text-center font-mono text-xs text-zinc-400 tabular-nums">
          {Math.round(canvasZoom * 100)}%
        </span>
        {canvasFitMode !== "manual" && (
          <span className="text-[10px] text-zinc-600 pr-1">auto</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-zinc-500"
          onClick={() => setCanvasZoom(1)}
          title="100%"
        >
          <span className="text-[10px]">1:1</span>
        </Button>
      </div>
    </div>
  );
}
