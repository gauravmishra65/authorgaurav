import type { ReactNode } from 'react';
import PageContainer from './PageContainer';

interface SectionProps {
  /** "light" is the default ivory page background, "dark" is the navy/grain
   * treatment used for hero/feature bands, "cream" is the softer card-like
   * surface used for testimonials/synopsis-style sections. */
  tone?: 'light' | 'dark' | 'cream';
  containerSize?: 'wide' | 'narrow';
  className?: string;
  /** Optional anchor id, e.g. for a same-page deep link like /media#media-kit. */
  id?: string;
  children: ReactNode;
}

const toneClasses = {
  light: '',
  dark: 'bg-ink bg-grain text-ivory',
  cream: 'bg-cream',
};

export default function Section({ tone = 'light', containerSize = 'wide', className = '', id, children }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-20 ${toneClasses[tone]} ${className}`}>
      {tone === 'dark' && <div className="hairline-solid w-full opacity-30" />}
      <PageContainer size={containerSize} className="py-16 md:py-20">
        {children}
      </PageContainer>
    </section>
  );
}
