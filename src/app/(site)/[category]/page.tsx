import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPaginatedPosts } from "@/cms/server/posts";
import AdSlot from "@/cms/ads/AdSlot";
import StoryGrid from "@/components/site/StoryGrid";
import Pager from "@/components/site/Pager";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/polaris.config";

export const dynamic = "force-dynamic";

const DESCRIPTIONS: Record<string, string> = {
  builders: "Tools, protocols and the people shipping them.",
  base: "Everything happening on Base — the builder chain.",
  markets: "Price, liquidity and on-chain flows, without the hopium.",
  culture: "Memes, mascots and life in the trenches.",
  guides: "How-tos and explainers for degens and builders alike.",
  news: "The latest across crypto, fast.",
};

function isCategory(slug: string): boolean {
  return (CATEGORY_ORDER as readonly string[]).includes(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return { title: "Not found" };
  const label = CATEGORIES[category].label;
  return {
    title: label,
    description: DESCRIPTIONS[category],
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, currentPage, totalPages } = await getPaginatedPosts(page, 12, category);
  const label = CATEGORIES[category].label;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <AdSlot placement="home_top" />

      <header className="mb-8 border-b border-rule pb-6">
        <p className="kicker text-bobr-700">Section</p>
        <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">{label}</h1>
        {DESCRIPTIONS[category] && (
          <p className="mt-2 max-w-2xl text-ink-soft">{DESCRIPTIONS[category]}</p>
        )}
      </header>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-ink-soft">
          No stories in {label} yet — check back soon.
        </p>
      ) : (
        <>
          <StoryGrid posts={posts} />
          <Pager basePath={`/${category}`} currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
