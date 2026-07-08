import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { checkCredentials, expectedToken, SESSION_COOKIE, isValidToken } from './cms-auth';
import { isAuthorizedRequest } from './cms-access';
import { getPublishedPosts } from './posts';
import { createApiKey, listApiKeys, revokeApiKey } from './api-keys';
import { analyzeSeo } from '../lib/seo-analysis';
import { slugify } from '../lib/utils';
import { resolveConfig, type PolarisConfig } from '../config';
import db from '../../lib/db';

// ─── Auth: login ─────────────────────────────────────────

const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

export function createLoginRoute() {
  return async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (rateLimited(ip)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const { username, password } = await req.json().catch(() => ({ username: '', password: '' }));
    if (!checkCredentials(String(username || ''), String(password || ''))) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    attempts.delete(ip);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, expectedToken(), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  };
}

export function createLogoutRoute() {
  return async function POST() {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  };
}

// ─── Posts (CRUD + agent-facing API) ─────────────────────

function wordCount(md: string): number {
  return md.trim().split(/\s+/).filter(Boolean).length;
}

const INTENTS = ['informational', 'commercial', 'transactional', 'navigational'];
function normIntent(v: unknown): string {
  const s = String(v || 'informational');
  return INTENTS.includes(s) ? s : 'informational';
}

