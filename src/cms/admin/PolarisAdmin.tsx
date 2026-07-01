import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { resolveConfig, type PolarisConfig } from '../config';
import { SETTINGS_COOKIE, defaultSettings, parseSettings, type PolarisSettings } from '../settings';
import { isAuthed } from '../server/cms-auth';
import {
  getAllPostsAdmin,
  getPostByIdAdmin,
  getPublishedPosts,
  listApiKeysSafe,
} from './data';
import { buildInternalLinkIndex } from '../lib/internal-links';
import { buildContentGraph } from '../lib/content-graph';
import { auditFromText, type LinkAudit } from '../lib/link-audit';
import type { LinkTarget, AuditTarget } from '../types';

import CmsLogin from '../components/cms/CmsLogin';
import CmsShell from '../components/cms/CmsShell';
import PostsList from '../components/cms/PostsList';
import PostEditor from '../components/cms/PostEditor';
import LinkIndexBrowser from '../components/cms/LinkIndexBrowser';
import LinkManager from '../components/cms/LinkManager';
import LinkVisualizer from '../components/cms/LinkVisualizer';
import ApiKeys from '../components/cms/ApiKeys';
import CommentsModerator from '../components/cms/CommentsModerator';
import SettingsPanel from '../components/cms/SettingsPanel';
import AdsManager from '../ads/AdsManager';
import { listAdsAdmin } from '../ads/ads-server';
import Dashboard from './Dashboard';

type Segments = string[];

/**
 * The Polaris admin surface, mounted from a catch-all route in the consuming
 * app:
 *
 *   // app/polaris/[[...slug]]/page.tsx
 *   import { PolarisAdmin } from '@polaris/cms/admin';
 *   import config from '@/lib/polaris.config';
 *   export const dynamic = 'force-dynamic';
 *   export default function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
 *     return <PolarisAdmin params={params} config={config} />;
 *   }
 */
export default async function PolarisAdmin({
  params,
  config,
}: {
  params: Promise<{ slug?: string[] }>;
  config: PolarisConfig;
}) {
  const cfg = resolveConfig(config);
  const { slug = [] } = await params;

  if (!(await isAuthed())) {
    return <CmsLogin brandName={cfg.brandName} />;
  }

  const cookieStore = await cookies();
  const settings = parseSettings(cookieStore.get(SETTINGS_COOKIE)?.value, defaultSettings(cfg));

  return (
    <CmsShell brandName={cfg.brandName} linkGeniusEnabled={settings.linkGenius}>
      {await renderPage(slug, config, settings)}
    </CmsShell>
  );
}

async function renderPage(slug: Segments, config: PolarisConfig, settings: PolarisSettings) {
  const cfg = resolveConfig(config);
  const [section, param] = slug;

  switch (section) {
    case undefined:
      return <Dashboard showLinkGenius={settings.linkGenius} />;

    case 'posts': {
      if (!param) {
        const posts = await getAllPostsAdmin();
        return <PostsList posts={posts} categories={cfg.categories} />;
      }
      // posts/new or posts/<id>
      const id = param;
      const isNew = id === 'new';
      const [post, allPosts, extraTargets] = await Promise.all([
        isNew ? Promise.resolve(null) : getPostByIdAdmin(id),
        getAllPostsAdmin(),
        Promise.resolve(cfg.getLinkTargets?.() ?? []),
      ]);
      const resolvedExtra: LinkTarget[] = await Promise.resolve(extraTargets);
      const postTargets = allPosts
        .filter((p) => p.id !== id)
        .map((p) => ({ title: p.title, slug: p.slug, tags: p.tags, isPillar: p.isPillar }));
      const linkIndex = buildInternalLinkIndex(postTargets, resolvedExtra, cfg.blogBasePath);
      const pillars = allPosts.filter((p) => p.isPillar && p.id !== id).map((p) => ({ id: p.id, title: p.title }));
      return (
        <PostEditor
          initial={post}
          linkIndex={linkIndex}
          pillars={pillars}
          categories={cfg.categories}
          defaultAuthor={cfg.defaultAuthor}
          showLinkGenius={settings.linkGenius}
        />
      );
    }

    case 'comments':
      return <CommentsModerator />;

    case 'ads': {
      const ads = await listAdsAdmin();
      return <AdsManager initialAds={ads} />;
    }

    case 'settings':
      return <SettingsPanel initial={settings} />;

    case 'links': {
      if (!settings.linkGenius) notFound();
      const [posts, extra] = await Promise.all([
        getPublishedPosts(),
        Promise.resolve(cfg.getLinkTargets?.() ?? []),
      ]);
      const resolvedExtra: LinkTarget[] = await Promise.resolve(extra);
      const index = buildInternalLinkIndex(
        posts.map((p) => ({ title: p.title, slug: p.slug, tags: p.tags })),
        resolvedExtra,
        cfg.blogBasePath
      );
      return <LinkIndexBrowser index={index} />;
    }

    case 'manager': {
      const [posts, extra] = await Promise.all([
        getAllPostsAdmin(),
        Promise.resolve(cfg.getAuditTargets?.() ?? []),
      ]);
      const resolvedExtra: AuditTarget[] = await Promise.resolve(extra);
      const audits: LinkAudit[] = [
        ...posts.map((p) =>
          auditFromText(p.content, { id: p.id, title: p.title, kind: 'Post', url: `${cfg.blogBasePath}/${p.slug}` }, cfg.siteHost)
        ),
        ...resolvedExtra.map((t) =>
          auditFromText(t.text, { id: t.id, title: t.title, kind: t.kind, url: t.url }, cfg.siteHost)
        ),
      ];
      return <LinkManager audits={audits} siteHost={cfg.siteHost} />;
    }

    case 'visualizer': {
      const posts = await getAllPostsAdmin();
      const graph = buildContentGraph(posts, cfg.blogBasePath);
      return <LinkVisualizer graph={graph} categories={cfg.categories} />;
    }

    case 'api': {
      const keys = await listApiKeysSafe();
      return <ApiKeys initialKeys={keys} />;
    }

    default:
      notFound();
  }
}
