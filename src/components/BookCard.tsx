import { Link } from 'react-router-dom';
import type { Book } from '../data/books';
import BookCover from './BookCover';
import LanguageBadge from './LanguageBadge';
import FormatBadge from './FormatBadge';
import RetailerButton from './RetailerButton';

interface BookCardProps {
  book: Book;
}

/** One book in the /books grid — cover, title, language/status badges, a
 * one-line description, View Book, and a retailer link where a real one is
 * confirmed (i.e. not a `#` placeholder). Cover aspect ratio is never
 * stretched — BookCover already sizes by its own fixed w/h classes. */
export default function BookCard({ book }: BookCardProps) {
  const confirmedRetailer = book.buyLinks.find((l) => l.href && l.href !== '#');

  return (
    <div className="flex flex-col items-center text-center gap-3 p-5 rounded-md border border-gold/15 bg-ivory hover:border-gold/40 hover:-translate-y-1 transition-all">
      <BookCover {...book} size="md" href={`/books/${book.slug}`} />
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <LanguageBadge language={book.language} />
        <FormatBadge>{book.categories?.[0] ?? book.genre}</FormatBadge>
        {book.status !== 'published' && <FormatBadge>{book.status === 'preorder' ? 'Preorder' : 'Coming Soon'}</FormatBadge>}
      </div>
      <Link to={`/books/${book.slug}`} className="font-display text-lg text-ink hover:text-gold-text transition-colors">
        {book.title}
      </Link>
      <p className="text-sm text-muted leading-relaxed line-clamp-2">{book.tagline}</p>
      <div className="flex items-center gap-3 mt-1">
        <Link to={`/books/${book.slug}`} className="label-caps text-2xs text-gold-text hover:text-ink transition-colors underline underline-offset-2">
          View Book
        </Link>
        {confirmedRetailer && <RetailerButton label={confirmedRetailer.label} href={confirmedRetailer.href} variant="outline" />}
      </div>
    </div>
  );
}
