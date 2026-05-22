"use client";

import { memo, useEffect, useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";

const COLORS = ["#3b82f6", "#00b8d4", "#e11d48", "#fbbf24", "#c9a227"];

export const ScoreConfetti = memo(function ScoreConfetti() {
  const enabled = useEditorStore((s) => s.confettiEnabled);
  const sport = useEditorStore((s) => s.sport);
  const nba = useEditorStore((s) => s.nbaGame);
  const mlb = useEditorStore((s) => s.mlbGame);
  const [burst, setBurst] = useState(0);

  const scoreKey =
    sport === "nba"
      ? `${nba.scoreHome}-${nba.scoreAway}`
      : `${mlb.scoreHome}-${mlb.scoreAway}`;

  useEffect(() => {
    if (!enabled) return;
    setBurst((b) => b + 1);
  }, [scoreKey, enabled]);

  if (!enabled || burst === 0) return null;

  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: `${burst}-${i}`,
    left: `${10 + Math.random() * 80}%`,
    delay: Math.random() * 0.3,
    color: COLORS[i % COLORS.length],
    rot: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 h-2 w-2 rounded-sm opacity-90 animate-[ss-confetti_1.2s_ease-out_forwards]"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
});
