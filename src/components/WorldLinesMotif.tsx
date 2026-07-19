interface WorldLinesMotifProps {
  className?: string;
}

/**
 * An abstract "connected worlds" line-art motif — arcing routes between a
 * few points over a horizon curve. Deliberately not a literal geographic
 * map (avoids a cartographic/corporate feel and map-licensing questions);
 * reads more like a constellation or flight-path sketch, echoing "stories
 * across worlds" without competing with the foreground text.
 */
export default function WorldLinesMotif({ className = '' }: WorldLinesMotifProps) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${className}`}
      viewBox="0 0 800 500"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <circle cx="400" cy="250" r="230" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <ellipse cx="400" cy="250" rx="230" ry="90" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <ellipse cx="400" cy="250" rx="230" ry="150" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M170 250 Q400 120 630 250" stroke="currentColor" strokeWidth="1" strokeDasharray="1 7" opacity="0.7" />
      <path d="M230 140 Q460 320 610 200" stroke="currentColor" strokeWidth="1" strokeDasharray="1 7" opacity="0.7" />
      <path d="M210 330 Q420 200 590 340" stroke="currentColor" strokeWidth="1" strokeDasharray="1 7" opacity="0.7" />
      <g fill="currentColor" opacity="0.85">
        <circle cx="170" cy="250" r="3" />
        <circle cx="630" cy="250" r="3" />
        <circle cx="230" cy="140" r="3" />
        <circle cx="610" cy="200" r="3" />
        <circle cx="210" cy="330" r="3" />
        <circle cx="590" cy="340" r="3" />
        <circle cx="400" cy="250" r="3" />
      </g>
    </svg>
  );
}
