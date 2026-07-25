/** Shadow Code's page-specific atmosphere layer: a faint technical grid, a
 * single soft red glow (evoking a security alert without flashing), and a
 * thin diagonal "data path" line — all static, low-opacity, decorative only.
 * No animation by default, so there's nothing for prefers-reduced-motion to
 * need to disable; it's inherently safe and avoids the "busy dashboard" /
 * "neon overload" look the brief explicitly warns against. */
export default function ShadowCodeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        backgroundImage: [
          // Faint technical grid
          'linear-gradient(rgba(53,120,168,0.07) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(53,120,168,0.07) 1px, transparent 1px)',
          // A single thin diagonal "data path" line
          'linear-gradient(115deg, transparent 48%, rgba(53,120,168,0.12) 49%, rgba(53,120,168,0.12) 50%, transparent 51%)',
          // Soft, controlled red glow in one corner — a security-alert cue, not a flashing warning
          'radial-gradient(ellipse 60% 55% at 85% 10%, rgba(197,42,53,0.14), transparent 65%)',
        ].join(', '),
        backgroundSize: '32px 32px, 32px 32px, 100% 100%, 100% 100%',
      }}
    />
  );
}
