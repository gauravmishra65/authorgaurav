import type { CSSProperties, ReactNode } from 'react';
import type { BookTheme } from '../data/bookThemes';

interface BookThemeProviderProps {
  theme: BookTheme;
  children: ReactNode;
}

/** Applies a book's theme as CSS custom properties on a wrapping div — the
 * `--book-*` variable contract declared in index.css. Everything inside can
 * reference `var(--book-bg)`, `var(--book-accent)`, etc. via Tailwind
 * arbitrary values (`bg-[var(--book-bg)]`) without knowing which book it is. */
export default function BookThemeProvider({ theme, children }: BookThemeProviderProps) {
  const style = {
    '--book-bg': theme.background,
    '--book-surface': theme.surface,
    '--book-text': theme.text,
    '--book-muted': theme.mutedText,
    '--book-accent': theme.accent,
    '--book-secondary-accent': theme.secondaryAccent ?? theme.accent,
    ...(theme.headingFont && { '--book-heading-font': theme.headingFont }),
  } as CSSProperties;

  return <div style={style}>{children}</div>;
}
