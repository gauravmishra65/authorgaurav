import { getVerifiedSocialLinks } from '../data/social';
import { AUTHOR_SHORT_BIO, AUTHOR_PORTRAIT_PATH, AUTHOR_OWNED_SITES } from '../data/author';
import { SITE_URL, canonicalUrl } from '../lib/url';

/** The single Person node for Gaurav Mishra as an entity — reused wherever a
 * page needs to describe the author (not to be confused with the minimal
 * `{ '@type': 'Person', name }` used as the `author` of a Book/Event/
 * BlogPosting, which only attributes authorship of that one item). Returns
 * the bare node (no `@context`) so callers can drop it into their own
 * `@graph` array alongside a WebPage/WebSite/Breadcrumb node. */
export function buildPersonStructuredData(): Record<string, unknown> {
  return {
    '@type': 'Person',
    name: 'Gaurav Mishra',
    url: canonicalUrl('/about'),
    image: `${SITE_URL}${AUTHOR_PORTRAIT_PATH}`,
    jobTitle: 'Author',
    description: AUTHOR_SHORT_BIO,
    sameAs: [...AUTHOR_OWNED_SITES, ...getVerifiedSocialLinks().map((s) => s.href)],
  };
}
