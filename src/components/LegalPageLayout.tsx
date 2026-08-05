import type { ReactNode } from 'react';
import Seo from './Seo';
import PageContainer from './PageContainer';
import LegalReviewNote from './LegalReviewNote';

interface LegalPageLayoutProps {
  title: string;
  seoDescription: string;
  path: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalPageLayout({ title, seoDescription, path, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <>
      <Seo title={`${title} | Gaurav Mishra`} description={seoDescription} path={path} />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <PageContainer size="narrow" className="py-14 text-center">
          <p className="eyebrow text-gold-lt mb-4">Legal</p>
          <h1 className="font-display text-3xl md:text-4xl mb-3">{title}</h1>
          <p className="text-2xs text-ivory/60 label-caps">Last updated {lastUpdated}</p>
        </PageContainer>
      </section>

      <PageContainer size="narrow" className="py-16">
        <LegalReviewNote />
        <div className="prose-literary space-y-6">{children}</div>
      </PageContainer>
    </>
  );
}
