// Server-only ad data helpers. Public reads use the anon key (RLS limits to
// active, in-window ads); admin writes use the service role via adminClient().
import { createClient } from "@supabase/supabase-js";
import { adminClient } from "../server/posts";
import type { Ad, AdType } from "./placements";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function publicClient() {
  return createClient(url, anonKey);
}

interface AdRow {
  id: string;
  name: string;
  placement: string;
  type: string;
  image_url: string | null;
  link_url: string | null;
  html: string | null;
  label: string | null;
  active: boolean;
  weight: number | null;
  starts_at: string | null;
  ends_at: string | null;
}

function rowToAd(r: AdRow): Ad {
  return {
    id: r.id,
    name: r.name,
    placement: r.placement,
    type: (r.type === "script" ? "script" : "image") as AdType,
    imageUrl: r.image_url ?? "",
    linkUrl: r.link_url ?? "",
    html: r.html ?? "",
    label: r.label ?? "Sponsored",
    active: r.active,
    weight: r.weight ?? 100,
    startsAt: r.starts_at,
    endsAt: r.ends_at,
  };
}

// Weighted-random pick so multiple ads in one zone rotate by their `weight`.
function weightedPick(ads: Ad[]): Ad | null {
  if (ads.length === 0) return null;
  if (ads.length === 1) return ads[0];
  const total = ads.reduce((sum, a) => sum + Math.max(1, a.weight), 0);
  let r = Math.random() * total;
  for (const a of ads) {
    r -= Math.max(1, a.weight);
    if (r <= 0) return a;
  }
  return ads[0];
}

/**
 * Returns one active ad for a placement (weighted rotation), or null if the zone
 * is empty. Fails soft (returns null) if the ad_slots table doesn't exist yet,
 * so the site renders fine before the ads migration is applied.
 */
export async function getActiveAd(placement: string): Promise<Ad | null> {
  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await publicClient()
      .from("ad_slots")
      .select("*")
      .eq("placement", placement)
      .eq("active", true)
      .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
      .or(`ends_at.is.null,ends_at.gte.${nowIso}`);
    if (error || !data) return null;
    return weightedPick((data as AdRow[]).map(rowToAd));
  } catch {
    return null;
  }
}

// ─── Admin CRUD (service role) ───────────────────────────

export async function listAdsAdmin(): Promise<Ad[]> {
  try {
    const { data, error } = await adminClient()
      .from("ad_slots")
      .select("*")
      .order("placement", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as AdRow[]).map(rowToAd);
  } catch {
    return [];
  }
}

export interface AdInput {
  id?: string;
  name: string;
  placement: string;
  type: AdType;
  imageUrl?: string;
  linkUrl?: string;
  html?: string;
  label?: string;
  active?: boolean;
  weight?: number;
  startsAt?: string | null;
  endsAt?: string | null;
}

export async function saveAd(input: AdInput): Promise<{ ok: boolean; error?: string }> {
  const row = {
    name: input.name.trim() || "Untitled ad",
    placement: input.placement,
    type: input.type === "script" ? "script" : "image",
    image_url: input.imageUrl ?? "",
    link_url: input.linkUrl ?? "",
    html: input.html ?? "",
    label: input.label ?? "Sponsored",
    active: input.active ?? true,
    weight: Number.isFinite(input.weight) ? Number(input.weight) : 100,
    starts_at: input.startsAt || null,
    ends_at: input.endsAt || null,
  };
  const db = adminClient();
  const { error } = input.id
    ? await db.from("ad_slots").update(row).eq("id", input.id)
    : await db.from("ad_slots").insert(row);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteAd(id: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await adminClient().from("ad_slots").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function setAdActive(id: string, active: boolean): Promise<{ ok: boolean; error?: string }> {
  const { error } = await adminClient().from("ad_slots").update({ active }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
