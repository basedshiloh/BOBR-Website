import { createUploadRoute } from "@/cms/server";
import config from "@/lib/polaris.config";

export const POST = createUploadRoute(config);
