import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Divider from './Divider';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: 'left' | 'center';
  to?: string;
  toLabel?: string;
  /** "light" (default) for ivory/cream sections, "dark" for bg-ink sections
   * — controls heading/link color so text stays legible either way. */
  tone?: 'light' | 'dark';
  /** Defaults to h2 (this component is normally a mid-page section header).
   * Pass "h1" when a page's very first heading is a SectionHeading, so the
   * page has a real top-level heading instead of skipping straight to h2. */
  level?: 'h1' | 'h2';
}

export default function SectionHeading({ eyebrow, title, align = 'center', to, toLabel = 'View all', tone = 'light', level = 'h2' }: SectionHeadingProps) {
  const isCenter = align === 'center';
  const isDark = tone === 'dark';
  const Heading = level;
  return (
    <div className={isCenter ? 'text-center' : 'text-left'}>
      {eyebrow && <p className={`eyebrow mb-3 ${isDark ? 'text-gold-lt' : 'text-gold'}`}>{eyebrow}</p>}
      <Heading className={`font-display text-3xl md:text-4xl ${isDark ? 'text-ivory' : 'text-ink'}`}>{title}</Heading>
      {to && (
        <Link
          to={to}
          className={`mt-4 inline-flex items-center gap-1.5 label-caps transition-colors ${isDark ? 'text-gold-lt hover:text-gold' : 'text-gold hover:text-ink'}`}
        >
          {toLabel} <ArrowRight size={14} />
        </Link>
      )}
      {isCenter && <Divider className="!my-8" />}
    </div>
  );
}
