import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface TextLinkProps {
  to?: string;
  href?: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

/** Formalizes the "label-caps text-gold-text hover:text-ink transition-colors"
 * inline link pattern repeated across nearly every page. */
export default function TextLink({ to, href, external, className = '', children }: TextLinkProps) {
  const classes = `label-caps text-gold-text hover:text-ink transition-colors ${className}`;
  if (to) return <Link to={to} className={classes}>{children}</Link>;
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return <a href={href} className={classes} {...externalProps}>{children}</a>;
}
