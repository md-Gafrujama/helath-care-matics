import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleBody from "@/components/ArticleBody";
import CoverImage from "@/components/CoverImage";
import JsonLd from "@/components/JsonLd";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import ArticleRelated from "@/components/article/ArticleRelated";
import SubscribePopup from "@/components/SubscribePopup";
import { getArticleToc } from "@/lib/article-toc";
import {
  getArticleBySlug,
  getArticlesByTopicSlug,
  getLatestArticles,
} from "@/lib/articles";
import { parseKeywordList, hydrateArticleSeo } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const seo = hydrateArticleSeo(article, article.topic?.name);
  const title = seo.metaTitle || article.title;
  const description = seo.metaDescription || article.dek;
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/article/${article.slug}`;
  const ogTitle = seo.ogTitle || article.title || title;
  const keywordList = [
    ...parseKeywordList(seo.keywords),
    seo.focusKeyword,
    article.topic?.name,
  ].filter((k, i, arr): k is string => Boolean(k) && arr.indexOf(k) === i);

  return {
    title,
    description,
    keywords: keywordList.length ? keywordList : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: "HealthMatics",
      locale: "en_US",
      type: "article",
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at,
      authors: [article.author_name],
      section: article.topic?.name,
      tags: keywordList.length ? keywordList : undefined,
      images: article.cover_image_url
        ? [
            {
              url: article.cover_image_url,
              alt: article.cover_image_alt || article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: article.cover_image_url ? [article.cover_image_url] : undefined,
    },
  };
}

function formatDateLong(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, latest] = await Promise.all([
    article.topic
      ? getArticlesByTopicSlug(article.topic.slug, 5).then((rows) =>
          rows.filter((a) => a.id !== article.id),
        )
      : Promise.resolve([]),
    getLatestArticles(6),
  ]);

  const moreInTopic = related.slice(0, 4);
  const siteUrl = getSiteUrl();
  const seo = hydrateArticleSeo(article, article.topic?.name);
  const topicSlug = article.topic?.slug ?? "";
  const toc = getArticleToc(article.body_json);
  const showSidebar = Boolean(article.topic) || toc.length > 0;

  return (
    <>
      <SiteHeader currentTopicSlug={topicSlug || undefined} />
      <SubscribePopup
        articleId={article.id}
        articleSlug={article.slug}
        articleTitle={article.title}
        topicId={article.topic?.id}
        topicSlug={article.topic?.slug}
        topicName={article.topic?.name}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: seo.metaDescription || article.dek,
          abstract: seo.geoSummary || article.dek,
          keywords: seo.keywords,
          image: article.cover_image_url ? [article.cover_image_url] : undefined,
          datePublished: article.published_at,
          dateModified: article.updated_at,
          author: { "@type": "Organization", name: article.author_name },
          publisher: {
            "@type": "Organization",
            name: "HealthMatics",
          },
          mainEntityOfPage: `${siteUrl}/article/${article.slug}`,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            article.topic && {
              "@type": "ListItem",
              position: 2,
              name: article.topic.name,
              item: `${siteUrl}/topic/${article.topic.slug}`,
            },
            {
              "@type": "ListItem",
              position: article.topic ? 3 : 2,
              name: article.title,
              item: `${siteUrl}/article/${article.slug}`,
            },
          ].filter(Boolean),
        }}
      />

      <article
        className="article-page"
        data-topic={topicSlug || undefined}
      >
        <div className="wrap article-page-inner">
          <nav className="art-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="art-crumbs-sep" aria-hidden>/</span>
            {article.topic && (
              <>
                <Link href={`/topic/${article.topic.slug}`}>
                  {article.topic.name}
                </Link>
                <span className="art-crumbs-sep" aria-hidden>/</span>
              </>
            )}
            <span className="art-crumbs-current">Article</span>
          </nav>

          <div
            className={`art-layout${showSidebar ? "" : " art-layout--solo"}`}
          >
            <div className="art-main">
              <header className="art-masthead">
                {article.topic ? (
                  <Link
                    href={`/topic/${article.topic.slug}`}
                    className="art-topic-pill"
                  >
                    {article.topic.name}
                  </Link>
                ) : (
                  <span className="art-topic-pill art-topic-pill--muted">
                    Story
                  </span>
                )}
                <h1>{article.title}</h1>
                <p className="art-dek">{article.dek}</p>
                <div className="art-meta-bar">
                  <div className="art-author">
                    <span className="art-avatar" aria-hidden>
                      {article.author_name.charAt(0)}
                    </span>
                    <div>
                      <strong>{article.author_name}</strong>
                      <span>
                        {formatDateLong(article.published_at)}
                        <span className="art-dot" aria-hidden>
                          ·
                        </span>
                        {article.read_time_minutes ?? 5} min read
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              <figure className="art-cover-wrap">
                <div className="art-cover">
                  <CoverImage
                    src={article.cover_image_url}
                    alt={article.cover_image_alt}
                    seed={article.slug}
                    label={article.topic?.name}
                    priority
                    sizes="(min-width: 1000px) 720px, 100vw"
                  />
                </div>
                {(article.cover_image_credit || article.cover_image_alt) && (
                  <figcaption className="art-cover-credit">
                    {article.cover_image_credit ? (
                      article.cover_image_credit_url ? (
                        <>
                          Photo:{" "}
                          <a
                            href={article.cover_image_credit_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {article.cover_image_credit}
                          </a>
                        </>
                      ) : (
                        <>Photo: {article.cover_image_credit}</>
                      )
                    ) : (
                      article.cover_image_alt
                    )}
                  </figcaption>
                )}
              </figure>

              <div className="art-body-wrap">
                <ArticleBody body={article.body_json} />
              </div>

              {article.topic && (
                <footer className="art-end">
                  <Link
                    href={`/topic/${article.topic.slug}`}
                    className="art-end-cta"
                  >
                    More in {article.topic.name}
                    <span aria-hidden>→</span>
                  </Link>
                </footer>
              )}
            </div>

            {showSidebar && (
              <ArticleSidebar
                topicName={article.topic?.name}
                topicSlug={article.topic?.slug}
                stories={moreInTopic}
                toc={toc}
              />
            )}
          </div>
        </div>
      </article>

      <ArticleRelated
        articles={latest.filter((a) => a.id !== article.id).slice(0, 3)}
      />
      <SiteFooter />
    </>
  );
}
