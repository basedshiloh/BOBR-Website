import Image from "next/image";

// The BOBR nameplate. If the official logotype PNG is present at
// /brand/bobr-logotype.png it is used; otherwise a CSS wordmark that mimics the
// blue block-letter logo renders so the site always looks intentional.
//
// To use the real logo: drop bobr-logotype.png into /public/brand/ and set
// USE_LOGO_IMAGE = true.
const LOGO_URL = "https://basedbobr.b-cdn.net/basedbobr/bobr-logotype.webp";

export default function Wordmark({
  className = "",
  height = 56,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <Image
      src={LOGO_URL}
      alt="BOBR"
      height={height}
      width={height * 3.3}
      priority
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
