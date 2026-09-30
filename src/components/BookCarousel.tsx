import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookCover from './BookCover';
import type { Book } from '../data/books';
import { trackEvent } from '../lib/analytics';

interface BookCarouselProps {
  books: Book[];
}

export default function BookCarousel({ books }: BookCarouselProps) {
  // `:hover`/`:focus-within` alone (in index.css) never fires on touch
  // devices, so a phone tap on a cover or "View Book" link lands on a track
  // that's still sliding underneath it. Pausing on pointerdown (which fires
  // before the synthetic click on a tap) freezes the track in place before
  // the tap resolves, on every pointer type, not just mouse hover.
  const [paused, setPaused] = useState(false);

  if (books.length === 0) {
    return <p className="text-center text-muted py-8">No books in this category yet.</p>;
  }

  // Duplicated so the track can loop seamlessly: translateX(-50%) lands
  // exactly back on the first copy's starting position.
  const track = [...books, ...books];
  const duration = books.length * 4.5;

  return (
    <div
      className="relative overflow-hidden"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
      onPointerCancel={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-28 bg-gradient-to-r from-ivory to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-28 bg-gradient-to-l from-ivory to-transparent z-10" />

      {/*
        No `gap` on the track: a flex gap only appears *between* items, so
        scrollWidth/2 would be half a gap short of one true period, causing
        a visible jump where the loop restarts. Each item carries its own
        mr-10 instead, so every item (duplicates included) contributes an
        identical width and translateX(-50%) lands exactly on the seam.
      */}
      <div
        className="carousel-track flex w-max py-6"
        style={{ animationDuration: `${duration}s`, animationPlayState: paused ? 'paused' : undefined }}
      >
        {track.map((b, i) => (
          <div
            key={`${b.id}-${i}`}
            aria-hidden={i >= books.length}
            {...(i >= books.length ? { inert: '' } : {})}
            className="flex flex-shrink-0 flex-col items-center gap-3 mr-10 w-36"
          >
            <BookCover {...b} size="xs" href={`/books/${b.slug}`} onClick={() => trackEvent('book_explore', { book: b.slug, source: 'home-carousel' })} />
            <div className="text-center">
              <p className="font-display text-sm text-ink">{b.title}</p>
              {b.isHindi && (
                <span className="inline-block mt-1 label-caps text-2xs text-rose border border-rose/40 rounded-full px-2 py-0.5">Hindi</span>
              )}
              {b.status === 'upcoming' && (
                <span className="inline-block mt-1 ml-1 label-caps text-2xs text-gold-text border border-gold/40 rounded-full px-2 py-0.5">Coming Soon</span>
              )}
            </div>
            <p className="text-2xs text-muted leading-relaxed text-center line-clamp-2">{b.tagline}</p>
            <Link to={`/books/${b.slug}`} onClick={() => trackEvent('book_explore', { book: b.slug, source: 'home-carousel' })} className="label-caps text-2xs text-ink/70 hover:text-gold-text transition-colors underline underline-offset-2">View Book</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
