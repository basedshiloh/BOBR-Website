export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  avif: 'image/avif',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await params;
  // Block access to the backups directory
  if (parts[0] === 'backups') return new NextResponse('Not found', { status: 404 });
  // Prevent path traversal — only allow plain filenames
  const safe = parts.map((p) => path.basename(p));
  const filePath = path.join(process.cwd(), 'public', 'uploads', ...safe);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const ext = path.extname(filePath).slice(1).toLowerCase();
  const content = fs.readFileSync(filePath);

  return new NextResponse(content, {
    headers: {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
