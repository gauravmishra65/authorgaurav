import { useEffect } from 'react';

interface StructuredDataProps {
  /** A JSON-LD object or @graph payload, e.g. a Book or BreadcrumbList schema. */
  data: Record<string, unknown>;
}

/** Injects a <script type="application/ld+json"> for the lifetime of the
 * mounted component, removing it on unmount. Standalone so it can be reused
 * outside Seo/page-level metadata (e.g. an Organization schema) as well as
 * from within it. */
export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => script.remove();
  }, [data]);

  return null;
}
