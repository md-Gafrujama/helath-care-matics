import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HomeHero from "@/components/home/HomeHero";
import HomeLatestGrid from "@/components/home/HomeLatestGrid";
import HomeBrief from "@/components/home/HomeBrief";
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
                Generate your first story from the admin panel — one topic at a
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
          <div className="hr-desks">
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
            <a href="#" className="see-all">All topics</a>
          </div>
          <div className="topics-row">
            <Link href="/topic/health-it" className="topic-chip">
              <div className="t-name">AI in Healthcare</div>
              <div className="t-count">Pillar hub</div>
            </Link>
            <Link href="/topic/health-it" className="topic-chip">
              <div className="t-name">Health IT</div>
              <div className="t-count">Interoperability, EHR</div>
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

        {/* ============ RESEARCH LIBRARY ============ */}
        <section className="section wrap" id="research">
          <div className="section-head">
            <div className="marker"><h2>Research &amp; Intelligence</h2></div>
            <a href="#" className="see-all">Research library</a>
          </div>
          <div className="research-grid">
            <article className="research-card">
              <div className="art research-cover">
                <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="400" height="240" fill="#0A2E27" />
                  <g stroke="#14463B"><path d="M0 80H400M0 160H400M133 0V240M266 0V240" /></g>
                  <path d="M20 190 100 140 180 160 260 90 340 110" fill="none" stroke="#B0842B" strokeWidth="3.5" />
                  <g fill="#B0842B"><circle cx="180" cy="160" r="6" /><circle cx="340" cy="110" r="6" /></g>
                </svg>
                <span className="research-gate">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
                  Gated report
                </span>
              </div>
              <div className="research-body">
                <div className="rtype">Benchmark Report</div>
                <h3><a href="#" className="headline-link">Healthcare AI Market Outlook 2026</a></h3>
                <p>Where health systems are investing, what is moving to production, and how leaders are structuring governance.</p>
                <div className="research-foot">
                  <span className="rdate">Placeholder edition</span>
                  <a href="#" className="btn btn-gold">Download</a>
                </div>
              </div>
            </article>
            <article className="research-card">
              <div className="art research-cover">
                <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="400" height="240" fill="#123A54" />
                  <g fill="#1C4E6E"><rect x="40" y="150" width="34" height="70" /><rect x="94" y="120" width="34" height="100" /><rect x="148" y="130" width="34" height="90" /><rect x="202" y="90" width="34" height="130" /><rect x="256" y="110" width="34" height="110" /><rect x="310" y="70" width="34" height="150" /></g>
                </svg>
                <span className="research-gate">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
                  Gated report
                </span>
              </div>
              <div className="research-body">
                <div className="rtype">Buyer Guide</div>
                <h3><a href="#" className="headline-link">Hospital Technology Buyer Guide 2026</a></h3>
                <p>An evaluation framework for platform selection across EHR adjacent, analytics and security categories.</p>
                <div className="research-foot">
                  <span className="rdate">Placeholder edition</span>
                  <a href="#" className="btn btn-gold">Download</a>
                </div>
              </div>
            </article>
            <article className="research-card">
              <div className="art research-cover">
                <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="400" height="240" fill="#0C5245" />
                  <g fill="none" stroke="#0A3E34"><circle cx="200" cy="120" r="40" /><circle cx="200" cy="120" r="72" /><circle cx="200" cy="120" r="104" /></g>
                  <g fill="#7FCBB8"><circle cx="240" cy="92" r="6" /><circle cx="152" cy="150" r="6" /></g>
                </svg>
                <span className="research-gate">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
                  Gated report
                </span>
              </div>
              <div className="research-body">
                <div className="rtype">White Paper</div>
                <h3><a href="#" className="headline-link">Digital Health Outlook 2026</a></h3>
                <p>How virtual care, remote monitoring and patient engagement are consolidating into integrated platforms.</p>
                <div className="research-foot">
                  <span className="rdate">Placeholder edition</span>
                  <a href="#" className="btn btn-gold">Download</a>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ============ EVENTS ============ */}
        <section className="section section-band" id="events">
          <div className="wrap">
            <div className="section-head">
              <div className="marker"><h2>Events &amp; Webinars</h2></div>
              <a href="#" className="see-all">All events</a>
            </div>
            <div className="events-grid">
              <article className="event-card">
                <div className="event-top">
                  <div className="event-date"><span className="m">Mar</span><span className="d">18</span></div>
                  <div><div className="event-type">Webinar</div><div className="etime">2:00 PM to 3:00 PM ET</div></div>
                </div>
                <h3><a href="#" className="headline-link">Building an Enterprise AI Governance Model That Clinicians Trust</a></h3>
                <a href="#" className="btn btn-ghost">Register now</a>
              </article>
              <article className="event-card">
                <div className="event-top">
                  <div className="event-date"><span className="m">Apr</span><span className="d">09</span></div>
                  <div><div className="event-type">Virtual Event</div><div className="etime">All day</div></div>
                </div>
                <h3><a href="#" className="headline-link">The Revenue Cycle Automation Summit</a></h3>
                <a href="#" className="btn btn-ghost">Register now</a>
              </article>
              <article className="event-card">
                <div className="event-top">
                  <div className="event-date"><span className="m">Apr</span><span className="d">23</span></div>
                  <div><div className="event-type">On Demand</div><div className="etime">Watch anytime</div></div>
                </div>
                <h3><a href="#" className="headline-link">Healthcare Cybersecurity in an Era of Connected Devices</a></h3>
                <a href="#" className="btn btn-ghost">Watch now</a>
              </article>
            </div>
          </div>
        </section>

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
