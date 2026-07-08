import 'server-only';
import db from '../../lib/db';
import { slugify } from '../lib/utils';
import type { Author } from '../types';

interface AuthorRow {
  id: string; slug: string; name: string; bio: string; avatar: string;
  x_url: string; github_url: string; website_url: string;
  created_at: Date | string;
}

function rowToAuthor(r: AuthorRow): Author {
  return {
    id: r.id, slug: r.slug, name: r.name, bio: r.bio || '',
    avatar: r.avatar || '', xUrl: r.x_url || '',
    githubUrl: r.github_url || '', websiteUrl: r.website_url || '',
  };
}

export async function listAuthors(): Promise<Author[]> {
  try {
    const rows = await db`SELECT * FROM authors ORDER BY name ASC`;
    return rows.map(r => rowToAuthor(r as unknown as AuthorRow));
  } catch { return []; }
}

export async function getAuthorById(id: string): Promise<Author | null> {
  try {
    const [row] = await db`SELECT * FROM authors WHERE id = ${id} LIMIT 1`;
    return row ? rowToAuthor(row as unknown as AuthorRow) : null;
  } catch { return null; }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const [row] = await db`SELECT * FROM authors WHERE slug = ${slug} LIMIT 1`;
    return row ? rowToAuthor(row as unknown as AuthorRow) : null;
  } catch { return null; }
}

export async function createAuthor(data: {
  name: string; bio: string; avatar: string;
  xUrl: string; githubUrl: string; websiteUrl: string;
}): Promise<Author | null> {
  try {
    const slug = slugify(data.name);
    const [row] = await db`
      INSERT INTO authors (slug, name, bio, avatar, x_url, github_url, website_url)
      VALUES (${slug}, ${data.name}, ${data.bio}, ${data.avatar}, ${data.xUrl}, ${data.githubUrl}, ${data.websiteUrl})
      RETURNING *
    `;
    return rowToAuthor(row as unknown as AuthorRow);
  } catch { return null; }
}

export async function updateAuthor(id: string, data: {
  name: string; bio: string; avatar: string;
  xUrl: string; githubUrl: string; websiteUrl: string;
}): Promise<Author | null> {
  try {
    const [row] = await db`
      UPDATE authors SET
        name = ${data.name}, bio = ${data.bio}, avatar = ${data.avatar},
        x_url = ${data.xUrl}, github_url = ${data.githubUrl}, website_url = ${data.websiteUrl}
      WHERE id = ${id} RETURNING *
    `;
    return row ? rowToAuthor(row as unknown as AuthorRow) : null;
  } catch { return null; }
}

export async function deleteAuthor(id: string): Promise<boolean> {
  try { await db`DELETE FROM authors WHERE id = ${id}`; return true; }
  catch { return false; }
}

export async function getPostsByAuthorId(authorId: string) {
  try {
    const rows = await db`SELECT id, title, slug, status, published_at FROM posts WHERE author_id = ${authorId} ORDER BY published_at DESC NULLS LAST`;
    return rows;
  } catch { return []; }
}
