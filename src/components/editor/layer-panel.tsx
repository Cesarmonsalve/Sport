"use client";

import { Eye, EyeOff, Lock, LockOpen } from "lucide-react";
import { useEditorStore } from "@/lib/store/editor-store";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";
import type { Sport } from "@/types";
import { cn } from "@/lib/utils";

interface LayerPanelProps {
  sport: Sport;
}

export function LayerPanel({ sport }: LayerPanelProps) {
  const registry = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const visibility = useEditorStore((s) => s.visibility);
  const lockedIds = useEditorStore((s) => s.lockedIds);
  const zIndex = useEditorStore((s) => s.zIndex);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const setVisibility = useEditorStore((s) => s.setVisibility);
  const lockElement = useEditorStore((s) => s.lockElement);
  const unlockElement = useEditorStore((s) => s.unlockElement);
  const setZIndex = useEditorStore((s) => s.setZIndex);

  const roots = Object.values(registry)
    .filter((e) => !e.parent)
    .sort((a, b) => (zIndex[b.id] ?? 0) - (zIndex[a.id] ?? 0));

  const moveLayer = (id: string, dir: -1 | 1) => {
    const sorted = [...roots].sort((a, b) => (zIndex[a.id] ?? 10) - (zIndex[b.id] ?? 10));
    const idx = sorted.findIndex((e) => e.id === id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    const zA = zIndex[id] ?? 10;
    const zB = zIndex[swap.id] ?? 10;
    setZIndex(id, zB);
    setZIndex(swap.id, zA);
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 text-xs">
      <p className="px-1 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        Capas · arrastra z-index con ↑↓
      </p>
      <ul className="space-y-0.5">
        {roots.map((entry) => {
          const children = entry.children ?? [];
          const visible = visibility[entry.id] !== false;
          const locked = lockedIds[entry.id];
          return (
            <li key={entry.id}>
              <div
                className={cn(
                  "flex items-center gap-1 rounded px-1 py-1 hover:bg-accent/50",
                  selectedId === entry.id && "bg-primary/15"
                )}
              >
                <button
                  type="button"
                  className="p-0.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setVisibility(entry.id, !visible)}
                  title={visible ? "Ocultar" : "Mostrar"}
                >
                  {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 opacity-40" />}
                </button>
                <button
                  type="button"
                  className="p-0.5 text-muted-foreground hover:text-foreground"
                  onClick={() => (locked ? unlockElement(entry.id) : lockElement(entry.id))}
                >
                  {locked ? <Lock className="h-3 w-3 text-amber-400" /> : <LockOpen className="h-3 w-3" />}
                </button>
                <button
                  type="button"
                  className="flex-1 truncate text-left font-mono text-[10px]"
                  onClick={() => setSelectedId(entry.id)}
                >
                  {entry.label}
                </button>
                <button type="button" className="px-0.5 opacity-50 hover:opacity-100" onClick={() => moveLayer(entry.id, 1)}>
                  ↑
                </button>
                <button type="button" className="px-0.5 opacity-50 hover:opacity-100" onClick={() => moveLayer(entry.id, -1)}>
                  ↓
                </button>
              </div>
              {children.length > 0 && (
                <ul className="ml-4 border-l border-border pl-2">
                  {children.map((cid) => {
                    const child = registry[cid];
                    if (!child) return null;
                    return (
                      <li
                        key={cid}
                        className={cn(
                          "flex items-center gap-1 rounded px-1 py-0.5 hover:bg-accent/30",
                          selectedId === cid && "bg-primary/10"
                        )}
                      >
                        <button
                          type="button"
                          className="flex-1 truncate text-left font-mono text-[9px] text-muted-foreground"
                          onClick={() => setSelectedId(cid)}
                        >
                          └ {child.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
