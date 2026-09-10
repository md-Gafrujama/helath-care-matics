import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TopicHero from "@/components/topic/TopicHero";
import FeaturedStory from "@/components/topic/FeaturedStory";
import TopicStoryCard from "@/components/StoryCard";
import TopicNewsletterBand from "@/components/topic/TopicNewsletterBand";
import { getTopicConfig } from "@/lib/topic-config";
import { getTopicBySlug } from "@/lib/topics";
import { getArticlesByTopicSlug } from "@/lib/articles";
import { articlesToStories, syntheticTopic } from "@/lib/topic-stories";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getTopicConfig(slug);
  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getTopicConfig(slug);
  if (!config) notFound();

  const dbTopic = await getTopicBySlug(slug);
  const topic = dbTopic ?? syntheticTopic(config);
  const isPlaybooks = slug === "playbooks";
  const articles = isPlaybooks
    ? []
    : await getArticlesByTopicSlug(slug);
  const stories = articlesToStories(articles);
  const [lead, ...rest] = stories;

  return (
    <>
      <SiteHeader currentTopicSlug={slug} />
      <main>
        <TopicHero
          config={config}
          description={dbTopic?.description ?? config.description}
        />

        <section className="section topic-body">
          <div className="wrap">
            {isPlaybooks ? (
              <div className="sec-head">
                <h2>Free downloads</h2>
                <span className="line" />
              </div>
            ) : lead ? (
              <>
                <FeaturedStory story={lead} />
                {rest.length > 0 && (
                  <>
                    <div className="sec-head">
                      <h2>More in {config.crumb}</h2>
                      <span className="line" />
                    </div>
                    <div className="home-story-grid topic-story-grid">
                      {rest.map((story) => (
                        <TopicStoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="sub" style={{ marginTop: 24 }}>
                No stories published in {config.navLabel} yet. Generate one from
                the admin panel for this topic.
              </p>
            )}
          </div>
        </section>

        <TopicNewsletterBand topic={topic} config={config} />
      </main>
      <SiteFooter />
    </>
  );
}
