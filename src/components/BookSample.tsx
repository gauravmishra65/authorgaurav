import { BookOpen } from 'lucide-react';
import SecondaryButton from './SecondaryButton';
import { trackEvent } from '../lib/analytics';

interface BookSampleProps {
  sampleUrl?: string;
  /** Book slug, tracked alongside the sample_download event — matches the
   * trailer_play event's `book` property for consistency. */
  book?: string;
  className?: string;
}

/** "Read a Sample" — only renders when a real sample link exists. */
export default function BookSample({ sampleUrl, book, className = '' }: BookSampleProps) {
  if (!sampleUrl) return null;
  return (
    <SecondaryButton href={sampleUrl} external className={className} onClick={() => trackEvent('sample_download', { book })}>
      <BookOpen size={15} /> Read a Sample
    </SecondaryButton>
  );
}
