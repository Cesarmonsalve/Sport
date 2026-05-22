import { resolveHeadshot } from "@/lib/espn/headshot";
import type {
  EspnBoxscoreAthlete,
  EspnBoxscorePlayerGroup,
  EspnSummaryResponse,
} from "@/types/espn";
import type { GalleryPlayer, MlbGameSnapshot, NbaGameSnapshot, Sport } from "@/types";

function rowToGallery(
  row: EspnBoxscoreAthlete,
  team: "home" | "away",
  teamAbbr: string,
  sport: Sport,
  statNames: string[],
  stats: string[]
): GalleryPlayer | null {
  const a = row.athlete;
  if (!a?.id) return null;
  const idx = (n: string) => statNames.indexOf(n);
  const val = (n: string) => {
    const i = idx(n);
    return i >= 0 ? parseInt(stats[i] ?? "0", 10) || 0 : 0;
  };
  return {
    id: String(a.id),
    name: a.displayName ?? a.shortName ?? "—",
    jersey: a.jersey,
    headshot: resolveHeadshot(String(a.id), a.headshot?.href, sport === "nba" ? "nba" : "mlb"),
    team,
    teamAbbr,
    position: a.position?.abbreviation,
    points: sport === "nba" ? val("PTS") || val("points") : undefined,
    rebounds: sport === "nba" ? val("REB") || val("rebounds") : undefined,
    assists: sport === "nba" ? val("AST") || val("assists") : undefined,
    avg: sport === "mlb" ? stats[idx("AVG")] : undefined,
  };
}

function playersFromGroup(
  group: EspnBoxscorePlayerGroup | undefined,
  team: "home" | "away",
  teamAbbr: string,
  sport: Sport
): GalleryPlayer[] {
  const block = group?.statistics?.[0];
  if (!block?.athletes?.length) return [];
  const names = block.names ?? [];
  const seen = new Set<string>();
  const out: GalleryPlayer[] = [];
  for (const row of block.athletes) {
    const p = rowToGallery(row, team, teamAbbr, sport, names, row.stats ?? []);
    if (!p || seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

export function extractGalleryFromSummary(
  data: EspnSummaryResponse,
  homeAbbr: string,
  awayAbbr: string,
  sport: Sport
): GalleryPlayer[] {
  const groups = data.boxscore?.players ?? [];
  const homeGroup = groups.find((g) => g.team?.abbreviation === homeAbbr) ?? groups[1];
  const awayGroup = groups.find((g) => g.team?.abbreviation === awayAbbr) ?? groups[0];
  return [
    ...playersFromGroup(homeGroup, "home", homeAbbr, sport),
    ...playersFromGroup(awayGroup, "away", awayAbbr, sport),
  ];
}

export function galleryFromNbaGame(game: NbaGameSnapshot): GalleryPlayer[] {
  const map = (list: typeof game.onCourtHome, team: "home" | "away", abbr: string) =>
    (list ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      jersey: p.jersey,
      headshot: p.headshot,
      team,
      teamAbbr: abbr,
      position: p.position,
      points: p.points,
      rebounds: p.rebounds,
      assists: p.assists,
    }));
  return [
    ...map(game.onCourtHome, "home", game.homeAbbr),
    ...map(game.onCourtAway, "away", game.awayAbbr),
    ...(game.featuredPlayer
      ? [
          {
            id: game.featuredPlayer.id,
            name: game.featuredPlayer.name,
            jersey: game.featuredPlayer.jersey,
            headshot: game.featuredPlayer.headshot,
            team: "home" as const,
            teamAbbr: game.homeAbbr,
            position: game.featuredPlayer.position,
            points: game.featuredPlayer.points,
            rebounds: game.featuredPlayer.rebounds,
            assists: game.featuredPlayer.assists,
          },
        ]
      : []),
  ];
}

export function galleryFromMlbGame(game: MlbGameSnapshot): GalleryPlayer[] {
  const map = (list: typeof game.rosterHome, team: "home" | "away", abbr: string) =>
    (list ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      jersey: p.jersey,
      headshot: p.headshot,
      team,
      teamAbbr: abbr,
      position: p.position,
      avg: p.avg,
    }));
  const all = [
    ...map(game.rosterHome, "home", game.homeAbbr),
    ...map(game.rosterAway, "away", game.awayAbbr),
  ];
  if (game.batter) {
    all.push({
      id: game.batter.id,
      name: game.batter.name,
      jersey: game.batter.jersey,
      headshot: game.batter.headshot,
      team: "away",
      teamAbbr: game.awayAbbr,
      position: game.batter.position,
      avg: game.batter.avg,
    });
  }
  if (game.pitcher) {
    all.push({
      id: game.pitcher.id,
      name: game.pitcher.name,
      jersey: game.pitcher.jersey,
      headshot: game.pitcher.headshot,
      team: "home",
      teamAbbr: game.homeAbbr,
      position: game.pitcher.position,
      avg: game.pitcher.avg,
    });
  }
  const seen = new Set<string>();
  return all.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}
