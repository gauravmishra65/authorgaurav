import { supabase } from './supabase';
import type { Book, Testimonial } from '../data/books';
import type { Post } from '../data/posts';
import type { NewsItem } from '../data/news';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface BookRow {
  id: string;
  slug: string;
  title: string;
  title_html: string | null;
  author: string;
  tagline: string;
  synopsis: string;
  genre: Book['genre'];
  language: Book['language'];
  status: Book['status'];
  gradient: string;
  text_on_dark: boolean;
  image_src: string | null;
  image_width: number | null;
  image_height: number | null;
  book_website: string | null;
  buy_links: { label: string; href: string }[];
}

interface TestimonialRow {
  id: string;
  book_id: string | null;
  quote: string;
  name: string;
  source: string | null;
  featured: boolean;
}

function mapBook(row: BookRow, testimonials: Testimonial[]): Book {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleHtml: row.title_html ?? undefined,
    author: row.author,
    tagline: row.tagline,
    synopsis: row.synopsis,
    genre: row.genre,
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
  };
}

export async function fetchBooks(): Promise<Book[]> {
  const [{ data: bookRows, error: booksError }, { data: testimonialRows, error: testimonialsError }] = await Promise.all([
    supabase.from('authorgaurav_books').select('*').order('sort_order'),
    supabase.from('authorgaurav_testimonials').select('id, book_id, quote, name, source, featured').order('sort_order'),
  ]);

  if (booksError) throw booksError;
  if (testimonialsError) throw testimonialsError;

  const testimonialsByBook = new Map<string, Testimonial[]>();
  for (const t of (testimonialRows ?? []) as TestimonialRow[]) {
    if (!t.book_id) continue;
    const list = testimonialsByBook.get(t.book_id) ?? [];
    list.push({ quote: t.quote, name: t.name, source: t.source ?? undefined });
    testimonialsByBook.set(t.book_id, list);
  }

  return ((bookRows ?? []) as BookRow[]).map((row) => mapBook(row, testimonialsByBook.get(row.id) ?? []));
}

export interface FeaturedTestimonial extends Testimonial {
  book: string;
}

export async function fetchFeaturedTestimonials(limit = 3): Promise<FeaturedTestimonial[]> {
  const { data, error } = await supabase
    .from('authorgaurav_testimonials')
    .select('quote, name, source, authorgaurav_books(title)')
    .eq('featured', true)
    .order('sort_order')
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => {
    const bookTitle = Array.isArray(row.authorgaurav_books)
      ? row.authorgaurav_books[0]?.title
      : (row.authorgaurav_books as { title: string } | null)?.title;
    return { quote: row.quote, name: row.name, source: row.source ?? undefined, book: bookTitle ?? '' };
  });
}

interface BlogPostRow {
  id: string;
  title: string;
  excerpt: string;
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
    title: row.title,
    excerpt: row.excerpt,
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
