import { getActiveAd } from "./ads-server";
import AdEmbed from "./AdEmbed";

// Server component: renders the active ad for a placement zone, or nothing when
// the zone is empty. Use anywhere: <AdSlot placement="post_before" />.
export default async function AdSlot({
  placement,
  className = "",
}: {
  placement: string;
  className?: string;
}) {
  const ad = await getActiveAd(placement);
  if (!ad) return null;

  const isImage = ad.type === "image" && ad.imageUrl;
  const isScript = ad.type === "script" && ad.html;
  if (!isImage && !isScript) return null;

  return (
    <aside
      className={`not-prose my-6 flex flex-col items-center ${className}`}
      aria-label="Advertisement"
    >
      <span className="kicker mb-1.5 text-ink-soft/60">{ad.label || "Sponsored"}</span>
      {isImage ? (
        ad.linkUrl ? (
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="block max-w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ad.imageUrl}
              alt={ad.name || "Advertisement"}
              className="max-w-full h-auto rounded-md border border-rule"
              loading="lazy"
            />
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.imageUrl}
            alt={ad.name || "Advertisement"}
            className="max-w-full h-auto rounded-md border border-rule"
            loading="lazy"
          />
        )
      ) : (
        <div className="max-w-full">
          <AdEmbed html={ad.html} />
        </div>
      )}
    </aside>
  );
}
