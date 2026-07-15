export type BlogCategory =
  | 'Writing Craft'
  | 'Behind the Books'
  | 'Spiritual Reflections'
  | 'Book Updates';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  readTime: string;
  gradient: string;
}

export const blogCategories = [
  'All', 'Writing Craft', 'Behind the Books', 'Spiritual Reflections', 'Book Updates',
] as const;

// Post content lives in Supabase (authorgaurav_blog_posts) — see
// src/lib/queries.ts. Manage it via /admin.
