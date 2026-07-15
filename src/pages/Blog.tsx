import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import EmailStrip from '../components/EmailStrip';
import Divider from '../components/Divider';
import { blogCategories, type BlogCategory } from '../data/posts';
import { fetchBlogPosts } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

export default function Blog() {
  const [filter, setFilter] = useState<(typeof blogCategories)[number]>('All');
  const { data: posts, loading, error } = useSupabaseData(fetchBlogPosts, []);
  const filtered = !posts ? [] : filter === 'All' ? posts : posts.filter((p) => p.category === (filter as BlogCategory));

  return (
    <>
      <Seo
        title="Blog — Gaurav Mishra | Writing Craft, Behind the Books & Spiritual Reflections"
        description="Essays on writing craft, the stories behind the books, spiritual reflections on devotional hymns, and book updates from author Gaurav Mishra."
      />

      <section className="bg-ink text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">The Journal</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">From the Blog</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Notes on the writing life — craft, the stories behind the books, and reflections on the hymns that keep me grounded.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {blogCategories.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`label-caps px-4 py-2 rounded-full border transition-all ${filter === c ? 'bg-ink text-gold-lt border-gold' : 'bg-cream text-text/70 border-gold/25 hover:border-gold/60 hover:text-ink'}`}>
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-muted pb-16">Loading posts…</p>}
        {error && <p className="text-center text-rose pb-16">Couldn't load posts: {error}</p>}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-16">
          {filtered.map((p) => (
            <article key={p.id} className="group flex flex-col rounded-md border border-gold/15 bg-cream overflow-hidden shadow-luxury transition-all hover:-translate-y-1 hover:shadow-book-hover">
              <div className={`h-44 bg-gradient-to-br ${p.gradient} relative`}>
                <span className="absolute bottom-3 left-3 label-caps text-2xs text-ivory/90 bg-ink/40 px-2.5 py-1 rounded-sm">{p.category}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-2xs text-muted mb-2">{p.date} · {p.readTime} read</p>
                <h2 className="font-display text-xl text-ink mb-2 group-hover:text-gold transition-colors">{p.title}</h2>
                <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1">{p.excerpt}</p>
                <Link to="/blog" className="mt-4 inline-flex items-center gap-1.5 label-caps text-gold hover:text-ink transition-colors text-2xs">
                  Read more <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <Divider />
      </section>

      <EmailStrip
        heading="Never miss a post — or a new release"
        subheading="One letter a month: essays, behind-the-scenes, and early word on what's next."
      />
    </>
  );
}
