"use client";

import { useSearchParams } from "next/navigation";
import { NbaScorebug } from "@/components/overlay/nba/nba-scorebug";
import { MlbScoreboard } from "@/components/overlay/mlb/mlb-scoreboard";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";
import { cn } from "@/lib/utils";

interface OverlayCanvasProps {
  sport: Sport;
  scale?: number;
  interactive?: boolean;
}

export function OverlayCanvas({
  sport,
  scale = 1,
  interactive = true,
}: OverlayCanvasProps) {
  const searchParams = useSearchParams();
  const widget = searchParams.get("widget");
  const designMode = useEditorStore((s) => s.designMode);

  return (
    <div
      className={cn(
        "ss-overlay-root origin-top-left",
        designMode && "ss-design-mode"
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        pointerEvents: interactive ? "auto" : "none",
      }}
      onPointerDown={() => {
        if (interactive) useEditorStore.getState().setSelectedId(null);
      }}
    >
      {designMode && (
        <div className="absolute left-1/2 top-2 z-50 -translate-x-1/2 rounded bg-amber-500/20 px-3 py-1 text-xs text-amber-200">
          Modo diseño — datos de ejemplo
        </div>
      )}
      {sport === "nba" && <NbaScorebug widgetFilter={widget} />}
      {sport === "mlb" && <MlbScoreboard widgetFilter={widget} />}
    </div>
  );
}
