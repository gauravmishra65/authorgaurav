import { Quote } from 'lucide-react';
import { books } from '../data/books';
import Divider from './Divider';

const featuredTestimonials = books
  .flatMap((b) => (b.testimonials ?? []).map((t) => ({ ...t, book: b.title })))
  .slice(0, 3);

export default function Testimonials() {
  if (featuredTestimonials.length === 0) return null;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-20">
        <div className="text-center">
          <p className="eyebrow text-gold mb-3">What Readers Say</p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">Words from the reader circle</h2>
          <Divider className="!my-8" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredTestimonials.map((t, i) => (
            <figure key={i} className="rounded-md border border-gold/20 bg-ivory p-7 shadow-luxury">
              <Quote className="text-gold/50 mb-3" size={22} aria-hidden="true" />
              <blockquote className="text-text/85 leading-relaxed italic mb-4">"{t.quote}"</blockquote>
              <figcaption className="text-2xs label-caps text-muted">
                {t.name}{t.source ? ` · ${t.source}` : ''} — <span className="text-gold">{t.book}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
