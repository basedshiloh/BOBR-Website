import Link from "next/link";
import { getPublishedPosts } from "@/cms/server/posts";
import AdSlot from "@/cms/ads/AdSlot";
import StoryCard from "@/components/site/StoryCard";
import StoryGrid from "@/components/site/StoryGrid";
import TrenchesRail from "@/components/site/TrenchesRail";

export const dynamic = "force-dynamic";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="kicker text-bobr-700">{children}</h2>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}

function EmptyNewsroom() {
  return (
    <div className="mx-auto max-w-xl rounded-md border border-dashed border-rule bg-paper-card px-6 py-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-bobr-500 text-2xl">
        🦫
      </div>
      <h2 className="font-display text-2xl font-bold">The newsroom is warming up</h2>
      <p className="mt-2 text-ink-soft">
        No dispatches published yet. Head to the CMS to write the first one — the
        beaver is ready to build.
      </p>
      <Link
        href="/polaris"
        className="mt-5 inline-block rounded-full bg-bobr-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
      >
        Open the CMS →
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const posts = await getPublishedPosts();

  const lead = posts[0];
  const secondary = posts.slice(1, 5);
  const gridPosts = posts.slice(5, 11);
  const trenches = posts.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <AdSlot placement="home_top" />

      {posts.length === 0 ? (
        <EmptyNewsroom />
      ) : (
        <>
          {/* Hero: lead story + secondary headlines */}
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {lead && <StoryCard post={lead} variant="lead" priority />}
            </div>
            <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-6">
              <SectionLabel>Also in the paper</SectionLabel>
              <div className="divide-y divide-rule">
                {secondary.map((post) => (
                  <StoryCard key={post.id} post={post} variant="compact" />
                ))}
              </div>
            </aside>
          </section>

          <div className="my-10 border-t border-rule pt-2">
            <AdSlot placement="home_mid" />
          </div>

          {/* Latest grid + sidebar */}
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SectionLabel>Latest dispatches</SectionLabel>
              {gridPosts.length > 0 ? (
                <StoryGrid posts={gridPosts} />
              ) : (
                <p className="text-sm text-ink-soft">More stories coming soon.</p>
              )}
            </div>
            <aside className="space-y-8 lg:col-span-4 lg:border-l lg:border-rule lg:pl-6">
              <AdSlot placement="home_sidebar" className="!my-0" />
              <TrenchesRail posts={trenches} />
            </aside>
          </section>
        </>
      )}
    </div>
  );
}
