import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { activeAnnouncement } from '../data/announcement';

export default function AnnouncementBar() {
  if (!activeAnnouncement) return null;

  return (
    <div className="bg-ink text-ivory text-2xs sm:text-xs">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-2 text-center">
        <span className="text-ivory/85">{activeAnnouncement.message}</span>
        <Link to={activeAnnouncement.ctaHref} className="label-caps inline-flex items-center gap-1 text-gold-lt hover:text-gold transition-colors whitespace-nowrap">
          {activeAnnouncement.ctaLabel} <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
