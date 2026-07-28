export interface Announcement {
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

// Set to null to hide the site-wide announcement bar.
export const activeAnnouncement: Announcement | null = {
  message: 'The Shadow Code available in Hindi & English - a new thriller from Gaurav Mishra.',
  ctaLabel: 'Discover the Book',
  ctaHref: '/books/the-shadow-code',
};
