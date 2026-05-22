import { NextResponse } from "next/server";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const segments = path?.join("/") ?? "";
  const { searchParams } = new URL(request.url);
  const target = `${ESPN_BASE}/${segments}?${searchParams.toString()}`;

  try {
    const res = await fetch(target, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=5, stale-while-revalidate=10",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "ESPN proxy failed", detail: String(e) },
      { status: 502 }
    );
  }
}
