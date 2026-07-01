import type { LinkTarget, AuditTarget } from './types';

// ─── Category styling ────────────────────────────────────
// Each blog category maps to Tailwind classes for its badge. Because these are
// dynamic class strings, consuming apps must either use the same classes or add
// them to their Tailwind `safelist` (see README).

export interface CategoryStyle {
  label: string;
  bg: string;
  text: string;
  darkBg: string;
  darkText: string;
}

export type CategoryMap = Record<string, CategoryStyle>;

// Neutral fallback used when no config is provided (e.g. a bare component render).
export const DEFAULT_CATEGORIES: CategoryMap = {
  general: { label: 'General', bg: 'bg-gray-100', text: 'text-gray-700', darkBg: 'dark:bg-gray-800', darkText: 'dark:text-gray-300' },
};

// Safe lookup: returns a neutral style if the key isn't in the map.
export function categoryStyle(categories: CategoryMap, key: string): CategoryStyle {
  return (
    categories[key] || {
      label: key || 'Uncategorized',
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      darkBg: 'dark:bg-gray-800',
      darkText: 'dark:text-gray-300',
    }
  );
}

// ─── Config ──────────────────────────────────────────────

export interface PolarisFeatures {
  /** Show the Link Genius index + editor suggestions. Default: true. */
  linkGenius?: boolean;
}

export interface PolarisConfig {
  /** Name shown in the admin shell + login screen. Default: "Polaris CMS". */
  brandName?: string;
  /** Blog categories and their badge styling. */
  categories: CategoryMap;
  /**
   * Default feature toggles. The admin can override these at runtime from the
   * Settings tab (persisted per-browser); these values are the fallback.
   */
  features?: PolarisFeatures;
  /** Root path where published posts live. Default: "/blog". */
  blogBasePath?: string;
  /**
   * Your site's host (e.g. "example.com"). Used by the Link Manager to treat
   * absolute same-site URLs as internal links. Optional.
   */
  siteHost?: string;
  /** Default author applied to new posts created via the API. */
  defaultAuthor?: { name: string; bio: string };
  /** Supabase Storage bucket for uploaded images. Default: "blog-images". */
  uploadBucket?: string;
  /**
   * Extra internal-link targets beyond blog posts (docs, products, lessons…).
   * Surfaced in Link Genius and the link index browser.
   */
  getLinkTargets?: () => Promise<LinkTarget[]> | LinkTarget[];
  /**
   * Extra pages for the Link Manager audit to scan beyond blog posts.
   * Each target supplies the text/markdown whose links should be analyzed.
   */
  getAuditTargets?: () => Promise<AuditTarget[]> | AuditTarget[];
}

// Identity helper for type-checked config authoring in the consuming app.
export function defineConfig(config: PolarisConfig): PolarisConfig {
  return config;
}

// Internal: apply defaults so the rest of the code can assume these exist.
export function resolveConfig(config: PolarisConfig) {
  return {
    brandName: config.brandName ?? 'Polaris CMS',
    categories: config.categories ?? DEFAULT_CATEGORIES,
    features: { linkGenius: config.features?.linkGenius ?? true },
    blogBasePath: (config.blogBasePath ?? '/blog').replace(/\/$/, ''),
    siteHost: config.siteHost ?? '',
    defaultAuthor: config.defaultAuthor ?? { name: '', bio: '' },
    uploadBucket: config.uploadBucket ?? 'blog-images',
    getLinkTargets: config.getLinkTargets,
    getAuditTargets: config.getAuditTargets,
  };
}

export type ResolvedConfig = ReturnType<typeof resolveConfig>;
