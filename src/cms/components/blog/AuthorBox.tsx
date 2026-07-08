import Image from 'next/image';
import Link from 'next/link';
import type { BlogAuthor } from '../../types';

export default function AuthorBox({
  author,
  date,
  readingTime,
  updatedDate,
}: {
  author: BlogAuthor;
  date: string;
  readingTime: number;
  updatedDate?: string;
}) {
  const formatted = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const updated = updatedDate
    ? new Date(updatedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-blue-100 dark:bg-blue-900/40">
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-lg font-bold text-blue-600 dark:text-blue-400">
            {author.name.charAt(0)}
          </span>
        )}
      </div>
      <div>
        {author.slug ? (
          <Link href={`/author/${author.slug}`} className="font-semibold text-gray-900 dark:text-gray-100 text-sm hover:underline">{author.name}</Link>
        ) : (
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{author.name}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">{author.bio}</p>
        {(author.xUrl || author.githubUrl || author.websiteUrl) && (
          <div className="flex items-center gap-3 mt-1.5">
            {author.xUrl && (
              <a href={author.xUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">X</a>
            )}
            {author.githubUrl && (
              <a href={author.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>
            )}
            {author.websiteUrl && (
              <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Website</a>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
          <time dateTime={date}>{formatted}</time>
          <span>·</span>
          <span>{readingTime} min read</span>
          {updated && (
            <>
              <span>·</span>
              <span>Updated {updated}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
