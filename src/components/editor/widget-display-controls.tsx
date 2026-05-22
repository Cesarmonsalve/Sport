"use client";

import { Label } from "@/components/ui/label";
import { LINEUP_MODE_LABELS } from "@/lib/overlay/lineup-display";
import { useEditorStore } from "@/lib/store/editor-store";
import { LINEUP_PRESETS } from "@/lib/presets/lineup";
import { Button } from "@/components/ui/button";
import type { LineupDisplayMode, MarkerStyle } from "@/types";

const LINEUP_WIDGETS = new Set(["quinteto-widget", "roster-widget"]);
const MARKER_WIDGETS = new Set(["court-positions-widget", "field-positions-widget"]);

interface Props {
  widgetId: string;
}

export function WidgetDisplayControls({ widgetId }: Props) {
  const settings = useEditorStore((s) => s.widgetSettings[widgetId]);
  const setWidgetSettings = useEditorStore((s) => s.setWidgetSettings);
  const applyLineupPreset = useEditorStore((s) => s.applyLineupPreset);

  if (LINEUP_WIDGETS.has(widgetId)) {
    return (
      <div className="space-y-2 mt-3 border-t border-border pt-3">
        <Label className="text-xs font-semibold">Modo de lineup</Label>
        <select
          className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs px-2"
          value={settings?.lineupDisplayMode ?? "full"}
          onChange={(e) =>
            setWidgetSettings(widgetId, {
              lineupDisplayMode: e.target.value as LineupDisplayMode,
            })
          }
        >
          {Object.entries(LINEUP_MODE_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1">
          {Object.entries(LINEUP_PRESETS).map(([id, p]) => (
            <Button
              key={id}
              variant="outline"
              size="sm"
              className="h-6 text-[9px]"
              onClick={() => applyLineupPreset(id)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (MARKER_WIDGETS.has(widgetId)) {
    return (
      <div className="space-y-2 mt-3 border-t border-border pt-3">
        <Label className="text-xs font-semibold">Marcadores en cancha/campo</Label>
        <select
          className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs px-2"
          value={settings?.markerStyle ?? "photo"}
          onChange={(e) =>
            setWidgetSettings(widgetId, {
              markerStyle: e.target.value as MarkerStyle,
            })
          }
        >
          <option value="photo">Con foto</option>
          <option value="initials">Solo iniciales</option>
          <option value="name">Solo nombre</option>
          <option value="dot">Punto (mínimo)</option>
        </select>
      </div>
    );
  }

  return null;
}
