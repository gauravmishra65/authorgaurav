import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Pause, Play } from 'lucide-react';
import type { MilestoneParts } from '../lib/milestoneText';

interface MilestoneTickerProps {
  parts: MilestoneParts;
  href: string;
}

/** A continuously-scrolling attention strip for a book's sales milestone —
 * same seamless-loop technique as BookCarousel (.carousel-track), and the
 * same pointerdown-pause fix, since this is just as tappable/clickable on a
 * phone as that carousel's covers were. */
export default function MilestoneTicker({ parts, href }: MilestoneTickerProps) {
  const [paused, setPaused] = useState(false);
  const [manualPause, setManualPause] = useState(false);

  // The second copy exists only to make the loop seamless — hidden from
  // assistive tech and the tab order so the announcement isn't read twice.
  const item = (duplicate: boolean) => (
    <Link
      to={href}
      className="inline-flex items-center gap-2 mr-16 shrink-0 hover:text-gold-lt transition-colors"
      {...(duplicate ? { 'aria-hidden': true, tabIndex: -1 } : {})}
    >
      <Trophy size={16} className="text-gold-lt shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap">
        {parts.before}
        <strong className="font-bold text-gold-lt">{parts.highlight}</strong>
        {parts.after}
      </span>
    </Link>
  );

  return (
    <div
      className="carousel-viewport relative overflow-hidden bg-ink text-ivory/90 border-b border-gold/20"
      role="region"
      aria-label="Milestone announcement"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
      onPointerCancel={() => setPaused(false)}
    >
      <div
        className="carousel-track flex w-max py-2.5 text-xs label-caps tracking-wide"
        style={{ animationDuration: '26s', animationPlayState: paused || manualPause ? 'paused' : undefined }}
      >
        {item(false)}
        {item(true)}
      </div>
      <button
        type="button"
        onClick={() => setManualPause((p) => !p)}
        aria-pressed={manualPause}
        aria-label={manualPause ? 'Play scrolling announcement' : 'Pause scrolling announcement'}
        className="carousel-pause absolute inset-y-0 right-0 z-10 flex items-center bg-ink pl-4 pr-3 text-ivory/80 hover:text-gold-lt transition-colors"
      >
        {manualPause ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </div>
  );
}
