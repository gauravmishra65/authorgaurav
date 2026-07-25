import { BookOpen } from 'lucide-react';
import SecondaryButton from './SecondaryButton';
import { trackEvent } from '../lib/analytics';

interface BookSampleProps {
  sampleUrl?: string;
  className?: string;
}

/** "Read a Sample" — only renders when a real sample link exists.
 * TODO_CONTENT: no book has a sample_url yet, so this returns null on every
 * current book page. Not a bug — nothing is invented in its place. */
export default function BookSample({ sampleUrl, className = '' }: BookSampleProps) {
  if (!sampleUrl) return null;
  return (
    <SecondaryButton href={sampleUrl} external className={className} onClick={() => trackEvent('sample_download')}>
      <BookOpen size={15} /> Read a Sample
    </SecondaryButton>
  );
}
