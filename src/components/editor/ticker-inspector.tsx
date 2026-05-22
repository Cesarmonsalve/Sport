"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/lib/store/editor-store";
import type { TickerSlide } from "@/types";

const SLIDE_LABELS: Record<TickerSlide["type"], string> = {
  game_score: "Marcadores en vivo",
  standings: "Tabla de posiciones",
  stat_leader: "Líderes estadística",
  news: "Noticias ESPN",
  sponsor: "Patrocinadores",
  custom: "Texto personalizado",
};

export function TickerInspector() {
  const tickerSlides = useEditorStore((s) => s.tickerSlides);
  const setTickerSlides = useEditorStore((s) => s.setTickerSlides);

  const patch = (idx: number, patch: Partial<TickerSlide>) => {
    const next = [...tickerSlides];
    next[idx] = { ...next[idx]!, ...patch };
    setTickerSlides(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        Broadcast ticker
      </p>
      {tickerSlides.map((slide, i) => (
        <div key={`${slide.type}-${i}`} className="rounded border border-border p-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">{SLIDE_LABELS[slide.type]}</span>
            <Switch checked={slide.enabled} onCheckedChange={(v) => patch(i, { enabled: v })} />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-[10px] shrink-0">Duración (s)</Label>
            <Input
              type="number"
              min={3}
              max={15}
              className="h-7 text-xs"
              value={slide.duration}
              onChange={(e) =>
                patch(i, { duration: Math.min(15, Math.max(3, Number(e.target.value) || 8)) })
              }
            />
          </div>
          {slide.type === "custom" && (
            <Input
              className="h-7 text-xs"
              placeholder="Texto custom"
              value={String(slide.data?.text ?? "")}
              onChange={(e) => patch(i, { data: { text: e.target.value } })}
            />
          )}
        </div>
      ))}
    </div>
  );
}
