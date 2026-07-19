import { useState, type FormEvent } from 'react';
import type { Book } from '../data/books';
import { submitTestimonialFeedback } from '../lib/queries';

interface TestimonialFormProps {
  books: Book[];
  className?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function TestimonialForm({ books, className = '' }: TestimonialFormProps) {
  const [bookId, setBookId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quote, setQuote] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookId || !name || !email || !quote) return;

    setStatus('loading');
    try {
      await submitTestimonialFeedback({ bookId, name, email, quote });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={`rounded-md border border-gold/40 bg-cream px-6 py-8 text-center ${className}`}>
        <p className="font-display text-lg text-ink">Thank you for sharing.</p>
        <p className="text-sm text-muted mt-1">Your feedback is awaiting review — once approved, it'll appear on this page, and Gaurav may reply.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      <div>
        <label htmlFor="testimonial-book" className="label-caps text-muted block mb-2">Which book?</label>
        <select
          id="testimonial-book"
          required
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none"
        >
          <option value="">Select a book…</option>
          {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="testimonial-name" className="label-caps text-muted block mb-2">Name</label>
          <input
            id="testimonial-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="testimonial-email" className="label-caps text-muted block mb-2">Email</label>
          <input
            id="testimonial-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none"
          />
          <p className="text-2xs text-muted mt-1.5">Kept private — never shown publicly.</p>
        </div>
      </div>
      <div>
        <label htmlFor="testimonial-quote" className="label-caps text-muted block mb-2">Your Feedback</label>
        <textarea
          id="testimonial-quote"
          required
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="What did you think of the book?"
          className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none resize-none"
        />
      </div>
      {status === 'error' && <p className="text-2xs text-rose">Something went wrong — please try again.</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-caps btn-gold rounded-sm px-6 py-3 disabled:opacity-60">
        {status === 'loading' ? 'Submitting…' : 'Submit Feedback'}
      </button>
    </form>
  );
}
