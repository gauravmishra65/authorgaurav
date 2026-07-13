/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1A2B',
        'ink-soft': '#1C2E45',
        gold: '#C79A3E',
        'gold-lt': '#E6C87A',
        ivory: '#F7F1E6',
        cream: '#FBF7EF',
        rose: '#B4506B',
        text: '#23282F',
        muted: '#6B6256',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Spectral"', 'Georgia', 'serif'],
      },
      fontSize: { '2xs': '0.65rem', xs: '0.75rem' },
      boxShadow: {
        book: '0 18px 40px -18px rgba(14,26,43,0.5)',
        'book-hover': '0 30px 50px -16px rgba(14,26,43,0.55)',
        luxury: '0 8px 32px -8px rgba(14,26,43,0.22)',
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
