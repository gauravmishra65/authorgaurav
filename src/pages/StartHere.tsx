import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import Seo from '../components/Seo';
import BookCover from '../components/BookCover';
import Divider from '../components/Divider';
import NewsletterForm from '../components/NewsletterForm';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

const paths = [
  { slug: 'offbeat-love', eyebrow: 'If you love romance', reason: 'A heartfelt love story set to the pulse of Mumbai — start here for music, family, and the courage to choose each other.' },
  { slug: 'the-shadow-code', eyebrow: 'If you love mystery & thrillers', reason: 'A taut techno-thriller of secrets, surveillance, and a whistleblower who can’t stop what she started.' },
  { slug: 'vishnu-sahasranama', eyebrow: 'If you want something spiritual', reason: 'A thousand names, one steady anchor — devotional reading for daily reflection.' },
];

export default function StartHere() {
  const { data: books, loading, error } = useSupabaseData(fetchBooks, []);

  return (
    <>
      <Seo
        title="Start Here — New Reader's Guide | Gaurav Mishra"
        description="New to Gaurav Mishra's books? Find the right first read — romance, mystery, or something spiritual — and get a free first chapter."
        path="/start-here"
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">New Here?</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Start With the Right Book For You</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Three genres, one writer. Tell us what you're in the mood for, and we'll point you to the book that fits.
          </p>
        </div>
      </section>

      {loading && <p className="py-16 text-center text-muted">Loading…</p>}
      {error && <p className="py-16 text-center text-rose">Couldn't load books: {error}</p>}

      {books && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-3">
            {paths.map(({ slug, eyebrow, reason }) => {
              const book = books.find((b) => b.slug === slug);
              if (!book) return null;
              return (
                <div key={slug} className="content-card flex flex-col items-center text-center p-8">
                  <p className="label-caps text-gold mb-5">{eyebrow}</p>
                  <BookCover {...book} size="md" href={`/books/${book.slug}`} />
                  <h2 className="font-display text-xl text-ink mt-6 mb-2">{book.title}</h2>
                  <p className="text-sm text-muted leading-relaxed mb-6">{reason}</p>
                  <Link to={`/books/${book.slug}`} className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-2xs mt-auto">
                    Read More <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 pb-20 text-center">
          <Divider className="!mb-10" />
          <p className="eyebrow text-gold mb-3">Not Sure Yet?</p>
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-3">Get a free first chapter, no commitment</h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">
            Tell us what you love reading and we'll send a free chapter to match — plus a note whenever a new book arrives.
          </p>
          <div className="inline-flex items-center gap-2 label-caps text-2xs text-gold mb-6">
            <Mail size={14} aria-hidden="true" /> One email a month. No noise. Unsubscribe anytime.
          </div>
          <NewsletterForm id="start-here-signup" buttonLabel="Send Me a Chapter" source="start-here" showGenrePreference />
        </div>
      </section>
    </>
  );
}
