'use client';
import { useState } from 'react';
import Image from 'next/image';
import { PlusCircle, Pencil, Trash2, X, Save, GitBranch } from 'lucide-react';
import type { Author } from '../../types';

const EMPTY: Omit<Author, 'id' | 'slug'> = { name: '', bio: '', avatar: '', xUrl: '', githubUrl: '', websiteUrl: '' };

export default function AuthorsManager({ initialAuthors }: { initialAuthors: Author[] }) {
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [editing, setEditing] = useState<(Partial<Author> & { isNew?: boolean }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function api(body: Record<string, unknown>) {
    setBusy(true); setError('');
    const res = await fetch('/api/cms/authors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || 'Error'); return null; }
    return data;
  }

  async function save() {
    if (!editing?.name?.trim()) { setError('Name is required'); return; }
    const isNew = editing.isNew;
    const payload = { name: editing.name || '', bio: editing.bio || '', avatar: editing.avatar || '', xUrl: editing.xUrl || '', githubUrl: editing.githubUrl || '', websiteUrl: editing.websiteUrl || '' };
    const data = await api(isNew ? { action: 'create', ...payload } : { action: 'update', id: editing.id, ...payload });
    if (!data) return;
    if (isNew) {
      setAuthors(prev => [...prev, data.author]);
    } else {
      setAuthors(prev => prev.map(a => a.id === data.author.id ? data.author : a));
    }
    setEditing(null);
  }

  async function remove(id: string) {
    if (!confirm('Delete this author?')) return;
    await api({ action: 'delete', id });
    setAuthors(prev => prev.filter(a => a.id !== id));
  }

  const field = (label: string, key: keyof typeof EMPTY, placeholder?: string) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      {key === 'bio' ? (
        <textarea rows={3} value={editing?.[key] || ''} onChange={e => setEditing(prev => ({ ...prev!, [key]: e.target.value }))} placeholder={placeholder} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
      ) : (
        <input value={editing?.[key] || ''} onChange={e => setEditing(prev => ({ ...prev!, [key]: e.target.value }))} placeholder={placeholder} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
      )}
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Authors</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">Manage registered authors and their profiles</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY, isNew: true })} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <PlusCircle className="w-4 h-4" /> New author
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg px-4 py-2">{error}</div>}

      {/* Edit drawer */}
      {editing && (
        <div className="mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-900 dark:text-gray-100">{editing.isNew ? 'New author' : 'Edit author'}</p>
            <button onClick={() => setEditing(null)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          {field('Name *', 'name', 'e.g. Shiloh')}
          {field('Bio', 'bio', 'Short description shown below posts')}
          {field('Avatar URL', 'avatar', 'https://...')}
          {field('X / Twitter URL', 'xUrl', 'https://x.com/handle')}
          {field('GitHub URL', 'githubUrl', 'https://github.com/handle')}
          {field('Website URL', 'websiteUrl', 'https://yoursite.com')}
          <button onClick={save} disabled={busy} className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
            <Save className="w-4 h-4" /> {busy ? 'Saving…' : 'Save author'}
          </button>
        </div>
      )}

      {/* Author list */}
      {authors.length === 0 ? (
        <p className="text-center py-16 text-gray-400">No authors yet — add one above.</p>
      ) : (
        <div className="space-y-3">
          {authors.map(a => (
            <div key={a.id} className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-blue-100 dark:bg-blue-900/40">
                {a.avatar ? (
                  <Image src={a.avatar} alt={a.name} width={48} height={48} className="w-full h-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-lg font-bold text-blue-600">{a.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{a.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.bio}</p>
                <div className="flex items-center gap-3 mt-1">
                  {a.xUrl && <a href={a.xUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">X</a>}
                  {a.githubUrl && <a href={a.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"><GitBranch className="w-3 h-3" /> GitHub</a>}
                  {a.websiteUrl && <a href={a.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Website</a>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setEditing(a)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(a.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
