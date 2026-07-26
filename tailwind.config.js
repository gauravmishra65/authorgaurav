/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Literal hex, matching src/index.css's :root values exactly — NOT
        // var(--x) references. Tailwind's opacity-modifier utilities
        // (text-ivory/70, bg-charcoal/95, etc., used throughout the site)
        // need a real color to decompose into an alpha channel; a CSS
        // variable reference silently drops every /opacity variant.
        navy: '#101827',
        'soft-grey': '#E8E5DF',
        ink: '#101827',
        'ink-soft': '#1B2536',
        charcoal: '#17191D',
        gold: '#B18A4A',
        'gold-decoration': '#B18A4A',
        // Darker gold specifically for small/normal-size text on light
        // (cream/ivory) backgrounds — plain `gold` measures ~3:1 there,
        // short of WCAG AA's 4.5:1 for text. `gold` itself is unchanged
        // and still correct for borders, icons, and large display text.
        'gold-text': '#76572A',
        'gold-lt': '#CCAB74',
        ivory: '#F7F3EB',
        cream: '#FBF8F2',
        burgundy: '#701F2A',
        rose: '#B4506B',
        text: '#17191D',
        muted: '#66625C',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        'devanagari-serif': ['"Noto Serif Devanagari"', 'Georgia', 'serif'],
        'devanagari-sans': ['"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        book: '0 18px 40px -18px rgba(16,24,39,0.5)',
        'book-hover': '0 30px 50px -16px rgba(16,24,39,0.55)',
        luxury: '0 8px 32px -8px rgba(16,24,39,0.22)',
      },
      letterSpacing: { widest: '0.28em', wider: '0.14em' },
      zIndex: { header: '50', dropdown: '60', dialog: '70' },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(22px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'rise-1': 'rise 0.8s ease forwards 0.05s',
        'rise-2': 'rise 0.8s ease forwards 0.18s',
        'rise-3': 'rise 0.8s ease forwards 0.32s',
        'rise-4': 'rise 0.8s ease forwards 0.46s',
        'fade-in': 'fade-in 0.6s ease forwards',
      },
    },
  },
  plugins: [],
}
