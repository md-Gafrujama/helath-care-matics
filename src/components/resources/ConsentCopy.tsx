import Link from "next/link";
import { parseConsentCopy } from "@/lib/resources/form-config";

export default function ConsentCopy({ text }: { text: string }) {
  const segments = parseConsentCopy(text);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "bold") {
          return <strong key={i}>{seg.value}</strong>;
        }
        if (seg.type === "link") {
          return (
            <Link key={i} href={seg.href} className="dl-consent-link">
              {seg.label}
            </Link>
          );
        }
        return <span key={i}>{seg.value}</span>;
      })}
    </>
  );
}
