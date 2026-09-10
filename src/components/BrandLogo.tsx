import Link from "next/link";
import Image from "next/image";

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
      <span className="brand-mark" aria-hidden>
        <Image
          src="/brand/mark.svg"
          alt=""
          width={34}
          height={34}
          priority
          unoptimized
        />
      </span>
      {showWordmark && (
        <span className="brand-wordmark">
          <span className="brand-wordmark-main">Health</span>
          <span className="brand-wordmark-accent">Matics</span>
        </span>
      )}
    </Link>
  );
}
