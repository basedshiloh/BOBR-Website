export const dynamic = 'force-dynamic';
import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/cms/server/posts";
import { CATEGORY_ORDER } from "@/lib/polaris.config";

const BASE = "https://basedbobr.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.updatedDate || p.date || undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORY_ORDER.map((c) => ({
    url: `${BASE}/${c}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/services/nft-mint-website`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/crypto-community-manager`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/donate`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/editorial-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/cookie-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    { url: `${BASE}/`, changeFrequency: "hourly", priority: 1 },
    ...categoryEntries,
    ...staticPages,
    ...postEntries,
  ];
}
