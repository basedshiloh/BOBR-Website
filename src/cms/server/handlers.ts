import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { checkCredentials, expectedToken, SESSION_COOKIE, isValidToken } from './cms-auth';
import { isAuthorizedRequest } from './cms-access';
import { adminClient, getPublishedPosts } from './posts';
import { createApiKey, listApiKeys, revokeApiKey } from './api-keys';
import { analyzeSeo } from '../lib/seo-analysis';
import { slugify } from '../lib/utils';
import { resolveConfig, type PolarisConfig } from '../config';

// ─── Auth: login ─────────────────────────────────────────

// Simple in-memory rate limiter (per-IP). Resets per serverless instance.
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
    const supabase = adminClient();

    // Agent-facing: list published posts as internal-link targets.
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

    // Maintenance: recompute seo_score for all posts.
    if (action === 'recompute-scores') {
      const { data } = await supabase.from('posts').select('id, title, meta_description, slug, focus_keyword, content');
      let updated = 0;
      for (const p of data || []) {
        const { score } = analyzeSeo({
          title: p.title || '',
          metaDescription: p.meta_description || '',
          slug: p.slug || '',
          focusKeyword: p.focus_keyword || '',
          content: p.content || '',
        });
        await supabase.from('posts').update({ seo_score: score }).eq('id', p.id);
        updated++;
      }
      return NextResponse.json({ updated });
    }

    if (action === 'delete') {
      const { id, slug } = body;
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      revalidateBlog(slug);
      return NextResponse.json({ ok: true });
    }

    if (action === 'set-status') {
      const { id, status, slug } = body;
      const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (status === 'published') patch.published_at = new Date().toISOString();
      const { error } = await supabase.from('posts').update(patch).eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      revalidateBlog(slug);
      return NextResponse.json({ ok: true });
    }

    if (action === 'save') {
      const p = body.post as Record<string, unknown>;
      const title = String(p.title || '').trim();
      const slug = String(p.slug || '').trim() || slugify(title);
      if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

      const content = String(p.content || '');
      const status = p.status === 'published' ? 'published' : 'draft';
      const metaDescription = String(p.metaDescription || p.excerpt || '');
      const focusKeyword = String(p.focusKeyword || '');

      const { score: seoScore } = analyzeSeo({ title, metaDescription, slug, focusKeyword, content });

      const row: Record<string, unknown> = {
        slug,
        title,
        excerpt: String(p.excerpt || ''),
        meta_description: metaDescription,
        focus_keyword: focusKeyword,
        category: String(p.category || ''),
        author_name: String(p.authorName || cfg.defaultAuthor.name || ''),
        author_bio: String(p.authorBio || cfg.defaultAuthor.bio || ''),
        content,
        featured_image: String(p.featuredImage || ''),
        featured_image_alt: String(p.featuredImageAlt || ''),
        summary: Array.isArray(p.summary) ? p.summary : [],
        tags: Array.isArray(p.tags) ? p.tags : [],
        reading_time: Math.max(1, Math.round(wordCount(content) / 200)),
        status,
        intent: normIntent(p.intent),
        is_pillar: p.isPillar === true,
        pillar_id: p.pillarId ? String(p.pillarId) : null,
        seo_score: seoScore,
        updated_at: new Date().toISOString(),
      };

      const id = p.id ? String(p.id) : '';

      if (id) {
        if (status === 'published') {
          const { data: existing } = await supabase.from('posts').select('published_at').eq('id', id).maybeSingle();
          if (!existing?.published_at) row.published_at = new Date().toISOString();
        }
        const { data, error } = await supabase.from('posts').update(row).eq('id', id).select('id, slug').single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        revalidateBlog(slug);
        return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
      } else {
        if (status === 'published') row.published_at = new Date().toISOString();
        const { data, error } = await supabase.from('posts').insert(row).select('id, slug').single();
        if (error) {
          const msg = error.message.includes('duplicate') ? 'A post with that slug already exists.' : error.message;
          return NextResponse.json({ error: msg }, { status: 500 });
        }
        revalidateBlog(slug);
        return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
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

    if (action === 'list') {
      return NextResponse.json({ keys: await listApiKeys() });
    }
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

// ─── Image upload (optional; requires `sharp`) ───────────

export function createUploadRoute(config?: PolarisConfig) {
  const cfg = resolveConfig(config ?? ({ categories: {} } as PolarisConfig));

  return async function POST(req: NextRequest) {
    if (!(await isAuthorizedRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    // Upload the original image as-is. No native image processing (sharp), so
    // this runs on any host including edge/Workers. Editors should upload
    // reasonably web-sized images; next/image handles display optimization.
    const ext = (file.name.match(/\.([a-zA-Z0-9]+)$/)?.[1] || 'png').toLowerCase();
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image';
    const path = `${base}-${Date.now()}.${ext}`;
    const contentType = file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`;

    const supabase = adminClient();
    const { error } = await supabase.storage.from(cfg.uploadBucket).upload(path, inputBuffer, {
      contentType,
      upsert: false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data } = supabase.storage.from(cfg.uploadBucket).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  };
}

// ─── Comment moderation (dashboard) ──────────────────────

function commentAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

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
    const ascending = body.order === 'oldest';
    const supabase = commentAdminClient();

    if (action === 'list-all') {
      const { data, count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending })
        .range(offset, offset + limit - 1);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ comments: data, total: count });
    }

    if (action === 'list-filtered') {
      const hidden = body.hidden === true;
      const { data, count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact' })
        .eq('hidden', hidden)
        .order('created_at', { ascending })
        .range(offset, offset + limit - 1);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ comments: data, total: count });
    }

    if (action === 'hide' && commentId) {
      const { error } = await supabase.from('comments').update({ hidden: true }).eq('id', commentId);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true });
    }

    if (action === 'unhide' && commentId) {
      const { error } = await supabase.from('comments').update({ hidden: false }).eq('id', commentId);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true });
    }

    if (action === 'delete' && commentId) {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true });
    }

    if (action === 'stats') {
      const { count: total } = await supabase.from('comments').select('*', { count: 'exact', head: true });
      const { count: hidden } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('hidden', true);
      const { data: pages } = await supabase.from('comments').select('page_id');
      const uniquePages = new Set((pages || []).map((p: { page_id: string }) => p.page_id)).size;
      return Response.json({
        total: total || 0,
        hidden: hidden || 0,
        visible: (total || 0) - (hidden || 0),
        uniquePages,
      });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  };
}

// ─── Latest posts (public JSON, e.g. homepage widget) ────

export function createBlogLatestRoute(config?: PolarisConfig) {
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
