import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import AnnouncementBar from './AnnouncementBar';

// A near-invisible fallback for code-split public routes — real pages load
// fast enough that a branded spinner would just flash; a blank frame for a
// beat reads better than a loading flicker. Nav/Footer stay mounted around
// it, so only the routed page content itself suspends.
function PageFallback() {
  return <div className="min-h-[60vh]" aria-hidden="true" />;
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-dialog focus:top-3 focus:left-3 focus:rounded-sm focus:bg-ivory focus:px-4 focus:py-2 focus:label-caps focus:text-ink focus:shadow-luxury"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <AnnouncementBar />
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
