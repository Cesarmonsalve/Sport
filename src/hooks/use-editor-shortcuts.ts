"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/lib/store/editor-store";

export function useEditorShortcuts() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const nudgePosition = useEditorStore((s) => s.nudgePosition);
  const setVisibility = useEditorStore((s) => s.setVisibility);
  const toggleSidebar = useEditorStore((s) => s.toggleSidebar);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const setSnapToGrid = useEditorStore((s) => s.setSnapToGrid);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const groupSelection = useEditorStore((s) => s.groupSelection);
  const ungroupSelection = useEditorStore((s) => s.ungroupSelection);
  const showAllWidgets = useEditorStore((s) => s.showAllWidgets);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const mod = e.ctrlKey || e.metaKey;

      if (e.key === "p" || e.key === "P") {
        if (!mod) toggleSidebar();
        return;
      }

      if (mod && e.key === "d") {
        e.preventDefault();
        if (selectedId) duplicateElement(selectedId);
        return;
      }
      if (mod && e.key === "g" && e.shiftKey) {
        e.preventDefault();
        ungroupSelection();
        return;
      }
      if (mod && e.key === "g") {
        e.preventDefault();
        groupSelection();
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (e.shiftKey) {
          showAllWidgets();
          return;
        }
        if (selectedId) {
          e.preventDefault();
          setVisibility(selectedId, false);
        }
        return;
      }

      if (e.key === "g" && e.shiftKey && !mod) {
        setSnapToGrid(!snapToGrid);
        return;
      }

      const targets = selectedIds.length ? selectedIds : selectedId ? [selectedId] : [];
      if (!targets.length) return;

      let step = 1;
      if (e.shiftKey) step = 8;
      if (mod) step = 1;
      const delta = step * (snapToGrid && !mod ? 8 : 1);

      const nudgeAll = (dx: number, dy: number) => {
        targets.forEach((id) => nudgePosition(id, dx, dy));
      };

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        nudgeAll(-delta, 0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nudgeAll(delta, 0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        nudgeAll(0, -delta);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        nudgeAll(0, delta);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    selectedId,
    selectedIds,
    nudgePosition,
    setVisibility,
    toggleSidebar,
    snapToGrid,
    setSnapToGrid,
    duplicateElement,
    groupSelection,
    ungroupSelection,
    showAllWidgets,
  ]);
}
