import BookCover from './BookCover';
import type { Book } from '../data/books';

interface BookCarouselProps {
  books: Book[];
}

export default function BookCarousel({ books }: BookCarouselProps) {
  if (books.length === 0) {
    return <p className="text-center text-muted py-8">No books in this category yet.</p>;
  }

  // Duplicated so the track can loop seamlessly: translateX(-50%) lands
  // exactly back on the first copy's starting position.
  const track = [...books, ...books];
  const duration = books.length * 4.5;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-28 bg-gradient-to-r from-ivory to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-28 bg-gradient-to-l from-ivory to-transparent z-10" />

      {/*
        No `gap` on the track: a flex gap only appears *between* items, so
        scrollWidth/2 would be half a gap short of one true period, causing
        a visible jump where the loop restarts. Each item carries its own
        mr-8 instead, so every item (duplicates included) contributes an
        identical width and translateX(-50%) lands exactly on the seam.
      */}
      <div className="carousel-track flex w-max py-2" style={{ animationDuration: `${duration}s` }}>
        {track.map((b, i) => (
          <div key={`${b.id}-${i}`} aria-hidden={i >= books.length} className="flex flex-shrink-0 flex-col items-center gap-3 mr-8">
            <BookCover {...b} size="md" href={`/books/${b.slug}`} />
            <div className="text-center">
              <p className="font-display text-sm text-ink">{b.title}</p>
              {b.isHindi && (
                <span className="inline-block mt-1 label-caps text-2xs text-rose border border-rose/40 rounded-full px-2 py-0.5">Hindi</span>
              )}
              {b.status === 'upcoming' && (
                <span className="inline-block mt-1 ml-1 label-caps text-2xs text-gold border border-gold/40 rounded-full px-2 py-0.5">Coming Soon</span>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {b.buyLinks.map((link) => (
                <a key={link.label} href={link.href} className="label-caps text-2xs text-gold border border-gold/30 rounded-full px-2.5 py-1 hover:bg-gold hover:text-ink transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
