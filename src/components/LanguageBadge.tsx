interface LanguageBadgeProps {
  language: 'English' | 'Hindi';
  /** "dark" for placement on navy/ink sections, "light" for cream/ivory sections. */
  tone?: 'dark' | 'light' | 'book';
  className?: string;
}

/** Formalizes the pill badge repeated across BookDetail/Books/BookCarousel
 * for a book's language. */
export default function LanguageBadge({ language, tone = 'light', className = '' }: LanguageBadgeProps) {
  // 'book' reads the page's --book-* theme variables, so the badge matches a
  // light or dark book theme regardless of the cover art's own text color.
  const toneClasses = tone === 'book'
    ? 'text-(--book-muted) border-(--book-muted)'
    : tone === 'dark'
      ? 'text-ivory/70 border-ivory/25'
      : 'text-rose border-rose/40';
  return (
    <span className={`label-caps text-2xs border rounded-full px-2.5 py-0.5 ${toneClasses} ${className}`}>
      {language}
    </span>
  );
}
