import "server-only";

export type LeadSource = {
  type: string;
  slug: string | null;
  title: string | null;
};

const LEAD_KIND = "lead-source";

export function encodeLeadSourceNote(source: LeadSource, reason?: string | null) {
  const payload: Record<string, unknown> = {
    kind: LEAD_KIND,
    type: source.type,
    slug: source.slug,
    title: source.title,
  };
  if (reason) payload.reason = reason;
  return JSON.stringify(payload);
}

export function parseLeadSourceNote(
  raw: string | null | undefined,
): { source: LeadSource | null; reason: string | null } {
  if (!raw) return { source: null, reason: null };
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed?.kind === LEAD_KIND) {
      return {
        source: {
          type: typeof parsed.type === "string" ? parsed.type : "site",
          slug: typeof parsed.slug === "string" ? parsed.slug : null,
          title: typeof parsed.title === "string" ? parsed.title : null,
        },
        reason: typeof parsed.reason === "string" ? parsed.reason : null,
      };
    }
  } catch {
    // plain text reason
  }
  return { source: null, reason: raw };
}

export function mergeUnsubscribeNote(
  existing: string | null | undefined,
  reason: string | null,
): string {
  const { source } = parseLeadSourceNote(existing);
  if (source) {
    return encodeLeadSourceNote(source, reason);
  }
  return reason?.slice(0, 280) || existing || "";
}

export function formatAdminSourceLabel(source: LeadSource | null | undefined) {
  if (!source?.type) return "Site";
  const title = source.title?.trim();
  const type = source.type;
  if (type === "blog" || type === "article") {
    return title ? `Blog · ${title}` : "Blog";
  }
  if (
    type === "whitepaper" ||
    type === "report" ||
    type === "case_study" ||
    type === "guide" ||
    type === "webinar"
  ) {
    const label =
      type === "whitepaper"
        ? "White paper"
        : type === "case_study"
          ? "Case study"
          : type.charAt(0).toUpperCase() + type.slice(1);
    return title ? `${label} · ${title}` : label;
  }
  if (type === "site") return "Site";
  return title ? `${type} · ${title}` : type;
}

export function resolveSubscribeSourceFromPath(
  pathname: string,
  meta?: { title?: string | null; resourceType?: string | null },
): LeadSource {
  const path = pathname || "/";
  const articleMatch = path.match(/^\/article\/([^/]+)\/?$/);
  if (articleMatch) {
    return {
      type: "blog",
      slug: decodeURIComponent(articleMatch[1]),
      title: meta?.title ?? null,
    };
  }
  if (path === "/" || path.startsWith("/#")) {
    return { type: "blog", slug: null, title: meta?.title ?? "Home" };
  }
  const resourceMatch = path.match(
    /^\/resources\/(white-papers|reports|case-studies|webinars|guides)\/([^/]+)\/?$/,
  );
  if (resourceMatch) {
    const seg = resourceMatch[1];
    const typeMap: Record<string, string> = {
      "white-papers": "whitepaper",
      reports: "report",
      "case-studies": "case_study",
      webinars: "webinar",
      guides: "guide",
    };
    return {
      type: meta?.resourceType || typeMap[seg] || "whitepaper",
      slug: decodeURIComponent(resourceMatch[2]),
      title: meta?.title ?? null,
    };
  }
  if (path.startsWith("/resources")) {
    return { type: "site", slug: null, title: "Resources" };
  }
  return { type: "site", slug: null, title: meta?.title ?? null };
}
