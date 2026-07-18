import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { fetchAdminBooks, saveBook, deleteBook, type AdminBookRow } from '../../lib/adminQueries';

const emptyBook: Partial<AdminBookRow> = {
  slug: '', title: '', title_html: null, author: 'Gaurav Mishra', tagline: '', synopsis: '',
  genre: 'Fiction', language: 'English', status: 'published', gradient: 'from-ink via-rose to-amber-400', text_on_dark: true,
  image_src: '', image_width: undefined, image_height: undefined, book_website: '',
  buy_links: [{ label: 'Amazon', href: '#' }, { label: 'Flipkart', href: '#' }, { label: 'Kindle', href: '#' }],
  sort_order: 0,
  release_date: null, kindle_url: null, paperback_url: null, featured: false,
};

export default function AdminBooks() {
  const [books, setBooks] = useState<AdminBookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminBookRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetchAdminBooks().then(setBooks).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await saveBook(editing);
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this book? This cannot be undone.')) return;
    await deleteBook(id);
    load();
  };

  const updateBuyLink = (index: number, href: string) => {
    if (!editing) return;
    const links = [...(editing.buy_links ?? [])];
    links[index] = { ...links[index], href };
    setEditing({ ...editing, buy_links: links });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Books</h1>
        <button onClick={() => setEditing(emptyBook)} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-4 py-2 text-2xs">
          <Plus size={14} /> Add Book
        </button>
      </div>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && (
        <div className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
          {books.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-5 py-3 border-b border-gold/10 last:border-0">
              <div>
                <p className="font-display text-ink">
                  {b.title}
                  {b.status === 'upcoming' && <span className="ml-2 label-caps text-2xs text-gold border border-gold/40 rounded-full px-2 py-0.5 align-middle">Upcoming</span>}
                </p>
                <p className="text-2xs text-muted">{b.slug} · {b.genre} · {b.language}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(b)} className="p-2 text-muted hover:text-gold"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(b.id)} className="p-2 text-muted hover:text-rose"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {books.length === 0 && <p className="px-5 py-6 text-muted text-sm">No books yet.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50 overflow-auto" onClick={() => setEditing(null)}>
          <div className="bg-cream rounded-md max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl text-ink">{editing.id ? 'Edit Book' : 'Add Book'}</h2>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Slug"><input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" /></Field>
              <Field label="Title"><input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" /></Field>
              <Field label="Author"><input value={editing.author ?? ''} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className="input" /></Field>
              <Field label="Tagline"><input value={editing.tagline ?? ''} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} className="input" /></Field>
              <Field label="Genre">
                <select value={editing.genre} onChange={(e) => setEditing({ ...editing, genre: e.target.value as AdminBookRow['genre'] })} className="input">
                  <option>Fiction</option><option>Memoir</option><option>Devotional</option>
                </select>
              </Field>
              <Field label="Language">
                <select value={editing.language} onChange={(e) => setEditing({ ...editing, language: e.target.value as AdminBookRow['language'] })} className="input">
                  <option>English</option><option>Hindi</option>
                </select>
              </Field>
              <Field label="Status">
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as AdminBookRow['status'] })} className="input">
                  <option value="published">Published</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </Field>
            </div>

            <Field label="Synopsis"><textarea rows={4} value={editing.synopsis ?? ''} onChange={(e) => setEditing({ ...editing, synopsis: e.target.value })} className="input" /></Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Cover image path"><input value={editing.image_src ?? ''} onChange={(e) => setEditing({ ...editing, image_src: e.target.value })} className="input" placeholder="/images/book-covers/example.webp" /></Field>
              <Field label="Book website (optional)"><input value={editing.book_website ?? ''} onChange={(e) => setEditing({ ...editing, book_website: e.target.value })} className="input" /></Field>
              <Field label="Image width (px)"><input type="number" value={editing.image_width ?? ''} onChange={(e) => setEditing({ ...editing, image_width: e.target.value ? Number(e.target.value) : undefined })} className="input" /></Field>
              <Field label="Image height (px)"><input type="number" value={editing.image_height ?? ''} onChange={(e) => setEditing({ ...editing, image_height: e.target.value ? Number(e.target.value) : undefined })} className="input" /></Field>
              <Field label="Gradient (Tailwind classes)"><input value={editing.gradient ?? ''} onChange={(e) => setEditing({ ...editing, gradient: e.target.value })} className="input" /></Field>
              <Field label="Sort order"><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input" /></Field>
              <Field label="Release date (optional)"><input type="date" value={editing.release_date ?? ''} onChange={(e) => setEditing({ ...editing, release_date: e.target.value || null })} className="input" /></Field>
              <Field label="Featured (New Release ribbon)">
                <select value={editing.featured ? 'true' : 'false'} onChange={(e) => setEditing({ ...editing, featured: e.target.value === 'true' })} className="input">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </Field>
              <Field label="Kindle URL (optional)"><input value={editing.kindle_url ?? ''} onChange={(e) => setEditing({ ...editing, kindle_url: e.target.value || null })} className="input" /></Field>
              <Field label="Paperback URL (optional)"><input value={editing.paperback_url ?? ''} onChange={(e) => setEditing({ ...editing, paperback_url: e.target.value || null })} className="input" /></Field>
            </div>

            <p className="label-caps text-muted">Buy Links</p>
            <div className="grid grid-cols-3 gap-3">
              {(editing.buy_links ?? []).map((link, i) => (
                <Field key={link.label} label={link.label}>
                  <input value={link.href} onChange={(e) => updateBuyLink(i, e.target.value)} className="input" />
                </Field>
              ))}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps text-muted block mb-1.5 text-2xs">{label}</span>
      {children}
    </label>
  );
}
