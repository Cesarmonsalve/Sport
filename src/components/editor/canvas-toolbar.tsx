"use client";

import { Minus, Plus, Maximize2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";

const ZOOM_PRESETS = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
] as const;

interface CanvasToolbarProps {
  onFit: () => void;
  onFitWidth: () => void;
}

export function CanvasToolbar({ onFit, onFitWidth }: CanvasToolbarProps) {
  const canvasZoom = useEditorStore((s) => s.canvasZoom);
  const setCanvasZoom = useEditorStore((s) => s.setCanvasZoom);
  const canvasFitMode = useEditorStore((s) => s.canvasFitMode);
  const showSafeZone = useEditorStore((s) => s.showSafeZone);
  const setShowSafeZone = useEditorStore((s) => s.setShowSafeZone);
  const showRulers = useEditorStore((s) => s.showRulers);
  const setShowRulers = useEditorStore((s) => s.setShowRulers);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 py-2 px-2 border-t border-border bg-card/80">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setCanvasZoom(canvasZoom - 0.05)}
        title="Alejar"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      {ZOOM_PRESETS.map((z) => (
        <Button
          key={z.label}
          variant={Math.abs(canvasZoom - z.value) < 0.02 ? "default" : "ghost"}
          size="sm"
          className="h-7 text-[10px] px-2"
          onClick={() => setCanvasZoom(z.value)}
        >
          {z.label}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setCanvasZoom(canvasZoom + 0.05)}
        title="Acercar"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
      <span className="w-px h-4 bg-border mx-1" />
      <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={onFit} title="Fit (F)">
        <Maximize2 className="h-3 w-3 mr-1" />
        Fit
      </Button>
      <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={onFitWidth}>
        Fit ancho
      </Button>
      <span className="text-[10px] text-muted-foreground font-mono ml-1">
        {Math.round(canvasZoom * 100)}%
        {canvasFitMode !== "manual" ? ` · ${canvasFitMode}` : ""}
      </span>
      <span className="w-px h-4 bg-border mx-1" />
      <Button
        variant={showRulers ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => setShowRulers(!showRulers)}
      >
        Reglas
      </Button>
      <Button
        variant={showSafeZone ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => setShowSafeZone(!showSafeZone)}
      >
        Safe 5%
      </Button>
      <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-2">
        <Move className="h-3 w-3" />
        Space+arrastrar · Ctrl+rueda zoom
      </span>
    </div>
  );
}
