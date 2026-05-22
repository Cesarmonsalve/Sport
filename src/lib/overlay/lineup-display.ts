import type { LineupDisplayMode } from "@/types";

export function showLineupPhoto(mode: LineupDisplayMode): boolean {
  return mode !== "text-only" && mode !== "text-stats";
}

export function showLineupStats(mode: LineupDisplayMode): boolean {
  return mode === "photo-stats" || mode === "text-stats" || mode === "full";
}

export function showLineupName(mode: LineupDisplayMode): boolean {
  return mode !== "photo-only";
}

export const LINEUP_MODE_LABELS: Record<LineupDisplayMode, string> = {
  "text-only": "Solo texto",
  "photo-text": "Foto + nombre",
  "photo-stats": "Foto + stats",
  "text-stats": "Texto + stats",
  full: "Completo",
  "photo-only": "Solo fotos",
};
