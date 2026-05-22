import { formatTodayEspn } from "@/lib/utils";
import { resolveHeadshot } from "@/lib/espn/headshot";
import type {
  EspnBoxscoreAthlete,
  EspnBoxscorePlayerGroup,
  EspnCompetition,
  EspnEvent,
  EspnScoreboardResponse,
  EspnSummaryResponse,
} from "@/types/espn";
import type { NbaGameSnapshot, NbaPlayer, NbaRotationEvent } from "@/types";

const NBA_SCOREBOARD =
  "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";
const NBA_SUMMARY =
  "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary";

export interface EspnNbaEvent {
  id: string;
  name: string;
  shortName: string;
  status: string;
  state: string;
  home: { abbr: string; score: string; logo?: string };
  away: { abbr: string; score: string; logo?: string };
}

function parseCompetitor(ev: EspnEvent, side: "home" | "away") {
  const comp = ev.competitions?.[0];
  const team = comp?.competitors?.find((c) => c.homeAway === side);
  const t = team?.team;
  return {
    abbr: t?.abbreviation ?? (side === "home" ? "LOC" : "VIS"),
    score: String(team?.score ?? "0"),
    logo: t?.logo,
  };
}

export async function fetchNbaScoreboard(date?: string): Promise<EspnNbaEvent[]> {
  const dates = date ?? formatTodayEspn();
  const res = await fetch(`${NBA_SCOREBOARD}?dates=${dates}`, { cache: "no-store" });
  if (!res.ok) throw new Error("NBA scoreboard fetch failed");
  const data = (await res.json()) as EspnScoreboardResponse;
  return (data.events ?? []).map((ev) => ({
    id: String(ev.id ?? ""),
    name: String(ev.name ?? ""),
    shortName: String(ev.shortName ?? ""),
    status: String(ev.status?.type?.description ?? ""),
    state: String(ev.status?.type?.state ?? "pre"),
    home: parseCompetitor(ev, "home"),
    away: parseCompetitor(ev, "away"),
  }));
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

export async function fetchNbaSummary(eventId: string): Promise<EspnSummaryResponse> {
  const res = await fetch(`${NBA_SUMMARY}?event=${eventId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("NBA summary fetch failed");
  return res.json() as Promise<EspnSummaryResponse>;
}

function athleteToPlayer(row: EspnBoxscoreAthlete, statNames: string[], stats: string[]): NbaPlayer | null {
  const a = row.athlete;
  if (!a?.id) return null;
  const idx = (name: string) => statNames.indexOf(name);
  const val = (name: string) => {
    const i = idx(name);
    return i >= 0 ? parseInt(stats[i] ?? "0", 10) || 0 : 0;
  };
  return {
    id: String(a.id),
    name: a.displayName ?? a.shortName ?? "—",
    jersey: a.jersey,
    headshot: resolveHeadshot(String(a.id), a.headshot?.href, "nba"),
    position: a.position?.abbreviation,
    points: val("PTS") || val("points"),
    rebounds: val("REB") || val("rebounds"),
    assists: val("AST") || val("assists"),
  };
}

function extractOnCourt(group: EspnBoxscorePlayerGroup | undefined): NbaPlayer[] {
  const statsBlock = group?.statistics?.[0];
  if (!statsBlock?.athletes?.length) return [];
  const names = statsBlock.names ?? [];
  const court: NbaPlayer[] = [];
  for (const row of statsBlock.athletes) {
    if (row.athlete?.onCourt || row.starter) {
      const p = athleteToPlayer(row, names, row.stats ?? []);
      if (p) court.push(p);
    }
  }
  if (court.length >= 5) return court.slice(0, 5);
  const all = statsBlock.athletes
    .map((row) => athleteToPlayer(row, names, row.stats ?? []))
    .filter((p): p is NbaPlayer => !!p);
  return all.slice(0, 5);
}

function periodLabel(n?: number): string {
  if (!n) return "Q1";
  if (n <= 4) return `Q${n}`;
  return `OT${n - 4}`;
}

function statVal(
  comp: EspnCompetition | undefined,
  side: "home" | "away",
  name: string
): number | undefined {
  const team = comp?.competitors?.find((c) => c.homeAway === side);
  const stat = team?.statistics?.find((s) => s.name === name || s.name === name.toUpperCase());
  if (stat?.value != null) return Number(stat.value);
  const dv = stat?.displayValue;
  return dv != null ? parseInt(String(dv), 10) : undefined;
}

export function parseNbaSummary(
  data: EspnSummaryResponse,
  base: NbaGameSnapshot
): NbaGameSnapshot {
  const comp = data.header?.competitions?.[0] ?? data.situation as unknown as EspnCompetition;
  const status = comp?.status ?? (comp as { status?: EspnCompetition["status"] })?.status;
  const sit = data.situation ?? comp?.situation;
  const clock = sit?.displayClock ?? status?.displayClock ?? base.clock;
  const period = periodLabel(sit?.period ?? status?.period);
  const shotClock = sit?.shotClock;

  const groups = data.boxscore?.players ?? [];
  const homeGroup = groups.find((g) => g.team?.abbreviation === base.homeAbbr) ?? groups[1];
  const awayGroup = groups.find((g) => g.team?.abbreviation === base.awayAbbr) ?? groups[0];

  const onCourtHome = extractOnCourt(homeGroup);
  const onCourtAway = extractOnCourt(awayGroup);

  const allHome = homeGroup?.statistics?.[0]?.athletes ?? [];
  const featured = [...allHome]
    .map((row) =>
      athleteToPlayer(row, homeGroup?.statistics?.[0]?.names ?? [], row.stats ?? [])
    )
    .filter((p): p is NbaPlayer => !!p)
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))[0];

  const foulsHome = statVal(comp, "home", "fouls") ?? statVal(comp, "home", "totalFouls");
  const foulsAway = statVal(comp, "away", "fouls") ?? statVal(comp, "away", "totalFouls");

  return {
    ...base,
    clock: clock || base.clock,
    period,
    shotClock: shotClock ?? base.shotClock,
    onCourtHome: onCourtHome.length ? onCourtHome : base.onCourtHome,
    onCourtAway: onCourtAway.length ? onCourtAway : base.onCourtAway,
    featuredPlayer: featured ?? base.featuredPlayer,
    foulsHome: foulsHome ?? base.foulsHome,
    foulsAway: foulsAway ?? base.foulsAway,
    bonusHome: (foulsAway ?? 0) >= 5,
    bonusAway: (foulsHome ?? 0) >= 5,
  };
}

export function detectNbaRotation(
  prev: NbaGameSnapshot | null,
  next: NbaGameSnapshot
): NbaRotationEvent | undefined {
  if (!prev) return undefined;
  for (const side of ["home", "away"] as const) {
    const key = side === "home" ? "onCourtHome" : "onCourtAway";
    const oldIds = new Set((prev[key] ?? []).map((p) => p.id));
    const newList = next[key] ?? [];
    const added = newList.filter((p) => !oldIds.has(p.id));
    const removed = (prev[key] ?? []).filter((p) => !newList.some((n) => n.id === p.id));
    if (added.length && removed.length) {
      return {
        team: side,
        playerIn: added[0],
        playerOut: removed[0],
        ts: Date.now(),
      };
    }
  }
  return undefined;
}

export function onCourtAthleteIds(game: NbaGameSnapshot): string {
  const ids = [...(game.onCourtHome ?? []), ...(game.onCourtAway ?? [])]
    .map((p) => p.id)
    .sort();
  return ids.join(",");
}

export const NBA_MOCK_GAME: NbaGameSnapshot = {
  scoreHome: 98,
  scoreAway: 102,
  period: "Q4",
  clock: "2:34",
  shotClock: "14",
  homeAbbr: "LAL",
  awayAbbr: "BOS",
  foulsHome: 4,
  foulsAway: 5,
  bonusHome: false,
  bonusAway: true,
  featuredPlayer: {
    id: "1966",
    name: "LeBron James",
    jersey: "23",
    headshot: espnHeadshot("1966"),
    points: 28,
    rebounds: 8,
    assists: 6,
    position: "F",
  },
  onCourtHome: mockQuintet("LAL", ["1966", "2580", "4066", "6580", "2995"]),
  onCourtAway: mockQuintet("BOS", ["4065648", "3078576", "4397421", "4396993", "4066354"]),
};

function espnHeadshot(id: string) {
  return resolveHeadshot(id, undefined, "nba")!;
}

function mockQuintet(abbr: string, ids: string[]): NbaPlayer[] {
  const names: Record<string, string> = {
    "1966": "LeBron James",
    "2580": "Anthony Davis",
    "4066": "D'Angelo Russell",
    "6580": "Austin Reaves",
    "2995": "Rui Hachimura",
    "4065648": "Jayson Tatum",
    "3078576": "Jaylen Brown",
    "4397421": "Jrue Holiday",
    "4396993": "Kristaps Porzingis",
    "4066354": "Derrick White",
  };
  return ids.map((id, i) => ({
    id,
    name: names[id] ?? `Player ${i + 1}`,
    jersey: String(20 + i),
    headshot: espnHeadshot(id),
    points: 12 - i,
    rebounds: 5,
    assists: 3,
    position: "G",
  }));
}
