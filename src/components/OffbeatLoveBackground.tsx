/** Offbeat Love's page-specific atmosphere layer: a warm "evening light" glow
 * in one corner, a single thin diagonal line evoking distance and connection
 * between two worlds, and a restrained single-line botanical accent in the
 * opposite corner — all static, low-opacity, decorative only. No animation
 * by default, so there's nothing for prefers-reduced-motion to need to
 * disable; the site's existing .bg-grain class (already applied to the hero)
 * covers the "fine paper texture" cue, so it isn't duplicated here. */
export default function OffbeatLoveBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            // Warm evening light, soft gold, lower-left corner
            'radial-gradient(ellipse 65% 55% at 12% 92%, rgba(194,160,106,0.22), transparent 65%)',
            // A single thin diagonal "connection" line between two distant points, in terracotta
            'linear-gradient(115deg, transparent 46%, rgba(183,103,87,0.14) 49.5%, rgba(183,103,87,0.14) 50.5%, transparent 54%)',
          ].join(', '),
        }}
      />
      <svg
        className="absolute bottom-4 right-4 w-28 h-28 opacity-[0.08]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#672F3A"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        <path d="M10 90 C 25 70, 20 45, 40 30 C 55 18, 70 22, 82 10" />
        <path d="M40 30 C 45 22, 55 20, 58 26" />
        <path d="M55 45 C 60 38, 70 37, 72 44" />
        <path d="M28 60 C 33 53, 43 52, 45 59" />
      </svg>
    </div>
  );
}
