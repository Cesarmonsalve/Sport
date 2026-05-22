"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LINEUP_PRESET_LABELS, resolveLineupCardFlags } from "@/lib/overlay/lineup-display";
import { useEditorStore } from "@/lib/store/editor-store";
import { LINEUP_PRESETS } from "@/lib/presets/lineup";
import { Button } from "@/components/ui/button";
import type { LineupPreset, MarkerStyle } from "@/types";

const LINEUP_WIDGETS = new Set(["quinteto-widget", "roster-widget"]);
const MARKER_WIDGETS = new Set(["court-positions-widget", "field-positions-widget"]);

interface Props {
  widgetId: string;
}

export function WidgetDisplayControls({ widgetId }: Props) {
  const settings = useEditorStore((s) => s.widgetSettings[widgetId]);
  const setWidgetSettings = useEditorStore((s) => s.setWidgetSettings);
  const applyLineupPreset = useEditorStore((s) => s.applyLineupPreset);
  const flags = resolveLineupCardFlags(settings);

  if (LINEUP_WIDGETS.has(widgetId)) {
    return (
      <div className="space-y-2 mt-3 border-t border-border pt-3">
        <Label className="text-xs font-semibold">Tarjetas de jugador (fotos aquí)</Label>
        <select
          className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs px-2"
          value={settings?.lineupPreset ?? "full"}
          onChange={(e) =>
            setWidgetSettings(widgetId, {
              lineupPreset: e.target.value as LineupPreset,
            })
          }
        >
          {Object.entries(LINEUP_PRESET_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[10px]">Foto</Label>
            <Switch
              checked={flags.showPhoto}
              onCheckedChange={(v) => setWidgetSettings(widgetId, { showPhoto: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-[10px]">Nombre</Label>
            <Switch
              checked={flags.showName}
              onCheckedChange={(v) => setWidgetSettings(widgetId, { showName: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-[10px]">Stats</Label>
            <Switch
              checked={flags.showStats}
              onCheckedChange={(v) => setWidgetSettings(widgetId, { showStats: v })}
            />
          </div>
        </div>
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
        <Label className="text-xs font-semibold">Marcador en cancha/campo</Label>
        <p className="text-[9px] text-muted-foreground">
          Solo nombre o iniciales. Las fotos van en quinteto, roster o tarjetas de jugador.
        </p>
        <select
          className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs px-2"
          value={settings?.markerStyle === "photo" ? "name" : (settings?.markerStyle ?? "name")}
          onChange={(e) =>
            setWidgetSettings(widgetId, {
              markerStyle: e.target.value as MarkerStyle,
              markerShowPhoto: false,
            })
          }
        >
          <option value="name">Solo nombre</option>
          <option value="initials">Iniciales</option>
          <option value="dot">Punto</option>
        </select>
        <div className="flex items-center justify-between opacity-50">
          <Label className="text-[10px]" title="Fotos solo en lineup / tarjetas">
            Mostrar foto
          </Label>
          <Switch checked={false} disabled title="Fotos solo en quinteto y roster" />
        </div>
      </div>
    );
  }

  return null;
}
