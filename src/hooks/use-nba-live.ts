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
import { mergeNbaPlayersToSlots } from "@/lib/espn/player-slots";
import { useEditorStore } from "@/lib/store/editor-store";

function isLiveState(state?: string) {
  return state === "in" || state === "post";
}

export function useNbaLive(events: EspnNbaEvent[]) {
  const sport = useEditorStore((s) => s.sport);
  const designMode = useEditorStore((s) => s.designMode);
  const eventId = useEditorStore((s) => s.eventId);
  const setNbaGame = useEditorStore((s) => s.setNbaGame);
  const setPlayerSlots = useEditorStore((s) => s.setPlayerSlots);
  const setRotationNotice = useEditorStore((s) => s.setRotationNotice);
  const prevGameRef = useRef(useEditorStore.getState().nbaGame);
  const prevIdsRef = useRef("");

  const selected = events.find((e) => e.id === eventId) ?? events[0];
  const live = isLiveState(selected?.state);

  const summaryQuery = useQuery({
    queryKey: ["nba-summary", eventId],
    queryFn: () => fetchNbaSummary(eventId!),
    enabled: !designMode && sport === "nba" && !!eventId,
    refetchInterval: live ? 5_000 : 20_000,
    staleTime: 8_000,
    gcTime: 120_000,
  });

  useEffect(() => {
    if (designMode || !selected) return;
    const base = eventToNbaSnapshot(selected);
    if (!summaryQuery.data) {
      setNbaGame(base);
      return;
    }
    let parsed = parseNbaSummary(summaryQuery.data, base);
    const rotation = detectNbaRotation(prevGameRef.current, parsed);
    const ids = onCourtAthleteIds(parsed);
    if (prevIdsRef.current && prevIdsRef.current !== ids && rotation) {
      parsed = { ...parsed, lastRotation: rotation };
      setRotationNotice(
        `Rotación ${rotation.team === "home" ? parsed.homeAbbr : parsed.awayAbbr}: ${rotation.playerIn.name}`
      );
      window.setTimeout(() => setRotationNotice(null), 4000);
    }
    prevIdsRef.current = ids;
    prevGameRef.current = parsed;

    const slots = useEditorStore.getState().playerSlots;
    const merged = mergeNbaPlayersToSlots(parsed, slots);
    setPlayerSlots(merged.bindings);
    setNbaGame(merged.game);
  }, [summaryQuery.data, selected, designMode, setNbaGame, setPlayerSlots, setRotationNotice]);
}
