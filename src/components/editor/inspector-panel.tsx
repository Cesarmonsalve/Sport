"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlignCenterHorizontal,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  Move,
  Paintbrush,
  Database,
  Sparkles,
  Play,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";
import { NBA_REGISTRY, NBA_PRESETS } from "@/lib/registry/nba";
import { MLB_REGISTRY, MLB_PRESETS } from "@/lib/registry/mlb";
import {
  InspectorColorsTab,
  InspectorDataTab,
  InspectorImageTab,
  InspectorLayoutTab,
  InspectorTypographyTab,
} from "@/components/editor/inspector-fields";
import { WidgetDisplayControls } from "@/components/editor/widget-display-controls";
import { ScorebugStylePicker } from "@/components/editor/scorebug-style-picker";
import { TickerInspector } from "@/components/editor/ticker-inspector";
import type { SceneTransition, Sport, WidgetAnimation } from "@/types";

const ANIM_OPTIONS: { value: WidgetAnimation; label: string }[] = [
  { value: "none", label: "Sin animación" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "scale", label: "Scale" },
  { value: "flip", label: "Flip 3D" },
  { value: "bounce", label: "Bounce" },
];

const EASING: { value: string; label: string }[] = [
  { value: "ease", label: "ease" },
  { value: "ease-in", label: "ease-in" },
  { value: "ease-out", label: "ease-out" },
  { value: "ease-in-out", label: "ease-in-out" },
  { value: "linear", label: "linear" },
  { value: "spring", label: "spring" },
  { value: "cubic-bezier(0.34, 1.56, 0.64, 1)", label: "back-out" },
  { value: "cubic-bezier(0.68, -0.55, 0.27, 1.55)", label: "back-in-out" },
  { value: "cubic-bezier(0.22, 1, 0.36, 1)", label: "expo-soft" },
];

interface InspectorPanelProps {
  sport: Sport;
}

