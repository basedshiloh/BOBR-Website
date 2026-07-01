import { defineConfig, type CategoryMap } from "@/cms/config";

// ─── BOBR news beats ─────────────────────────────────────
// Each category maps to Tailwind badge classes. These class strings are LITERAL
// here so Tailwind v4 discovers them when scanning source (no safelist needed).
export const CATEGORIES: CategoryMap = {
  builders: {
    label: "Builders",
    bg: "bg-blue-100",
    text: "text-blue-700",
    darkBg: "dark:bg-blue-900",
    darkText: "dark:text-blue-300",
  },
  base: {
    label: "Base",
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    darkBg: "dark:bg-indigo-900",
    darkText: "dark:text-indigo-300",
  },
  markets: {
    label: "Markets",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    darkBg: "dark:bg-emerald-900",
    darkText: "dark:text-emerald-300",
  },
  culture: {
    label: "Culture",
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-700",
    darkBg: "dark:bg-fuchsia-900",
    darkText: "dark:text-fuchsia-300",
  },
  guides: {
    label: "Guides",
    bg: "bg-amber-100",
    text: "text-amber-800",
    darkBg: "dark:bg-amber-900",
    darkText: "dark:text-amber-300",
  },
  news: {
    label: "News",
    bg: "bg-rose-100",
    text: "text-rose-700",
    darkBg: "dark:bg-rose-900",
    darkText: "dark:text-rose-300",
  },
};

// Ordered list used by the site nav / category pages.
export const CATEGORY_ORDER = [
  "builders",
  "base",
  "markets",
  "culture",
  "guides",
  "news",
] as const;

const polarisConfig = defineConfig({
  brandName: "BOBR CMS",
  categories: CATEGORIES,
  blogBasePath: "/blog",
  siteHost: "basedbobr.com",
  uploadBucket: "blog-images",
  defaultAuthor: {
    name: "BOBR Desk",
    bio: "Dispatches from the trenches — builder-first crypto coverage.",
  },
  features: { linkGenius: true },
});

export default polarisConfig;
