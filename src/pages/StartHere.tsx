import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import BookCover from '../components/BookCover';
import Divider from '../components/Divider';
import NewsletterForm from '../components/NewsletterForm';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { trackEvent } from '../lib/analytics';

// Rebuilt around reader mood rather than genre labels — "Three genres, one
// writer" undersold the catalog once a fourth, non-fiction-adjacent mood
// (reflective/memoir reading) had a real book to point to. Each path keeps
// the same shape (mood, one real book, a specific "Explore ___" CTA) so a
// reader's click both names the mood (start_here_category) and the actual
// book they're headed to (start_here_book_click) as two distinct signals.
const paths = [
  {
    mood: 'Suspense & Mystery',
    question: 'I want something suspenseful.',
    description: 'Stories built around secrets, crime, technology and difficult choices.',
    slug: 'the-shadow-code',
    cta: 'Explore the Thriller',
  },
  {
    mood: 'Love & Relationships',
    question: 'I want a story about people and relationships.',
    description: 'Contemporary stories about connection, distance, love and the choices people make.',
    slug: 'offbeat-love',
    cta: 'Explore Love Stories',
  },
  {
    mood: 'Faith & Reflection',
    question: 'I want something spiritual.',
    description: 'Accessible devotional reading for reflection, understanding and everyday practice.',
    slug: 'vishnu-sahasranama',
    cta: 'Explore Spiritual Books',
  },
  {
    mood: 'Life & Personal Growth',
    question: 'I want something reflective.',
    description: 'Books about experience, perspective, personal journeys and the lessons we carry forward.',
    slug: 'journey-of-grace',
    cta: 'Explore Reflective Reading',
  },
];

export default function StartHere() {
  const { data: books, loading, error } = useSupabaseData(fetchBooks, []);

  useEffect(() => { trackEvent('start_here_view'); }, []);

  return (
    <>
      <Seo
        title="Start Here: New Reader's Guide | Gaurav Mishra"
        description="New to Gaurav Mishra's books? Choose the mood you're in — suspense, relationships, faith, or reflection — and find the book that fits."
        path="/start-here"
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">New Here?</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Where Should You Start?</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Different books suit different moods. Choose what you feel like reading today.
          </p>
        </div>
      </section>

      {loading && <p className="py-16 text-center text-muted">Loading…</p>}
      {error && <p className="py-16 text-center text-rose">Couldn't load books: {error}</p>}

      {books && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {paths.map(({ mood, question, description, slug, cta }) => {
              const book = books.find((b) => b.slug === slug);
              if (!book) return null;
              const handleClick = () => {
                trackEvent('start_here_category', { mood });
                trackEvent('start_here_book_click', { book: book.slug, mood });
              };
              return (
                <div key={slug} className="content-card flex flex-col items-center text-center p-7">
                  <p className="label-caps text-2xs text-gold-text mb-3">{mood}</p>
                  <h2 className="font-display text-lg text-ink mb-3 leading-snug">{question}</h2>
                  <BookCover {...book} size="sm" href={`/books/${book.slug}`} onClick={handleClick} />
                  <p className="text-sm text-muted leading-relaxed mt-5 mb-6">{description}</p>
                  <Link
                    to={`/books/${book.slug}`}
                    onClick={handleClick}
                    className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-xs px-5 py-2.5 text-2xs mt-auto"
                  >
                    {cta} <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 pb-20 text-center">
          <Divider className="mb-10!" />
          <p className="eyebrow text-gold-text mb-3">Still Deciding?</p>
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-3">Join the Reader Circle</h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">
            Receive thoughtful updates about new books, the stories behind them and occasional extras for readers.
          </p>
          <div className="inline-flex items-center gap-2 label-caps text-2xs text-gold-text mb-6">
            One email a month. No noise. Unsubscribe anytime.
          </div>
          <NewsletterForm id="start-here-signup" buttonLabel="Join the Reader Circle" source="start-here" showGenrePreference />
        </div>
      </section>
    </>
  );
}
