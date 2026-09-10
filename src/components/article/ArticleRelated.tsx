import Link from "next/link";
import HomeStoryCard from "@/components/home/HomeStoryCard";
import { articleToStory } from "@/lib/topic-stories";
import type { ArticleWithTopic } from "@/types/database";

export default function ArticleRelated({
  articles,
  topicSlug,
  topicName,
}: {
  articles: ArticleWithTopic[];
  topicSlug?: string | null;
  topicName?: string | null;
}) {
  if (articles.length === 0) return null;

  const stories = articles.slice(0, 3).map(articleToStory);
  const allHref = topicSlug ? `/topic/${topicSlug}` : "/";
  const heading = topicName
    ? `More in ${topicName}`
    : "More from HealthMatics";

  return (
    <section className="art-related">
      <div className="wrap">
        <header className="art-related-head">
          <div>
            <span className="kicker">Keep reading</span>
            <h2>{heading}</h2>
          </div>
          <Link href={allHref} className="art-related-more">
            All stories →
          </Link>
        </header>
        <div className="hr-story-grid art-related-grid">
          {stories.map((story) => (
            <HomeStoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
