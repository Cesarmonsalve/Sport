"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNbaScoreboard, type EspnNbaEvent } from "@/lib/espn/nba";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEffect } from "react";
import { useNbaLive } from "@/hooks/use-nba-live";
import { loadAppSettings } from "@/lib/settings/app-settings";

function isLiveState(state?: string) {
  return state === "in";
}

export function useNbaScoreboard() {
  const sport = useEditorStore((s) => s.sport);
  const designMode = useEditorStore((s) => s.designMode);
  const eventId = useEditorStore((s) => s.eventId);
  const setEventId = useEditorStore((s) => s.setEventId);

  const query = useQuery({
    queryKey: ["nba-scoreboard"],
    queryFn: () => fetchNbaScoreboard(),
    refetchInterval: designMode ? false : (q) => {
      const { pollIntervalLiveMs, pollIntervalIdleMs } = loadAppSettings();
      const events = q.state.data ?? [];
      const sel = events.find((e) => e.id === eventId) ?? events[0];
      return isLiveState(sel?.state) ? pollIntervalLiveMs : pollIntervalIdleMs;
    },
    enabled: !designMode && sport === "nba",
    staleTime: 12_000,
    gcTime: 120_000,
  });

  const events = query.data ?? ([] as EspnNbaEvent[]);

  useEffect(() => {
    if (designMode || !events.length) return;
    if (!eventId) setEventId(events[0].id);
  }, [events, eventId, designMode, setEventId]);

  useNbaLive(events);

  return {
    events,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    dataUpdatedAt: query.dataUpdatedAt,
    error: query.error,
    refetch: query.refetch,
  };
}
