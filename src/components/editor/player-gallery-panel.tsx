"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayerHeadshot } from "@/components/ui/player-headshot";
import { useEditorStore } from "@/lib/store/editor-store";
import type { GalleryPlayer, Sport } from "@/types";
import { cn } from "@/lib/utils";

const MIME = "application/x-ss-player";

/** Colapsable — no ocupa ancho fijo en el layout principal */
export function CollapsiblePlayerGallery({ sport }: { sport: Sport }) {
  const [open, setOpen] = useState(false);
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

  const canShow = !!eventId || designMode;

  return (
    <div className="border-b border-border bg-card">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent/50"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <Users className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold">Galería jugadores</span>
        {canShow && (
          <span className="ml-auto text-[10px] text-muted-foreground">{filtered.length}</span>
        )}
      </button>
      {open && (
        <div className="max-h-[280px] overflow-y-auto border-t border-border p-2">
          {!canShow ? (
            <p className="text-[10px] text-muted-foreground px-1 py-2">
              Elige un partido en el dock inferior para cargar fotos ESPN.
            </p>
          ) : (
            <>
              <p className="text-[10px] text-muted-foreground mb-2 px-1">
                Arrastra al canvas (cualquier punto) o a una tarjeta del lineup.
              </p>
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                <Input
                  className="h-7 pl-7 text-xs"
                  placeholder="Buscar…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-1 mb-2">
                {(["all", "home", "away"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={cn(
                      "flex-1 rounded px-1 py-0.5 text-[10px]",
                      teamFilter === t
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:bg-accent"
                    )}
                    onClick={() => setTeamFilter(t)}
                  >
                    {t === "all" ? "Todos" : t === "home" ? "Loc" : "Vis"}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {filtered.map((p) => (
                  <GalleryThumb key={`${p.team}-${p.id}`} player={p} sport={sport} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
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
      className="ss-gallery-thumb flex flex-col items-center gap-0.5 rounded border border-border bg-muted/20 p-1 hover:border-primary/50 cursor-grab active:cursor-grabbing"
      title={player.name}
    >
      <PlayerHeadshot
        src={player.headshot}
        alt={player.name}
        size={40}
        sport={sport === "nba" ? "nba" : "mlb"}
      />
      <span className="text-[8px] font-medium text-center leading-tight line-clamp-2 w-full">
        {player.name.split(" ").pop()}
      </span>
      <Label className="text-[7px] text-muted-foreground">
        {player.teamAbbr}
      </Label>
    </div>
  );
}

export { MIME as GALLERY_DRAG_MIME };
