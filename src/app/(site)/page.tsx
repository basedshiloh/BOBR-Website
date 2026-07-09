import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/cms/server/posts";
import AdSlot from "@/cms/ads/AdSlot";
import StoryCard from "@/components/site/StoryCard";
import StoryGrid from "@/components/site/StoryGrid";
import TrenchesRail from "@/components/site/TrenchesRail";
import AboutCard from "@/components/site/AboutCard";
import JsonLd from "@/cms/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "https://basedbobr.com/" },
  keywords: ["crypto news", "Base blockchain", "builder", "defi", "web3", "memecoin", "BOBR"],
  openGraph: {
    url: "https://basedbobr.com/",
  },
};

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
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "BOBR",
        "url": "https://basedbobr.com/",
        "description": "Builder-first crypto news, from the trenches.",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BOBR",
        "url": "https://basedbobr.com/",
      }} />
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
              <AboutCard />
            </div>
            <aside className="mx-auto w-full max-w-sm space-y-8 lg:mx-0 lg:max-w-none lg:col-span-4 lg:border-l lg:border-rule lg:pl-6">
              <AdSlot placement="home_sidebar" />
              <TrenchesRail posts={trenches} />
            </aside>
          </section>
        </>
      )}
    </div>
  );
}
