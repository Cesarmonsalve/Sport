"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchLeaders,
  fetchNews,
  fetchStandings,
} from "@/lib/espn/client";
import type { Sport } from "@/types";

const ESPN_PATH: Record<Sport, { sport: string; league: string }> = {
  nba: { sport: "basketball", league: "nba" },
  mlb: { sport: "baseball", league: "mlb" },
};

export function useEspnStandings(sport: Sport) {
  const { sport: sp, league } = ESPN_PATH[sport];
  return useQuery({
    queryKey: ["espn-standings", sport],
    queryFn: () => fetchStandings(sp, league),
    staleTime: 60_000,
  });
}

export function useEspnLeaders(sport: Sport) {
  const { sport: sp, league } = ESPN_PATH[sport];
  return useQuery({
    queryKey: ["espn-leaders", sport],
    queryFn: () => fetchLeaders(sp, league),
    staleTime: 120_000,
  });
}

export function useEspnNews(sport: Sport) {
  const { sport: sp, league } = ESPN_PATH[sport];
  return useQuery({
    queryKey: ["espn-news", sport],
    queryFn: () => fetchNews(sp, league, 8),
    staleTime: 120_000,
  });
}
