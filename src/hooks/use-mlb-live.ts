"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  eventToMlbSnapshot,
  fetchMlbSummary,
  parseMlbSummary,
  type EspnMlbEvent,
} from "@/lib/espn/mlb";
import {
  extractGalleryFromSummary,
  galleryFromMlbGame,
} from "@/lib/espn/gallery";
import { preloadTeamLogos } from "@/lib/espn/logos";
import { useEditorStore } from "@/lib/store/editor-store";

function isLiveState(state?: string) {
  return state === "in" || state === "post";
}

export function useMlbLive(events: EspnMlbEvent[]) {
  const sport = useEditorStore((s) => s.sport);
  const designMode = useEditorStore((s) => s.designMode);
  const eventId = useEditorStore((s) => s.eventId);
  const setMlbGame = useEditorStore((s) => s.setMlbGame);
  const setGalleryPlayers = useEditorStore((s) => s.setGalleryPlayers);

  const selected = events.find((e) => e.id === eventId) ?? events[0];
  const live = isLiveState(selected?.state);

  const summaryQuery = useQuery({
    queryKey: ["mlb-summary", eventId],
    queryFn: () => fetchMlbSummary(eventId!),
    enabled: !designMode && sport === "mlb" && !!eventId,
    refetchInterval: live ? 5_000 : 20_000,
    staleTime: 8_000,
    gcTime: 120_000,
  });

  useEffect(() => {
    if (designMode || !selected) return;
    const base = eventToMlbSnapshot(selected);
    if (!summaryQuery.data) {
      setMlbGame(base);
      setGalleryPlayers(galleryFromMlbGame(base));
      preloadTeamLogos([base.homeLogo, base.awayLogo]);
      return;
    }
    const parsed = parseMlbSummary(summaryQuery.data, base);
    setMlbGame(parsed);
    const gallery = extractGalleryFromSummary(
      summaryQuery.data,
      parsed.homeAbbr,
      parsed.awayAbbr,
      "mlb"
    );
    setGalleryPlayers(gallery.length ? gallery : galleryFromMlbGame(parsed));
    preloadTeamLogos([parsed.homeLogo, parsed.awayLogo]);
  }, [summaryQuery.data, selected, designMode, setMlbGame, setGalleryPlayers]);
}
