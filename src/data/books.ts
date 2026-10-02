export type Genre = 'Fiction' | 'Memoir' | 'Devotional';
export type Language = 'English' | 'Hindi';
export type BookStatus = 'published' | 'upcoming' | 'preorder';

export interface Testimonial {
  quote: string;
  name: string;
  source?: string;
  sourceUrl?: string;
  date?: string;
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
  /** Amazon India (amazon.in) and Amazon US (amazon.com) listings, kept as
   * separate fields so each storefront has its own button and its own admin
   * input. Older data stored a single "Amazon" entry inside `buyLinks`; see
   * `getAmazonLinks` for how both are reconciled. */
  amazonInUrl?: string;
  amazonUsUrl?: string;
  kindleUrl?: string;
  paperbackUrl?: string;
  shopifyUrl?: string;
  shopeeUrl?: string;
  lazadaUrl?: string;
  /** Real Goodreads book-page URL, if one exists — a review/shelving link,
   * not a retailer, so it's rendered separately from getBuyOptions() rather
   * than folded into the buy-links list. */
  goodreadsUrl?: string;
  /** Marks this as the single current marketing-priority book — drives the
   * header CTA, the homepage hero, and Media's "Current Release" block
   * (see `getFeaturedBook` in `lib/releaseStatus.ts`). Should be true on
   * exactly one book at a time; the admin book editor doesn't enforce this
   * automatically, so check for a stray second `true` after changing it. */
  featured?: boolean;
  /** Sales-milestone banner on the book page (e.g. "850+ copies sold in
   * September 2026"). Shown only when milestoneSalesCount is set — admin
   * clears it to null to turn the banner off between milestones. */
  milestoneSalesCount?: number;
  milestoneMonthLabel?: string;
  milestoneStoreCount?: number;
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

export interface BuyOption {
  label: string;
  href: string;
}

/** Names an Amazon link by its marketplace - "Amazon-IN" for amazon.in /
 * amzn.in, "Amazon-US" for amazon.com / amzn.com - so a reader can tell the
 * two storefronts apart. Derived from the link itself rather than stored, so
 * it can't drift out of step with the URL and covers links added later in
 * /admin. Any other label, or an Amazon domain this doesn't recognise (say
 * amazon.co.uk), is returned unchanged rather than guessed. */
export function marketplaceLabel(label: string, href: string): string {
  if (label.trim().toLowerCase() !== 'amazon') return label;
  let host = '';
  try { host = new URL(href).hostname.toLowerCase().replace(/^www\./, ''); } catch { return label; }
  if (host === 'amazon.in' || host === 'amzn.in') return 'Amazon-IN';
  if (host === 'amazon.com' || host === 'amzn.com') return 'Amazon-US';
  return label;
}

const isRealHref = (href: string | undefined): href is string => Boolean(href) && href !== '#';
const isAmazonEntry = (link: { label: string }) => link.label.trim().toLowerCase() === 'amazon';

/** Every real Amazon listing for a book, Amazon-IN first, then Amazon-US.
 * `amazonInUrl` / `amazonUsUrl` are the source of truth. A legacy "Amazon"
 * entry in `buyLinks` is still honoured so nothing disappears while old data
 * is being moved, but only when it adds something: it is skipped if it is the
 * same URL as a dedicated field, or on a marketplace that already has one. */
export function getAmazonLinks(book: Pick<Book, 'buyLinks' | 'amazonInUrl' | 'amazonUsUrl'>): BuyOption[] {
  const links: BuyOption[] = [];
  if (book.amazonInUrl) links.push({ label: 'Amazon-IN', href: book.amazonInUrl });
  if (book.amazonUsUrl) links.push({ label: 'Amazon-US', href: book.amazonUsUrl });
  for (const link of book.buyLinks) {
    if (!isAmazonEntry(link) || !isRealHref(link.href)) continue;
    const label = marketplaceLabel(link.label, link.href);
    if (links.some((l) => l.href === link.href || l.label === label)) continue;
    links.push({ label, href: link.href });
  }
  return links;
}

/** The link a reader should use to leave a review: an Amazon listing if there
 * is one, otherwise the first real retailer link. */
export function getReviewLink(book: Pick<Book, 'buyLinks' | 'amazonInUrl' | 'amazonUsUrl'>): BuyOption | undefined {
  const amazon = getAmazonLinks(book)[0];
  if (amazon) return amazon;
  const other = book.buyLinks.find((l) => isRealHref(l.href));
  return other ? { label: marketplaceLabel(other.label, other.href), href: other.href } : undefined;
}

// Retailer links in `buyLinks` are frequently left as `#` placeholders
// before a real one is confirmed, while `kindleUrl`/`paperbackUrl` are the
// fields actually kept up to date for those two formats — so a book can
// have a real Kindle link even while `buyLinks`' own "Kindle" entry is
// still a placeholder. This is the one place that reconciles all three
// fields into a single, real, honest list of buy options — used by
// BookCarousel, BookCard, and BookPurchasePanel so every page shows the
// exact same options for a given book.
export function getBuyOptions(book: Pick<Book, 'buyLinks' | 'kindleUrl' | 'paperbackUrl' | 'shopifyUrl' | 'shopeeUrl' | 'lazadaUrl' | 'amazonInUrl' | 'amazonUsUrl'>): BuyOption[] {
  const options: BuyOption[] = getAmazonLinks(book);
  for (const link of book.buyLinks) {
    if (link.label === 'Kindle' || isAmazonEntry(link)) continue;
    if (isRealHref(link.href)) options.push({ ...link, label: marketplaceLabel(link.label, link.href) });
  }
  const kindleHref = book.kindleUrl || book.buyLinks.find((l) => l.label === 'Kindle' && l.href !== '#')?.href;
  if (kindleHref) options.push({ label: 'Kindle', href: kindleHref });
  if (book.paperbackUrl) options.push({ label: 'Paperback', href: book.paperbackUrl });
  if (book.shopifyUrl) options.push({ label: 'Shopify', href: book.shopifyUrl });
  if (book.shopeeUrl) options.push({ label: 'Shopee', href: book.shopeeUrl });
  if (book.lazadaUrl) options.push({ label: 'Lazada', href: book.lazadaUrl });
  return options;
}

// Same-story translation pairs (English slug -> Hindi slug). Each language
// edition is its own separate row in authorgaurav_books with no relational
// field linking them, so — unlike `getFeaturedBook`, which is fully data-
// driven — this one small list stays an explicit, documented exception.
// Add an entry whenever a new translated edition is published.
const TRANSLATION_PAIRS: Record<string, string> = {
  'the-shadow-code': 'shadow-code-hindi',
  'the-zero-account': 'zero-account-hindi',
};

export function getTranslationEdition(book: Pick<Book, 'slug'>, books: Book[]): Book | undefined {
  const siblingSlug = TRANSLATION_PAIRS[book.slug];
  return siblingSlug ? books.find((b) => b.slug === siblingSlug) : undefined;
}
