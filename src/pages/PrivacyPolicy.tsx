import LegalPageLayout from '../components/LegalPageLayout';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      seoDescription="How authorgaurav.com collects, stores, and uses your information."
      path="/privacy-policy"
      lastUpdated="25 July 2026"
    >
      <p>
        This policy describes what information authorgaurav.com collects and how it is used. The site is run by
        Gaurav Mishra as an individual author.
      </p>

      <h2 className="font-display text-xl text-ink">What information is collected</h2>
      <p>
        The site collects information only when you choose to provide it:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Newsletter signup:</strong> your name and email address, and optionally a genre preference.</li>
        <li><strong>Contact form:</strong> your name, email address, and message, along with an optional checkbox to also join the newsletter.</li>
        <li><strong>Reader testimonials:</strong> your name, email address, and the quote you submit for review before publication.</li>
      </ul>
      <p>
        The site does not collect payment information, government ID numbers, or other sensitive personal data.
      </p>

      <h2 className="font-display text-xl text-ink">How your information is used</h2>
      <p>
        Newsletter details are used to send occasional updates about new releases and writing notes. Contact-form
        messages are used to respond to your enquiry. Testimonial submissions are reviewed by Gaurav before any
        quote, name, or reply is published on the site. Your information is not sold, rented, or used for
        advertising.
      </p>

      <h2 className="font-display text-xl text-ink">Where your information is stored</h2>
      <p>
        Site data (newsletter subscribers, contact messages, testimonials) is stored using Supabase, a third-party
        database and authentication provider. Contact-form emails are delivered through Resend, a third-party email
        API. If you subscribe to the newsletter, your email address and chosen interest may also be added to Brevo,
        the email service provider used to actually send newsletter mailings — this only happens when Brevo is
        configured on the site's backend, and never for contact-form messages or testimonials. These providers
        process data on the site's behalf and are bound by their own privacy and security practices.
      </p>

      <h2 className="font-display text-xl text-ink">Analytics</h2>
      <p>
        This site logs a small set of anonymous usage events (for example, a book page being viewed or a purchase
        link being clicked) to understand what readers find useful. This logging does not use cookies, does not
        collect your name, email address, or the content of anything you type, and is not shared with advertisers or
        used for cross-site tracking. Because no cookies are set and no personal data is collected, no cookie-consent
        banner is required for this. This site does not currently use advertising cookies or third-party
        ad-tracking scripts.
      </p>
      <p>
        The admin login (used only by the site owner) relies on a technical session cookie/local storage entry from
        Supabase Auth, which is required for that login to function and isn't used to track visitors.
      </p>

      <h2 className="font-display text-xl text-ink">Your choices</h2>
      <p>
        You can unsubscribe from the newsletter at any time using the link in any email you receive, or by emailing{' '}
        <a href="mailto:hello@writetogetherhub.com" className="text-gold-text hover:text-ink transition-colors">hello@writetogetherhub.com</a>.
        You can also email that address to request a copy of, or deletion of, any personal information held about
        you.
      </p>

      <h2 className="font-display text-xl text-ink">Children's privacy</h2>
      <p>This site is not directed at children and does not knowingly collect information from children.</p>

      <h2 className="font-display text-xl text-ink">Changes to this policy</h2>
      <p>This policy may be updated from time to time; the "last updated" date above will reflect the most recent revision.</p>

      <h2 className="font-display text-xl text-ink">Contact</h2>
      <p>
        Questions about this policy can be sent to{' '}
        <a href="mailto:hello@writetogetherhub.com" className="text-gold-text hover:text-ink transition-colors">hello@writetogetherhub.com</a>.
      </p>
    </LegalPageLayout>
  );
}
