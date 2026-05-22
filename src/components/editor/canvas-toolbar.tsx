"use client";

import { useState } from "react";
import { Maximize2, Minus, Plus, ChevronDown, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";

interface CanvasToolbarProps {
  onFit: () => void;
  onOpenShortcuts?: () => void;
}

const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.5, 2];
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;

/** Floating zoom toolbar with full controls + shortcut to cheat-sheet */
export function CanvasToolbar({ onFit, onOpenShortcuts }: CanvasToolbarProps) {
  const [presetOpen, setPresetOpen] = useState(false);
  const canvasZoom = useEditorStore((s) => s.canvasZoom);
  const setCanvasZoom = useEditorStore((s) => s.setCanvasZoom);
  const canvasFitMode = useEditorStore((s) => s.canvasFitMode);

  const adjust = (dir: 1 | -1) => {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, canvasZoom + dir * ZOOM_STEP));
    setCanvasZoom(Number(next.toFixed(2)));
  };

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
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-zinc-300 hover:text-white"
          onClick={() => adjust(-1)}
          title="Zoom out (Ctrl+-)"
          disabled={canvasZoom <= MIN_ZOOM}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-zinc-800 min-w-[4rem] text-center font-mono text-xs text-zinc-200 tabular-nums"
            onClick={() => setPresetOpen((o) => !o)}
            title="Presets de zoom"
          >
            <span className="flex-1">{Math.round(canvasZoom * 100)}%</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>
          {presetOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setPresetOpen(false)}
                aria-hidden
              />
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 rounded-md border border-zinc-800 bg-zinc-900 p-1 shadow-xl min-w-[5rem]">
                {ZOOM_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`w-full px-2 py-1 rounded text-[11px] text-left font-mono tabular-nums ${
                      Math.abs(canvasZoom - p) < 0.01
                        ? "bg-primary/15 text-primary"
                        : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                    onClick={() => {
                      setCanvasZoom(p);
                      setPresetOpen(false);
                    }}
                  >
                    {Math.round(p * 100)}%
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-zinc-300 hover:text-white"
          onClick={() => adjust(1)}
          title="Zoom in (Ctrl++)"
          disabled={canvasZoom >= MAX_ZOOM}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
        {canvasFitMode !== "manual" && (
          <span className="text-[10px] text-zinc-600 pr-1">auto</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-zinc-500 hover:text-zinc-200"
          onClick={() => setCanvasZoom(1)}
          title="100%"
        >
          <span className="text-[10px]">1:1</span>
        </Button>
        {onOpenShortcuts && (
          <>
            <span className="h-4 w-px bg-zinc-700" />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-zinc-500 hover:text-zinc-200"
              onClick={onOpenShortcuts}
              title="Atajos (?)"
            >
              <Keyboard className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
