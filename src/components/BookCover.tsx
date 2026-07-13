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
  imageWidth?: number;
  imageHeight?: number;
  href?: string;
  external?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Set for the one above-the-fold cover (e.g. the hero) so it isn't lazy-loaded. */
  priority?: boolean;
}

const pixelSizes = {
  sm: { w: 150, h: 225 },
  md: { w: 200, h: 300 },
  lg: { w: 240, h: 360 },
};

export default function BookCover({
  title, titleHtml, author, tagline, gradient, textOnDark = true,
  imageSrc, imageWidth, imageHeight, href, external = false, size = 'md', priority = false,
}: BookCoverProps) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: 'w-[150px] h-[225px]',
    // Shrinks to fit narrow multi-column grids (e.g. the 2-up mobile bookshelf)
    // before growing to its full size once the grid gives it more room.
    md: 'w-[110px] h-[165px] sm:w-[160px] sm:h-[240px] lg:w-[200px] lg:h-[300px]',
    lg: 'w-[240px] h-[360px]',
  };

  const inner = (
    <div className={`book-tilt relative ${sizes[size]} rounded-md shadow-book overflow-hidden border border-black/10 flex-shrink-0 bg-gradient-to-br ${gradient}`}>
      {imageSrc && !imgError ? (
        <img
          src={imageSrc}
          alt={`${title} book cover`}
          width={imageWidth ?? pixelSizes[size].w}
          height={imageHeight ?? pixelSizes[size].h}
          className="w-full h-full object-contain object-center"
          onError={() => setImgError(true)}
          loading={priority ? 'eager' : 'lazy'}
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
