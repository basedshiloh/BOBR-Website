export const dynamic = 'force-dynamic';
import { createPostsRoute } from "@/cms/server";
import config from "@/lib/polaris.config";

export const POST = createPostsRoute(config);
