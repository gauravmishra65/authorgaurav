import { Link } from 'react-router-dom';
import { Quote, MessageCircle } from 'lucide-react';
import { fetchFeaturedTestimonials } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import Divider from './Divider';

export default function Testimonials() {
  const { data: featuredTestimonials } = useSupabaseData(() => fetchFeaturedTestimonials(3), []);

  if (!featuredTestimonials || featuredTestimonials.length === 0) return null;

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
              <figcaption className="text-2xs label-caps text-muted mb-3">
                {t.name}{t.source ? ` · ${t.source}` : ''} — <span className="text-gold">{t.book}</span>
              </figcaption>
              {t.authorReply && (
                <div className="border-l-2 border-gold/40 pl-4 mt-3">
                  <p className="label-caps text-2xs text-gold mb-1.5 inline-flex items-center gap-1.5">
                    <MessageCircle size={12} aria-hidden="true" /> Gaurav Replied
                  </p>
                  <p className="text-sm text-text/80 leading-relaxed">{t.authorReply}</p>
                </div>
              )}
            </figure>
          ))}
        </div>
        <p className="text-center mt-10">
          <Link to="/testimonials" className="label-caps text-gold hover:text-ink transition-colors">Read More &amp; Share Your Feedback</Link>
        </p>
      </div>
    </section>
  );
}
