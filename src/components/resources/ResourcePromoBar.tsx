import Link from "next/link";
import { SITE_NAME, categoryLabel, type ResourceCategory } from "@/lib/resources/constants";

export default function ResourcePromoBar({
  category,
}: {
  category: ResourceCategory;
}) {
  const kind = categoryLabel(category).toLowerCase();

  return (
    <aside className="rs-promo-bar" aria-label={`${SITE_NAME} resource notice`}>
      <div className="rs-promo-bar-inner">
        <p className="rs-promo-bar-copy">
          This {kind} is brought to you through {SITE_NAME}. {SITE_NAME} is a
          library of healthcare intelligence resources.{" "}
          <Link href="/privacy">Read our privacy statement</Link>.
        </p>
        <p className="rs-promo-bar-links">
          <Link href="/unsubscribe">Unsubscribe</Link>
          <span aria-hidden>|</span>
          <Link href="/privacy">Do Not Sell My Data</Link>
        </p>
      </div>
    </aside>
  );
}
