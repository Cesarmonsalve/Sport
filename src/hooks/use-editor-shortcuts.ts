"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/lib/store/editor-store";

export function useEditorShortcuts() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const nudgePosition = useEditorStore((s) => s.nudgePosition);
  const setVisibility = useEditorStore((s) => s.setVisibility);
  const toggleSidebar = useEditorStore((s) => s.toggleSidebar);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const setSnapToGrid = useEditorStore((s) => s.setSnapToGrid);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "p" || e.key === "P") {
        toggleSidebar();
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        setVisibility(selectedId, false);
        return;
      }

      if (e.key === "g" && e.shiftKey) {
        setSnapToGrid(!snapToGrid);
        return;
      }

      if (!selectedId) return;
      const step = e.shiftKey ? 8 : 1;
      const grid = snapToGrid ? 8 : 1;
      const delta = step * grid;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        nudgePosition(selectedId, -delta, 0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nudgePosition(selectedId, delta, 0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        nudgePosition(selectedId, 0, -delta);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        nudgePosition(selectedId, 0, delta);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    selectedId,
    nudgePosition,
    setVisibility,
    toggleSidebar,
    snapToGrid,
    setSnapToGrid,
  ]);
}
