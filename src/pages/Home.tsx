import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Mail } from 'lucide-react';
import Seo from '../components/Seo';
import BookCover from '../components/BookCover';
import EmailStrip from '../components/EmailStrip';
import WriteTogetherHub from '../components/WriteTogetherHub';
import BlogPreview from '../components/BlogPreview';
import AboutTeaser from '../components/AboutTeaser';
import Divider from '../components/Divider';
import { books, genreFilters, type Genre } from '../data/books';

export default function Home() {
  const [filter, setFilter] = useState<(typeof genreFilters)[number]>('All');

  const filtered = filter === 'All' ? books : books.filter((b) => b.genre === (filter as Genre));

  const featured = books.find((b) => b.id === 'offbeat-love')!;
  const shadowCode = books.find((b) => b.id === 'shadow-code')!;
  const journey = books.find((b) => b.id === 'journey-of-grace')!;

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
            <div className="relative h-[360px] md:h-[420px] flex items-center justify-center">
              <div className="absolute left-2 md:left-0 top-10 fade-up" style={{ animationDelay: '0.4s', transform: 'rotate(-8deg)' }}>
                <BookCover {...shadowCode} size="md" href="/books" />
              </div>
              <div className="absolute right-2 md:right-0 top-12 fade-up" style={{ animationDelay: '0.55s', transform: 'rotate(8deg)' }}>
                <BookCover {...journey} size="md" href="/books" />
              </div>
              <div className="relative z-10 fade-up" style={{ animationDelay: '0.25s', transform: 'translateY(-8px)' }}>
                <BookCover {...featured} size="lg" href="https://off-beat-love.com" external />
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
              <BookCover {...featured} size="lg" href="https://off-beat-love.com" external />
            </div>
            <div>
              <p className="eyebrow text-gold-lt mb-3">Featured Book</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">Offbeat Love</h2>
              <p className="text-ivory/80 leading-relaxed mb-3 max-w-prose">
                A heartfelt romance about love, music, family expectations, and the courage to break free from a golden cage. Set against the pulse of Mumbai.
              </p>
              <p className="text-ivory/70 text-sm italic mb-7">Also available in Hindi as अनूठा प्यार.</p>
              <div className="flex flex-wrap gap-4">
                <a href="https://off-beat-love.com" target="_blank" rel="noopener noreferrer" className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3">
                  Visit the Book Site <ArrowRight size={15} />
                </a>
                <a href="#" className="btn-caps btn-gold-outline rounded-sm px-6 py-3">Buy on Amazon</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE BOOKSHELF */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="eyebrow text-gold mb-3">The Bookshelf</p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">Explore every world</h2>
          <Divider className="!my-8" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {genreFilters.map((g) => (
            <button key={g} onClick={() => setFilter(g)}
              className={`label-caps px-4 py-2 rounded-full border transition-all ${filter === g ? 'bg-ink text-gold-lt border-gold' : 'bg-cream text-text/70 border-gold/25 hover:border-gold/60 hover:text-ink'}`}>
              {g}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((b) => {
            const href = b.id === 'offbeat-love' || b.id === 'anootha-pyar' ? 'https://off-beat-love.com' : b.id === 'shadow-code' ? 'https://the-shadow-code.com' : '/books';
            const external = href.startsWith('http');
            return (
              <div key={b.id} className="flex flex-col items-center gap-3">
                <BookCover {...b} size="md" href={href} external={external} />
                <div className="text-center">
                  <p className="font-display text-sm text-ink">{b.title}</p>
                  {b.isHindi && (
                    <span className="inline-block mt-1 label-caps text-2xs text-rose border border-rose/40 rounded-full px-2 py-0.5">Hindi</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div id="free-chapter" className="scroll-mt-20"><EmailStrip /></div>
      <WriteTogetherHub />
      <BlogPreview />
      <AboutTeaser />
    </>
  );
}
