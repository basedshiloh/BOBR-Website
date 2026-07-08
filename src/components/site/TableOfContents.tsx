'use client';

import { useState } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import { slugify } from '@/cms/lib/utils';

type Heading = { level: number; text: string; id: string };

function extractHeadings(content: string): Heading[] {
  return content
    .split('\n')
    .flatMap((line) => {
      const m = line.match(/^(#{2,3})\s+(.+)$/);
      if (!m) return [];
      const text = m[2].replace(/[*_`[\]]/g, '').trim();
      return [{ level: m[1].length, text, id: slugify(text) }];
    });
}

function TocList({ headings }: { headings: Heading[] }) {
  return (
    <ol className="space-y-1.5 text-sm">
      {headings.map((h, i) => (
        <li key={i} className={h.level === 3 ? 'pl-4' : ''}>
          <a
            href={`#${h.id}`}
            className="text-ink-soft hover:text-bobr-600 transition-colors leading-snug block"
          >
            {h.level === 3 && <span className="mr-1 opacity-40">–</span>}
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function DesktopTOC({ content }: { content: string }) {
  const headings = extractHeadings(content);
  if (headings.length < 2) return null;

  return (
    <div className="rounded-lg border border-rule bg-paper-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <List className="h-4 w-4 text-bobr-600" />
        <span className="kicker text-bobr-700">Contents</span>
      </div>
      <TocList headings={headings} />
    </div>
  );
}

export function MobileTOC({ content }: { content: string }) {
  const headings = extractHeadings(content);
  if (headings.length < 2) return null;

  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden my-6 rounded-lg border border-rule bg-paper-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ink hover:bg-black/5 transition-colors"
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4 text-bobr-600" />
          Table of Contents
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-ink-soft" />
        ) : (
          <ChevronDown className="h-4 w-4 text-ink-soft" />
        )}
      </button>
      {open && (
        <div className="border-t border-rule px-4 pb-4 pt-3">
          <TocList headings={headings} />
        </div>
      )}
    </div>
  );
}
