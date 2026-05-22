"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BrandKit,
  AlignmentGuides,
  EditorMode,
  ElementDataBinding,
  ElementStyle,
  SnapMode,
  GalleryPlayer,
  MlbGameSnapshot,
  NbaGameSnapshot,
  PlayerSlotBinding,
  SceneTransition,
  ScorebugStyle,
  Sport,
  StreamSportsState,
  TickerSlide,
  WidgetDisplaySettings,
  FreeCanvasElement,
} from "@/types";
import { DEFAULT_BRAND_KIT, DEFAULT_TICKER_SLIDES } from "@/lib/brand-kit/defaults";
import { captureHistorySnap, MAX_HISTORY, type EditorHistorySnap } from "@/lib/store/history";
import { galleryFromMlbGame, galleryFromNbaGame } from "@/lib/espn/gallery";
import { preloadTeamLogos } from "@/lib/espn/logos";
import { LINEUP_PRESETS } from "@/lib/presets/lineup";
import type { StreamTemplate } from "@/lib/templates/types";
import { NBA_MOCK_GAME } from "@/lib/espn/nba";
import { MLB_MOCK_GAME } from "@/lib/espn/mlb";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";
import type { ThemeExport } from "@/lib/theme/io";
import { getSceneById } from "@/lib/scenes/broadcast-scenes";
import { getTemplateById } from "@/lib/templates";
import { isFreeLayoutId, resolveLayoutDefaults } from "@/lib/layout/defaults";
import { buildThemeExport, downloadThemeJson } from "@/lib/theme/io";

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
  snapMode: SnapMode;
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
  widgetSettings: Record<string, WidgetDisplaySettings>;
  galleryPlayers: GalleryPlayer[];
  confettiEnabled: boolean;
  dropHighlightId: string | null;
  freeElements: FreeCanvasElement[];
  streamSafePreview: boolean;
  snapToElements: boolean;
  copiedStyle: ElementStyle | null;
  widgetSearch: string;
  showEditorHints: boolean;
  scorebugStyle: ScorebugStyle;
  sceneTransition: SceneTransition;
  sceneTransitionMs: number;
  brandKit: BrandKit;
  tickerSlides: TickerSlide[];
  previewMode: boolean;
  showSafeZone: boolean;
  showRulers: boolean;
  canvasZoom: number;
  canvasPan: { x: number; y: number };
  canvasFitMode: "fit" | "fit-width" | "manual";
  alignmentGuides: AlignmentGuides | null;
  _layoutPublisher: (() => void) | null;
  _history: EditorHistorySnap[];
  _historyIndex: number;

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
  setSnapMode: (m: SnapMode) => void;
  setShowSafeZone: (v: boolean) => void;
  setShowRulers: (v: boolean) => void;
  setCanvasZoom: (z: number) => void;
  setCanvasPan: (p: { x: number; y: number }) => void;
  setCanvasFitMode: (m: "fit" | "fit-width" | "manual") => void;
  setAlignmentGuides: (g: AlignmentGuides | null) => void;
  nudgeCanvasPan: (dx: number, dy: number) => void;
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
  applyBroadcastScene: (sceneId: string) => void;
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
  setWidgetSettings: (widgetId: string, settings: WidgetDisplaySettings) => void;
  applyLineupPreset: (presetId: string) => void;
  setGalleryPlayers: (players: GalleryPlayer[]) => void;
  assignGalleryPlayerToSlot: (slotId: string, player: GalleryPlayer) => void;
  setConfettiEnabled: (v: boolean) => void;
  setDropHighlightId: (id: string | null) => void;
  syncTeamLogosFromGame: () => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  placeFreeDrop: (player: GalleryPlayer, x: number, y: number) => string;
  addFreeElement: (type: FreeCanvasElement["type"], at?: { left: number; top: number }) => string;
  removeFreeElement: (id: string) => void;
  setStreamSafePreview: (v: boolean) => void;
  setSnapToElements: (v: boolean) => void;
  copyStyleFromSelection: () => void;
  pasteStyleToSelection: () => void;
  alignSelection: (
    mode: "left" | "center" | "right" | "top" | "middle" | "bottom"
  ) => void;
  distributeSelection: (axis: "horizontal" | "vertical") => void;
  matchSizeSelection: (dim: "width" | "height" | "both") => void;
  setWidgetSearch: (q: string) => void;
  dismissEditorHints: () => void;
  setScorebugStyle: (s: ScorebugStyle) => void;
  setSceneTransition: (t: SceneTransition) => void;
  setSceneTransitionMs: (ms: number) => void;
  setBrandKit: (kit: Partial<BrandKit>) => void;
  setTickerSlides: (slides: TickerSlide[]) => void;
  setPreviewMode: (v: boolean) => void;
  lockElement: (id: string) => void;
  unlockElement: (id: string) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  registerLayoutPublisher: (fn: (() => void) | null) => void;
  resetCanvasLayout: () => void;
  savePositionsNow: (opts?: { exportTheme?: boolean }) => void;
  exportState: () => StreamSportsState;
}

