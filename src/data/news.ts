export type NewsCategory = 'Release' | 'Event' | 'Press' | 'Announcement';

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  date: string;
  gradient: string;
}

export const newsCategories = ['All', 'Release', 'Event', 'Press', 'Announcement'] as const;

// News/event content lives in Supabase (authorgaurav_news_items) — see
// src/lib/queries.ts. Manage it via /admin.
