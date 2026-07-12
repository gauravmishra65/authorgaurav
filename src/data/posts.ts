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
  'All',
  'Writing Craft',
  'Behind the Books',
  'Spiritual Reflections',
  'Book Updates',
] as const;

export const posts: Post[] = [
  {
    id: 'vishnu-sahasranama-daily-life',
    title: 'Vishnu Sahasranama in daily life',
    excerpt:
      'How a thousand-year-old hymn can become a daily anchor — not as ritual, but as a way of seeing the world with steadier eyes.',
    category: 'Spiritual Reflections',
    date: 'May 12, 2026',
    readTime: '6 min',
    gradient: 'from-[#0d1b46] via-[#10245e] to-[#0a1438]',
  },
  {
    id: 'writing-love-across-two-worlds',
    title: 'Writing love across two worlds',
    excerpt:
      'On building Offbeat Love — the music, the Mumbai backdrop, and the quiet courage it takes to let characters choose each other across a divide.',
    category: 'Behind the Books',
    date: 'Apr 28, 2026',
    readTime: '7 min',
    gradient: 'from-ink via-rose to-amber-400',
  },
  {
    id: 'idea-to-finished-manuscript',
    title: 'From idea to finished manuscript',
    excerpt:
      'A practical, honest map of the writing process — from the first half-formed thought to the final polished draft you can hand to a reader.',
    category: 'Writing Craft',
    date: 'Apr 14, 2026',
    readTime: '9 min',
    gradient: 'from-ink-soft via-ink to-[#16243a]',
  },
  {
    id: 'why-i-explain-the-hymns',
    title: "Why I explain the hymns, not just recite them",
    excerpt:
      "Devotional texts shouldn't be museums. Here's why I translate, unpack, and connect them to everyday life instead of leaving them on a high shelf.",
    category: 'Spiritual Reflections',
    date: 'Mar 30, 2026',
    readTime: '5 min',
    gradient: 'from-[#3a0d1a] via-[#5a1026] to-[#2a0810]',
  },
  {
    id: 'road-that-became-journey-of-grace',
    title: 'The road that became A Journey of Grace',
    excerpt:
      'The real trips, detours, and quiet conversations that shaped my travel memoir — and what I learned about faith while moving through unfamiliar places.',
    category: 'Behind the Books',
    date: 'Mar 16, 2026',
    readTime: '8 min',
    gradient: 'from-amber-200 via-gold-lt to-cream',
  },
  {
    id: 'advice-for-beginner-self',
    title: "Advice I'd give my beginner self",
    excerpt:
      'A letter to the writer I was at the start — the habits, the patience, the community, and the stubbornness that actually mattered.',
    category: 'Writing Craft',
    date: 'Mar 2, 2026',
    readTime: '6 min',
    gradient: 'from-[#0a1424] via-[#0e1a2b] to-[#16243a]',
  },
];
