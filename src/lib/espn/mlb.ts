import { formatTodayEspn } from "@/lib/utils";
import type { MlbGameSnapshot } from "@/types";

const MLB_SCOREBOARD =
  "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";

export interface EspnMlbEvent {
  id: string;
  name: string;
  shortName: string;
  status: string;
  home: { abbr: string; score: string };
  away: { abbr: string; score: string };
}

export async function fetchMlbScoreboard(date?: string): Promise<EspnMlbEvent[]> {
  const dates = date ?? formatTodayEspn();
  const res = await fetch(`${MLB_SCOREBOARD}?dates=${dates}`, { next: { revalidate: 15 } });
  if (!res.ok) throw new Error("MLB scoreboard fetch failed");
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
      status: String(status?.description ?? ""),
      home: {
        abbr: String((home?.team as Record<string, unknown>)?.abbreviation ?? "LOC"),
        score: String(home?.score ?? "0"),
      },
      away: {
        abbr: String((away?.team as Record<string, unknown>)?.abbreviation ?? "VIS"),
        score: String(away?.score ?? "0"),
      },
    };
  });
}

export function eventToMlbSnapshot(ev: EspnMlbEvent): MlbGameSnapshot {
  return {
    scoreHome: parseInt(ev.home.score, 10) || 0,
    scoreAway: parseInt(ev.away.score, 10) || 0,
    inning: "5",
    inningHalf: "Top",
    homeAbbr: ev.home.abbr,
    awayAbbr: ev.away.abbr,
  };
}

export const MLB_MOCK_GAME: MlbGameSnapshot = {
  scoreHome: 4,
  scoreAway: 3,
  inning: "7",
  inningHalf: "Bot",
  homeAbbr: "DET",
  awayAbbr: "NYY",
};
