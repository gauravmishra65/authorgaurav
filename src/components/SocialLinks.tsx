import { Instagram, Facebook, Youtube } from 'lucide-react';
import { socialLinks } from '../data/social';

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const icons: Record<string, (props: { size?: number }) => JSX.Element> = {
  Instagram: ({ size }) => <Instagram size={size} />,
  Facebook: ({ size }) => <Facebook size={size} />,
  X: ({ size }) => <XIcon size={size} />,
  YouTube: ({ size }) => <Youtube size={size} />,
};

interface SocialLinksProps {
  size?: number;
  className?: string;
  iconClassName?: string;
}

export default function SocialLinks({
  size = 18,
  className = '',
  iconClassName = 'text-ivory/70 hover:text-gold transition-colors',
}: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.map((s) => {
        const Icon = icons[s.label];
        return (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={iconClassName}>
            {Icon ? <Icon size={size} /> : s.label}
          </a>
        );
      })}
    </div>
  );
}
