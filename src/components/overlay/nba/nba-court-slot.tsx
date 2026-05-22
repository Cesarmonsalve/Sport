"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { PlayerHeadshot } from "@/components/ui/player-headshot";
import { useEditorStore, selectNbaGame } from "@/lib/store/editor-store";
import { getPlayerForSlot } from "@/lib/espn/player-slots";
import { cn } from "@/lib/utils";
import type { ElementDataBinding, MarkerStyle, NbaGameSnapshot, NbaPlayer, PlayerSlotBinding } from "@/types";

interface Props {
  slotId: string;
  label: string;
  team: "home" | "away";
  interactive?: boolean;
}

function resolveSlotPlayer(
  slotId: string,
  game: NbaGameSnapshot,
  bindings: Record<string, PlayerSlotBinding>,
  dataBindings: Record<string, ElementDataBinding>
): NbaPlayer | undefined {
  const binding = bindings[slotId];
  const data = dataBindings[slotId];
  if (binding?.dataSource === "manual" || data?.dataSource === "manual") {
    return {
      id: binding?.athleteId ?? data?.athleteId ?? slotId,
      name: binding?.manualName ?? data?.manualText ?? "—",
      headshot: binding?.manualImageUrl ?? data?.manualImageUrl,
      jersey: undefined,
    };
  }
  return getPlayerForSlot(game, slotId, bindings);
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export const NbaCourtSlot = memo(function NbaCourtSlot({
  slotId,
  label,
  team,
  interactive = false,
}: Props) {
  const game = useEditorStore(selectNbaGame);
  const bindings = useEditorStore((s) => s.playerSlots);
  const dataBindings = useEditorStore((s) => s.dataBindings);
  const elements = useEditorStore((s) => s.elements);
  const markerStyle =
    useEditorStore((s) => s.widgetSettings["court-positions-widget"]?.markerStyle) ?? "photo";
  const dropHighlightId = useEditorStore((s) => s.dropHighlightId);
  const player = resolveSlotPlayer(slotId, game, bindings, dataBindings);
  const bindingLabel = dataBindings[slotId]?.displayLabel;
  const accent = team === "home" ? "ss-accent-home" : "ss-accent-away";
  const style = elements[slotId];

  const showPhoto = markerStyle === "photo" && !!player?.headshot;
  const showInitials = markerStyle === "initials";
  const showDot = markerStyle === "dot";
  const showName = markerStyle === "name" || markerStyle === "photo";

  return (
    <MovableLayer
      id={slotId}
      groupParent="court-positions-widget"
      className={cn(
        "ss-court-slot",
        accent,
        dropHighlightId === slotId && "ss-drop-target"
      )}
      editable
      interactive={interactive}
    >
      <div
        className="flex flex-col items-center gap-1 rounded-lg border border-white/20 bg-black/70 px-2 py-2 backdrop-blur-sm"
        style={{
          minWidth: style?.minWidth ?? "100px",
          borderRadius: style?.borderRadius,
          backgroundColor: style?.backgroundColor,
        }}
        data-drop-slot={slotId}
      >
        <span className="text-[10px] font-bold tracking-widest opacity-80">{label}</span>
        {showDot && <div className="h-3 w-3 rounded-full bg-white/80" />}
        {showInitials && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: team === "home" ? "#1a5cff44" : "#ff7a0044" }}
          >
            {initials(player?.name ?? label)}
          </div>
        )}
        {showPhoto && (
          <PlayerHeadshot src={player?.headshot} alt={player?.name ?? ""} size={40} sport="nba" />
        )}
        {showName && (
          <span
            className="text-xs font-semibold truncate max-w-[120px]"
            style={{ color: style?.color, fontFamily: style?.fontFamily, fontSize: style?.fontSize }}
          >
            {player?.name?.split(" ").pop() ?? "—"}
          </span>
        )}
        {!showDot && (
          <span className="text-[9px] text-white/50">#{player?.jersey ?? "—"}</span>
        )}
        {bindingLabel && (
          <span className="text-[8px] text-primary/90 truncate max-w-[110px] text-center">
            {bindingLabel}
          </span>
        )}
      </div>
    </MovableLayer>
  );
});
