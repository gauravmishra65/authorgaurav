import { Quote, MessageCircle } from 'lucide-react';
import Seo from '../components/Seo';
import Divider from '../components/Divider';
import TestimonialForm from '../components/TestimonialForm';
import { fetchAllTestimonials, type FeaturedTestimonial } from '../lib/queries';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

function TestimonialCard({ t }: { t: FeaturedTestimonial }) {
  return (
    <figure className="rounded-md border border-gold/20 bg-ivory p-7 shadow-luxury">
      <Quote className="text-gold/50 mb-3" size={22} aria-hidden="true" />
      <blockquote className="text-text/85 leading-relaxed italic mb-4">"{t.quote}"</blockquote>
      <figcaption className="text-2xs label-caps text-muted mb-4">
        {t.name}{t.source ? ` · ${t.source}` : ''}{t.book ? <> — <span className="text-gold">{t.book}</span></> : null}
      </figcaption>
      {t.authorReply && (
        <div className="border-l-2 border-gold/40 pl-4 mt-4">
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
  const { data: testimonials, loading, error } = useSupabaseData(fetchAllTestimonials, []);
  const { data: books } = useSupabaseData(fetchBooks, []);

  return (
    <>
      <Seo
        title="Reader Testimonials — Gaurav Mishra | Share Your Feedback"
        description="Read what readers are saying about Gaurav Mishra's books, and share your own feedback — Gaurav reads and replies to every review."
        path="/testimonials"
      />

      <section className="bg-ink text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">Reader Circle</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">What Readers Are Saying</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Feedback from readers across every book — and a place to share your own. Every submission is read personally, and many get a reply.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {loading && <p className="py-8 text-center text-muted">Loading testimonials…</p>}
        {error && <p className="py-8 text-center text-rose">Couldn't load testimonials: {error}</p>}
        {testimonials && testimonials.length === 0 && (
          <p className="py-8 text-center text-muted">No testimonials yet — be the first to share your feedback below.</p>
        )}
        {testimonials && testimonials.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </div>
        )}
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <div className="text-center mb-10">
            <p className="eyebrow text-gold mb-3">Your Turn</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink">Share Your Feedback</h2>
            <Divider className="!my-8" />
            <p className="text-muted leading-relaxed">
              Tell Gaurav what a book meant to you. Submissions are reviewed before appearing here, and your email is kept private.
            </p>
          </div>
          {books ? (
            <TestimonialForm books={books} />
          ) : (
            <p className="text-center text-muted">Loading form…</p>
          )}
        </div>
      </section>
    </>
  );
}
