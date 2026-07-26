import { useEffect } from 'react';
import StructuredData from './StructuredData';
import { SITE_URL, canonicalPath } from '../lib/url';

interface SeoProps {
  title: string;
  description: string;
  /** Path such as "/books/offbeat-love", used to build the canonical/og:url. Defaults to the current path. */
  path?: string;
  /** Absolute or root-relative image URL for social previews. */
  image?: string;
  /** JSON-LD structured data object (e.g. a Book schema) to embed on this page. */
  jsonLd?: Record<string, unknown>;
  /** BCP-47 language of this page's main content — set to "hi" on Hindi book
   * pages. Updates <html lang>, which also drives the Devanagari font rules
   * in index.css. Defaults to "en". */
  lang?: 'en' | 'hi';
}

const DEFAULT_IMAGE = '/images/author/GM-Photo.jpg';

function setMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ title, description, path, image, jsonLd, lang = 'en' }: SeoProps) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;

    const url = SITE_URL + canonicalPath(path ?? window.location.pathname);
    const imageUrl = SITE_URL + (image ?? DEFAULT_IMAGE);

    setMetaByName('description', description);
    setCanonical(url);

    setMetaByProperty('og:title', title);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:url', url);
    setMetaByProperty('og:image', imageUrl);
    setMetaByProperty('og:type', 'website');

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', title);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', imageUrl);

    return () => {
      const def = document.querySelector('title[data-default]');
      const defMeta = document.querySelector('meta[name="description"][data-default]');
      if (def) document.title = def.textContent || 'Gaurav Mishra — Author';
      if (defMeta) setMetaByName('description', defMeta.getAttribute('content') || '');
      document.documentElement.lang = 'en';
    };
  }, [title, description, path, image, lang]);

  return jsonLd ? <StructuredData data={jsonLd} /> : null;
}
