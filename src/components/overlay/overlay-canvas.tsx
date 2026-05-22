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
import { TeamLogoLayer } from "@/components/overlay/team-logo-layer";
import { ScoreConfetti } from "@/components/overlay/score-confetti";
import { FreeCanvasLayer } from "@/components/overlay/free-canvas-layer";
import { MlbScoreboard } from "@/components/overlay/mlb/mlb-scoreboard";
import { MlbLineScore } from "@/components/overlay/mlb/mlb-line-score";
import { MlbBases } from "@/components/overlay/mlb/mlb-bases";
import { MlbMatchup } from "@/components/overlay/mlb/mlb-matchup";
import { MlbRoster } from "@/components/overlay/mlb/mlb-roster";
import { MlbTicker } from "@/components/overlay/mlb/mlb-ticker";
import { MlbFieldPositions } from "@/components/overlay/mlb/mlb-field-positions";
import { MlbWebcamFrames } from "@/components/overlay/mlb/mlb-webcam-frames";
import { SponsorTicker } from "@/components/overlay/sponsor-ticker";
import { BroadcastTicker } from "@/components/overlay/shared/broadcast-ticker";
import { LowerThird } from "@/components/overlay/shared/lower-third";
import { SmartSlotLayer } from "@/components/editor/smart-slot-layer";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface OverlayCanvasProps {
  sport: Sport;
  scale?: number;
  interactive?: boolean;
  widgetFilter?: string | null;
  streamSafePreview?: boolean;
}

export const OverlayCanvas = memo(function OverlayCanvas({
  sport,
  scale = 1,
  interactive = true,
  widgetFilter: widgetProp,
  streamSafePreview = false,
}: OverlayCanvasProps) {
  const searchParams = useSearchParams();
  const widget = widgetProp ?? searchParams.get("widget");
  const showBg = searchParams.get("bg") === "1";
  const designMode = useEditorStore((s) => s.designMode);
  const canvasBackground = useEditorStore((s) => s.canvasBackground);
  const brandKit = useEditorStore((s) => s.brandKit);
  const templateId = useEditorStore((s) => s.templateId);
  const sceneTransition = useEditorStore((s) => s.sceneTransition);
  const sceneTransitionMs = useEditorStore((s) => s.sceneTransitionMs);
  const templateKey = `${templateId}-${sceneTransition}`;

  const transitionProps =
    sceneTransition === "cut"
      ? {}
      : sceneTransition === "fade" || sceneTransition === "dissolve"
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : sceneTransition === "slide-left"
          ? { initial: { x: -80, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 80, opacity: 0 } }
          : sceneTransition === "slide-up"
            ? { initial: { y: 60, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -60, opacity: 0 } }
            : { initial: { scale: 0.96, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 1.02, opacity: 0 } };

  return (
    <div
      className={cn(
        "ss-overlay-root origin-top-left",
        `ss-template-${templateId}`,
        designMode && "ss-design-mode",
        interactive && designMode && "ss-design-editable",
        streamSafePreview && "ss-stream-safe"
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
      {(interactive || showBg) && brandKit.backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          style={{
            opacity: (brandKit.backgroundOpacity ?? 100) / 100,
            filter: `blur(${brandKit.backgroundBlur ?? 0}px)`,
          }}
          src={brandKit.backgroundVideo}
        />
      )}
      {(interactive || showBg) &&
        !brandKit.backgroundVideo &&
        brandKit.backgroundImage && (
          <div
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            style={{
              background: brandKit.backgroundImage.startsWith("linear") ||
                brandKit.backgroundImage.startsWith("radial")
                ? brandKit.backgroundImage
                : undefined,
              opacity: (brandKit.backgroundOpacity ?? 100) / 100,
              filter: `blur(${brandKit.backgroundBlur ?? canvasBackground?.blur ?? 0}px)`,
            }}
          >
            {!brandKit.backgroundImage.startsWith("linear") &&
              !brandKit.backgroundImage.startsWith("radial") && (
                <img
                  className="h-full w-full object-cover"
                  src={brandKit.backgroundImage}
                  alt=""
                />
              )}
          </div>
        )}
      {(interactive || showBg) && (canvasBackground?.darken ?? 0) > 0 && (
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-black"
          style={{ opacity: (canvasBackground?.darken ?? 0) / 100 }}
        />
      )}
      <ScoreConfetti />
      <SmartSlotLayer sport={sport} interactive={interactive} />
      <FreeCanvasLayer interactive={interactive} />
      <AnimatePresence mode="wait">
        <motion.div
          key={templateKey}
          className="absolute inset-0"
          transition={{ duration: sceneTransitionMs / 1000 }}
          {...transitionProps}
        >
      {sport === "nba" && (
        <>
          <TeamLogoLayer id="team-logo-home" side="home" interactive={interactive} widgetFilter={widget} />
          <TeamLogoLayer id="team-logo-away" side="away" interactive={interactive} widgetFilter={widget} />
          <NbaCourtPositions widgetFilter={widget} interactive={interactive} />
          <NbaScorebug widgetFilter={widget} interactive={interactive} />
          <NbaQuintet widgetFilter={widget} interactive={interactive} />
          <NbaPlayerCard widgetFilter={widget} interactive={interactive} />
          <NbaHighlight widgetFilter={widget} interactive={interactive} />
          <NbaWebcamPanel widgetFilter={widget} interactive={interactive} />
          <NbaSocialFooter widgetFilter={widget} interactive={interactive} />
          <SponsorTicker widgetFilter={widget} interactive={interactive} />
          <BroadcastTicker sport="nba" widgetFilter={widget} interactive={interactive} />
          <LowerThird sport="nba" widgetFilter={widget} interactive={interactive} />
        </>
      )}
      {sport === "mlb" && (
        <>
          <TeamLogoLayer id="team-logo-home" side="home" interactive={interactive} widgetFilter={widget} />
          <TeamLogoLayer id="team-logo-away" side="away" interactive={interactive} widgetFilter={widget} />
          <MlbFieldPositions widgetFilter={widget} interactive={interactive} />
          <MlbScoreboard widgetFilter={widget} interactive={interactive} />
          <MlbLineScore widgetFilter={widget} interactive={interactive} />
          <MlbBases widgetFilter={widget} interactive={interactive} />
          <MlbMatchup widgetFilter={widget} interactive={interactive} />
          <MlbRoster widgetFilter={widget} interactive={interactive} />
          <MlbTicker widgetFilter={widget} interactive={interactive} />
          <MlbWebcamFrames widgetFilter={widget} interactive={interactive} />
          <SponsorTicker widgetFilter={widget} interactive={interactive} />
          <BroadcastTicker sport="mlb" widgetFilter={widget} interactive={interactive} />
          <LowerThird sport="mlb" widgetFilter={widget} interactive={interactive} />
        </>
      )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
