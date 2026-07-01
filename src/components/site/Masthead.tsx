import Link from "next/link";
import Wordmark from "./Wordmark";
import CategoryNav from "./CategoryNav";

// Rest-of-World / newspaper-style nameplate: date + edition line, big centered
// wordmark, then the section rail.
export default function Masthead() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-paper">
      {/* Top edition bar */}
      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-[11px] text-ink-soft">
          <span className="hidden sm:inline">{today}</span>
          <span className="kicker text-bobr-600">From the trenches</span>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden transition-colors hover:text-bobr-600 sm:inline"
          >
            Follow @basedbobr →
          </a>
        </div>
      </div>

      {/* Nameplate */}
      <div className="mx-auto max-w-6xl px-4 py-6 text-center sm:py-8">
        <Link href="/" className="inline-block" aria-label="BOBR — home">
          <Wordmark height={64} className="sm:!text-[84px]" />
        </Link>
        <p className="mt-2 font-display text-sm italic text-ink-soft sm:text-base">
          Builder-first crypto. Informative, inclusive, and a little degen.
        </p>
      </div>

      <CategoryNav />
    </header>
  );
}
