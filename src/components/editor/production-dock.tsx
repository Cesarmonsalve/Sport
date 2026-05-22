"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Copy,
  Download,
  Radio,
  Upload,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEspnPoll } from "@/hooks/use-espn-poll";
import { appendRoomToPath } from "@/lib/sync/room";
import { getScenesForSport } from "@/lib/scenes/broadcast-scenes";
import { loadAppSettings } from "@/lib/settings/app-settings";
import {
  buildProjectExport,
  downloadProjectJson,
  parseProjectFile,
} from "@/lib/project/io";
import { formatGameStatus } from "@/lib/utils";
import { buildThemeExport, downloadThemeJson, parseThemeFile } from "@/lib/theme/io";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";
import type { SceneTransition, Sport } from "@/types";

const HOTKEYS = [
  ["P", "Mostrar/ocultar sidebar"],
  ["Ctrl+Z", "Deshacer"],
  ["Ctrl+Y", "Rehacer"],
  ["Delete", "Ocultar widget seleccionado"],
  ["Shift+Delete", "Mostrar todos los widgets"],
  ["Ctrl+D", "Duplicar"],
  ["Ctrl+G", "Agrupar selección"],
  ["Flechas", "Mover 1px (8px con Shift)"],
];

interface ProductionDockProps {
  sport: Sport;
  room: string;
}

function formatAgo(ms: number): string {
  if (!ms) return "—";
  const sec = Math.floor((Date.now() - ms) / 1000);
  if (sec < 5) return "ahora";
  if (sec < 60) return `hace ${sec}s`;
  return `hace ${Math.floor(sec / 60)}m`;
}

