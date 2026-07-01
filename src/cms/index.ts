// Main entry (@polaris/cms) — client-safe exports: config, types, blog-rendering
// components, comments UI, and pure helper libs. The admin surface lives at
// "@polaris/cms/admin" and route handlers at "@polaris/cms/server" (both are
// server-only and must not be imported into client components).

// Config + types
export {
  defineConfig,
  resolveConfig,
  categoryStyle,
  DEFAULT_CATEGORIES,
  type PolarisConfig,
  type PolarisFeatures,
  type ResolvedConfig,
  type CategoryMap,
  type CategoryStyle,
} from './config';

export type { PolarisSettings } from './settings';

export type { Post, PostStatus, PostIntent, BlogAuthor, Comment, LinkTarget, AuditTarget } from './types';

// Blog-rendering components
export { default as BlogCard } from './components/blog/BlogCard';
export { default as RelatedPosts } from './components/blog/RelatedPosts';
export { default as MarkdownRenderer } from './components/blog/MarkdownRenderer';
export { default as AuthorBox } from './components/blog/AuthorBox';
export { default as SummaryBox } from './components/blog/SummaryBox';
export { default as BlogPagination } from './components/blog/BlogPagination';

// SEO
export { default as JsonLd, articleSchema, breadcrumbSchema, faqSchema } from './components/seo/JsonLd';

// Comments
export { default as CommentSection } from './components/shared/CommentSection';

// Pure helper libraries (safe on client + server)
export { analyzeSeo, type SeoInput, type SeoResult, type SeoCheck } from './lib/seo-analysis';
export { buildInternalLinkIndex, suggestLinks, type LinkSuggestion } from './lib/internal-links';
export { auditFromText, extractLinks, type LinkAudit, type AuditedLink } from './lib/link-audit';
export { buildContentGraph, type ContentGraph, type PillarNode, type ClusterNode } from './lib/content-graph';
export { slugify } from './lib/utils';
