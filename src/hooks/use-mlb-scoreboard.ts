"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMlbScoreboard, type EspnMlbEvent } from "@/lib/espn/mlb";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEffect } from "react";
import { useMlbLive } from "@/hooks/use-mlb-live";
import { loadAppSettings } from "@/lib/settings/app-settings";

function isLiveState(state?: string) {
  return state === "in";
}

export function useMlbScoreboard() {
  const sport = useEditorStore((s) => s.sport);
  const designMode = useEditorStore((s) => s.designMode);
  const eventId = useEditorStore((s) => s.eventId);
  const setEventId = useEditorStore((s) => s.setEventId);

  const query = useQuery({
    queryKey: ["mlb-scoreboard"],
    queryFn: () => fetchMlbScoreboard(),
    refetchInterval: designMode ? false : (q) => {
      const { pollIntervalLiveMs, pollIntervalIdleMs } = loadAppSettings();
      const events = q.state.data ?? [];
      const sel = events.find((e) => e.id === eventId) ?? events[0];
      return isLiveState(sel?.state) ? pollIntervalLiveMs : pollIntervalIdleMs;
    },
    enabled: !designMode && sport === "mlb",
    staleTime: 12_000,
    gcTime: 120_000,
  });

  const events = query.data ?? ([] as EspnMlbEvent[]);

  useEffect(() => {
    if (designMode || !events.length) return;
    if (!eventId) setEventId(events[0].id);
  }, [events, eventId, designMode, setEventId]);

  useMlbLive(events);

  return {
    events,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    dataUpdatedAt: query.dataUpdatedAt,
    error: query.error,
    refetch: query.refetch,
  };
}
