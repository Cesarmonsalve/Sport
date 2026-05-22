"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { LineupRow } from "@/components/overlay/shared/lineup-row";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore, selectNbaGame } from "@/lib/store/editor-store";
import type { LineupDisplayMode } from "@/types";

interface Props {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export const NbaQuintet = memo(function NbaQuintet({ widgetFilter, interactive = false }: Props) {
  const game = useEditorStore(selectNbaGame);
  const mode =
    useEditorStore((s) => s.widgetSettings["quinteto-widget"]?.lineupDisplayMode) ?? "full";

  if (!shouldShowWidget(widgetFilter, "quinteto-widget")) return null;

  const home = game.onCourtHome ?? [];
  const away = game.onCourtAway ?? [];
  if (!home.length && !away.length) return null;

  const positions = ["PG", "SG", "SF", "PF", "C"];

  return (
    <MovableLayer
      id="quinteto-widget"
      className="ss-roster-panel ss-lineup-panel rounded-lg border border-[#1a5cff]/40 bg-black/85 backdrop-blur-md overflow-hidden inline-block"
      editable
      interactive={interactive}
    >
      <div className="px-3 py-2 border-b border-white/10 bg-[#1a5cff]/20">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[#1a5cff]">
          Quinteto · {game.homeAbbr}
        </p>
      </div>
      <div className="px-2 py-1 max-h-[280px] overflow-hidden">
        {home.map((p, i) => (
          <LineupRow
            key={p.id}
            player={p}
            posLabel={p.position ?? positions[i] ?? "—"}
            accent="#1a5cff"
            mode={mode as LineupDisplayMode}
            atomPrefix="q"
            index={i}
            team="home"
            groupParent="quinteto-widget"
            interactive={interactive}
            sport="nba"
          />
        ))}
      </div>
      <div className="px-3 py-2 border-t border-b border-white/10 bg-[#ff7a00]/15">
        <p className="text-[10px] uppercase tracking-widest text-[#ff7a00]">{game.awayAbbr}</p>
      </div>
      <div className="px-2 py-1">
        {away.map((p, i) => (
          <LineupRow
            key={p.id}
            player={p}
            posLabel={p.position ?? positions[i] ?? "—"}
            accent="#ff7a00"
            mode={mode as LineupDisplayMode}
            atomPrefix="q"
            index={i}
            team="away"
            groupParent="quinteto-widget"
            interactive={interactive}
            sport="nba"
          />
        ))}
      </div>
    </MovableLayer>
  );
});
