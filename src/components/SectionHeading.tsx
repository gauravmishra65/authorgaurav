import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Divider from './Divider';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: 'left' | 'center';
  to?: string;
  toLabel?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  align = 'center',
  to,
  toLabel = 'View all',
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <div className={isCenter ? 'text-center' : 'text-left'}>
      {eyebrow && <p className="eyebrow text-gold mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl text-ink">{title}</h2>
      {to && (
        <Link
          to={to}
          className={`mt-4 inline-flex items-center gap-1.5 label-caps text-gold hover:text-ink transition-colors ${
            isCenter ? '' : ''
          }`}
        >
          {toLabel}
          <ArrowRight size={14} />
        </Link>
      )}
      {isCenter && <Divider className="!my-8" />}
    </div>
  );
}
