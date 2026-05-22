"use client";

import { memo } from "react";
import { useSearchParams } from "next/navigation";
import { NbaScorebug } from "@/components/overlay/nba/nba-scorebug";
import { NbaPlayerCard } from "@/components/overlay/nba/nba-player-card";
import { NbaQuintet } from "@/components/overlay/nba/nba-quintet";
import { NbaHighlight } from "@/components/overlay/nba/nba-highlight";
import { MlbScoreboard } from "@/components/overlay/mlb/mlb-scoreboard";
import { MlbLineScore } from "@/components/overlay/mlb/mlb-line-score";
import { MlbBases } from "@/components/overlay/mlb/mlb-bases";
import { MlbMatchup } from "@/components/overlay/mlb/mlb-matchup";
import { MlbRoster } from "@/components/overlay/mlb/mlb-roster";
import { MlbTicker } from "@/components/overlay/mlb/mlb-ticker";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";
import { cn } from "@/lib/utils";

interface OverlayCanvasProps {
  sport: Sport;
  scale?: number;
  interactive?: boolean;
  widgetFilter?: string | null;
}

export const OverlayCanvas = memo(function OverlayCanvas({
  sport,
  scale = 1,
  interactive = true,
  widgetFilter: widgetProp,
}: OverlayCanvasProps) {
  const searchParams = useSearchParams();
  const widget = widgetProp ?? searchParams.get("widget");
  const designMode = useEditorStore((s) => s.designMode);

  return (
    <div
      className={cn(
        "ss-overlay-root origin-top-left",
        designMode && "ss-design-mode",
        interactive && designMode && "ss-design-editable"
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        pointerEvents: interactive ? "auto" : "none",
      }}
      onPointerDown={(e) => {
        if (interactive && e.target === e.currentTarget) {
          useEditorStore.getState().setSelectedId(null);
        }
      }}
    >
      {designMode && (
        <div className="absolute left-1/2 top-2 z-50 -translate-x-1/2 rounded bg-amber-500/20 px-3 py-1 text-xs text-amber-200">
          Modo diseño — arrastra widgets, overrides en inspector
        </div>
      )}
      {sport === "nba" && (
        <>
          <NbaScorebug widgetFilter={widget} />
          <NbaPlayerCard widgetFilter={widget} />
          <NbaQuintet widgetFilter={widget} />
          <NbaHighlight widgetFilter={widget} />
        </>
      )}
      {sport === "mlb" && (
        <>
          <MlbScoreboard widgetFilter={widget} />
          <MlbLineScore widgetFilter={widget} />
          <MlbBases widgetFilter={widget} />
          <MlbMatchup widgetFilter={widget} />
          <MlbRoster widgetFilter={widget} />
          <MlbTicker widgetFilter={widget} />
        </>
      )}
    </div>
  );
});
