import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { fetchAdminBlogPosts, saveBlogPost, type AdminBlogPostRow } from '../../lib/adminQueries';

export default function AdminBlogContent() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<AdminBlogPostRow | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminBlogPosts()
      .then((rows) => {
        const match = rows.find((r) => r.id === id) ?? null;
        setPost(match);
        setContent(match?.content ?? '');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!post) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await saveBlogPost({ id: post.id, content });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted">Loading…</p>;

  if (!post) {
    return (
      <div>
        <p className="text-rose mb-4">Couldn't find that post.</p>
        <Link to="/admin/blog" className="label-caps text-gold hover:text-ink transition-colors inline-flex items-center gap-1.5">
          <ArrowLeft size={13} /> Back to Blog Posts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/blog" className="label-caps text-2xs text-muted hover:text-gold transition-colors inline-flex items-center gap-1.5 mb-4">
        <ArrowLeft size={13} /> Back to Blog Posts
      </Link>

      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl text-ink">{post.title}</h1>
        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="label-caps text-2xs text-muted hover:text-gold transition-colors inline-flex items-center gap-1.5">
          View Live Page <ExternalLink size={12} />
        </a>
      </div>
      <p className="text-2xs text-muted mb-6">/blog/{post.slug} · {post.category}</p>

      <label className="block">
        <span className="label-caps text-muted block mb-1.5 text-2xs">Full Post Content ("Read More" article body)</span>
        <textarea
          rows={20}
          value={content}
          onChange={(e) => { setContent(e.target.value); setSaved(false); }}
          className="input font-body"
          placeholder="Write the full article here. Separate paragraphs with a blank line. Leave empty to show only the excerpt on the post page."
        />
      </label>
      <p className="text-2xs text-muted mt-2">This links to the same post via its slug — visitors reach it by clicking "Read more" on the Blog page.</p>

      {error && <p className="text-2xs text-rose mt-3">{error}</p>}
      {saved && !error && <p className="text-2xs text-gold mt-3">Saved.</p>}

      <div className="flex gap-3 pt-4">
        <button onClick={handleSave} disabled={saving} className="btn-caps btn-gold rounded-sm px-5 py-2.5 text-2xs disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Content'}
        </button>
        <Link to="/admin/blog" className="btn-caps btn-gold-outline rounded-sm px-5 py-2.5 text-2xs">Done</Link>
      </div>
    </div>
  );
}
