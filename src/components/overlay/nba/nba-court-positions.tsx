"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { NbaCourtSlot } from "@/components/overlay/nba/nba-court-slot";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";

const HOME = ["PG", "SG", "SF", "PF", "C"] as const;
const AWAY = ["PG", "SG", "SF", "PF", "C"] as const;

interface Props {
  widgetFilter?: string | null;
}

export const NbaCourtPositions = memo(function NbaCourtPositions({ widgetFilter }: Props) {
  if (!shouldShowWidget(widgetFilter, "court-positions-widget")) return null;

  return (
    <MovableLayer id="court-positions-widget" className="ss-court-root">
      {HOME.map((pos) => (
        <NbaCourtSlot
          key={`h-${pos}`}
          slotId={`court-home-${pos.toLowerCase()}`}
          label={pos}
          team="home"
        />
      ))}
      {AWAY.map((pos) => (
        <NbaCourtSlot
          key={`a-${pos}`}
          slotId={`court-away-${pos.toLowerCase()}`}
          label={pos}
          team="away"
        />
      ))}
    </MovableLayer>
  );
});
