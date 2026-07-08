import fs from 'fs';
import path from 'path';
import db from './db';

const BACKUP_DIR = path.join(process.cwd(), 'public', 'uploads', 'backups');
const SCHEDULE_FILE = path.join(BACKUP_DIR, '.schedule.json');

function ensureDir() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export interface BackupMeta {
  filename: string;
  createdAt: string;
  trigger: 'manual' | 'scheduled' | 'on-publish';
  postCount: number;
  authorCount: number;
  sizeBytes: number;
}

export interface ScheduleConfig {
  enabled: boolean;
  interval: 'daily' | 'weekly';
  lastBackupAt: string | null;
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createBackup(trigger: BackupMeta['trigger'] = 'manual'): Promise<string> {
  ensureDir();
  const [posts, authors] = await Promise.all([
    db`SELECT * FROM posts ORDER BY created_at ASC`,
    db`SELECT * FROM authors ORDER BY created_at ASC`,
  ]);
  const now = new Date().toISOString();
  const filename = `backup-${now.replace(/[:.]/g, '-')}.json`;
  const payload = { version: 1, createdAt: now, trigger, postCount: posts.length, authorCount: authors.length, posts, authors };
  fs.writeFileSync(path.join(BACKUP_DIR, filename), JSON.stringify(payload, null, 2));
  return filename;
}

// ── List ──────────────────────────────────────────────────────────────────────

export function listBackups(): BackupMeta[] {
  ensureDir();
  return fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith('backup-') && f.endsWith('.json'))
    .sort()
    .reverse()
    .map((filename) => {
      const fp = path.join(BACKUP_DIR, filename);
      const stat = fs.statSync(fp);
      try {
        const d = JSON.parse(fs.readFileSync(fp, 'utf-8'));
        return { filename, createdAt: d.createdAt, trigger: d.trigger ?? 'manual', postCount: d.postCount ?? 0, authorCount: d.authorCount ?? 0, sizeBytes: stat.size };
      } catch {
        return { filename, createdAt: stat.mtime.toISOString(), trigger: 'manual' as const, postCount: 0, authorCount: 0, sizeBytes: stat.size };
      }
    });
}

export function getBackupPosts(filename: string): Array<{ id: string; title: string; slug: string; status: string }> {
  const fp = path.join(BACKUP_DIR, path.basename(filename));
  if (!fs.existsSync(fp)) return [];
  try {
    const d = JSON.parse(fs.readFileSync(fp, 'utf-8'));
    return (d.posts ?? []).map((p: Record<string, unknown>) => ({
      id: String(p.id ?? ''),
      title: String(p.title ?? ''),
      slug: String(p.slug ?? ''),
      status: String(p.status ?? 'draft'),
    }));
  } catch {
    return [];
  }
}

