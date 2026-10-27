import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { normalizeDashesDeep } from "@/lib/text";
import {
  META_TITLE_BRAND,
  SEO_LIMITS,
  clampKeywordList,
  clampMetaTitle,
  clampToLimit,
} from "@/lib/seo";
import { SITE_NAME } from "@/lib/resources/constants";

const MODEL = "claude-opus-5";
const HOUSE_STYLE = `HOUSE STYLE: Never use em dashes (${"\u2014"}) or en dashes (${"\u2013"}). Use only the short hyphen "-" with spaces when needed, or rewrite as two sentences.`;

const client = new Anthropic();

const ResourceSeoSchema = z.object({
  slug: z
    .string()
    .describe(
      "URL slug: lowercase, hyphen-separated, keyword-rich, 4-8 words, no leading stop words",
    ),
  meta_title: z
    .string()
    .describe(
      `Browser/SEO <title>. Primary keyword near the start. End with '${META_TITLE_BRAND.trim()}'. MAXIMUM ${SEO_LIMITS.metaTitle} characters including the brand suffix.`,
    ),
  meta_description: z
    .string()
    .describe(
      `SEO meta description. MAXIMUM ${SEO_LIMITS.metaDescription} characters. Include a concrete hook for healthcare leaders and the primary topic once. No quotes.`,
    ),
  keywords: z
    .string()
    .describe(
      `Comma-separated SEO keywords, 5-8 short phrases. Include vertical and resource type. MAXIMUM ${SEO_LIMITS.keywords} characters total.`,
    ),
  overview: z
    .string()
    .describe(
      "Optional 2-4 paragraph overview for the public detail page. Plain sentences, editorial tone. Empty string if title/description already cover it.",
    ),
});

export type GeneratedResourceSeo = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  overview: string;
};

export type ResourceSeoInput = {
  title: string;
  description: string;
  categoryLabel: string;
  vertical: string;
  offeredBy?: string;
};

export async function generateResourceSeo(
  input: ResourceSeoInput,
): Promise<GeneratedResourceSeo> {
  const title = clampToLimit(input.title.trim(), SEO_LIMITS.h1);
  const description = clampToLimit(input.description.trim(), 220);
  if (!title) throw new Error("Title is required to generate SEO");
  if (!description) throw new Error("Description is required to generate SEO");

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 2000,
    output_config: { format: zodOutputFormat(ResourceSeoSchema) },
    messages: [
      {
        role: "user",
        content: `You write SEO fields for a gated ${SITE_NAME} resource (white paper, report, case study, or webinar) aimed at healthcare executives and decision-makers.

${HOUSE_STYLE}

RESOURCE
- Title: ${title}
- Description: ${description}
- Category: ${input.categoryLabel}
- Vertical: ${input.vertical}
- Offered by: ${input.offeredBy?.trim() || SITE_NAME}

RULES
1. meta_title MAXIMUM ${SEO_LIMITS.metaTitle} characters including "${META_TITLE_BRAND.trim()}". Shorter is fine.
2. meta_description MAXIMUM ${SEO_LIMITS.metaDescription} characters. Shorter is fine.
3. keywords MAXIMUM ${SEO_LIMITS.keywords} characters total, comma-separated.
4. slug is hyphenated and aligned with the title (no brand name in the slug).
5. overview is optional plain prose for the detail page (2-4 short paragraphs separated by blank lines), or "" if not useful.
6. Do not invent claims beyond the title/description. No keyword stuffing.
7. Tone: clear, editorial, non-hype.

Return only the structured SEO fields.`,
      },
    ],
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error("Claude did not return structured SEO output");
  }

  const clean = normalizeDashesDeep(parsed);
  return {
    slug: clean.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80),
    metaTitle: clampMetaTitle(clean.meta_title),
    metaDescription: clampToLimit(
      clean.meta_description,
      SEO_LIMITS.metaDescription,
    ),
    keywords: clampKeywordList(clean.keywords),
    overview: clean.overview.trim(),
  };
}
