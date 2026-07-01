import type { Post } from '../../types';
import { DEFAULT_CATEGORIES, type CategoryMap } from '../../config';
import BlogCard from './BlogCard';

export default function RelatedPosts({
  posts,
  categories = DEFAULT_CATEGORIES,
  blogBasePath = '/blog',
}: {
  posts: Post[];
  categories?: CategoryMap;
  blogBasePath?: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} categories={categories} blogBasePath={blogBasePath} />
        ))}
      </div>
    </section>
  );
}
