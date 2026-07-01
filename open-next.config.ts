import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext → Cloudflare Workers adapter config. Defaults are fine for this app;
// caching uses the Worker's in-memory/edge cache. R2/KV incremental caches can
// be added later if we enable ISR.
export default defineCloudflareConfig();
