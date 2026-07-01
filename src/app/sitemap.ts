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

  return [
    { url: BASE, changeFrequency: "hourly", priority: 1 },
    ...categoryEntries,
    ...postEntries,
  ];
}
