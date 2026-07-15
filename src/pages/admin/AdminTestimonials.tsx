import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  fetchAdminTestimonials, saveTestimonial, deleteTestimonial, type AdminTestimonialRow,
  fetchAdminBooks, type AdminBookRow,
} from '../../lib/adminQueries';

const empty: Partial<AdminTestimonialRow> = { book_id: null, quote: '', name: '', source: '', featured: false, sort_order: 0 };

export default function AdminTestimonials() {
  const [rows, setRows] = useState<AdminTestimonialRow[]>([]);
  const [books, setBooks] = useState<AdminBookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminTestimonialRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    Promise.all([fetchAdminTestimonials(), fetchAdminBooks()])
      .then(([t, b]) => { setRows(t); setBooks(b); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const bookTitle = (id: string | null) => books.find((b) => b.id === id)?.title ?? '—';

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await saveTestimonial(editing);
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await deleteTestimonial(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">What Readers Say</h1>
        <button onClick={() => setEditing(empty)} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-4 py-2 text-2xs">
          <Plus size={14} /> Add Testimonial
        </button>
      </div>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && (
        <div className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
          {rows.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-5 py-3 border-b border-gold/10 last:border-0 gap-4">
              <div className="min-w-0">
                <p className="text-ink italic truncate">"{t.quote}"</p>
                <p className="text-2xs text-muted">{t.name}{t.source ? ` · ${t.source}` : ''} — {bookTitle(t.book_id)}{t.featured ? ' · Featured on home' : ''}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(t)} className="p-2 text-muted hover:text-gold"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-muted hover:text-rose"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="px-5 py-6 text-muted text-sm">No testimonials yet.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50 overflow-auto" onClick={() => setEditing(null)}>
          <div className="bg-cream rounded-md max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl text-ink">{editing.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>

            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Quote</span>
              <textarea rows={3} value={editing.quote ?? ''} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} className="input" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Reader Name</span>
                <input value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" />
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Source</span>
                <input value={editing.source ?? ''} onChange={(e) => setEditing({ ...editing, source: e.target.value })} className="input" placeholder="Amazon, Goodreads…" />
              </label>
            </div>
            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Book</span>
              <select value={editing.book_id ?? ''} onChange={(e) => setEditing({ ...editing, book_id: e.target.value || null })} className="input">
                <option value="">— None —</option>
                {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="h-4 w-4 accent-gold" />
              <span className="text-sm text-muted">Feature on home page ("What Readers Say")</span>
            </label>

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
