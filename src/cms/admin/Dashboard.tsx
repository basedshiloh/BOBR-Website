import Link from 'next/link';
import { FileText, MessageSquare, Link2, PlusCircle, Megaphone, Users } from 'lucide-react';
import { getAllPostsAdmin } from '../server/posts';
import MigrateImagesButton from './MigrateImagesButton';

export default async function Dashboard({ showLinkGenius = true }: { showLinkGenius?: boolean }) {
  const posts = await getAllPostsAdmin();
  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;

  const cards = [
    { label: 'Published', value: published, color: 'text-green-600' },
    { label: 'Drafts', value: drafts, color: 'text-amber-600' },
    { label: 'Total posts', value: posts.length, color: 'text-blue-600' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Manage your content</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <p className="text-xs text-gray-400 dark:text-gray-500">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/polaris/posts/new" className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all">
            <PlusCircle className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900 dark:text-gray-100">New post</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Write a new blog article</p>
          </Link>
          <Link href="/polaris/posts" className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all">
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900 dark:text-gray-100">Manage posts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Edit, publish, or delete</p>
          </Link>
          <Link href="/polaris/comments" className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all">
            <MessageSquare className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900 dark:text-gray-100">Moderate comments</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hide or delete comments</p>
          </Link>
          <Link href="/polaris/ads" className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all">
            <Megaphone className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900 dark:text-gray-100">Manage ads</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Banners &amp; placements</p>
          </Link>
          <Link href="/polaris/authors" className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900 dark:text-gray-100">Authors</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage author profiles</p>
          </Link>
          {showLinkGenius && (
            <Link href="/polaris/links" className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all">
              <Link2 className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900 dark:text-gray-100">Link Genius</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Internal link index</p>
            </Link>
          )}
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Tools</p>
          <MigrateImagesButton />
        </div>
      </div>
    </div>
  );
}
