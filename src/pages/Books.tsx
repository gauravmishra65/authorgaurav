import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Seo from '../components/Seo';
import BookCover from '../components/BookCover';
import BookSearch from '../components/BookSearch';
import BookFilters from '../components/BookFilters';
import BookGrid from '../components/BookGrid';
import EmailStrip from '../components/EmailStrip';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

const categoryOptions = ['All', 'Thriller', 'Romance', 'Spiritual', 'Memoir'] as const;
const languageOptions = ['All', 'English', 'Hindi'] as const;
const statusOptions = ['All', 'Published', 'Upcoming'] as const;

// "Spiritual" (the spec's label) maps onto the Devotional category tag
// already used in the data.
const categoryToTag: Record<(typeof categoryOptions)[number], string | null> = {
  All: null, Thriller: 'Thriller', Romance: 'Romance', Spiritual: 'Devotional', Memoir: 'Memoir',
};

export default function Books() {
  const { data: books, loading, error } = useSupabaseData(fetchBooks, []);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const initialCategory = categoryOptions.includes(categoryParam as never) ? (categoryParam as (typeof categoryOptions)[number]) : 'All';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>(initialCategory);
  const [language, setLanguage] = useState<(typeof languageOptions)[number]>('All');
  const [status, setStatus] = useState<(typeof statusOptions)[number]>(searchParams.get('status') === 'Upcoming' ? 'Upcoming' : 'All');

  const featured = books?.find((b) => b.featured);

  const filtered = useMemo(() => {
    if (!books) return [];
    const tag = categoryToTag[category];
    return books.filter((b) => {
      if (query && !b.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (tag && !(b.categories?.includes(tag) ?? b.genre === tag)) return false;
      if (language !== 'All' && b.language !== language) return false;
      if (status === 'Published' && b.status !== 'published') return false;
      if (status === 'Upcoming' && b.status === 'published') return false;
      return true;
    });
  }, [books, query, category, language, status]);

  return (
    <>
      <Seo
        title="Books — Gaurav Mishra | Romance, Thriller, Memoir & Devotional"
        description="Browse every book by Gaurav Mishra — Offbeat Love, Shadow Code, A Journey of Grace, and devotional works in Hindi. Buy on Amazon, Flipkart, and Kindle."
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-10 text-center">
          <p className="eyebrow text-gold-lt mb-4">The Catalog</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">The Books</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            From romance to thriller to memoir to devotion — works that share one belief: a good story can carry a reader anywhere.
          </p>
        </div>
      </section>

      {loading && <p className="py-16 text-center text-muted">Loading books…</p>}
      {error && <p className="py-16 text-center text-rose">Couldn't load books: {error}</p>}

      {featured && (
        <section className="bg-cream">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <p className="eyebrow text-gold-text mb-6 text-center">Featured Release</p>
            <div className="grid items-center gap-8 md:grid-cols-[180px_1fr]">
              <div className="flex justify-center">
                <BookCover {...featured} size="lg" href={`/books/${featured.slug}`} />
              </div>
              <div>
                <Link to={`/books/${featured.slug}`} className="font-display text-2xl md:text-3xl text-ink hover:text-gold-text transition-colors">{featured.title}</Link>
                <p className="font-body italic text-muted mt-1 mb-4">{featured.tagline}</p>
                <Link to={`/books/${featured.slug}`} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-2xs">
                  Explore the Book <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {books && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col items-center gap-6 mb-12">
            <BookSearch value={query} onChange={setQuery} />
            <BookFilters label="Filter by genre" options={categoryOptions} value={category} onChange={setCategory} />
            <div className="flex flex-wrap justify-center gap-4">
              <BookFilters label="Filter by language" options={languageOptions} value={language} onChange={setLanguage} />
              <BookFilters label="Filter by status" options={statusOptions} value={status} onChange={setStatus} />
            </div>
          </div>

          <BookGrid books={filtered} />
        </section>
      )}

      {/* MICROSITES */}
      <section className="bg-ink-soft bg-grain text-ivory">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center mb-10">
            <p className="eyebrow text-gold-lt mb-3">Explore the Dedicated Worlds</p>
            <h2 className="font-display text-2xl md:text-3xl">Two books, two microsites</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <a href="https://off-beat-love.com" target="_blank" rel="noopener noreferrer"
              className="group rounded-md border border-gold/25 bg-ink p-8 text-center transition-all hover:-translate-y-1 hover:border-gold/50">
              <p className="font-display text-xl mb-2 group-hover:text-gold-lt transition-colors">Offbeat Love</p>
              <p className="text-sm text-ivory/70 mb-4">Visit the dedicated site for music, extras, and the world of the novel.</p>
              <span className="inline-flex items-center gap-1.5 label-caps text-gold-lt">off-beat-love.com <ExternalLink size={13} /></span>
            </a>
            <a href="https://the-shadow-code.com" target="_blank" rel="noopener noreferrer"
              className="group rounded-md border border-gold/25 bg-ink p-8 text-center transition-all hover:-translate-y-1 hover:border-gold/50">
              <p className="font-display text-xl mb-2 group-hover:text-gold-lt transition-colors">Shadow Code</p>
              <p className="text-sm text-ivory/70 mb-4">Visit the dedicated site for behind-the-scenes and the world of the thriller.</p>
              <span className="inline-flex items-center gap-1.5 label-caps text-gold-lt">the-shadow-code.com <ExternalLink size={13} /></span>
            </a>
          </div>
        </div>
      </section>

      <EmailStrip />

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">Want a taste before you buy?</h2>
        <p className="text-muted mb-7 max-w-lg mx-auto">Get a free chapter delivered to your inbox — and a note when the next book arrives.</p>
        <Link to="/contact" className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3">
          Get in Touch <ArrowRight size={15} />
        </Link>
        <p className="mt-6">
          <Link to="/testimonials" className="label-caps text-gold-text hover:text-ink transition-colors">Read Reviews &amp; Share Your Feedback</Link>
        </p>
      </section>
    </>
  );
}
