import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Seo from '../components/Seo';
import BookSearch from '../components/BookSearch';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

export default function NotFound() {
  const [query, setQuery] = useState('');
  const { data: books } = useSupabaseData(fetchBooks, []);

  const matches = query.trim() && books
    ? books.filter((b) => b.title.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5)
    : [];

  return (
    <>
      <Seo
        title="Page Not Found — Gaurav Mishra"
        description="This page doesn't exist. Find your way back to the books, or search for a title."
        path="/404"
      />

      <section className="bg-ink bg-grain text-ivory min-h-[70vh] flex items-center">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <Compass className="mx-auto mb-6 text-gold" size={40} aria-hidden="true" />
          <p className="eyebrow text-gold-lt mb-4">404</p>
          <h1 className="font-display text-3xl md:text-4xl mb-4">This page doesn't exist</h1>
          <p className="text-ivory/75 leading-relaxed mb-10 max-w-md mx-auto">
            The page you're looking for may have moved or never existed. Try the search below, or head back to somewhere familiar.
          </p>

          <div className="mb-8">
            <BookSearch value={query} onChange={setQuery} id="notfound-search" />
            {matches.length > 0 && (
              <ul className="mt-4 mx-auto max-w-sm text-left rounded-md border border-gold/25 bg-ink-soft/60 overflow-hidden">
                {matches.map((b) => (
                  <li key={b.id} className="border-b border-gold/10 last:border-0">
                    <Link to={`/books/${b.slug}`} className="block px-4 py-2.5 text-ivory/85 hover:text-gold-lt hover:bg-ink/40 transition-colors">
                      {b.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {query.trim() && matches.length === 0 && (
              <p className="mt-4 text-sm text-ivory/60">No books match "{query}".</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <PrimaryButton to="/">Home</PrimaryButton>
            <SecondaryButton to="/books">Browse All Books</SecondaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
