import db from '../../lib/db';
import type { Ad, AdType } from './placements';

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
    type: (r.type === 'script' ? 'script' : 'image') as AdType,
    imageUrl: r.image_url ?? '',
    linkUrl: r.link_url ?? '',
    html: r.html ?? '',
    label: r.label ?? 'Sponsored',
    active: r.active,
    weight: r.weight ?? 100,
    startsAt: r.starts_at,
    endsAt: r.ends_at,
  };
}

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

export async function getActiveAd(placement: string): Promise<Ad | null> {
  try {
    const rows = await db`
      SELECT * FROM ad_slots
      WHERE placement = ${placement}
        AND active = true
        AND (starts_at IS NULL OR starts_at <= now())
        AND (ends_at IS NULL OR ends_at >= now())
    `;
    return weightedPick((rows as unknown as AdRow[]).map(rowToAd));
  } catch {
    return null;
  }
}

export async function listAdsAdmin(): Promise<Ad[]> {
  try {
    const rows = await db`SELECT * FROM ad_slots ORDER BY placement ASC, created_at DESC`;
    return (rows as unknown as AdRow[]).map(rowToAd);
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
  try {
    const name = input.name.trim() || 'Untitled ad';
    const type = input.type === 'script' ? 'script' : 'image';
    const weight = Number.isFinite(input.weight) ? Number(input.weight) : 100;
    const active = input.active ?? true;

    if (input.id) {
      await db`
        UPDATE ad_slots SET
          name = ${name}, placement = ${input.placement}, type = ${type},
          image_url = ${input.imageUrl ?? ''}, link_url = ${input.linkUrl ?? ''},
          html = ${input.html ?? ''}, label = ${input.label ?? 'Sponsored'},
          active = ${active}, weight = ${weight},
          starts_at = ${input.startsAt ?? null}, ends_at = ${input.endsAt ?? null},
          updated_at = now()
        WHERE id = ${input.id}
      `;
    } else {
      await db`
        INSERT INTO ad_slots (name, placement, type, image_url, link_url, html, label, active, weight, starts_at, ends_at)
        VALUES (${name}, ${input.placement}, ${type}, ${input.imageUrl ?? ''},
                ${input.linkUrl ?? ''}, ${input.html ?? ''}, ${input.label ?? 'Sponsored'},
                ${active}, ${weight}, ${input.startsAt ?? null}, ${input.endsAt ?? null})
      `;
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function deleteAd(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await db`DELETE FROM ad_slots WHERE id = ${id}`;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function setAdActive(id: string, active: boolean): Promise<{ ok: boolean; error?: string }> {
  try {
    await db`UPDATE ad_slots SET active = ${active}, updated_at = now() WHERE id = ${id}`;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
