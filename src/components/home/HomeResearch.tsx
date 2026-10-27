import Link from "next/link";
import HomeResearchCard from "@/components/home/HomeResearchCard";
import { listPublishedResources } from "@/lib/resources/queries";

export default async function HomeResearch() {
  const resources = (await listPublishedResources()).slice(0, 3);

  return (
    <section className="section wrap" id="research">
      <div className="section-head">
        <div className="marker">
          <h2>Research &amp; Intelligence</h2>
        </div>
        <Link href="/resources" className="see-all">
          Research library
        </Link>
      </div>

      {resources.length === 0 ? (
        <div className="research-empty">
          <strong>Resources coming soon</strong>
          <p>
            White papers, reports, case studies, and webinars will appear here
            once they are published from the admin library.
          </p>
          <Link href="/resources" className="btn btn-out">
            Browse library
          </Link>
        </div>
      ) : (
        <div className="research-grid">
          {resources.map((r, i) => (
            <HomeResearchCard
              key={r.id}
              id={r.id}
              title={r.title}
              slug={r.slug}
              category={r.category}
              coverUrl={r.cover_url}
              description={r.description}
              vertical={r.vertical}
              publishedAt={r.published_at}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
