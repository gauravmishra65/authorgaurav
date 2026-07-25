import type { Book } from '../data/books';
import EmailStrip from './EmailStrip';

interface BookNewsletterCTAProps {
  book: Book;
}

const audienceCopy: Record<string, string> = {
  Thriller: 'suspense, twists, and the next techno-financial thriller',
  Romance: 'love stories and the next chapter of the heart',
  Memoir: 'honest, reflective true stories',
  Devotional: 'accessible spiritual reading for daily life',
};

/** EmailStrip with genre-aware framing — same underlying form/integration,
 * just copy tailored to whichever book the reader was just looking at. */
export default function BookNewsletterCTA({ book }: BookNewsletterCTAProps) {
  const category = book.categories?.[0] ?? book.genre;
  const audience = audienceCopy[category] ?? 'new releases and behind-the-scenes notes';

  // Hindi books get Hindi marketing copy so the CTA doesn't read as an abrupt
  // switch back to English at the bottom of an otherwise Hindi page. The
  // form itself (labels, consent, button) stays in English — translating
  // that functional/legal copy accurately is a separate, bigger task.
  if (book.language === 'Hindi') {
    return (
      <EmailStrip
        heading={`${book.title} और आध्यात्मिक पुस्तकों की जानकारी पाएं`}
        subheading="नई पुस्तकों, भक्ति-लेखन और दैनिक जीवन से जुड़े विचारों की मासिक जानकारी। कभी भी अनसब्सक्राइब करें।"
      />
    );
  }

  return (
    <EmailStrip
      heading={`Get a free chapter of ${book.title}`}
      subheading={`One email a month, for readers who love ${audience}. Unsubscribe anytime.`}
    />
  );
}
