/** Lalita Sahasranama's page-specific atmosphere layer: a faint concentric
 * mandala/lotus-line motif in one corner, a thin double-line "manuscript
 * border" inset from the hero's edge, and fine gold hairline accents — all
 * static, low-opacity, decorative only. Abstract geometric line art, not
 * imagery, so it never competes with or substitutes for the real approved
 * cover. No animation, so there's nothing for prefers-reduced-motion to need
 * to disable; the site's existing .bg-grain class (already applied to the
 * hero) covers the "handmade paper texture" cue, so it isn't duplicated. */
export default function LalitaBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Manuscript border: a thin double line inset from the section edge */}
      <div className="absolute inset-3 md:inset-5 border border-[#8E2E36]/[0.12]" />
      <div className="absolute inset-4 md:inset-6 border border-[#B88B45]/[0.14]" />

      {/* Concentric mandala / lotus-geometry motif, lower-right corner */}
      <svg
        className="absolute -bottom-8 -right-8 w-56 h-56 opacity-[0.10]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="90" stroke="#B88B45" strokeWidth="1" />
        <circle cx="100" cy="100" r="65" stroke="#C98A91" strokeWidth="1" />
        <circle cx="100" cy="100" r="40" stroke="#B88B45" strokeWidth="1" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const x1 = 100 + 40 * Math.cos(angle);
          const y1 = 100 + 40 * Math.sin(angle);
          const x2 = 100 + 90 * Math.cos(angle);
          const y2 = 100 + 90 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C98A91" strokeWidth="0.75" />;
        })}
      </svg>

      {/* Fine gold divider hairline, upper-left */}
      <div className="absolute top-10 left-10 w-16 h-px bg-[#B88B45]/20" />
      <div className="absolute top-10 left-10 w-px h-16 bg-[#B88B45]/20" />
    </div>
  );
}
