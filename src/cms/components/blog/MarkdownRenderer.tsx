'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { slugify } from '../../lib/utils';
import TweetEmbed from './TweetEmbed';

// Matches a tweet/X status URL anywhere it appears as the sole content of a line.
// Handles bare URLs and markdown links: [anything](https://x.com/.../status/123)
const TWEET_STATUS_RE = /https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;

function extractTweetId(trimmed: string): string | null {
  // Bare URL on its own line
  if (/^https?:\/\//.test(trimmed)) {
    const m = trimmed.match(TWEET_STATUS_RE);
    return m ? m[1] : null;
  }
  // Markdown link whose href is a tweet URL: [anything](https://x.com/…)
  const mdLink = trimmed.match(/^\[.*?\]\((https?:\/\/[^)]+)\)$/);
  if (mdLink) {
    const m = mdLink[1].match(TWEET_STATUS_RE);
    return m ? m[1] : null;
  }
  return null;
}

function preprocessContent(content: string): string {
  const lines = content.split('\n');
  const out: string[] = [];
  for (const line of lines) {
    // Strip any leading blockquote markers ("> ", "> > ", etc.) before checking
    const stripped = line.replace(/^(\s*>\s*)+/, '').trim();
    const id = extractTweetId(stripped);
    if (id) {
      // Blank lines before/after so remark treats the <div> as a block, not inline
      if (out.length && out[out.length - 1] !== '') out.push('');
      out.push(`<div data-tweet-id="${id}"></div>`);
      out.push('');
    } else {
      out.push(line);
    }
  }
  return out.join('\n');
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        div: ({ node, children, ...props }) => {
          const tweetId = (props as Record<string, unknown>)['data-tweet-id'] as string | undefined;
          if (tweetId) return <TweetEmbed tweetId={tweetId} />;
          return <div {...props}>{children}</div>;
        },
        h2: ({ children }) => (
          <h2
            id={slugify(String(children))}
            className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4 scroll-mt-8"
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            id={slugify(String(children))}
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3 scroll-mt-8"
          >
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc space-y-1 text-gray-700 dark:text-gray-300 mb-4 ml-6">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal space-y-1 text-gray-700 dark:text-gray-300 mb-4 ml-6">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-400 dark:border-blue-600 pl-4 py-2 my-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-r-lg">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          if (!className) {
            return (
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-pink-600 dark:text-pink-400">
                {children}
              </code>
            );
          }
          return <code className="block text-sm font-mono">{children}</code>;
        },
        pre: ({ children }) => (
          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4 text-sm">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-gray-100 dark:bg-gray-800 px-3 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {children}
          </td>
        ),
        a: ({ href, title, children }) => {
          const isExternal = href?.startsWith('http');
          // External links are nofollow by default; opt into dofollow with a
          // markdown title: [text](https://example.com "dofollow").
          const dofollow = typeof title === 'string' && /dofollow/i.test(title);
          return (
            <a
              href={href}
              title={title}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? (dofollow ? 'noopener noreferrer' : 'noopener noreferrer nofollow') : undefined}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {children}
            </a>
          );
        },
        img: ({ src, alt }) => (
          <figure className="my-6">
            {typeof src === 'string' && src.startsWith('/') ? (
              <Image
                src={src}
                alt={alt || ''}
                width={896}
                height={504}
                className="rounded-lg w-full h-auto"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt || ''} className="rounded-lg w-full" loading="lazy" />
            )}
            {alt && <figcaption className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">{alt}</figcaption>}
          </figure>
        ),
        hr: () => <hr className="my-8 border-gray-200 dark:border-gray-800" />,
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
        ),
      }}
    >
      {preprocessContent(content)}
    </ReactMarkdown>
  );
}
