import db from '../../lib/db';
import type { Post } from '../types';

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  meta_description: string;
  focus_keyword: string;
  category: string;
  author_name: string;
  author_bio: string;
  content: string;
  featured_image: string;
  featured_image_alt: string;
  summary: unknown;
  tags: unknown;
  reading_time: number;
  status: string;
  intent: string | null;
  is_pillar: boolean | null;
  pillar_id: string | null;
  seo_score: number | null;
  // postgres package returns timestamptz as Date objects at runtime
  published_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  categories: string[] | null;
  author_id: string | null;
  // aliased from LEFT JOIN authors
  author_slug: string | null;
  author_x_url: string | null;
  author_github_url: string | null;
  author_website_url: string | null;
  author_joined_avatar: string | null;
}

const INTENTS = ['informational', 'commercial', 'transactional', 'navigational'] as const;

function toIso(v: Date | string | null | undefined): string {
  if (!v) return new Date().toISOString();
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string');
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function rowToPost(r: PostRow): Post {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    metaDescription: r.meta_description || r.excerpt,
    focusKeyword: r.focus_keyword || '',
    category: Array.isArray(r.categories) && r.categories.length > 0
      ? r.categories[0]
      : (r.category || '').toLowerCase(),
    categories: Array.isArray(r.categories) && r.categories.length > 0
      ? r.categories
      : r.category ? [(r.category || '').toLowerCase()] : [],
    author: {
      name: r.author_name,
      bio: r.author_bio,
      avatar: r.author_joined_avatar || 'https://basedbobr.b-cdn.net/basedbobr/nft%20bver.webp',
      slug: r.author_slug || undefined,
      xUrl: r.author_x_url || undefined,
      githubUrl: r.author_github_url || undefined,
      websiteUrl: r.author_website_url || undefined,
    },
    content: r.content,
    featuredImage: r.featured_image,
    featuredImageAlt: r.featured_image_alt,
    summary: toStringArray(r.summary),
    tags: toStringArray(r.tags),
    readingTime: r.reading_time,
    status: r.status === 'published' ? 'published' : 'draft',
    intent: (INTENTS.includes(r.intent as typeof INTENTS[number]) ? r.intent : 'informational') as Post['intent'],
    isPillar: !!r.is_pillar,
    pillarId: r.pillar_id || null,
    seoScore: r.seo_score ?? 0,
    date: toIso(r.published_at || r.created_at).slice(0, 10),
    updatedDate: r.updated_at ? toIso(r.updated_at).slice(0, 10) : undefined,
  };
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const rows = await db`
      SELECT p.*, a.slug AS author_slug, a.x_url AS author_x_url,
        a.github_url AS author_github_url, a.website_url AS author_website_url,
        a.avatar AS author_joined_avatar
      FROM posts p LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.status = 'published' ORDER BY p.published_at DESC
    `;
    return rows.map((r) => rowToPost(r as unknown as PostRow));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const [row] = await db`
      SELECT p.*, a.slug AS author_slug, a.x_url AS author_x_url,
        a.github_url AS author_github_url, a.website_url AS author_website_url,
        a.avatar AS author_joined_avatar
      FROM posts p LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.slug = ${slug} AND p.status = 'published' LIMIT 1
    `;
    return row ? rowToPost(row as unknown as PostRow) : null;
  } catch {
    return null;
  }
}

export async function getRelatedPosts(slug: string, category: string, limit = 3): Promise<Post[]> {
  try {
    const rows = await db`
      SELECT p.*, a.slug AS author_slug, a.x_url AS author_x_url,
        a.github_url AS author_github_url, a.website_url AS author_website_url,
        a.avatar AS author_joined_avatar
      FROM posts p LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.status = 'published' AND p.category = ${category} AND p.slug != ${slug}
      ORDER BY p.published_at DESC
      LIMIT ${limit}
    `;
    return rows.map((r) => rowToPost(r as unknown as PostRow));
  } catch {
    return [];
  }
}

export async function getPaginatedPosts(page: number, perPage = 9, category?: string) {
  let all = await getPublishedPosts();
  const activeCategory = category || undefined;
  if (activeCategory) all = all.filter((p) => p.categories.includes(activeCategory));
  const totalPages = Math.ceil(all.length / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * perPage;
  return {
    posts: all.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalPosts: all.length,
    activeCategory,
  };
}

// ── Admin ──────────────────────────────────────────────────

export async function getAllPostsAdmin(): Promise<Post[]> {
  try {
    const rows = await db`
      SELECT p.*, a.slug AS author_slug, a.x_url AS author_x_url,
        a.github_url AS author_github_url, a.website_url AS author_website_url,
        a.avatar AS author_joined_avatar
      FROM posts p LEFT JOIN authors a ON p.author_id = a.id
      ORDER BY p.updated_at DESC
    `;
    return rows.map((r) => rowToPost(r as unknown as PostRow));
  } catch {
    return [];
  }
}

export async function getPostByIdAdmin(id: string): Promise<Post | null> {
  try {
    const [row] = await db`
      SELECT p.*, a.slug AS author_slug, a.x_url AS author_x_url,
        a.github_url AS author_github_url, a.website_url AS author_website_url,
        a.avatar AS author_joined_avatar
      FROM posts p LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.id = ${id} LIMIT 1
    `;
    return row ? rowToPost(row as unknown as PostRow) : null;
  } catch {
    return null;
  }
}
