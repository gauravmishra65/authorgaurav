// Tracks in-flight page-data loads so main.tsx knows when the live app has
// rendered the same content the pre-rendered HTML already shows.
//
// Why this exists: every public route ships as a fully rendered static page
// (scripts/prerender.mjs), but the app then fetches its data client-side.
// Mounting React straight over that markup wipes the page, shows a loading
// state, then rebuilds it - on a throttled phone that was a 0.2-0.67 layout
// shift on most pages. Instead, main.tsx now keeps the static page on screen,
// renders the live app off-screen, and swaps the two in one step once this
// module reports the app has its data.

let inFlight = 0;

/** Called by useSupabaseData around each fetch; returns the "finished" callback. */
export function trackLoad(): () => void {
  inFlight++;
  let done = false;
  return () => {
    if (done) return;
    done = true;
    inFlight = Math.max(0, inFlight - 1);
  };
}

/**
 * Resolves once `container` has rendered a heading and no tracked load has
 * been in flight for a few consecutive checks - or after `timeoutMs`, so a
 * slow or failing data source can never leave the visitor on a
 * non-interactive snapshot indefinitely.
 */
export function whenAppReady(container: HTMLElement, timeoutMs = 4000): Promise<void> {
  return new Promise((resolve) => {
    const started = performance.now();
    let stable = 0;
    const timer = window.setInterval(() => {
      const ready = inFlight === 0 && container.querySelector('h1') !== null;
      stable = ready ? stable + 1 : 0;
      if (stable >= 3 || performance.now() - started > timeoutMs) {
        window.clearInterval(timer);
        resolve();
      }
    }, 50);
  });
}
