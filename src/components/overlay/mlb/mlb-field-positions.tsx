"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { useEditorStore, selectMlbGame } from "@/lib/store/editor-store";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";

const SLOTS = [
  { id: "field-cf", label: "CF" },
  { id: "field-lf", label: "LF" },
  { id: "field-rf", label: "RF" },
  { id: "field-ss", label: "SS" },
  { id: "field-2b", label: "2B" },
  { id: "field-p", label: "P" },
  { id: "field-3b", label: "3B" },
  { id: "field-1b", label: "1B" },
  { id: "field-c", label: "C" },
] as const;

interface Props {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export const MlbFieldPositions = memo(function MlbFieldPositions({
  widgetFilter,
  interactive = false,
}: Props) {
  const game = useEditorStore(selectMlbGame);
  if (!shouldShowWidget(widgetFilter, "field-positions-widget")) return null;

  const roster = [...(game.rosterHome ?? []), ...(game.rosterAway ?? [])];

  return (
    <MovableLayer id="field-positions-widget" className="ss-field-root" editable interactive={interactive}>
      {SLOTS.map((s, i) => {
        const p = roster[i];
        return (
          <MovableLayer
            key={s.id}
            id={s.id}
            groupParent="field-positions-widget"
            className="ss-field-slot"
            editable
            interactive={interactive}
          >
            <div className="rounded-full border border-[#ff7a00]/50 bg-black/75 px-4 py-2 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-[#ff7a00]">{s.label}</span>
              <p className="text-xs truncate">{p?.name?.split(" ").pop() ?? "—"}</p>
            </div>
          </MovableLayer>
        );
      })}
    </MovableLayer>
  );
});
