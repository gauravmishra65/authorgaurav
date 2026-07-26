import { BookOpen, Users, Rocket } from 'lucide-react';

// Single source of truth for the three WriteTogetherHub benefit cards,
// shared between the homepage teaser section and the dedicated page so
// they can't silently drift out of sync.
export const writeTogetherHubBenefits = [
  { icon: BookOpen, title: 'Learn the craft', body: 'Guided lessons on structure, character, voice, and revision — the things I wish I had known on day one.' },
  { icon: Users, title: 'Find your people', body: 'A community of writers and newcomers learning together, sharing pages, and keeping each other moving.' },
  { icon: Rocket, title: 'Get published', body: 'Practical paths from finished manuscript to reader — publishing, self-publishing, and everything between.' },
];
