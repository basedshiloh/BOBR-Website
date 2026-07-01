// ─── Ad placement zones ──────────────────────────────────
// Named slots the frontend renders via <AdSlot placement="..." />. Admins assign
// ads to these zones from the CMS Ads tab. Add a zone here + drop an <AdSlot />
// where you want it to appear — that's the whole "configurable via CMS" surface.

export interface PlacementDef {
  id: string;
  label: string;
  hint: string; // recommended banner size / usage note
}

export const AD_PLACEMENTS: PlacementDef[] = [
  { id: "home_top", label: "Homepage — Top", hint: "Leaderboard, ~970×90 or 728×90" },
  { id: "home_mid", label: "Homepage — Mid-feed", hint: "Leaderboard, ~728×90" },
  { id: "home_sidebar", label: "Homepage — Sidebar", hint: "Rectangle, ~300×250" },
  { id: "post_before", label: "Post — Before content", hint: "Leaderboard, ~728×90" },
  { id: "post_after", label: "Post — After content", hint: "Leaderboard, ~728×90" },
  { id: "post_sidebar", label: "Post — Sidebar", hint: "Rectangle, ~300×250" },
  { id: "global_footer", label: "Global — Footer", hint: "Leaderboard, ~728×90" },
];

export const PLACEMENT_IDS = AD_PLACEMENTS.map((p) => p.id);

export function placementLabel(id: string): string {
  return AD_PLACEMENTS.find((p) => p.id === id)?.label ?? id;
}

export type AdType = "image" | "script";

// App-level ad shape (camelCase; maps to the snake_case `ad_slots` row).
export interface Ad {
  id: string;
  name: string;
  placement: string;
  type: AdType;
  imageUrl: string;
  linkUrl: string;
  html: string;
  label: string;
  active: boolean;
  weight: number;
  startsAt: string | null;
  endsAt: string | null;
}
