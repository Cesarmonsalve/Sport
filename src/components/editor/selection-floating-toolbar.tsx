"use client";

import { useEffect, useState } from "react";
import {
  AlignCenterHorizontal,
  AlignLeft,
  Copy,
  Layers,
  Redo2,
  Trash2,
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
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const historyIndex = useEditorStore((s) => s._historyIndex);
  const historyLen = useEditorStore((s) => s._history.length);
  const alignSelection = useEditorStore((s) => s.alignSelection);
  const distributeSelection = useEditorStore((s) => s.distributeSelection);
  const matchSizeSelection = useEditorStore((s) => s.matchSizeSelection);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const removeFreeElement = useEditorStore((s) => s.removeFreeElement);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const isFree = useEditorStore((s) =>
    selectedId ? s.freeElements.some((f) => f.id === selectedId) : false
  );
  const multi = selectedIds.length >= 2;
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
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={historyIndex <= 0}
        onClick={() => undo()}
        title="Deshacer"
      >
        <Undo2 className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={historyIndex >= historyLen - 1}
        onClick={() => redo()}
        title="Rehacer"
      >
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
      {multi && (
        <>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[9px]" onClick={() => distributeSelection("horizontal")} title="Distribuir H">
            ═
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[9px]" onClick={() => distributeSelection("vertical")} title="Distribuir V">
            ⣿
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[9px]" onClick={() => matchSizeSelection("both")} title="Mismo tamaño">
            □
          </Button>
        </>
      )}
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => bringForward(selectedId)}>
        <Layers className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => sendBackward(selectedId)}>
        <Layers className="h-3.5 w-3.5 rotate-180" />
      </Button>
      {isFree && (
        <>
          <span className="w-px h-4 bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-400 hover:text-red-300"
            onClick={() => {
              removeFreeElement(selectedId);
              setSelectedIds([]);
            }}
            title="Eliminar elemento (Delete)"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </>
      )}
    </div>
  );
}
