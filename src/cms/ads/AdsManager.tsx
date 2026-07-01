"use client";

import { useState } from "react";
import { Megaphone, Plus, Trash2, Pencil, Upload, Eye, EyeOff } from "lucide-react";
import { AD_PLACEMENTS, placementLabel, type Ad, type AdType } from "./placements";

type Draft = {
  id?: string;
  name: string;
  placement: string;
  type: AdType;
  imageUrl: string;
  linkUrl: string;
  html: string;
  label: string;
  weight: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
};

function emptyDraft(): Draft {
  return {
    name: "",
    placement: AD_PLACEMENTS[0].id,
    type: "image",
    imageUrl: "",
    linkUrl: "",
    html: "",
    label: "Sponsored",
    weight: 100,
    active: true,
    startsAt: "",
    endsAt: "",
  };
}

function adToDraft(a: Ad): Draft {
  return {
    id: a.id,
    name: a.name,
    placement: a.placement,
    type: a.type,
    imageUrl: a.imageUrl,
    linkUrl: a.linkUrl,
    html: a.html,
    label: a.label,
    weight: a.weight,
    active: a.active,
    startsAt: a.startsAt ? a.startsAt.slice(0, 16) : "",
    endsAt: a.endsAt ? a.endsAt.slice(0, 16) : "",
  };
}

export default function AdsManager({ initialAds }: { initialAds: Ad[] }) {
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function api(action: string, payload: Record<string, unknown> = {}) {
    const res = await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    return res.json().catch(() => ({}));
  }

  async function refresh() {
    const data = await api("list");
    if (data.ads) setAds(data.ads);
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setError("");
    const data = await api("save", {
      ad: {
        id: draft.id,
        name: draft.name,
        placement: draft.placement,
        type: draft.type,
        imageUrl: draft.imageUrl,
        linkUrl: draft.linkUrl,
        html: draft.html,
        label: draft.label,
        weight: draft.weight,
        active: draft.active,
        startsAt: draft.startsAt || null,
        endsAt: draft.endsAt || null,
      },
    });
    setSaving(false);
    if (data.error) {
      setError(data.error + " — has the ad_slots table been created (002_ads.sql)?");
      return;
    }
    setDraft(null);
    refresh();
  }

  async function remove(id: string) {
    await api("delete", { id });
    refresh();
  }

  async function toggle(a: Ad) {
    await api("toggle", { id: a.id, active: !a.active });
    setAds((prev) => prev.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x)));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/cms/upload", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    if (data.url) setDraft((d) => (d ? { ...d, imageUrl: data.url } : d));
    else setError(data.error || "Upload failed.");
  }

  const inputCls =
    "w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700";

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ads</h1>
          </div>
          {!draft && (
            <button
              onClick={() => setDraft(emptyDraft())}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> New ad
            </button>
          )}
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          Upload a banner and assign it to a placement zone. Image ads link out; script ads embed a
          network / Google Ads snippet. Multiple ads in one zone rotate by weight.
        </p>

        {/* Editor */}
        {draft && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                <input className={inputCls} value={draft.name} placeholder="e.g. Sponsor — Acme"
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Placement</label>
                <select className={inputCls} value={draft.placement}
                  onChange={(e) => setDraft({ ...draft, placement: e.target.value })}>
                  {AD_PLACEMENTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label} — {p.hint}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <input type="radio" checked={draft.type === "image"} onChange={() => setDraft({ ...draft, type: "image" })} /> Image banner
              </label>
              <label className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <input type="radio" checked={draft.type === "script"} onChange={() => setDraft({ ...draft, type: "script" })} /> Script / embed
              </label>
            </div>

            {draft.type === "image" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Banner image</label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload"}
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                    </label>
                  </div>
                  <input className={`${inputCls} mt-2`} value={draft.imageUrl} placeholder="…or paste an image URL"
                    onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} />
                  {draft.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.imageUrl} alt="" className="mt-2 max-h-24 rounded border border-gray-200 dark:border-gray-700" />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Click-through URL</label>
                  <input className={inputCls} value={draft.linkUrl} placeholder="https://sponsor.xyz"
                    onChange={(e) => setDraft({ ...draft, linkUrl: e.target.value })} />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Embed HTML / script</label>
                <textarea className={`${inputCls} font-mono h-28`} value={draft.html}
                  placeholder="<script>…</script> or ad-network markup"
                  onChange={(e) => setDraft({ ...draft, html: e.target.value })} />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Label</label>
                <input className={inputCls} value={draft.label}
                  onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Weight</label>
                <input type="number" className={inputCls} value={draft.weight}
                  onChange={(e) => setDraft({ ...draft, weight: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Starts (optional)</label>
                <input type="datetime-local" className={inputCls} value={draft.startsAt}
                  onChange={(e) => setDraft({ ...draft, startsAt: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Ends (optional)</label>
                <input type="datetime-local" className={inputCls} value={draft.endsAt}
                  onChange={(e) => setDraft({ ...draft, endsAt: e.target.value })} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Active
            </label>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2">
              <button onClick={save} disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Saving…" : "Save ad"}
              </button>
              <button onClick={() => { setDraft(null); setError(""); }}
                className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List grouped by placement */}
        {AD_PLACEMENTS.map((zone) => {
          const zoneAds = ads.filter((a) => a.placement === zone.id);
          if (zoneAds.length === 0) return null;
          return (
            <div key={zone.id} className="mb-6">
              <p className="kicker text-gray-400 dark:text-gray-500 mb-2">{zone.label}</p>
              <div className="space-y-2">
                {zoneAds.map((a) => (
                  <div key={a.id}
                    className={`flex items-center gap-3 bg-white dark:bg-gray-900 border rounded-lg p-3 ${a.active ? "border-gray-200 dark:border-gray-800" : "border-gray-100 dark:border-gray-800 opacity-60"}`}>
                    {a.type === "image" && a.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.imageUrl} alt="" className="w-16 h-10 object-cover rounded border border-gray-200 dark:border-gray-700 shrink-0" />
                    ) : (
                      <div className="w-16 h-10 rounded bg-gray-100 dark:bg-gray-800 grid place-items-center text-[10px] text-gray-400 shrink-0">EMBED</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{a.name || "Untitled ad"}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        {a.type} · weight {a.weight}{a.linkUrl ? ` · ${a.linkUrl}` : ""}
                      </p>
                    </div>
                    <button onClick={() => toggle(a)} title={a.active ? "Deactivate" : "Activate"}
                      className="p-2 rounded text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 shrink-0">
                      {a.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setDraft(adToDraft(a))} title="Edit"
                      className="p-2 rounded text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 shrink-0">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(a.id)} title="Delete"
                      className="p-2 rounded text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {ads.length === 0 && !draft && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">
            No ads yet. Click “New ad” to create your first placement.
          </p>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          Placement zones: {AD_PLACEMENTS.map((p) => placementLabel(p.id)).join(" · ")}.
        </p>
      </div>
    </div>
  );
}