export function InspectorPanel({ sport }: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<"position" | "style" | "data" | "anim">("position");
  const [previewKey, setPreviewKey] = useState(0);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const positions = useEditorStore((s) => s.positions);
  const visibility = useEditorStore((s) => s.visibility);
  const dataBindings = useEditorStore((s) => s.dataBindings);
  const lockedIds = useEditorStore((s) => s.lockedIds);
  const setElementStyle = useEditorStore((s) => s.setElementStyle);
  const setPosition = useEditorStore((s) => s.setPosition);
  const setVisibility = useEditorStore((s) => s.setVisibility);
  const setTextOverride = useEditorStore((s) => s.setTextOverride);
  const setZIndex = useEditorStore((s) => s.setZIndex);
  const setLocked = useEditorStore((s) => s.setLocked);
  const setDataBinding = useEditorStore((s) => s.setDataBinding);
  const resetTransform = useEditorStore((s) => s.resetTransform);
  const duplicateElementAsCopy = useEditorStore((s) => s.duplicateElementAsCopy);
  const applyPreset = useEditorStore((s) => s.applyPreset);
  const alignSelection = useEditorStore((s) => s.alignSelection);
  const textOverrides = useEditorStore((s) => s.textOverrides);
  const confettiEnabled = useEditorStore((s) => s.confettiEnabled);
  const setConfettiEnabled = useEditorStore((s) => s.setConfettiEnabled);
  const smartSlots = useEditorStore((s) => s.smartSlots);
  const sceneTransition = useEditorStore((s) => s.sceneTransition);
  const setSceneTransition = useEditorStore((s) => s.setSceneTransition);
  const sceneTransitionMs = useEditorStore((s) => s.sceneTransitionMs);
  const setSceneTransitionMs = useEditorStore((s) => s.setSceneTransitionMs);

  const registry = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const presets = sport === "nba" ? NBA_PRESETS : MLB_PRESETS;
  const entry = selectedId ? registry[selectedId] : null;
  const smartSlot = selectedId ? smartSlots[selectedId] : null;
  const layerLabel = entry?.label ?? smartSlot?.label ?? selectedId;
  const hasSelection = !!selectedId && !!(entry || smartSlot);
  const style = selectedId ? elements[selectedId] ?? {} : {};
  const pos = selectedId ? positions[selectedId] : undefined;
  const multi = selectedIds.length >= 2;

  const patchStyle = (p: typeof style) => {
    if (!selectedId) return;
    setElementStyle(selectedId, p);
  };
  const patchPos = (p: { left?: string; top?: string }) => {
    if (!selectedId) return;
    setPosition(selectedId, {
      left: p.left ?? pos?.left ?? "0",
      top: p.top ?? pos?.top ?? "0",
    });
  };

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-l border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-medium text-zinc-100">Inspector</h2>
        <p className="text-xs text-zinc-500 truncate mt-0.5">
          {hasSelection ? layerLabel : "Selecciona una capa"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {hasSelection && selectedId ? (
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="flex-1 overflow-y-auto p-4 space-y-2"
          >
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="w-full grid grid-cols-4 h-9 bg-zinc-900 border border-zinc-800 p-0.5">
                <TabsTrigger value="position" className="text-[10px] gap-1 data-[state=active]:bg-zinc-800">
                  <Move className="h-3 w-3" />
                  <span className="hidden sm:inline">Pos</span>
                </TabsTrigger>
                <TabsTrigger value="style" className="text-[10px] gap-1 data-[state=active]:bg-zinc-800">
                  <Paintbrush className="h-3 w-3" />
                  <span className="hidden sm:inline">Estilo</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="text-[10px] gap-1 data-[state=active]:bg-zinc-800">
                  <Database className="h-3 w-3" />
                  <span className="hidden sm:inline">Datos</span>
                </TabsTrigger>
                <TabsTrigger value="anim" className="text-[10px] gap-1 data-[state=active]:bg-zinc-800">
                  <Sparkles className="h-3 w-3" />
                  <span className="hidden sm:inline">Anim</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="position" className="mt-3 space-y-3">
                <InspectorLayoutTab
                  id={selectedId}
                  style={style}
                  pos={pos}
                  locked={lockedIds[selectedId]}
                  setStyle={patchStyle}
                  setPos={patchPos}
                  setLocked={(v) => setLocked(selectedId, v)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Z-index</Label>
                    <Input
                      type="number"
                      className="h-7 text-xs"
                      value={style.zIndex ?? ""}
                      onChange={(e) => {
                        const z = parseInt(e.target.value, 10);
                        if (!Number.isNaN(z)) setZIndex(selectedId, z);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Opacidad %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      className="h-7 text-xs"
                      value={Math.round((Number(style.opacity ?? 1) || 1) * 100)}
                      onChange={(e) =>
                        patchStyle({ opacity: String(Number(e.target.value) / 100) })
                      }
                    />
                  </div>
                </div>
                {multi && (
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-border">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => alignSelection("left")} title="Alinear izq">
                      <AlignLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => alignSelection("center")} title="Centrar H">
                      <AlignCenterHorizontal className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => alignSelection("right")} title="Alinear der">
                      <AlignRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => alignSelection("middle")} title="Centrar V">
                      <AlignVerticalJustifyCenter className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Visible en overlay</Label>
                  <Switch
                    checked={visibility[selectedId] !== false}
                    onCheckedChange={(v) => setVisibility(selectedId, v)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="style" className="mt-3 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Formas (design tokens)
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {(
                      [
                        ["default", "Default"],
                        ["glass", "Glass"],
                        ["tech-border", "Tech border"],
                        ["minimal", "Minimal"],
                        ["broadcast-plate", "Broadcast"],
                        ["neon-accent", "Neón accent"],
                      ] as const
                    ).map(([v, label]) => (
                      <button
                        key={v}
                        type="button"
                        data-variant={v}
                        className={`rounded border px-2 py-1.5 text-[9px] ${
                          (style.designVariant ?? "default") === v
                            ? "border-primary ring-1 ring-primary"
                            : "border-border"
                        }`}
                        onClick={() => patchStyle({ designVariant: v })}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <InspectorTypographyTab style={style} setStyle={patchStyle} />
                <InspectorColorsTab style={style} setStyle={patchStyle} />
                <InspectorImageTab style={style} setStyle={patchStyle} />
                <div className="flex flex-wrap gap-1">
                  {Object.entries(presets).map(([key, p]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => applyPreset(p.map as Record<string, typeof style>)}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
                {(selectedId === "nba-scorebug" || selectedId === "scoreboard") && (
                  <ScorebugStylePicker />
                )}
              </TabsContent>

              <TabsContent value="data" className="mt-3 space-y-3">
                <InspectorDataTab
                  binding={dataBindings[selectedId]}
                  setBinding={(b) => setDataBinding(selectedId, b)}
                />
                <div className="space-y-1">
                  <Label className="text-[10px]">Texto override</Label>
                  <Input
                    className="h-7 text-xs"
                    value={textOverrides[selectedId] ?? ""}
                    onChange={(e) => setTextOverride(selectedId, e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">URL imagen / logo</Label>
                  <Input
                    className="h-7 text-xs"
                    value={style.imageUrl ?? dataBindings[selectedId]?.manualImageUrl ?? ""}
                    onChange={(e) => {
                      patchStyle({ imageUrl: e.target.value });
                      setDataBinding(selectedId, {
                        ...(dataBindings[selectedId] ?? { dataSource: "manual" }),
                        dataSource: "manual",
                        manualImageUrl: e.target.value,
                      });
                    }}
                    placeholder="https://..."
                  />
                </div>
                {(selectedId.startsWith("team-logo") ||
                  selectedId === "team-logo-h" ||
                  selectedId === "team-logo-v") && (
                  <p className="text-[10px] text-muted-foreground">
                    Vacía URL + fuente ESPN = logo automático del partido.
                  </p>
                )}
                {entry && <WidgetDisplayControls widgetId={selectedId} />}
                {smartSlot && (
                  <p className="text-[10px] text-zinc-500 rounded-md bg-zinc-900/80 border border-zinc-800 px-2 py-2">
                    Smart slot · {smartSlot.slotType}
                    {smartSlot.team ? ` · ${smartSlot.team}` : ""}
                  </p>
                )}
                {(selectedId === "broadcast-ticker" || selectedId === "sponsor-ticker") && (
                  <TickerInspector />
                )}
              </TabsContent>

              <TabsContent value="anim" className="mt-3 space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px]">Animación entrada</Label>
                  <select
                    className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs px-2"
                    value={style.animation ?? "none"}
                    onChange={(e) =>
                      patchStyle({ animation: e.target.value as WidgetAnimation })
                    }
                  >
                    {ANIM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Duración (ms)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={3000}
                      className="h-7 text-xs"
                      value={style.animationDurationMs ?? "350"}
                      onChange={(e) => patchStyle({ animationDurationMs: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Delay (ms)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={5000}
                      className="h-7 text-xs"
                      value={style.animationDelayMs ?? ""}
                      onChange={(e) => patchStyle({ animationDelayMs: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Easing</Label>
                    <select
                      className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs"
                      value={style.animationEasing ?? "ease-out"}
                      onChange={(e) => patchStyle({ animationEasing: e.target.value })}
                    >
                      {EASING.map((e) => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  key={previewKey}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setVisibility(selectedId, false);
                    setTimeout(() => {
                      setVisibility(selectedId, true);
                      setPreviewKey((k) => k + 1);
                    }, 80);
                  }}
                >
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  Reproducir preview
                </Button>
                <div className="space-y-1">
                  <Label className="text-[10px]">Trigger</Label>
                  <select
                    className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs"
                    value={style.animationTrigger ?? "on-show"}
                    onChange={(e) => patchStyle({ animationTrigger: e.target.value })}
                  >
                    <option value="on-show">Al mostrar</option>
                    <option value="on-score">Al anotar</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div className="rounded border border-border p-2 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Transición de escena (dock)
                  </p>
                  <select
                    className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs"
                    value={sceneTransition}
                    onChange={(e) => setSceneTransition(e.target.value as SceneTransition)}
                  >
                    {["cut", "fade", "slide-left", "slide-up", "wipe", "dissolve"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="range"
                    min={200}
                    max={1500}
                    step={100}
                    value={sceneTransitionMs}
                    onChange={(e) => setSceneTransitionMs(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-muted-foreground">{sceneTransitionMs}ms · cambia escenas en Producción</p>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Confetti en gol</Label>
                  <Switch checked={confettiEnabled} onCheckedChange={setConfettiEnabled} />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => resetTransform(selectedId)}>
                  Reset transform
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => duplicateElementAsCopy(selectedId)}
                >
                  Duplicar como copia
                </Button>
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <p className="p-4 text-xs text-zinc-500 leading-relaxed">
            Selecciona un widget o smart slot en el canvas. Atajos: H ocultar · L bloquear ·
            Ctrl+G agrupar.
          </p>
        )}
      </AnimatePresence>
    </aside>
  );
}
