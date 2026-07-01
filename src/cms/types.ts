// ─── CMS / blog domain types (project-agnostic) ──────────

export type PostStatus = 'draft' | 'published';
export type PostIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio: string;
}

// A CMS-managed post (maps to the Supabase `posts` table).
// `category` is a free-form string; its display styling comes from the
// consumer-supplied category map (see PolarisConfig.categories).
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  focusKeyword: string;
  category: string;
  author: BlogAuthor;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  summary: string[];
  tags: string[];
  readingTime: number;
  status: PostStatus;
  intent: PostIntent;
  isPillar: boolean;
  pillarId: string | null;
  seoScore: number;
  date: string;         // published_at (or created_at) ISO string
  updatedDate?: string; // updated_at ISO string
}

export interface Comment {
  id: string;
  page_id: string;
  page_type: string;
  author_name: string;
  content: string;
  created_at: string;
  hidden?: boolean;
  parent_id?: string | null;
}

// ─── Internal-linking ────────────────────────────────────

// A page that posts can link to. Blog posts are added automatically; extra
// targets (docs, products, lessons, …) come from PolarisConfig.getLinkTargets.
export interface LinkTarget {
  title: string;
  url: string;
  type: string;        // e.g. 'Blog', 'Doc', 'Product' — used for grouping/icons
  keywords: string[];
  isPillar?: boolean;
}

// A page whose body should be scanned by the Link Manager audit. Blog posts are
// added automatically; extra pages come from PolarisConfig.getAuditTargets.
export interface AuditTarget {
  id: string;
  title: string;
  kind: string;        // e.g. 'Post', 'Doc'
  url: string;
  text: string;        // the text/markdown to scan for links
}
