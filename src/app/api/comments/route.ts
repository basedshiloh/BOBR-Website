export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get('pageId');
  if (!pageId) return NextResponse.json({ comments: [] });

  try {
    const comments = await db`
      SELECT * FROM comments
      WHERE page_id = ${pageId} AND hidden = false
      ORDER BY created_at ASC
      LIMIT 100
    `;
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { pageId, pageType, authorName, content, parentId } = body;

  const name = String(authorName || '').trim().slice(0, 50);
  const text = String(content || '').trim().slice(0, 2000);

  if (!pageId || !pageType || !name || !text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const [comment] = await db`
      INSERT INTO comments (page_id, page_type, author_name, content, parent_id)
      VALUES (
        ${String(pageId)}, ${String(pageType)}, ${name}, ${text},
        ${parentId ? String(parentId) : null}
      )
      RETURNING *
    `;
    return NextResponse.json({ comment });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
