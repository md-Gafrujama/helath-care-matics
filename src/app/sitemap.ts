import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getNavTopics, HR_TOPIC_SLUGS } from "@/lib/topic-config";
import { createPublicClient } from "@/lib/supabase/public";
import { isMissingSchemaError } from "@/lib/db-errors";

/** Rebuild periodically; publish paths also call revalidateSitemap(). */
export const revalidate = 60;

function lastMod(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const nowIso = new Date().toISOString();
  const supabase = createPublicClient();

  const [
    { data: articles, error: articlesError },
    { data: topics, error: topicsError },
  ] = await Promise.all([
    supabase
      .from("articles")
      .select("slug, updated_at, published_at, topic:topics(slug)")
      .eq("status", "published")
      .not("published_at", "is", null)
      .lte("published_at", nowIso)
      .order("published_at", { ascending: false }),
    supabase.from("topics").select("slug").order("name"),
  ]);

  const publishedRaw = isMissingSchemaError(articlesError) ? [] : (articles ?? []);
  const published = publishedRaw.filter((a) => {
    const topic = Array.isArray(a.topic) ? a.topic[0] : a.topic;
    const slug =
      topic && typeof topic === "object" && "slug" in topic
        ? String((topic as { slug?: string }).slug ?? "")
        : "";
    return !slug || HR_TOPIC_SLUGS.has(slug);
  });

  const topicRows = isMissingSchemaError(topicsError)
    ? getNavTopics().map((t) => ({ slug: t.slug }))
    : (topics ?? []).filter((t) => HR_TOPIC_SLUGS.has(t.slug));

  const newest =
    published[0]?.updated_at ?? published[0]?.published_at ?? nowIso;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: site,
      lastModified: lastMod(newest) ?? new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${site}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${site}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${site}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const topicPages: MetadataRoute.Sitemap = topicRows.map((t) => {
    const topicArticles = published.filter((a) => {
      const topic = Array.isArray(a.topic) ? a.topic[0] : a.topic;
      return (
        topic &&
        typeof topic === "object" &&
        "slug" in topic &&
        (topic as { slug?: string }).slug === t.slug
      );
    });
    const topicNewest =
      topicArticles[0]?.updated_at ??
      topicArticles[0]?.published_at ??
      newest;

    return {
      url: `${site}/topic/${t.slug}`,
      lastModified: lastMod(topicNewest) ?? new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
  });

  const articlePages: MetadataRoute.Sitemap = published.map((a) => {
    const publishedAt = lastMod(a.published_at);
    const ageMs = publishedAt ? Date.now() - publishedAt.getTime() : Infinity;
    const fresh = ageMs < 1000 * 60 * 60 * 24 * 7;

    return {
      url: `${site}/article/${a.slug}`,
      lastModified: lastMod(a.updated_at) ?? publishedAt ?? new Date(),
      changeFrequency: (fresh ? "daily" : "weekly") as "daily" | "weekly",
      priority: fresh ? 0.9 : 0.7,
    };
  });

  return [...staticPages, ...topicPages, ...articlePages];
}
