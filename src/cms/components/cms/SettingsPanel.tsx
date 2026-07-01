'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings as SettingsIcon, Link2 } from 'lucide-react';
import { SETTINGS_COOKIE, type PolarisSettings } from '../../settings';

function writeCookie(settings: PolarisSettings) {
  const value = encodeURIComponent(JSON.stringify(settings));
  // 1 year, root path so the server-rendered admin can read it.
  document.cookie = `${SETTINGS_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function SettingsPanel({ initial }: { initial: PolarisSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState<PolarisSettings>(initial);

  function update(patch: Partial<PolarisSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    writeCookie(next);
    // Re-render the server admin so nav + editor panels reflect the change.
    router.refresh();
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-1">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          Toggle optional CMS features. Saved to this browser.
        </p>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl divide-y divide-gray-100 dark:divide-gray-800">
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Link Genius</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Internal-link index browser and inline link suggestions in the post editor.
                </p>
              </div>
            </div>
            <Toggle checked={settings.linkGenius} onChange={(v) => update({ linkGenius: v })} />
          </div>
        </div>
      </div>
    </div>
  );
}
