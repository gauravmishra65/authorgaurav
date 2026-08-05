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
import WorldLinesMotif from '../components/WorldLinesMotif';
import Divider from '../components/Divider';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { bookCategoryOptions, bookCategoryToTag } from '../data/books';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { trackEvent } from '../lib/analytics';

// "Upcoming" is an additional lens (handled separately below), not a
// category — the rest of the row mirrors the /books page's category tabs
// (src/data/books.ts) so the same options appear in both places.
const bookshelfFilters = ['All', 'Upcoming', ...bookCategoryOptions] as const;

// Phase 4 added a `categories` tag per book, so Thrillers and Love Stories
// now link to genuinely distinct filtered views (both used to collapse onto
// the same `genre=Fiction` bucket before that field existed).
const genreCards: { category: string; label: string; description: string }[] = [
  { category: 'Thriller', label: 'Thrillers and Contemporary Fiction', description: 'Techno-financial thrillers and character-driven fiction, including Shadow Code and The Zero Account.' },
  { category: 'Romance', label: 'Love Stories', description: 'Contemporary romance about love, family, and the courage to choose your own life, including Offbeat Love and अनूठा प्यार.' },
  { category: 'Spiritual', label: 'Spiritual and Devotional Books', description: 'Accessible Hindi devotional texts, including the Vishnu and Lalita Sahasranama, explained simply for daily life.' },
];

export default function Home() {
  const [filter, setFilter] = useState<(typeof bookshelfFilters)[number]>('All');
  const [portraitError, setPortraitError] = useState(false);
  const { data: books, loading, error } = useSupabaseData(fetchBooks, []);

  if (loading) return <div className="py-32 text-center text-muted">Loading…</div>;
  if (error || !books) return <div className="py-32 text-center text-rose">Couldn't load books: {error}</div>;

  // "Upcoming" is an additional lens, not an exclusive one — "All" and the
  // genre tabs always include upcoming books too (the "Coming Soon" badge
  // on each card already distinguishes status), so nothing appears to
  // vanish when switching between tabs.
  const filtered = filter === 'Upcoming'
    ? books.filter((b) => b.status === 'upcoming')
    : filter === 'All'
      ? books
      : books.filter((b) => b.categories?.includes(bookCategoryToTag[filter as keyof typeof bookCategoryToTag]));

  const shadowCode = books.find((b) => b.slug === 'the-shadow-code') ?? books[0];
  const shadowCodeHindi = books.find((b) => b.slug === 'shadow-code-hindi');

  return (
    <>
      <Seo
        title="Gaurav Mishra | Author of Shadow Code, Offbeat Love and Spiritual Books"
        description="Explore books by Gaurav Mishra, including the techno-financial thriller Shadow Code, contemporary fiction and accessible spiritual books in Hindi and English."
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-ink bg-grain text-ivory">
        <WorldLinesMotif className="text-gold-lt/10" />
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="eyebrow text-gold-lt mb-5 fade-up" style={{ animationDelay: '0.05s' }}>
                Author • Storyteller • Independent Publisher
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 fade-up" style={{ animationDelay: '0.18s' }}>
                Stories of love, faith, ambition and the hidden systems that shape our lives.
              </h1>
              <p className="text-ivory/80 leading-relaxed max-w-xl mb-8 fade-up" style={{ animationDelay: '0.32s' }}>
                Gaurav Mishra writes contemporary fiction, financial thrillers and accessible spiritual books for readers seeking suspense, emotion, meaning and reflection.
              </p>
              <div className="flex flex-wrap gap-4 fade-up" style={{ animationDelay: '0.46s' }}>
                <PrimaryButton to="/books" onClick={() => trackEvent('homepage_cta_click', { label: 'Explore the Books' })}>Explore the Books</PrimaryButton>
                <SecondaryButton to="/#free-chapter" onClick={() => trackEvent('homepage_cta_click', { label: 'Join the Reader Circle (hero)' })}>Join the Reader Circle</SecondaryButton>
              </div>
              <Link to="/start-here" className="inline-block mt-5 label-caps text-2xs text-gold-lt/80 hover:text-gold-lt transition-colors fade-up" style={{ animationDelay: '0.55s' }}>
                New here? Start Here to find your first book →
              </Link>
            </div>

            {/* Right — single visual: the author, not a crowd of covers */}
            <div className="flex justify-center py-6 fade-up" style={{ animationDelay: '0.25s' }}>
              <div className="relative w-full max-w-[280px]">
                <div className="aspect-[3/4] rounded-md border border-gold/25 shadow-book overflow-hidden bg-gradient-to-br from-ink-soft via-ink to-navy">
                  {!portraitError ? (
                    <img
                      src="/images/author/GM-Photo.jpg"
                      alt="Gaurav Mishra, author portrait"
                      width={1200}
                      height={1800}
                      className="w-full h-full object-cover object-top"
                      onError={() => setPortraitError(true)}
                      loading="eager"
                      // @ts-expect-error React 18 only applies the lowercase DOM attribute; camelCase fetchPriority isn't wired to it until React 19
                      fetchpriority="high"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center px-6">
                      <div>
                        <div className="mx-auto mb-3 w-16 hairline-solid opacity-60" />
                        <p className="label-caps text-gold-lt/80">Gaurav Mishra</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED RELEASE */}
      {shadowCode.releaseDate && <BookLaunchHero book={shadowCode} translationEdition={shadowCodeHindi} />}

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

        <BookCarousel books={filtered} />
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
