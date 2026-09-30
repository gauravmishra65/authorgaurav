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
  /** A text-safe variant of `accent`, only needed when the raw accent color
   * fails WCAG AA (4.5:1) as small text against `background` — omit to
   * reuse `accent` unchanged. `accent` itself stays untouched for non-text
   * uses (borders, glows, decorative fills) where contrast rules don't
   * apply, so the stronger brand color is preserved there. */
  accentText?: string;
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
    // #C52A35 reads at ~3.5:1 against this theme's own #080B12 background
    // and ~3.1:1 against its #151B26 surface — both under the 4.5:1
    // normal-text threshold (confirmed via axe-core e2e tests flagging
    // small eyebrow/label text on both surfaces; large headings in the
    // same color pass, since WCAG's large-text threshold is only 3:1).
    // #D66A72 keeps the same red family (30% mixed toward white) at ~5.8:1
    // vs background and ~5.1:1 vs surface — verified against both with the
    // same relative-luminance formula axe uses.
    accentText: '#D66A72',
    secondaryAccent: '#3578A8',
  },
  'offbeat-love': {
    background: '#FAF4ED',
    surface: '#E9CBC5',
    text: '#2B2422',
    mutedText: '#45332F',
    // #B76757 (the original terracotta) reads at ~2.7:1 against this
    // theme's own light surface/background — well under the 4.5:1 normal-text
    // threshold. #701F2A keeps the same warm rose-brown family (it's the
    // site's existing --burgundy token) but at ~7-10:1 against both.
    accent: '#701F2A',
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
