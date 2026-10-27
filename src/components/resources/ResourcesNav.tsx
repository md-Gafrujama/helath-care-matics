import Link from "next/link";
import { RESOURCE_NAV } from "@/lib/resources/constants";

export default function ResourcesNav({
  active,
  counts,
}: {
  active?: string;
  counts?: Partial<Record<string, number>>;
}) {
  return (
    <nav className="rs-nav" aria-label="Resources">
      <Link
        href="/resources"
        className={active === "hub" ? "rs-nav-chip is-active" : "rs-nav-chip"}
        aria-current={active === "hub" ? "page" : undefined}
      >
        All
      </Link>
      {RESOURCE_NAV.map((item) => {
        const isActive = active === item.key;
        const count = counts?.[item.key];
        return (
          <Link
            key={item.key}
            href={item.href}
            className={isActive ? "rs-nav-chip is-active" : "rs-nav-chip"}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
            {typeof count === "number" ? (
              <span className="rs-nav-count">{count}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
