import { useEffect, useRef, useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import type { Book } from '../data/books';
import TestimonialForm from './TestimonialForm';

interface TestimonialModalProps {
  book: Book;
  className?: string;
}

export default function TestimonialModal({ book, className = '' }: TestimonialModalProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const focusables = () => Array.from(dialog.querySelectorAll<HTMLElement>('a, button, input, select, textarea'));
    focusables()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab') {
        const list = focusables();
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <div className={`rounded-md border border-gold/30 bg-ivory/5 p-5 ${className}`}>
        <p className="label-caps text-gold-lt mb-1.5 inline-flex items-center gap-1.5">
          <MessageCircle size={13} aria-hidden="true" /> Loved This Book?
        </p>
        <p className="text-sm text-ivory/70 mb-4">Share your feedback — Gaurav reads every note, and often replies.</p>
        <button ref={triggerRef} onClick={() => setOpen(true)} className="btn-caps btn-gold-outline rounded-sm px-4 py-2 text-2xs">
          Add a Testimonial
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50 overflow-auto" onClick={close}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="testimonial-modal-title" className="content-card max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 id="testimonial-modal-title" className="font-display text-xl text-ink">Share Your Feedback</h2>
              <button onClick={close} aria-label="Close" className="p-1 text-muted hover:text-ink">
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
