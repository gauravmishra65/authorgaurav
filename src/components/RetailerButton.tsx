import { trackEvent } from '../lib/analytics';

interface RetailerButtonProps {
  label: string;
  href: string;
  variant?: 'solid' | 'outline';
  className?: string;
}

/** One retailer/buy link (from a book's `buyLinks`), formalized as a
 * component — replaces the inline `<a className="btn-...">` repeated across
 * BookDetail, Books, BookCarousel, and Home. Also the single place that
 * fires retailer_click/amazon_click for every buy button site-wide. */
export default function RetailerButton({ label, href, variant = 'solid', className = '' }: RetailerButtonProps) {
  const classes = variant === 'solid'
    ? `btn-caps btn-gold rounded-sm px-5 py-2.5 text-2xs ${className}`
    : `label-caps text-2xs text-gold border border-gold/30 rounded-full px-2.5 py-1 hover:bg-gold hover:text-ink transition-colors ${className}`;

  const handleClick = () => {
    // `#` is a not-yet-real placeholder link — nothing to track.
    if (!href || href === '#') return;
    trackEvent('retailer_click', { retailer: label });
    if (/amazon\./i.test(href)) trackEvent('amazon_click', { retailer: label });
  };

  return (
    <a href={href} className={classes} onClick={handleClick}>
      {label}
    </a>
  );
}
