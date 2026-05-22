"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  EditorMode,
  ElementStyle,
  MlbGameSnapshot,
  NbaGameSnapshot,
  Sport,
  StreamSportsState,
} from "@/types";
import { NBA_MOCK_GAME } from "@/lib/espn/nba";
import { MLB_MOCK_GAME } from "@/lib/espn/mlb";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";

function defaultPositions(sport: Sport): Record<string, { left: string; top: string }> {
  const reg = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const out: Record<string, { left: string; top: string }> = {};
  Object.values(reg).forEach((e) => {
    if (e.defaults?.left || e.defaults?.top) {
      out[e.id] = {
        left: e.defaults.left ?? "0",
        top: e.defaults.top ?? "0",
      };
    }
  });
  return out;
}

function defaultVisibility(sport: Sport): Record<string, boolean> {
  const reg = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const out: Record<string, boolean> = {};
  Object.keys(reg).forEach((id) => {
    out[id] = id.includes("scorebug") || id.includes("scoreboard") || id.startsWith("sb-") || id.startsWith("score-");
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

interface EditorStore {
  sport: Sport;
  room: string;
  eventId: string | null;
  designMode: boolean;
  groupMode: boolean;
  editorMode: EditorMode;
  selectedId: string | null;
  sidebarCollapsed: boolean;
  visibility: Record<string, boolean>;
  positions: Record<string, { left: string; top: string }>;
  elements: Record<string, ElementStyle>;
  dirtyIds: string[];
  nbaGame: NbaGameSnapshot;
  mlbGame: MlbGameSnapshot;
  syncStatus: string;

  setSport: (s: Sport) => void;
  setRoom: (r: string) => void;
  setEventId: (id: string | null) => void;
  setDesignMode: (v: boolean) => void;
  setEditorMode: (m: EditorMode) => void;
  setGroupMode: (v: boolean) => void;
  setSelectedId: (id: string | null) => void;
  toggleSidebar: () => void;
  setVisibility: (id: string, visible: boolean) => void;
  setPosition: (id: string, pos: { left: string; top: string }) => void;
  setElementStyle: (id: string, style: ElementStyle) => void;
  applyPreset: (map: Record<string, ElementStyle>) => void;
  setNbaGame: (g: NbaGameSnapshot) => void;
  setMlbGame: (g: MlbGameSnapshot) => void;
  setSyncStatus: (s: string) => void;
  importState: (state: Partial<StreamSportsState>) => void;
  exportState: () => StreamSportsState;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      sport: "nba",
      room: "",
      eventId: null,
      designMode: false,
      groupMode: true,
      editorMode: "simple",
      selectedId: null,
      sidebarCollapsed: false,
      visibility: defaultVisibility("nba"),
      positions: defaultPositions("nba"),
      elements: {},
      dirtyIds: [],
      nbaGame: NBA_MOCK_GAME,
      mlbGame: MLB_MOCK_GAME,
      syncStatus: "offline",

      setSport: (sport) =>
        set({
          sport,
          visibility: defaultVisibility(sport),
          positions: defaultPositions(sport),
          selectedId: null,
        }),
      setRoom: (room) => set({ room }),
      setEventId: (eventId) => set({ eventId }),
      setDesignMode: (designMode) =>
        set({
          designMode,
          nbaGame: designMode ? NBA_MOCK_GAME : get().nbaGame,
          mlbGame: designMode ? MLB_MOCK_GAME : get().mlbGame,
        }),
      setEditorMode: (editorMode) => set({ editorMode }),
      setGroupMode: (groupMode) => set({ groupMode }),
      setSelectedId: (selectedId) => set({ selectedId }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setVisibility: (id, visible) =>
        set((s) => ({
          visibility: { ...s.visibility, [id]: visible },
        })),
      setPosition: (id, pos) =>
        set((s) => ({
          positions: { ...s.positions, [id]: pos },
          dirtyIds: s.dirtyIds.includes(id) ? s.dirtyIds : [...s.dirtyIds, id],
        })),
      setElementStyle: (id, style) =>
        set((s) => ({
          elements: { ...s.elements, [id]: { ...s.elements[id], ...style } },
          dirtyIds: s.dirtyIds.includes(id) ? s.dirtyIds : [...s.dirtyIds, id],
        })),
      applyPreset: (map) =>
        set((s) => ({
          elements: Object.fromEntries(
            Object.entries(map).map(([id, st]) => [id, { ...s.elements[id], ...st }])
          ),
          dirtyIds: [...new Set([...s.dirtyIds, ...Object.keys(map)])],
        })),
      setNbaGame: (nbaGame) => set({ nbaGame }),
      setMlbGame: (mlbGame) => set({ mlbGame }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),
      importState: (state) =>
        set((s) => ({
          designMode: state.designMode ?? s.designMode,
          groupMode: state.groupMode ?? s.groupMode,
          editorMode: state.editorMode ?? s.editorMode,
          visibility: { ...s.visibility, ...state.visibility },
          positions: { ...s.positions, ...state.positions },
          elements: { ...s.elements, ...state.elements },
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
      exportState: () => {
        const s = get();
        const game = s.sport === "nba" ? s.nbaGame : s.mlbGame;
        const elements: Record<string, ElementStyle> = {};
        for (const id of s.dirtyIds) {
          if (s.elements[id]) elements[id] = s.elements[id];
        }
        return {
          version: 1 as const,
          sport: s.sport,
          room: s.room,
          eventId: s.eventId ?? undefined,
          designMode: s.designMode,
          groupMode: s.groupMode,
          editorMode: s.editorMode,
          visibility: s.visibility,
          positions: s.positions,
          elements: { ...s.elements, ...elements },
          game,
          ts: Date.now(),
        };
      },
    }),
    {
      name: "stream-sports-editor",
      partialize: (s) => ({
        editorMode: s.editorMode,
        groupMode: s.groupMode,
        positions: s.positions,
        elements: s.elements,
        visibility: s.visibility,
      }),
    }
  )
);
