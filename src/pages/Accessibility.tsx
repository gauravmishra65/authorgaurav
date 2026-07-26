import LegalPageLayout from '../components/LegalPageLayout';

export default function Accessibility() {
  return (
    <LegalPageLayout
      title="Accessibility Statement"
      seoDescription="authorgaurav.com's commitment to an accessible reading experience."
      path="/accessibility"
      lastUpdated="24 July 2026"
    >
      <p>
        Gaurav Mishra wants everyone — including readers using screen readers, keyboard navigation, or other
        assistive technology — to be able to browse this site, read about the books, and get in touch. This page
        describes where things stand and how to reach us if something isn't working for you.
      </p>

      <h2 className="font-display text-xl text-ink">What's in place today</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Visible focus outlines on every interactive element when navigating by keyboard.</li>
        <li>A semantic heading structure, landmark regions, and a skip-to-content link on every page.</li>
        <li>Descriptive alt text on book covers and author photography.</li>
        <li>A mobile navigation menu with proper dialog semantics, a keyboard focus trap, Escape-to-close, background scroll locking, and focus returned to the menu button on close.</li>
        <li>Correct Devanagari fonts and a declared Hindi language attribute on Hindi book pages, so matras and conjuncts render properly and screen readers use the right pronunciation rules.</li>
        <li>Respect for your device's "reduce motion" setting — animations are shortened or removed accordingly.</li>
      </ul>

      <h2 className="font-display text-xl text-ink">Where we're still improving</h2>
      <p>
        This is an ongoing effort rather than a finished checklist. Known areas we're actively working through
        include a fuller audit against WCAG 2.2 AA across every page, and improvements to interactive components
        like carousels and filters as they're rebuilt.
      </p>

      <h2 className="font-display text-xl text-ink">Let us know</h2>
      <p>
        If you hit a barrier anywhere on this site, please tell us — specific feedback (which page, what assistive
        technology, what happened) helps us fix it faster. Email{' '}
        <a href="mailto:hello@writetogetherhub.com" className="text-gold-text hover:text-ink transition-colors">hello@writetogetherhub.com</a>{' '}
        and we'll get back to you.
      </p>
    </LegalPageLayout>
  );
}