// ── Restore helpers ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function str(v: any, fallback = ''): string { return v != null ? String(v) : fallback; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function num(v: any, fallback = 0): number { return v != null ? Number(v) : fallback; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bool(v: any): boolean { return !!v; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ts(v: any): string | null { if (!v) return null; try { return new Date(v).toISOString(); } catch { return null; } }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function arr(v: any): string[] { return Array.isArray(v) ? v.map(String) : []; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonb(v: any): string { return JSON.stringify(Array.isArray(v) ? v : []); }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsertPost(p: Record<string, any>) {
  await db`
    INSERT INTO posts (
      id, slug, title, excerpt, meta_description, focus_keyword,
      category, categories, author_id, author_name, author_bio,
      content, featured_image, featured_image_alt,
      summary, tags, reading_time, status, intent,
      is_pillar, pillar_id, seo_score, published_at, created_at, updated_at
    ) VALUES (
      ${str(p.id)}, ${str(p.slug)}, ${str(p.title)}, ${str(p.excerpt)},
      ${str(p.meta_description)}, ${str(p.focus_keyword)},
      ${str(p.category)}, ${arr(p.categories)},
      ${str(p.author_id) || null}, ${str(p.author_name)}, ${str(p.author_bio)},
      ${str(p.content)}, ${str(p.featured_image)}, ${str(p.featured_image_alt)},
      ${jsonb(p.summary)}::jsonb, ${jsonb(p.tags)}::jsonb,
      ${num(p.reading_time, 1)}, ${str(p.status, 'draft')}, ${str(p.intent, 'informational')},
      ${bool(p.is_pillar)}, ${str(p.pillar_id) || null}, ${num(p.seo_score)},
      ${ts(p.published_at)}, ${ts(p.created_at) ?? new Date().toISOString()}, ${ts(p.updated_at) ?? new Date().toISOString()}
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug, title = EXCLUDED.title, excerpt = EXCLUDED.excerpt,
      meta_description = EXCLUDED.meta_description, focus_keyword = EXCLUDED.focus_keyword,
      category = EXCLUDED.category, categories = EXCLUDED.categories,
      author_id = EXCLUDED.author_id, author_name = EXCLUDED.author_name, author_bio = EXCLUDED.author_bio,
      content = EXCLUDED.content, featured_image = EXCLUDED.featured_image, featured_image_alt = EXCLUDED.featured_image_alt,
      summary = EXCLUDED.summary, tags = EXCLUDED.tags, reading_time = EXCLUDED.reading_time,
      status = EXCLUDED.status, intent = EXCLUDED.intent, is_pillar = EXCLUDED.is_pillar,
      pillar_id = EXCLUDED.pillar_id, seo_score = EXCLUDED.seo_score,
      published_at = EXCLUDED.published_at, updated_at = EXCLUDED.updated_at
  `;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsertAuthor(a: Record<string, any>) {
  await db`
    INSERT INTO authors (id, slug, name, bio, avatar, x_url, github_url, website_url, created_at)
    VALUES (
      ${str(a.id)}, ${str(a.slug)}, ${str(a.name)}, ${str(a.bio)},
      ${str(a.avatar)}, ${str(a.x_url)}, ${str(a.github_url)}, ${str(a.website_url)},
      ${ts(a.created_at) ?? new Date().toISOString()}
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug, name = EXCLUDED.name, bio = EXCLUDED.bio,
      avatar = EXCLUDED.avatar, x_url = EXCLUDED.x_url,
      github_url = EXCLUDED.github_url, website_url = EXCLUDED.website_url
  `;
}

// ── Restore all ───────────────────────────────────────────────────────────────

export async function restoreBackup(filename: string): Promise<{ posts: number; authors: number }> {
  const fp = path.join(BACKUP_DIR, path.basename(filename));
  if (!fs.existsSync(fp)) throw new Error('Backup file not found');
  const data = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  let posts = 0;
  let authors = 0;
  for (const a of (data.authors ?? [])) { await upsertAuthor(a); authors++; }
  for (const p of (data.posts ?? [])) { await upsertPost(p); posts++; }
  return { posts, authors };
}

// ── Restore single post ───────────────────────────────────────────────────────

export async function restorePost(filename: string, postId: string): Promise<boolean> {
  const fp = path.join(BACKUP_DIR, path.basename(filename));
  if (!fs.existsSync(fp)) throw new Error('Backup file not found');
  const data = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  const post = (data.posts ?? []).find((p: Record<string, unknown>) => p.id === postId);
  if (!post) return false;
  await upsertPost(post);
  return true;
}

// ── Delete ────────────────────────────────────────────────────────────────────

export function deleteBackup(filename: string): void {
  const fp = path.join(BACKUP_DIR, path.basename(filename));
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
}

// ── Schedule ──────────────────────────────────────────────────────────────────

export function getSchedule(): ScheduleConfig {
  if (!fs.existsSync(SCHEDULE_FILE)) return { enabled: false, interval: 'daily', lastBackupAt: null };
  try { return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf-8')); } catch { return { enabled: false, interval: 'daily', lastBackupAt: null }; }
}

export function saveSchedule(config: ScheduleConfig): void {
  ensureDir();
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(config, null, 2));
}

export async function checkAndRunScheduledBackup(): Promise<boolean> {
  const schedule = getSchedule();
  if (!schedule.enabled) return false;
  const now = Date.now();
  const last = schedule.lastBackupAt ? new Date(schedule.lastBackupAt).getTime() : 0;
  const intervalMs = schedule.interval === 'weekly' ? 7 * 864e5 : 864e5;
  if (now - last < intervalMs) return false;
  await createBackup('scheduled');
  saveSchedule({ ...schedule, lastBackupAt: new Date().toISOString() });
  return true;
}
