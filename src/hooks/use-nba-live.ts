"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  detectNbaRotation,
  eventToNbaSnapshot,
  fetchNbaSummary,
  onCourtAthleteIds,
  parseNbaSummary,
  type EspnNbaEvent,
} from "@/lib/espn/nba";
import { useEditorStore } from "@/lib/store/editor-store";

function isLiveState(state?: string) {
  return state === "in" || state === "post";
}

export function useNbaLive(events: EspnNbaEvent[]) {
  const sport = useEditorStore((s) => s.sport);
  const designMode = useEditorStore((s) => s.designMode);
  const eventId = useEditorStore((s) => s.eventId);
  const setNbaGame = useEditorStore((s) => s.setNbaGame);
  const prevGameRef = useRef(useEditorStore.getState().nbaGame);
  const prevIdsRef = useRef("");

  const selected = events.find((e) => e.id === eventId) ?? events[0];
  const live = isLiveState(selected?.state);

  const summaryQuery = useQuery({
    queryKey: ["nba-summary", eventId],
    queryFn: () => fetchNbaSummary(eventId!),
    enabled: !designMode && sport === "nba" && !!eventId,
    refetchInterval: live ? 5_000 : 20_000,
    staleTime: 3_000,
  });

  useEffect(() => {
    if (designMode || !selected) return;
    const base = eventToNbaSnapshot(selected);
    if (!summaryQuery.data) {
      setNbaGame(base);
      return;
    }
    const parsed = parseNbaSummary(summaryQuery.data, base);
    const rotation = detectNbaRotation(prevGameRef.current, parsed);
    const ids = onCourtAthleteIds(parsed);
    if (prevIdsRef.current && prevIdsRef.current !== ids && rotation) {
      parsed.lastRotation = rotation;
    }
    prevIdsRef.current = ids;
    prevGameRef.current = parsed;
    setNbaGame(parsed);
  }, [summaryQuery.data, selected, designMode, setNbaGame]);
}
