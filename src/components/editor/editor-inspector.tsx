"use client";

import { motion, AnimatePresence } from "framer-motion";
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
import type { Sport, WidgetAnimation } from "@/types";

interface EditorInspectorProps {
  sport: Sport;
}

const ANIM_OPTIONS: { value: WidgetAnimation; label: string }[] = [
  { value: "none", label: "Sin animación" },
  { value: "fade", label: "Fade in" },
  { value: "slide", label: "Slide in" },
];

export function EditorInspector({ sport }: EditorInspectorProps) {
  const selectedId = useEditorStore((s) => s.selectedId);
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
  const textOverrides = useEditorStore((s) => s.textOverrides);

  const registry = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const presets = sport === "nba" ? NBA_PRESETS : MLB_PRESETS;
  const entry = selectedId ? registry[selectedId] : null;
  const style = selectedId ? elements[selectedId] ?? {} : {};
  const pos = selectedId ? positions[selectedId] : undefined;

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
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Inspector</h2>
        <p className="text-xs text-muted-foreground font-mono truncate">
          {entry ? entry.label : "Selecciona cualquier capa"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {selectedId && entry ? (
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="flex-1 overflow-y-auto p-3"
          >
            <Tabs defaultValue="layout">
              <TabsList className="w-full grid grid-cols-3 h-8">
                <TabsTrigger value="layout" className="text-[10px]">
                  Layout
                </TabsTrigger>
                <TabsTrigger value="type" className="text-[10px]">
                  Texto
                </TabsTrigger>
                <TabsTrigger value="style" className="text-[10px]">
                  Estilo
                </TabsTrigger>
              </TabsList>
              <TabsList className="w-full grid grid-cols-3 h-8 mt-1">
                <TabsTrigger value="image" className="text-[10px]">
                  Imagen
                </TabsTrigger>
                <TabsTrigger value="data" className="text-[10px]">
                  Datos
                </TabsTrigger>
                <TabsTrigger value="vis" className="text-[10px]">
                  Vis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="layout" className="mt-3">
                <InspectorLayoutTab
                  id={selectedId}
                  style={style}
                  pos={pos}
                  locked={lockedIds[selectedId]}
                  setStyle={patchStyle}
                  setPos={patchPos}
                  setLocked={(v) => setLocked(selectedId, v)}
                />
                <div className="mt-2 space-y-1">
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
              </TabsContent>

              <TabsContent value="type" className="mt-3">
                <InspectorTypographyTab style={style} setStyle={patchStyle} />
                <div className="mt-2 space-y-1">
                  <Label className="text-[10px]">Contenido (override)</Label>
                  <Input
                    className="h-7 text-xs"
                    value={textOverrides[selectedId] ?? ""}
                    onChange={(e) => setTextOverride(selectedId, e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="style" className="mt-3">
                <InspectorColorsTab style={style} setStyle={patchStyle} />
                <div className="mt-3 flex flex-wrap gap-1">
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
              </TabsContent>

              <TabsContent value="image" className="mt-3">
                <InspectorImageTab style={style} setStyle={patchStyle} />
              </TabsContent>

              <TabsContent value="data" className="mt-3">
                <InspectorDataTab
                  binding={dataBindings[selectedId]}
                  setBinding={(b) => setDataBinding(selectedId, b)}
                />
              </TabsContent>

              <TabsContent value="vis" className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Visible</Label>
                  <Switch
                    checked={visibility[selectedId] !== false}
                    onCheckedChange={(v) => setVisibility(selectedId, v)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Animación entrada</Label>
                  {ANIM_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={style.animation === opt.value ? "default" : "outline"}
                      size="sm"
                      className="w-full h-7 text-[10px] justify-start"
                      onClick={() => patchStyle({ animation: opt.value })}
                    >
                      {opt.label}
                    </Button>
                  ))}
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
          <p className="p-4 text-xs text-muted-foreground">
            Todo es editable: selecciona cualquier capa del canvas. Activa Edición libre en el header si un hijo no se mueve.
          </p>
        )}
      </AnimatePresence>
    </aside>
  );
}
