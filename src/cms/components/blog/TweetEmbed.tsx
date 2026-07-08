'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (id: string, el: HTMLElement, opts?: object) => Promise<HTMLElement | undefined>;
      };
    };
  }
}

// Share a single script load across all TweetEmbed instances on the page
let twitterScriptState: 'idle' | 'loading' | 'loaded' = 'idle';
const pendingCallbacks: Array<() => void> = [];

function whenReady(cb: () => void) {
  if (twitterScriptState === 'loaded') { cb(); return; }
  pendingCallbacks.push(cb);
  if (twitterScriptState === 'loading') return;
  twitterScriptState = 'loading';
  const s = document.createElement('script');
  s.src = 'https://platform.twitter.com/widgets.js';
  s.async = true;
  s.charset = 'utf-8';
  s.onload = () => {
    twitterScriptState = 'loaded';
    pendingCallbacks.forEach((f) => f());
    pendingCallbacks.length = 0;
  };
  document.head.appendChild(s);
}

export default function TweetEmbed({ tweetId }: { tweetId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    whenReady(() => {
      window.twttr?.widgets?.createTweet(tweetId, container, { dnt: true, align: 'center' });
    });
  }, [tweetId]);

  return (
    <div className="my-6 flex justify-center">
      <div ref={ref} className="w-full max-w-[550px]">
        {/* placeholder while the widget loads */}
        <div className="animate-pulse rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 h-36" />
      </div>
    </div>
  );
}
