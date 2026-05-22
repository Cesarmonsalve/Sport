/** ESPN CDN headshot URL from athlete id */
export function espnHeadshotUrl(athleteId: string, sport: "nba" | "mlb" = "nba"): string {
  const league = sport === "nba" ? "nba" : "mlb";
  return `https://a.espncdn.com/i/headshots/${league}/players/full/${athleteId}.png`;
}

export function resolveHeadshot(
  athleteId: string | undefined,
  href?: string,
  sport: "nba" | "mlb" = "nba"
): string | undefined {
  if (href) return href;
  if (athleteId) return espnHeadshotUrl(athleteId, sport);
  return undefined;
}
