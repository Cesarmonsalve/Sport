"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { useEspnPoll } from "@/hooks/use-espn-poll";
import { formatGameStatus } from "@/lib/utils";
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

  const { events, isLoading, refetch } = useEspnPoll(sport);

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
            {ev.shortName || ev.name} · {formatGameStatus((ev as any).state || "pre", ev.status, (ev as any).date)}
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
