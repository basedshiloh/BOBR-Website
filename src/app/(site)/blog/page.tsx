import type { Metadata } from "next";
import { getPublishedPosts } from "@/cms/server/posts";
import StoryCard from "@/components/site/StoryCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Articles",
  description: "Every dispatch from the BOBR newsroom — builders, markets, culture, and guides.",
  alternates: { canonical: "https://basedbobr.com/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 border-b border-rule pb-6">
        <h1 className="font-display text-4xl font-bold">All Articles</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {posts.length} dispatch{posts.length !== 1 ? "es" : ""} from the trenches
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-ink-soft">No articles published yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <StoryCard key={post.id} post={post} variant="feature" priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
