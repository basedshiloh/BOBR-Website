// Server entry (@polaris/cms/server) — route-handler factories + server-only
// data helpers. Import these from route stubs and server components only; they
// use next/headers, next/cache and the Supabase service-role key.

export {
  createLoginRoute,
  createLogoutRoute,
  createPostsRoute,
  createKeysRoute,
  createUploadRoute,
  createPolarisRoute,
  createBlogLatestRoute,
} from './handlers';

// Data helpers (published reads use the anon key; *Admin use the service role).
export {
  getPublishedPosts,
  getPostBySlug,
  getRelatedPosts,
  getPaginatedPosts,
  getAllPostsAdmin,
  getPostByIdAdmin,
  rowToPost,
  adminClient,
} from './posts';

// Auth helpers (for custom middleware / guards).
export { isAuthed, isValidToken, checkCredentials, expectedToken, SESSION_COOKIE } from './cms-auth';
export { isAuthorizedRequest } from './cms-access';
export { listApiKeys, createApiKey, revokeApiKey, verifyApiKey } from './api-keys';
export type { ApiKeyRecord } from './api-keys';

export type { PolarisConfig } from '../config';
