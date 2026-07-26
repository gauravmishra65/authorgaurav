import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import SocialLinks from './SocialLinks';
import MobileNavigation from './MobileNavigation';

// Journal deliberately links to the existing, populated /blog route rather
// than a new /journal URL — same content, different label, no risk to
// anything already indexed. Events now has its own real page (Phase 9) with
// structured date/time/location fields, so it no longer borrows /news.
const links = [
  { label: 'Home', to: '/' },
  { label: 'Books', to: '/books' },
  { label: 'About', to: '/about' },
  { label: 'Journal', to: '/blog' },
  { label: 'Media', to: '/media' },
  { label: 'Events', to: '/events' },
  { label: 'Readers', to: '/readers' },
  { label: 'Contact', to: '/contact' },
];

// Desktop drops "Books" since it renders as its own dropdown below.
const desktopLinks = links.filter((l) => l.to !== '/books');

// Phase 4 added a `categories` tag per book (Thriller/Romance/Memoir/
// Devotional), so these can finally link to genuinely distinct filtered
// views instead of both Thrillers and Romance pointing at the same
// `genre=Fiction` bucket.
const booksMenuLinks = [
  { label: 'All Books', to: '/books' },
  { label: 'Thrillers', to: '/books?category=Thriller' },
  { label: 'Romance and Contemporary Fiction', to: '/books?category=Romance' },
  { label: 'Spiritual and Devotional Books', to: '/books?category=Spiritual' },
  { label: 'Upcoming Books', to: '/books?status=Upcoming' },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [booksMenuOpen, setBooksMenuOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const booksMenuRef = useRef<HTMLLIElement>(null);

  const [lastPathname, setLastPathname] = useState(location.pathname);
  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setMobileOpen(false);
    setBooksMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Books dropdown: close on outside click or Escape.
  useEffect(() => {
    if (!booksMenuOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (booksMenuRef.current && !booksMenuRef.current.contains(e.target as Node)) {
        setBooksMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setBooksMenuOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [booksMenuOpen]);

  return (
    <header className={`sticky top-0 z-header transition-all duration-300 ${scrolled ? 'bg-charcoal/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(184,138,68,0.25)]' : 'bg-charcoal/85 backdrop-blur-sm'}`}>
      <div className="hairline-solid w-full opacity-40" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center shrink-0 rounded-md bg-ivory px-2.5 py-1.5" aria-label="Gaurav Mishra — home">
          <img src="/images/brand/logo-full.png" alt="Gaurav Mishra — authorgaurav.com" width={61} height={36} className="h-9 w-auto object-contain" />
        </Link>

        <ul className="hidden lg:flex items-center gap-2 xl:gap-5 ml-6">
          {desktopLinks.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                aria-current={location.pathname === l.to ? 'page' : undefined}
                className={`nav-caps transition-colors hover:text-gold-lt ${location.pathname === l.to ? 'text-gold-lt' : 'text-ivory/75'}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="relative" ref={booksMenuRef}>
            <button
              onClick={() => setBooksMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={booksMenuOpen}
              aria-current={location.pathname.startsWith('/books') ? 'page' : undefined}
              className={`nav-caps inline-flex items-center gap-1 transition-colors hover:text-gold-lt ${location.pathname.startsWith('/books') ? 'text-gold-lt' : 'text-ivory/75'}`}
            >
              Books <ChevronDown size={14} className={`transition-transform ${booksMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {booksMenuOpen && (
              <div role="menu" className="absolute left-0 top-full z-dropdown mt-2 min-w-[240px] rounded-md border border-gold/20 bg-charcoal shadow-luxury py-2">
                {booksMenuLinks.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    role="menuitem"
                    onClick={() => setBooksMenuOpen(false)}
                    className="nav-caps block px-4 py-2 text-ivory/75 hover:text-gold-lt hover:bg-ink-soft/60 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <SocialLinks size={15} className="hidden xl:flex" iconClassName="text-ivory/50 hover:text-gold-lt transition-colors" />
          <Link to="/books/the-shadow-code" className="btn-caps btn-gold rounded-sm px-4 py-2 whitespace-nowrap">Explore Latest Book</Link>
        </div>

        <button ref={toggleRef} className="lg:hidden text-ivory p-2 -mr-2" onClick={() => setMobileOpen((v) => !v)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} links={links} toggleButtonRef={toggleRef} />
    </header>
  );
}
