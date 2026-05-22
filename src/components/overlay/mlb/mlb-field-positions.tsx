"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { PlayerHeadshot } from "@/components/ui/player-headshot";
import { useEditorStore, selectMlbGame } from "@/lib/store/editor-store";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import type { MarkerStyle } from "@/types";

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

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

interface Props {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export const MlbFieldPositions = memo(function MlbFieldPositions({
  widgetFilter,
  interactive = false,
}: Props) {
  const game = useEditorStore(selectMlbGame);
  const dataBindings = useEditorStore((s) => s.dataBindings);
  const markerStyle =
    (useEditorStore((s) => s.widgetSettings["field-positions-widget"]?.markerStyle) as MarkerStyle) ??
    "photo";

  if (!shouldShowWidget(widgetFilter, "field-positions-widget")) return null;

  const roster = [...(game.rosterHome ?? []), ...(game.rosterAway ?? [])];

  return (
    <MovableLayer id="field-positions-widget" className="ss-field-root" editable interactive={interactive}>
      {SLOTS.map((s, i) => {
        const bind = dataBindings[s.id];
        const p = bind?.dataSource === "manual"
          ? {
              id: bind.athleteId ?? s.id,
              name: bind.manualText ?? "—",
              headshot: bind.manualImageUrl,
            }
          : roster[i];
        const label = bind?.displayLabel;

        return (
          <MovableLayer
            key={s.id}
            id={s.id}
            groupParent="field-positions-widget"
            className="ss-field-slot"
            editable
            interactive={interactive}
          >
            <div
              className="rounded-full border border-[#ff7a00]/50 bg-black/75 px-4 py-2 text-center min-w-[90px] flex flex-col items-center gap-1"
              data-drop-slot={s.id}
            >
              <span className="text-[10px] font-bold text-[#ff7a00]">{s.label}</span>
              {markerStyle === "dot" && <div className="h-2 w-2 rounded-full bg-[#ff7a00]" />}
              {markerStyle === "initials" && (
                <span className="text-sm font-bold">{initials(p?.name ?? s.label)}</span>
              )}
              {markerStyle === "photo" && (
                <PlayerHeadshot src={p?.headshot} alt={p?.name ?? ""} size={36} sport="mlb" />
              )}
              {(markerStyle === "name" || markerStyle === "photo") && (
                <p className="text-xs truncate max-w-[100px]">{p?.name?.split(" ").pop() ?? "—"}</p>
              )}
              {label && (
                <span className="text-[8px] text-primary truncate max-w-[90px]">{label}</span>
              )}
            </div>
          </MovableLayer>
        );
      })}
    </MovableLayer>
  );
});
