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

// TODO: replace with real dates, venues, and links as events are confirmed.
export const news: NewsItem[] = [
  {
    id: 'shadow-code-launch',
    slug: 'shadow-code-launch',
    title: 'Shadow Code is out now',
    excerpt: 'The techno-thriller that moves between Mumbai’s financial district and the dark architecture of the internet is now available in paperback and Kindle.',
    category: 'Release',
    date: 'Jun 2, 2026',
    gradient: 'from-[#0a1424] via-[#0e1a2b] to-[#16243a]',
  },
  {
    id: 'mumbai-litfest-panel',
    slug: 'mumbai-litfest-panel',
    title: 'Speaking at the Mumbai Lit Fest',
    excerpt: 'Join a panel on writing across genres — romance, thriller, memoir, and devotional texts — and what ties them together.',
    category: 'Event',
    date: 'May 20, 2026',
    gradient: 'from-ink via-rose to-amber-400',
  },
  {
    id: 'writetogetherhub-cohort',
    slug: 'writetogetherhub-cohort',
    title: 'WriteTogetherHub opens its next cohort',
    excerpt: 'A new round of guided sessions for new and returning writers begins next month — community, craft, and accountability.',
    category: 'Announcement',
    date: 'Apr 30, 2026',
    gradient: 'from-ink-soft via-ink to-[#16243a]',
  },
];
