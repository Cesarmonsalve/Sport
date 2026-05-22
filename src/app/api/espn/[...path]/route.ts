import { NextResponse } from "next/server";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";
const CACHE_MS = 30_000;
const cache = new Map<string, { body: string; status: number; at: number }>();

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const segments = path?.join("/") ?? "";
  const { searchParams } = new URL(request.url);
  const key = `${segments}?${searchParams.toString()}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) {
    return new NextResponse(hit.body, {
      status: hit.status,
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "HIT",
        "Cache-Control": "public, max-age=30",
      },
    });
  }

  const target = `${ESPN_BASE}/${segments}?${searchParams.toString()}`;

  try {
    const res = await fetch(target, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });
    const body = await res.text();
    cache.set(key, { body, status: res.status, at: Date.now() });
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "MISS",
        "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "ESPN proxy failed", detail: String(e) },
      { status: 502 }
    );
  }
}
