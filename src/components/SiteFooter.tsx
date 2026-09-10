import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { getNavTopics } from "@/lib/topic-config";

export default function SiteFooter() {
  const navTopics = getNavTopics();
  const year = new Date().getFullYear();

  return (
    <footer className="hr-foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <BrandLogo variant="onDark" />
            <p>
              Healthcare intelligence for the people shaping what&apos;s next.
            </p>
            <div className="socials">
              <a
                href="https://www.linkedin.com"
                aria-label="LinkedIn"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8.65 22 10.9 22 14.3V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.55-2.3 3.1V21H9z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                aria-label="X"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.9 2h3.3l-7.2 8.2L23.6 22h-6.6l-5.2-6.8L5.9 22H2.6l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 001.8-1.8C23 15.2 23 12 23 12zm-13 3.3V8.7l5.7 3.3z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h4>Explore</h4>
            <Link href="/#latest">News</Link>
            <Link href="/#analysis">Analysis</Link>
            <Link href="/#research">Research</Link>
            <Link href="/#events">Events</Link>
            <Link href="/resources">Resources</Link>
          </div>

          <div className="foot-col">
            <h4>Topics</h4>
            {navTopics.slice(0, 5).map((topic) => (
              <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                {topic.navLabel}
              </Link>
            ))}
          </div>

          <div className="foot-col foot-nl">
            <label htmlFor="fem">Get healthcare intelligence in your inbox</label>
            <div className="fnl-row">
              <input
                id="fem"
                type="email"
                placeholder="Work email"
                aria-label="Work email"
              />
              <button className="btn btn-gold" type="button">
                Subscribe
              </button>
            </div>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 11 }}>
              <Link href="/about#advertise">Advertise</Link>
              <Link href="/about#advertise">Lead generation</Link>
              <Link href="/about#advertise">Media kit</Link>
              <Link href="/about#contact">Contact sales</Link>
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <div className="legal">
            <Link href="/about">About</Link>
            <Link href="/about#standards">Editorial Guidelines</Link>
            <Link href="/about#standards">Privacy</Link>
            <Link href="/about#standards">Terms</Link>
            <Link href="/about#standards">Cookie Policy</Link>
            <Link href="/about#contact">Contact</Link>
          </div>
          <span className="copy">
            © {year} HealthMatics. Independent publication.
          </span>
        </div>
      </div>
    </footer>
  );
}
