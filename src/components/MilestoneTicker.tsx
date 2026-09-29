import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

interface MilestoneTickerProps {
  text: string;
  href: string;
}

/** A continuously-scrolling attention strip for a book's sales milestone —
 * same seamless-loop technique as BookCarousel (.carousel-track), and the
 * same pointerdown-pause fix, since this is just as tappable/clickable on a
 * phone as that carousel's covers were. */
export default function MilestoneTicker({ text, href }: MilestoneTickerProps) {
  const [paused, setPaused] = useState(false);

  const item = (
    <Link to={href} className="inline-flex items-center gap-2 mr-16 flex-shrink-0 hover:text-gold-lt transition-colors">
      <Trophy size={15} className="text-gold-lt flex-shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap">{text}</span>
    </Link>
  );

  return (
    <div
      className="relative overflow-hidden bg-ink text-ivory/90 border-b border-gold/20"
      role="region"
      aria-label="Milestone announcement"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
      onPointerCancel={() => setPaused(false)}
    >
      <div
        className="carousel-track flex w-max py-2.5 text-xs label-caps tracking-wide"
        style={{ animationDuration: '26s', animationPlayState: paused ? 'paused' : undefined }}
      >
        {item}
        {item}
      </div>
    </div>
  );
}
