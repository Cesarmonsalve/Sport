"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  EditorMode,
  ElementDataBinding,
  ElementStyle,
  MlbGameSnapshot,
  NbaGameSnapshot,
  PlayerSlotBinding,
  Sport,
  StreamSportsState,
} from "@/types";
import type { StreamTemplate } from "@/lib/templates/types";
import { NBA_MOCK_GAME } from "@/lib/espn/nba";
import { MLB_MOCK_GAME } from "@/lib/espn/mlb";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";
import type { ThemeExport } from "@/lib/theme/io";

function defaultPositions(sport: Sport): Record<string, { left: string; top: string }> {
  const reg = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const out: Record<string, { left: string; top: string }> = {};
  Object.values(reg).forEach((e) => {
    if (e.defaults?.left || e.defaults?.top) {
      out[e.id] = { left: e.defaults.left ?? "0", top: e.defaults.top ?? "0" };
    }
  });
  return out;
}

function defaultVisibility(sport: Sport): Record<string, boolean> {
  const reg = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const out: Record<string, boolean> = {};
  Object.keys(reg).forEach((id) => {
    out[id] =
      id.includes("scorebug") ||
      id.includes("scoreboard") ||
      id.startsWith("sb-") ||
      id.startsWith("score-");
  });
  if (sport === "nba") {
    out["nba-scorebug"] = true;
    out["card-jugador"] = false;
    out["quinteto-widget"] = false;
    out["destacado-widget"] = false;
    out["fouls-v"] = true;
    out["fouls-h"] = true;
    out["shot-clock"] = true;
  }
  if (sport === "mlb") {
    out.scoreboard = true;
    out["line-score"] = false;
    out["bases-widget"] = false;
    out["matchup-widget"] = false;
    out["roster-widget"] = false;
    out["play-ticker"] = false;
  }
  return out;
}

function designVisibility(sport: Sport): Record<string, boolean> {
  const reg = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  return Object.fromEntries(Object.keys(reg).map((id) => [id, true]));
}

interface EditorStore {
  sport: Sport;
  room: string;
  eventId: string | null;
  designMode: boolean;
  freeEditMode: boolean;
  moveAsBlock: boolean;
  groupMode: boolean;
  editorMode: EditorMode;
  selectedId: string | null;
  selectedIds: string[];
  sidebarCollapsed: boolean;
  snapToGrid: boolean;
  visibility: Record<string, boolean>;
  positions: Record<string, { left: string; top: string }>;
  elements: Record<string, ElementStyle>;
  textOverrides: Record<string, string>;
  dataBindings: Record<string, ElementDataBinding>;
  userTouchedElements: string[];
  zIndex: Record<string, number>;
  dirtyIds: string[];
  nbaGame: NbaGameSnapshot;
  mlbGame: MlbGameSnapshot;
  syncStatus: string;
  templateId: string;
  templateName: string;
  lockedIds: Record<string, boolean>;
  groups: Record<string, string[]>;
  playerSlots: Record<string, PlayerSlotBinding>;
  rotationNotice: string | null;
  inlineEditId: string | null;

