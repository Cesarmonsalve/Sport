"use client";

import { useNbaScoreboard } from "@/hooks/use-nba-scoreboard";
import { useMlbScoreboard } from "@/hooks/use-mlb-scoreboard";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";

/** ESPN polling for overlay or editor — respects designMode */
export function useEspnPoll(sport: Sport) {
  const designMode = useEditorStore((s) => s.designMode);
  const nba = useNbaScoreboard();
  const mlb = useMlbScoreboard();
  if (designMode) return { events: [], isLoading: false, refetch: () => {} };
  return sport === "nba" ? nba : mlb;
}
