import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface WhereToBuyButtonProps {
  /** Which page/section this instance renders on, for analytics (e.g. 'home', 'books', 'book-detail:the-shadow-code'). */
  source: string;
  /** Small line shown under the button, e.g. "Online & selected bookstores". */
  subtext?: string;
  className?: string;
}

/** The site's one consistent "Where to Buy" CTA — links to the consolidated
 * /where-to-buy directory. Always styled as its own dark/gold/ivory chip
 * (see .btn-where-to-buy in index.css) regardless of section background, so
 * it reads the same everywhere it appears, alongside each page's existing
 * purchase buttons rather than replacing them. */
export default function WhereToBuyButton({ source, subtext, className = '' }: WhereToBuyButtonProps) {
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <Link
        to="/where-to-buy"
        onClick={() => trackEvent('where_to_buy_click', { source })}
        aria-label="Where to buy Gaurav Mishra's books online and in bookstores"
        className="btn-caps btn-where-to-buy group inline-flex items-center gap-2 rounded-lg px-8 py-4 text-sm"
      >
        Where to Buy
        <ArrowRight size={16} className="btn-where-to-buy-arrow" aria-hidden="true" />
      </Link>
      {subtext && <p className="label-caps text-2xs text-muted mt-2.5">{subtext}</p>}
    </div>
  );
}
