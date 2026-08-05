import { Users } from 'lucide-react';
import SecondaryButton from './SecondaryButton';

interface BookClubCTAProps {
  bookTitle: string;
}

/** Book-club section — routes to the dedicated /book-clubs page (discussion
 * guides, appearance requests, group orders) rather than straight to Contact. */
export default function BookClubCTA({ bookTitle }: BookClubCTAProps) {
  return (
    <div className="rounded-md border border-gold/20 bg-cream p-8 text-center">
      <Users className="mx-auto mb-3 text-gold-text" size={28} aria-hidden="true" />
      <p className="font-display text-xl text-ink mb-2">Reading {bookTitle} with a book club?</p>
      <p className="text-muted text-sm mb-6 max-w-md mx-auto">
        Request an author appearance, in person or over video, or send a book-club enquiry.
      </p>
      <SecondaryButton to="/book-clubs">Visit Book Clubs</SecondaryButton>
    </div>
  );
}
