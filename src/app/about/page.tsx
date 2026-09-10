import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About - HealthMatics",
  description:
    "HealthMatics is a digital publication covering independent healthcare news, analysis, and insights for executives and decision-makers transforming healthcare.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <div className="thero" style={{ padding: "clamp(40px, 6vw, 80px) 0" }}>
          <span className="kicker">About</span>
          <h1>Healthcare intelligence for the people shaping what&apos;s next</h1>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: "56ch", marginTop: 12 }}>
            HealthMatics is a digital publication covering the news, technology,
            and strategy shaping modern healthcare — written for executives,
            technology leaders, clinicians, and the decision-makers around them.
          </p>
        </div>
      </div>

      <div className="wrap">
        <div className="body-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40 }}>
          <main className="prose" style={{ maxWidth: "none", fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)" }}>
            <p>
              HealthMatics exists to help healthcare leaders make better
              decisions with less noise. We cover what actually moves healthcare
              — health IT, hospital operations, payer strategy, digital health,
              cybersecurity, and pharma — and we translate complex developments
              into clear, useful analysis.
            </p>
            <h2 id="standards">Editorial standards</h2>
            <p>
              Our journalism is independent. We separate reporting from
              sponsored content, label partner material clearly, and hold
              studio-produced resources to the same accuracy standards as our
              newsroom. When we get something wrong, we correct it transparently.
            </p>
            <h2>What we cover</h2>
            <p>
              Health IT and AI; hospitals and health systems; payers and
              insurance; digital health and telehealth; healthcare cybersecurity;
              and pharma, biotech, and medical devices.
            </p>
            <h2 id="advertise">Reach our audience</h2>
            <p>
              HealthMatics reaches healthcare decision-makers actively
              researching the future of care. We help partners connect with that
              audience through sponsored content, custom research, webinars, and
              lead-generation programs — all produced to editorial standard and
              delivered with clear consent.
            </p>
            <h2 id="contact">Contact</h2>
            <p>
              Editorial:{" "}
              <a href="mailto:editorial@healthmatics.com">editorial@healthmatics.com</a>
              <br />
              Advertising &amp; partnerships:{" "}
              <a href="mailto:partners@healthmatics.com">partners@healthmatics.com</a>
            </p>
          </main>
          <aside className="side">
            <div className="box nlbox" id="nl" style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 5, padding: 20, marginBottom: 20 }}>
              <div className="bh" style={{ fontWeight: 700, marginBottom: 8 }}>The HealthMatics Brief</div>
              <div className="bb">
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 12 }}>Healthcare intelligence worth your five minutes, every weekday.</p>
                <form className="js-fake-subscribe" data-source="about">
                  <input
                    type="email"
                    name="email"
                    placeholder="Work email"
                    required
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 3, marginBottom: 8, fontSize: 14 }}
                  />
                  <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>
                    Sign up
                  </button>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 8 }}>
                    By signing up you agree to our Terms and Privacy Policy.
                  </p>
                </form>
              </div>
            </div>
            <div className="promo" style={{ background: "var(--pine-tint)", border: "1px solid var(--line)", borderRadius: 5, padding: 20 }}>
              <span className="kicker">For partners</span>
              <h4 style={{ fontSize: 17, marginBottom: 6 }}>Advertise with HealthMatics</h4>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 12 }}>Reach healthcare leaders actively evaluating solutions.</p>
              <a
                href="mailto:partners@healthmatics.com"
                className="btn btn-ghost"
              >
                Get in touch →
              </a>
            </div>
          </aside>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
