import { createClient } from '@supabase/supabase-js';
import type { Comment } from '../types';

export type { Comment };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i;

export function containsUrl(text: string): boolean {
  return URL_PATTERN.test(text);
}

export async function getComments(pageId: string): Promise<Comment[]> {
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: true })
    .limit(100);
  return data || [];
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

  const { data } = await supabase
    .from('comments')
    .insert({
      page_id: pageId,
      page_type: pageType,
      author_name: authorName.trim().slice(0, 50),
      content: content.trim().slice(0, 2000),
      ...(parentId ? { parent_id: parentId } : {}),
    })
    .select()
    .single();
  return data;
}
