import { useEffect, useState } from 'react';
import { formatReleaseDate, isReleased } from '../lib/releaseStatus';

interface ReleaseCountdownProps {
  releaseDate: string;
  className?: string;
}

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getParts(releaseDate: string): Parts {
  const diff = Math.max(0, new Date(releaseDate).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const units: { key: keyof Parts; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
];

export default function ReleaseCountdown({ releaseDate, className = '' }: ReleaseCountdownProps) {
  const [parts, setParts] = useState<Parts | null>(null);
  const [released, setReleased] = useState(false);

  useEffect(() => {
    const tick = () => {
      if (isReleased(releaseDate)) {
        setReleased(true);
        return;
      }
      setParts(getParts(releaseDate));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [releaseDate]);

  if (released) {
    return (
      <p className={`font-display text-2xl text-gold-lt ${className}`}>The Shadow Code is Now Available</p>
    );
  }

  return (
    <div className={className}>
      <p className="sr-only" aria-live="off">Releasing {formatReleaseDate(releaseDate)}</p>
      <div className="flex items-start justify-center gap-4 sm:gap-6" aria-hidden="true">
        {units.map(({ key, label }) => (
          <div key={key} className="text-center">
            <div className="font-display text-3xl sm:text-4xl text-gold-lt tabular-nums">
              {parts ? String(parts[key]).padStart(2, '0') : '00'}
            </div>
            <div className="label-caps text-2xs text-ivory/60 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
