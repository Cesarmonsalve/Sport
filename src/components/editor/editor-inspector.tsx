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
import type { Sport } from "@/types";

interface EditorInspectorProps {
  sport: Sport;
}

export function EditorInspector({ sport }: EditorInspectorProps) {
  const selectedId = useEditorStore((s) => s.selectedId);
  const elements = useEditorStore((s) => s.elements);
  const visibility = useEditorStore((s) => s.visibility);
  const setElementStyle = useEditorStore((s) => s.setElementStyle);
  const setVisibility = useEditorStore((s) => s.setVisibility);
  const applyPreset = useEditorStore((s) => s.applyPreset);
  const editorMode = useEditorStore((s) => s.editorMode);

  const registry = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const presets = sport === "nba" ? NBA_PRESETS : MLB_PRESETS;
  const entry = selectedId ? registry[selectedId] : null;
  const style = selectedId ? elements[selectedId] ?? {} : {};

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Inspector</h2>
        <p className="text-xs text-muted-foreground">
          {entry ? entry.label : "Selecciona un elemento"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {selectedId && entry ? (
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto p-4"
          >
            <Tabs defaultValue="design">
              <TabsList className="w-full">
                <TabsTrigger value="design" className="flex-1">
                  Diseño
                </TabsTrigger>
                <TabsTrigger value="data" className="flex-1">
                  Datos
                </TabsTrigger>
                {editorMode === "advanced" && (
                  <TabsTrigger value="anim" className="flex-1">
                    Anim.
                  </TabsTrigger>
                )}
                <TabsTrigger value="vis" className="flex-1">
                  Vis.
                </TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-3">
                <div className="space-y-2">
                  <Label>Tamaño (px)</Label>
                  <Input
                    value={style.fontSize?.replace("px", "") ?? ""}
                    onChange={(e) =>
                      setElementStyle(selectedId, {
                        fontSize: e.target.value ? `${e.target.value}px` : undefined,
                      })
                    }
                    placeholder="96"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={style.color?.startsWith("#") ? style.color : "#00b8d4"}
                    onChange={(e) =>
                      setElementStyle(selectedId, { color: e.target.value })
                    }
                    className="h-9 p-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Opacidad</Label>
                  <Input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round((Number(style.opacity ?? 1) || 1) * 100)}
                    onChange={(e) =>
                      setElementStyle(selectedId, {
                        opacity: String(Number(e.target.value) / 100),
                      })
                    }
                  />
                </div>
                <div className="pt-2">
                  <Label className="mb-2 block">Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(presets).map(([key, p]) => (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(p.map as Record<string, typeof style>)}
                      >
                        {p.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="data">
                <p className="text-xs text-muted-foreground">
                  Datos en vivo vía ESPN API. Selecciona partido en el dock inferior.
                </p>
              </TabsContent>

              <TabsContent value="anim">
                <p className="text-xs text-muted-foreground">
                  Animaciones de score (P2) — próximamente.
                </p>
              </TabsContent>

              <TabsContent value="vis" className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Visible en stream</Label>
                  <Switch
                    checked={visibility[selectedId] !== false}
                    onCheckedChange={(v) => setVisibility(selectedId, v)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-xs text-muted-foreground"
          >
            Haz clic en un widget del canvas o del árbol de capas para editar propiedades.
          </motion.p>
        )}
      </AnimatePresence>
    </aside>
  );
}
