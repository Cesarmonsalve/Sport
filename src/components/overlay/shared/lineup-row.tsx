"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { PlayerHeadshot } from "@/components/ui/player-headshot";
import {
  showLineupName,
  showLineupPhoto,
  showLineupStats,
} from "@/lib/overlay/lineup-display";
import type { LineupDisplayMode, MlbPlayer, NbaPlayer } from "@/types";

type Player = NbaPlayer | MlbPlayer;

interface LineupRowProps {
  player: Player;
  posLabel: string;
  accent: string;
  mode: LineupDisplayMode;
  atomPrefix: string;
  index: number;
  team: "home" | "away";
  groupParent: string;
  interactive?: boolean;
  sport?: "nba" | "mlb";
}

export const LineupRow = memo(function LineupRow({
  player,
  posLabel,
  accent,
  mode,
  atomPrefix,
  index,
  team,
  groupParent,
  interactive = false,
  sport = "nba",
}: LineupRowProps) {
  const base = `${atomPrefix}-${team}-${index}`;
  const stats =
    "points" in player
      ? `${player.points ?? 0}P ${player.rebounds ?? 0}R ${player.assists ?? 0}A`
      : `AVG ${(player as MlbPlayer).avg ?? "—"}`;

  const courtSlot =
    sport === "nba" && atomPrefix === "q"
      ? `court-${team}-${posLabel.toLowerCase()}`
      : `${atomPrefix}-${team}-${index}`;

  return (
    <div
      className="flex items-center gap-2 border-b border-white/10 py-1.5 last:border-0"
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
      data-drop-slot={courtSlot}
    >
      {showLineupPhoto(mode) && (
        <MovableLayer
          id={`${base}-photo`}
          groupParent={groupParent}
          editable
          interactive={interactive}
        >
          <PlayerHeadshot src={player.headshot} alt={player.name} size={36} sport={sport} rounded="md" />
        </MovableLayer>
      )}
      {showLineupName(mode) && (
        <>
          <MovableLayer id={`${base}-pos`} groupParent={groupParent} editable interactive={interactive}>
            <span
              className="w-8 text-center text-[10px] font-bold rounded inline-block"
              style={{ backgroundColor: `${accent}33`, color: accent }}
            >
              {posLabel}
            </span>
          </MovableLayer>
          <MovableLayer id={`${base}-name`} groupParent={groupParent} editable interactive={interactive}>
            <p className="text-xs font-semibold truncate max-w-[140px]">{player.name}</p>
          </MovableLayer>
        </>
      )}
      {showLineupStats(mode) && (
        <MovableLayer id={`${base}-stats`} groupParent={groupParent} editable interactive={interactive}>
          <p className="text-[10px] text-white/50">{stats}</p>
        </MovableLayer>
      )}
    </div>
  );
});
