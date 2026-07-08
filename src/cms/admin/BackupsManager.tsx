'use client';

import { useState, useEffect, useCallback } from 'react';
import { DatabaseBackup, Plus, RotateCcw, Trash2, ChevronDown, ChevronRight, Clock, CalendarDays, Loader2 } from 'lucide-react';
import type { BackupMeta, ScheduleConfig } from '@/lib/backup';

interface PostStub { id: string; title: string; slug: string; status: string; }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
const TRIGGER_LABELS: Record<string, string> = { manual: 'Manual', scheduled: 'Scheduled', 'on-publish': 'On Publish' };

export default function BackupsManager() {
  const [backups, setBackups] = useState<BackupMeta[]>([]);
  const [schedule, setSchedule] = useState<ScheduleConfig>({ enabled: false, interval: 'daily', lastBackupAt: null });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [postMap, setPostMap] = useState<Record<string, PostStub[]>>({});
  const [loadingPosts, setLoadingPosts] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const api = useCallback(async (body: object) => {
    const res = await fetch('/api/cms/backups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return res.json();
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await api({ action: 'list' });
    setBackups(data.backups ?? []);
    setSchedule(data.schedule ?? { enabled: false, interval: 'daily', lastBackupAt: null });
    setLoading(false);
  }, [api]);

  useEffect(() => { refresh(); }, [refresh]);

  async function createBackup() {
    setCreating(true); setMsg(''); setErr('');
    const data = await api({ action: 'create' });
    setCreating(false);
    if (data.ok) { setMsg('Backup created.'); refresh(); }
    else setErr(data.error ?? 'Failed');
  }

  async function restoreAll(filename: string) {
    if (!confirm(`Restore ALL posts and authors from this backup? This will overwrite current data.`)) return;
    setRestoring(filename); setMsg(''); setErr('');
    const data = await api({ action: 'restore-all', filename });
    setRestoring(null);
    if (data.ok) setMsg(`Restored ${data.posts} posts and ${data.authors} authors.`);
    else setErr(data.error ?? 'Failed');
  }

  async function restoreSingle(filename: string, postId: string, title: string) {
    if (!confirm(`Restore "${title}" from this backup?`)) return;
    setRestoring(postId); setMsg(''); setErr('');
    const data = await api({ action: 'restore-post', filename, postId });
    setRestoring(null);
    if (data.ok) setMsg(`Restored "${title}".`);
    else setErr(data.error ?? 'Failed');
  }

  async function remove(filename: string) {
    if (!confirm('Delete this backup?')) return;
    setDeleting(filename);
    await api({ action: 'delete', filename });
    setDeleting(null);
    refresh();
  }

  async function toggleExpand(filename: string) {
    if (expanded === filename) { setExpanded(null); return; }
    setExpanded(filename);
    if (!postMap[filename]) {
      setLoadingPosts(filename);
      const data = await api({ action: 'posts-in-backup', filename });
      setPostMap((prev) => ({ ...prev, [filename]: data.posts ?? [] }));
      setLoadingPosts(null);
    }
  }

  async function saveSchedule(patch: Partial<ScheduleConfig>) {
    const next = { ...schedule, ...patch };
    setSchedule(next);
    await api({ action: 'save-schedule', enabled: next.enabled, interval: next.interval });
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <DatabaseBackup className="w-5 h-5" /> Backups
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Backup and restore all posts and authors</p>
        </div>
        <button
          onClick={createBackup}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {creating ? 'Creating…' : 'Backup now'}
        </button>
      </div>

      {msg && <div className="mb-4 text-sm text-green-700 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-lg px-4 py-2">{msg}</div>}
      {err && <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg px-4 py-2">{err}</div>}

      {/* Schedule */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600" /> Automatic schedule
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={schedule.enabled}
              onChange={(e) => saveSchedule({ enabled: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Enable automatic backups</span>
          </label>
          {schedule.enabled && (
            <select
              value={schedule.interval}
              onChange={(e) => saveSchedule({ interval: e.target.value as 'daily' | 'weekly' })}
              className="text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5 outline-none text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          )}
          {schedule.lastBackupAt && (
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Last: {fmtDate(schedule.lastBackupAt)}
            </span>
          )}
        </div>
      </div>

      {/* Backup list */}
      <div className="space-y-3">
        {loading && (
          <div className="text-sm text-gray-400 text-center py-8">Loading backups…</div>
        )}
        {!loading && backups.length === 0 && (
          <div className="text-sm text-gray-400 text-center py-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            No backups yet. Click "Backup now" to create one.
          </div>
        )}
        {backups.map((b) => (
          <div key={b.filename} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <button onClick={() => toggleExpand(b.filename)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {expanded === b.filename ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{fmtDate(b.createdAt)}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{b.postCount} posts · {fmtSize(b.sizeBytes)}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    b.trigger === 'scheduled' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                    b.trigger === 'on-publish' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {TRIGGER_LABELS[b.trigger] ?? b.trigger}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => restoreAll(b.filename)}
                  disabled={restoring === b.filename}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {restoring === b.filename ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  Restore all
                </button>
                <button
                  onClick={() => remove(b.filename)}
                  disabled={deleting === b.filename}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 transition-colors"
                >
                  {deleting === b.filename ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded post list */}
            {expanded === b.filename && (
              <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                {loadingPosts === b.filename && (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Loading posts…</p>
                )}
                {loadingPosts !== b.filename && (postMap[b.filename] ?? []).length === 0 && (
                  <p className="text-xs text-gray-400">No posts in this backup.</p>
                )}
                <div className="space-y-1">
                  {(postMap[b.filename] ?? []).map((p) => (
                    <div key={p.id} className="flex items-center gap-2 py-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                        p.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>{p.status}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{p.title}</span>
                      <button
                        onClick={() => restoreSingle(b.filename, p.id, p.title)}
                        disabled={restoring === p.id}
                        className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 disabled:opacity-50 transition-colors"
                      >
                        {restoring === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
