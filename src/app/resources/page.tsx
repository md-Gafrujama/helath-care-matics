import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Resource Library - HealthMatics",
  description:
    "Whitepapers, research reports, webinars, and playbooks for healthcare leaders. Free with registration.",
};

const RESOURCES = [
  {
    type: "Whitepaper",
    title: "A practical guide to multi-state employment compliance",
    dek: "How healthcare teams sequence policy updates, manager training, and audit trails when rules differ by location.",
    spon: "HealthMatics Research",
  },
  {
    type: "Report",
    title: "2026 Healthcare AI benchmark",
    dek: "Where people leaders are allocating budget, headcount, and technology this year.",
    spon: "HealthMatics Research",
  },
  {
    type: "Webinar",
    title: "Building an AI-ready people function",
    dek: "On-demand session on data readiness, governance, and where to start with healthcare AI.",
    spon: "On demand · 45 min",
  },
  {
    type: "Infographic",
    title: "The state of total rewards technology",
    dek: "Key data points on benefits modernization, pay transparency, and manager tooling.",
    spon: "HealthMatics Research",
  },
  {
    type: "Report",
    title: "Talent acquisition benchmarks: from requisition to offer",
    dek: "How recruiting teams are restructuring cycles, SLAs, and hiring manager partnership.",
    spon: "HealthMatics Research",
  },
  {
    type: "Whitepaper",
    title: "A practical framework for healthcare data governance",
    dek: "What a governed people-data layer looks like — and how to build one incrementally.",
    spon: "HealthMatics Research",
  },
] as const;

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <div className="thero">
          <span className="kicker k">Resource Library</span>
          <h1>Research, guides &amp; tools for healthcare leaders</h1>
          <p>
            In-depth reports, playbooks, and on-demand sessions — produced by
            the HealthMatics editorial studio and our partners. Free with a quick
            registration.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ padding: "36px 0 20px" }}>
        <div className="rgrid">
          {RESOURCES.map((item) => (
            <article className="rcard reveal" key={item.title}>
              <div
                className="rc-top"
                style={{
                  background: "var(--paper-2)",
                  minHeight: 160,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <span className="rtype">{item.type}</span>
              </div>
              <div className="rc-b">
                <h3>{item.title}</h3>
                <p>{item.dek}</p>
                <div className="spon">{item.spon}</div>
                <a href="#lead" className="btn btn-solid">
                  Download →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ padding: "24px 0 56px" }} id="lead">
        <div className="gate" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="gate-l">
            <span className="tg">Free download</span>
            <h2>Get instant access</h2>
            <p>
              Tell us where to send it. Register once to unlock every report,
              whitepaper, and webinar in the HealthMatics library.
            </p>
            <div
              className="mono"
              style={{ color: "#9AA0A7", fontSize: "12px", marginTop: "8px" }}
            >
              ✓ Free · ✓ Instant access · ✓ Unsubscribe anytime
            </div>
          </div>
          <div
            className="gate-r"
            style={{ background: "var(--paper)", display: "block", padding: "30px" }}
          >
            <form className="lc js-fake-subscribe" data-source="resources">
              <div>
                <label>First name</label>
                <input type="text" required />
              </div>
              <div>
                <label>Last name</label>
                <input type="text" required />
              </div>
              <div className="full">
                <label>Work email</label>
                <input type="email" required />
              </div>
              <div>
                <label>Company</label>
                <input type="text" required />
              </div>
              <div>
                <label>Job title</label>
                <input type="text" />
              </div>
              <div className="full">
                <label>Company size</label>
                <select>
                  <option>1-50</option>
                  <option>51-200</option>
                  <option>201-1,000</option>
                  <option>1,001-5,000</option>
                  <option>5,000+</option>
                </select>
              </div>
              <div
                className="full"
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  marginTop: "2px",
                }}
              >
                <input
                  type="checkbox"
                  style={{ width: "auto", marginTop: "5px" }}
                  required
                />
                <span style={{ fontSize: "12px", color: "var(--mute)" }}>
                  I agree to receive the requested content and related
                  communications from HealthMatics and its partners. I can
                  unsubscribe anytime. See our Privacy Policy.
                </span>
              </div>
              <div className="full">
                <button
                  className="btn btn-solid"
                  type="submit"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Get instant access →
                </button>
              </div>
            </form>
          </div>
        </div>
        <p style={{ marginTop: 20, fontSize: 14, color: "var(--mute)" }}>
          Prefer the newsroom?{" "}
          <Link href="/topic/playbooks">Browse playbooks →</Link>
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
