import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project — a stray lockfile in the home dir
  // otherwise makes Next infer the wrong root.
  turbopack: { root: __dirname },
  images: {
    // Featured images and ad banners are served from Supabase Storage; seed
    // content may use Unsplash. next/image needs these hosts allow-listed.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
