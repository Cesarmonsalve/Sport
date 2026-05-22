"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";
import { cn } from "@/lib/utils";

export type LowerThirdVariant = "standard" | "breaking" | "sponsored";

interface LowerThirdProps {
  sport: Sport;
  widgetFilter?: string | null;
  interactive?: boolean;
  variant?: LowerThirdVariant;
  title?: string;
  subtitle?: string;
  teamColor?: string;
}

export const LowerThird = memo(function LowerThird({
  sport,
  widgetFilter,
  interactive = false,
  variant = "standard",
  title,
  subtitle,
  teamColor,
}: LowerThirdProps) {
  const nbaGame = useEditorStore((s) => s.nbaGame);
  const mlbGame = useEditorStore((s) => s.mlbGame);
  const brandKit = useEditorStore((s) => s.brandKit);
  const id = sport === "nba" ? "nba-lower-third" : "mlb-lower-third";

  if (widgetFilter && widgetFilter !== id) return null;

  const displayTitle =
    title ??
    (sport === "nba"
      ? `${nbaGame.awayAbbr} @ ${nbaGame.homeAbbr}`
      : `${mlbGame.awayAbbr} @ ${mlbGame.homeAbbr}`);
  const displaySubtitle =
    subtitle ??
    (sport === "nba"
      ? `${nbaGame.period} · ${nbaGame.clock}`
      : `${mlbGame.inningHalf} ${mlbGame.inning}`);
  const barColor = teamColor ?? brandKit.primaryColor;

  return (
    <MovableLayer id={id} className="inline-block" editable interactive={interactive}>
      <motion.div
        initial={{ x: -420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className={cn(
          "ss-lower-third",
          variant === "breaking" && "ss-lower-third-breaking"
        )}
      >
        <div className="ss-lower-third-bar" style={{ background: barColor }} />
        <div className="ss-lower-third-body">
          <p
            className="text-lg font-bold uppercase tracking-wide"
            style={{ fontFamily: `"${brandKit.fontDisplay}", Barlow Condensed, sans-serif` }}
          >
            {displayTitle}
          </p>
          <p
            className="text-sm text-white/80 mt-0.5"
            style={{ fontFamily: `"${brandKit.fontBody}", Barlow, sans-serif` }}
          >
            {displaySubtitle}
          </p>
        </div>
      </motion.div>
    </MovableLayer>
  );
});
