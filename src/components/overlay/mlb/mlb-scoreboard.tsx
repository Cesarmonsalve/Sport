"use client";

import { MovableLayer } from "@/components/overlay/movable-layer";
import { useEditorStore } from "@/lib/store/editor-store";

interface MlbScoreboardProps {
  widgetFilter?: string | null;
}

export function MlbScoreboard({ widgetFilter }: MlbScoreboardProps) {
  const game = useEditorStore((s) => s.mlbGame);

  if (
    widgetFilter &&
    widgetFilter !== "scoreboard" &&
    !widgetFilter.startsWith("sb-")
  ) {
    return null;
  }

  const show = (id: string) =>
    !widgetFilter || widgetFilter === id || widgetFilter === "scoreboard";

  return (
    <MovableLayer
      id="scoreboard"
      className="rounded-lg border border-white/10 bg-black/75 px-4 py-3 backdrop-blur-sm"
      editable={!widgetFilter || widgetFilter === "scoreboard"}
    >
      <div className="flex items-center gap-6">
        {show("sb-abbr-v") && (
          <MovableLayer id="sb-abbr-v" groupParent="scoreboard">
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "28px" }}>
              {game.awayAbbr}
            </span>
          </MovableLayer>
        )}
        {show("sb-sc-v") && (
          <MovableLayer id="sb-sc-v" groupParent="scoreboard">
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "52px", color: "#fff" }}>
              {game.scoreAway}
            </span>
          </MovableLayer>
        )}
        {show("sb-inn-n") && (
          <MovableLayer id="sb-inn-n" groupParent="scoreboard">
            <div className="text-center">
              <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "22px", color: "#c9a227" }}>
                {game.inningHalf} {game.inning}
              </div>
            </div>
          </MovableLayer>
        )}
        {show("sb-sc-h") && (
          <MovableLayer id="sb-sc-h" groupParent="scoreboard">
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "52px", color: "#fff" }}>
              {game.scoreHome}
            </span>
          </MovableLayer>
        )}
        {show("sb-abbr-h") && (
          <MovableLayer id="sb-abbr-h" groupParent="scoreboard">
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "28px" }}>
              {game.homeAbbr}
            </span>
          </MovableLayer>
        )}
      </div>
    </MovableLayer>
  );
}