export function ProductionDock({ sport, room }: ProductionDockProps) {
  const [expanded, setExpanded] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const eventId = useEditorStore((s) => s.eventId);
  const setEventId = useEditorStore((s) => s.setEventId);
  const designMode = useEditorStore((s) => s.designMode);
  const syncStatus = useEditorStore((s) => s.syncStatus);
  const applyBroadcastScene = useEditorStore((s) => s.applyBroadcastScene);
  const sceneTransition = useEditorStore((s) => s.sceneTransition);
  const setSceneTransition = useEditorStore((s) => s.setSceneTransition);
  const sceneTransitionMs = useEditorStore((s) => s.sceneTransitionMs);
  const setSceneTransitionMs = useEditorStore((s) => s.setSceneTransitionMs);
  const exportState = useEditorStore((s) => s.exportState);
  const importState = useEditorStore((s) => s.importState);
  const importTheme = useEditorStore((s) => s.importTheme);
  const savePositionsNow = useEditorStore((s) => s.savePositionsNow);

  const { events, isLoading, isFetching, dataUpdatedAt, refetch } = useEspnPoll(sport);
  const settings = loadAppSettings();
  const scenes = getScenesForSport(sport);
  const registry = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;

  const widgetUrls = useMemo(() => {
    const top = Object.values(registry)
      .filter((e) => e.compound || !e.parent)
      .slice(0, 12);
    return top.map((e) => ({
      id: e.id,
      label: e.label,
      path: appendRoomToPath(`/overlay/${sport}/${e.id}`, room),
    }));
  }, [sport, room, registry]);

  const liveEvents = events.filter((e) => e.state === "in");
  const mqttOk = syncStatus.includes("connected");
  const espnOk = !designMode && dataUpdatedAt > 0 && Date.now() - dataUpdatedAt < 60_000;

  const copy = (path: string) => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path;
    void navigator.clipboard.writeText(url);
  };

  const copyAllObs = () => {
    const lines = widgetUrls.map((w) => `${w.label}: ${window.location.origin}${w.path}`);
    void navigator.clipboard.writeText(lines.join("\n"));
  };

  const onExportProject = () => {
    const state = exportState();
    downloadProjectJson(buildProjectExport(state, `${sport}-proyecto`));
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        const project = parseProjectFile(json);
        if (project) {
          importState(project);
          return;
        }
        const theme = parseThemeFile(json);
        if (theme) importTheme(theme);
      } catch {
        /* invalid */
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="shrink-0 border-t border-border bg-card">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/40"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-primary" />
          Producción
        </span>
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="px-4 pb-3">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant={espnOk ? "success" : "secondary"} className="gap-1 text-[10px]">
              {espnOk ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              ESPN {designMode ? "mock" : formatAgo(dataUpdatedAt)}
              {isFetching && " · sync…"}
            </Badge>
            <Badge variant={mqttOk ? "success" : "warning"} className="text-[10px]">
              MQTT {syncStatus.split(":")[0] || syncStatus}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              Poll {settings.pollIntervalLiveMs / 1000}s vivo / {settings.pollIntervalIdleMs / 1000}s
            </span>
            <Link href="/settings" className="text-[10px] text-primary hover:underline ml-auto">
              Ajustes
            </Link>
          </div>

          <Tabs defaultValue="game">
            <TabsList className="h-8 w-full justify-start">
              <TabsTrigger value="game" className="text-xs">
                Partido
              </TabsTrigger>
              <TabsTrigger value="scenes" className="text-xs">
                Escenas
              </TabsTrigger>
              <TabsTrigger value="obs" className="text-xs">
                OBS
              </TabsTrigger>
              <TabsTrigger value="project" className="text-xs">
                Proyecto
              </TabsTrigger>
              <TabsTrigger value="keys" className="text-xs">
                Atajos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="game" className="mt-2 space-y-2">
              {liveEvents.length > 0 && (
                <p className="text-[10px] text-emerald-400">
                  {liveEvents.length} partido(s) EN VIVO hoy
                </p>
              )}
              <div className="flex gap-2">
                <select
                  className="h-8 flex-1 rounded-md border border-border bg-muted/50 px-2 text-xs"
                  value={eventId ?? ""}
                  onChange={(e) => setEventId(e.target.value || null)}
                  disabled={designMode || isLoading}
                >
                  <option value="">— Seleccionar —</option>
                  {events.map((ev) => {
                    const e = ev as typeof ev & { state?: string; date?: string };
                    return (
                      <option key={ev.id} value={ev.id}>
                        {ev.state === "in" ? "🔴 " : ""}
                        {ev.shortName || ev.name} · {formatGameStatus(e.state || "pre", ev.status, e.date)}
                      </option>
                    );
                  })}
                </select>
                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={designMode}>
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="scenes" className="mt-2 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="text-muted-foreground">Transición</span>
                <select
                  className="h-7 rounded border border-border bg-muted/50 px-2"
                  value={sceneTransition}
                  onChange={(e) =>
                    setSceneTransition(e.target.value as SceneTransition)
                  }
                >
                  {["cut", "fade", "slide-left", "slide-up", "wipe", "dissolve"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="range"
                  min={200}
                  max={1500}
                  step={100}
                  value={sceneTransitionMs}
                  onChange={(e) => setSceneTransitionMs(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-muted-foreground">{sceneTransitionMs}ms</span>
              </div>
              <div className="flex flex-wrap gap-2">
              {scenes.map((sc) => (
                <Button
                  key={sc.id}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => applyBroadcastScene(sc.id)}
                  title={sc.description}
                >
                  {sc.label}
                </Button>
              ))}
              </div>
            </TabsContent>

            <TabsContent value="obs" className="mt-2 max-h-32 overflow-y-auto space-y-1">
              <div className="flex gap-2 mb-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={copyAllObs}>
                  <Copy className="h-3 w-3" />
                  Copiar todas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => copy(appendRoomToPath(`/overlay/${sport}`, room))}
                >
                  Canvas completo
                </Button>
              </div>
              {widgetUrls.map((w) => (
                <div key={w.id} className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="w-24 truncate text-muted-foreground">{w.label}</span>
                  <button
                    type="button"
                    className="flex-1 truncate text-left hover:text-foreground"
                    onClick={() => copy(w.path)}
                  >
                    {w.path}
                  </button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copy(w.path)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="project" className="mt-2 space-y-2">
              <p className="text-[10px] text-zinc-500">
                Guardar / reiniciar canvas: menú <strong className="text-zinc-400">Canvas</strong> en el header.
              </p>
              <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => savePositionsNow({ exportTheme: true })}
              >
                Guardar + tema JSON
              </Button>
              <Button variant="outline" size="sm" onClick={onExportProject}>
                <Download className="h-3.5 w-3.5" />
                Exportar proyecto
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="h-3.5 w-3.5" />
                Importar proyecto/tema
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  const s = exportState();
                  downloadThemeJson(
                    buildThemeExport(s, `${sport}-tema`, {
                      textOverrides: useEditorStore.getState().textOverrides,
                      zIndex: useEditorStore.getState().zIndex,
                      playerSlots: useEditorStore.getState().playerSlots,
                    })
                  );
                }}
              >
                Solo tema JSON
              </Button>
              </div>
              <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
            </TabsContent>

            <TabsContent value="keys" className="mt-2">
              <ul className="grid gap-1 text-[10px] text-muted-foreground sm:grid-cols-2">
                {HOTKEYS.map(([k, d]) => (
                  <li key={k}>
                    <kbd className="rounded bg-muted px-1 font-mono text-foreground">{k}</kbd> — {d}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
