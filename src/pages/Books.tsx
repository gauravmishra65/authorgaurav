import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Seo from '../components/Seo';
import BookCover from '../components/BookCover';
import EmailStrip from '../components/EmailStrip';
import Divider from '../components/Divider';
import type { Book, Genre } from '../data/books';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

const genreOrder: Genre[] = ['Fiction', 'Memoir', 'Devotional'];
const genreEyebrow: Record<Genre, string> = {
  Fiction: 'Novels & Thrillers',
  Memoir: 'Memoir',
  Devotional: 'Devotional Works',
};

function BookArticle({ book }: { book: Book }) {
  return (
    <article className={`grid gap-8 md:grid-cols-[200px_1fr] md:gap-12 ${book.featured ? 'rounded-md border border-gold/25 bg-cream/60 p-6 -mx-6 relative' : ''}`}>
      {book.featured && (
        <span className="absolute -top-3 left-6 label-caps text-2xs bg-gold text-ink rounded-full px-3 py-1 shadow-luxury">New Release</span>
      )}
      <div className="flex justify-center md:justify-start">
        <BookCover {...book} size={book.featured ? 'lg' : 'md'} href={`/books/${book.slug}`} />
      </div>
      <div>
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <Link to={`/books/${book.slug}`} className="font-display text-2xl md:text-3xl text-ink hover:text-gold transition-colors">{book.title}</Link>
          {book.isHindi && (
            <span className="label-caps text-2xs text-rose border border-rose/40 rounded-full px-2.5 py-0.5">Hindi</span>
          )}
          {book.status === 'upcoming' && (
            <span className="label-caps text-2xs text-gold border border-gold/40 rounded-full px-2.5 py-0.5">Coming Soon</span>
          )}
        </div>
        <p className="font-body italic text-muted mb-4">{book.tagline}</p>
        <p className="text-text/85 leading-relaxed max-w-prose mb-6">{book.synopsis}</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {book.buyLinks.map((link) => (
            <a key={link.label} href={link.href} className="btn-caps btn-gold-outline rounded-sm px-4 py-2 text-2xs">{link.label}</a>
          ))}
        </div>
        {book.bookWebsite && (
          <a href={book.bookWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 label-caps text-gold hover:text-ink transition-colors">
            Book Website <ExternalLink size={13} />
          </a>
        )}
      </div>
    </article>
  );
}

export default function Books() {
  const { data: books, loading, error } = useSupabaseData(fetchBooks, []);
  const upcoming = books?.filter((b) => b.status === 'upcoming') ?? [];

  return (
    <>
      <Seo
        title="Books — Gaurav Mishra | Romance, Thriller, Memoir & Devotional"
        description="Browse every book by Gaurav Mishra — Offbeat Love, Shadow Code, A Journey of Grace, and devotional works in Hindi. Buy on Amazon, Flipkart, and Kindle."
      />

      <section className="bg-ink text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">The Catalog</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">The Books</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            From romance to thriller to memoir to devotion — works that share one belief: a good story can carry a reader anywhere.
          </p>
        </div>
      </section>

      {loading && <p className="py-16 text-center text-muted">Loading books…</p>}
      {error && <p className="py-16 text-center text-rose">Couldn't load books: {error}</p>}

      {upcoming.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-center gap-4 mb-10">
            <p className="eyebrow text-gold">Coming Soon</p>
            <div className="hairline flex-1" />
          </div>
          <div className="space-y-14">
            {upcoming.map((b) => <BookArticle key={b.id} book={b} />)}
          </div>
          <Divider className="!my-10" />
        </section>
      )}

      {books && genreOrder.map((genre) => {
        const list = books.filter((b) => b.genre === genre && b.status !== 'upcoming');
        if (list.length === 0) return null;
        return (
          <section key={genre} className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex items-center gap-4 mb-10">
              <p className="eyebrow text-gold">{genreEyebrow[genre]}</p>
              <div className="hairline flex-1" />
            </div>

            <div className="space-y-14">
              {list.map((b) => <BookArticle key={b.id} book={b} />)}
            </div>
            <Divider className="!my-10" />
          </section>
        );
      })}

      {/* MICROSITES */}
      <section className="bg-ink-soft text-ivory">
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
          <Link to="/testimonials" className="label-caps text-gold hover:text-ink transition-colors">Read Reviews &amp; Share Your Feedback</Link>
        </p>
      </section>
    </>
  );
}
