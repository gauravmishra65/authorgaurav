import type { ReactNode } from 'react';
import { ExternalLink, Mail, PlayCircle } from 'lucide-react';
import type { Book } from '../data/books';
import BookCover from './BookCover';
import TestimonialModal from './TestimonialModal';
import BookPurchasePanel from './BookPurchasePanel';
import BookSample from './BookSample';
import LanguageBadge from './LanguageBadge';
import FormatBadge from './FormatBadge';
import { trackEvent } from '../lib/analytics';

interface BookHeroProps {
  book: Book;
  released: boolean;
  /** Overrides the generic genre eyebrow — used for Shadow Code's "Techno-Financial Thriller" label. */
  eyebrowOverride?: string;
  /** Optional decorative layer rendered behind the hero content (e.g. ShadowCodeBackground). */
  background?: ReactNode;
  /** Extra class(es) on the cover's wrapper — e.g. the scan-line hover effect. */
  coverWrapperClassName?: string;
  /** Extra class(es) on each retailer button — e.g. the red glow hover effect. */
  purchaseButtonClassName?: string;
  /** When set, renders a "Join the Reader Circle" link (an in-page anchor to the newsletter section) alongside the sample/trailer CTAs. */
  readerCircleHref?: string;
  /** Short devotional/framing line rendered right after the title, before the byline — e.g. Lalita Sahasranama's Hindi intro sentence. */
  introLine?: string;
}

/** The book-page hero: cover, genre/language, title, hook, purchase panel,
 * sample/trailer CTAs when they exist. Reads the `--book-*` theme variables
 * a BookThemeProvider ancestor sets, so it looks right for any book without
 * needing to know which one it is. */
export default function BookHero({ book, released, eyebrowOverride, background, coverWrapperClassName, purchaseButtonClassName, readerCircleHref, introLine }: BookHeroProps) {
  const isHindi = book.language === 'Hindi';
  const isDevotional = book.genre === 'Devotional';
  const roleLabel = isDevotional
    ? (isHindi ? 'संकलनकर्ता' : 'Compiled by')
    : (isHindi ? 'लेखक' : 'By');
  return (
    <section className="relative bg-[var(--book-bg)] bg-grain text-[var(--book-text)]">
      {background}
      <div className="hairline-solid w-full opacity-30" />
      <div className="relative mx-auto max-w-5xl px-6 py-14">
        <div className="grid items-center gap-12 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className={coverWrapperClassName}>
              <BookCover {...book} size="lg" priority />
            </div>
            <TestimonialModal book={book} className="w-full max-w-[240px]" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <p className="eyebrow text-[var(--book-accent)]">{eyebrowOverride ?? book.genre}</p>
              <LanguageBadge language={book.language} tone={book.textOnDark ? 'dark' : 'light'} />
              {book.status !== 'published' && (
                <FormatBadge tone={book.textOnDark ? 'dark' : 'light'}>
                  {released ? 'Now Available' : book.status === 'preorder' ? 'Preorder' : 'Coming Soon'}
                </FormatBadge>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-5xl mb-2">{book.title}</h1>
            {introLine && (
              <p className="text-lg leading-relaxed mb-3" style={{ color: 'var(--book-accent)' }}>{introLine}</p>
            )}
            {/* Devotional works are compiled from scripture, not authored —
               the byline says so rather than crediting Gaurav as "author"
               for a text he didn't write. Localized to Hindi (संकलनकर्ता/लेखक)
               on Hindi-language books rather than always showing the English
               "Compiled by"/"By". */}
            <p className="label-caps text-2xs opacity-70 mb-2">
              {roleLabel} {book.author}
            </p>
            {/* TODO_CONTENT: subtitle is empty for every book today */}
            {book.subtitle && <p className="text-lg opacity-80 mb-3">{book.subtitle}</p>}
            <p className="text-[var(--book-text)]/80 leading-relaxed text-lg italic mb-6">{book.tagline}</p>

            <BookPurchasePanel book={book} className="mb-4" buttonClassName={purchaseButtonClassName} />

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <BookSample sampleUrl={book.sampleUrl} />
              {/* TODO_CONTENT: no book has a trailer_url yet */}
              {book.trailerUrl && (
                <a href={book.trailerUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('trailer_play', { book: book.slug })} className="inline-flex items-center gap-1.5 label-caps text-[var(--book-accent)] hover:text-[var(--book-secondary-accent)] transition-colors">
                  <PlayCircle size={16} /> Watch Trailer
                </a>
              )}
              {readerCircleHref && (
                <a href={readerCircleHref} className="inline-flex items-center gap-1.5 label-caps text-[var(--book-accent)] hover:text-[var(--book-secondary-accent)] transition-colors">
                  <Mail size={15} /> Join the Reader Circle
                </a>
              )}
            </div>

            {book.bookWebsite && (
              <a href={book.bookWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 label-caps text-[var(--book-accent)] hover:text-[var(--book-secondary-accent)] transition-colors">
                Visit the Book Website <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
