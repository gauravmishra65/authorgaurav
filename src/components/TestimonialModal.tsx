import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import type { Book } from '../data/books';
import TestimonialForm from './TestimonialForm';

interface TestimonialModalProps {
  book: Book;
  className?: string;
}

export default function TestimonialModal({ book, className = '' }: TestimonialModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`rounded-md border border-gold/30 bg-ivory/5 p-5 ${className}`}>
        <p className="label-caps text-gold-lt mb-1.5 inline-flex items-center gap-1.5">
          <MessageCircle size={13} aria-hidden="true" /> Loved This Book?
        </p>
        <p className="text-sm text-ivory/70 mb-4">Share your feedback — Gaurav reads every note, and often replies.</p>
        <button onClick={() => setOpen(true)} className="btn-caps btn-gold-outline rounded-sm px-4 py-2 text-2xs">
          Add a Testimonial
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50 overflow-auto" onClick={() => setOpen(false)}>
          <div className="content-card max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl text-ink">Share Your Feedback</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-1 text-muted hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <TestimonialForm book={book} />
          </div>
        </div>
      )}
    </>
  );
}
