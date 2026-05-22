"use client";

import { useEffect, useState } from "react";
import {
  AlignCenterHorizontal,
  AlignLeft,
  Copy,
  Layers,
  Redo2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";

export function SelectionFloatingToolbar() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const streamSafe = useEditorStore((s) => s.streamSafePreview);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const copyStyle = useEditorStore((s) => s.copyStyleFromSelection);
  const pasteStyle = useEditorStore((s) => s.pasteStyleToSelection);
  const alignSelection = useEditorStore((s) => s.alignSelection);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!selectedId || streamSafe) {
      setPos(null);
      return;
    }
    const el = document.querySelector(`[data-widget-id="${selectedId}"]`);
    if (!el) {
      setPos(null);
      return;
    }
    const update = () => {
      const r = el.getBoundingClientRect();
      setPos({ left: r.left + r.width / 2, top: r.top - 8 });
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.body, { subtree: true, attributes: true });
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [selectedId, streamSafe]);

  if (!pos || !selectedId) return null;

  return (
    <div
      className="fixed z-[10001] flex -translate-x-1/2 -translate-y-full items-center gap-0.5 rounded-md border border-border bg-card px-1 py-0.5 shadow-lg"
      style={{ left: pos.left, top: pos.top }}
    >
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => undo()} title="Deshacer">
        <Undo2 className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => redo()} title="Rehacer">
        <Redo2 className="h-3.5 w-3.5" />
      </Button>
      <span className="w-px h-4 bg-border" />
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyStyle()} title="Copiar estilo">
        <Copy className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => pasteStyle()} title="Pegar estilo">
        <Copy className="h-3.5 w-3.5 rotate-180" />
      </Button>
      <span className="w-px h-4 bg-border" />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => alignSelection("left")}
        title="Alinear izquierda"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => alignSelection("center")}
        title="Centrar horizontal"
      >
        <AlignCenterHorizontal className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => bringForward(selectedId)}>
        <Layers className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => sendBackward(selectedId)}>
        <Layers className="h-3.5 w-3.5 rotate-180" />
      </Button>
    </div>
  );
}
