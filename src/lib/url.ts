export const SITE_URL = 'https://authorgaurav.com';

/** Canonicalizes an internal path to the trailing-slash form GitHub Pages
 * actually serves with a direct 200 (scripts/prerender.mjs writes
 * dist/<route>/index.html for every route, and GitHub Pages requires the
 * trailing slash to reach that file without a 301 redirect first). Used
 * everywhere a full authorgaurav.com URL is built — canonical tags, og:url,
 * breadcrumb/structured-data URLs, and social-share links — so all of them
 * agree with each other and with the sitemap. */
export function canonicalPath(path: string): string {
  if (path === '/' || path === '') return '/';
  return `${path.replace(/\/+$/, '')}/`;
}

/** Full https://authorgaurav.com/... URL for an internal path, trailing-slash
 * normalized. */
export function canonicalUrl(path: string): string {
  return `${SITE_URL}${canonicalPath(path)}`;
}
