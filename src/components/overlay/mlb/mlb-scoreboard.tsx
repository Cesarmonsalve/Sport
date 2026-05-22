"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { AnimatedScore } from "@/components/overlay/animated-score";
import { widgetOnly } from "@/lib/overlay/widget-filter";
import { useEditorStore, selectMlbGame } from "@/lib/store/editor-store";
import { cn } from "@/lib/utils";

const SCOREBOARD_IDS = [
  "scoreboard",
  "sb-sc-v",
  "sb-sc-h",
  "sb-abbr-v",
  "sb-abbr-h",
  "sb-inn-n",
];

interface MlbScoreboardProps {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export const MlbScoreboard = memo(function MlbScoreboard({
  widgetFilter,
  interactive = false,
}: MlbScoreboardProps) {
  const game = useEditorStore(selectMlbGame);
  const elements = useEditorStore((s) => s.elements);
  const freeEditMode = useEditorStore((s) => s.freeEditMode);

  if (!widgetOnly(widgetFilter, SCOREBOARD_IDS)) return null;

  const show = (id: string) =>
    !widgetFilter || widgetFilter === id || widgetFilter === "scoreboard";

  return (
    <MovableLayer
      id="scoreboard"
      className="rounded-lg border border-white/10 bg-black/75 px-4 py-3 backdrop-blur-sm inline-block"
      editable
      interactive={interactive}
    >
      <div
        className={cn(
          freeEditMode ? "relative min-h-[72px] min-w-[280px]" : "flex items-center gap-6"
        )}
      >
        {show("sb-abbr-v") && (
          <MovableLayer id="sb-abbr-v" groupParent="scoreboard" editable interactive={interactive}>
            <span
              style={{
                fontFamily: elements["sb-abbr-v"]?.fontFamily ?? '"Bebas Neue", sans-serif',
                fontSize: elements["sb-abbr-v"]?.fontSize ?? "28px",
              }}
            >
              {game.awayAbbr}
            </span>
          </MovableLayer>
        )}
        {show("sb-sc-v") && (
          <MovableLayer id="sb-sc-v" groupParent="scoreboard" editable interactive={interactive}>
            <AnimatedScore
              value={game.scoreAway}
              style={{
                fontFamily: elements["sb-sc-v"]?.fontFamily ?? '"Bebas Neue", sans-serif',
                fontSize: elements["sb-sc-v"]?.fontSize ?? "52px",
                color: elements["sb-sc-v"]?.color ?? "#fff",
              }}
            />
          </MovableLayer>
        )}
        {show("sb-inn-n") && (
          <MovableLayer id="sb-inn-n" groupParent="scoreboard" editable interactive={interactive}>
            <div
              className="text-center"
              style={{
                fontFamily: elements["sb-inn-n"]?.fontFamily ?? '"Bebas Neue", sans-serif',
                fontSize: elements["sb-inn-n"]?.fontSize ?? "22px",
                color: elements["sb-inn-n"]?.color ?? "#c9a227",
              }}
            >
              {game.inningHalf} {game.inning}
            </div>
          </MovableLayer>
        )}
        {show("sb-sc-h") && (
          <MovableLayer id="sb-sc-h" groupParent="scoreboard" editable interactive={interactive}>
            <AnimatedScore
              value={game.scoreHome}
              style={{
                fontFamily: elements["sb-sc-h"]?.fontFamily ?? '"Bebas Neue", sans-serif',
                fontSize: elements["sb-sc-h"]?.fontSize ?? "52px",
                color: elements["sb-sc-h"]?.color ?? "#fff",
              }}
            />
          </MovableLayer>
        )}
        {show("sb-abbr-h") && (
          <MovableLayer id="sb-abbr-h" groupParent="scoreboard" editable interactive={interactive}>
            <span
              style={{
                fontFamily: elements["sb-abbr-h"]?.fontFamily ?? '"Bebas Neue", sans-serif',
                fontSize: elements["sb-abbr-h"]?.fontSize ?? "28px",
              }}
            >
              {game.homeAbbr}
            </span>
          </MovableLayer>
        )}
      </div>
    </MovableLayer>
  );
});
