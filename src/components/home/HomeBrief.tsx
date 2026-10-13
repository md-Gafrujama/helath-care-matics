import Link from "next/link";
import { formatPublishedDate } from "@/lib/format-date";
import { storyHref } from "@/lib/story-link";
import type { TopicStory } from "@/lib/topic-stories";

export default function HomeBrief({ stories }: { stories: TopicStory[] }) {
  if (stories.length === 0) return null;

  return (
    <section className="hr-brief">
      <div className="wrap">
        <header className="hr-brief-head">
          <span className="hr-brief-label">The Brief</span>
          <h2>Today in healthcare</h2>
        </header>
        <ol className="hr-brief-list">
          {stories.map((story) => (
            <li className="hr-brief-item" key={story.id}>
              <span className="hr-brief-tag">
                {story.topicName}
                {story.publishedAt
                  ? ` · ${formatPublishedDate(story.publishedAt)}`
                  : ""}
              </span>
              <h3>
                <Link href={storyHref(story)}>{story.title}</Link>
              </h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
