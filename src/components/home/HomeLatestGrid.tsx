import Link from "next/link";
import HomeStoryCard from "@/components/home/HomeStoryCard";
import type { TopicStory } from "@/lib/topic-stories";

export default function HomeLatestGrid({
  stories,
}: {
  stories: TopicStory[];
}) {
  if (stories.length === 0) return null;

  const row = stories.slice(0, 6);

  return (
    <section className="hr-latest" id="latest">
      <div className="wrap">
        <header className="section-head">
          <div className="marker">
            <h2>Latest News</h2>
          </div>
          <Link href="/#topics" className="see-all">
            See all topics
          </Link>
        </header>
        <div className="hr-story-grid">
          {row.map((story) => (
            <HomeStoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
