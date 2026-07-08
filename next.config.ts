import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal standalone server bundle — required for Docker deployment.
  // node server.js is the entrypoint; no node_modules copy needed in the image.
  output: "standalone",
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      // External images editors may reference (Unsplash for seed content, etc.)
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
