"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { getScenesForSport } from "@/lib/scenes/broadcast-scenes";

export function useEditorShortcuts() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const sport = useEditorStore((s) => s.sport);
  const visibility = useEditorStore((s) => s.visibility);
  const nudgePosition = useEditorStore((s) => s.nudgePosition);
  const setVisibility = useEditorStore((s) => s.setVisibility);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const toggleSidebar = useEditorStore((s) => s.toggleSidebar);
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const setSnapToGrid = useEditorStore((s) => s.setSnapToGrid);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const groupSelection = useEditorStore((s) => s.groupSelection);
  const ungroupSelection = useEditorStore((s) => s.ungroupSelection);
  const showAllWidgets = useEditorStore((s) => s.showAllWidgets);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const setLocked = useEditorStore((s) => s.setLocked);
  const lockedIds = useEditorStore((s) => s.lockedIds);
  const setStreamSafePreview = useEditorStore((s) => s.setStreamSafePreview);
  const setPreviewMode = useEditorStore((s) => s.setPreviewMode);
  const setCanvasFitMode = useEditorStore((s) => s.setCanvasFitMode);
  const applyBroadcastScene = useEditorStore((s) => s.applyBroadcastScene);
  const copyStyleFromSelection = useEditorStore((s) => s.copyStyleFromSelection);
  const pasteStyleToSelection = useEditorStore((s) => s.pasteStyleToSelection);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key === "c" && e.shiftKey) {
        e.preventDefault();
        copyStyleFromSelection();
        return;
      }
      if (mod && e.key === "v" && e.shiftKey) {
        e.preventDefault();
        pasteStyleToSelection();
        return;
      }

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
      if (mod && e.key === "a") {
        e.preventDefault();
        const ids = Object.keys(visibility).filter((id) => visibility[id] !== false);
        setSelectedIds(ids);
        return;
      }
      if (mod && e.key === "[") {
        e.preventDefault();
        if (selectedId) sendBackward(selectedId);
        return;
      }
      if (mod && e.key === "]") {
        e.preventDefault();
        if (selectedId) bringForward(selectedId);
        return;
      }

      if (e.key === " " && !mod) {
        e.preventDefault();
        setPreviewMode(!useEditorStore.getState().previewMode);
        setStreamSafePreview(!useEditorStore.getState().streamSafePreview);
        return;
      }
      if (e.key === "f" || e.key === "F") {
        if (!mod) {
          setCanvasFitMode("fit");
          setStreamSafePreview(false);
          return;
        }
      }
      if (e.key === "h" || e.key === "H") {
        if (!mod && selectedId) {
          setVisibility(selectedId, visibility[selectedId] === false);
          return;
        }
      }
      if (e.key === "l" || e.key === "L") {
        if (!mod && selectedId) {
          setLocked(selectedId, !lockedIds[selectedId]);
          return;
        }
      }
      const sceneNum = parseInt(e.key, 10);
      if (sceneNum >= 1 && sceneNum <= 9 && !mod) {
        const scenes = getScenesForSport(sport);
        const sc = scenes[sceneNum - 1];
        if (sc) applyBroadcastScene(sc.id);
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
      if (e.shiftKey && !mod) step = 10;
      else if (e.shiftKey) step = 8;
      const delta = step * (snapToGrid && !mod && !e.shiftKey ? 8 : 1);

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
    undo,
    redo,
    copyStyleFromSelection,
    pasteStyleToSelection,
    sport,
    visibility,
    setSelectedIds,
    bringForward,
    sendBackward,
    setLocked,
    lockedIds,
    setStreamSafePreview,
    setPreviewMode,
    setCanvasFitMode,
    applyBroadcastScene,
  ]);
}
