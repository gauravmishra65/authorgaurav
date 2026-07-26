export type Genre = 'Fiction' | 'Memoir' | 'Devotional';
export type Language = 'English' | 'Hindi';
export type BookStatus = 'published' | 'upcoming' | 'preorder';

export interface Testimonial {
  quote: string;
  name: string;
  source?: string;
  authorReply?: string;
}

export interface BookFormat {
  name: string;
  url?: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  titleHtml?: string;
  subtitle?: string;
  author: string;
  tagline: string;
  synopsis: string;
  genre: Genre;
  /** Finer-grained tags (Thriller/Romance/Memoir/Devotional) — lets listings
   * distinguish books that share a single `genre` value (e.g. Shadow Code
   * and Offbeat Love are both `Fiction`, but Thriller vs Romance). */
  categories?: string[];
  language: Language;
  status: BookStatus;
  isHindi?: boolean;
  gradient: string;
  textOnDark?: boolean;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  bookWebsite?: string;
  buyLinks: { label: string; href: string }[];
  testimonials?: Testimonial[];
  /** ISO date (YYYY-MM-DD) the book releases or released. Drives the countdown/"Now Available" state. */
  releaseDate?: string;
  kindleUrl?: string;
  paperbackUrl?: string;
  /** Gives the book a "New Release" ribbon and extra prominence in listings. */
  featured?: boolean;
  // TODO_CONTENT: all fields below are part of the Phase 4 data model but
  // currently empty for every book — none of this is invented, and the UI
  // that reads them only renders when a real value exists.
  originalLanguage?: string;
  translatedTitles?: Record<string, string>;
  authorNote?: string;
  isbn10?: string;
  isbn13?: string;
  pageCount?: number;
  formats?: BookFormat[];
  sampleUrl?: string;
  trailerUrl?: string;
  themes?: string[];
  readingAudience?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// Book content lives in Supabase (authorgaurav_books/authorgaurav_testimonials) —
// see src/lib/queries.ts. Manage it via /admin.

// Single source of truth for the category tabs used to filter book listings
// (the homepage carousel and the /books page) — every listing that lets a
// reader filter by category should offer the same options. "Spiritual" is
// the human-facing label for the "Devotional" tag already used in the data.
export const bookCategoryOptions = ['Thriller', 'Romance', 'Spiritual', 'Memoir'] as const;
export const bookCategoryToTag: Record<(typeof bookCategoryOptions)[number], string> = {
  Thriller: 'Thriller', Romance: 'Romance', Spiritual: 'Devotional', Memoir: 'Memoir',
};

export interface BuyOption {
  label: string;
  href: string;
}

// Retailer links in `buyLinks` are frequently left as `#` placeholders
// before a real one is confirmed, while `kindleUrl`/`paperbackUrl` are the
// fields actually kept up to date for those two formats — so a book can
// have a real Kindle link even while `buyLinks`' own "Kindle" entry is
// still a placeholder. This is the one place that reconciles all three
// fields into a single, real, honest list of buy options — used by
// BookCarousel, BookCard, and BookPurchasePanel so every page shows the
// exact same options for a given book.
export function getBuyOptions(book: Pick<Book, 'buyLinks' | 'kindleUrl' | 'paperbackUrl'>): BuyOption[] {
  const options: BuyOption[] = [];
  for (const link of book.buyLinks) {
    if (link.label === 'Kindle') continue;
    if (link.href && link.href !== '#') options.push(link);
  }
  const kindleHref = book.kindleUrl || book.buyLinks.find((l) => l.label === 'Kindle' && l.href !== '#')?.href;
  if (kindleHref) options.push({ label: 'Kindle', href: kindleHref });
  if (book.paperbackUrl) options.push({ label: 'Paperback', href: book.paperbackUrl });
  return options;
}
