import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Mail } from 'lucide-react';
import Seo from '../components/Seo';
import BookCover from '../components/BookCover';
import BookCarousel from '../components/BookCarousel';
import EmailStrip from '../components/EmailStrip';
import WriteTogetherHub from '../components/WriteTogetherHub';
import BlogPreview from '../components/BlogPreview';
import NewsPreview from '../components/NewsPreview';
import Testimonials from '../components/Testimonials';
import PressStrip from '../components/PressStrip';
import AboutTeaser from '../components/AboutTeaser';
import Divider from '../components/Divider';
import { genreFilters, type Genre } from '../data/books';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

export default function Home() {
  const [filter, setFilter] = useState<(typeof genreFilters)[number]>('All');
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
      : books.filter((b) => b.genre === (filter as Genre));

  const featured = books.find((b) => b.slug === 'offbeat-love') ?? books[0];
  const shadowCode = books.find((b) => b.slug === 'shadow-code') ?? books[1] ?? books[0];
  const journey = books.find((b) => b.slug === 'journey-of-grace') ?? books[2] ?? books[0];

  return (
    <>
      <Seo
        title="Gaurav Mishra — Author · Storyteller · Founder, WriteTogetherHub"
        description="Stories across worlds — romance, mystery, devotion, and the road in between. Explore the books of Gaurav Mishra and join WriteTogetherHub, a home for writers."
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="eyebrow text-gold-lt mb-5 fade-up" style={{ animationDelay: '0.05s' }}>
                Author · Storyteller · Founder, WriteTogetherHub
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 fade-up" style={{ animationDelay: '0.18s' }}>
                Stories across worlds —{' '}
                <span className="italic text-gold-lt">romance, mystery, devotion,</span>{' '}
                and the road in between.
              </h1>
              <p className="text-ivory/80 leading-relaxed max-w-xl mb-8 fade-up" style={{ animationDelay: '0.32s' }}>
                From the melody of Offbeat Love to the algorithms of Shadow Code to timeless devotional wisdom — Gaurav Mishra writes across genres, and champions new writers along the way.
              </p>
              <div className="flex flex-wrap gap-4 fade-up" style={{ animationDelay: '0.46s' }}>
                <Link to="/books" className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3">
                  <BookOpen size={16} /> Explore the Books
                </Link>
                <a href="#free-chapter" className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3">
                  <Mail size={16} /> Get a Free Chapter
                </a>
              </div>
            </div>

            {/* Right — fanned covers */}
            <div className="flex items-end justify-center gap-4 py-6 md:gap-0">
              <div className="hidden sm:block fade-up md:-mr-9 md:rotate-[-8deg]" style={{ animationDelay: '0.4s' }}>
                <BookCover {...shadowCode} size="sm" href={`/books/${shadowCode.slug}`} />
              </div>
              <div className="relative z-10 fade-up" style={{ animationDelay: '0.25s' }}>
                <BookCover {...featured} size="lg" href={`/books/${featured.slug}`} priority />
              </div>
              <div className="hidden sm:block fade-up md:-ml-9 md:rotate-[8deg]" style={{ animationDelay: '0.55s' }}>
                <BookCover {...journey} size="sm" href={`/books/${journey.slug}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BAND */}
      <section className="bg-ink-soft text-ivory relative overflow-hidden">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-[auto_1fr]">
            <div className="flex justify-center">
              <BookCover {...featured} size="lg" href={`/books/${featured.slug}`} />
            </div>
            <div>
              <p className="eyebrow text-gold-lt mb-3">Featured Book</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">Offbeat Love</h2>
              <p className="text-ivory/80 leading-relaxed mb-3 max-w-prose">
                A heartfelt romance about love, music, family expectations, and the courage to break free from a golden cage. Set against the pulse of Mumbai.
              </p>
              <p className="text-ivory/70 text-sm italic mb-7">Also available in Hindi as अनूठा प्यार.</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {featured.buyLinks.map((link) => (
                  <a key={link.label} href={link.href} className="btn-caps btn-gold-outline rounded-sm px-5 py-2.5 text-2xs">{link.label}</a>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="https://off-beat-love.com" target="_blank" rel="noopener noreferrer" className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3">
                  Visit the Book Site <ArrowRight size={15} />
                </a>
                <Link to={`/books/${featured.slug}`} className="btn-caps btn-gold-outline rounded-sm px-6 py-3">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE BOOKSHELF */}
      <section className="pt-20 pb-10">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="eyebrow text-gold mb-3">The Bookshelf</p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">Explore every world</h2>
          <Divider className="!my-8" />

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {genreFilters.map((g) => (
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

      <div id="free-chapter" className="scroll-mt-20"><EmailStrip /></div>
      <WriteTogetherHub />
      <NewsPreview />
      <BlogPreview />
      <AboutTeaser />
    </>
  );
}
