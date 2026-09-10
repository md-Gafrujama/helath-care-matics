import Link from "next/link";
import HomeStoryCard from "@/components/home/HomeStoryCard";
import { articleToStory } from "@/lib/topic-stories";
import type { ArticleWithTopic } from "@/types/database";

export default function ArticleRelated({
  articles,
}: {
  articles: ArticleWithTopic[];
}) {
  if (articles.length === 0) return null;

  const stories = articles.map(articleToStory);

  return (
    <section className="art-related">
      <div className="wrap">
        <header className="art-related-head">
          <div>
            <span className="kicker">Keep reading</span>
            <h2>More from HealthMatics</h2>
          </div>
          <Link href="/" className="art-related-more">
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
