import { useEffect, useRef, type RefObject } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import SocialLinks from './SocialLinks';

interface NavLink {
  label: string;
  to: string;
}

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  toggleButtonRef: RefObject<HTMLButtonElement>;
}

/** Accessible mobile drawer: role="dialog", focus enters on open and is
 * trapped within the panel, Escape closes and returns focus to the toggle
 * button, background scroll is locked while open, and the panel is fully
 * out of the tab order (visibility:hidden, not just clipped) while closed. */
export default function MobileNavigation({ open, onClose, links, toggleButtonRef }: MobileNavigationProps) {
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;

    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>('a, button'));
    focusables()[0]?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        toggleButtonRef.current?.focus();
        return;
      }
      if (e.key === 'Tab') {
        const list = focusables();
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    panel.addEventListener('keydown', onKeyDown);
    return () => {
      panel.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, toggleButtonRef]);

  const closeAndReturnFocus = () => {
    onClose();
    toggleButtonRef.current?.focus();
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal={open ? true : undefined}
      aria-hidden={!open}
      aria-label="Site navigation"
      className={`mobile-nav-panel lg:hidden ${open ? 'is-open' : ''}`}
    >
      <ul className="flex flex-col gap-1 px-6 pb-5 pt-1 bg-charcoal/98 backdrop-blur-md">
        <li className="flex justify-end pb-1">
          <button onClick={closeAndReturnFocus} className="nav-caps inline-flex items-center gap-1.5 text-ivory/70 hover:text-gold-lt transition-colors py-2.5 px-1 -mr-1" aria-label="Close menu">
            <X size={18} /> Close
          </button>
        </li>
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className={`nav-caps block py-3.5 border-b border-gold/15 ${location.pathname === l.to ? 'text-gold-lt' : 'text-ivory/75'}`}>
              {l.label}
            </Link>
          </li>
        ))}
        <li className="pt-3">
          <Link to="/books/the-shadow-code" className="btn-caps btn-gold inline-block rounded-sm px-4 py-2.5 text-2xs">Explore Latest Book</Link>
        </li>
        <li className="pt-4">
          <SocialLinks size={17} iconClassName="text-ivory/60 hover:text-gold-lt transition-colors" />
        </li>
      </ul>
    </div>
  );
}
