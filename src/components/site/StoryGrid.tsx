import type { Post } from "@/cms/types";
import StoryCard from "./StoryCard";

// Responsive feature grid with hairline column rules for the newspaper feel.
export default function StoryGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
      {posts.map((post) => (
        <StoryCard key={post.id} post={post} variant="feature" />
      ))}
    </div>
  );
}
