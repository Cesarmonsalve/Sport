"use client";

import { memo, useCallback } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { CourtMarkerCard } from "@/components/overlay/shared/court-marker-card";
import { PlayerHeadshot } from "@/components/ui/player-headshot";
import { useEditorStore, selectMlbGame, selectNbaGame } from "@/lib/store/editor-store";
import { getPlayerForSlot } from "@/lib/espn/player-slots";
import { GALLERY_DRAG_MIME } from "@/components/editor/player-gallery-panel";
import type {
  GalleryPlayer,
  MlbGameSnapshot,
  NbaGameSnapshot,
  NbaPlayer,
  PlayerSlotBinding,
  SmartSlotDefinition,
} from "@/types";
import { cn } from "@/lib/utils";

function allowPhoto(slot: SmartSlotDefinition) {
  return slot.slotType === "lineup-card" || slot.slotType === "free";
}

function resolvePlayer(
  slot: SmartSlotDefinition,
  sport: "nba" | "mlb",
  nbaGame: NbaGameSnapshot,
  mlbGame: MlbGameSnapshot,
  bindings: Record<string, PlayerSlotBinding>
): { name: string; headshot?: string; jersey?: string; position?: string; stats?: string } {
  const b = bindings[slot.id];
  if (b?.dataSource === "manual" || b?.manualName) {
    return {
      name: b.manualName ?? "—",
      headshot: allowPhoto(slot) ? b.manualImageUrl : undefined,
      position: b.position,
    };
  }
  if (sport === "nba") {
    const p = getPlayerForSlot(nbaGame, slot.id, bindings) as NbaPlayer | undefined;
    if (!p) return { name: "—" };
    return {
      name: p.name,
      headshot: allowPhoto(slot) ? p.headshot : undefined,
      jersey: p.jersey,
      position: p.position,
      stats:
        p.points != null
          ? `${p.points} PTS${p.rebounds != null ? ` ${p.rebounds} REB` : ""}${p.assists != null ? ` ${p.assists} AST` : ""}`
          : undefined,
    };
  }
  const roster =
    slot.team === "home" ? mlbGame.rosterHome ?? [] : mlbGame.rosterAway ?? [];
  const p = roster[slot.slotIndex ?? 0];
  return {
    name: p?.name ?? "—",
    headshot: allowPhoto(slot) ? p?.headshot : undefined,
    position: p?.position,
  };
}

interface DataSlotProps {
  slot: SmartSlotDefinition;
  sport: "nba" | "mlb";
  interactive?: boolean;
}

export const DataSlot = memo(function DataSlot({
  slot,
  sport,
  interactive = false,
}: DataSlotProps) {
  const bindings = useEditorStore((s) => s.playerSlots);
  const dataBindings = useEditorStore((s) => s.dataBindings);
  const assignGalleryPlayerToSlot = useEditorStore((s) => s.assignGalleryPlayerToSlot);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const setDropHighlightId = useEditorStore((s) => s.setDropHighlightId);
  const dropHighlightId = useEditorStore((s) => s.dropHighlightId);
  const brandKit = useEditorStore((s) => s.brandKit);
  const elements = useEditorStore((s) => s.elements);
  const nbaGame = useEditorStore(selectNbaGame);
  const mlbGame = useEditorStore(selectMlbGame);

  const filled = !!(bindings[slot.id]?.athleteId || bindings[slot.id]?.manualName);
  const player = resolvePlayer(slot, sport, nbaGame, mlbGame, bindings);
  const accent =
    slot.team === "home"
      ? brandKit.primaryColor
      : slot.team === "away"
        ? brandKit.secondaryColor
        : brandKit.accentColor;
  const style = elements[slot.id] ?? {};
  const variant =
    style.designVariant ?? brandKit.globalDesignVariant ?? "default";

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!interactive) return;
      if (e.dataTransfer.types.includes(GALLERY_DRAG_MIME)) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setDropHighlightId(slot.id);
      }
    },
    [interactive, slot.id, setDropHighlightId]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      if (!interactive) return;
      const raw = e.dataTransfer.getData(GALLERY_DRAG_MIME);
      if (!raw) return;
      e.preventDefault();
      e.stopPropagation();
      try {
        const p = JSON.parse(raw) as GalleryPlayer;
        assignGalleryPlayerToSlot(slot.id, p);
        setSelectedId(slot.id);
      } catch {
        /* ignore */
      }
      setDropHighlightId(null);
    },
    [interactive, slot.id, assignGalleryPlayerToSlot, setSelectedId, setDropHighlightId]
  );

  const w = slot.width ?? (slot.slotType === "lineup-card" ? "200px" : "120px");
  const h = slot.height ?? (slot.slotType === "lineup-card" ? "88px" : "48px");

  if (slot.slotType === "field-name-only") {
    return (
      <CourtMarkerCard
        slotId={slot.id}
        label={slot.label}
        player={
          filled
            ? {
                id: bindings[slot.id]?.athleteId ?? slot.id,
                name: player.name,
                headshot: undefined,
                position: player.position,
              }
            : undefined
        }
        bindingLabel={dataBindings[slot.id]?.displayLabel}
        markerStyle="name"
        showPhoto={false}
        accentClass={slot.team === "home" ? "ss-accent-home" : "ss-accent-away"}
        groupParent="smart-slot-layer"
        interactive={interactive}
      />
    );
  }

  const inner = !filled ? (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/40 bg-muted/10 px-2 text-center",
        dropHighlightId === slot.id && "border-primary bg-primary/10"
      )}
      onDragOver={onDragOver}
      onDragLeave={() => setDropHighlightId(null)}
      onDrop={onDrop}
    >
      <span className="text-[10px] font-medium text-muted-foreground">
        Arrastra jugador aquí
      </span>
      <span className="text-[9px] text-muted-foreground/70">{slot.label}</span>
    </div>
  ) : (
    <div
      className="flex h-full w-full items-center gap-2 rounded-lg p-2"
      style={{ borderColor: accent, ["--ss-color" as string]: accent }}
      data-variant={variant}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {allowPhoto(slot) && player.headshot && (
        <PlayerHeadshot src={player.headshot} alt={player.name} className="h-12 w-12 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold leading-tight">{player.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {[player.jersey && `#${player.jersey}`, player.position, player.stats]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </div>
  );

  return (
    <MovableLayer
      id={slot.id}
      interactive={interactive}
      editable
      className="ss-smart-slot"
    >
      <div style={{ width: w, height: h, minWidth: w, minHeight: h }}>{inner}</div>
    </MovableLayer>
  );
});
