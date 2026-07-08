import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal standalone server bundle — required for Docker deployment.
  // node server.js is the entrypoint; no node_modules copy needed in the image.
  output: "standalone",
  turbopack: { root: __dirname },
  images: {
    // Allow any HTTPS image — editors paste external URLs into the CMS.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
