import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  fetchAdminBookCategories, saveBookCategory, deleteBookCategory, type AdminBookCategoryRow,
} from '../../lib/adminQueries';

const empty: Partial<AdminBookCategoryRow> = { label: '', nav_label: null, tag: '', sort_order: 0 };

export default function AdminBookCategories() {
  const [rows, setRows] = useState<AdminBookCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminBookCategoryRow> | null>(null);
  const [tagTouched, setTagTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetchAdminBookCategories().then(setRows).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing({ ...empty, sort_order: rows.length });
    setTagTouched(false);
  };

  const openEdit = (row: AdminBookCategoryRow) => {
    setEditing(row);
    setTagTouched(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await saveBookCategory(editing);
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Books already tagged with it will keep the tag, but it will no longer appear as a filter anywhere on the site.')) return;
    await deleteBookCategory(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Book Categories</h1>
        <button onClick={openNew} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-4 py-2 text-2xs">
          <Plus size={14} /> Add Category
        </button>
      </div>

      <p className="text-sm text-muted mb-6">
        These drive the filter pills on the Books and Home pages, the "Books" dropdown in the site nav, and the category
        checkboxes on each book's edit form, everywhere at once. Add one here and it shows up everywhere automatically.
      </p>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && (
        <div className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
          {rows.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-5 py-3 border-b border-gold/10 last:border-0">
              <div>
                <p className="font-display text-ink">{c.label}</p>
                <p className="text-2xs text-muted">Tag: {c.tag}{c.nav_label && c.nav_label !== c.label ? ` · Nav label: ${c.nav_label}` : ''}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="p-2 text-muted hover:text-gold-text"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-2 text-muted hover:text-rose"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="px-5 py-6 text-muted text-sm">No categories yet.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50 overflow-auto" onClick={() => setEditing(null)}>
          <div className="bg-cream rounded-md max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl text-ink">{editing.id ? 'Edit Category' : 'Add Category'}</h2>

            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Label (shown on filter pills and checkboxes)</span>
              <input
                value={editing.label ?? ''}
                onChange={(e) => {
                  const label = e.target.value;
                  setEditing((prev) => ({ ...prev, label, ...(tagTouched ? {} : { tag: label }) }));
                }}
                className="input"
                placeholder="Career Development"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Internal Tag</span>
              <input
                value={editing.tag ?? ''}
                onChange={(e) => { setTagTouched(true); setEditing({ ...editing, tag: e.target.value }); }}
                className="input"
              />
              <span className="text-2xs text-muted block mt-1">
                The value stored on each book. Defaults to match the label. Only change this on an existing category if
                you want to rename its label without re-tagging every book that already uses it.
              </span>
            </label>
            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Nav Menu Label (optional)</span>
              <input
                value={editing.nav_label ?? ''}
                onChange={(e) => setEditing({ ...editing, nav_label: e.target.value || null })}
                className="input"
                placeholder="Longer wording for the site nav dropdown, e.g. Romance and Contemporary Fiction"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Sort Order</span>
              <input
                type="number"
                value={editing.sort_order ?? 0}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                className="input"
              />
            </label>

            {error && <p className="text-2xs text-rose">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving || !editing.label || !editing.tag} className="btn-caps btn-gold rounded-sm px-5 py-2.5 text-2xs disabled:opacity-60">
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
