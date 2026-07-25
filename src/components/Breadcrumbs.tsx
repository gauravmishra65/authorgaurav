import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/** Visual counterpart to the BreadcrumbList JSON-LD already emitted per-page
 * via Seo's jsonLd prop — keeps the two in sync since they should list the
 * same trail. */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 label-caps text-2xs">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link to={item.href} className="opacity-70 hover:opacity-100 transition-opacity">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="opacity-70">
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight size={12} aria-hidden="true" className="opacity-50" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
