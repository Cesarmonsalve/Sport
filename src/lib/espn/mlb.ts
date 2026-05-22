import { formatTodayEspn } from "@/lib/utils";
import { resolveHeadshot } from "@/lib/espn/headshot";
import type {
  EspnAthlete,
  EspnCompetition,
  EspnEvent,
  EspnScoreboardResponse,
  EspnSummaryResponse,
} from "@/types/espn";
import type { MlbGameSnapshot, MlbLineScore, MlbPlayItem, MlbPlayer } from "@/types";

const MLB_SCOREBOARD =
  "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
const MLB_SUMMARY =
  "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary";

export interface EspnMlbEvent {
  id: string;
  name: string;
  shortName: string;
  status: string;
  state: string;
  home: { abbr: string; score: string; logo?: string };
  away: { abbr: string; score: string; logo?: string };
}

function parseSide(ev: EspnEvent, side: "home" | "away") {
  const comp = ev.competitions?.[0];
  const team = comp?.competitors?.find((c) => c.homeAway === side);
  const t = team?.team;
  return {
    abbr: t?.abbreviation ?? (side === "home" ? "LOC" : "VIS"),
    score: String(team?.score ?? "0"),
    logo: t?.logo,
  };
}

export async function fetchMlbScoreboard(date?: string): Promise<EspnMlbEvent[]> {
  const dates = date ?? formatTodayEspn();
  const res = await fetch(`${MLB_SCOREBOARD}?dates=${dates}`, { cache: "no-store" });
  if (!res.ok) throw new Error("MLB scoreboard fetch failed");
  const data = (await res.json()) as EspnScoreboardResponse;
  return (data.events ?? []).map((ev) => ({
    id: String(ev.id ?? ""),
    name: String(ev.name ?? ""),
    shortName: String(ev.shortName ?? ""),
    status: String(ev.status?.type?.description ?? ""),
    state: String(ev.status?.type?.state ?? "pre"),
    home: parseSide(ev, "home"),
    away: parseSide(ev, "away"),
  }));
}

export function eventToMlbSnapshot(ev: EspnMlbEvent): MlbGameSnapshot {
  return {
    scoreHome: parseInt(ev.home.score, 10) || 0,
    scoreAway: parseInt(ev.away.score, 10) || 0,
    inning: "1",
    inningHalf: "Top",
    homeAbbr: ev.home.abbr,
    awayAbbr: ev.away.abbr,
    homeLogo: ev.home.logo,
    awayLogo: ev.away.logo,
  };
}

