import type { Book } from '../data/books';
import EmailStrip from './EmailStrip';

interface BookNewsletterCTAProps {
  book: Book;
}

// Each genre gets its own question + follow-through rather than one
// template with a swapped-in word — the brief this was built against
// specifically calls out not repeating identical copy across book pages.
const genreCopy: Record<string, { heading: string; subheading: string }> = {
  Thriller: {
    heading: 'Enjoy suspense and crime fiction?',
    subheading: 'Join the Reader Circle for book news, behind-the-story notes and future thriller releases.',
  },
  Romance: {
    heading: 'Enjoy contemporary love stories?',
    subheading: 'Join the Reader Circle for new-book news, reading notes and occasional extras.',
  },
  Devotional: {
    heading: 'Interested in devotional reading?',
    subheading: 'Receive updates on spiritual books, reading notes and future editions.',
  },
  Memoir: {
    heading: 'Enjoy honest, reflective true stories?',
    subheading: 'Join the Reader Circle for new-book news, reading notes and occasional extras.',
  },
};

const fallbackCopy = {
  heading: 'Want more from Gaurav Mishra?',
  subheading: 'Join the Reader Circle for new releases and behind-the-scenes notes.',
};

/** EmailStrip with genre-aware framing — same underlying form/integration,
 * just copy tailored to whichever book the reader was just looking at. */
export default function BookNewsletterCTA({ book }: BookNewsletterCTAProps) {
  const category = book.categories?.[0] ?? book.genre;
  const { heading, subheading } = genreCopy[category] ?? fallbackCopy;

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

  return <EmailStrip heading={heading} subheading={subheading} />;
}
