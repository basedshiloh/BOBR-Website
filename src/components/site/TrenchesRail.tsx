import Link from "next/link";
import type { Post } from "@/cms/types";

// "The Trenches" — a playful rail of quick hits. Degen-fun tone, newspaper
// "in brief" column energy. Feeds off the latest posts.
export default function TrenchesRail({ posts }: { posts: Post[] }) {
  return (
    <section className="rounded-md border border-rule bg-paper-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="grid h-6 w-6 place-items-center rounded-full bg-bobr-500 text-xs"
          aria-hidden
        >
          🦫
        </span>
        <h2 className="kicker text-bobr-700">The Trenches</h2>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-ink-soft">
          Quiet in the trenches… for now. New dispatches drop soon, anon.
        </p>
      ) : (
        <ol className="space-y-3">
          {posts.map((p, i) => (
            <li key={p.id} className="flex gap-2.5">
              <span className="font-display text-lg font-bold leading-none text-bobr-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link
                href={`/blog/${p.slug}`}
                className="text-sm font-medium leading-snug transition-colors hover:text-bobr-700"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
