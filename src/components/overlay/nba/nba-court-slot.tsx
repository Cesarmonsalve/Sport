"use client";

import { memo } from "react";
import { CourtMarkerCard } from "@/components/overlay/shared/court-marker-card";
import { useEditorStore, selectNbaGame } from "@/lib/store/editor-store";
import { getPlayerForSlot } from "@/lib/espn/player-slots";
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
      id: binding?.athleteId ?? data?.athleteId ?? slotId,
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
  const ws = useEditorStore((s) => s.widgetSettings["court-positions-widget"]);
  const player = resolveSlotPlayer(slotId, game, bindings, dataBindings);
  const bindingLabel = dataBindings[slotId]?.displayLabel;

  return (
    <CourtMarkerCard
      slotId={slotId}
      label={label}
      player={player}
      bindingLabel={bindingLabel}
      markerStyle={ws?.markerStyle ?? "name"}
      showPhoto={false}
      accentClass={team === "home" ? "ss-accent-home" : "ss-accent-away"}
      groupParent="court-positions-widget"
      interactive={interactive}
    />
  );
});
