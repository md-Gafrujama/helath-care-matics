import { after } from "next/server";
import { NextResponse } from "next/server";
import { prepareSiteAnalyticsEvent } from "@/lib/site-analytics/prepare";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Hot path: validate only, return 204 immediately.
 * DB insert runs in after() via dynamic import (no Supabase on critical path).
 * Target: ~sub-60ms response once the isolate is warm.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }

  const prepared = prepareSiteAnalyticsEvent(request, body);
  if (!prepared.ok) {
    return NextResponse.json(
      { detail: prepared.detail },
      { status: prepared.status },
    );
  }

  after(async () => {
    const { persistSiteAnalyticsRow } = await import(
      "@/lib/site-analytics/persist"
    );
    await persistSiteAnalyticsRow(prepared);
  });

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
