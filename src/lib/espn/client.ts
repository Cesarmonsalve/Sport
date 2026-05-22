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
