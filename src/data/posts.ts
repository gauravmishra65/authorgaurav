export type BlogCategory =
  | 'Writing Craft'
  | 'Behind the Books'
  | 'Spiritual Reflections'
  | 'Book Updates';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: BlogCategory;
  date: string;
  /** Set only when a post has been substantively revised after its original
   * publish date — not touched on every minor edit. Undefined means no
   * "Updated" line renders. */
  updatedDate?: string;
  readTime: string;
  gradient: string;
  /** What to promote at the end of the article — either a real book slug
   * (e.g. "the-shadow-code") or the literal value "writetogetherhub".
   * Undefined means no end-of-article CTA renders (never guessed/invented). */
  relatedLink?: string;
}

export const blogCategories = [
  'All', 'Writing Craft', 'Behind the Books', 'Spiritual Reflections', 'Book Updates',
] as const;

// Post content lives in Supabase (authorgaurav_blog_posts) — see
// src/lib/queries.ts. Manage it via /admin.
