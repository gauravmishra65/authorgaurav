import { supabase } from './supabase';
import type { Book, Testimonial } from '../data/books';
import type { Post } from '../data/posts';
import type { NewsItem } from '../data/news';
import type { AuthorEvent } from '../data/events';
import type { ReaderPhoto } from '../data/readerPhotos';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface BookRow {
  id: string;
  slug: string;
  title: string;
  title_html: string | null;
  subtitle: string | null;
  author: string;
  tagline: string;
  synopsis: string;
  genre: Book['genre'];
  categories: string[] | null;
  language: Book['language'];
  status: Book['status'];
  gradient: string;
  text_on_dark: boolean;
  image_src: string | null;
  image_width: number | null;
  image_height: number | null;
  book_website: string | null;
  buy_links: { label: string; href: string }[];
  release_date: string | null;
  kindle_url: string | null;
  paperback_url: string | null;
  goodreads_url: string | null;
  featured: boolean;
  original_language: string | null;
  translated_titles: Record<string, string> | null;
  author_note: string | null;
  isbn10: string | null;
  isbn13: string | null;
  page_count: number | null;
  formats: Book['formats'] | null;
  sample_url: string | null;
  trailer_url: string | null;
  themes: string[] | null;
  reading_audience: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface TestimonialRow {
  id: string;
  book_id: string | null;
  quote: string;
  name: string;
  source: string | null;
  featured: boolean;
  author_reply: string | null;
}

function mapBook(row: BookRow, testimonials: Testimonial[]): Book {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleHtml: row.title_html ?? undefined,
    subtitle: row.subtitle ?? undefined,
    author: row.author,
    tagline: row.tagline,
    synopsis: row.synopsis,
    genre: row.genre,
    categories: row.categories ?? undefined,
    language: row.language,
    status: row.status,
    isHindi: row.language === 'Hindi',
    gradient: row.gradient,
    textOnDark: row.text_on_dark,
    imageSrc: row.image_src ?? undefined,
    imageWidth: row.image_width ?? undefined,
    imageHeight: row.image_height ?? undefined,
    bookWebsite: row.book_website ?? undefined,
    buyLinks: row.buy_links,
    testimonials,
    releaseDate: row.release_date ?? undefined,
    kindleUrl: row.kindle_url ?? undefined,
    paperbackUrl: row.paperback_url ?? undefined,
    goodreadsUrl: row.goodreads_url ?? undefined,
    featured: row.featured,
    originalLanguage: row.original_language ?? undefined,
    translatedTitles: row.translated_titles ?? undefined,
    authorNote: row.author_note ?? undefined,
    isbn10: row.isbn10 ?? undefined,
    isbn13: row.isbn13 ?? undefined,
    pageCount: row.page_count ?? undefined,
    formats: row.formats ?? undefined,
    sampleUrl: row.sample_url ?? undefined,
    trailerUrl: row.trailer_url ?? undefined,
    themes: row.themes ?? undefined,
    readingAudience: row.reading_audience ?? undefined,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
  };
}

export async function fetchBooks(): Promise<Book[]> {
  const [{ data: bookRows, error: booksError }, { data: testimonialRows, error: testimonialsError }] = await Promise.all([
    supabase.from('authorgaurav_books').select('*').order('sort_order'),
    supabase.from('authorgaurav_testimonials').select('id, book_id, quote, name, source, featured, author_reply').order('sort_order'),
  ]);

  if (booksError) throw booksError;
  if (testimonialsError) throw testimonialsError;

  const testimonialsByBook = new Map<string, Testimonial[]>();
  for (const t of (testimonialRows ?? []) as TestimonialRow[]) {
    if (!t.book_id) continue;
    const list = testimonialsByBook.get(t.book_id) ?? [];
    list.push({ quote: t.quote, name: t.name, source: t.source ?? undefined, authorReply: t.author_reply ?? undefined });
    testimonialsByBook.set(t.book_id, list);
  }

  return ((bookRows ?? []) as BookRow[]).map((row) => mapBook(row, testimonialsByBook.get(row.id) ?? []));
}

export interface FeaturedTestimonial extends Testimonial {
  book: string;
}

function mapTestimonialWithBook(row: {
  quote: string; name: string; source: string | null; author_reply: string | null;
  authorgaurav_books: { title: string }[] | { title: string } | null;
}): FeaturedTestimonial {
  const bookTitle = Array.isArray(row.authorgaurav_books)
    ? row.authorgaurav_books[0]?.title
    : row.authorgaurav_books?.title;
  return {
    quote: row.quote,
    name: row.name,
    source: row.source ?? undefined,
    authorReply: row.author_reply ?? undefined,
    book: bookTitle ?? '',
  };
}

