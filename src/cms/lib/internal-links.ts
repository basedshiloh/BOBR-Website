import type { LinkTarget } from '../types';

export type { LinkTarget };

function keywordsFromTitle(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

// Build a LinkTarget for a blog post.
function postTarget(
  p: { title: string; slug: string; tags?: string[]; isPillar?: boolean },
  blogBasePath: string
): LinkTarget {
  const kw = keywordsFromTitle(p.title);
  if (p.tags) kw.push(...p.tags.map((t) => t.toLowerCase()));
  return { title: p.title, url: `${blogBasePath}/${p.slug}`, type: 'Blog', keywords: kw, isPillar: p.isPillar };
}

// Build the index of internal pages that posts can link to.
//   `posts`       — published blog posts (added as Blog targets)
//   `extraTargets`— consumer-supplied targets (docs, products, lessons…) from
//                   PolarisConfig.getLinkTargets. Their keywords are used as-is
//                   if provided; otherwise derived from the title.
export function buildInternalLinkIndex(
  posts: { title: string; slug: string; tags?: string[]; isPillar?: boolean }[] = [],
  extraTargets: LinkTarget[] = [],
  blogBasePath = '/blog'
): LinkTarget[] {
  const targets: LinkTarget[] = [];

  for (const t of extraTargets) {
    targets.push({
      ...t,
      keywords: t.keywords && t.keywords.length ? t.keywords : keywordsFromTitle(t.title),
    });
  }
  for (const p of posts) {
    targets.push(postTarget(p, blogBasePath));
  }

  return targets;
}

export interface LinkSuggestion {
  phrase: string;
  url: string;
  title: string;
  type: string;
  isPillar?: boolean;
}

// Suggest internal links: a target matches if its full title (or a strong
// multi-word keyword) appears in the content and isn't already a link.
export function suggestLinks(content: string, index: LinkTarget[]): LinkSuggestion[] {
  const lower = content.toLowerCase();
  const out: LinkSuggestion[] = [];
  const seen = new Set<string>();

  // Strip existing markdown links so we don't double-suggest
  const existingLinks = new Set<string>();
  const linkRe = /\]\((\/[^)]+)\)/g;
  let m;
  while ((m = linkRe.exec(content)) !== null) existingLinks.add(m[1]);

  for (const t of index) {
    if (existingLinks.has(t.url)) continue;
    const titleLc = t.title.toLowerCase();
    let phrase: string | null = null;

    if (titleLc.length >= 6 && lower.includes(titleLc)) {
      // find original-cased phrase
      const idx = lower.indexOf(titleLc);
      phrase = content.slice(idx, idx + t.title.length);
    } else {
      // try a strong keyword from the title
      const strong = t.keywords.filter((k) => k.length > 4);
      for (const k of strong) {
        if (lower.includes(k)) {
          const idx = lower.indexOf(k);
          phrase = content.slice(idx, idx + k.length);
          break;
        }
      }
    }

    if (phrase && !seen.has(t.url)) {
      seen.add(t.url);
      out.push({ phrase, url: t.url, title: t.title, type: t.type, isPillar: t.isPillar });
    }
  }

  // Prioritize pillar posts — agents/authors should link to them first.
  out.sort((a, b) => Number(b.isPillar) - Number(a.isPillar));
  return out.slice(0, 12);
}
