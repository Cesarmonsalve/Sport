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
  const visibility = useEditorStore((s) => s.visibility);
  const nbaGame = useEditorStore((s) => s.nbaGame);
  const mlbGame = useEditorStore((s) => s.mlbGame);
  const setElementStyle = useEditorStore((s) => s.setElementStyle);
  const setVisibility = useEditorStore((s) => s.setVisibility);
  const setTextOverride = useEditorStore((s) => s.setTextOverride);
  const setZIndex = useEditorStore((s) => s.setZIndex);
  const duplicatePosition = useEditorStore((s) => s.duplicatePosition);
  const textOverrides = useEditorStore((s) => s.textOverrides);
  const applyPreset = useEditorStore((s) => s.applyPreset);
  const editorMode = useEditorStore((s) => s.editorMode);
  const designMode = useEditorStore((s) => s.designMode);

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
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="design">Diseño</TabsTrigger>
                <TabsTrigger value="data">Datos</TabsTrigger>
                <TabsTrigger value="anim">Anim.</TabsTrigger>
                <TabsTrigger value="vis">Vis.</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-3 mt-3">
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
                {editorMode === "advanced" && (
                  <>
                    <div className="space-y-2">
                      <Label>Posición left</Label>
                      <Input
                        value={style.left ?? ""}
                        onChange={(e) =>
                          setElementStyle(selectedId, { left: e.target.value })
                        }
                        placeholder="48px"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ancho</Label>
                      <Input
                        value={style.width ?? ""}
                        onChange={(e) =>
                          setElementStyle(selectedId, { width: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
                {editorMode === "advanced" && (
                  <div className="space-y-2">
                    <Label>Rotación (deg)</Label>
                    <Input
                      value={style.rotate?.replace("deg", "") ?? ""}
                      onChange={(e) =>
                        setElementStyle(selectedId, {
                          rotate: e.target.value ? `${e.target.value}deg` : undefined,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Z-index</Label>
                  <Input
                    type="number"
                    value={style.zIndex ?? ""}
                    onChange={(e) => {
                      const z = parseInt(e.target.value, 10);
                      if (!Number.isNaN(z)) setZIndex(selectedId, z);
                    }}
                    placeholder="10"
                  />
                </div>
                {designMode && (
                  <div className="space-y-2">
                    <Label>Texto override (diseño)</Label>
                    <Input
                      value={textOverrides[selectedId] ?? ""}
                      onChange={(e) => setTextOverride(selectedId, e.target.value)}
                      placeholder="Texto personalizado en canvas"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => duplicatePosition(selectedId)}
                >
                  Duplicar posición (+24px)
                </Button>
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

              <TabsContent value="data" className="mt-3 space-y-2 text-xs">
                {designMode && (
                  <p className="text-amber-400/90">Modo diseño — datos mock</p>
                )}
                {sport === "nba" && (
                  <>
                    <p>
                      <strong>Marcador:</strong> {nbaGame.awayAbbr} {nbaGame.scoreAway} @{" "}
                      {nbaGame.homeAbbr} {nbaGame.scoreHome}
                    </p>
                    <p>
                      <strong>Reloj:</strong> {nbaGame.period} {nbaGame.clock}
                      {nbaGame.shotClock && ` · SC ${nbaGame.shotClock}`}
                    </p>
                    {nbaGame.featuredPlayer && (
                      <p>
                        <strong>Destacado:</strong> {nbaGame.featuredPlayer.name}
                      </p>
                    )}
                    <p>
                      <strong>En cancha:</strong>{" "}
                      {(nbaGame.onCourtHome?.length ?? 0) + (nbaGame.onCourtAway?.length ?? 0)}{" "}
                      jugadores
                    </p>
                    {nbaGame.lastRotation && (
                      <p className="text-primary">
                        Rotación: {nbaGame.lastRotation.playerIn.name} entra
                      </p>
                    )}
                  </>
                )}
                {sport === "mlb" && (
                  <>
                    <p>
                      <strong>Marcador:</strong> {mlbGame.awayAbbr} {mlbGame.scoreAway} ·{" "}
                      {mlbGame.homeAbbr} {mlbGame.scoreHome}
                    </p>
                    <p>
                      <strong>Inning:</strong> {mlbGame.inningHalf} {mlbGame.inning}
                    </p>
                    <p>
                      <strong>Conteo:</strong> {mlbGame.balls}-{mlbGame.strikes}, {mlbGame.outs} out
                    </p>
                    {mlbGame.batter && (
                      <p>
                        <strong>Bateador:</strong> {mlbGame.batter.name}
                      </p>
                    )}
                    {mlbGame.pitcher && (
                      <p>
                        <strong>Pitcher:</strong> {mlbGame.pitcher.name}
                      </p>
                    )}
                  </>
                )}
                <p className="text-muted-foreground pt-2">
                  Polling ESPN: scoreboard 12–30s, summary 5–20s en vivo.
                </p>
              </TabsContent>

              <TabsContent value="anim" className="mt-3 space-y-3">
                <Label>Entrada del widget</Label>
                <div className="flex flex-col gap-1">
                  {ANIM_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={style.animation === opt.value ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                      onClick={() =>
                        setElementStyle(selectedId, { animation: opt.value })
                      }
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="vis" className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Visible en stream</Label>
                  <Switch
                    checked={visibility[selectedId] !== false}
                    onCheckedChange={(v) => setVisibility(selectedId, v)}
                  />
                </div>
                {entry.children?.map((childId) => (
                  <div key={childId} className="flex items-center justify-between pl-2">
                    <Label className="text-xs">{registry[childId]?.label ?? childId}</Label>
                    <Switch
                      checked={visibility[childId] !== false}
                      onCheckedChange={(v) => setVisibility(childId, v)}
                    />
                  </div>
                ))}
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
