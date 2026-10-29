import Seo from '../components/Seo';
import JyotishSection from '../components/jyotish/JyotishSection';
import { APP, copy } from '../data/gauravJyotish';
import { SITE_URL, canonicalUrl } from '../lib/url';

// SoftwareApplication schema. `offers` is deliberately absent until the full
// version has a real published price; `installUrl` appears once there is a
// Google Play link.
function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP.fullName,
    alternateName: APP.hindiName,
    operatingSystem: 'Android',
    applicationCategory: 'LifestyleApplication',
    description: APP.seoDescription,
    url: canonicalUrl(APP.path),
    image: `${SITE_URL}${APP.iconLarge}`,
    inLanguage: ['en', 'hi'],
    author: { '@type': 'Person', name: 'Gaurav Mishra', url: canonicalUrl('/about') },
    featureList: copy.en.features.items.map((f) => f.title),
    ...(APP.playStoreUrl ? { installUrl: APP.playStoreUrl } : {}),
  };
}

export default function GauravJyotish() {
  return (
    <>
      <Seo title={APP.seoTitle} description={APP.seoDescription} path={APP.path} image={APP.ogImage} jsonLd={buildJsonLd()} />
      <JyotishSection copy={copy.en} headingLevel="h1" />
      <JyotishSection copy={copy.hi} headingLevel="h2" />
    </>
  );
}
