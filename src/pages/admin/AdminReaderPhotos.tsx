import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  fetchAdminReaderPhotos, saveReaderPhoto, deleteReaderPhoto, type AdminReaderPhotoRow,
  fetchAdminBooks, type AdminBookRow,
} from '../../lib/adminQueries';

const empty: Partial<AdminReaderPhotoRow> = { image_src: '', reader_name: '', caption: '', book_id: null, sort_order: 0 };

export default function AdminReaderPhotos() {
  const [rows, setRows] = useState<AdminReaderPhotoRow[]>([]);
  const [books, setBooks] = useState<AdminBookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminReaderPhotoRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    Promise.all([fetchAdminReaderPhotos(), fetchAdminBooks()])
      .then(([p, b]) => { setRows(p); setBooks(b); })
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
      await saveReaderPhoto(editing);
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reader photo?')) return;
    await deleteReaderPhoto(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Reader Photos</h1>
        <button onClick={() => setEditing(empty)} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-4 py-2 text-2xs">
          <Plus size={14} /> Add Reader Photo
        </button>
      </div>

      <p className="text-sm text-muted mb-6">
        Shown in the Reader Photos gallery on the Events page. Add the image file to the repo first (same convention as book covers), then enter its path here.
      </p>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && (
        <div className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
          {rows.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3 border-b border-gold/10 last:border-0 gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <img src={p.image_src} alt="" className="w-12 h-12 rounded-sm object-cover flex-shrink-0 bg-cream" />
                <div className="min-w-0">
                  <p className="font-display text-ink truncate">{p.reader_name || 'Unnamed reader'}</p>
                  <p className="text-2xs text-muted truncate">{p.caption || '—'} · {bookTitle(p.book_id)}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(p)} className="p-2 text-muted hover:text-gold-text"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-muted hover:text-rose"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="px-5 py-6 text-muted text-sm">No reader photos yet.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50 overflow-auto" onClick={() => setEditing(null)}>
          <div className="bg-cream rounded-md max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl text-ink">{editing.id ? 'Edit Reader Photo' : 'Add Reader Photo'}</h2>

            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Image path</span>
              <input value={editing.image_src ?? ''} onChange={(e) => setEditing({ ...editing, image_src: e.target.value })} className="input" placeholder="/images/reader-photos/example.jpg" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Reader Name (optional)</span>
                <input value={editing.reader_name ?? ''} onChange={(e) => setEditing({ ...editing, reader_name: e.target.value || null })} className="input" />
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Sort Order</span>
                <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input" />
              </label>
            </div>
            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Caption (optional)</span>
              <textarea rows={2} value={editing.caption ?? ''} onChange={(e) => setEditing({ ...editing, caption: e.target.value || null })} className="input" />
            </label>
            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Book (optional)</span>
              <select value={editing.book_id ?? ''} onChange={(e) => setEditing({ ...editing, book_id: e.target.value || null })} className="input">
                <option value="">— None —</option>
                {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
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
