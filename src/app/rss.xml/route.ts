import { getPublishedPosts } from "@/cms/server/posts";

export const dynamic = "force-dynamic";

const BASE = "https://basedbobr.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();

  const items = posts
    .slice(0, 30)
    .map((p) => {
      const link = `${BASE}/blog/${p.slug}`;
      const date = p.date ? new Date(p.date).toUTCString() : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <category>${escapeXml(p.category)}</category>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(p.excerpt || p.metaDescription || "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BOBR — Builder-first crypto</title>
    <link>${BASE}/</link>
    <description>Dispatches from the trenches. Base, markets, culture and guides.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
