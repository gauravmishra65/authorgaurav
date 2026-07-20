import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, FileText } from 'lucide-react';
import { fetchAdminBlogPosts, saveBlogPost, deleteBlogPost, type AdminBlogPostRow } from '../../lib/adminQueries';

const empty: Partial<AdminBlogPostRow> = {
  slug: '', title: '', excerpt: '', content: '', category: 'Writing Craft', gradient: 'from-ink via-rose to-amber-400',
  read_time: '5 min', published_at: new Date().toISOString().slice(0, 10),
};

export default function AdminBlog() {
  const [rows, setRows] = useState<AdminBlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminBlogPostRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetchAdminBlogPosts().then(setRows).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await saveBlogPost(editing);
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await deleteBlogPost(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Blog Posts</h1>
        <button onClick={() => setEditing(empty)} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-4 py-2 text-2xs">
          <Plus size={14} /> Add Post
        </button>
      </div>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && (
        <div className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
          {rows.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3 border-b border-gold/10 last:border-0">
              <div>
                <p className="font-display text-ink">{p.title}</p>
                <p className="text-2xs text-muted">{p.category} · {new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/blog/${p.id}/content`} className="p-2 text-muted hover:text-gold" aria-label="Write full post content" title="Write full post content">
                  <FileText size={16} />
                </Link>
                <button onClick={() => setEditing(p)} className="p-2 text-muted hover:text-gold" aria-label="Edit details"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-muted hover:text-rose" aria-label="Delete post"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="px-5 py-6 text-muted text-sm">No posts yet.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50 overflow-auto" onClick={() => setEditing(null)}>
          <div className="bg-cream rounded-md max-w-xl w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl text-ink">{editing.id ? 'Edit Post' : 'Add Post'}</h2>

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
            {editing.id && (
              <p className="text-2xs text-muted">
                The full "Read More" article body is written on its own page — save this post first, then use the <FileText size={11} className="inline -mt-0.5" aria-hidden="true" /> icon in the list to write or edit it.
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Category</span>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as AdminBlogPostRow['category'] })} className="input">
                  <option>Writing Craft</option><option>Behind the Books</option><option>Spiritual Reflections</option><option>Book Updates</option>
                </select>
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Read Time</span>
                <input value={editing.read_time ?? ''} onChange={(e) => setEditing({ ...editing, read_time: e.target.value })} className="input" placeholder="6 min" />
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Published Date</span>
                <input type="date" value={(editing.published_at ?? '').slice(0, 10)} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} className="input" />
              </label>
              <label className="block">
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
