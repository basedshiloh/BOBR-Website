import { getPublishedPosts } from "@/cms/server/posts";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/polaris.config";

export const dynamic = "force-dynamic";

const BASE = "https://basedbobr.com";

export async function GET() {
  const posts = await getPublishedPosts();

  const categoryDescriptions: Record<string, string> = {
    builders: "Guides and insights for people building on Base and other chains",
    markets: "Market analysis and on-chain commentary",
    culture: "Degen culture, community, and the human side of crypto",
    guides: "Step-by-step guides for builders and degens",
    news: "Breaking news and analysis from the crypto space",
  };

  const categoryLines = CATEGORY_ORDER.map((key) => {
    const cat = CATEGORIES[key];
    const desc = categoryDescriptions[key] ?? cat.label;
    return `- [${cat.label}](${BASE}/${key}): ${desc}`;
  }).join("\n");

  const postLines = posts
    .slice(0, 20)
    .map((p) => {
      const desc = p.excerpt || p.metaDescription || "";
      return `- [${p.title}](${BASE}/blog/${p.slug})${desc ? `: ${desc}` : ""}`;
    })
    .join("\n");

  const body = `# BOBR

> Builder-first crypto news, from the trenches. BOBR covers Base blockchain, markets, culture, and builder guides — informative, inclusive, and a little degen.

BOBR began as a community-driven memecoin on the Base blockchain. The token cycle ended, but the community refused to die. Today BOBR is a builder-focused news desk run by Shiloh (Based BOBR dev) and a handful of holdouts — covering crypto, DeFi, and on-chain culture across every chain.

## Sections

${categoryLines}

## Recent posts

${postLines || "- No posts published yet."}

## More

- [RSS feed](${BASE}/rss.xml): Subscribe to all published posts
- [Sitemap](${BASE}/sitemap.xml): Full URL index
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
