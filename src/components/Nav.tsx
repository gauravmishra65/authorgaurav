import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SocialLinks from './SocialLinks';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Books', to: '/books' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'WriteTogetherHub', to: '/write-together-hub' },
  { label: 'Contact', to: '/contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const [lastPathname, setLastPathname] = useState(location.pathname);
  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ivory/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(199,154,62,0.25)]' : 'bg-ivory/60 backdrop-blur-sm'}`}>
      <div className="hairline-solid w-full opacity-60" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="font-display text-xl tracking-tight text-ink" aria-label="Gaurav Mishra — home">
          Gaurav<span className="text-gold">Mishra</span>
        </Link>

        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={`label-caps transition-colors hover:text-gold ${location.pathname === l.to ? 'text-gold' : 'text-text/80'}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-5">
          <SocialLinks size={15} className="hidden lg:flex" iconClassName="text-text/50 hover:text-gold transition-colors" />
          <a href="#free-chapter" className="btn-caps btn-gold rounded-sm px-4 py-2 text-2xs">Free Chapter</a>
        </div>

        <button className="md:hidden text-ink p-2 -mr-2" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${open ? 'max-h-96' : 'max-h-0'}`}>
        <ul className="flex flex-col gap-1 px-6 pb-5 pt-1 bg-ivory/95 backdrop-blur-md">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={`label-caps block py-2.5 border-b border-gold/15 ${location.pathname === l.to ? 'text-gold' : 'text-text/80'}`}>
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-3">
            <a href="#free-chapter" className="btn-caps btn-gold inline-block rounded-sm px-4 py-2 text-2xs">Free Chapter</a>
          </li>
          <li className="pt-4">
            <SocialLinks size={17} iconClassName="text-text/60 hover:text-gold transition-colors" />
          </li>
        </ul>
      </div>
    </header>
  );
}
