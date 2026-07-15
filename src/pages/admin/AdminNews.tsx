import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { fetchAdminNewsItems, saveNewsItem, deleteNewsItem, type AdminNewsItemRow } from '../../lib/adminQueries';

const empty: Partial<AdminNewsItemRow> = {
  slug: '', title: '', excerpt: '', category: 'Announcement', gradient: 'from-ink via-rose to-amber-400',
  published_at: new Date().toISOString().slice(0, 10),
};

export default function AdminNews() {
  const [rows, setRows] = useState<AdminNewsItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminNewsItemRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetchAdminNewsItems().then(setRows).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await saveNewsItem(editing);
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this news item?')) return;
    await deleteNewsItem(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">News &amp; Events</h1>
        <button onClick={() => setEditing(empty)} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-4 py-2 text-2xs">
          <Plus size={14} /> Add News Item
        </button>
      </div>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && (
        <div className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
          {rows.map((n) => (
            <div key={n.id} className="flex items-center justify-between px-5 py-3 border-b border-gold/10 last:border-0">
              <div>
                <p className="font-display text-ink">{n.title}</p>
                <p className="text-2xs text-muted">{n.category} · {new Date(n.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(n)} className="p-2 text-muted hover:text-gold"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(n.id)} className="p-2 text-muted hover:text-rose"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="px-5 py-6 text-muted text-sm">No news items yet.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50 overflow-auto" onClick={() => setEditing(null)}>
          <div className="bg-cream rounded-md max-w-xl w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl text-ink">{editing.id ? 'Edit News Item' : 'Add News Item'}</h2>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Slug</span>
                <input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" />
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Title</span>
                <input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" />
              </label>
            </div>
            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Excerpt</span>
              <textarea rows={3} value={editing.excerpt ?? ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="input" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Category</span>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as AdminNewsItemRow['category'] })} className="input">
                  <option>Release</option><option>Event</option><option>Press</option><option>Announcement</option>
                </select>
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Published Date</span>
                <input type="date" value={(editing.published_at ?? '').slice(0, 10)} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} className="input" />
              </label>
              <label className="block col-span-2">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Gradient (Tailwind classes)</span>
                <input value={editing.gradient ?? ''} onChange={(e) => setEditing({ ...editing, gradient: e.target.value })} className="input" />
              </label>
            </div>

            {error && <p className="text-2xs text-rose">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="btn-caps btn-gold rounded-sm px-5 py-2.5 text-2xs disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(null)} className="btn-caps btn-gold-outline rounded-sm px-5 py-2.5 text-2xs">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
