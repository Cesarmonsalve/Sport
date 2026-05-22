import type { LineupPreset, WidgetDisplaySettings } from "@/types";

export const LINEUP_PRESETS: Record<
  string,
  {
    label: string;
    widgetSettings: Record<string, WidgetDisplaySettings>;
    elements?: Record<string, { fontSize?: string }>;
  }
> = {
  "lineup-minimal-text": {
    label: "Tarjetas · texto",
    widgetSettings: {
      "quinteto-widget": {
        lineupPreset: "text-only",
        showPhoto: false,
        showStats: false,
        showName: true,
      },
      "roster-widget": {
        lineupPreset: "text-only",
        showPhoto: false,
        showStats: false,
        showName: true,
      },
      "court-positions-widget": { markerStyle: "initials", markerShowPhoto: false },
      "field-positions-widget": { markerStyle: "initials", markerShowPhoto: false },
    },
  },
  "lineup-broadcast-photos": {
    label: "Tarjetas · foto+nombre",
    widgetSettings: {
      "quinteto-widget": {
        lineupPreset: "name-photo",
        showPhoto: true,
        showStats: false,
        showName: true,
      },
      "roster-widget": {
        lineupPreset: "name-photo",
        showPhoto: true,
        showStats: false,
        showName: true,
      },
      "court-positions-widget": { markerStyle: "photo", markerShowPhoto: true },
      "field-positions-widget": { markerStyle: "photo", markerShowPhoto: true },
    },
  },
  "lineup-stats-heavy": {
    label: "Tarjetas · completas",
    widgetSettings: {
      "quinteto-widget": {
        lineupPreset: "full",
        showPhoto: true,
        showStats: true,
        showName: true,
      },
      "roster-widget": {
        lineupPreset: "name-stats",
        showPhoto: false,
        showStats: true,
        showName: true,
      },
      "court-positions-widget": { markerStyle: "name", markerShowPhoto: false },
      "field-positions-widget": { markerStyle: "name", markerShowPhoto: false },
    },
    elements: {
      "quinteto-widget": { fontSize: "12px" },
    },
  },
};
