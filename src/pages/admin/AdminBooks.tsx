import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  fetchAdminBooks, saveBook, deleteBook, type AdminBookRow,
  fetchAdminBookCategories, type AdminBookCategoryRow,
} from '../../lib/adminQueries';

const emptyBook: Partial<AdminBookRow> = {
  slug: '', title: '', title_html: null, subtitle: null, author: 'Gaurav Mishra', tagline: '', synopsis: '',
  genre: 'Fiction', categories: null, language: 'English', status: 'published', gradient: 'from-ink via-rose to-amber-400', text_on_dark: true,
  image_src: '', image_width: undefined, image_height: undefined, book_website: '',
  buy_links: [{ label: 'Amazon', href: '#' }, { label: 'Flipkart', href: '#' }, { label: 'Kindle', href: '#' }],
  sort_order: 0,
  release_date: null, kindle_url: null, paperback_url: null, shopify_url: null, goodreads_url: null, featured: false,
  original_language: null, translated_titles: null, author_note: null, isbn10: null, isbn13: null,
  page_count: null, formats: null, sample_url: null, trailer_url: null, themes: null,
  reading_audience: null, seo_title: null, seo_description: null,
};

// A book's slug becomes its /books/:slug URL — it must stay lowercase
// ASCII with hyphens only. Typing the (often non-Latin) title straight into
// this field has happened more than once, producing an unroutable slug
// silently accepted by the form.
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
function slugError(slug: string | null | undefined): string | null {
  if (!slug) return 'Slug is required.';
  return SLUG_RE.test(slug) ? null : 'Slug must be lowercase letters, numbers, and hyphens only (e.g. "shadow-code-hindi"), not the title itself.';
}

/** Comma-separated tag list <-> text[] column, for the admin's plain-input style. */
function tagsToText(tags: string[] | null | undefined): string {
  return (tags ?? []).join(', ');
}
function textToTags(text: string): string[] | null {
  const tags = text.split(',').map((t) => t.trim()).filter(Boolean);
  return tags.length > 0 ? tags : null;
}

/** JSON-textarea <-> jsonb column, for the two structured fields (formats,
 * translated titles) that don't fit a single plain input. */
