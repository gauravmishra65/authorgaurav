import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import EmailStrip from '../components/EmailStrip';
import BlogPreview from '../components/BlogPreview';
import NewsPreview from '../components/NewsPreview';
import Testimonials from '../components/Testimonials';
import PressStrip from '../components/PressStrip';
import BookLaunchHero from '../components/BookLaunchHero';
import BookCard from '../components/BookCard';
import SectionHeading from '../components/SectionHeading';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { buildPersonStructuredData } from '../components/PersonStructuredData';
import { SITE_URL } from '../lib/url';
import { getFeaturedBook } from '../lib/releaseStatus';
import { getTranslationEdition } from '../data/books';
import { trackEvent } from '../lib/analytics';

function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Gaurav Mishra',
        url: `${SITE_URL}/`,
      },
      buildPersonStructuredData(),
    ],
  };
}

// The curated books shown in "Explore the Books". /about keeps its own
// "Selected Books" list; the two are no longer identical.
const selectedSlugs = ['the-shadow-code', 'offbeat-love', 'the-friend-you-keep', 'interview-guide'];

const readingMoods = ['Suspense & Mystery', 'Love & Relationships', 'Faith & Reflection', 'Life & Personal Growth'];

export default function Home() {
  // Deliberately not gating the whole page behind this fetch — the hero,
  // testimonials, news, and blog previews below don't need book data, so
  // they render (and fire their own queries) immediately instead of
  // waiting on this one to resolve first.
  const { data: books } = useSupabaseData(fetchBooks, []);

  const featuredBook = books ? getFeaturedBook(books) : undefined;
  const featuredTranslationEdition = featuredBook && books ? getTranslationEdition(featuredBook, books) : undefined;
  const selectedBooks = books?.filter((b) => selectedSlugs.includes(b.slug)) ?? [];

  return (
    <>
      <Seo
        title="Gaurav Mishra | Author of Shadow Code, Offbeat Love and Spiritual Books"
        description="Explore books by Gaurav Mishra, including the techno-financial thriller Shadow Code, contemporary fiction and accessible spiritual books in Hindi and English."
        jsonLd={buildJsonLd()}
      />

      {/* HERO — a calm, editorial opening before the specific book promotion
          below, replacing what used to be only a screen-reader-only h1. */}
      <section className="bg-cream py-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-display text-4xl md:text-5xl text-ink mb-5 leading-tight">
            Stories of suspense, love, faith and the choices that shape our lives.
          </h1>
          <p className="text-text/70 leading-relaxed text-lg mb-8 max-w-xl mx-auto">
            Gaurav Mishra writes thrillers, contemporary fiction and spiritual books for readers drawn to suspense, relationships, reflection and meaning.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-5">
            <Link to="/books/" className="btn-caps btn-gold rounded-xs px-6 py-3" onClick={() => trackEvent('homepage_cta_click', { label: 'Explore the Books' })}>Explore the Books</Link>
            <Link to="/start-here/" className="btn-caps btn-gold-outline rounded-xs px-6 py-3" onClick={() => trackEvent('homepage_cta_click', { label: 'Start Here' })}>Start Here</Link>
          </div>
          <Link to="/reader-circle/" className="label-caps text-2xs text-gold-text hover:text-ink transition-colors" onClick={() => trackEvent('homepage_cta_click', { label: 'Join the Reader Circle' })}>
            Join the Reader Circle
          </Link>
        </div>
      </section>

      {/* FEATURED RELEASE — exactly one book, driven by the `featured` flag
          (see getFeaturedBook in lib/releaseStatus.ts), so this can never
          contradict the header CTA or Media's "Current Release" block. */}
      {featuredBook && <BookLaunchHero book={featuredBook} translationEdition={featuredTranslationEdition} />}

      <PressStrip />

      {/* START HERE teaser — a lighter pointer to the full /start-here
          experience, not a reproduction of it. */}
      <section className="bg-ink bg-grain text-ivory py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <SectionHeading title="Not sure where to begin?" tone="dark" />
          <p className="text-ivory/75 leading-relaxed mb-7">
            Choose the kind of reading you are in the mood for, and find a book that fits.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {readingMoods.map((mood) => (
              <span key={mood} className="label-caps text-2xs text-gold-lt/80 border border-gold/30 rounded-full px-3.5 py-1.5">{mood}</span>
            ))}
          </div>
          <Link to="/start-here/" className="btn-caps btn-gold inline-flex items-center gap-2 rounded-xs px-6 py-3" onClick={() => trackEvent('homepage_cta_click', { label: 'Find Your Next Read' })}>
            Find Your Next Read <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* SELECTED BOOKS — a curated spread, not the full catalog (that's
          what /books is for). Same four titles as About's "One World Per
          Book" section. */}
      {selectedBooks.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading eyebrow="The Library" title="Explore the Books" />
            <p className="text-text/70 leading-relaxed text-center max-w-xl mx-auto mb-12">
              Fiction, thrillers, spiritual reading and stories drawn from different corners of life.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {selectedBooks.map((b) => <BookCard key={b.id} book={b} source="home-selected-books" showRetailerButtons={false} showSalesBadge />)}
            </div>
            <p className="text-center mt-10">
              <Link to="/books/" className="btn-caps btn-gold-outline inline-block rounded-xs px-6 py-3" onClick={() => trackEvent('homepage_cta_click', { label: 'View All Books' })}>View All Books</Link>
            </p>
          </div>
        </section>
      )}

      <Testimonials />

      {/* ABOUT teaser — short on purpose; the full biography lives at /about. */}
      <section className="bg-cream py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <SectionHeading title="About Gaurav" />
          <p className="text-text/70 leading-relaxed mb-7">
            Gaurav Mishra writes across genres, from contemporary fiction and financial thrillers to spiritual books. His work is shaped by curiosity about people, relationships, belief and the systems that influence everyday life.
          </p>
          <Link to="/about/" className="btn-caps btn-gold-outline inline-block rounded-xs px-6 py-3" onClick={() => trackEvent('homepage_cta_click', { label: "Read Gaurav's Story" })}>Read Gaurav's Story</Link>
        </div>
      </section>

      <NewsPreview />
      <BlogPreview />

      {/* WRITETOGETHERHUB — a compact pointer, not the full three-card
          section (that still lives in full at /write-together-hub and on
          /writing-resources, via the shared WriteTogetherHub component). */}
      <section className="bg-ink bg-grain text-ivory py-16 text-center">
        <div className="mx-auto max-w-xl px-6">
          <span className="inline-block rounded-full border border-gold/40 px-4 py-1.5 label-caps text-gold-lt mb-5">A Home for Writers</span>
          <h2 className="font-display text-2xl md:text-3xl mb-4">WriteTogetherHub</h2>
          <p className="text-ivory/75 leading-relaxed mb-7">
            A free community and guided-learning platform for new and returning writers, founded by Gaurav.
          </p>
          <Link to="/write-together-hub/" className="btn-caps btn-gold inline-block rounded-xs px-6 py-3" onClick={() => trackEvent('writetogetherhub_click', { source: 'homepage-teaser' })}>Visit WriteTogetherHub</Link>
        </div>
      </section>

      <div id="reader-circle" className="scroll-mt-20">
        <EmailStrip
          heading="Join Gaurav's Reader Circle"
          subheading="Receive new-release updates, behind-the-scenes writing notes and occasional subscriber-only resources."
          showGenrePreference
        />
        <p className="text-center pb-10">
          <Link to="/reader-circle/" className="label-caps text-2xs text-gold-text hover:text-ink transition-colors">
            See Everything the Reader Circle Includes
          </Link>
        </p>
      </div>

      {/* FINAL CTA — a short closing nudge, not a new section's worth of content. */}
      <section className="bg-cream py-16 text-center border-t border-gold/15">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-7">Find your next book.</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/books/" className="btn-caps btn-gold rounded-xs px-6 py-3" onClick={() => trackEvent('homepage_cta_click', { label: 'Browse All Books' })}>Browse All Books</Link>
            <Link to="/start-here/" className="btn-caps btn-gold-outline rounded-xs px-6 py-3" onClick={() => trackEvent('homepage_cta_click', { label: 'Start Here', source: 'final-cta' })}>Start Here</Link>
          </div>
        </div>
      </section>
    </>
  );
}
