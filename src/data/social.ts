export interface SocialLink {
  label: string;
  href: string;
}

// YouTube has no real profile URL yet — kept here (rather than deleted) so
// its absence stays documented, not silently forgotten. getVerifiedSocialLinks()
// is the one place that excludes it; every consumer must go through that
// function rather than filtering `socialLinks` itself, so a real URL added
// here later shows up everywhere automatically and a future placeholder
// entry can never leak into the rendered page from a call site that forgot
// to filter (this happened twice already — see git history).
export const socialLinks: SocialLink[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/gauravmishrawrites/' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61591772941621' },
  { label: 'X', href: 'https://x.com/writetogetherh' },
  { label: 'YouTube', href: '#' }, // TODO: real link
];

export function getVerifiedSocialLinks(): SocialLink[] {
  return socialLinks.filter((s) => s.href && s.href !== '#');
}
