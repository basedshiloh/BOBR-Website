import { PolarisAdmin } from "@/cms/admin";
import config from "@/lib/polaris.config";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  return <PolarisAdmin params={params} config={config} />;
}
