"use client";

import { MovableLayer } from "@/components/overlay/movable-layer";
import { LineupRow } from "@/components/overlay/shared/lineup-row";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore, selectMlbGame } from "@/lib/store/editor-store";
import type { LineupDisplayMode } from "@/types";

interface Props {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export function MlbRoster({ widgetFilter, interactive = false }: Props) {
  const game = useEditorStore(selectMlbGame);
  const mode =
    useEditorStore((s) => s.widgetSettings["roster-widget"]?.lineupDisplayMode) ?? "photo-text";

  if (!shouldShowWidget(widgetFilter, "roster-widget")) return null;

  const away = game.rosterAway ?? [];
  const home = game.rosterHome ?? [];
  if (!away.length && !home.length) return null;

  return (
    <MovableLayer
      id="roster-widget"
      className="flex gap-4 rounded-lg border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-sm inline-block ss-lineup-panel"
      editable
      interactive={interactive}
    >
      <div className="flex flex-col min-w-[140px]">
        <p className="mb-1 text-[10px] uppercase tracking-wider text-white/50">{game.awayAbbr}</p>
        {away.slice(0, 12).map((p, i) => (
          <LineupRow
            key={p.id}
            player={p}
            posLabel={p.position ?? "—"}
            accent="#ff7a00"
            mode={mode as LineupDisplayMode}
            atomPrefix="roster"
            index={i}
            team="away"
            groupParent="roster-widget"
            interactive={interactive}
            sport="mlb"
          />
        ))}
      </div>
      <div className="w-px bg-white/10" />
      <div className="flex flex-col min-w-[140px]">
        <p className="mb-1 text-[10px] uppercase tracking-wider text-white/50">{game.homeAbbr}</p>
        {home.slice(0, 12).map((p, i) => (
          <LineupRow
            key={p.id}
            player={p}
            posLabel={p.position ?? "—"}
            accent="#1a5cff"
            mode={mode as LineupDisplayMode}
            atomPrefix="roster"
            index={i}
            team="home"
            groupParent="roster-widget"
            interactive={interactive}
            sport="mlb"
          />
        ))}
      </div>
    </MovableLayer>
  );
}
