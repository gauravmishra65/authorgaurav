import { useId } from 'react';
import type { Book } from '../data/books';

// A 12-point starburst, drawn once: outer points at radius 50, inner at 41, in
// a 100x100 box.
const STAR_POINTS = Array.from({ length: 24 }, (_, i) => {
  const angle = (Math.PI * i) / 12 - Math.PI / 2;
  const radius = i % 2 === 0 ? 50 : 41;
  return `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`;
}).join(' ');

interface SalesBadgeProps {
  book: Pick<Book, 'milestoneSalesCount'>;
  size?: 'sm' | 'md';
  className?: string;
}

/** A gold star bubble ("850+ Sold") for a book's cover corner. It only exists
 * while the book has a sales milestone set in /admin - clearing that field
 * removes it - so the number is never hard-coded here. Place it inside a
 * `relative` wrapper around the cover. */
export default function SalesBadge({ book, size = 'md', className = '' }: SalesBadgeProps) {
  const gradientId = `sales-star-${useId().replace(/:/g, '')}`;
  const count = book.milestoneSalesCount;
  if (!count) return null;

  const box = size === 'md' ? 'h-24 w-24' : 'h-[5.25rem] w-[5.25rem]';

  return (
    <div className={`pointer-events-none absolute -right-5 -top-5 z-10 rotate-12 drop-shadow-lg ${box} ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3dc9a" />
            <stop offset="55%" stopColor="#d4a847" />
            <stop offset="100%" stopColor="#b8892b" />
          </linearGradient>
        </defs>
        <polygon points={STAR_POINTS} fill={`url(#${gradientId})`} stroke="#8a6414" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#8a6414" strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="1.5 2.2" />
      </svg>
      <div aria-hidden="true" className="relative flex h-full w-full flex-col items-center justify-center leading-none text-ink">
        <span className="font-display text-xl font-bold">{count}+</span>
        <span className="label-caps mt-0.5 text-2xs font-semibold">Sold</span>
      </div>
      <span className="sr-only">{count}+ copies sold</span>
    </div>
  );
}
