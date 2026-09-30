import type { Book } from '../data/books';
import BookCard from './BookCard';
import EmptyState from './EmptyState';

interface BookGridProps {
  books: Book[];
  /** Forwarded to every BookCard's book_explore click event — see BookCard's own doc comment. */
  source: string;
  /** Forwarded to every BookCard — see BookCard's own doc comment on why this is only true on /where-to-buy. */
  showRetailerButtons: boolean;
}

export default function BookGrid({ books, source, showRetailerButtons }: BookGridProps) {
  if (books.length === 0) {
    return (
      <EmptyState
        heading="No books match those filters"
        message="Try a different search term, or clear a filter to see more of the catalog."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} source={source} showRetailerButtons={showRetailerButtons} />
      ))}
    </div>
  );
}
