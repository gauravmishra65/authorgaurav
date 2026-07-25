// Per-book visual atmosphere, kept deliberately separate from book content
// (which lives in Supabase). Only the four flagship books get a bespoke
// theme; every other book falls back to the site's own dark palette, so
// they render exactly as they always have.
export interface BookTheme {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  accent: string;
  secondaryAccent?: string;
  /** CSS font-family value; omit to inherit the site's Fraunces heading font. */
  headingFont?: string;
}

export const bookThemes: Record<string, BookTheme> = {
  'the-shadow-code': {
    background: '#080B12',
    surface: '#151B26',
    text: '#F5F7FA',
    mutedText: '#AAB2C0',
    accent: '#C52A35',
    secondaryAccent: '#3578A8',
  },
  'offbeat-love': {
    background: '#FAF4ED',
    surface: '#E9CBC5',
    text: '#2B2422',
    mutedText: '#45332F',
    accent: '#B76757',
    secondaryAccent: '#C2A06A',
  },
  'lalita-sahasranama': {
    background: '#FFF9ED',
    surface: '#EADBBE',
    text: '#3C2921',
    mutedText: '#6B5A45',
    accent: '#6F1D2C',
    secondaryAccent: '#B88B45',
  },
  'vishnu-sahasranama': {
    background: '#FFF9ED',
    surface: '#E8D9BA',
    text: '#2C2924',
    mutedText: '#6B5F4A',
    accent: '#173A63',
    secondaryAccent: '#326A78',
  },
};

export const defaultBookTheme: BookTheme = {
  background: 'var(--ink)',
  surface: 'var(--ink-soft)',
  text: 'var(--ivory)',
  mutedText: 'rgba(247,243,234,0.75)',
  accent: 'var(--gold)',
  secondaryAccent: 'var(--gold-lt)',
};

export function getBookTheme(slug: string): BookTheme {
  return bookThemes[slug] ?? defaultBookTheme;
}
