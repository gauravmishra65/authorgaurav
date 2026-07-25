/** Vishnu Sahasranama's page-specific atmosphere layer: a deep-blue "sacred
 * atmosphere" glow, a chakra motif (a circle with radiating spokes, evoking
 * Vishnu's discus rather than Lalita's lotus mandala), a restrained conch-
 * shell spiral line, and a thin gold + peacock-blue manuscript border —
 * all static, low-opacity, decorative only. Deliberately distinct in mood
 * from LalitaBackground's warm gold/pink lotus geometry: this one is cool
 * and blue. No animation, so there's nothing for prefers-reduced-motion to
 * need to disable; .bg-grain (already on the hero) covers the paper-texture
 * cue, so it isn't duplicated here. */
export default function VishnuBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep-blue sacred atmosphere glow */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(ellipse 60% 55% at 88% 92%, rgba(23,58,99,0.16), transparent 65%)' }}
      />

      {/* Manuscript-style border: gold + peacock blue, no red */}
      <div className="absolute inset-3 md:inset-5 border border-[#326A78]/[0.14]" />
      <div className="absolute inset-4 md:inset-6 border border-[#B88B45]/[0.14]" />

      {/* Chakra motif: circle with radiating spokes, lower-right corner */}
      <svg className="absolute -bottom-6 -right-6 w-52 h-52 opacity-[0.10]" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="70" stroke="#B88B45" strokeWidth="1" />
        <circle cx="100" cy="100" r="8" stroke="#B88B45" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const x1 = 100 + 12 * Math.cos(angle);
          const y1 = 100 + 12 * Math.sin(angle);
          const x2 = 100 + 70 * Math.cos(angle);
          const y2 = 100 + 70 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#326A78" strokeWidth="0.75" />;
        })}
      </svg>

      {/* Restrained conch-shell spiral, upper-left corner */}
      <svg className="absolute top-8 left-8 w-20 h-20 opacity-[0.09]" viewBox="0 0 100 100" fill="none" stroke="#173A63" strokeWidth="1.2" strokeLinecap="round">
        <path d="M70 50 C 70 36, 58 26, 44 28 C 30 30, 22 42, 26 54 C 30 66, 44 72, 54 66 C 62 61, 64 51, 58 46 C 53 42, 47 45, 47 51" />
      </svg>
    </div>
  );
}
