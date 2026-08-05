import LegalPageLayout from '../components/LegalPageLayout';

export default function Terms() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      seoDescription="The terms governing use of authorgaurav.com."
      path="/terms"
      lastUpdated="24 July 2026"
    >
      <p>
        These terms govern your use of authorgaurav.com. By using the site, you agree to them.
      </p>

      <h2 className="font-display text-xl text-ink">The content on this site</h2>
      <p>
        All book excerpts, synopses, blog articles, and original artwork on this site are the property of Gaurav
        Mishra unless otherwise credited, and are shared for your personal, non-commercial reading enjoyment. Book
        covers and titles remain the property of their respective rights holders. You may share links to this site
        freely; please don't republish full articles or book excerpts elsewhere without permission.
      </p>

      <h2 className="font-display text-xl text-ink">Buying books</h2>
      <p>
        Purchase links on this site (Amazon, Flipkart, Kindle, and others) take you to third-party retailers. Any
        purchase you make is a transaction between you and that retailer, subject to their own terms, pricing, and
        availability. This site does not process payments or handle order fulfillment.
      </p>

      <h2 className="font-display text-xl text-ink">Reader submissions</h2>
      <p>
        If you submit a testimonial, review, or message through this site, you confirm it's your own genuine
        opinion and that you're comfortable with it (and your name, if provided) being published. Submissions are
        reviewed before publication and may be edited for length or declined at Gaurav's discretion.
      </p>

      <h2 className="font-display text-xl text-ink">No warranty</h2>
      <p>
        This site is provided as-is. While every effort is made to keep information (release dates, links, pricing
        references) accurate and up to date, no guarantee is made that the site will always be error-free,
        uninterrupted, or perfectly current.
      </p>

      <h2 className="font-display text-xl text-ink">External links</h2>
      <p>
        This site links to third-party sites (retailers, WriteTogetherHub, social media, and the dedicated
        microsites for individual books). Gaurav isn't responsible for the content or practices of those external
        sites.
      </p>

      <h2 className="font-display text-xl text-ink">Changes</h2>
      <p>These terms may be updated from time to time; the "last updated" date above reflects the most recent revision.</p>

      <h2 className="font-display text-xl text-ink">Contact</h2>
      <p>
        Questions about these terms can be sent to{' '}
        <a href="mailto:hello@writetogetherhub.com" className="text-gold-text underline hover:text-ink transition-colors">hello@writetogetherhub.com</a>.
      </p>
    </LegalPageLayout>
  );
}
