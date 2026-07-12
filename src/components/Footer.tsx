import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';

// X (Twitter) icon — lucide doesn't ship a brand X mark; use a simple SVG.
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // // Connect: MailerLite/ConvertKit subscribe endpoint here.
    setDone(true);
  };

  return (
    <footer className="relative bg-ink text-ivory">
      <div className="hairline-solid w-full opacity-30" />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Bio */}
          <div className="md:col-span-2">
            <p className="font-display text-2xl mb-3">
              Gaurav<span className="text-gold">Mishra</span>
            </p>
            <p className="text-ivory/75 leading-relaxed max-w-sm">
              Stories across worlds — romance, mystery, devotion, and the road in
              between.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a href="#" aria-label="Instagram" className="text-ivory/70 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="text-ivory/70 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="X (Twitter)" className="text-ivory/70 hover:text-gold transition-colors">
                <XIcon />
              </a>
              <a href="#" aria-label="YouTube" className="text-ivory/70 hover:text-gold transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="label-caps text-gold mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/books" className="text-ivory/75 hover:text-gold transition-colors">Books</Link></li>
              <li><Link to="/about" className="text-ivory/75 hover:text-gold transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-ivory/75 hover:text-gold transition-colors">Blog</Link></li>
              <li><Link to="/write-together-hub" className="text-ivory/75 hover:text-gold transition-colors">WriteTogetherHub</Link></li>
              <li>
                <a href="https://off-beat-love.com" target="_blank" rel="noopener noreferrer" className="text-ivory/75 hover:text-gold transition-colors">
                  off-beat-love.com ↗
                </a>
              </li>
              <li>
                <a href="https://the-shadow-code.com" target="_blank" rel="noopener noreferrer" className="text-ivory/75 hover:text-gold transition-colors">
                  the-shadow-code.com ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="label-caps text-gold mb-4">Newsletter</p>
            {done ? (
              <p className="text-sm text-gold-lt">Thank you — you’re subscribed.</p>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-2.5">
                <label htmlFor="foot-email" className="sr-only">Email address</label>
                <div className="flex items-center gap-2 border-b border-gold/40 pb-2">
                  <Mail size={16} className="text-gold/70" />
                  <input
                    id="foot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-transparent text-ivory placeholder:text-ivory/40 text-sm w-full focus:outline-none"
                  />
                </div>
                <button type="submit" className="btn-caps btn-gold-outline self-start px-4 py-2 text-2xs rounded-sm">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gold/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-2xs text-ivory/55 tracking-wider">
            © 2026 Gaurav Mishra · authorgaurav.com
          </p>
          <p className="text-2xs text-ivory/45 tracking-wider">
            Crafted with care for readers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
