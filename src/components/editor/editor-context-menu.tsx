"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";

interface MenuState {
  x: number;
  y: number;
  id: string;
}

export function EditorContextMenu() {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const sport = useEditorStore((s) => s.sport);
  const registry = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;

  useEffect(() => {
    const onCtx = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-editable]");
      if (!el) return;
      e.preventDefault();
      const id = el.getAttribute("data-editable");
      if (!id) return;
      useEditorStore.getState().setSelectedId(id);
      setMenu({ x: e.clientX, y: e.clientY, id });
    };
    const close = () => setMenu(null);
    window.addEventListener("contextmenu", onCtx);
    window.addEventListener("click", close);
    return () => {
      window.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("click", close);
    };
  }, []);

  if (!menu) return null;

  const entry = registry[menu.id];
  const store = useEditorStore.getState();

  const item = (label: string, action: () => void) => (
    <button
      key={label}
      type="button"
      className="w-full px-3 py-1.5 text-left text-xs hover:bg-accent"
      onClick={() => {
        action();
        setMenu(null);
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="fixed z-[10000] min-w-[180px] rounded-md border border-border bg-card py-1 shadow-xl"
      style={{ left: menu.x, top: menu.y }}
    >
      <p className="px-3 py-1 text-[10px] text-muted-foreground border-b border-border">
        {entry?.label ?? menu.id}
      </p>
      {item("Traer al frente", () => store.bringForward(menu.id))}
      {item("Enviar atrás", () => store.sendBackward(menu.id))}
      {item(store.lockedIds[menu.id] ? "Desbloquear" : "Bloquear", () =>
        store.setLocked(menu.id, !store.lockedIds[menu.id])
      )}
      {item("Reset transform", () => store.resetTransform(menu.id))}
      {entry?.parent && item("Seleccionar padre", () => store.setSelectedId(entry.parent!))}
      {item("Duplicar como copia", () => store.duplicateElementAsCopy(menu.id))}
      {item("Desvincular del grupo", () => store.setMoveAsBlock(false))}
      {item("Ocultar", () => store.setVisibility(menu.id, false))}
    </div>
  );
}
