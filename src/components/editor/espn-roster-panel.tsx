"use client";

import { useMemo, useState } from "react";
import { Radio, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayerHeadshot } from "@/components/ui/player-headshot";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEspnPoll } from "@/hooks/use-espn-poll";
import { GALLERY_DRAG_MIME } from "@/components/editor/player-gallery-panel";
import type { GalleryPlayer, Sport } from "@/types";
import { cn } from "@/lib/utils";

interface EspnRosterPanelProps {
  sport: Sport;
}

export function EspnRosterPanel({ sport }: EspnRosterPanelProps) {
  const eventId = useEditorStore((s) => s.eventId);
  const setEventId = useEditorStore((s) => s.setEventId);
  const designMode = useEditorStore((s) => s.designMode);
  const galleryPlayers = useEditorStore((s) => s.galleryPlayers);
  const applyBaseTemplate = useEditorStore((s) => s.applyBaseTemplate);
  const [query, setQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<"all" | "home" | "away">("all");
  const { events, isLoading } = useEspnPoll(sport);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return galleryPlayers.filter((p) => {
      if (teamFilter !== "all" && p.team !== teamFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.jersey?.includes(q) ||
        p.teamAbbr.toLowerCase().includes(q)
      );
    });
  }, [galleryPlayers, query, teamFilter]);

  const onDragStart = (e: React.DragEvent, player: GalleryPlayer) => {
    e.dataTransfer.setData(GALLERY_DRAG_MIME, JSON.stringify(player));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="space-y-3 p-2">
      <div className="flex items-center gap-2">
        <Radio className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold">ESPN Data</span>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px]">Partido</Label>
        <select
          className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
          value={eventId ?? ""}
          onChange={(e) => setEventId(e.target.value || null)}
          disabled={designMode && !events.length}
        >
          <option value="">— Seleccionar —</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.shortName || ev.id}
              {ev.state === "in" ? " · LIVE" : ""}
            </option>
          ))}
        </select>
        {isLoading && (
          <p className="text-[9px] text-muted-foreground">Cargando calendario ESPN…</p>
        )}
      </div>

      <div className="space-y-1 border-t border-border pt-2">
        <Label className="text-[10px]">Plantilla base</Label>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1.5 text-left text-[10px] hover:bg-accent"
            onClick={() => applyBaseTemplate("nba-court-full")}
          >
            NBA cancha completa
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1.5 text-left text-[10px] hover:bg-accent"
            onClick={() => applyBaseTemplate("mlb-field-full")}
          >
            MLB campo completo
          </button>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Arrastra jugadores a los Smart Slots del canvas (borde punteado).
      </p>

      <div className="relative">
        <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
        <Input
          className="h-7 pl-7 text-xs"
          placeholder="Buscar jugador…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-1">
        {(["all", "home", "away"] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={cn(
              "flex-1 rounded px-1 py-0.5 text-[10px]",
              teamFilter === t ? "bg-primary/20 text-primary" : "bg-muted"
            )}
            onClick={() => setTeamFilter(t)}
          >
            {t === "all" ? "Todos" : t === "home" ? "Local" : "Visita"}
          </button>
        ))}
      </div>

      <ul className="max-h-[320px] space-y-1 overflow-y-auto">
        {filtered.map((p) => (
          <li key={p.id}>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, p)}
              className="flex cursor-grab items-center gap-2 rounded-md border border-transparent px-1 py-1 hover:border-border hover:bg-accent/40 active:cursor-grabbing"
            >
              <PlayerHeadshot src={p.headshot} alt={p.name} className="h-8 w-8" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{p.name}</p>
                <p className="text-[9px] text-muted-foreground">
                  {p.teamAbbr}
                  {p.jersey ? ` #${p.jersey}` : ""}
                  {p.position ? ` · ${p.position}` : ""}
                </p>
              </div>
            </div>
          </li>
        ))}
        {!filtered.length && (
          <li className="text-[10px] text-muted-foreground py-4 text-center">
            {eventId || designMode
              ? "Sin jugadores en galería"
              : "Elige un partido arriba"}
          </li>
        )}
      </ul>
    </div>
  );
}
