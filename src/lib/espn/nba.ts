import { formatTodayEspn } from "@/lib/utils";
import type { NbaGameSnapshot } from "@/types";

const NBA_SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";
const NBA_SUMMARY = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary";

export interface EspnNbaEvent {
  id: string;
  name: string;
  shortName: string;
  status: string;
  home: { abbr: string; score: string; logo?: string };
  away: { abbr: string; score: string; logo?: string };
}

export async function fetchNbaScoreboard(date?: string): Promise<EspnNbaEvent[]> {
  const dates = date ?? formatTodayEspn();
  const res = await fetch(`${NBA_SCOREBOARD}?dates=${dates}`, { next: { revalidate: 15 } });
  if (!res.ok) throw new Error("NBA scoreboard fetch failed");
  const data = await res.json();
  const events = data?.events ?? [];
  return events.map((ev: Record<string, unknown>) => {
    const comp = (ev.competitions as Record<string, unknown>[])?.[0];
    const teams = (comp?.competitors as Record<string, unknown>[]) ?? [];
    const home = teams.find((t) => t.homeAway === "home");
    const away = teams.find((t) => t.homeAway === "away");
    const status = (ev.status as Record<string, unknown>)?.type as Record<string, unknown>;
    return {
      id: String(ev.id),
      name: String(ev.name ?? ""),
      shortName: String(ev.shortName ?? ""),
      status: String(status?.description ?? status?.state ?? ""),
      home: {
        abbr: String((home?.team as Record<string, unknown>)?.abbreviation ?? "LOC"),
        score: String(home?.score ?? "0"),
        logo: (home?.team as Record<string, Record<string, string>>)?.logo,
      },
      away: {
        abbr: String((away?.team as Record<string, unknown>)?.abbreviation ?? "VIS"),
        score: String(away?.score ?? "0"),
        logo: (away?.team as Record<string, Record<string, string>>)?.logo,
      },
    };
  });
}

export function eventToNbaSnapshot(
  ev: EspnNbaEvent,
  clock = "12:00",
  period = "Q1"
): NbaGameSnapshot {
  return {
    scoreHome: parseInt(ev.home.score, 10) || 0,
    scoreAway: parseInt(ev.away.score, 10) || 0,
    period,
    clock,
    homeAbbr: ev.home.abbr,
    awayAbbr: ev.away.abbr,
    homeLogo: ev.home.logo,
    awayLogo: ev.away.logo,
  };
}

export async function fetchNbaSummary(eventId: string) {
  const res = await fetch(`${NBA_SUMMARY}?event=${eventId}`, { next: { revalidate: 20 } });
  if (!res.ok) throw new Error("NBA summary fetch failed");
  return res.json();
}

export const NBA_MOCK_GAME: NbaGameSnapshot = {
  scoreHome: 98,
  scoreAway: 102,
  period: "Q4",
  clock: "2:34",
  shotClock: "14",
  homeAbbr: "LAL",
  awayAbbr: "BOS",
};
