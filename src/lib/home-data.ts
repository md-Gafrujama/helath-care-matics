import { getNavTopics } from "@/lib/topic-config";
import { getLatestArticles } from "@/lib/articles";
import {
  articlesToStories,
  type TopicStory,
} from "@/lib/topic-stories";
import type { TopicConfig } from "@/lib/topic-config";

export type HomeTopicSection = {
  config: TopicConfig;
  stories: TopicStory[];
};

export type HomePageData = {
  lead: TopicStory | null;
  latestStories: TopicStory[];
  briefStories: TopicStory[];
  topicSections: HomeTopicSection[];
};

/**
 * Single DB fetch for the homepage, avoid N+1 topic queries.
 * Topic rows always prefer that topic's own stories (up to 3 per line).
 */
export async function getHomePageData(): Promise<HomePageData> {
  const navTopics = getNavTopics();
  const allArticles = await getLatestArticles(60);
  const allStories = articlesToStories(allArticles);

  const lead = allStories[0] ?? null;
  const rest = allStories.slice(lead ? 1 : 0);
  const latestStories = rest.slice(0, 6);

  const topicSections: HomeTopicSection[] = [];
  for (const config of navTopics) {
    const stories = allStories
      .filter((s) => s.topicSlug === config.slug)
      .slice(0, 3);
    if (stories.length === 0) continue;
    topicSections.push({ config, stories });
  }

  const briefStories = topicSections
    .map((section) => section.stories[0])
    .filter((story): story is TopicStory => Boolean(story))
    .slice(0, 6);

  return { lead, latestStories, briefStories, topicSections };
}
