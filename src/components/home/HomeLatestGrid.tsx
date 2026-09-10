import HomeStoryCard from "@/components/home/HomeStoryCard";
import type { TopicStory } from "@/lib/topic-stories";

export default function HomeLatestGrid({
  stories,
}: {
  stories: TopicStory[];
}) {
  if (stories.length === 0) return null;

  return (
    <section className="hr-latest" id="latest">
      <div className="wrap">
        <header className="section-head">
          <div className="marker"><h2>Latest News</h2></div>
          <a href="#" className="see-all">See all news</a>
        </header>
        <div className="hr-story-grid">
          {stories.map((story) => (
            <HomeStoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
