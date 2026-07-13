import { Link } from 'react-router-dom';
import { useState } from 'react';

interface BookCoverProps {
  id: string;
  title: string;
  titleHtml?: string;
  author: string;
  tagline?: string;
  gradient: string;
  textOnDark?: boolean;
  imageSrc?: string;
  href?: string;
  external?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function BookCover({
  title, titleHtml, author, tagline, gradient, textOnDark = true,
  imageSrc, href, external = false, size = 'md',
}: BookCoverProps) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: 'w-[150px] h-[225px]',
    md: 'w-[200px] h-[300px]',
    lg: 'w-[240px] h-[360px]',
  };

  const inner = (
    <div className={`book-tilt relative ${sizes[size]} rounded-md shadow-book overflow-hidden border border-black/10 flex-shrink-0`}>
      {imageSrc && !imgError ? (
        <img
          src={imageSrc}
          alt={`${title} book cover`}
          className="w-full h-full object-cover object-center"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-between p-4 text-center`}>
          <div className={`pointer-events-none absolute inset-2 rounded-sm border ${textOnDark ? 'border-gold-lt/40' : 'border-ink/15'}`} />
          <div className="mt-4 w-12 hairline-solid" />
          <div className="flex-1 flex flex-col items-center justify-center gap-2 px-2">
            <h3
              className={`font-display font-medium leading-tight text-base ${textOnDark ? 'text-ivory' : 'text-ink'}`}
              dangerouslySetInnerHTML={{ __html: titleHtml || title }}
            />
            {tagline && (
              <p className={`font-body italic text-[0.7rem] leading-snug ${textOnDark ? 'text-gold-lt/90' : 'text-ink/70'} line-clamp-2`}>
                {tagline}
              </p>
            )}
          </div>
          <div className="mb-3 w-10 hairline-solid" />
          <p className={`label-caps mb-2 ${textOnDark ? 'text-gold-lt/85' : 'text-ink/65'}`}>{author}</p>
        </div>
      )}
    </div>
  );

  if (!href) return inner;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${title} — book website`} className="inline-block">
        {inner}
      </a>
    );
  }

  return (
    <Link to={href} aria-label={`${title} — view details`} className="inline-block">
      {inner}
    </Link>
  );
}
