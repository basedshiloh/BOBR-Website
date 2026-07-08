export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { isValidToken, SESSION_COOKIE } from '@/cms/server/cms-auth';
import {
  createBackup, listBackups, getBackupPosts,
  restoreBackup, restorePost, deleteBackup,
  getSchedule, saveSchedule,
} from '@/lib/backup';

function authed(req: NextRequest): boolean {
  return isValidToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { action } = body;

  if (action === 'list') {
    return NextResponse.json({ backups: listBackups(), schedule: getSchedule() });
  }

  if (action === 'create') {
    const filename = await createBackup('manual');
    return NextResponse.json({ ok: true, filename });
  }

  if (action === 'posts-in-backup') {
    const posts = getBackupPosts(String(body.filename ?? ''));
    return NextResponse.json({ posts });
  }

  if (action === 'restore-all') {
    const result = await restoreBackup(String(body.filename ?? ''));
    return NextResponse.json({ ok: true, ...result });
  }

  if (action === 'restore-post') {
    const ok = await restorePost(String(body.filename ?? ''), String(body.postId ?? ''));
    return NextResponse.json({ ok });
  }

  if (action === 'delete') {
    deleteBackup(String(body.filename ?? ''));
    return NextResponse.json({ ok: true });
  }

  if (action === 'save-schedule') {
    const { enabled, interval } = body;
    const current = getSchedule();
    saveSchedule({ ...current, enabled: !!enabled, interval: interval === 'weekly' ? 'weekly' : 'daily' });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
