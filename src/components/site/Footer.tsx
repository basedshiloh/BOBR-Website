import Link from "next/link";
import AdSlot from "@/cms/ads/AdSlot";
import Wordmark from "./Wordmark";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/polaris.config";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-rule bg-paper">
      {/* Footer ad zone */}
      <div className="mx-auto max-w-6xl px-4">
        <AdSlot placement="global_footer" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <Wordmark height={34} />
            <p className="mt-3 text-sm text-ink-soft">
              A crypto news desk for builders — Base, markets, culture and guides.
              Inspired by the beaver that keeps building.
            </p>
          </div>

          <nav className="flex flex-col gap-1.5">
            <span className="kicker mb-1 text-ink-soft/60">Beats</span>
            {CATEGORY_ORDER.map((key) => (
              <Link
                key={key}
                href={`/${key}`}
                className="text-sm text-ink-soft transition-colors hover:text-bobr-600"
              >
                {CATEGORIES[key].label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-1.5">
            <span className="kicker mb-1 text-ink-soft/60">Community</span>
            <a href="https://x.com/BasedBOBR" target="_blank" rel="noopener noreferrer" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">X / Twitter</a>
            <a href="https://t.me/basedbobr_updates" target="_blank" rel="noopener noreferrer" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">Telegram</a>
            <a href="/rss.xml" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">RSS feed</a>
            <Link href="/donate" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">Support BOBR</Link>
          </nav>

          <nav className="flex flex-col gap-1.5">
            <span className="kicker mb-1 text-ink-soft/60">Site</span>
            <Link href="/about" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">About</Link>
            <Link href="/contact" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">Contact</Link>
            <Link href="/services" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">Services</Link>
            <Link href="/editorial-policy" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">Editorial Policy</Link>
            <Link href="/privacy-policy" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">Privacy Policy</Link>
            <Link href="/cookie-policy" className="text-sm text-ink-soft transition-colors hover:text-bobr-600">Cookie Policy</Link>
          </nav>
        </div>

        <p className="mt-10 border-t border-rule pt-6 text-xs text-ink-soft/70">
          © {new Date().getFullYear()} BOBR · basedbobr.com — Not financial advice. DYOR, anon.
        </p>
      </div>
    </footer>
  );
}
