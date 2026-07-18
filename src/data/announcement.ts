export interface Announcement {
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

// Set to null to hide the site-wide announcement bar.
export const activeAnnouncement: Announcement | null = {
  message: 'The Shadow Code arrives 31 July 2026 — a new thriller from Gaurav Mishra.',
  ctaLabel: 'Discover the Book',
  ctaHref: '/books/the-shadow-code',
};
