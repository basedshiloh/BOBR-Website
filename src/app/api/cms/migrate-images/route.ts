export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isValidToken, SESSION_COOKIE } from '@/cms/server/cms-auth';
import db from '@/lib/db';

function isExternal(url: string): boolean {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
}

async function downloadAsWebP(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    const rawBuf = Buffer.from(await res.arrayBuffer());

    const rawName = url.split('?')[0].split('/').pop() || 'image';
    const base = rawName.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]/gi, '-').slice(0, 60) || 'image';

    // SVGs can't be rasterized by sharp — keep as-is
    const isSvg = ct.includes('svg') || url.split('?')[0].endsWith('.svg');
    const filename = isSvg ? `${base}-${Date.now()}.svg` : `${base}-${Date.now()}.webp`;
    const outBuf = isSvg ? rawBuf : await (await import('sharp')).default(rawBuf).webp({ quality: 82 }).toBuffer();

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(path.join(uploadsDir, filename), outBuf);
    return `/uploads/${filename}`;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (!isValidToken(cookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const posts = await db`SELECT id, featured_image, content FROM posts`;

  // Phase 1 — collect every unique external URL across all posts
  const allUrls = new Set<string>();
  for (const p of posts) {
    if (isExternal(p.featured_image)) allUrls.add(p.featured_image);
    const content = String(p.content || '');
    for (const m of content.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)) {
      allUrls.add(m[1]);
    }
  }

  // Phase 2 — download + convert each URL once
  const urlMap = new Map<string, string>();
  const failed: string[] = [];
  for (const url of allUrls) {
    const local = await downloadAsWebP(url);
    if (local) urlMap.set(url, local);
    else failed.push(url);
  }

  // Phase 3 — update posts
  let updated = 0;
  for (const p of posts) {
    let featured = String(p.featured_image || '');
    let content = String(p.content || '');
    let changed = false;

    if (urlMap.has(featured)) {
      featured = urlMap.get(featured)!;
      changed = true;
    }

    const newContent = content.replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, (match, alt, imgUrl) => {
      if (urlMap.has(imgUrl)) { changed = true; return `![${alt}](${urlMap.get(imgUrl)})`; }
      return match;
    });

    if (changed) {
      await db`UPDATE posts SET featured_image = ${featured}, content = ${newContent}, updated_at = now() WHERE id = ${p.id}`;
      updated++;
    }
  }

  return NextResponse.json({
    scanned: posts.length,
    uniqueUrls: allUrls.size,
    migrated: urlMap.size,
    failed: failed.length,
    failedUrls: failed,
    postsUpdated: updated,
  });
}
