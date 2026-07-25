import type { ReactNode } from 'react';

interface PageContainerProps {
  /** "wide" for the standard 6xl content width, "narrow" for prose-width text blocks. */
  size?: 'wide' | 'narrow';
  className?: string;
  children: ReactNode;
}

const widths = { wide: 'max-w-6xl', narrow: 'max-w-prose' };

export default function PageContainer({ size = 'wide', className = '', children }: PageContainerProps) {
  return <div className={`mx-auto ${widths[size]} px-6 ${className}`}>{children}</div>;
}
