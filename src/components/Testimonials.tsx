import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Quote, Pause, Play } from 'lucide-react';
import { fetchFeaturedTestimonials, type FeaturedTestimonial } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import Divider from './Divider';
import TestimonialMeta from './TestimonialMeta';

function TestimonialCard({ t }: { t: FeaturedTestimonial }) {
  return (
    <figure className="content-card p-7 w-[320px] sm:w-[360px] shrink-0">
      <Quote className="text-gold-text/50 mb-3" size={22} aria-hidden="true" />
      <blockquote className="text-text/85 leading-relaxed italic mb-4">"{t.quote}"</blockquote>
      <figcaption className="text-2xs label-caps text-muted mb-3">
        <TestimonialMeta t={t} bookLabel={<> · <span className="text-gold-text">{t.book}</span></>} />
      </figcaption>
      {t.authorReply && (
        <div className="border-l-2 border-gold/40 pl-4 mt-3">
          <p className="label-caps text-2xs text-gold-text mb-1.5 inline-flex items-center gap-1.5">
            Gaurav Replied
          </p>
          <p className="text-sm text-text/80 leading-relaxed">{t.authorReply}</p>
        </div>
      )}
    </figure>
  );
}

export default function Testimonials() {
  const { data: featuredTestimonials } = useSupabaseData(() => fetchFeaturedTestimonials(8), []);
  const [paused, setPaused] = useState(false);

  if (!featuredTestimonials || featuredTestimonials.length === 0) return null;

  // Duplicated so the track can loop seamlessly: translateX lands exactly
  // back on the first copy's starting position, same technique as BookCarousel.
  const track = [...featuredTestimonials, ...featuredTestimonials];
  const duration = featuredTestimonials.length * 5;

  return (
    <section className="bg-cream">
      <div className="pt-10 pb-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="eyebrow text-gold-text mb-3">What Readers Say</p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">Words from the reader circle</h2>
          <Divider className="my-8!" />
        </div>

        <div className="carousel-viewport relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-28 bg-linear-to-r from-cream to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-28 bg-linear-to-l from-cream to-transparent z-10" />

          <div className="carousel-track-ltr flex w-max py-2" style={{ animationDuration: `${duration}s`, animationPlayState: paused ? 'paused' : undefined }}>
            {track.map((t, i) => (
              <div key={i} aria-hidden={i >= featuredTestimonials.length} {...(i >= featuredTestimonials.length ? { inert: true } : {})} className="mr-6">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="carousel-pause inline-flex items-center gap-2 label-caps text-muted hover:text-ink transition-colors"
          >
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
            {paused ? 'Play' : 'Pause'} scrolling
          </button>
          <Link to="/testimonials/" className="label-caps text-gold-text hover:text-ink transition-colors">Read All Testimonials</Link>
        </div>
      </div>
    </section>
  );
}
