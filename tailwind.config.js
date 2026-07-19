/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16243A',
        'ink-soft': '#22344D',
        charcoal: '#171A1F',
        gold: '#B88A44',
        'gold-lt': '#D3AB6E',
        ivory: '#F7F3EA',
        cream: '#EFE8DA',
        burgundy: '#7B263A',
        rose: '#B4506B',
        text: '#20242B',
        muted: '#6B6256',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Spectral"', 'Georgia', 'serif'],
      },
      fontSize: { '2xs': '0.65rem', xs: '0.75rem' },
      boxShadow: {
        book: '0 18px 40px -18px rgba(22,36,58,0.5)',
        'book-hover': '0 30px 50px -16px rgba(22,36,58,0.55)',
        luxury: '0 8px 32px -8px rgba(22,36,58,0.22)',
      },
      letterSpacing: { widest: '0.28em', wider: '0.14em' },
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
