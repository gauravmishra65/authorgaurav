import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Book } from '../data/books';
import BookCover from './BookCover';
import { trackEvent } from '../lib/analytics';

interface JournalBookCTAProps {
  /** post.relatedLink — either a real book slug or the literal "writetogetherhub". */
  relatedLink: string;
  books: Book[];
}

/** End-of-article "promote the relevant book" CTA (master plan Part 15).
 * Renders the WriteTogetherHub card for relatedLink === "writetogetherhub",
 * the matching book's card otherwise — or nothing at all if relatedLink
 * names a book slug that doesn't actually exist, rather than a broken link. */
export default function JournalBookCTA({ relatedLink, books }: JournalBookCTAProps) {
  if (relatedLink === 'writetogetherhub') {
    return (
      <div className="mt-12 rounded-md border border-gold/25 bg-cream p-6 sm:p-7 text-center">
        <p className="label-caps text-gold-text text-2xs mb-2">Continue Writing</p>
        <h3 className="font-display text-xl text-ink mb-2">WriteTogetherHub</h3>
        <p className="text-sm text-muted mb-4 max-w-md mx-auto">
          A home for writers and newcomers: guidance, community, and a place to grow your craft together.
        </p>
        <a
          href="https://writetogetherhub.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('journal_book_click', { link: 'writetogetherhub' })}
          className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-2xs"
        >
          Visit WriteTogetherHub <ArrowRight size={13} />
        </a>
      </div>
    );
  }

  const book = books.find((b) => b.slug === relatedLink);
  if (!book) return null;

  return (
    <div className="mt-12 rounded-md border border-gold/25 bg-cream p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-6">
      <BookCover {...book} size="sm" />
      <div className="text-center sm:text-left flex-1">
        <p className="label-caps text-gold-text text-2xs mb-2">Continue the Story</p>
        <h3 className="font-display text-xl text-ink mb-2">{book.title}</h3>
        <p className="text-sm text-muted mb-4">{book.tagline}</p>
        <Link
          to={`/books/${book.slug}`}
          onClick={() => trackEvent('journal_book_click', { link: book.slug })}
          className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-2xs"
        >
          Explore the Book <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
