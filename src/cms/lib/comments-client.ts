import type { Comment } from '../types';

export type { Comment };

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i;

export function containsUrl(text: string): boolean {
  return URL_PATTERN.test(text);
}

export async function getComments(pageId: string): Promise<Comment[]> {
  const res = await fetch(`/api/comments?pageId=${encodeURIComponent(pageId)}`);
  if (!res.ok) return [];
  const { comments } = await res.json();
  return comments || [];
}

export async function addComment(
  pageId: string,
  pageType: string,
  authorName: string,
  content: string,
  parentId?: string
): Promise<Comment | null> {
  if (containsUrl(content) || containsUrl(authorName)) {
    throw new Error('Links and URLs are not allowed in comments.');
  }

  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageId, pageType, authorName, content, parentId }),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Failed to post comment' }));
    throw new Error(error || 'Failed to post comment');
  }

  const { comment } = await res.json();
  return comment;
}
