import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCover from './BookCover';
import ReleaseCountdown from './ReleaseCountdown';
import ReleaseDetails from './ReleaseDetails';
import NewsletterForm from './NewsletterForm';
import type { Book } from '../data/books';
import { formatReleaseDate, isReleased } from '../lib/releaseStatus';

interface BookLaunchHeroProps {
  book: Book;
  /** A same-story edition in another language (e.g. the Hindi Shadow
   * Code) — shown alongside the primary cover so readers can see both
   * are available. Omit if there's no translation to show yet. */
  translationEdition?: Book;
}

export default function BookLaunchHero({ book, translationEdition }: BookLaunchHeroProps) {
  const released = book.releaseDate ? isReleased(book.releaseDate) : false;

  return (
    <section className="bg-ink bg-grain text-ivory relative overflow-hidden">
      <div className="hairline-solid w-full opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose/10 via-transparent to-transparent" />

      {/* Top row: countdown, then hero content, together in one unified block */}
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        {!released && book.releaseDate && (
          <div className="mb-12 pb-10 border-b border-gold/15 text-center">
            <p className="eyebrow text-gold-text mb-6">The Code Will Be Revealed In</p>
            <ReleaseCountdown releaseDate={book.releaseDate} />
          </div>
        )}

        <div className="grid items-center gap-12 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-gold-lt mb-3">{released ? 'Now Available' : 'New Release'}</p>
            <h2 className="font-display text-3xl md:text-5xl mb-4">{book.title}</h2>
            <p className="text-ivory/80 leading-relaxed text-lg italic mb-3 max-w-xl">{book.tagline}</p>
            {book.releaseDate && (
              <span className="inline-block label-caps text-2xs text-gold-lt border border-gold/40 rounded-full px-3 py-1 mb-7">
                {released ? 'Now Available' : `Coming ${formatReleaseDate(book.releaseDate)}`}
              </span>
            )}
            <div className="flex flex-wrap gap-4 mt-2">
              <Link to={`/books/${book.slug}`} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3">
                Learn More <ArrowRight size={15} />
              </Link>
              {book.bookWebsite && (
                <a href={book.bookWebsite} className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3" style={{ color: 'var(--gold-lt)' }}>
                  Visit the Official Site <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>
          <div className="flex justify-center items-end gap-6 fade-up">
            <BookCover {...book} size="lg" href={`/books/${book.slug}`} />
            {translationEdition && (
              <div className="flex flex-col items-center gap-2">
                <BookCover {...translationEdition} size="md" href={`/books/${translationEdition.slug}`} />
                <span className="label-caps text-2xs text-gold-lt/80">Hindi Edition</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hairline-solid w-full opacity-20" />

      <div className="relative mx-auto max-w-3xl px-6 py-10 text-center">
        <p className="eyebrow text-gold-text mb-3">Enter the Mystery</p>
        <h3 className="font-display text-2xl md:text-3xl mb-5">A world built to be uncovered, one clue at a time.</h3>
        <p className="text-ivory/80 leading-relaxed max-w-2xl mx-auto">{book.synopsis}</p>
      </div>

      {/* Reader Circle sits in the middle of the flow, not at the end */}
      <div className="hairline-solid w-full opacity-20" />

      <div className="relative mx-auto max-w-3xl px-6 py-10 text-center">
        <p className="eyebrow text-gold-text mb-3">Reader Circle</p>
        <h3 className="font-display text-2xl md:text-3xl mb-2">{released ? 'Join the Reader Circle' : 'Get Release Updates'}</h3>
        <p className="text-ivory/70 text-sm mb-7">
          {released ? `${book.title} is out now — join for future releases, sample chapters, and behind-the-scenes notes.` : `Be the first to know the moment ${book.title} is available.`}
        </p>
        <NewsletterForm id="launch-signup" source="shadow-code-launch" buttonLabel={released ? 'Join the Reader Circle' : 'Get Release Updates'} />
      </div>

      <div className="hairline-solid w-full opacity-20" />

      <div className="relative mx-auto max-w-4xl px-6 py-10">
        <ReleaseDetails book={book} />
      </div>
    </section>
  );
}
