import Link from "next/link";
import Masthead from "@/components/site/Masthead";
import Footer from "@/components/site/Footer";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/polaris.config";

// Root-level fallback — only fires for URLs outside the (site) route group.
// For normal site 404s, src/app/(site)/not-found.tsx handles it via the layout.
export default function NotFound() {
  return (
    <>
      <Masthead />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <div className="relative flex items-center justify-center">
          <span className="select-none font-display text-[9rem] font-black leading-none text-bobr-100 sm:text-[12rem]" aria-hidden>
            404
          </span>
          <span className="absolute text-5xl sm:text-6xl" role="img" aria-label="BOBR beaver">🦫</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">This page got rekt.</h1>
        <p className="mt-3 max-w-md text-center leading-relaxed text-ink-soft">
          The block you were looking for doesn&apos;t exist — maybe it moved, got renamed, or just got liquidated.
        </p>
        <div className="mt-8"><Link href="/" className="rounded-full bg-bobr-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bobr-700">← Back to home</Link></div>
        <div className="mt-10 w-full max-w-sm">
          <p className="kicker mb-4 text-center text-ink-soft">Browse a section</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORY_ORDER.map((key) => (
              <Link key={key} href={`/${key}`} className="rounded-md border border-rule bg-paper-card px-3 py-2.5 text-center text-sm font-medium text-ink-soft transition-colors hover:border-bobr-300 hover:text-bobr-700">
                {CATEGORIES[key].label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
