import { Search } from 'lucide-react';

interface BookSearchProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

/** Client-side title search — the whole catalog (9 books) is already fetched
 * for the page, so filtering in-memory here is correct; no search API/service
 * is warranted for a list this size. */
export default function BookSearch({ value, onChange, id = 'book-search' }: BookSearchProps) {
  return (
    <div className="mx-auto max-w-sm">
      <label htmlFor={id} className="sr-only">Search books by title</label>
      <div className="flex items-center gap-2 rounded-sm border border-gold/30 bg-cream px-4 py-2.5 focus-within:border-gold">
        <Search size={16} className="text-muted flex-shrink-0" aria-hidden="true" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by title…"
          className="w-full bg-transparent text-ink placeholder:text-muted/60 focus:outline-none"
        />
      </div>
    </div>
  );
}
