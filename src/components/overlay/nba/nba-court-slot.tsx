"use client";

import { memo } from "react";
import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { useEditorStore, selectNbaGame } from "@/lib/store/editor-store";
import { getPlayerForSlot } from "@/lib/espn/player-slots";
import { cn } from "@/lib/utils";

interface Props {
  slotId: string;
  label: string;
  team: "home" | "away";
}

export const NbaCourtSlot = memo(function NbaCourtSlot({ slotId, label, team }: Props) {
  const game = useEditorStore(selectNbaGame);
  const bindings = useEditorStore((s) => s.playerSlots);
  const player = getPlayerForSlot(game, slotId, bindings);
  const accent = team === "home" ? "ss-accent-home" : "ss-accent-away";

  return (
    <MovableLayer id={slotId} groupParent="court-positions-widget" className={cn("ss-court-slot", accent)}>
      <div className="flex flex-col items-center gap-1 rounded-lg border border-white/20 bg-black/70 px-2 py-2 backdrop-blur-sm min-w-[100px]">
        <span className="text-[10px] font-bold tracking-widest opacity-80">{label}</span>
        {player?.headshot ? (
          <Image src={player.headshot} alt="" width={40} height={40} className="rounded-full" unoptimized />
        ) : (
          <div className="h-10 w-10 rounded-full bg-white/10" />
        )}
        <span className="text-xs font-semibold truncate max-w-[100px]">
          {player?.name?.split(" ").pop() ?? "—"}
        </span>
        <span className="text-[9px] text-white/50">#{player?.jersey ?? "—"}</span>
      </div>
    </MovableLayer>
  );
});
