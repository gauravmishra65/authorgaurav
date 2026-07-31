import { ExternalLink } from 'lucide-react';
import type { Book } from '../data/books';
import { formatReleaseDate, isReleased } from '../lib/releaseStatus';

interface ReleaseDetailsProps {
  book: Book;
  className?: string;
}

/** Human-readable retailer name for a paperback URL. Only used when a book
 * has more than one real paperback option and they need to be told apart
 * (e.g. Shadow Code's Notion Press edition vs. its Amazon listing). Falls
 * back to a generic name for publishers not in this list rather than guessing. */
function paperbackRetailerName(url: string): string {
  const host = (() => {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
  })();
  if (host.includes('notionpress')) return 'Notion Press';
  if (host.includes('rajmangalpublishers')) return 'Rajmangal Publishers';
  if (host.includes('amazon')) return 'Amazon';
  if (host.includes('flipkart')) return 'Flipkart';
  return 'Publisher';
}

export default function ReleaseDetails({ book, className = '' }: ReleaseDetailsProps) {
  const released = book.releaseDate ? isReleased(book.releaseDate) : false;

  // Most books have a single paperback link. A few (Shadow Code) have a real,
  // separate Amazon listing in `buyLinks` too — surface both under Paperback
  // rather than only ever showing one, so neither retailer gets hidden.
  const amazonPaperback = book.buyLinks.find((l) => l.label === 'Amazon' && l.href && l.href !== '#')?.href;
  const paperbackOptions = [
    book.paperbackUrl ? { label: paperbackRetailerName(book.paperbackUrl), href: book.paperbackUrl } : null,
    amazonPaperback && amazonPaperback !== book.paperbackUrl ? { label: 'Amazon', href: amazonPaperback } : null,
  ].filter((opt): opt is { label: string; href: string } => opt !== null);

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
            {paperbackOptions.length > 1 ? (
              <ul className="space-y-1">
                {paperbackOptions.map((opt) => (
                  <li key={opt.label}>
                    <a href={opt.href} target="_blank" rel="noopener noreferrer" className="text-gold-lt hover:text-gold-text transition-colors underline underline-offset-2">
                      Buy on {opt.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : paperbackOptions.length === 1 ? (
              <a href={paperbackOptions[0].href} target="_blank" rel="noopener noreferrer" className="text-gold-lt hover:text-gold-text transition-colors underline underline-offset-2">Buy the Paperback</a>
            ) : book.releaseDate && !released ? (
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
              <a href={book.kindleUrl} target="_blank" rel="noopener noreferrer" className="text-gold-lt hover:text-gold-text transition-colors underline underline-offset-2">{released ? 'Buy on Kindle' : 'Pre-order on Kindle'}</a>
            ) : (
              'Coming Soon'
            )}
          </dd>
        </div>
        {book.bookWebsite && (
          <div>
            <dt className="label-caps text-2xs text-gold-lt/80 mb-1">Official Site</dt>
            <dd>
              <a href={book.bookWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gold-lt hover:text-gold-text transition-colors">
                Visit the Book Website <ExternalLink size={13} />
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
