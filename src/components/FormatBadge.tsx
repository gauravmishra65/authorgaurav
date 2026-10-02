interface FormatBadgeProps {
  children: string;
  /** "dark" for placement on navy/ink sections, "light" for cream/ivory sections. */
  tone?: 'dark' | 'light' | 'book';
  className?: string;
}

/** Formalizes the small gold-outline status pill used for "Coming Soon" /
 * "Now Available" / format labels across BookDetail, Books, and BookCarousel. */
export default function FormatBadge({ children, tone = 'light', className = '' }: FormatBadgeProps) {
  const toneClasses = tone === 'book'
    ? 'text-(--book-accent-text) border-(--book-accent-text)'
    : tone === 'dark' ? 'text-gold-lt border-gold/40' : 'text-gold-text border-gold/40';
  return (
    <span className={`label-caps text-2xs border rounded-full px-2.5 py-0.5 ${toneClasses} ${className}`}>
      {children}
    </span>
  );
}