const DEFAULT_WIDGET_SETTINGS: Record<string, WidgetDisplaySettings> = {
  "quinteto-widget": { lineupPreset: "full" },
  "roster-widget": { lineupPreset: "name-photo" },
  "court-positions-widget": { markerStyle: "name", markerShowPhoto: false },
  "field-positions-widget": { markerStyle: "name", markerShowPhoto: false },
  "sponsor-ticker": {
    sponsorLines: ["Patrocinador A", "Patrocinador B", "stream-sports.live"],
  },
};

function applyHistorySnap(
  set: (partial: Partial<EditorStore>) => void,
  snap: EditorHistorySnap
) {
  set({
    positions: snap.positions,
    elements: snap.elements,
    visibility: snap.visibility,
    freeElements: snap.freeElements,
    textOverrides: snap.textOverrides,
    zIndex: snap.zIndex,
    dataBindings: snap.dataBindings,
  });
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
      snapMode: "both",
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
      widgetSettings: { ...DEFAULT_WIDGET_SETTINGS },
      galleryPlayers: [],
      confettiEnabled: false,
      dropHighlightId: null,
      freeElements: [],
      streamSafePreview: false,
      snapToElements: true,
      copiedStyle: null,
      widgetSearch: "",
      showEditorHints: true,
      scorebugStyle: "broadcast",
      sceneTransition: "fade",
      sceneTransitionMs: 500,
      brandKit: { ...DEFAULT_BRAND_KIT },
      tickerSlides: [...DEFAULT_TICKER_SLIDES],
      previewMode: false,
      showSafeZone: false,
      showRulers: true,
      canvasZoom: 0.5,
      canvasPan: { x: 0, y: 0 },
      canvasFitMode: "fit",
      alignmentGuides: null,
      _layoutPublisher: null,
      _history: [captureHistorySnap({
        positions: defaultPositions("nba"),
        elements: {},
        visibility: defaultVisibility("nba"),
        freeElements: [],
        textOverrides: {},
        zIndex: {},
        dataBindings: {},
      })],
      _historyIndex: 0,

      pushHistory: () => {
        const snap = captureHistorySnap(get());
        set((s) => {
          const branch = s._history.slice(0, s._historyIndex + 1);
          const next = [...branch, snap].slice(-MAX_HISTORY);
          return { _history: next, _historyIndex: next.length - 1 };
        });
      },
      undo: () => {
        const s = get();
        if (s._historyIndex <= 0) return;
        const idx = s._historyIndex - 1;
        applyHistorySnap(set, s._history[idx]!);
        set({ _historyIndex: idx });
      },
      redo: () => {
        const s = get();
        if (s._historyIndex >= s._history.length - 1) return;
        const idx = s._historyIndex + 1;
        applyHistorySnap(set, s._history[idx]!);
        set({ _historyIndex: idx });
      },
      canUndo: () => get()._historyIndex > 0,
      canRedo: () => get()._historyIndex < get()._history.length - 1,
      setScorebugStyle: (scorebugStyle) => {
        get().pushHistory();
        set({ scorebugStyle });
      },
      setSceneTransition: (sceneTransition) => set({ sceneTransition }),
      setSceneTransitionMs: (sceneTransitionMs) => set({ sceneTransitionMs }),
      setBrandKit: (kit) => {
        const next = { ...get().brandKit, ...kit };
        set({ brandKit: next });
        if (typeof window !== "undefined") {
          localStorage.setItem("stream-sports-brand-kit", JSON.stringify(next));
        }
      },
      setTickerSlides: (tickerSlides) => set({ tickerSlides }),
      setPreviewMode: (previewMode) => set({ previewMode }),
      lockElement: (id) => get().setLocked(id, true),
      unlockElement: (id) => get().setLocked(id, false),
      placeFreeDrop: (player, x, y) => {
        get().pushHistory();
        const id = `dropped-photo-${Date.now().toString(36).slice(-5)}`;
        const label = `${player.name}${player.jersey ? ` #${player.jersey}` : ""}`;
        const el: FreeCanvasElement = {
          id,
          type: "dropped-player-photo",
          left: `${Math.round(x)}px`,
          top: `${Math.round(y)}px`,
          width: "96px",
          height: "96px",
          imageUrl: player.headshot,
          label,
          athleteId: player.id,
        };
        set((s) => ({
          freeElements: [...s.freeElements, el],
          positions: { ...s.positions, [id]: { left: el.left, top: el.top } },
          visibility: { ...s.visibility, [id]: true },
          elements: {
            ...s.elements,
            [id]: { width: el.width, height: el.height },
          },
          selectedId: id,
          selectedIds: [id],
        }));
        return id;
      },
      addFreeElement: (type, at) => {
        get().pushHistory();
        const id = `free-${type}-${Date.now().toString(36).slice(-4)}`;
        const left = `${at?.left ?? 400}px`;
        const top = `${at?.top ?? 300}px`;
        const el: FreeCanvasElement = {
          id,
          type,
          left,
          top,
          width: type === "free-text" ? undefined : "120px",
          height: type === "free-text" ? undefined : "80px",
          text: type === "free-text" ? "Nuevo texto" : undefined,
        };
        set((s) => ({
          freeElements: [...s.freeElements, el],
          positions: { ...s.positions, [id]: { left, top } },
          visibility: { ...s.visibility, [id]: true },
          selectedId: id,
        }));
        return id;
      },
      removeFreeElement: (id) => {
        get().pushHistory();
        set((s) => ({
          freeElements: s.freeElements.filter((e) => e.id !== id),
        }));
      },
      setStreamSafePreview: (streamSafePreview) => set({ streamSafePreview }),
      setSnapToElements: (snapToElements) =>
        set({
          snapToElements,
          snapMode: snapToElements
            ? get().snapToGrid
              ? "both"
              : "elements"
            : get().snapToGrid
              ? "grid"
              : "off",
        }),
      copyStyleFromSelection: () => {
        const id = get().selectedId;
        if (!id) return;
        set({ copiedStyle: { ...get().elements[id] } });
      },
      pasteStyleToSelection: () => {
        const style = get().copiedStyle;
        const id = get().selectedId;
        if (!style || !id) return;
        get().pushHistory();
        get().setElementStyle(id, style);
      },
      alignSelection: (mode) => {
        const ids = (
          get().selectedIds.length
            ? get().selectedIds
            : get().selectedId
              ? [get().selectedId]
              : []
        ).filter((id): id is string => Boolean(id));
        if (ids.length < 2) return;
        get().pushHistory();
        const rects = ids.map((id) => {
          const p = get().positions[id];
          const st = get().elements[id];
          const w = parseFloat(st?.width ?? "100") || 100;
          const h = parseFloat(st?.height ?? "64") || 64;
          return {
            id,
            left: parseFloat(p?.left ?? "0") || 0,
            top: parseFloat(p?.top ?? "0") || 0,
            w,
            h,
          };
        });
        const minL = Math.min(...rects.map((r) => r.left));
        const maxR = Math.max(...rects.map((r) => r.left + r.w));
        const minT = Math.min(...rects.map((r) => r.top));
        const maxB = Math.max(...rects.map((r) => r.top + r.h));
        const midX = (minL + maxR) / 2;
        const midY = (minT + maxB) / 2;
        for (const r of rects) {
          let left = r.left;
          let top = r.top;
          if (mode === "left") left = minL;
          if (mode === "right") left = maxR - r.w;
          if (mode === "center") left = midX - r.w / 2;
          if (mode === "top") top = minT;
          if (mode === "middle") top = midY - r.h / 2;
          if (mode === "bottom") top = maxB - r.h;
          get().setPosition(r.id, { left: `${Math.round(left)}px`, top: `${Math.round(top)}px` });
        }
      },
      distributeSelection: (axis) => {
        const ids = (
          get().selectedIds.length
            ? get().selectedIds
            : get().selectedId
              ? [get().selectedId]
              : []
        ).filter((id): id is string => Boolean(id));
        if (ids.length < 3) return;
        get().pushHistory();
        const rects = ids.map((id) => {
          const p = get().positions[id];
          const st = get().elements[id];
          return {
            id,
            left: parseFloat(p?.left ?? "0") || 0,
            top: parseFloat(p?.top ?? "0") || 0,
            w: parseFloat(st?.width ?? "100") || 100,
            h: parseFloat(st?.height ?? "64") || 64,
          };
        });
        const sorted = [...rects].sort((a, b) =>
          axis === "horizontal" ? a.left - b.left : a.top - b.top
        );
        const first = sorted[0]!;
        const last = sorted[sorted.length - 1]!;
        const span =
          axis === "horizontal"
            ? last.left + last.w - first.left
            : last.top + last.h - first.top;
        const totalSize = sorted.reduce(
          (s, r) => s + (axis === "horizontal" ? r.w : r.h),
          0
        );
        const gap = (span - totalSize) / (sorted.length - 1);
        let cursor = axis === "horizontal" ? first.left : first.top;
        for (const r of sorted) {
          if (axis === "horizontal") {
            get().setPosition(r.id, {
              left: `${Math.round(cursor)}px`,
              top: `${Math.round(r.top)}px`,
            });
            cursor += r.w + gap;
          } else {
            get().setPosition(r.id, {
              left: `${Math.round(r.left)}px`,
              top: `${Math.round(cursor)}px`,
            });
            cursor += r.h + gap;
          }
        }
      },
      matchSizeSelection: (dim) => {
        const ids = (
          get().selectedIds.length
            ? get().selectedIds
            : get().selectedId
              ? [get().selectedId]
              : []
        ).filter((id): id is string => Boolean(id));
        if (ids.length < 2) return;
        get().pushHistory();
        const first = get().elements[ids[0]!] ?? {};
        const w = first.width ?? "100px";
        const h = first.height ?? "64px";
        for (const id of ids.slice(1)) {
          const patch: ElementStyle = {};
          if (dim === "width" || dim === "both") patch.width = w;
          if (dim === "height" || dim === "both") patch.height = h;
          get().setElementStyle(id, patch);
        }
      },
      setWidgetSearch: (widgetSearch) => set({ widgetSearch }),
      dismissEditorHints: () => set({ showEditorHints: false }),

      setSport: (sport) =>
        set({
          sport,
          visibility: defaultVisibility(sport),
          positions: defaultPositions(sport),
          selectedId: null,
          selectedIds: [],
        }),
      setRoom: (room) => set({ room }),
      setEventId: (eventId) => {
        set({ eventId });
        const g = get();
        const game = g.sport === "nba" ? g.nbaGame : g.mlbGame;
        preloadTeamLogos([game.homeLogo, game.awayLogo]);
      },
      setDesignMode: (designMode) =>
        set((s) => {
          const nbaGame = designMode ? NBA_MOCK_GAME : s.nbaGame;
          const mlbGame = designMode ? MLB_MOCK_GAME : s.mlbGame;
          return {
            designMode,
            visibility: designMode ? designVisibility(s.sport) : defaultVisibility(s.sport),
            nbaGame,
            mlbGame,
            galleryPlayers: designMode
              ? s.sport === "nba"
                ? galleryFromNbaGame(nbaGame)
                : galleryFromMlbGame(mlbGame)
              : s.galleryPlayers,
          };
        }),
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
      setSnapToGrid: (snapToGrid) =>
        set({
          snapToGrid,
          snapMode: snapToGrid
            ? get().snapToElements
              ? "both"
              : "grid"
            : get().snapToElements
              ? "elements"
              : "off",
        }),
      setSnapMode: (snapMode) =>
        set({
          snapMode,
          snapToGrid: snapMode === "grid" || snapMode === "both",
          snapToElements: snapMode === "elements" || snapMode === "both",
        }),
      setShowSafeZone: (showSafeZone) => set({ showSafeZone }),
      setShowRulers: (showRulers) => set({ showRulers }),
      setCanvasZoom: (canvasZoom) =>
        set({ canvasZoom: Math.min(2, Math.max(0.25, canvasZoom)), canvasFitMode: "manual" }),
      setCanvasPan: (canvasPan) => set({ canvasPan }),
      setCanvasFitMode: (canvasFitMode) => set({ canvasFitMode }),
      setAlignmentGuides: (alignmentGuides) => set({ alignmentGuides }),
      nudgeCanvasPan: (dx, dy) =>
        set((s) => ({ canvasPan: { x: s.canvasPan.x + dx, y: s.canvasPan.y + dy } })),
      setVisibility: (id, visible) =>
        set((s) => ({ visibility: { ...s.visibility, [id]: visible } })),
      setPosition: (id, pos) => {
        if (get().lockedIds[id]) return;
        const prev = get().positions[id];
        if (prev?.left === pos.left && prev?.top === pos.top) return;
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
      setWidgetSettings: (widgetId, settings) =>
        set((s) => ({
          widgetSettings: {
            ...s.widgetSettings,
            [widgetId]: { ...s.widgetSettings[widgetId], ...settings },
          },
        })),
      applyLineupPreset: (presetId) => {
        const preset = LINEUP_PRESETS[presetId];
        if (!preset) return;
        set((s) => {
          const elements = { ...s.elements };
          if (preset.elements) {
            for (const [id, st] of Object.entries(preset.elements)) {
              elements[id] = { ...elements[id], ...st };
            }
          }
          return {
            widgetSettings: { ...s.widgetSettings, ...preset.widgetSettings },
            elements,
          };
        });
      },
      setGalleryPlayers: (galleryPlayers) => set({ galleryPlayers }),
      assignGalleryPlayerToSlot: (slotId, player) => {
        const label = `${player.name}${player.jersey ? ` #${player.jersey}` : ""} · ${player.teamAbbr}`;
        set((s) => ({
          dataBindings: {
            ...s.dataBindings,
            [slotId]: {
              dataSource: "manual",
              manualText: player.name,
              manualImageUrl: player.headshot,
              athleteId: player.id,
              displayLabel: label,
            },
          },
          playerSlots: {
            ...s.playerSlots,
            [slotId]: {
              slotId,
              athleteId: player.id,
              team: player.team,
              slotIndex: 0,
              position: player.position,
              dataSource: "manual",
              manualName: player.name,
              manualImageUrl: player.headshot,
            },
          },
          rotationNotice: `Asignado: ${label}`,
        }));
        window.setTimeout(() => get().setRotationNotice(null), 2500);
      },
      setConfettiEnabled: (confettiEnabled) => set({ confettiEnabled }),
      setDropHighlightId: (dropHighlightId) => set({ dropHighlightId }),
      syncTeamLogosFromGame: () => {
        const s = get();
        const game = s.sport === "nba" ? s.nbaGame : s.mlbGame;
        preloadTeamLogos([game.homeLogo, game.awayLogo]);
      },
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
      applyBroadcastScene: (sceneId) => {
        const s = get();
        const scene = getSceneById(s.sport, sceneId);
        if (!scene) return;
        const tpl = getTemplateById(s.sport, scene.templateId);
        if (tpl) get().applyStreamTemplate(tpl);
        for (const [id, visible] of Object.entries(scene.visibility)) {
          get().setVisibility(id, visible);
        }
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
          widgetSettings: { ...s.widgetSettings, ...state.widgetSettings },
          galleryPlayers: state.galleryPlayers ?? s.galleryPlayers,
          freeElements: state.freeElements ?? s.freeElements,
          confettiEnabled: state.confettiEnabled ?? s.confettiEnabled,
          streamSafePreview: state.streamSafePreview ?? s.streamSafePreview,
          scorebugStyle: state.scorebugStyle ?? s.scorebugStyle,
          sceneTransition: state.sceneTransition ?? s.sceneTransition,
          sceneTransitionMs: state.sceneTransitionMs ?? s.sceneTransitionMs,
          brandKit: state.brandKit ? { ...s.brandKit, ...state.brandKit } : s.brandKit,
          tickerSlides: state.tickerSlides ?? s.tickerSlides,
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
      registerLayoutPublisher: (fn) => set({ _layoutPublisher: fn }),
      resetCanvasLayout: () => {
        const s = get();
        get().pushHistory();
        const { positions, elements, visibility } = resolveLayoutDefaults(
          s.sport,
          s.templateId
        );

        const cleanPos = { ...positions };
        const cleanVis = { ...visibility };
        const cleanEl = { ...elements };
        const cleanZ: Record<string, number> = {};

        for (const key of Object.keys(s.positions)) {
          if (isFreeLayoutId(key)) delete cleanPos[key];
        }
        for (const key of Object.keys(s.visibility)) {
          if (isFreeLayoutId(key)) delete cleanVis[key];
        }
        for (const key of Object.keys(s.elements)) {
          if (isFreeLayoutId(key)) delete cleanEl[key];
        }

        set({
          positions: cleanPos,
          elements: cleanEl,
          visibility: cleanVis,
          zIndex: cleanZ,
          textOverrides: {},
          freeElements: [],
          userTouchedElements: [],
          dirtyIds: [],
          selectedId: null,
          selectedIds: [],
          widgetSettings: {
            ...s.widgetSettings,
            "court-positions-widget": { markerStyle: "name", markerShowPhoto: false },
            "field-positions-widget": { markerStyle: "name", markerShowPhoto: false },
          },
          rotationNotice: "Canvas reiniciado — posiciones de plantilla",
        });
        window.setTimeout(() => get().setRotationNotice(null), 2800);
      },
      savePositionsNow: (opts) => {
        const s = get();
        set({ rotationNotice: "Posiciones guardadas" });
        s._layoutPublisher?.();
        if (opts?.exportTheme) {
          const theme = buildThemeExport(s.exportState(), `layout-${Date.now()}`, {
            textOverrides: s.textOverrides,
            zIndex: s.zIndex,
            playerSlots: s.playerSlots,
          });
          downloadThemeJson(theme);
        }
        window.setTimeout(() => get().setRotationNotice(null), 2500);
      },
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
          widgetSettings: { ...s.widgetSettings },
          confettiEnabled: s.confettiEnabled,
          galleryPlayers: s.galleryPlayers,
          freeElements: s.freeElements,
          streamSafePreview: s.streamSafePreview,
          scorebugStyle: s.scorebugStyle,
          sceneTransition: s.sceneTransition,
          sceneTransitionMs: s.sceneTransitionMs,
          brandKit: s.brandKit,
          tickerSlides: s.tickerSlides,
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
        snapMode: s.snapMode,
        showSafeZone: s.showSafeZone,
        showRulers: s.showRulers,
        templateId: s.templateId,
        templateName: s.templateName,
        playerSlots: s.playerSlots,
        widgetSettings: s.widgetSettings,
        confettiEnabled: s.confettiEnabled,
        freeElements: s.freeElements,
        scorebugStyle: s.scorebugStyle,
        sceneTransition: s.sceneTransition,
        sceneTransitionMs: s.sceneTransitionMs,
        brandKit: s.brandKit,
        tickerSlides: s.tickerSlides,
      }),
    }
  )
);

/** Shallow selectors to reduce re-renders during polling */
export const selectNbaGame = (s: EditorStore) => s.nbaGame;
export const selectMlbGame = (s: EditorStore) => s.mlbGame;
export const selectVisibility = (s: EditorStore) => s.visibility;
