"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { PlayerHeadshot } from "@/components/ui/player-headshot";
import type { MarkerStyle, NbaPlayer } from "@/types";
import { cn } from "@/lib/utils";

interface CourtMarkerCardProps {
  slotId: string;
  label: string;
  player?: NbaPlayer;
  bindingLabel?: string;
  markerStyle: MarkerStyle;
  showPhoto?: boolean;
  accentClass: string;
  groupParent: string;
  interactive?: boolean;
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export const CourtMarkerCard = memo(function CourtMarkerCard({
  slotId,
  label,
  player,
  bindingLabel,
  markerStyle,
  showPhoto = true,
  accentClass,
  groupParent,
  interactive = false,
}: CourtMarkerCardProps) {
  const style = markerStyle;
  const usePhoto = showPhoto && style === "photo" && !!player?.headshot;

  return (
    <MovableLayer
      id={slotId}
      groupParent={groupParent}
      className={cn("ss-court-marker inline-block", accentClass)}
      editable
      interactive={interactive}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-1 rounded-lg border border-white/20 bg-black/75 px-2 py-2 backdrop-blur-sm",
          "min-w-[clamp(72px,7vw,110px)]"
        )}
      >
        <span className="text-[clamp(8px,1vw,10px)] font-bold tracking-widest opacity-80">
          {label}
        </span>
        {style === "dot" && <div className="h-3 w-3 rounded-full bg-white/80" />}
        {style === "initials" && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
            {initials(player?.name ?? label)}
          </div>
        )}
        {usePhoto && (
          <PlayerHeadshot src={player?.headshot} alt={player?.name ?? ""} size={40} sport="nba" />
        )}
        {(style === "name" || (style === "photo" && !usePhoto)) && (
          <span className="text-[clamp(10px,1.2vw,12px)] font-semibold truncate max-w-[100px]">
            {player?.name?.split(" ").pop() ?? "—"}
          </span>
        )}
        {style !== "dot" && (
          <span className="text-[9px] text-white/50">#{player?.jersey ?? "—"}</span>
        )}
        {bindingLabel && (
          <span className="text-[8px] text-primary/90 truncate max-w-[100px] text-center">
            {bindingLabel}
          </span>
        )}
      </div>
    </MovableLayer>
  );
});
