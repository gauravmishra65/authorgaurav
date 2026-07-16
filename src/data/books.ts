export type Genre = 'Fiction' | 'Memoir' | 'Devotional';
export type Language = 'English' | 'Hindi';
export type BookStatus = 'published' | 'upcoming';

export interface Testimonial {
  quote: string;
  name: string;
  source?: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  titleHtml?: string;
  author: string;
  tagline: string;
  synopsis: string;
  genre: Genre;
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
}

// Book content lives in Supabase (authorgaurav_books/authorgaurav_testimonials) —
// see src/lib/queries.ts. Manage it via /admin.
export const genreFilters = ['All', 'Upcoming', 'Fiction', 'Devotional', 'Memoir'] as const;
