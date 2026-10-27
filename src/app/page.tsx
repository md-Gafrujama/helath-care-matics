import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HomeHero from "@/components/home/HomeHero";
import HomeLatestGrid from "@/components/home/HomeLatestGrid";
import HomeBrief from "@/components/home/HomeBrief";
import HomeResearch from "@/components/home/HomeResearch";
import HomeTopicSection from "@/components/home/HomeTopicSection";
import { getHomePageData } from "@/lib/home-data";

export const revalidate = 300;

export default async function Page() {
  const { lead, latestStories, briefStories, topicSections } =
    await getHomePageData();

  const hasContent = Boolean(lead);

  return (
    <>
      <SiteHeader />
      <main className="home-main" id="main">
        {lead ? (
          <HomeHero lead={lead} />
        ) : (
          <section className="hr-hero hr-hero--empty">
            <div className="wrap">
              <span className="kicker">HealthMatics</span>
              <h1>Healthcare intelligence, published daily</h1>
              <p className="hr-hero-dek">
                Generate your first story from the admin panel, one topic at a
                time with research, full articles, and cover images.
              </p>
              <Link href="/admin/articles/new#generate" className="hr-hero-cta">
                Generate content
              </Link>
            </div>
          </section>
        )}

        <HomeLatestGrid stories={latestStories} />

        <HomeBrief stories={briefStories} />

        {hasContent && topicSections.length > 0 && (
          <div className="hr-desks" id="topics">
            {topicSections.map((section) => (
              <HomeTopicSection
                key={section.config.slug}
                config={section.config}
                stories={section.stories}
              />
            ))}
          </div>
        )}

        {/* ============ EXPLORE BY TOPIC ============ */}
        <section className="section wrap" id="resources">
          <div className="section-head">
            <div className="marker"><h2>Explore by Topic</h2></div>
            <Link href="/#topics" className="see-all">All topics</Link>
          </div>
          <div className="topics-row">
            <Link href="/topic/health-it" className="topic-chip">
              <div className="t-name">Health IT</div>
              <div className="t-count">Interoperability, EHR, AI</div>
            </Link>
            <Link href="/topic/hospitals" className="topic-chip">
              <div className="t-name">Hospitals</div>
              <div className="t-count">Operations, M&amp;A</div>
            </Link>
            <Link href="/topic/payers" className="topic-chip">
              <div className="t-name">Payers</div>
              <div className="t-count">Reimbursement</div>
            </Link>
            <Link href="/topic/digital-health" className="topic-chip">
              <div className="t-name">Digital Health</div>
              <div className="t-count">Virtual care</div>
            </Link>
            <Link href="/topic/cybersecurity" className="topic-chip">
              <div className="t-name">Cybersecurity</div>
              <div className="t-count">Risk, resilience</div>
            </Link>
            <Link href="/topic/pharma-biotech" className="topic-chip">
              <div className="t-name">Pharma &amp; Biotech</div>
              <div className="t-count">Pipeline, commercial</div>
            </Link>
          </div>
        </section>

        {/* ============ ANALYSIS BAND ============ */}
        <section className="section analysis-band" id="analysis">
          <div className="wrap">
            <div className="section-head">
              <div className="marker"><h2>Analysis &amp; Executive Perspectives</h2></div>
              <a href="#" className="see-all">All analysis</a>
            </div>
            <div className="analysis-grid">
              <article>
                <span className="kicker on-dark">Market Trends</span>
                <h3><a href="#" className="headline-link">What Enterprise AI Actually Changes for Health System Operating Models</a></h3>
                <p>Moving from pilots to production forces new decisions about governance, workforce and accountability. Here is what leaders are getting right, and where the hard tradeoffs still sit.</p>
                <span className="who">Expert Analysis</span>
              </article>
              <article>
                <span className="kicker on-dark">Industry Outlook</span>
                <h3><a href="#" className="headline-link">The Financial Case for Interoperability Is Finally Catching Up to the Mandate</a></h3>
                <p>For years interoperability was framed as compliance. A clearer link to revenue, cost and patient retention is changing how it gets funded.</p>
                <span className="who">Market Trends</span>
              </article>
              <article>
                <span className="kicker on-dark">Opinion</span>
                <h3><a href="#" className="headline-link">Cybersecurity Belongs in the Boardroom, Not Just the Server Room</a></h3>
                <p>Treating security as an IT line item underestimates the operational and reputational stakes now facing healthcare organizations.</p>
                <span className="who">Executive Perspectives</span>
              </article>
            </div>
          </div>
        </section>

        <HomeResearch />

        {/* ============ NEWSLETTER CTA ============ */}
        <section className="hr-news" id="nl">
          <div className="wrap">
            <div className="hr-news-grid">
              <div className="hr-news-copy">
                <span className="kicker">Newsletters</span>
                <h2>Healthcare intelligence, delivered to your inbox.</h2>
                <p>
                  Concise news, analysis and insights curated for busy decision
                  makers. Choose the briefs that match your role, from the Daily
                  Healthcare Brief to the Healthcare AI Brief.
                </p>
              </div>
              <div className="hr-news-form-wrap">
                <form className="hr-news-form js-fake-subscribe" data-source="home">
                  <input
                    type="email"
                    name="email"
                    placeholder="Work email"
                    aria-label="Work email"
                    required
                  />
                  <button type="submit">Subscribe free</button>
                </form>
                <p className="hr-news-note">
                  By subscribing you agree to receive email from HealthMatics.
                  Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ ADVERTISE CTA ============ */}
        <section className="advertise" id="advertise">
          <div className="wrap inner">
            <div>
              <span className="kicker on-dark">For Marketers</span>
              <h2>Reach the healthcare decision makers who matter most.</h2>
              <p>
                Put your brand in front of executives, technology leaders,
                clinicians and business decision makers who are actively
                researching the future of care.
              </p>
              <div className="cta-row">
                <a href="#" className="btn btn-gold">Request media kit</a>
                <a href="#" className="btn btn-outline-light">Talk to our team</a>
              </div>
            </div>
            <div className="ad-stats">
              <div className="ad-stat">
                <div className="as-k">Lead generation</div>
                <div className="as-v">Qualified healthcare demand from high intent audiences</div>
              </div>
              <div className="ad-stat">
                <div className="as-k">Sponsored content</div>
                <div className="as-v">Thought leadership built with our editorial team</div>
              </div>
              <div className="ad-stat">
                <div className="as-k">Newsletter placements</div>
                <div className="as-v">Reach executives directly in the inbox</div>
              </div>
              <div className="ad-stat">
                <div className="as-k">Webinars &amp; research</div>
                <div className="as-v">Generate registrations and engaged prospects</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
