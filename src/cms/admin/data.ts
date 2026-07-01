import { listApiKeys, type ApiKeyRecord } from '../server/api-keys';

export { getAllPostsAdmin, getPostByIdAdmin, getPublishedPosts } from '../server/posts';

// The API-keys table may not exist yet on a fresh project; degrade gracefully.
export async function listApiKeysSafe(): Promise<ApiKeyRecord[]> {
  try {
    return await listApiKeys();
  } catch {
    return [];
  }
}
