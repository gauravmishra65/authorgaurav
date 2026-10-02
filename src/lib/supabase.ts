import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Never throw here — a missing env var must not blank the entire app.
  // Individual queries below fail gracefully instead (see useSupabaseData).
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — see .env.example. Content, forms, and /admin will not work until these are set.');
}

type PrefetchStore = Record<string, Promise<Response>>;
type PrefetchWindow = { __prefetch?: PrefetchStore; __prefetchAt?: number };

// Reads that are still "page-load fresh" can share the early response; later
// ones (client-side navigation, a long-open tab) always fetch fresh data.
const PREFETCH_TTL_MS = 15_000;

// Pre-rendered pages (scripts/prerender.mjs) start their Supabase GET requests
// from a tiny inline script in <head>, before this bundle has even downloaded,
// and park the in-flight responses on window.__prefetch. While the page is
// still fresh, any anonymous GET for exactly the same URL gets a clone of that
// response instead of starting another request - the data is typically already
// here by the time the app runs, and components that ask for the same list
// (the nav and the page both want the books) share one request. Anything that
// doesn't match (different URL, a write, a signed-in admin session, an old
// page) goes through the normal fetch, and a failed prefetch falls back to a
// fresh request, so this can only save time, never change what is shown.
function prefetchAwareFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const w = typeof window !== 'undefined' ? (window as unknown as PrefetchWindow) : undefined;
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const pending = w?.__prefetch?.[url];
  const fresh = w?.__prefetchAt !== undefined && Date.now() - w.__prefetchAt < PREFETCH_TTL_MS;
  const anonymousGet =
    (init?.method ?? 'GET').toUpperCase() === 'GET' &&
    new Headers(init?.headers).get('authorization') === `Bearer ${supabaseAnonKey}`;
  if (pending && fresh && anonymousGet) {
    return pending.then((res) => (res.ok ? res.clone() : fetch(input, init)), () => fetch(input, init));
  }
  return fetch(input, init);
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.invalid',
  supabaseAnonKey || 'placeholder-anon-key',
  { global: { fetch: prefetchAwareFetch } },
);

export const CONTACT_FORM_ENDPOINT = `${supabaseUrl ?? ''}/functions/v1/contact-form`;
export const NEWSLETTER_ENDPOINT = `${supabaseUrl ?? ''}/functions/v1/newsletter-subscribe`;
export const SUPABASE_ANON_KEY = supabaseAnonKey ?? '';
