import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import BookCarousel from '../components/BookCarousel';
import EmailStrip from '../components/EmailStrip';
import WriteTogetherHub from '../components/WriteTogetherHub';
import BlogPreview from '../components/BlogPreview';
import NewsPreview from '../components/NewsPreview';
import Testimonials from '../components/Testimonials';
import PressStrip from '../components/PressStrip';
import BookLaunchHero from '../components/BookLaunchHero';
import Divider from '../components/Divider';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import WhereToBuyButton from '../components/WhereToBuyButton';
import MilestoneTicker from '../components/MilestoneTicker';
import { fetchBooks, fetchBookCategories } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { trackEvent } from '../lib/analytics';
import { buildMilestoneParts } from '../lib/milestoneText';

// Phase 4 added a `categories` tag per book, so Thrillers and Love Stories
// now link to genuinely distinct filtered views (both used to collapse onto
// the same `genre=Fiction` bucket before that field existed).
const genreCards: { category: string; label: string; description: string }[] = [
  { category: 'Thriller', label: 'Thrillers and Contemporary Fiction', description: 'Techno-financial thrillers and character-driven fiction, including Shadow Code and The Zero Account.' },
  { category: 'Romance', label: 'Love Stories', description: 'Contemporary romance about love, family, and the courage to choose your own life, including Offbeat Love and अनूठा प्यार.' },
  { category: 'Spiritual', label: 'Spiritual and Devotional Books', description: 'Accessible Hindi devotional texts, including the Vishnu and Lalita Sahasranama, explained simply for daily life.' },
];

export default function Home() {
  const [filter, setFilter] = useState('All');
  // Deliberately not gating the whole page behind this fetch — the hero,
  // testimonials, news, and blog previews below don't need book data, so
  // they render (and fire their own queries) immediately instead of
  // waiting on this one to resolve first.
  const { data: books, loading, error } = useSupabaseData(fetchBooks, []);
  const { data: categories } = useSupabaseData(fetchBookCategories, []);

  // "Upcoming" is an additional lens (handled separately), not a category —
  // the rest of the row mirrors the /books page's category tabs (from the
  // authorgaurav_book_categories table) so the same options appear in both
  // places, and "All" and the genre tabs always include upcoming books too
  // (the "Coming Soon" badge on each card already distinguishes status), so
  // nothing appears to vanish when switching between tabs.
  const bookshelfFilters = ['All', 'Upcoming', ...(categories?.map((c) => c.label) ?? [])];

  const filtered = !books ? [] : filter === 'Upcoming'
    ? books.filter((b) => b.status === 'upcoming')
    : filter === 'All'
      ? books
      : books.filter((b) => b.categories?.includes(categories?.find((c) => c.label === filter)?.tag ?? '__none__'));

  const shadowCode = books?.find((b) => b.slug === 'the-shadow-code') ?? books?.[0];
  const shadowCodeHindi = books?.find((b) => b.slug === 'shadow-code-hindi');
  const friendYouKeep = books?.find((b) => b.slug === 'the-friend-you-keep');
  const milestoneParts = shadowCode ? buildMilestoneParts(shadowCode) : null;

  return (
    <>
      <Seo
        title="Gaurav Mishra | Author of Shadow Code, Offbeat Love and Spiritual Books"
        description="Explore books by Gaurav Mishra, including the techno-financial thriller Shadow Code, contemporary fiction and accessible spiritual books in Hindi and English."
      />

      {/* The author-portrait hero that used to live here moved to /about — this
          page now opens directly with the milestone ticker and the featured
          release(s). Kept as a screen-reader-only h1 so the page still has a
          real top-level heading for SEO/accessibility. */}
      <h1 className="sr-only">Gaurav Mishra: stories of love, faith, ambition and the hidden systems that shape our lives.</h1>

      {/* MILESTONE TICKER — first thing on the page, on purpose */}
      {milestoneParts && shadowCode && <MilestoneTicker parts={milestoneParts} href={`/books/${shadowCode.slug}`} />}

      {/* FEATURED RELEASE(S) */}
      {shadowCode && shadowCode.releaseDate && <BookLaunchHero book={shadowCode} translationEdition={shadowCodeHindi} />}
      {friendYouKeep && <BookLaunchHero book={friendYouKeep} />}

      {/* EXPLORE BY GENRE */}
      <Section tone="cream">
        <SectionHeading eyebrow="Explore by Genre" title="Find your next world" />
        <div className="grid gap-6 md:grid-cols-3 mt-4">
          {genreCards.map((card) => (
            <Link
              key={card.category}
              to={`/books?category=${card.category}`}
              onClick={() => trackEvent('homepage_cta_click', { label: `genre-card:${card.category}` })}
              className="group rounded-md border border-gold/20 bg-ivory p-8 text-center shadow-luxury transition-all hover:-translate-y-1 hover:border-gold/50"
            >
              <p className="font-display text-xl text-ink mb-3 group-hover:text-gold-text transition-colors">{card.label}</p>
              <p className="text-sm text-muted leading-relaxed">{card.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* THE BOOKSHELF */}
      <section className="pt-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="eyebrow text-gold-text mb-3">The Bookshelf</p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">Explore every world</h2>
          <Divider className="!my-8" />

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {bookshelfFilters.map((g) => (
              <button key={g} onClick={() => setFilter(g)}
                className={`label-caps px-4 py-2 rounded-full border transition-all ${filter === g ? 'bg-ink text-gold-lt border-gold' : 'bg-cream text-text/70 border-gold/25 hover:border-gold/60 hover:text-ink'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="py-16 text-center text-muted">Loading books…</p>}
        {error && <p className="py-16 text-center text-rose">Couldn't load books: {error}</p>}
        {!loading && !error && <BookCarousel books={filtered} />}

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-4 text-center">
          <WhereToBuyButton source="home" subtext="Online & selected bookstores" />
        </div>
      </section>

      <Testimonials />
      <PressStrip />
      <NewsPreview />
      <BlogPreview />

      <div id="free-chapter" className="scroll-mt-20">
        <EmailStrip
          heading="Join Gaurav's Reader Circle"
          subheading="Receive new-release updates, sample chapters, behind-the-scenes writing notes and occasional subscriber-only resources."
          showGenrePreference
        />
      </div>
      <WriteTogetherHub />

      {/* FINAL CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-display text-2xl md:text-3xl text-ink mb-7">Find your next read.</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <PrimaryButton to="/books" onClick={() => trackEvent('homepage_cta_click', { label: 'Browse All Books (final)' })}>Browse All Books</PrimaryButton>
          <SecondaryButton to="/#free-chapter" onClick={() => trackEvent('homepage_cta_click', { label: 'Join the Reader Circle (final)' })}>Join the Reader Circle</SecondaryButton>
        </div>
      </section>
    </>
  );
}