  setSport: (s: Sport) => void;
  setRoom: (r: string) => void;
  setEventId: (id: string | null) => void;
  setDesignMode: (v: boolean) => void;
  setFreeEditMode: (v: boolean) => void;
  setMoveAsBlock: (v: boolean) => void;
  setEditorMode: (m: EditorMode) => void;
  setGroupMode: (v: boolean) => void;
  setDataBinding: (id: string, binding: ElementDataBinding) => void;
  markUserTouched: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSidebar: () => void;
  setSnapToGrid: (v: boolean) => void;
  setVisibility: (id: string, visible: boolean) => void;
  setPosition: (id: string, pos: { left: string; top: string }) => void;
  nudgePosition: (id: string, dx: number, dy: number) => void;
  setElementStyle: (id: string, style: ElementStyle) => void;
  setTextOverride: (id: string, text: string) => void;
  setZIndex: (id: string, z: number) => void;
  duplicatePosition: (id: string, offset?: { x: number; y: number }) => void;
  applyPreset: (map: Record<string, ElementStyle>) => void;
  setNbaGame: (g: NbaGameSnapshot) => void;
  setMlbGame: (g: MlbGameSnapshot) => void;
  setSyncStatus: (s: string) => void;
  importState: (state: Partial<StreamSportsState>) => void;
  importTheme: (theme: ThemeExport) => void;
  applyStreamTemplate: (t: StreamTemplate) => void;
  setLocked: (id: string, locked: boolean) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  resetTransform: (id: string) => void;
  duplicateElement: (id: string) => void;
  duplicateElementAsCopy: (id: string) => string | null;
  groupSelection: () => void;
  ungroupSelection: () => void;
  showAllWidgets: () => void;
  setRotationNotice: (msg: string | null) => void;
  setPlayerSlots: (slots: Record<string, PlayerSlotBinding>) => void;
  setInlineEditId: (id: string | null) => void;
  exportState: () => StreamSportsState;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      sport: "nba",
      room: "",
      eventId: null,
      designMode: false,
      freeEditMode: true,
      moveAsBlock: false,
      groupMode: false,
      editorMode: "advanced",
      selectedId: null,
      selectedIds: [],
      sidebarCollapsed: false,
      snapToGrid: true,
      visibility: defaultVisibility("nba"),
      positions: defaultPositions("nba"),
      elements: {},
      textOverrides: {},
      dataBindings: {},
      userTouchedElements: [],
      zIndex: {},
      dirtyIds: [],
      nbaGame: NBA_MOCK_GAME,
      mlbGame: MLB_MOCK_GAME,
      syncStatus: "offline",
      templateId: "broadcast-classic",
      templateName: "Broadcast clásico",
      lockedIds: {},
      groups: {},
      playerSlots: {},
      rotationNotice: null,
      inlineEditId: null,

