import { useEffect } from 'react';

interface SeoProps { title: string; description: string; }

export default function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
    return () => {
      const def = document.querySelector('title[data-default]');
      const defMeta = document.querySelector('meta[name="description"][data-default]');
      if (def) document.title = def.textContent || 'Gaurav Mishra — Author';
      if (defMeta) meta?.setAttribute('content', defMeta.getAttribute('content') || '');
    };
  }, [title, description]);
  return null;
}
