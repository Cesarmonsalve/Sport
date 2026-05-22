"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { AnimatedScore } from "@/components/overlay/animated-score";
import { widgetOnly } from "@/lib/overlay/widget-filter";
import { useEditorStore, selectMlbGame } from "@/lib/store/editor-store";

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
}

export const MlbScoreboard = memo(function MlbScoreboard({
  widgetFilter,
}: MlbScoreboardProps) {
  const game = useEditorStore(selectMlbGame);
  const editorMode = useEditorStore((s) => s.editorMode);
  const groupDrag = editorMode === "simple";

  if (!widgetOnly(widgetFilter, SCOREBOARD_IDS)) return null;

  const show = (id: string) =>
    !widgetFilter || widgetFilter === id || widgetFilter === "scoreboard";

  return (
    <MovableLayer
      id="scoreboard"
      className="rounded-lg border border-white/10 bg-black/75 px-4 py-3 backdrop-blur-sm"
      editable={groupDrag && (!widgetFilter || widgetFilter === "scoreboard")}
    >
      <div className="flex items-center gap-6">
        {show("sb-abbr-v") && (
          <MovableLayer id="sb-abbr-v" groupParent="scoreboard" editable={!groupDrag}>
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "28px" }}>
              {game.awayAbbr}
            </span>
          </MovableLayer>
        )}
        {show("sb-sc-v") && (
          <MovableLayer id="sb-sc-v" groupParent="scoreboard" editable={!groupDrag}>
            <AnimatedScore
              value={game.scoreAway}
              style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "52px", color: "#fff" }}
            />
          </MovableLayer>
        )}
        {show("sb-inn-n") && (
          <MovableLayer id="sb-inn-n" groupParent="scoreboard" editable={!groupDrag}>
            <div
              className="text-center"
              style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "22px", color: "#c9a227" }}
            >
              {game.inningHalf} {game.inning}
            </div>
          </MovableLayer>
        )}
        {show("sb-sc-h") && (
          <MovableLayer id="sb-sc-h" groupParent="scoreboard" editable={!groupDrag}>
            <AnimatedScore
              value={game.scoreHome}
              style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "52px", color: "#fff" }}
            />
          </MovableLayer>
        )}
        {show("sb-abbr-h") && (
          <MovableLayer id="sb-abbr-h" groupParent="scoreboard" editable={!groupDrag}>
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "28px" }}>
              {game.homeAbbr}
            </span>
          </MovableLayer>
        )}
      </div>
    </MovableLayer>
  );
});