      setSport: (sport) =>
        set({
          sport,
          visibility: defaultVisibility(sport),
          positions: defaultPositions(sport),
          selectedId: null,
          selectedIds: [],
        }),
      setRoom: (room) => set({ room }),
      setEventId: (eventId) => set({ eventId }),
      setDesignMode: (designMode) =>
        set((s) => ({
          designMode,
          visibility: designMode ? designVisibility(s.sport) : defaultVisibility(s.sport),
          nbaGame: designMode ? NBA_MOCK_GAME : s.nbaGame,
          mlbGame: designMode ? MLB_MOCK_GAME : s.mlbGame,
        })),
      setEditorMode: (editorMode) =>
        set({ editorMode, freeEditMode: editorMode === "advanced" }),
      setFreeEditMode: (freeEditMode) =>
        set({ freeEditMode, editorMode: freeEditMode ? "advanced" : "simple" }),
      setMoveAsBlock: (moveAsBlock) => set({ moveAsBlock, groupMode: moveAsBlock }),
      setGroupMode: (groupMode) => set({ groupMode, moveAsBlock: groupMode }),
      setDataBinding: (id, binding) =>
        set((s) => ({
          dataBindings: { ...s.dataBindings, [id]: { ...s.dataBindings[id], ...binding } },
        })),
      markUserTouched: (id) =>
        set((s) => ({
          userTouchedElements: s.userTouchedElements.includes(id)
            ? s.userTouchedElements
            : [...s.userTouchedElements, id],
        })),
      setSelectedId: (selectedId) =>
        set({ selectedId, selectedIds: selectedId ? [selectedId] : [] }),
      setSelectedIds: (selectedIds) =>
        set({ selectedIds, selectedId: selectedIds[0] ?? null }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSnapToGrid: (snapToGrid) => set({ snapToGrid }),
      setVisibility: (id, visible) =>
        set((s) => ({ visibility: { ...s.visibility, [id]: visible } })),
      setPosition: (id, pos) => {
        if (get().lockedIds[id]) return;
        set((s) => ({
          positions: { ...s.positions, [id]: pos },
          dirtyIds: s.dirtyIds.includes(id) ? s.dirtyIds : [...s.dirtyIds, id],
          userTouchedElements: s.userTouchedElements.includes(id)
            ? s.userTouchedElements
            : [...s.userTouchedElements, id],
        }));
      },
      nudgePosition: (id, dx, dy) => {
        const s = get();
        const cur = s.positions[id];
        const left = (parseFloat(cur?.left ?? "0") || 0) + dx;
        const top = (parseFloat(cur?.top ?? "0") || 0) + dy;
        get().setPosition(id, { left: `${left}px`, top: `${top}px` });
      },
      setElementStyle: (id, style) =>
        set((s) => ({
          elements: { ...s.elements, [id]: { ...s.elements[id], ...style } },
          dirtyIds: s.dirtyIds.includes(id) ? s.dirtyIds : [...s.dirtyIds, id],
          userTouchedElements: s.userTouchedElements.includes(id)
            ? s.userTouchedElements
            : [...s.userTouchedElements, id],
        })),
      setTextOverride: (id, text) =>
        set((s) => ({
          textOverrides: { ...s.textOverrides, [id]: text },
          dirtyIds: s.dirtyIds.includes(id) ? s.dirtyIds : [...s.dirtyIds, id],
        })),
      setZIndex: (id, z) =>
        set((s) => ({
          zIndex: { ...s.zIndex, [id]: z },
          elements: { ...s.elements, [id]: { ...s.elements[id], zIndex: String(z) } },
        })),
      duplicatePosition: (id, offset = { x: 24, y: 24 }) => {
        const s = get();
        const cur = s.positions[id];
        if (!cur) return;
        const left = (parseFloat(cur.left) || 0) + offset.x;
        const top = (parseFloat(cur.top) || 0) + offset.y;
        get().setPosition(id, { left: `${left}px`, top: `${top}px` });
      },
      applyPreset: (map) =>
        set((s) => ({
          elements: Object.fromEntries(
            Object.entries(map).map(([id, st]) => [id, { ...s.elements[id], ...st }])
          ),
          dirtyIds: [...new Set([...s.dirtyIds, ...Object.keys(map)])],
        })),
      setNbaGame: (nbaGame) => set({ nbaGame }),
      setPlayerSlots: (playerSlots) => set({ playerSlots }),
      setRotationNotice: (rotationNotice) => set({ rotationNotice }),
      setInlineEditId: (inlineEditId) => set({ inlineEditId }),
      applyStreamTemplate: (t) => {
        const s = get();
        const touched = new Set(s.userTouchedElements);
        const elements = { ...s.elements };
        for (const [id, st] of Object.entries(t.elements)) {
          if (!touched.has(id)) elements[id] = { ...elements[id], ...st };
        }
        const positions = { ...s.positions };
        for (const [id, p] of Object.entries(t.positions)) {
          if (!touched.has(id)) positions[id] = p;
        }
        set({
          templateId: t.id,
          templateName: t.name,
          positions,
          visibility: { ...s.visibility, ...t.visibility },
          elements,
          dirtyIds: [...new Set([...s.dirtyIds, ...Object.keys(t.positions)])],
        });
      },
      setLocked: (id, locked) =>
        set((s) => ({
          lockedIds: { ...s.lockedIds, [id]: locked },
        })),
      bringForward: (id) => {
        const z = (get().zIndex[id] ?? 10) + 1;
        get().setZIndex(id, z);
      },
      sendBackward: (id) => {
        const z = Math.max(0, (get().zIndex[id] ?? 10) - 1);
        get().setZIndex(id, z);
      },
      resetTransform: (id) =>
        set((s) => ({
          elements: {
            ...s.elements,
            [id]: { ...s.elements[id], rotate: undefined, width: undefined, height: undefined },
          },
        })),
      duplicateElement: (id) => {
        get().duplicateElementAsCopy(id);
      },
      duplicateElementAsCopy: (id) => {
        const s = get();
        const newId = `${id}-copy-${Date.now().toString(36).slice(-4)}`;
        const cur = s.positions[id];
        if (!cur) return null;
        set({
          positions: {
            ...s.positions,
            [newId]: {
              left: `${(parseFloat(cur.left) || 0) + 32}px`,
              top: `${(parseFloat(cur.top) || 0) + 32}px`,
            },
          },
          elements: { ...s.elements, [newId]: { ...s.elements[id] } },
          visibility: { ...s.visibility, [newId]: s.visibility[id] !== false },
          textOverrides: { ...s.textOverrides, [newId]: s.textOverrides[id] },
          dataBindings: { ...s.dataBindings, [newId]: { ...s.dataBindings[id] } },
          zIndex: { ...s.zIndex, [newId]: (s.zIndex[id] ?? 10) + 1 },
          selectedId: newId,
          selectedIds: [newId],
          dirtyIds: [...s.dirtyIds, newId],
        });
        return newId;
      },
      groupSelection: () => {
        const ids = get().selectedIds;
        if (ids.length < 2) return;
        const gid = `group-${Date.now()}`;
        set((s) => ({ groups: { ...s.groups, [gid]: ids } }));
      },
      ungroupSelection: () => {
        const sid = get().selectedId;
        if (!sid) return;
        set((s) => {
          const groups = { ...s.groups };
          for (const [g, ids] of Object.entries(groups)) {
            if (ids.includes(sid)) delete groups[g];
          }
          return { groups };
        });
      },
      showAllWidgets: () =>
        set((s) => ({
          visibility: Object.fromEntries(
            Object.keys(s.visibility).map((k) => [k, true])
          ),
        })),
      setMlbGame: (mlbGame) => set({ mlbGame }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),
      importState: (state) =>
        set((s) => ({
          designMode: state.designMode ?? s.designMode,
          freeEditMode: state.freeEditMode ?? s.freeEditMode,
          moveAsBlock: state.moveAsBlock ?? s.moveAsBlock,
          groupMode: state.groupMode ?? s.groupMode,
          editorMode: state.editorMode ?? s.editorMode,
          dataBindings: { ...s.dataBindings, ...state.dataBindings },
          userTouchedElements: state.userTouchedElements ?? s.userTouchedElements,
          visibility: { ...s.visibility, ...state.visibility },
          positions: { ...s.positions, ...state.positions },
          elements: { ...s.elements, ...state.elements },
          textOverrides: { ...s.textOverrides, ...state.textOverrides },
          zIndex: { ...s.zIndex, ...state.zIndex },
          eventId: state.eventId ?? s.eventId,
          nbaGame:
            state.sport === "nba" && state.game
              ? (state.game as NbaGameSnapshot)
              : s.nbaGame,
          mlbGame:
            state.sport === "mlb" && state.game
              ? (state.game as MlbGameSnapshot)
              : s.mlbGame,
        })),
      importTheme: (theme) =>
        set((s) => ({
          templateId: theme.templateId ?? s.templateId,
          templateName: theme.templateName ?? s.templateName,
          positions: { ...s.positions, ...theme.positions },
          elements: { ...s.elements, ...theme.elements },
          visibility: { ...s.visibility, ...theme.visibility },
          textOverrides: { ...s.textOverrides, ...theme.textOverrides },
          zIndex: { ...s.zIndex, ...theme.zIndex },
          playerSlots: { ...s.playerSlots, ...theme.playerSlots },
          dirtyIds: [
            ...new Set([
              ...s.dirtyIds,
              ...Object.keys(theme.positions),
              ...Object.keys(theme.elements),
            ]),
          ],
        })),
      exportState: () => {
        const s = get();
        const game = s.sport === "nba" ? s.nbaGame : s.mlbGame;
        return {
          version: 1 as const,
          sport: s.sport,
          room: s.room,
          eventId: s.eventId ?? undefined,
          designMode: s.designMode,
          freeEditMode: s.freeEditMode,
          moveAsBlock: s.moveAsBlock,
          groupMode: s.groupMode,
          editorMode: s.editorMode,
          dataBindings: { ...s.dataBindings },
          userTouchedElements: [...s.userTouchedElements],
          templateId: s.templateId,
          templateName: s.templateName,
          visibility: s.visibility,
          playerSlots: s.playerSlots,
          positions: s.positions,
          elements: s.elements,
          textOverrides: s.textOverrides,
          zIndex: s.zIndex,
          game,
          ts: Date.now(),
        };
      },
    }),
    {
      name: "stream-sports-editor",
      partialize: (s) => ({
        editorMode: s.editorMode,
        freeEditMode: s.freeEditMode,
        moveAsBlock: s.moveAsBlock,
        groupMode: s.groupMode,
        dataBindings: s.dataBindings,
        userTouchedElements: s.userTouchedElements,
        positions: s.positions,
        elements: s.elements,
        visibility: s.visibility,
        textOverrides: s.textOverrides,
        zIndex: s.zIndex,
        snapToGrid: s.snapToGrid,
        templateId: s.templateId,
        templateName: s.templateName,
        playerSlots: s.playerSlots,
      }),
    }
  )
);

/** Shallow selectors to reduce re-renders during polling */
export const selectNbaGame = (s: EditorStore) => s.nbaGame;
export const selectMlbGame = (s: EditorStore) => s.mlbGame;
export const selectVisibility = (s: EditorStore) => s.visibility;
