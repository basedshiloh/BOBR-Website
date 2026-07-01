import Image from "next/image";

// The BOBR nameplate. If the official logotype PNG is present at
// /brand/bobr-logotype.png it is used; otherwise a CSS wordmark that mimics the
// blue block-letter logo renders so the site always looks intentional.
//
// To use the real logo: drop bobr-logotype.png into /public/brand/ and set
// USE_LOGO_IMAGE = true.
const USE_LOGO_IMAGE = false;

export default function Wordmark({
  className = "",
  height = 56,
}: {
  className?: string;
  height?: number;
}) {
  if (USE_LOGO_IMAGE) {
    return (
      <Image
        src="/brand/bobr-logotype.png"
        alt="BOBR"
        height={height}
        width={height * 3.3}
        priority
        className={className}
        style={{ height, width: "auto" }}
      />
    );
  }

  return (
    <span
      className={`font-display font-black tracking-tight leading-none select-none ${className}`}
      style={{
        fontSize: height,
        color: "var(--color-bobr-500)",
        textShadow:
          "2px 2px 0 var(--color-bobr-700), 4px 4px 0 rgba(15,71,189,0.35)",
        WebkitTextStroke: "1.5px var(--color-ink)",
      }}
      aria-label="BOBR"
    >
      BOBR
    </span>
  );
}
