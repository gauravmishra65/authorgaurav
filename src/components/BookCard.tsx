import { Link } from 'react-router-dom';
import { getBuyOptions, type Book } from '../data/books';
import BookCover from './BookCover';
import LanguageBadge from './LanguageBadge';
import FormatBadge from './FormatBadge';
import RetailerButton from './RetailerButton';
import { trackEvent } from '../lib/analytics';

interface BookCardProps {
  book: Book;
  /** Which listing this card renders in (e.g. "books-grid", "where-to-buy-grid", "about-page") — carried on the book_explore click event so entry-surface conversion can be compared. */
  source: string;
  /** Show the full retailer-button row on this card. Only true on
   * /where-to-buy, whose entire job is surfacing purchase options —
   * everywhere else (the general /books catalog, About's representative
   * titles) is a browsing/discovery context, and stacking up to 6-7
   * retailer buttons per card there added visual noise without helping
   * the "which book do I want" decision the master plan says a catalog
   * grid should support; purchase complexity now lives only on each
   * book's own page (and on /where-to-buy), not duplicated on every card. */
  showRetailerButtons: boolean;
}

/** One book in a catalog grid — cover, title, language/status badges, a
 * one-line description, optionally buy options (same set as
 * BookPurchasePanel, via `getBuyOptions`), and View Book. Cover aspect
 * ratio is never stretched — BookCover already sizes by its own fixed
 * w/h classes. */
export default function BookCard({ book, source, showRetailerButtons }: BookCardProps) {
  const buyOptions = getBuyOptions(book);
  const onExplore = () => trackEvent('book_explore', { book: book.slug, source });

  return (
    <div className="flex flex-col items-center text-center gap-3 p-5 rounded-md border border-gold/15 bg-ivory hover:border-gold/40 hover:-translate-y-1 transition-all">
      <BookCover {...book} size="md" href={`/books/${book.slug}`} onClick={onExplore} />
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <LanguageBadge language={book.language} />
        <FormatBadge>{book.categories?.[0] ?? book.genre}</FormatBadge>
        {book.status !== 'published' && <FormatBadge>{book.status === 'preorder' ? 'Preorder' : 'Coming Soon'}</FormatBadge>}
      </div>
      <Link to={`/books/${book.slug}`} onClick={onExplore} className="font-display text-lg text-ink hover:text-gold-text transition-colors">
        {book.title}
      </Link>
      <p className="text-sm text-muted leading-relaxed line-clamp-2">{book.tagline}</p>
      {showRetailerButtons && (buyOptions.length > 0 || book.goodreadsUrl) && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {buyOptions.map((opt) => (
            <RetailerButton key={opt.label} label={opt.label} href={opt.href} variant="outline" bookTitle={book.title} />
          ))}
          {book.goodreadsUrl && (
            <RetailerButton label="Goodreads" href={book.goodreadsUrl} variant="outline" bookTitle={book.title} />
          )}
        </div>
      )}
      <Link to={`/books/${book.slug}`} onClick={onExplore} className="label-caps text-2xs text-gold-text hover:text-ink transition-colors underline underline-offset-2 mt-1">
        View Book
      </Link>
    </div>
  );
}