export async function fetchFeaturedTestimonials(limit = 3): Promise<FeaturedTestimonial[]> {
  const { data, error } = await supabase
    .from('authorgaurav_testimonials')
    .select('quote, name, source, author_reply, authorgaurav_books(title)')
    .eq('featured', true)
    .order('sort_order')
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapTestimonialWithBook);
}

/** Every author-curated testimonial (the whole reader wall), newest-first for the /testimonials page. */
export async function fetchAllTestimonials(): Promise<FeaturedTestimonial[]> {
  const { data, error } = await supabase
    .from('authorgaurav_testimonials')
    .select('quote, name, source, author_reply, authorgaurav_books(title)')
    .order('sort_order');

  if (error) throw error;
  return (data ?? []).map(mapTestimonialWithBook);
}

export interface TestimonialSubmission {
  bookId: string;
  name: string;
  email: string;
  quote: string;
}

/** Public reader feedback lands in a moderation queue — see fetchTestimonialSubmissions in adminQueries.ts. */
export async function submitTestimonialFeedback({ bookId, name, email, quote }: TestimonialSubmission): Promise<void> {
  const { error } = await supabase
    .from('authorgaurav_testimonial_submissions')
    .insert({ book_id: bookId, name, email, quote });
  if (error) throw error;
}

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  category: Post['category'];
  gradient: string;
  read_time: string;
  published_at: string;
}

export async function fetchBlogPosts(): Promise<Post[]> {
  const { data, error } = await supabase.from('authorgaurav_blog_posts').select('*').order('published_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as BlogPostRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content ?? undefined,
    category: row.category,
    date: formatDate(row.published_at),
    readTime: row.read_time,
    gradient: row.gradient,
  }));
}

interface NewsItemRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: NewsItem['category'];
  gradient: string;
  published_at: string;
}

export async function fetchNewsItems(): Promise<NewsItem[]> {
  const { data, error } = await supabase.from('authorgaurav_news_items').select('*').order('published_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as NewsItemRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: formatDate(row.published_at),
    gradient: row.gradient,
  }));
}

interface EventRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string | null;
  timezone: string | null;
  location: string | null;
  mode: AuthorEvent['mode'];
  event_type: AuthorEvent['eventType'];
  registration_url: string | null;
  featured: boolean;
}

interface ReaderPhotoRow {
  id: string;
  image_src: string;
  reader_name: string | null;
  caption: string | null;
  sort_order: number;
  authorgaurav_books: { title: string }[] | { title: string } | null;
}

/** Fan/reader-submitted photos with the book, for the Events page gallery — sorted by admin-set sort_order. */
export async function fetchReaderPhotos(): Promise<ReaderPhoto[]> {
  const { data, error } = await supabase
    .from('authorgaurav_reader_photos')
    .select('id, image_src, reader_name, caption, sort_order, authorgaurav_books(title)')
    .order('sort_order');

  if (error) throw error;
  return ((data ?? []) as ReaderPhotoRow[]).map((row) => {
    const bookTitle = Array.isArray(row.authorgaurav_books)
      ? row.authorgaurav_books[0]?.title
      : row.authorgaurav_books?.title;
    return {
      id: row.id,
      imageSrc: row.image_src,
      readerName: row.reader_name ?? undefined,
      caption: row.caption ?? undefined,
      bookTitle: bookTitle ?? undefined,
    };
  });
}

export interface BookCategory {
  id: string;
  label: string;
  navLabel: string;
  tag: string;
}

interface BookCategoryRow {
  id: string;
  label: string;
  nav_label: string | null;
  tag: string;
  sort_order: number;
}

/** Every book category, in display order. Drives the /books and homepage
 * filter pills, the Nav "Books" dropdown, and the admin book editor's
 * category checkboxes — add a row here (via /admin/book-categories) and it
 * appears in all of them automatically. */
export async function fetchBookCategories(): Promise<BookCategory[]> {
  const { data, error } = await supabase.from('authorgaurav_book_categories').select('*').order('sort_order');
  if (error) throw error;
  return ((data ?? []) as BookCategoryRow[]).map((row) => ({
    id: row.id,
    label: row.label,
    navLabel: row.nav_label || row.label,
    tag: row.tag,
  }));
}

export async function fetchEvents(): Promise<AuthorEvent[]> {
  const { data, error } = await supabase.from('authorgaurav_events').select('*').order('event_date', { ascending: true });
  if (error) throw error;
  return ((data ?? []) as EventRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    eventDate: row.event_date,
    eventTime: row.event_time ?? undefined,
    timezone: row.timezone ?? undefined,
    location: row.location ?? undefined,
    mode: row.mode,
    eventType: row.event_type,
    registrationUrl: row.registration_url ?? undefined,
    featured: row.featured,
  }));
}
