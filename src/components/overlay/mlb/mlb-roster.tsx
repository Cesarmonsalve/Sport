"use client";

import { MovableLayer } from "@/components/overlay/movable-layer";
import { PlayerLineupCard } from "@/components/overlay/shared/player-lineup-card";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore, selectMlbGame } from "@/lib/store/editor-store";

interface Props {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export function MlbRoster({ widgetFilter, interactive = false }: Props) {
  const game = useEditorStore(selectMlbGame);
  const widgetSettings = useEditorStore((s) => s.widgetSettings["roster-widget"]);

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
      <div className="flex flex-col gap-2 min-w-[clamp(100px,12vw,160px)]">
        <p className="text-[10px] uppercase tracking-wider text-white/50">{game.awayAbbr}</p>
        <div className="grid gap-2" style={{ gridTemplateColumns: "1fr" }}>
          {away.slice(0, 12).map((p, i) => (
            <PlayerLineupCard
              key={p.id}
              cardId={`roster-card-away-${i}`}
              player={p}
              posLabel={p.position ?? "—"}
              accent="#ff7a00"
              widgetId="roster-widget"
              widgetSettings={widgetSettings}
              groupParent="roster-widget"
              interactive={interactive}
              sport="mlb"
            />
          ))}
        </div>
      </div>
      <div className="w-px bg-white/10 shrink-0" />
      <div className="flex flex-col gap-2 min-w-[clamp(100px,12vw,160px)]">
        <p className="text-[10px] uppercase tracking-wider text-white/50">{game.homeAbbr}</p>
        <div className="grid gap-2" style={{ gridTemplateColumns: "1fr" }}>
          {home.slice(0, 12).map((p, i) => (
            <PlayerLineupCard
              key={p.id}
              cardId={`roster-card-home-${i}`}
              player={p}
              posLabel={p.position ?? "—"}
              accent="#1a5cff"
              widgetId="roster-widget"
              widgetSettings={widgetSettings}
              groupParent="roster-widget"
              interactive={interactive}
              sport="mlb"
            />
          ))}
        </div>
      </div>
    </MovableLayer>
  );
}
