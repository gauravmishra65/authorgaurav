import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { whenAppReady } from './lib/appReady';
import './fonts.css';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root.childElementCount === 0 || (window as { __PRERENDER__?: boolean }).__PRERENDER__) {
  // Dev server, the pre-render capture itself (it sets __PRERENDER__), or any
  // un-prerendered route: nothing worth preserving is on screen, so render
  // straight into #root.
  createRoot(root).render(app);
} else {
  // A pre-rendered page is already painted. Leave it untouched while the live
  // app renders into a zero-height, clipped, invisible container (layout still
  // runs at full width), then swap the two in a single step once its data has
  // loaded, so the visitor never sees the page vanish and rebuild. If the
  // live app never reports ready, whenAppReady's timeout swaps it in anyway.
  const live = document.createElement('div');
  live.id = 'app';
  live.style.cssText = 'position:absolute;top:0;left:0;right:0;height:0;overflow:hidden;visibility:hidden';
  root.after(live);
  createRoot(live).render(app);
  whenAppReady(live).then(() => {
    live.removeAttribute('style');
    root.remove();
  });
}
