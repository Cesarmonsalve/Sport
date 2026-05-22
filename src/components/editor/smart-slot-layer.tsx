"use client";

import { memo } from "react";
import { DataSlot } from "@/components/editor/data-slot";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";

interface SmartSlotLayerProps {
  sport: Sport;
  interactive?: boolean;
}

export const SmartSlotLayer = memo(function SmartSlotLayer({
  sport,
  interactive = false,
}: SmartSlotLayerProps) {
  const smartSlots = useEditorStore((s) => s.smartSlots);
  const visibility = useEditorStore((s) => s.visibility);
  const slots = Object.values(smartSlots);
  if (!slots.length) return null;

  return (
    <div className="ss-smart-slot-layer pointer-events-none absolute inset-0 z-[5] [&_.ss-movable]:pointer-events-auto">
      {slots.map((slot) =>
        visibility[slot.id] !== false ? (
          <DataSlot
            key={slot.id}
            slot={slot}
            sport={sport}
            interactive={interactive}
          />
        ) : null
      )}
    </div>
  );
});
