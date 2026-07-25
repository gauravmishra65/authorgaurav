import type { ReactNode } from 'react';

interface EmptyStateProps {
  heading: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

/** Polished "nothing here yet" state — used for stub pages and for any
 * listing (events, news, etc.) that's legitimately empty rather than broken. */
export default function EmptyState({ heading, message, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-16 ${className}`}>
      <p className="font-display text-2xl text-ink mb-3">{heading}</p>
      <p className="text-muted max-w-md mx-auto leading-relaxed">{message}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
