export interface ReaderMagnet {
  interest: string;
  label: string;
  /** Only set when a real file/URL exists. Undefined = "prepared, not yet
   * real" — NewsletterForm only ever shows a download link when this is set,
   * so nothing not-yet-real is ever advertised to a visitor. */
  fileUrl?: string;
}

// One entry per newsletter interest. Do not add a fileUrl here until the
// actual resource exists — see the content safeguards in CLAUDE-session
// history: never invent or publicly advertise a resource that isn't real.
export const readerMagnets: ReaderMagnet[] = [
  { interest: 'Thrillers', label: 'thriller prequel' /* TODO_CONTENT: no real prequel file exists yet */ },
  { interest: 'Romance', label: 'romance bonus content' /* TODO_CONTENT: no real bonus content exists yet */ },
  { interest: 'Spiritual books', label: 'spiritual reading guide' /* TODO_CONTENT: no real guide exists yet */ },
  {
    interest: 'Writing resources',
    label: 'writing checklists',
    fileUrl: '/resources/manuscript-formatting-checklist.txt',
  },
  { interest: 'All updates', label: 'welcome resource' },
];

export function getReaderMagnet(interest: string | undefined): ReaderMagnet | undefined {
  return readerMagnets.find((m) => m.interest === interest);
}
