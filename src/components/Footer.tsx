import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm';
import SocialLinks from './SocialLinks';
import { trackEvent } from '../lib/analytics';

export default function Footer() {
  return (
    <footer className="relative bg-ink bg-grain text-ivory">
      <div className="hairline-solid w-full opacity-30" />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          <div className="col-span-2 lg:col-span-2">
            <p className="font-display text-2xl mb-3">Gaurav<span className="text-gold-text">Mishra</span></p>
            <p className="text-ivory/75 leading-relaxed max-w-sm">
              Stories of love, faith, ambition and the hidden systems that shape our lives — contemporary fiction, techno-financial thrillers, love stories, and accessible spiritual books.
            </p>
            <SocialLinks size={20} className="mt-5" />
          </div>

          <div>
            <p className="label-caps text-gold-text mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/books" className="text-ivory/75 hover:text-gold-text transition-colors">Books</Link></li>
              <li><Link to="/about" className="text-ivory/75 hover:text-gold-text transition-colors">About</Link></li>
              <li><Link to="/start-here" className="text-ivory/75 hover:text-gold-text transition-colors">Start Here (New Readers)</Link></li>
              <li><Link to="/writing-resources" className="text-ivory/75 hover:text-gold-text transition-colors">Writing Resources</Link></li>
              <li><Link to="/contact" className="text-ivory/75 hover:text-gold-text transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="label-caps text-gold-text mb-4">Readers</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/testimonials" className="text-ivory/75 hover:text-gold-text transition-colors">Reader Testimonials</Link></li>
              <li><Link to="/readers" className="text-ivory/75 hover:text-gold-text transition-colors">Readers</Link></li>
              <li><Link to="/book-clubs" className="text-ivory/75 hover:text-gold-text transition-colors">Book Clubs</Link></li>
              <li><Link to="/write-together-hub" className="text-ivory/75 hover:text-gold-text transition-colors">WriteTogetherHub</Link></li>
            </ul>
          </div>

          <div>
            <p className="label-caps text-gold-text mb-4">Media &amp; Journal</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/blog" className="text-ivory/75 hover:text-gold-text transition-colors">Journal</Link></li>
              <li><Link to="/events" className="text-ivory/75 hover:text-gold-text transition-colors">Events</Link></li>
              <li><Link to="/media" className="text-ivory/75 hover:text-gold-text transition-colors">Media</Link></li>
            </ul>
          </div>

          <div>
            <p className="label-caps text-gold-text mb-4">More Worlds</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="https://off-beat-love.com" target="_blank" rel="noopener noreferrer" className="text-ivory/75 hover:text-gold-text transition-colors break-words">off-beat-love.com ↗</a></li>
              <li><a href="https://the-shadow-code.com" target="_blank" rel="noopener noreferrer" className="text-ivory/75 hover:text-gold-text transition-colors break-words">the-shadow-code.com ↗</a></li>
              <li><a href="https://writetogetherhub.com" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('writetogetherhub_click', { source: 'footer' })} className="text-ivory/75 hover:text-gold-text transition-colors break-words">writetogetherhub.com ↗</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="label-caps text-gold-text mb-4">Newsletter</p>
            <NewsletterForm id="foot-email" layout="compact" source="footer" />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gold/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-2xs text-ivory/55 tracking-wider">© 2026 Gaurav Mishra · authorgaurav.com</p>
          <div className="flex items-center gap-4 text-2xs">
            <Link to="/privacy-policy" className="text-ivory/55 hover:text-gold-text transition-colors tracking-wider">Privacy</Link>
            <Link to="/terms" className="text-ivory/55 hover:text-gold-text transition-colors tracking-wider">Terms</Link>
            <Link to="/accessibility" className="text-ivory/55 hover:text-gold-text transition-colors tracking-wider">Accessibility</Link>
          </div>
          <p className="text-2xs text-ivory/45 tracking-wider">Crafted with care for readers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
