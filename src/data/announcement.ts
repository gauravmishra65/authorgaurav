export interface Announcement {
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

// Set to an Announcement object to show the site-wide announcement bar.
// Shadow Code (English and Hindi) are both live now, so the pre-release
// countdown announcement is retired.
export const activeAnnouncement: Announcement | null = null;
