'use client';

import { useEffect, useRef } from 'react';

// Each banner size maps to its highperformanceformat.com key
const BANNER_CONFIGS: Record<string, { key: string; width: number; height: number }> = {
  '728x90':  { key: 'b29539cf70bddfc5f036a768b3d4e846', width: 728, height: 90  },
  '300x250': { key: '14adf44b10347ca2329b9c48c2e6b104', width: 300, height: 250 },
  '160x600': { key: 'f53149f303d1f9d5872d1bb20eb8bc74', width: 160, height: 600 },
};

// Which size each ad slot gets
const PLACEMENT_TO_SIZE: Record<string, string> = {
  home_top:      '728x90',
  home_mid:      '728x90',
  post_before:   '728x90',
  post_after:    '728x90',
  global_footer: '728x90',
  home_sidebar:  '300x250',
  post_sidebar:  '160x600',
};

function InjectBanner({ adKey, width, height }: { adKey: string; width: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    (window as Record<string, unknown>).atOptions = {
      key: adKey,
      format: 'iframe',
      height,
      width,
      params: {},
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    el.appendChild(script);

    return () => { el.innerHTML = ''; };
  }, [adKey, width, height]);

  return <div ref={ref} style={{ width, height, maxWidth: '100%' }} />;
}

export default function NetworkBanner({ placement, className = '' }: { placement: string; className?: string }) {
  const size = PLACEMENT_TO_SIZE[placement];
  if (!size) return null;
  const cfg = BANNER_CONFIGS[size];
  if (!cfg) return null;

  return (
    <aside
      className={`not-prose my-6 flex flex-col items-center overflow-x-auto ${className}`}
      aria-label="Advertisement"
    >
      <span className="kicker mb-1.5 text-ink-soft/60">Sponsored</span>
      <InjectBanner adKey={cfg.key} width={cfg.width} height={cfg.height} />
    </aside>
  );
}
