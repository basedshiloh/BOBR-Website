export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedRequest } from '@/cms/server/cms-access';
import { listAuthors, createAuthor, updateAuthor, deleteAuthor } from '@/cms/server/authors';

export async function POST(req: NextRequest) {
  if (!(await isAuthorizedRequest(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { action } = body;

  if (action === 'list') {
    return NextResponse.json({ authors: await listAuthors() });
  }
  if (action === 'create') {
    const a = await createAuthor({ name: String(body.name || ''), bio: String(body.bio || ''), avatar: String(body.avatar || ''), xUrl: String(body.xUrl || ''), githubUrl: String(body.githubUrl || ''), websiteUrl: String(body.websiteUrl || '') });
    if (!a) return NextResponse.json({ error: 'Could not create author' }, { status: 500 });
    return NextResponse.json({ author: a });
  }
  if (action === 'update') {
    const a = await updateAuthor(String(body.id), { name: String(body.name || ''), bio: String(body.bio || ''), avatar: String(body.avatar || ''), xUrl: String(body.xUrl || ''), githubUrl: String(body.githubUrl || ''), websiteUrl: String(body.websiteUrl || '') });
    if (!a) return NextResponse.json({ error: 'Could not update author' }, { status: 500 });
    return NextResponse.json({ author: a });
  }
  if (action === 'delete') {
    await deleteAuthor(String(body.id));
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
