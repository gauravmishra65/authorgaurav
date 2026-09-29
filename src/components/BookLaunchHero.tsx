import { ArrowRight, ExternalLink, BookOpen, Globe, Store, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCover from './BookCover';
import ReleaseCountdown from './ReleaseCountdown';
import ReleaseDetails from './ReleaseDetails';
import RetailerButton from './RetailerButton';
import { getBuyOptions, type Book } from '../data/books';
import { formatReleaseDate, isReleased } from '../lib/releaseStatus';
import { fetchReaderPhotos } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { buildBookstoreAvailabilityText } from '../lib/bookstoreAvailability';
import { trackEvent } from '../lib/analytics';

interface BookLaunchHeroProps {
  book: Book;
  /** A same-story edition in another language (e.g. the Hindi Shadow
   * Code) — shown alongside the primary cover so readers can see both
   * are available. Omit if there's no translation to show yet. */
  translationEdition?: Book;
}

export default function BookLaunchHero({ book, translationEdition }: BookLaunchHeroProps) {
  const released = book.releaseDate ? isReleased(book.releaseDate) : false;
  const { data: allPhotos } = useSupabaseData(fetchReaderPhotos, []);
  const bookstorePhotos = (allPhotos ?? []).filter((p) => p.kind === 'bookstore' && p.bookTitle === book.title);
  const bookstoreAvailabilityText = buildBookstoreAvailabilityText(book.title, bookstorePhotos);

  // Richer milestone showcase (cover + buy actions + retailer row + stat
  // card + bottom stat strip) — only shown once a book actually has real
  // milestone numbers to display, so this never renders half-empty.
  const hasMilestoneShowcase = !!book.milestoneSalesCount;
  const buyOptions = getBuyOptions(book);
  const primaryBuyOption = buyOptions[0];
  const languageCount = translationEdition ? 2 : 1;

  return (
    <section className="bg-ink bg-grain text-ivory relative overflow-hidden">
      <div className="hairline-solid w-full opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose/10 via-transparent to-transparent" />

      {/* Top row: countdown, then hero content, together in one unified block */}
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        {!released && book.releaseDate && (
          <div className="mb-12 pb-10 border-b border-gold/15 text-center">
            <p className="eyebrow text-gold-text mb-6">Releasing In</p>
            <ReleaseCountdown releaseDate={book.releaseDate} />
          </div>
        )}

        {hasMilestoneShowcase ? (
          <div className="grid gap-10 lg:grid-cols-[auto_1fr_auto] items-start">
            <div className="flex justify-center items-end gap-6 fade-up mx-auto lg:mx-0">
              <BookCover {...book} size="lg" href={`/books/${book.slug}`} />
              {translationEdition && (
                <div className="flex flex-col items-center gap-2">
                  <BookCover {...translationEdition} size="md" href={`/books/${translationEdition.slug}`} />
                  <span className="label-caps text-2xs text-gold-lt/80">Hindi Edition</span>
                </div>
              )}
            </div>

            <div className="text-center lg:text-left">
              <p className="eyebrow text-gold-lt mb-3">{released ? 'Now Available' : 'New Release'}</p>
              <h2 className="font-display text-3xl md:text-5xl mb-4">{book.title}</h2>
              <p className="text-ivory/80 leading-relaxed text-lg italic mb-5 max-w-xl mx-auto lg:mx-0">{book.tagline}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-5">
                {primaryBuyOption && (
                  <a
                    href={primaryBuyOption.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3"
                    onClick={() => {
                      trackEvent('retailer_click', { retailer: primaryBuyOption.label });
                      if (/amazon\./i.test(primaryBuyOption.href)) trackEvent('amazon_click', { retailer: primaryBuyOption.label });
                    }}
                  >
                    Buy Now <ArrowRight size={15} />
                  </a>
                )}
                {book.sampleUrl && (
                  <a href={book.sampleUrl} target="_blank" rel="noopener noreferrer" className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3" style={{ color: 'var(--gold-lt)' }}>
                    Read a Sample <ExternalLink size={15} />
                  </a>
                )}
              </div>
              {translationEdition && (
                <p className="label-caps text-2xs text-gold-lt/70 mb-4">Available in English &amp; Hindi</p>
              )}
              {buyOptions.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {buyOptions.map((opt) => (
                    <RetailerButton key={opt.label} label={opt.label} href={opt.href} variant="outline" bookTitle={book.title} />
                  ))}
                </div>
              )}
            </div>

            <div className="mx-auto lg:mx-0 w-full max-w-xs rounded-md border border-gold/25 bg-ink-soft/60 p-6 text-center">
              <p className="label-caps text-2xs text-gold-lt mb-2">
                Milestone{book.milestoneMonthLabel ? ` · ${book.milestoneMonthLabel}` : ''}
              </p>
              <p className="font-display text-4xl mb-1" style={{ color: 'var(--gold-lt)' }}>{book.milestoneSalesCount}+</p>
              <p className="label-caps text-xs text-ivory mb-1">Copies Sold</p>
              {translationEdition && <p className="text-2xs text-ivory/60 mb-4">English &amp; Hindi Editions</p>}
              <div className="hairline-solid w-full opacity-30 my-4" />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="font-display text-xl" style={{ color: 'var(--gold-lt)' }}>{languageCount}</p>
                  <p className="text-2xs text-ivory/60">{languageCount === 1 ? 'Language' : 'Languages'}</p>
                </div>
                {buyOptions.length > 0 && (
                  <div>
                    <p className="font-display text-xl" style={{ color: 'var(--gold-lt)' }}>{buyOptions.length}</p>
                    <p className="text-2xs text-ivory/60">Platforms</p>
                  </div>
                )}
                {book.milestoneStoreCount && (
                  <div>
                    <p className="font-display text-xl" style={{ color: 'var(--gold-lt)' }}>{book.milestoneStoreCount}+</p>
                    <p className="text-2xs text-ivory/60">Bookstores</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
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
        )}

        {hasMilestoneShowcase && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-gold/15">
            {translationEdition && (
              <div className="flex flex-col items-center gap-2 text-center">
                <BookOpen size={20} className="text-gold-lt" aria-hidden="true" />
                <p className="label-caps text-2xs text-ivory/70">Available in English &amp; Hindi</p>
              </div>
            )}
            {buyOptions.length > 0 && (
              <div className="flex flex-col items-center gap-2 text-center">
                <Globe size={20} className="text-gold-lt" aria-hidden="true" />
                <p className="label-caps text-2xs text-ivory/70">Across Online Platforms</p>
              </div>
            )}
            {book.milestoneStoreCount && (
              <div className="flex flex-col items-center gap-2 text-center">
                <Store size={20} className="text-gold-lt" aria-hidden="true" />
                <p className="label-caps text-2xs text-ivory/70">In {book.milestoneStoreCount}+ Bookstores Across India</p>
              </div>
            )}
            <div className="flex flex-col items-center gap-2 text-center">
              <Users size={20} className="text-gold-lt" aria-hidden="true" />
              <p className="label-caps text-2xs text-ivory/70">Readers Nationwide</p>
            </div>
          </div>
        )}
      </div>

      <div className="hairline-solid w-full opacity-20" />

      <div className="relative mx-auto max-w-3xl px-6 py-10 text-center">
        <p className="eyebrow text-gold-text mb-3">Synopsis</p>
        <p className="text-ivory/80 leading-relaxed max-w-2xl mx-auto">{book.synopsis}</p>
      </div>

      {/* Reader Circle sits in the middle of the flow, not at the end */}
      <div className="hairline-solid w-full opacity-20" />

      <div className="relative mx-auto max-w-3xl px-6 py-10 text-center">
        <p className="eyebrow text-gold-text mb-3">Reader Circle</p>
        <h3 className="font-display text-2xl md:text-3xl mb-2">{released ? 'Join the Reader Circle' : 'Get Release Updates'}</h3>
        <p className="text-ivory/70 text-sm mb-7">
          {released ? `${book.title} is out now. Join for future releases, sample chapters, and behind-the-scenes notes.` : `Be the first to know the moment ${book.title} is available.`}
        </p>
        <Link to="/#free-chapter" className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3" style={{ color: 'var(--gold-lt)' }}>
          {released ? 'Join the Reader Circle' : 'Get Release Updates'} <ArrowRight size={15} />
        </Link>
      </div>

      <div className="hairline-solid w-full opacity-20" />

      <div className="relative mx-auto max-w-4xl px-6 py-10">
        <ReleaseDetails book={book} />
      </div>

      {bookstoreAvailabilityText && (
        <>
          <div className="hairline-solid w-full opacity-20" />
          <div className="relative mx-auto max-w-2xl px-6 py-10 text-center">
            <p className="eyebrow text-gold-text mb-3">Now in Stores</p>
            <p className="text-ivory/80 leading-relaxed">{bookstoreAvailabilityText}</p>
          </div>
        </>
      )}
    </section>
  );
}
