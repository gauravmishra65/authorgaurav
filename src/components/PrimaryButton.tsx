import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface BaseProps {
  size?: 'sm' | 'md';
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler;
  'aria-label'?: string;
}

type PrimaryButtonProps =
  | (BaseProps & { to: string; href?: never; external?: never })
  | (BaseProps & { href: string; to?: never; external?: boolean })
  | (BaseProps & { to?: never; href?: never; type?: 'button' | 'submit'; disabled?: boolean });

const sizeClasses = { sm: 'px-5 py-2.5 text-2xs', md: 'px-6 py-3 text-sm' };

/** The site's gold-gradient call-to-action button, formalized as a component
 * — renders a router Link (to), a plain anchor (href, optionally external),
 * or a <button> (neither), so it drops in wherever .btn-gold used to be
 * typed by hand across pages. */
export default function PrimaryButton(props: PrimaryButtonProps) {
  const { size = 'md', className = '', children } = props;
  const classes = `btn-caps btn-gold inline-flex items-center gap-2 rounded-sm ${sizeClasses[size]} ${className}`;

  if ('to' in props && props.to) {
    return <Link to={props.to} className={classes} onClick={props.onClick} aria-label={props['aria-label']}>{children}</Link>;
  }
  if ('href' in props && props.href) {
    const externalProps = props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return <a href={props.href} className={classes} onClick={props.onClick} aria-label={props['aria-label']} {...externalProps}>{children}</a>;
  }
  return (
    <button
      type={'type' in props ? props.type ?? 'button' : 'button'}
      disabled={'disabled' in props ? props.disabled : undefined}
      className={classes}
      onClick={props.onClick}
      aria-label={props['aria-label']}
    >
      {children}
    </button>
  );
}
