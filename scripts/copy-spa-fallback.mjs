#!/usr/bin/env node
// GitHub Pages has no server-side rewrites, so a direct load of a client-side
// route (e.g. /books/shadow-code) 404s. The standard workaround is to serve
// the same index.html as 404.html — GitHub Pages returns it for any unknown
// path, and React Router then takes over and renders the right page.
import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, '..', 'dist');

// scripts/prerender.mjs normally writes 404.html itself (from the empty app
// shell, before the homepage snapshot replaces dist/index.html). Only fall back
// to copying index.html if that didn't happen, e.g. when run on its own.
if (existsSync(resolve(dist, '404.html'))) {
  console.log('dist/404.html already present (written by prerender) - leaving it as the empty app shell.');
} else {
  copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
  console.log('Copied dist/index.html -> dist/404.html for GitHub Pages SPA fallback.');
}
