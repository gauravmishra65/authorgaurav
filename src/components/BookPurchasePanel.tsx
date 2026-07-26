import { getBuyOptions, type Book } from '../data/books';
import RetailerButton from './RetailerButton';
import FormatBadge from './FormatBadge';

interface BookPurchasePanelProps {
  book: Book;
  variant?: 'solid' | 'outline';
  className?: string;
  /** Extra class(es) applied only to the real, working retailer link — e.g. the Shadow Code red glow. */
  buttonClassName?: string;
}

/** Retailer buttons + confirmed format badges for a book — used in the hero
 * and reusable anywhere else a book's purchase options need to appear.
 * Buy options come from `getBuyOptions`, the same helper BookCarousel and
 * BookCard use, so every page shows the same real (non-placeholder)
 * options for a given book. */
export default function BookPurchasePanel({ book, variant = 'solid', className = '', buttonClassName }: BookPurchasePanelProps) {
  const buyOptions = getBuyOptions(book);

  return (
    <div className={className}>
      {buyOptions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {buyOptions.map((opt) => (
            <RetailerButton key={opt.label} label={opt.label} href={opt.href} variant={variant} className={buttonClassName} />
          ))}
        </div>
      )}
      {/* TODO_CONTENT: `formats` is empty for every book today — nothing renders until real formats are entered in /admin. */}
      {book.formats && book.formats.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {book.formats.map((f) => (
            <FormatBadge key={f.name} tone={book.textOnDark ? 'dark' : 'light'}>{f.name}</FormatBadge>
          ))}
        </div>
      )}
    </div>
  );
}
