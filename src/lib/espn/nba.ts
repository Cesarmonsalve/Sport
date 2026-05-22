import { formatTodayEspn } from "@/lib/utils";
import { espnFetch } from "@/lib/espn/client";
import { resolveHeadshot } from "@/lib/espn/headshot";
import { logosFromCompetitors, resolveTeamLogo } from "@/lib/espn/logos";
import type {
  EspnBoxscoreAthlete,
  EspnBoxscorePlayerGroup,
  EspnCompetition,
  EspnEvent,
  EspnScoreboardResponse,
  EspnSummaryResponse,
} from "@/types/espn";
import type { NbaGameSnapshot, NbaPlayer, NbaRotationEvent } from "@/types";

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
    logo: resolveTeamLogo(t),
  };
}

/** Stable slot key: id, else jersey+team+name */
export function playerSlotKey(p: NbaPlayer, teamAbbr: string): string {
  if (p.id && !p.id.startsWith("mock")) return `id:${p.id}`;
  return `slot:${teamAbbr}:${p.jersey ?? "?"}:${p.name}`;
}

export async function fetchNbaScoreboard(date?: string): Promise<EspnNbaEvent[]> {
  const dates = date ?? formatTodayEspn();
  const data = await espnFetch<EspnScoreboardResponse>("basketball/nba/scoreboard", {
    dates,
  });
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
  return espnFetch<EspnSummaryResponse>("basketball/nba/summary", { event: eventId });
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

function extractOnCourt(
  group: EspnBoxscorePlayerGroup | undefined,
  teamAbbr: string
): NbaPlayer[] {
  const statsBlock = group?.statistics?.[0];
  if (!statsBlock?.athletes?.length) return [];
  const names = statsBlock.names ?? [];
  const minsIdx = names.findIndex((n) => /min/i.test(n));

  const toPlayer = (row: EspnBoxscoreAthlete) =>
    athleteToPlayer(row, names, row.stats ?? []);

  const onCourt = statsBlock.athletes
    .filter((row) => row.athlete?.onCourt === true)
    .map(toPlayer)
    .filter((p): p is NbaPlayer => !!p);

  if (onCourt.length >= 5) return onCourt.slice(0, 5);

  const starters = statsBlock.athletes
    .filter((row) => row.starter && row.active !== false)
    .map(toPlayer)
    .filter((p): p is NbaPlayer => !!p);

  if (starters.length >= 5) return starters.slice(0, 5);

  const byMinutes = statsBlock.athletes
    .map((row) => {
      const p = toPlayer(row);
      if (!p) return null;
      const mins =
        minsIdx >= 0 ? parseFloat((row.stats ?? [])[minsIdx] ?? "0") || 0 : 0;
      return { p, mins };
    })
    .filter((x): x is { p: NbaPlayer; mins: number } => !!x)
    .sort((a, b) => b.mins - a.mins)
    .map((x) => x.p);

  const merged = [...onCourt, ...starters, ...byMinutes];
  const seen = new Set<string>();
  const out: NbaPlayer[] = [];
  for (const p of merged) {
    const key = playerSlotKey(p, teamAbbr);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
    if (out.length >= 5) break;
  }
  return out;
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

  const onCourtHome = extractOnCourt(homeGroup, base.homeAbbr);
  const onCourtAway = extractOnCourt(awayGroup, base.awayAbbr);

  const allHome = homeGroup?.statistics?.[0]?.athletes ?? [];
  const featured = [...allHome]
    .map((row) =>
      athleteToPlayer(row, homeGroup?.statistics?.[0]?.names ?? [], row.stats ?? [])
    )
    .filter((p): p is NbaPlayer => !!p)
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))[0];

  const foulsHome = statVal(comp, "home", "fouls") ?? statVal(comp, "home", "totalFouls");
  const foulsAway = statVal(comp, "away", "fouls") ?? statVal(comp, "away", "totalFouls");
  const logos = logosFromCompetitors(comp);

  return {
    ...base,
    homeLogo: logos.home ?? base.homeLogo,
    awayLogo: logos.away ?? base.awayLogo,
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

function matchPlayer(
  p: NbaPlayer,
  list: NbaPlayer[],
  abbr: string
): NbaPlayer | undefined {
  return (
    list.find((n) => n.id && p.id && n.id === p.id) ??
    list.find(
      (n) =>
        n.jersey &&
        p.jersey &&
        n.jersey === p.jersey &&
        n.name.split(" ").pop() === p.name.split(" ").pop()
    ) ??
    list.find((n) => playerSlotKey(n, abbr) === playerSlotKey(p, abbr))
  );
}

export function detectNbaRotation(
  prev: NbaGameSnapshot | null,
  next: NbaGameSnapshot
): NbaRotationEvent | undefined {
  if (!prev) return undefined;
  for (const side of ["home", "away"] as const) {
    const key = side === "home" ? "onCourtHome" : "onCourtAway";
    const abbr = side === "home" ? next.homeAbbr : next.awayAbbr;
    const oldList = prev[key] ?? [];
    const newList = next[key] ?? [];
    const oldKeys = new Set(oldList.map((p) => playerSlotKey(p, abbr)));
    const added = newList.filter((p) => !oldKeys.has(playerSlotKey(p, abbr)));
    const removed = oldList.filter(
      (p) => !matchPlayer(p, newList, abbr)
    );
    if (added.length && removed.length) {
      const evt = {
        team: side,
        playerIn: added[0],
        playerOut: removed[0],
        ts: Date.now(),
      };
      if (typeof window !== "undefined") {
        console.info(
          `[Stream Sports] Rotación ${abbr}: ${evt.playerOut.name} → ${evt.playerIn.name}`
        );
      }
      return evt;
    }
  }
  return undefined;
}

export function onCourtAthleteIds(game: NbaGameSnapshot): string {
  const home = (game.onCourtHome ?? []).map((p) => playerSlotKey(p, game.homeAbbr));
  const away = (game.onCourtAway ?? []).map((p) => playerSlotKey(p, game.awayAbbr));
  return [...home, ...away].sort().join(",");
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
