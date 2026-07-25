import { MessageCircle, Quote } from 'lucide-react';
import type { Testimonial } from '../data/books';

interface BookReviewProps {
  review: Testimonial;
}

/** One reader review — real, admin-moderated testimonials only (see
 * authorgaurav_testimonials / authorgaurav_testimonial_submissions). No
 * ratings are shown because none are collected; nothing here is fabricated. */
export default function BookReview({ review }: BookReviewProps) {
  return (
    <figure className="content-card p-7">
      <Quote className="text-gold/50 mb-3" size={20} aria-hidden="true" />
      <blockquote className="text-text/85 leading-relaxed italic mb-4 text-lg">"{review.quote}"</blockquote>
      <figcaption className="text-2xs label-caps text-muted">
        {review.name}{review.source ? ` · ${review.source}` : ''}
      </figcaption>
      {review.authorReply && (
        <div className="border-l-2 border-gold/40 pl-4 mt-4">
          <p className="label-caps text-2xs text-gold mb-1.5 inline-flex items-center gap-1.5">
            <MessageCircle size={12} aria-hidden="true" /> Gaurav Replied
          </p>
          <p className="text-sm text-text/80 leading-relaxed">{review.authorReply}</p>
        </div>
      )}
    </figure>
  );
}
