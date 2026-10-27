import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DownloadGate from "@/components/resources/DownloadGate";
import ResourcePromoBar from "@/components/resources/ResourcePromoBar";
import ResourcesHero from "@/components/resources/ResourcesHero";
import ResourcesNav from "@/components/resources/ResourcesNav";
import ResourceDetailShare from "@/components/resources/ResourceDetailShare";
import {
  categoryLabel,
  categoryToPath,
  pathToCategory,
} from "@/lib/resources/constants";
import { getPublishedResourceBySlug } from "@/lib/resources/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  const category = pathToCategory(type);
  if (!category) return {};
  const resource = await getPublishedResourceBySlug(slug, category);
  if (!resource) return {};
  const seo = resource.seo || {};
  return {
    title:
      (typeof seo.metaTitle === "string" && seo.metaTitle) ||
      `${resource.title} | HealthMatics`,
    description:
      (typeof seo.metaDescription === "string" && seo.metaDescription) ||
      resource.description,
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  const category = pathToCategory(type);
  if (!category) notFound();

  const resource = await getPublishedResourceBySlug(slug, category);
  if (!resource) notFound();

  const typePath = categoryToPath(resource.category);
  const metaBits = [
    categoryLabel(resource.category),
    resource.vertical || null,
    resource.offered_by ? `Offered by ${resource.offered_by}` : null,
    resource.author_name || null,
  ].filter(Boolean);
  const bodyCopy =
    resource.overview?.trim() || resource.description?.trim() || "";

  return (
    <>
      <SiteHeader />
      <main className="rs-page rs-page--detail">
        <ResourcesHero
          variant="detail"
          title={resource.title}
          description={resource.description}
          crumbs={[
            { href: "/resources", label: "Resources" },
            {
              href: `/resources/${typePath}`,
              label: categoryLabel(resource.category),
            },
            { label: resource.title },
          ]}
          countLabel={metaBits.join(" · ")}
          ctaHref="#download"
          ctaLabel="Download now"
        />

        <div className="wrap rs-body">
          <ResourcesNav active={resource.category} />

          <div className="rs-detail">
            <div className="rs-detail-main">
              <div className="rs-detail-media" id="overview">
                <div className="rs-detail-cover">
                  {resource.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resource.cover_url}
                      alt={resource.title}
                      className="rs-detail-cover-img"
                    />
                  ) : null}
                </div>
                <ResourceDetailShare
                  path={`/resources/${typePath}/${resource.slug}`}
                  title={resource.title}
                />
              </div>

              {bodyCopy ? (
                <div className="rs-overview">
                  <p className="rs-overview-label">What&apos;s inside</p>
                  <h2 className="rs-overview-title">
                    Key insights from this {categoryLabel(resource.category).toLowerCase()}
                  </h2>
                  {bodyCopy.split(/\n\n+/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : null}

              {Array.isArray(resource.seo?.insideSections)
                ? (
                    resource.seo.insideSections as {
                      id?: string;
                      heading?: string;
                      copy?: string;
                    }[]
                  )
                    .filter((s) => s?.heading || s?.copy)
                    .map((s, i) => (
                      <section className="rs-inside-section" key={s.id || i}>
                        {s.heading ? <h2>{s.heading}</h2> : null}
                        {s.copy
                          ? s.copy.split(/\n\n+/).map((para, j) => (
                              <p key={j}>{para}</p>
                            ))
                          : null}
                      </section>
                    ))
                : null}
            </div>

            <aside className="rs-detail-aside" id="download">
              <DownloadGate
                resourceId={resource.id}
                resourceSlug={resource.slug}
                resourceTitle={resource.title}
                resourceCategory={resource.category}
                form={resource.form_config_parsed}
              />
            </aside>
          </div>
        </div>
      </main>
      <ResourcePromoBar category={resource.category} />
      <SiteFooter />
    </>
  );
}
