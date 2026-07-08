import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthorBySlug } from '@/cms/server/authors';
import { getAllPostsAdmin } from '@/cms/server/posts';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: 'Author not found' };
  return { title: `${author.name} — BOBR`, description: author.bio };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const allPosts = await getAllPostsAdmin();
  const posts = allPosts.filter(p => p.status === 'published' && p.author.name === author.name);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-start gap-6 mb-10 pb-10 border-b border-rule">
        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-blue-100">
          {author.avatar ? (
            <Image src={author.avatar} alt={author.name} width={80} height={80} className="w-full h-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-blue-600">{author.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">{author.name}</h1>
          {author.bio && <p className="mt-2 text-ink-soft max-w-xl">{author.bio}</p>}
          <div className="flex items-center gap-4 mt-3">
            {author.xUrl && <a href={author.xUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-bobr-600 hover:underline">X / Twitter</a>}
            {author.githubUrl && <a href={author.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-bobr-600 hover:underline">GitHub</a>}
            {author.websiteUrl && <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-bobr-600 hover:underline">Website</a>}
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold mb-6">Posts by {author.name}</h2>
      {posts.length === 0 ? (
        <p className="text-ink-soft">No published posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <div className="flex items-start justify-between gap-4 py-4 border-b border-rule">
                <div>
                  <h3 className="font-semibold group-hover:text-bobr-600 transition-colors">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-ink-soft mt-1 line-clamp-2">{post.excerpt}</p>}
                </div>
                <time className="text-xs text-ink-soft shrink-0">{post.date}</time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