export function createPostsRoute(config: PolarisConfig) {
  const cfg = resolveConfig(config);

  function revalidateBlog(slug?: string) {
    revalidatePath(cfg.blogBasePath);
    revalidatePath('/sitemap.xml');
    if (slug) revalidatePath(`${cfg.blogBasePath}/${slug}`);
  }

  return async function POST(req: NextRequest) {
    if (!(await isAuthorizedRequest(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === 'list') {
      const posts = await getPublishedPosts();
      return NextResponse.json({
        posts: posts.map((p) => ({
          title: p.title,
          slug: p.slug,
          url: `${cfg.blogBasePath}/${p.slug}`,
          isPillar: p.isPillar,
          intent: p.intent,
          focusKeyword: p.focusKeyword,
        })),
      });
    }

    if (action === 'recompute-scores') {
      const rows = await db`SELECT id, title, meta_description, slug, focus_keyword, content FROM posts`;
      let updated = 0;
      for (const p of rows) {
        const { score } = analyzeSeo({
          title: String(p.title || ''),
          metaDescription: String(p.meta_description || ''),
          slug: String(p.slug || ''),
          focusKeyword: String(p.focus_keyword || ''),
          content: String(p.content || ''),
        });
        await db`UPDATE posts SET seo_score = ${score} WHERE id = ${p.id}`;
        updated++;
      }
      return NextResponse.json({ updated });
    }

    if (action === 'delete') {
      const { id, slug } = body;
      try {
        await db`DELETE FROM posts WHERE id = ${id}`;
        revalidateBlog(slug);
        return NextResponse.json({ ok: true });
      } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
      }
    }

    if (action === 'set-status') {
      const { id, status, slug } = body;
      try {
        if (status === 'published') {
          await db`
            UPDATE posts SET status = ${status}, updated_at = now(),
              published_at = COALESCE(published_at, now())
            WHERE id = ${id}
          `;
        } else {
          await db`UPDATE posts SET status = ${status}, updated_at = now() WHERE id = ${id}`;
        }
        revalidateBlog(slug);
        return NextResponse.json({ ok: true });
      } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
      }
    }

    if (action === 'save') {
      const p = body.post as Record<string, unknown>;
      const title = String(p.title || '').trim();
      const slug = String(p.slug || '').trim() || slugify(title);
      if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

      const content = String(p.content || '');
      const status = p.status === 'published' ? 'published' : 'draft';
      const category = String(p.category || '').toLowerCase().trim();
      // Accept either `categories` array or legacy single `category`
      const rawCats = Array.isArray(p.categories) ? p.categories : category ? [category] : [];
      const categories = rawCats.map((c: unknown) => String(c).toLowerCase().trim()).filter(Boolean);
      const primaryCategory = categories[0] || category;
      const authorId = p.authorId ? String(p.authorId) : null;
      const metaDescription = String(p.metaDescription || p.excerpt || '');
      const focusKeyword = String(p.focusKeyword || '');
      const { score: seoScore } = analyzeSeo({ title, metaDescription, slug, focusKeyword, content });

      const id = p.id ? String(p.id) : '';

      try {
        if (id) {
          const [existing] = await db`SELECT published_at FROM posts WHERE id = ${id}`;
          const isFirstPublish = status === 'published' && !existing?.published_at;
          const publishedAt = isFirstPublish ? new Date().toISOString() : null;

          const [updated] = await db`
            UPDATE posts SET
              slug = ${slug}, title = ${title},
              excerpt = ${String(p.excerpt || '')},
              meta_description = ${metaDescription},
              focus_keyword = ${focusKeyword},
              category = ${primaryCategory},
              categories = ${categories},
              author_id = ${authorId},
              author_name = ${String(p.authorName || cfg.defaultAuthor.name || '')},
              author_bio = ${String(p.authorBio || cfg.defaultAuthor.bio || '')},
              content = ${content},
              featured_image = ${String(p.featuredImage || '')},
              featured_image_alt = ${String(p.featuredImageAlt || '')},
              summary = ${JSON.stringify(Array.isArray(p.summary) ? p.summary : [])}::jsonb,
              tags = ${JSON.stringify(Array.isArray(p.tags) ? p.tags : [])}::jsonb,
              reading_time = ${Math.max(1, Math.round(wordCount(content) / 200))},
              status = ${status},
              intent = ${normIntent(p.intent)},
              is_pillar = ${p.isPillar === true},
              pillar_id = ${p.pillarId ? String(p.pillarId) : null},
              seo_score = ${seoScore},
              updated_at = now()
              ${publishedAt ? db`, published_at = ${publishedAt}` : db``}
            WHERE id = ${id}
            RETURNING id, slug
          `;
          revalidateBlog(slug);
          if (isFirstPublish) {
            import('../../lib/backup').then(({ createBackup }) => createBackup('on-publish')).catch(() => {});
          }
          return NextResponse.json({ ok: true, id: updated.id, slug: updated.slug });
        } else {
          const publishedAt = status === 'published' ? new Date().toISOString() : null;
          const [inserted] = await db`
            INSERT INTO posts (
              slug, title, excerpt, meta_description, focus_keyword, category,
              categories, author_id,
              author_name, author_bio, content, featured_image, featured_image_alt,
              summary, tags, reading_time, status, intent, is_pillar, pillar_id,
              seo_score, published_at
            ) VALUES (
              ${slug}, ${title}, ${String(p.excerpt || '')}, ${metaDescription},
              ${focusKeyword}, ${primaryCategory},
              ${categories}, ${authorId},
              ${String(p.authorName || cfg.defaultAuthor.name || '')},
              ${String(p.authorBio || cfg.defaultAuthor.bio || '')},
              ${content}, ${String(p.featuredImage || '')}, ${String(p.featuredImageAlt || '')},
              ${JSON.stringify(Array.isArray(p.summary) ? p.summary : [])}::jsonb,
              ${JSON.stringify(Array.isArray(p.tags) ? p.tags : [])}::jsonb,
              ${Math.max(1, Math.round(wordCount(content) / 200))},
              ${status}, ${normIntent(p.intent)}, ${p.isPillar === true},
              ${p.pillarId ? String(p.pillarId) : null}, ${seoScore}, ${publishedAt}
            )
            RETURNING id, slug
          `;
          revalidateBlog(slug);
          if (status === 'published') {
            import('../../lib/backup').then(({ createBackup }) => createBackup('on-publish')).catch(() => {});
          }
          return NextResponse.json({ ok: true, id: inserted.id, slug: inserted.slug });
        }
      } catch (e) {
        const msg = String(e).includes('duplicate') ? 'A post with that slug already exists.' : String(e);
        return NextResponse.json({ error: msg }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  };
}

// ─── API keys (cookie-only admin) ────────────────────────

export function createKeysRoute() {
  function cookieAuthed(req: NextRequest): boolean {
    return isValidToken(req.cookies.get(SESSION_COOKIE)?.value);
  }

  return async function POST(req: NextRequest) {
    if (!cookieAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action } = body;

    if (action === 'list') return NextResponse.json({ keys: await listApiKeys() });
    if (action === 'create') {
      const result = await createApiKey(String(body.name || 'Untitled'));
      if (!result) return NextResponse.json({ error: 'Could not create key' }, { status: 500 });
      return NextResponse.json({ key: result.raw, record: result.record });
    }
    if (action === 'revoke') {
      const ok = await revokeApiKey(String(body.id));
      if (!ok) return NextResponse.json({ error: 'Could not revoke key' }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  };
}

// ─── Image upload → local public/uploads/ ────────────────

async function toWebP(input: Buffer): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  return sharp(input).webp({ quality: 82 }).toBuffer();
}

async function saveImage(rawBuffer: Buffer, originalName: string): Promise<string> {
  const base = slugify(originalName.replace(/\.[^.]+$/, '')) || 'image';
  const filename = `${base}-${Date.now()}.webp`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const webpBuffer = await toWebP(rawBuffer);
  fs.writeFileSync(path.join(uploadsDir, filename), webpBuffer);
  return `/uploads/${filename}`;
}

export function createUploadRoute(_config?: PolarisConfig) {
  return async function POST(req: NextRequest) {
    if (!(await isAuthorizedRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ct = req.headers.get('content-type') || '';

    // ── JSON body: agent uploads via URL or base64 ────────────────────────
    if (ct.includes('application/json')) {
      const body = await req.json().catch(() => ({}));

      // { url: "https://..." } — agent passes image URL, server fetches + converts
      if (typeof body.url === 'string' && body.url.startsWith('http')) {
        const res = await fetch(body.url, { signal: AbortSignal.timeout(20_000) });
        if (!res.ok) return NextResponse.json({ error: 'Failed to fetch image URL' }, { status: 400 });
        const raw = Buffer.from(await res.arrayBuffer());
        const name = body.filename || body.url.split('/').pop()?.split('?')[0] || 'image';
        const url = await saveImage(raw, name);
        return NextResponse.json({ url });
      }

      // { data: "base64...", filename: "..." } — agent passes raw base64
      if (typeof body.data === 'string') {
        const raw = Buffer.from(body.data.replace(/^data:[^;]+;base64,/, ''), 'base64');
        const url = await saveImage(raw, body.filename || 'image');
        return NextResponse.json({ url });
      }

      return NextResponse.json({ error: 'Provide either url or data' }, { status: 400 });
    }

    // ── Multipart form: browser file picker ───────────────────────────────
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const raw = Buffer.from(await file.arrayBuffer());
    const url = await saveImage(raw, file.name);
    return NextResponse.json({ url });
  };
}

// ─── Comment moderation (dashboard) ──────────────────────

export function createPolarisRoute() {
  function isAuthorized(request: NextRequest): boolean {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) return false;
    if (request.headers.get('x-admin-token') === password) return true;
    return isValidToken(request.cookies.get(SESSION_COOKIE)?.value);
  }

  return async function POST(request: NextRequest) {
    if (!isAuthorized(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, commentId, limit = 50, offset = 0 } = body;
    const ascending: boolean = body.order === 'oldest';

    if (action === 'list-all') {
      const comments = ascending
        ? await db`SELECT * FROM comments ORDER BY created_at ASC LIMIT ${limit} OFFSET ${offset}`
        : await db`SELECT * FROM comments ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      const [{ count }] = await db`SELECT COUNT(*)::int as count FROM comments`;
      return Response.json({ comments, total: count });
    }

    if (action === 'list-filtered') {
      const hidden: boolean = body.hidden === true;
      const comments = ascending
        ? await db`SELECT * FROM comments WHERE hidden = ${hidden} ORDER BY created_at ASC LIMIT ${limit} OFFSET ${offset}`
        : await db`SELECT * FROM comments WHERE hidden = ${hidden} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      const [{ count }] = await db`SELECT COUNT(*)::int as count FROM comments WHERE hidden = ${hidden}`;
      return Response.json({ comments, total: count });
    }

    if (action === 'hide' && commentId) {
      await db`UPDATE comments SET hidden = true WHERE id = ${commentId}`;
      return Response.json({ success: true });
    }

    if (action === 'unhide' && commentId) {
      await db`UPDATE comments SET hidden = false WHERE id = ${commentId}`;
      return Response.json({ success: true });
    }

    if (action === 'delete' && commentId) {
      await db`DELETE FROM comments WHERE id = ${commentId}`;
      return Response.json({ success: true });
    }

    if (action === 'stats') {
      const [{ total }] = await db`SELECT COUNT(*)::int as total FROM comments`;
      const [{ hidden }] = await db`SELECT COUNT(*)::int as hidden FROM comments WHERE hidden = true`;
      const pages = await db`SELECT DISTINCT page_id FROM comments`;
      return Response.json({
        total,
        hidden,
        visible: total - hidden,
        uniquePages: pages.length,
      });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  };
}

// ─── Latest posts (public JSON) ───────────────────────────

export function createBlogLatestRoute(_config?: PolarisConfig) {
  return async function GET() {
    const posts = await getPublishedPosts();
    const latest = posts.slice(0, 3).map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      featuredImage: p.featuredImage,
      featuredImageAlt: p.featuredImageAlt,
      category: p.category,
      date: p.date,
      readingTime: p.readingTime,
    }));
    return Response.json({ posts: latest });
  };
}
