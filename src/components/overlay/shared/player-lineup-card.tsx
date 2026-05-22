"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { PlayerHeadshot } from "@/components/ui/player-headshot";
import { resolveLineupCardFlags } from "@/lib/overlay/lineup-display";
import { useEditorStore } from "@/lib/store/editor-store";
import type { MlbPlayer, NbaPlayer, WidgetDisplaySettings } from "@/types";
import { cn } from "@/lib/utils";

type Player = NbaPlayer | MlbPlayer;

interface PlayerLineupCardProps {
  cardId: string;
  player: Player;
  posLabel: string;
  accent: string;
  widgetId: string;
  widgetSettings?: WidgetDisplaySettings;
  groupParent?: string;
  interactive?: boolean;
  sport?: "nba" | "mlb";
}

export const PlayerLineupCard = memo(function PlayerLineupCard({
  cardId,
  player,
  posLabel,
  accent,
  widgetId,
  widgetSettings,
  groupParent,
  interactive = false,
  sport = "nba",
}: PlayerLineupCardProps) {
  const globalSettings = useEditorStore((s) => s.widgetSettings[widgetId]);
  const flags = resolveLineupCardFlags(widgetSettings ?? globalSettings);
  const stats =
    "points" in player
      ? `${player.points ?? 0}P ${player.rebounds ?? 0}R ${player.assists ?? 0}A`
      : `AVG ${(player as MlbPlayer).avg ?? "—"}`;

  return (
    <MovableLayer
      id={cardId}
      groupParent={groupParent}
      className={cn(
        "ss-player-card inline-flex flex-col gap-1 rounded-md border border-white/15 bg-black/60 p-2",
        "min-w-[clamp(72px,8vw,140px)] max-w-[clamp(100px,12vw,180px)]"
      )}
      editable
      interactive={interactive}
    >
      {flags.showPhoto && (
        <PlayerHeadshot
          src={player.headshot}
          alt={player.name}
          size={48}
          sport={sport}
          rounded="md"
          className="mx-auto w-[clamp(36px,5vw,56px)] h-[clamp(36px,5vw,56px)]"
        />
      )}
      {flags.showName && (
        <>
          <span
            className="text-center text-[clamp(8px,1vw,10px)] font-bold rounded px-1 py-0.5"
            style={{ backgroundColor: `${accent}33`, color: accent }}
          >
            {posLabel}
          </span>
          <p className="text-[clamp(10px,1.2vw,12px)] font-semibold text-center leading-tight line-clamp-2">
            {player.name}
          </p>
        </>
      )}
      {flags.showStats && (
        <p className="text-[clamp(8px,1vw,10px)] text-white/55 text-center">{stats}</p>
      )}
      {!flags.showName && !flags.showPhoto && (
        <span className="text-[10px] text-white/70 text-center">{posLabel}</span>
      )}
    </MovableLayer>
  );
});
