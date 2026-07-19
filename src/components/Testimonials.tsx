import { Link } from 'react-router-dom';
import { Quote, MessageCircle } from 'lucide-react';
import { fetchFeaturedTestimonials, type FeaturedTestimonial } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import Divider from './Divider';

function TestimonialCard({ t }: { t: FeaturedTestimonial }) {
  return (
    <figure className="content-card p-7 w-[320px] sm:w-[360px] flex-shrink-0">
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
  );
}

export default function Testimonials() {
  const { data: featuredTestimonials } = useSupabaseData(() => fetchFeaturedTestimonials(8), []);

  if (!featuredTestimonials || featuredTestimonials.length === 0) return null;

  // Duplicated so the track can loop seamlessly: translateX lands exactly
  // back on the first copy's starting position, same technique as BookCarousel.
  const track = [...featuredTestimonials, ...featuredTestimonials];
  const duration = featuredTestimonials.length * 5;

  return (
    <section className="bg-cream">
      <div className="pt-10 pb-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="eyebrow text-gold mb-3">What Readers Say</p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">Words from the reader circle</h2>
          <Divider className="!my-8" />
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-28 bg-gradient-to-r from-cream to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-28 bg-gradient-to-l from-cream to-transparent z-10" />

          <div className="carousel-track-ltr flex w-max py-2" style={{ animationDuration: `${duration}s` }}>
            {track.map((t, i) => (
              <div key={i} aria-hidden={i >= featuredTestimonials.length} className="mr-6">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-10">
          <Link to="/testimonials" className="label-caps text-gold hover:text-ink transition-colors">Read More &amp; Share Your Feedback</Link>
        </p>
      </div>
    </section>
  );
}
