import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  variant?: "default" | "onDark";
  showWordmark?: boolean;
  className?: string;
};

export default function BrandLogo({
  href = "/",
  variant = "default",
  showWordmark = true,
  className = "",
}: BrandLogoProps) {
  const onDark = variant === "onDark";

  return (
    <Link
      href={href}
      className={`brand ${onDark ? "brand--dark" : ""} ${className}`.trim()}
      aria-label="HealthMatics home"
    >
      <span className="mark" aria-hidden>
        H
      </span>
      {showWordmark && (
        <span className="name">
          Health<em>Matics</em>
        </span>
      )}
    </Link>
  );
}
