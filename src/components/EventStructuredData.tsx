import type { AuthorEvent } from '../data/events';
import { SITE_URL, canonicalUrl } from '../lib/url';

/** Builds Event JSON-LD for a list of events — pass only genuine, real
 * upcoming events (never past ones or placeholders). Returns undefined when
 * the list is empty so callers can skip rendering StructuredData entirely
 * rather than emitting an empty @graph. */
export function buildEventStructuredData(events: AuthorEvent[]): Record<string, unknown> | undefined {
  if (events.length === 0) return undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': events.map((event) => ({
      '@type': 'Event',
      name: event.title,
      description: event.description,
      startDate: event.eventDate,
      eventAttendanceMode: event.mode === 'Online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : event.mode === 'Hybrid'
          ? 'https://schema.org/MixedEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: event.mode === 'Online'
        ? { '@type': 'VirtualLocation', url: event.registrationUrl ?? SITE_URL }
        : { '@type': 'Place', name: event.location ?? 'To be announced' },
      organizer: { '@type': 'Person', name: 'Gaurav Mishra', url: SITE_URL },
      url: canonicalUrl('/events'),
    })),
  };
}
