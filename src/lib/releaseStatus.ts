import type { Book } from '../data/books';

export function isReleased(releaseDate: string): boolean {
  return Date.now() >= new Date(releaseDate).getTime();
}

export function formatReleaseDate(releaseDate: string): string {
  return new Date(releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/** Single source of truth for "which book is the current marketing
 * priority" — drives the header CTA, the homepage hero, and Media's
 * "Current Release" block, so none of them can contradict each other.
 * `featured` is meant to be true on exactly one book at a time (enforced
 * by convention in the admin, not a DB constraint); if none is marked,
 * falls back to the most recently released published book so the site
 * still shows something sensible rather than nothing. */
export function getFeaturedBook(books: Book[]): Book | undefined {
  const marked = books.find((b) => b.featured);
  if (marked) return marked;

  const released = books.filter((b) => b.status === 'published' && b.releaseDate && isReleased(b.releaseDate));
  if (released.length === 0) return undefined;
  return released.reduce((latest, b) => (new Date(b.releaseDate!) > new Date(latest.releaseDate!) ? b : latest));
}
