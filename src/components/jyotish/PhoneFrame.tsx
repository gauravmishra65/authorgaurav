import type { JyotishScreenshot, Lang } from '../../data/gauravJyotish';

interface PhoneFrameProps {
  shot: JyotishScreenshot;
  lang: Lang;
  /** Shown on the 9:16 placeholder while the real screenshot has not been added. */
  placeholder: string;
  className?: string;
  /** Above-the-fold frames load eagerly; everything else is lazy. */
  eager?: boolean;
}

/** One phone-shaped 9:16 frame: the real screenshot when `shot.src` is set,
 * otherwise a labelled placeholder that holds the same space (so adding the
 * image later cannot shift the layout). */
export default function PhoneFrame({ shot, lang, placeholder, className = '', eager = false }: PhoneFrameProps) {
  return (
    <div className={`jy-phone aspect-[9/16] ${className}`}>
      {shot.src ? (
        <img
          src={shot.src}
          alt={shot.alt[lang]}
          width={shot.width ?? 360}
          height={shot.height ?? 640}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={`${shot.alt[lang]}. ${placeholder}`}
          className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-b from-[#36207a]/70 to-[#0e0a2e] px-4 text-center"
        >
          <span className="font-display text-lg text-[#f6b347]">{shot.label[lang]}</span>
          <span className="text-sm text-[#f7f3ec]/80">{placeholder}</span>
        </div>
      )}
    </div>
  );
}
