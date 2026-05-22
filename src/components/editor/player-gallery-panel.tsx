"use client";

import { useMemo, useState } from "react";
import { Search, Users, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayerHeadshot } from "@/components/ui/player-headshot";
import { useEditorStore } from "@/lib/store/editor-store";
import type { GalleryPlayer, Sport } from "@/types";
import { cn } from "@/lib/utils";

const MIME = "application/x-ss-player";

export function PlayerGalleryPanel({ sport }: { sport: Sport }) {
  const eventId = useEditorStore((s) => s.eventId);
  const designMode = useEditorStore((s) => s.designMode);
  const galleryPlayers = useEditorStore((s) => s.galleryPlayers);
  const [query, setQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<"all" | "home" | "away">("all");

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

  if (!eventId && !designMode) {
    return (
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-border bg-card p-3">
        <p className="text-xs text-muted-foreground">
          Selecciona un partido en Datos para cargar la galería de jugadores.
        </p>
      </aside>
    );
  }

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold">Jugadores</span>
          <span className="ml-auto text-[10px] text-muted-foreground">{filtered.length}</span>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Arrastra al slot del overlay · suelta para asignar
        </p>
      </div>
      <div className="space-y-2 border-b border-border p-2">
        <div className="relative">
          <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
          <Input
            className="h-7 pl-7 text-xs"
            placeholder="Buscar…"
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
                teamFilter === t ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent"
              )}
              onClick={() => setTeamFilter(t)}
            >
              {t === "all" ? "Todos" : t === "home" ? "Local" : "Vis"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-2 content-start">
        {filtered.map((p) => (
          <GalleryThumb key={`${p.team}-${p.id}`} player={p} sport={sport} />
        ))}
        {!filtered.length && (
          <p className="col-span-2 text-center text-[10px] text-muted-foreground py-4">
            Sin fotos aún — espera el summary ESPN
          </p>
        )}
      </div>
    </aside>
  );
}

function GalleryThumb({ player, sport }: { player: GalleryPlayer; sport: Sport }) {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(MIME, JSON.stringify(player));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="ss-gallery-thumb flex flex-col items-center gap-1 rounded-md border border-border bg-muted/30 p-1.5 hover:border-primary/50"
      title={`Arrastra a un slot: ${player.name}`}
    >
      <GripVertical className="h-3 w-3 text-muted-foreground self-end opacity-40" />
      <PlayerHeadshot
        src={player.headshot}
        alt={player.name}
        size={48}
        sport={sport === "nba" ? "nba" : "mlb"}
      />
      <span className="text-[9px] font-semibold text-center leading-tight line-clamp-2 w-full">
        {player.name.split(" ").pop()}
      </span>
      <Label className="text-[8px] text-muted-foreground">
        #{player.jersey ?? "—"} · {player.teamAbbr}
      </Label>
    </div>
  );
}

export { MIME as GALLERY_DRAG_MIME };
