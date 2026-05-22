"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { useNbaScoreboard } from "@/hooks/use-nba-scoreboard";
import { useMlbScoreboard } from "@/hooks/use-mlb-scoreboard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Sport } from "@/types";

interface EditorDockProps {
  sport: Sport;
}

export function EditorDock({ sport }: EditorDockProps) {
  const eventId = useEditorStore((s) => s.eventId);
  const setEventId = useEditorStore((s) => s.setEventId);
  const designMode = useEditorStore((s) => s.designMode);

  const nba = useNbaScoreboard();
  const mlb = useMlbScoreboard();
  const { events, isLoading, refetch } = sport === "nba" ? nba : mlb;

  return (
    <div className="flex h-12 shrink-0 items-center gap-4 border-t border-border bg-card px-4">
      <Label className="shrink-0 text-xs">Partido ESPN</Label>
      <select
        className="h-8 max-w-md flex-1 rounded-md border border-border bg-muted/50 px-2 text-xs"
        value={eventId ?? ""}
        onChange={(e) => setEventId(e.target.value || null)}
        disabled={designMode || isLoading}
      >
        <option value="">— Seleccionar —</option>
        {events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.shortName || ev.name} · {ev.status}
          </option>
        ))}
      </select>
      <Button variant="outline" size="sm" onClick={() => refetch()} disabled={designMode}>
        Actualizar
      </Button>
      {designMode && (
        <span className="text-xs text-amber-400/90">Modo diseño — sin polling ESPN</span>
      )}
    </div>
  );
}
