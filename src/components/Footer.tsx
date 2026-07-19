import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm';
import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="relative bg-ink text-ivory">
      <div className="hairline-solid w-full opacity-30" />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="font-display text-2xl mb-3">Gaurav<span className="text-gold">Mishra</span></p>
            <p className="text-ivory/75 leading-relaxed max-w-sm">
              Stories across worlds — romance, mystery, devotion, and the road in between.
            </p>
            <SocialLinks size={20} className="mt-5" />
          </div>

          <div>
            <p className="label-caps text-gold mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/books" className="text-ivory/75 hover:text-gold transition-colors">Books</Link></li>
              <li><Link to="/about" className="text-ivory/75 hover:text-gold transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-ivory/75 hover:text-gold transition-colors">Blog</Link></li>
              <li><Link to="/news" className="text-ivory/75 hover:text-gold transition-colors">News &amp; Events</Link></li>
              <li><Link to="/testimonials" className="text-ivory/75 hover:text-gold transition-colors">Reader Testimonials</Link></li>
              <li><Link to="/write-together-hub" className="text-ivory/75 hover:text-gold transition-colors">WriteTogetherHub</Link></li>
            </ul>
          </div>

          <div>
            <p className="label-caps text-gold mb-4">More Worlds</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="https://off-beat-love.com" target="_blank" rel="noopener noreferrer" className="text-ivory/75 hover:text-gold transition-colors">off-beat-love.com ↗</a></li>
              <li><a href="https://the-shadow-code.com" target="_blank" rel="noopener noreferrer" className="text-ivory/75 hover:text-gold transition-colors">the-shadow-code.com ↗</a></li>
              <li><a href="https://writetogetherhub.com" target="_blank" rel="noopener noreferrer" className="text-ivory/75 hover:text-gold transition-colors">writetogetherhub.com ↗</a></li>
            </ul>
          </div>

          <div>
            <p className="label-caps text-gold mb-4">Newsletter</p>
            <NewsletterForm id="foot-email" layout="compact" source="footer" />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gold/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-2xs text-ivory/55 tracking-wider">© 2026 Gaurav Mishra · authorgaurav.com</p>
          <p className="text-2xs text-ivory/45 tracking-wider">Crafted with care for readers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
