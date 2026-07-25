import { AlertTriangle } from 'lucide-react';

/** A visually distinct callout — separate from body prose — flagging that a
 * legal page describes the site's actual practices but hasn't had a
 * professional legal review. Used on Privacy Policy, Terms, and
 * Accessibility so this caveat can't be missed inside a wall of text. */
export default function LegalReviewNote() {
  return (
    <div className="not-prose flex gap-3 rounded-md border border-gold/40 bg-cream/80 px-5 py-4 mb-8">
      <AlertTriangle className="shrink-0 text-gold mt-0.5" size={18} aria-hidden="true" />
      <p className="text-sm text-text/85 leading-relaxed">
        <strong>Content review note:</strong> this page describes the site's actual current practices, but it is not a
        substitute for professional legal advice. It should be reviewed by a qualified lawyer before being relied on
        for formal compliance purposes.
      </p>
    </div>
  );
}
