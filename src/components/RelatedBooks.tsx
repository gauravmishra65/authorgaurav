import type { Book } from '../data/books';
import BookCover from './BookCover';
import { Link } from 'react-router-dom';

interface RelatedBooksProps {
  book: Book;
  allBooks: Book[];
  limit?: number;
}

/** Up to `limit` other books sharing a category (Thriller/Romance/etc.) or,
 * failing that, the same broad genre — never the book itself. */
export default function RelatedBooks({ book, allBooks, limit = 3 }: RelatedBooksProps) {
  const others = allBooks.filter((b) => b.id !== book.id);

  const byCategory = book.categories?.length
    ? others.filter((b) => b.categories?.some((c) => book.categories!.includes(c)))
    : [];
  const byGenre = others.filter((b) => b.genre === book.genre && !byCategory.includes(b));

  const related = [...byCategory, ...byGenre].slice(0, limit);
  if (related.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {related.map((b) => (
        <Link key={b.id} to={`/books/${b.slug}`} className="group flex flex-col items-center text-center gap-3">
          <BookCover {...b} size="md" />
          <p className="font-display text-sm text-ink group-hover:text-gold-text transition-colors">{b.title}</p>
        </Link>
      ))}
    </div>
  );
}
