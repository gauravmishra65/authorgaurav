import { ExternalLink } from 'lucide-react';
import type { Book } from '../data/books';
import { formatReleaseDate, isReleased } from '../lib/releaseStatus';

interface ReleaseDetailsProps {
  book: Book;
  className?: string;
}

export default function ReleaseDetails({ book, className = '' }: ReleaseDetailsProps) {
  const released = book.releaseDate ? isReleased(book.releaseDate) : false;

  return (
    <div className={`rounded-md border border-gold/25 bg-ink-soft/60 p-6 sm:p-8 ${className}`}>
      <dl className="grid gap-5 sm:grid-cols-2">
        {book.releaseDate && (
          <div>
            <dt className="label-caps text-2xs text-gold-lt/80 mb-1">Release Date</dt>
            <dd className="text-ivory">{released ? 'Now Available' : formatReleaseDate(book.releaseDate)}</dd>
          </div>
        )}
        <div>
          <dt className="label-caps text-2xs text-gold-lt/80 mb-1">Paperback</dt>
          <dd className="text-ivory">
            {book.paperbackUrl ? (
              <a href={book.paperbackUrl} className="text-gold-lt hover:text-gold transition-colors underline underline-offset-2">Buy the Paperback</a>
            ) : book.releaseDate ? (
              `Available ${formatReleaseDate(book.releaseDate)}`
            ) : (
              'Coming Soon'
            )}
          </dd>
        </div>
        <div>
          <dt className="label-caps text-2xs text-gold-lt/80 mb-1">Kindle</dt>
          <dd className="text-ivory">
            {book.kindleUrl ? (
              <a href={book.kindleUrl} className="text-gold-lt hover:text-gold transition-colors underline underline-offset-2">Pre-order on Kindle</a>
            ) : (
              'Pre-order Coming Soon'
            )}
          </dd>
        </div>
        {book.bookWebsite && (
          <div>
            <dt className="label-caps text-2xs text-gold-lt/80 mb-1">Official Site</dt>
            <dd>
              <a href={book.bookWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gold-lt hover:text-gold transition-colors">
                Visit the Book Website <ExternalLink size={13} />
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
