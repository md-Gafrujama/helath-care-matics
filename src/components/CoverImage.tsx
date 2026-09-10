import Image from "next/image";
import CoverArt from "@/components/CoverArt";

export default function CoverImage({
  src,
  alt,
  seed,
  label,
  sizes = "(min-width: 940px) 800px, 100vw",
  priority = false,
}: {
  src: string | null;
  alt: string | null;
  seed: string;
  label?: string | null;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div className="cover-frame">
        <CoverArt seed={seed} label={label ?? alt} />
      </div>
    );
  }

  return (
    <div className="cover-frame">
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={70}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
