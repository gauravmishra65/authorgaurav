import { useState } from 'react';
import { Facebook, Linkedin, MessageCircle, Link2, Check } from 'lucide-react';

interface SocialShareButtonsProps {
  /** Root-relative path, e.g. "/books/the-shadow-code". Resolved against the current origin. */
  path: string;
  title: string;
  className?: string;
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function SocialShareButtons({ path, title, className = '' }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}${path}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: 'Share on Facebook', Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'Share on LinkedIn', Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: 'Share on X', Icon: XIcon, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: 'Share on WhatsApp', Icon: MessageCircle, href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}` },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold-lt hover:border-gold hover:text-gold transition-colors"
        >
          <Icon size={16} />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold-lt hover:border-gold hover:text-gold transition-colors"
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'Link copied to clipboard' : ''}</span>
    </div>
  );
}
