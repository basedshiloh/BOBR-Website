import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/polaris", "/api"],
    },
    sitemap: "https://basedbobr.com/sitemap.xml",
  };
}
