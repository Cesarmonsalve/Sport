import type { LineupDisplayMode, LineupPreset, WidgetDisplaySettings } from "@/types";

export interface LineupCardFlags {
  showPhoto: boolean;
  showStats: boolean;
  showName: boolean;
}

const PRESET_FLAGS: Record<LineupPreset, LineupCardFlags> = {
  "text-only": { showPhoto: false, showStats: false, showName: true },
  "name-photo": { showPhoto: true, showStats: false, showName: true },
  "name-stats": { showPhoto: false, showStats: true, showName: true },
  full: { showPhoto: true, showStats: true, showName: true },
};

/** Legacy LineupDisplayMode → preset */
function legacyToPreset(mode?: LineupDisplayMode): LineupPreset {
  switch (mode) {
    case "text-only":
      return "text-only";
    case "photo-only":
    case "photo-text":
      return "name-photo";
    case "text-stats":
      return "name-stats";
    case "photo-stats":
    case "full":
    default:
      return "full";
  }
}

export function resolveLineupCardFlags(settings?: WidgetDisplaySettings): LineupCardFlags {
  const preset =
    settings?.lineupPreset ?? legacyToPreset(settings?.lineupDisplayMode) ?? "full";
  const base = PRESET_FLAGS[preset];
  return {
    showPhoto: settings?.showPhoto ?? base.showPhoto,
    showStats: settings?.showStats ?? base.showStats,
    showName: settings?.showName ?? base.showName,
  };
}

export const LINEUP_PRESET_LABELS: Record<LineupPreset, string> = {
  "text-only": "Solo texto",
  "name-photo": "Nombre + foto",
  "name-stats": "Nombre + stats",
  full: "Completo",
};

/** @deprecated */
export function showLineupPhoto(mode: LineupDisplayMode): boolean {
  return resolveLineupCardFlags({ lineupDisplayMode: mode }).showPhoto;
}

export function showLineupStats(mode: LineupDisplayMode): boolean {
  return resolveLineupCardFlags({ lineupDisplayMode: mode }).showStats;
}

export function showLineupName(mode: LineupDisplayMode): boolean {
  return resolveLineupCardFlags({ lineupDisplayMode: mode }).showName;
}

export const LINEUP_MODE_LABELS = LINEUP_PRESET_LABELS;
