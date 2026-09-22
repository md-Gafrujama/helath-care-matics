import "server-only";
export type { IngestResult } from "@/lib/site-analytics/prepare";
export { prepareSiteAnalyticsEvent } from "@/lib/site-analytics/prepare";
export { persistSiteAnalyticsRow } from "@/lib/site-analytics/persist";

/** Sync helper (tests / fallback). Prefer prepare + after(persist). */
export async function ingestSiteAnalyticsEvent(
  request: Request,
  body: Record<string, unknown>,
) {
  const { prepareSiteAnalyticsEvent } = await import(
    "@/lib/site-analytics/prepare"
  );
  const prepared = prepareSiteAnalyticsEvent(request, body);
  if (!prepared.ok) return prepared;
  const { persistSiteAnalyticsRow } = await import(
    "@/lib/site-analytics/persist"
  );
  await persistSiteAnalyticsRow(prepared);
  return { ok: true as const };
}
