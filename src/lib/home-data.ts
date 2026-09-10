import { getNavTopics } from "@/lib/topic-config";
import { getLatestArticles, getArticlesByTopicSlug } from "@/lib/articles";
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
  /** Latest stories for the homepage grid (excludes the lead). */
  latestStories: TopicStory[];
  briefStories: TopicStory[];
  topicSections: HomeTopicSection[];
};

/** Organize homepage stories: hero + latest grid + per-topic sections. */
export async function getHomePageData(): Promise<HomePageData> {
  const navTopics = getNavTopics().filter((t) => t.slug !== "playbooks");
  const allArticles = await getLatestArticles(24);
  const allStories = articlesToStories(allArticles);

  const topicSections: HomeTopicSection[] = (
    await Promise.all(
      navTopics.map(async (config) => {
        const articles = await getArticlesByTopicSlug(config.slug, 3);
        return { config, stories: articlesToStories(articles) };
      }),
    )
  ).filter((section) => section.stories.length > 0);

  const lead = allStories[0] ?? null;
  const latestStories = allStories.slice(lead ? 1 : 0, 13);

  const briefStories = topicSections
    .map((section) => section.stories[0])
    .filter((story): story is TopicStory => Boolean(story));

  return { lead, latestStories, briefStories, topicSections };
}
