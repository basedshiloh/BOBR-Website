import { getActiveAd } from "./ads-server";
import { AD_PLACEMENTS } from "./placements";
import AdEmbed from "./AdEmbed";

const SHOW_PLACEHOLDERS = process.env.NEXT_PUBLIC_AD_PLACEHOLDERS === "true";

export default async function AdSlot({
  placement,
  className = "",
}: {
  placement: string;
  className?: string;
}) {
  const ad = await getActiveAd(placement);

  if (!ad) {
    if (!SHOW_PLACEHOLDERS) return null;
    const def = AD_PLACEMENTS.find((p) => p.id === placement);
    return (
      <aside
        className={`not-prose my-6 flex flex-col items-center ${className}`}
        aria-label="Ad placeholder"
      >
        <div className="w-full rounded-md border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Ad — {def?.label ?? placement}</p>
          <p className="mt-1 text-xs text-gray-300">{def?.hint}</p>
        </div>
      </aside>
    );
  }

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
          <a href={ad.linkUrl} target="_blank" rel="sponsored noopener noreferrer" className="block max-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ad.imageUrl} alt={ad.name || "Advertisement"} className="max-w-full h-auto rounded-md border border-rule" loading="lazy" />
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.imageUrl} alt={ad.name || "Advertisement"} className="max-w-full h-auto rounded-md border border-rule" loading="lazy" />
        )
      ) : (
        <div className="max-w-full"><AdEmbed html={ad.html} /></div>
      )}
    </aside>
  );
}
