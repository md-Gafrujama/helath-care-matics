import Link from "next/link";
import CoverImage from "@/components/CoverImage";
import ArticleToc from "@/components/article/ArticleToc";
import type { TocItem } from "@/lib/article-toc";
import type { ArticleWithTopic } from "@/types/database";

export default function ArticleSidebar({
  topicName,
  topicSlug,
  stories,
  toc,
}: {
  topicName?: string;
  topicSlug?: string;
  stories?: ArticleWithTopic[];
  toc: TocItem[];
}) {
  const hasTopic = Boolean(topicName && topicSlug);
  const related = stories ?? [];

  return (
    <aside className="art-rail" aria-label="Article sidebar">
      {toc.length > 0 && (
        <div className="art-rail-panel art-rail-panel--toc">
          <ArticleToc items={toc} />
        </div>
      )}

      {hasTopic && (
        <div className="art-rail-panel">
          <div className="art-rail-head">
            <h2>More in {topicName}</h2>
            <Link href={`/topic/${topicSlug}`} className="art-rail-all">
              View all
            </Link>
          </div>

          {related.length > 0 ? (
            <ul className="art-rail-list">
              {related.map((story, i) => (
                <li key={story.id}>
                  <Link
                    href={`/article/${story.slug}`}
                    className="art-rail-item"
                  >
                    <span className="art-rail-rank">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="art-rail-thumb">
                      <CoverImage
                        src={story.cover_image_url}
                        alt=""
                        seed={story.slug}
                        label={story.topic?.name}
                        sizes="80px"
                      />
                    </span>
                    <span className="art-rail-copy">
                      <span className="art-rail-meta">
                        {story.read_time_minutes ?? 5} min read
                      </span>
                      <span className="art-rail-title">{story.title}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="art-rail-empty">
              More {topicName} coverage coming soon.
            </p>
          )}
        </div>
      )}

      <div className="art-rail-panel art-rail-panel--news">
        <div className="art-rail-head">
          <h2>The daily brief</h2>
        </div>
        <p className="art-rail-news-copy">
          Healthcare intelligence in one email, health IT, hospitals, payers,
          and digital health for decision makers.
        </p>
        <form
          className="art-rail-form js-fake-subscribe"
          data-source="article-sidebar"
        >
          <input
            type="email"
            name="email"
            placeholder="Your work email"
            aria-label="Work email"
            required
          />
          <button type="submit" className="btn-sub">
            Subscribe
          </button>
        </form>
        <p className="art-rail-fine">Free. Unsubscribe anytime.</p>
      </div>
    </aside>
  );
}
