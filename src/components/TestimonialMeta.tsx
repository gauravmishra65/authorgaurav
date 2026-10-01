import type { ReactNode } from 'react';
import type { Testimonial } from '../data/books';

function formatTestimonialDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface TestimonialMetaProps {
  t: Pick<Testimonial, 'name' | 'source' | 'sourceUrl' | 'date'>;
  /** Shown after the name, before the source (e.g. the book title on the
   * homepage/testimonials-page cards, which have no book context of their own). */
  bookLabel?: ReactNode;
}

/** Reviewer name, book (optional), source — a real link when a verified
 * source URL exists, otherwise plain text — and date, shared by every
 * place a testimonial's byline is rendered so the three never drift. */
export default function TestimonialMeta({ t, bookLabel }: TestimonialMetaProps) {
  return (
    <>
      {t.name}
      {bookLabel}
      {t.source && (
        <>
          {' · '}
          {t.sourceUrl ? (
            <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-gold-text transition-colors">
              {t.source}
            </a>
          ) : (
            t.source
          )}
        </>
      )}
      {t.date && ` · ${formatTestimonialDate(t.date)}`}
    </>
  );
}
