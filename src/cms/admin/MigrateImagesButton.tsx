'use client';

import { useState } from 'react';
import { HardDriveDownload, Loader2 } from 'lucide-react';

interface Result {
  scanned: number;
  uniqueUrls: number;
  migrated: number;
  failed: number;
  postsUpdated: number;
  failedUrls?: string[];
}

export default function MigrateImagesButton() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  async function run() {
    setRunning(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch('/api/cms/migrate-images', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Migration failed'); return; }
      setResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        <HardDriveDownload className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Migrate images to self-hosted</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Downloads all external images from your posts and re-hosts them on this server.</p>
        </div>
      </div>

      <button
        onClick={run}
        disabled={running}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {running ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running…</> : 'Run migration'}
      </button>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {result && (
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
          <p>Scanned <strong>{result.scanned}</strong> posts · found <strong>{result.uniqueUrls}</strong> external images</p>
          <p className="text-green-600 dark:text-green-400">✓ Migrated <strong>{result.migrated}</strong> images · updated <strong>{result.postsUpdated}</strong> posts</p>
          {result.failed > 0 && (
            <p className="text-amber-600 dark:text-amber-400">⚠ {result.failed} image(s) could not be downloaded</p>
          )}
        </div>
      )}
    </div>
  );
}
