"use client";

import { useQuery } from "@tanstack/react-query";
import {
  eventToNbaSnapshot,
  fetchNbaScoreboard,
  type EspnNbaEvent,
} from "@/lib/espn/nba";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEffect } from "react";

export function useNbaScoreboard() {
  const designMode = useEditorStore((s) => s.designMode);
  const eventId = useEditorStore((s) => s.eventId);
  const setNbaGame = useEditorStore((s) => s.setNbaGame);
  const setEventId = useEditorStore((s) => s.setEventId);

  const query = useQuery({
    queryKey: ["nba-scoreboard"],
    queryFn: () => fetchNbaScoreboard(),
    refetchInterval: designMode ? false : 30_000,
    enabled: !designMode,
  });

  useEffect(() => {
    if (designMode || !query.data?.length) return;
    const ev =
      query.data.find((e) => e.id === eventId) ?? query.data[0];
    if (!eventId && ev) setEventId(ev.id);
    if (ev) setNbaGame(eventToNbaSnapshot(ev));
  }, [query.data, eventId, designMode, setNbaGame, setEventId]);

  return {
    events: query.data ?? ([] as EspnNbaEvent[]),
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
