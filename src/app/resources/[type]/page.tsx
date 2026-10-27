import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourcesHero from "@/components/resources/ResourcesHero";
import ResourcesNav from "@/components/resources/ResourcesNav";
import {
  pathToCategory,
  RESOURCE_CATEGORY_META,
} from "@/lib/resources/constants";
import { listPublishedResources } from "@/lib/resources/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const category = pathToCategory(type);
  if (!category) return {};
  const label = RESOURCE_CATEGORY_META[category].plural;
  return {
    title: `${label} — HealthMatics`,
    description: `${label} from HealthMatics for healthcare decision makers.`,
  };
}

export default async function ResourceTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const category = pathToCategory(type);
  if (!category) notFound();

  const items = await listPublishedResources(category);
  const meta = RESOURCE_CATEGORY_META[category];

  return (
    <>
      <SiteHeader />
      <main className="rs-page">
        <ResourcesHero
          variant={category}
          crumbs={[
            { href: "/resources", label: "Resources" },
            { label: meta.plural },
          ]}
          countLabel={
            items.length > 0
              ? `${items.length} ${items.length === 1 ? meta.label.toLowerCase() : meta.plural.toLowerCase()} available`
              : "New titles publishing soon"
          }
        />

        <div className="wrap rs-body">
          <ResourcesNav active={category} />
          {items.length === 0 ? (
            <div className="rs-empty">
              <strong>Coming soon</strong>
              <span>New {meta.plural.toLowerCase()} will appear here.</span>
            </div>
          ) : (
            <div className="rs-grid">
              {items.map((item) => (
                <ResourceCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  slug={item.slug}
                  category={item.category}
                  coverUrl={item.cover_url}
                  description={item.description}
                  vertical={item.vertical}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
