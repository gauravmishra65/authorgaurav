import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PhoneFrame from './PhoneFrame';
import { screenshots, type JyotishCopy } from '../../data/gauravJyotish';

interface ScreenshotGalleryProps {
  copy: JyotishCopy;
}

/** A swipeable row of phone screenshots (CSS scroll-snap, so touch swiping
 * needs no script). The scroller is its own keyboard-focusable region, and
 * previous/next buttons appear from tablet width up, but only when there is
 * actually more to scroll to. The scroll container clips its own overflow, so
 * the page itself never scrolls sideways. */
export default function ScreenshotGallery({ copy }: ScreenshotGalleryProps) {
  const { lang, screenshots: text } = copy;
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, []);

  const move = (direction: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const buttonClass =
    'inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#36207a]/30 text-[#36207a] transition-colors hover:bg-[#36207a]/10 disabled:opacity-35 disabled:hover:bg-transparent';

  return (
    <div>
      <div className="mb-4 hidden min-h-12 items-center justify-end gap-3 md:flex">
        {(canPrev || canNext) && (
          <>
            <button type="button" onClick={() => move(-1)} disabled={!canPrev} aria-label={text.prev} className={buttonClass}>
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => move(1)} disabled={!canNext} aria-label={text.next} className={buttonClass}>
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <div
        ref={scroller}
        role="region"
        aria-label={text.region}
        tabIndex={0}
        className="jy-scroller flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#36207a]"
      >
        {screenshots.map((shot) => (
          <figure key={shot.key} className="w-[62%] shrink-0 snap-center min-[480px]:w-56">
            <PhoneFrame shot={shot} lang={lang} placeholder={text.placeholder} />
            <figcaption className="mt-3 text-center text-sm text-muted">{shot.label[lang]}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
