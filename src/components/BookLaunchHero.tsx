import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCover from './BookCover';
import ReleaseCountdown from './ReleaseCountdown';
import { formatReleaseDate, isReleased } from '../lib/releaseStatus';
import type { Book } from '../data/books';

interface BookLaunchHeroProps {
  book: Book;
  /** A same-story edition in another language (e.g. the Hindi Shadow
   * Code) — shown alongside the primary cover so readers can see both
   * are available, and can choose between them. Omit if there's no
   * translation to show yet. */
  translationEdition?: Book;
}

/** The homepage's single "current featured book" block — kept deliberately
 * compact (cover, one-line hook, a short real description, Explore Book,
 * Read a Sample if one exists) rather than reproducing the book's full
 * detail page here. Milestone stats, bookstore photos, and the full
 * retailer-button row all have their real home on the book's own page
 * (BookDetail.tsx / BookHero.tsx) — nothing here is lost, just not
 * duplicated on the homepage. */
export default function BookLaunchHero({ book, translationEdition }: BookLaunchHeroProps) {
  // Published books without a stored releaseDate (several don't have one)
  // must still read as "Now Available", not "New Release" — status is the
  // real source of truth here, releaseDate only matters for books that
  // aren't out yet (to drive the countdown below).
  const released = book.status === 'published' || (book.releaseDate ? isReleased(book.releaseDate) : false);

  return (
    <section className="bg-ink bg-grain text-ivory relative overflow-hidden">
      <div className="hairline-solid w-full opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-rose/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-5xl px-6 py-16">
        {!released && book.releaseDate && (
          <div className="mb-12 pb-10 border-b border-gold/15 text-center">
            <p className="eyebrow text-gold-text mb-6">Releasing In</p>
            <ReleaseCountdown releaseDate={book.releaseDate} />
          </div>
        )}

        <div className="grid items-center gap-12 md:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center md:items-start">
            {translationEdition && <p className="label-caps text-2xs text-gold-lt/70 mb-3">Choose Edition</p>}
            <div className="flex justify-center items-end gap-6 fade-up mx-auto md:mx-0">
              <BookCover {...book} size="lg" href={`/books/${book.slug}`} priority />
              {translationEdition && (
                <div className="flex flex-col items-center gap-2">
                  <BookCover {...translationEdition} size="md" href={`/books/${translationEdition.slug}`} />
                  <span className="label-caps text-2xs text-gold-lt/80">Hindi Edition</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="eyebrow text-gold-lt mb-3">{book.genre}</p>
            <h2 className="font-display text-3xl md:text-5xl mb-4">{book.title}</h2>
            <p className="text-ivory/80 leading-relaxed text-lg italic mb-5 max-w-xl mx-auto md:mx-0">{book.tagline}</p>
            <p className="text-ivory/70 leading-relaxed mb-7 max-w-xl mx-auto md:mx-0">{book.synopsis}</p>

            {!released && book.releaseDate && (
              <p className="label-caps text-2xs text-gold-lt border border-gold/40 rounded-full px-3 py-1 inline-block mb-7">
                Coming {formatReleaseDate(book.releaseDate)}
              </p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link to={`/books/${book.slug}`} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-xs px-6 py-3">
                Explore the Book <ArrowRight size={15} />
              </Link>
              {book.sampleUrl && (
                <a href={book.sampleUrl} target="_blank" rel="noopener noreferrer" className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-xs px-6 py-3" style={{ color: 'var(--gold-lt)' }}>
                  Read a Sample <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
