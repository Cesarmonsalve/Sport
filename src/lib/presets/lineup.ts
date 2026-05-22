import type { LineupDisplayMode, MarkerStyle, WidgetDisplaySettings } from "@/types";

export const LINEUP_PRESETS: Record<
  string,
  { label: string; widgetSettings: Record<string, WidgetDisplaySettings>; elements?: Record<string, { fontSize?: string }> }
> = {
  "lineup-minimal-text": {
    label: "Lineup · texto mínimo",
    widgetSettings: {
      "quinteto-widget": { lineupDisplayMode: "text-only" },
      "roster-widget": { lineupDisplayMode: "text-only" },
      "court-positions-widget": { markerStyle: "initials" },
      "field-positions-widget": { markerStyle: "initials" },
    },
    elements: {
      "quinteto-widget": { fontSize: "11px" },
    },
  },
  "lineup-broadcast-photos": {
    label: "Lineup · broadcast fotos",
    widgetSettings: {
      "quinteto-widget": { lineupDisplayMode: "photo-text" },
      "roster-widget": { lineupDisplayMode: "photo-text" },
      "court-positions-widget": { markerStyle: "photo" },
      "field-positions-widget": { markerStyle: "photo" },
    },
  },
  "lineup-stats-heavy": {
    label: "Lineup · stats pesado",
    widgetSettings: {
      "quinteto-widget": { lineupDisplayMode: "full" },
      "roster-widget": { lineupDisplayMode: "text-stats" },
      "court-positions-widget": { markerStyle: "name" },
      "field-positions-widget": { markerStyle: "name" },
    },
    elements: {
      "quinteto-widget": { fontSize: "12px" },
    },
  },
};

export function applyLineupPreset(id: keyof typeof LINEUP_PRESETS) {
  return LINEUP_PRESETS[id];
}

export type { LineupDisplayMode, MarkerStyle };
