"use client";

import { memo } from "react";
import { useSearchParams } from "next/navigation";
import { NbaScorebug } from "@/components/overlay/nba/nba-scorebug";
import { NbaPlayerCard } from "@/components/overlay/nba/nba-player-card";
import { NbaQuintet } from "@/components/overlay/nba/nba-quintet";
import { NbaHighlight } from "@/components/overlay/nba/nba-highlight";
import { NbaCourtPositions } from "@/components/overlay/nba/nba-court-positions";
import { NbaWebcamPanel } from "@/components/overlay/nba/nba-webcam-panel";
import { NbaSocialFooter } from "@/components/overlay/nba/nba-social-footer";
import { MlbScoreboard } from "@/components/overlay/mlb/mlb-scoreboard";
import { MlbLineScore } from "@/components/overlay/mlb/mlb-line-score";
import { MlbBases } from "@/components/overlay/mlb/mlb-bases";
import { MlbMatchup } from "@/components/overlay/mlb/mlb-matchup";
import { MlbRoster } from "@/components/overlay/mlb/mlb-roster";
import { MlbTicker } from "@/components/overlay/mlb/mlb-ticker";
import { MlbFieldPositions } from "@/components/overlay/mlb/mlb-field-positions";
import { MlbWebcamFrames } from "@/components/overlay/mlb/mlb-webcam-frames";
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
  const templateId = useEditorStore((s) => s.templateId);

  return (
    <div
      className={cn(
        "ss-overlay-root origin-top-left",
        `ss-template-${templateId}`,
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
          Doble clic = editar texto · Shift+arrastrar = selección · 8 handles resize
        </div>
      )}
      {sport === "nba" && (
        <>
          <NbaCourtPositions widgetFilter={widget} interactive={interactive} />
          <NbaScorebug widgetFilter={widget} interactive={interactive} />
          <NbaQuintet widgetFilter={widget} interactive={interactive} />
          <NbaPlayerCard widgetFilter={widget} interactive={interactive} />
          <NbaHighlight widgetFilter={widget} interactive={interactive} />
          <NbaWebcamPanel widgetFilter={widget} interactive={interactive} />
          <NbaSocialFooter widgetFilter={widget} interactive={interactive} />
        </>
      )}
      {sport === "mlb" && (
        <>
          <MlbFieldPositions widgetFilter={widget} interactive={interactive} />
          <MlbScoreboard widgetFilter={widget} interactive={interactive} />
          <MlbLineScore widgetFilter={widget} interactive={interactive} />
          <MlbBases widgetFilter={widget} interactive={interactive} />
          <MlbMatchup widgetFilter={widget} interactive={interactive} />
          <MlbRoster widgetFilter={widget} interactive={interactive} />
          <MlbTicker widgetFilter={widget} interactive={interactive} />
          <MlbWebcamFrames widgetFilter={widget} interactive={interactive} />
        </>
      )}
    </div>
  );
});
