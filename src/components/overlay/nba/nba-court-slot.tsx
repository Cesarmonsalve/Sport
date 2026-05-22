"use client";

import { memo } from "react";
import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { useEditorStore, selectNbaGame } from "@/lib/store/editor-store";
import { getPlayerForSlot } from "@/lib/espn/player-slots";
import { cn } from "@/lib/utils";
import type { ElementDataBinding, NbaGameSnapshot, NbaPlayer, PlayerSlotBinding } from "@/types";

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
      id: binding?.athleteId ?? slotId,
      name: binding?.manualName ?? data?.manualText ?? "—",
      headshot: binding?.manualImageUrl ?? data?.manualImageUrl,
      jersey: undefined,
    };
  }
  return getPlayerForSlot(game, slotId, bindings);
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
  const player = resolveSlotPlayer(slotId, game, bindings, dataBindings);
  const accent = team === "home" ? "ss-accent-home" : "ss-accent-away";
  const style = elements[slotId];

  return (
    <MovableLayer
      id={slotId}
      groupParent="court-positions-widget"
      className={cn("ss-court-slot", accent)}
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
      >
        <span className="text-[10px] font-bold tracking-widest opacity-80">{label}</span>
        {player?.headshot ? (
          <Image
            src={player.headshot}
            alt=""
            width={40}
            height={40}
            className="rounded-full object-cover"
            style={{ objectFit: (style?.objectFit as React.CSSProperties["objectFit"]) ?? "cover" }}
            unoptimized
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-white/10" />
        )}
        <span
          className="text-xs font-semibold truncate max-w-[120px]"
          style={{ color: style?.color, fontFamily: style?.fontFamily, fontSize: style?.fontSize }}
        >
          {player?.name?.split(" ").pop() ?? "—"}
        </span>
        <span className="text-[9px] text-white/50">#{player?.jersey ?? "—"}</span>
      </div>
    </MovableLayer>
  );
});
