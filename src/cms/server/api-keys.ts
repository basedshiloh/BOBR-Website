import crypto from 'crypto';
import db from '../../lib/db';

export interface ApiKeyRecord {
  id: string;
  name: string;
  key_prefix: string;
  revoked: boolean;
  created_at: string;
  last_used_at: string | null;
}

function sha256(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}

export function generateKey() {
  const raw = 'pp_' + crypto.randomBytes(20).toString('hex');
  return { raw, prefix: raw.slice(0, 11), hash: sha256(raw) };
}

export async function createApiKey(name: string): Promise<{ raw: string; record: ApiKeyRecord } | null> {
  const { raw, prefix, hash } = generateKey();
  const [row] = await db`
    INSERT INTO cms_api_keys (name, key_prefix, key_hash)
    VALUES (${name.slice(0, 60) || 'Untitled'}, ${prefix}, ${hash})
    RETURNING id, name, key_prefix, revoked, created_at, last_used_at
  `;
  if (!row) return null;
  return { raw, record: row as unknown as ApiKeyRecord };
}

export async function listApiKeys(): Promise<ApiKeyRecord[]> {
  const rows = await db`
    SELECT id, name, key_prefix, revoked, created_at, last_used_at
    FROM cms_api_keys
    ORDER BY created_at DESC
  `;
  return rows as unknown as ApiKeyRecord[];
}

export async function revokeApiKey(id: string): Promise<boolean> {
  try {
    await db`UPDATE cms_api_keys SET revoked = true WHERE id = ${id}`;
    return true;
  } catch {
    return false;
  }
}

export async function verifyApiKey(raw: string): Promise<boolean> {
  if (!raw || !raw.startsWith('pp_')) return false;
  const hash = sha256(raw);
  const [row] = await db`
    SELECT id FROM cms_api_keys WHERE key_hash = ${hash} AND revoked = false LIMIT 1
  `;
  if (!row) return false;
  void db`UPDATE cms_api_keys SET last_used_at = now() WHERE id = ${row.id}`;
  return true;
}
