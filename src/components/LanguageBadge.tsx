interface LanguageBadgeProps {
  language: 'English' | 'Hindi';
  /** "dark" for placement on navy/ink sections, "light" for cream/ivory sections. */
  tone?: 'dark' | 'light';
  className?: string;
}

/** Formalizes the pill badge repeated across BookDetail/Books/BookCarousel
 * for a book's language. */
export default function LanguageBadge({ language, tone = 'light', className = '' }: LanguageBadgeProps) {
  const toneClasses = tone === 'dark'
    ? 'text-ivory/70 border-ivory/25'
    : 'text-rose border-rose/40';
  return (
    <span className={`label-caps text-2xs border rounded-full px-2.5 py-0.5 ${toneClasses} ${className}`}>
      {language}
    </span>
  );
}
