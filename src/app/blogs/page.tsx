import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import StoryCard from "@/components/StoryCard";
import ResourcesNav from "@/components/resources/ResourcesNav";
import { getLatestArticles } from "@/lib/articles";
import { getNavTopics } from "@/lib/topic-config";
import { articlesToStories } from "@/lib/topic-stories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs — HealthMatics",
  description:
    "All HealthMatics blogs and news stories — healthcare intelligence for decision makers.",
};

export default async function BlogsLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic: topicFilter } = await searchParams;
  const topics = getNavTopics().filter((t) => t.slug !== "playbooks");
  const articles = await getLatestArticles(200);
  const filtered = topicFilter
    ? articles.filter((a) => a.topic?.slug === topicFilter)
    : articles;
  const stories = articlesToStories(filtered);
  const activeTopic = topics.find((t) => t.slug === topicFilter);

  return (
    <>
      <SiteHeader />
      <main className="blogs-page">
        <section className="blogs-hero">
          <div className="blogs-hero-atmosphere" aria-hidden>
            <span className="blogs-hero-orb blogs-hero-orb--a" />
            <span className="blogs-hero-orb blogs-hero-orb--b" />
            <span className="blogs-hero-grid" />
          </div>
          <div className="wrap blogs-hero-layout">
            <div className="blogs-hero-copy">
              <nav className="blogs-crumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span aria-hidden>/</span>
                <Link href="/resources">Resources</Link>
                <span aria-hidden>/</span>
                <span>{activeTopic ? activeTopic.crumb : "Blogs"}</span>
              </nav>

              <div className="blogs-brand-row">
                <p className="blogs-brand">
                  <span className="blogs-brand-mark" aria-hidden>
                    H
                  </span>
                  <span className="blogs-brand-name">
                    Health<em>Matics</em>
                  </span>
                </p>
                <span className="blogs-kicker">
                  {activeTopic ? activeTopic.kicker : "Blog library"}
                </span>
              </div>

              <h1>
                {activeTopic
                  ? `${activeTopic.navLabel}, in one place`
                  : "Stories that move healthcare forward"}
              </h1>
              <p className="blogs-dek">
                {activeTopic
                  ? activeTopic.description
                  : "Independent news and analysis for executives, clinicians, and technology leaders — every story from the HealthMatics desk."}
              </p>
              <div className="blogs-hero-actions">
                <a href="#blogs-grid" className="blogs-hero-cta">
                  Browse stories
                </a>
                <Link href="/resources" className="blogs-hero-ghost">
                  Resource library
                </Link>
              </div>
              <p className="blogs-count">
                <strong>
                  {stories.length}{" "}
                  {stories.length === 1 ? "story" : "stories"}
                </strong>
                {activeTopic ? ` in ${activeTopic.crumb}` : " across all topics"}
              </p>
            </div>

            <div className="blogs-hero-visual" aria-hidden>
              <div className="blogs-hero-visual-glow" />
              <div className="blogs-mast">
                <div className="blogs-mast-top">
                  <span className="blogs-mast-dot" />
                  <span className="blogs-mast-kicker">Today&apos;s brief</span>
                </div>
                <span className="blogs-mast-title" />
                <span className="blogs-mast-line" />
                <span className="blogs-mast-line blogs-mast-line--mid" />
                <span className="blogs-mast-line blogs-mast-line--short" />
              </div>
              <div className="blogs-stack blogs-stack--a">
                <span className="blogs-stack-tag" />
                <span />
                <span />
              </div>
              <div className="blogs-stack blogs-stack--b">
                <span className="blogs-stack-tag" />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </section>

        <div className="wrap blogs-body">
          <ResourcesNav active="blogs" />

          <div className="blogs-filters" role="navigation" aria-label="Filter by topic">
            <Link
              href="/blogs"
              className={
                !topicFilter ? "blogs-filter is-active" : "blogs-filter"
              }
            >
              All topics
            </Link>
            {topics.map((t) => (
              <Link
                key={t.slug}
                href={`/blogs?topic=${t.slug}`}
                className={
                  topicFilter === t.slug
                    ? "blogs-filter is-active"
                    : "blogs-filter"
                }
              >
                {t.navLabel}
              </Link>
            ))}
          </div>

          {stories.length === 0 ? (
            <div className="blogs-empty">
              <strong>No stories yet</strong>
              <p>
                {activeTopic
                  ? `Nothing published in ${activeTopic.navLabel} yet.`
                  : "Publish an article from the admin panel to fill this library."}
              </p>
              {topicFilter ? (
                <Link href="/blogs" className="btn btn-out">
                  View all blogs
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="hr-story-grid blogs-grid" id="blogs-grid">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