function jsonToText(value: unknown): string {
  return value ? JSON.stringify(value, null, 2) : '';
}
function textToJson<T>(text: string): T | null {
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export default function AdminBooks() {
  const [books, setBooks] = useState<AdminBookRow[]>([]);
  const [categories, setCategories] = useState<AdminBookCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminBookRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    Promise.all([fetchAdminBooks(), fetchAdminBookCategories()])
      .then(([b, c]) => { setBooks(b); setCategories(c); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    if (!editing) return;
    const slugProblem = slugError(editing.slug);
    if (slugProblem) {
      setError(slugProblem);
      return;
    }
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
                  {b.status === 'upcoming' && <span className="ml-2 label-caps text-2xs text-gold-text border border-gold/40 rounded-full px-2 py-0.5 align-middle">Upcoming</span>}
                </p>
                <p className="text-2xs text-muted">{b.slug} · {b.genre} · {b.language}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(b)} className="p-2 text-muted hover:text-gold-text"><Pencil size={16} /></button>
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
              <Field label="Slug">
                <input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" placeholder="e.g. shadow-code-hindi" />
                {editing.slug && slugError(editing.slug) && <p className="text-2xs text-rose mt-1">{slugError(editing.slug)}</p>}
              </Field>
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
                  <option value="preorder">Preorder</option>
                </select>
              </Field>
            </div>

            <Field label="Synopsis (shown as the book summary on the Readers page)"><textarea rows={4} value={editing.synopsis ?? ''} onChange={(e) => setEditing({ ...editing, synopsis: e.target.value })} className="input" /></Field>

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
              <Field label="Shopify URL (optional)"><input value={editing.shopify_url ?? ''} onChange={(e) => setEditing({ ...editing, shopify_url: e.target.value || null })} className="input" /></Field>
              <Field label="Goodreads URL (optional)"><input value={editing.goodreads_url ?? ''} onChange={(e) => setEditing({ ...editing, goodreads_url: e.target.value || null })} className="input" /></Field>
            </div>

            <p className="label-caps text-muted pt-2 border-t border-gold/15">Additional Details (optional)</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Subtitle"><input value={editing.subtitle ?? ''} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value || null })} className="input" /></Field>
              <Field label="Categories">
                <div className="flex flex-wrap gap-3 pt-1">
                  {categories.map((c) => {
                    const tag = c.tag;
                    const checked = editing.categories?.includes(tag) ?? false;
                    return (
                      <label key={c.id} className="inline-flex items-center gap-1.5 text-sm text-ink cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const current = editing.categories ?? [];
                            const next = e.target.checked ? [...current, tag] : current.filter((t) => t !== tag);
                            setEditing({ ...editing, categories: next.length > 0 ? next : null });
                          }}
                          className="h-3.5 w-3.5 accent-gold"
                        />
                        {c.label}
                      </label>
                    );
                  })}
                  {categories.length === 0 && <span className="text-2xs text-muted">No categories yet. Add some under Book Categories.</span>}
                </div>
              </Field>
              <Field label="Original language (if translated)"><input value={editing.original_language ?? ''} onChange={(e) => setEditing({ ...editing, original_language: e.target.value || null })} className="input" /></Field>
              <Field label="Reading audience"><input value={editing.reading_audience ?? ''} onChange={(e) => setEditing({ ...editing, reading_audience: e.target.value || null })} className="input" /></Field>
              <Field label="ISBN-10"><input value={editing.isbn10 ?? ''} onChange={(e) => setEditing({ ...editing, isbn10: e.target.value || null })} className="input" /></Field>
              <Field label="ISBN-13"><input value={editing.isbn13 ?? ''} onChange={(e) => setEditing({ ...editing, isbn13: e.target.value || null })} className="input" /></Field>
              <Field label="Page count"><input type="number" value={editing.page_count ?? ''} onChange={(e) => setEditing({ ...editing, page_count: e.target.value ? Number(e.target.value) : null })} className="input" /></Field>
              <Field label="Themes (comma-separated)">
                <input value={tagsToText(editing.themes)} onChange={(e) => setEditing({ ...editing, themes: textToTags(e.target.value) })} className="input" />
              </Field>
              <Field label="Sample chapter URL (shown on the book page and Readers page)"><input value={editing.sample_url ?? ''} onChange={(e) => setEditing({ ...editing, sample_url: e.target.value || null })} className="input" placeholder="Link to a PDF, Google Doc, or hosted excerpt" /></Field>
              <Field label="Trailer URL"><input value={editing.trailer_url ?? ''} onChange={(e) => setEditing({ ...editing, trailer_url: e.target.value || null })} className="input" /></Field>
              <Field label="SEO title"><input value={editing.seo_title ?? ''} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value || null })} className="input" /></Field>
              <Field label="SEO description"><input value={editing.seo_description ?? ''} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value || null })} className="input" /></Field>
            </div>
            <Field label="Author's note"><textarea rows={3} value={editing.author_note ?? ''} onChange={(e) => setEditing({ ...editing, author_note: e.target.value || null })} className="input" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Translated titles (JSON, e.g. {&quot;hi&quot;: &quot;...&quot;})">
                <textarea rows={3} value={jsonToText(editing.translated_titles)} onChange={(e) => setEditing({ ...editing, translated_titles: textToJson(e.target.value) })} className="input font-mono text-xs" />
              </Field>
              <Field label="Formats (JSON array, e.g. [{&quot;name&quot;:&quot;Hardcover&quot;}])">
                <textarea rows={3} value={jsonToText(editing.formats)} onChange={(e) => setEditing({ ...editing, formats: textToJson(e.target.value) })} className="input font-mono text-xs" />
              </Field>
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