export async function fetchMlbSummary(eventId: string): Promise<EspnSummaryResponse> {
  const res = await fetch(`${MLB_SUMMARY}?event=${eventId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("MLB summary fetch failed");
  return res.json() as Promise<EspnSummaryResponse>;
}

function athleteToMlbPlayer(a?: EspnAthlete): MlbPlayer | undefined {
  if (!a?.id) return undefined;
  return {
    id: String(a.id),
    name: a.displayName ?? a.shortName ?? "—",
    jersey: a.jersey,
    headshot: resolveHeadshot(String(a.id), a.headshot?.href, "mlb"),
    position: a.position?.abbreviation,
  };
}

function parseLineScore(comp?: EspnCompetition): MlbLineScore | undefined {
  const teams = comp?.competitors ?? [];
  const away = teams.find((t) => t.homeAway === "away");
  const home = teams.find((t) => t.homeAway === "home");
  const awayRuns = away?.linescores?.map((l) => Number(l.value ?? l.displayValue ?? 0)) ?? [];
  const homeRuns = home?.linescores?.map((l) => Number(l.value ?? l.displayValue ?? 0)) ?? [];
  if (!awayRuns.length && !homeRuns.length) return undefined;
  const max = Math.max(awayRuns.length, homeRuns.length, 9);
  const labels = Array.from({ length: max }, (_, i) => String(i + 1));
  return {
    away: awayRuns,
    home: homeRuns,
    inningLabels: labels,
  };
}

function rosterFromBox(
  data: EspnSummaryResponse,
  abbr: string
): MlbPlayer[] {
  const group = data.boxscore?.players?.find((g) => g.team?.abbreviation === abbr);
  const athletes = group?.statistics?.[0]?.athletes ?? [];
  const names = group?.statistics?.[0]?.names ?? [];
  const out: MlbPlayer[] = [];
  for (const row of athletes.slice(0, 12)) {
    const a = row.athlete;
    if (!a?.id) continue;
    const avgIdx = names.indexOf("AVG");
    out.push({
      id: String(a.id),
      name: a.displayName ?? "—",
      jersey: a.jersey,
      headshot: resolveHeadshot(String(a.id), a.headshot?.href, "mlb"),
      position: a.position?.abbreviation,
      avg: avgIdx >= 0 ? row.stats?.[avgIdx] : undefined,
    });
  }
  return out;
}

export function parseMlbSummary(
  data: EspnSummaryResponse,
  base: MlbGameSnapshot
): MlbGameSnapshot {
  const comp = data.header?.competitions?.[0];
  const sit = data.situation ?? comp?.situation;
  const period = sit?.period ?? comp?.status?.period;
  const half =
    sit?.possession === "home" || comp?.status?.type?.shortDetail?.toLowerCase().includes("bot")
      ? "Bot"
      : "Top";
  const inning = period != null ? String(period) : base.inning;

  const plays: MlbPlayItem[] = (data.plays?.items ?? [])
    .slice(-5)
    .reverse()
    .map((p) => ({
      text: p.text ?? "",
      inning: p.period?.number != null ? `Inn ${p.period.number}` : undefined,
    }))
    .filter((p) => p.text);

  return {
    ...base,
    inning,
    inningHalf: half,
    linescore: parseLineScore(comp) ?? base.linescore,
    balls: sit?.balls ?? base.balls,
    strikes: sit?.strikes ?? base.strikes,
    outs: sit?.outs ?? base.outs,
    bases: {
      first: !!(sit?.onFirst ?? base.bases?.first),
      second: !!(sit?.onSecond ?? base.bases?.second),
      third: !!(sit?.onThird ?? base.bases?.third),
    },
    batter: athleteToMlbPlayer(sit?.batter) ?? base.batter,
    pitcher: athleteToMlbPlayer(sit?.pitcher) ?? base.pitcher,
    rosterAway: rosterFromBox(data, base.awayAbbr) || base.rosterAway,
    rosterHome: rosterFromBox(data, base.homeAbbr) || base.rosterHome,
    lastPlays: plays.length ? plays : base.lastPlays,
  };
}

export const MLB_MOCK_GAME: MlbGameSnapshot = {
  scoreHome: 4,
  scoreAway: 3,
  inning: "7",
  inningHalf: "Bot",
  homeAbbr: "DET",
  awayAbbr: "NYY",
  balls: 2,
  strikes: 1,
  outs: 1,
  bases: { first: true, second: false, third: true },
  batter: {
    id: "33192",
    name: "Aaron Judge",
    jersey: "99",
    headshot: resolveHeadshot("33192", undefined, "mlb"),
    avg: ".298",
  },
  pitcher: {
    id: "34858",
    name: "Tarik Skubal",
    jersey: "73",
    headshot: resolveHeadshot("34858", undefined, "mlb"),
  },
  linescore: {
    away: [0, 1, 0, 2, 0, 0, 0],
    home: [1, 0, 2, 0, 1, 0, 0],
    inningLabels: ["1", "2", "3", "4", "5", "6", "7"],
  },
  rosterAway: mockRoster("NYY"),
  rosterHome: mockRoster("DET"),
  lastPlays: [
    { text: "Judge flies out to center.", inning: "Inn 7" },
    { text: "Stanton singles to left.", inning: "Inn 7" },
    { text: "Soto walks.", inning: "Inn 6" },
  ],
};

function mockRoster(abbr: string): MlbPlayer[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `${abbr}-${i}`,
    name: `${abbr} Player ${i + 1}`,
    jersey: String(i + 1),
    position: i === 0 ? "P" : "OF",
    avg: ".2" + (50 + i),
  }));
}
