import type { EspnCompetitor, EspnEvent, EspnTeamRef } from "@/types/espn";

/** Best ESPN team logo from competitor.team */
export function resolveTeamLogo(team?: EspnTeamRef): string | undefined {
  if (!team) return undefined;
  if (team.logo) return team.logo;
  const logos = team.logos;
  if (!logos?.length) return undefined;
  const dark =
    logos.find((l) => l.rel?.some((r) => /dark|default|full/i.test(r))) ??
    logos.find((l) => l.href?.includes("500")) ??
    logos[0];
  return dark?.href;
}

export function logosFromEvent(ev: EspnEvent): { home?: string; away?: string } {
  const comp = ev.competitions?.[0];
  const home = comp?.competitors?.find((c) => c.homeAway === "home");
  const away = comp?.competitors?.find((c) => c.homeAway === "away");
  return {
    home: resolveTeamLogo(home?.team),
    away: resolveTeamLogo(away?.team),
  };
}

export function logosFromCompetitors(comp?: {
  competitors?: EspnCompetitor[];
}): { home?: string; away?: string } {
  const home = comp?.competitors?.find((c) => c.homeAway === "home");
  const away = comp?.competitors?.find((c) => c.homeAway === "away");
  return {
    home: resolveTeamLogo(home?.team),
    away: resolveTeamLogo(away?.team),
  };
}

/** Preload logo URLs in browser */
export function preloadTeamLogos(urls: (string | undefined)[]) {
  if (typeof window === "undefined") return;
  for (const url of urls) {
    if (!url) continue;
    const img = new window.Image();
    img.src = url;
  }
}
