import Link from "next/link";
import CoverImage from "@/components/CoverImage";
import { getNavTopics } from "@/lib/topic-config";
import { storyHref } from "@/lib/story-link";
import type { TopicStory } from "@/lib/topic-stories";

export default function HomeHero({ lead }: { lead: TopicStory }) {
  const href = storyHref(lead);
  const topics = getNavTopics();

  return (
    <section className="hr-hero">
      <div className="wrap">
        <nav className="hr-hero-nav" aria-label="Browse topics">
          {topics.map((topic, i) => (
            <span key={topic.slug} className="hr-hero-nav-item">
              {i > 0 && <span className="hr-hero-nav-sep" aria-hidden />}
              <Link href={`/topic/${topic.slug}`}>{topic.navLabel}</Link>
            </span>
          ))}
        </nav>

        <div className="hr-hero-layout">
          <div className="hr-hero-copy">
            <div className="hr-hero-eyebrow">
              <span className="live-dot" />
              <span>Lead story</span>
              <span className="dot" aria-hidden />
              <Link href={`/topic/${lead.topicSlug}`}>{lead.topicName}</Link>
            </div>

            <h1>
              <Link href={href}>{lead.title}</Link>
            </h1>

            <p className="hr-hero-dek">{lead.dek}</p>

            <div className="hr-hero-meta">
              <span>{lead.authorName}</span>
              <span className="dot" aria-hidden />
              <span>{lead.readMinutes} min read</span>
            </div>

            <Link href={href} className="hr-hero-cta">
              Read full story
            </Link>
          </div>

          <Link href={href} className="hr-hero-visual" aria-label={lead.title}>
            <CoverImage
              src={lead.coverImageUrl}
              alt={lead.coverImageAlt}
              seed={lead.slug}
              label={lead.category}
              priority
              sizes="(min-width: 900px) 520px, 100vw"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
