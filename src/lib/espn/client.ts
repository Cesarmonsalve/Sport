/** Client fetch via Next.js API proxy (avoids CORS) */
export async function espnFetch<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const url = `/api/espn/${path}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`ESPN fetch failed: ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchStandings(sport: string, league: string) {
  return espnFetch<unknown>(`${sport}/${league}/standings`);
}

export async function fetchLeaders(sport: string, league: string) {
  return espnFetch<unknown>(`${sport}/${league}/leaders`);
}

export async function fetchNews(sport: string, league: string, limit = 5) {
  return espnFetch<unknown>(`${sport}/${league}/news`, { limit: String(limit) });
}

export async function fetchTeamSchedule(
  sport: string,
  league: string,
  teamId: string
) {
  return espnFetch<unknown>(`${sport}/${league}/teams/${teamId}/schedule`);
}
