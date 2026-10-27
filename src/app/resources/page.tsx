import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourcesHero from "@/components/resources/ResourcesHero";
import ResourcesNav from "@/components/resources/ResourcesNav";
import {
  RESOURCE_CATEGORY_META,
  RESOURCE_NAV,
  type ResourceCategory,
} from "@/lib/resources/constants";
import { listPublishedResources } from "@/lib/resources/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources — HealthMatics",
  description:
    "White papers, reports, case studies, guides, and webinars for healthcare decision makers.",
};

const SECTION_COPY: Record<string, string> = {
  whitepaper: "In-depth briefs for executive and clinical leadership teams.",
  report: "Data-backed market and operations research you can act on.",
  case_study: "How peers solved hard healthcare operating problems.",
  guide: "Practical playbooks operators and clinicians can use the same day.",
  webinar: "On-demand sessions with practitioners and analysts.",
};

export default async function ResourcesHubPage() {
  const all = await listPublishedResources();
  const counts: Partial<Record<string, number>> = {
    blogs: undefined,
    whitepaper: all.filter((r) => r.category === "whitepaper").length,
    report: all.filter((r) => r.category === "report").length,
    case_study: all.filter((r) => r.category === "case_study").length,
    guide: all.filter((r) => r.category === "guide").length,
    webinar: all.filter((r) => r.category === "webinar").length,
  };

  return (
    <>
      <SiteHeader />
      <main className="rs-page">
        <ResourcesHero
          variant="hub"
          countLabel={
            all.length > 0
              ? `${all.length} published asset${all.length === 1 ? "" : "s"} · free with registration`
              : "Free downloads with a work email"
          }
        />

        <div className="wrap rs-body">
          <ResourcesNav active="hub" counts={counts} />

          <div className="rs-tiles" aria-label="Browse by type">
            {RESOURCE_NAV.filter((n) => n.key !== "blogs").map((section) => {
              const category = (section as { category?: ResourceCategory })
                .category;
              const href = section.href;
              const count = category ? counts[category] ?? 0 : 0;
              return (
                <Link key={section.key} href={href} className="rs-tile">
                  <span className="rs-tile-label">{section.label}</span>
                  <span className="rs-tile-count">
                    {count > 0 ? `${count} available` : "Coming soon"}
                  </span>
                  <span className="rs-tile-copy">
                    {(category && SECTION_COPY[category]) ||
                      SECTION_COPY[section.key] ||
                      ""}
                  </span>
                  <span className="rs-tile-go" aria-hidden>
                    Explore →
                  </span>
                </Link>
              );
            })}
          </div>

          {RESOURCE_NAV.filter((n) => n.key !== "blogs").map((section) => {
            const category = (section as { category?: ResourceCategory })
              .category;
            if (!category) return null;
            const items = all.filter((r) => r.category === category);
            const meta = RESOURCE_CATEGORY_META[category];
            return (
              <section key={category} className="rs-section" id={meta.path}>
                <div className="rs-section-head">
                  <div>
                    <h2>{meta.plural}</h2>
                    <p className="rs-section-dek">
                      {SECTION_COPY[category] || ""}
                    </p>
                  </div>
                  <Link href={`/resources/${meta.path}`} className="rs-section-link">
                    View all →
                  </Link>
                </div>
                {items.length === 0 ? (
                  <div className="rs-empty">
                    <strong>Coming soon</strong>
                    <span>New {meta.plural.toLowerCase()} will appear here.</span>
                  </div>
                ) : (
                  <div className="rs-grid">
                    {items.slice(0, 6).map((item) => (
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
              </section>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
