import { supabase } from './supabase';

/** Flat, present-tense naming convention: noun_verb. Every event tracked on
 * the site is listed here — see docs/newsletter-and-analytics.md for the
 * full reference (what fires each one, and what properties it carries). */
export type AnalyticsEvent =
  | 'homepage_cta_click'
  | 'book_view'
  | 'retailer_click'
  | 'amazon_click'
  | 'sample_download'
  | 'trailer_play'
  | 'newsletter_signup'
  | 'contact_submit'
  | 'media_kit_download'
  | 'discussion_guide_download'
  | 'event_registration_click'
  | 'writetogetherhub_click'
  | 'interview_resource_click';

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

const FORBIDDEN_KEY_PATTERN = /email|name|message|password|token/i;

/** Strips any property whose key looks like it could hold PII — belt and
 * suspenders against a future call site accidentally passing an email or
 * message body as a "property". This function only ever accepts small,
 * categorical values (a retailer name, a source label, an enquiry type). */
function sanitize(properties?: AnalyticsProperties): AnalyticsProperties | undefined {
  if (!properties) return undefined;
  const clean: AnalyticsProperties = {};
  for (const [key, value] of Object.entries(properties)) {
    if (FORBIDDEN_KEY_PATTERN.test(key)) continue;
    clean[key] = value;
  }
  return clean;
}

/** Fire-and-forget analytics: logs first-party to Supabase (no cookies, no
 * PII, nothing sold or shared) and, only if a real analytics script happens
 * to already be loaded on the page (feature-detected, never assumed), also
 * forwards to it — so wiring in Plausible/GA4 later needs zero call-site
 * changes. Never throws; a failure here must never break the UI. */
export function trackEvent(name: AnalyticsEvent, properties?: AnalyticsProperties): void {
  const clean = sanitize(properties);

  supabase
    .from('authorgaurav_analytics_events')
    .insert({
      event_name: name,
      properties: clean ?? null,
      path: typeof window !== 'undefined' ? window.location.pathname : null,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
    })
    .then(
      () => {},
      () => {},
    );

  const plausible = (window as unknown as { plausible?: (event: string, opts?: { props?: AnalyticsProperties }) => void }).plausible;
  if (typeof plausible === 'function') plausible(name, { props: clean });

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, clean);
}
