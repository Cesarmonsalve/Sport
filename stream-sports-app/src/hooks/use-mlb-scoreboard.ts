"use client";

import { useQuery } from "@tanstack/react-query";
import {
  eventToMlbSnapshot,
  fetchMlbScoreboard,
  type EspnMlbEvent,
} from "@/lib/espn/mlb";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEffect } from "react";

export function useMlbScoreboard() {
  const designMode = useEditorStore((s) => s.designMode);
  const eventId = useEditorStore((s) => s.eventId);
  const setMlbGame = useEditorStore((s) => s.setMlbGame);
  const setEventId = useEditorStore((s) => s.setEventId);

  const query = useQuery({
    queryKey: ["mlb-scoreboard"],
    queryFn: () => fetchMlbScoreboard(),
    refetchInterval: designMode ? false : 30_000,
    enabled: !designMode,
  });

  useEffect(() => {
    if (designMode || !query.data?.length) return;
    const ev = query.data.find((e) => e.id === eventId) ?? query.data[0];
    if (!eventId && ev) setEventId(ev.id);
    if (ev) setMlbGame(eventToMlbSnapshot(ev));
  }, [query.data, eventId, designMode, setMlbGame, setEventId]);

  return {
    events: query.data ?? ([] as EspnMlbEvent[]),
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
