import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import BrandLogo from "@/components/BrandLogo";
import MobileNav from "@/components/MobileNav";

function todayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());
}

export default function SiteHeader({
  currentTopicSlug,
}: {
  currentTopicSlug?: string;
} = {}) {
  return (
    <>
      <div className="utility">
        <div className="wrap">
          <nav className="utility-links" aria-label="Utility">
            <Link href="/#latest">Latest News</Link>
            <Link href="/#nl">Newsletters</Link>
            <Link href="/#research">Research</Link>
            <Link href="/#advertise">Advertise</Link>
          </nav>
          <div className="utility-right">
            <span className="date">{todayLabel()}</span>
          </div>
        </div>
      </div>

      <header className="masthead">
        <div className="wrap">
          <BrandLogo />
          <nav className="nav" aria-label="Primary">
            <Link href="/#latest">News</Link>
            <Link href="/#analysis">Analysis</Link>
            <Link href="/#research">Research</Link>
            <Link href="/resources">Resources</Link>
          </nav>
          <div className="masthead-right">
            <SearchBar />
            <Link href="/#nl" className="btn btn-primary subscribe-top">
              <span className="label">Subscribe</span>
            </Link>
            <MobileNav currentTopicSlug={currentTopicSlug} />
          </div>
        </div>
      </header>

      <div className="ticker">
        <div className="wrap">
          <span className="ticker-label">
            <span className="live-dot" />
            Trending
          </span>
          <div className="ticker-track">
            <div className="ticker-move">
              {[
                "AI in Healthcare",
                "Hospital M&A",
                "Healthcare Cybersecurity",
                "Digital Health",
                "Revenue Cycle",
                "Health Policy",
                "AI in Healthcare",
                "Hospital M&A",
                "Healthcare Cybersecurity",
                "Digital Health",
                "Revenue Cycle",
                "Health Policy",
              ].map((label, i) => (
                <span key={`${label}-${i}`}>
                  <span className="ticker-item">{label}</span>
                  {i < 11 && <span className="sep">/</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
