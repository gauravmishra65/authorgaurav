import type { AuthorEvent } from '../data/events';

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}

function toIcsDate(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}

/** Builds and downloads a minimal, valid .ics file for one event. Uses an
 * all-day DATE value rather than parsing the free-text `eventTime`/`timezone`
 * display strings into an exact instant — those are shown in the event
 * description instead, which is far more reliable than guessing at a time
 * format from admin-entered text. */
export function downloadEventIcs(event: AuthorEvent): void {
  const dateStamp = toIcsDate(event.eventDate);
  const details: string[] = [event.description];
  if (event.eventTime) details.push(`Time: ${event.eventTime}${event.timezone ? ` (${event.timezone})` : ''}`);
  if (event.location) details.push(`Location: ${event.location}`);
  if (event.registrationUrl) details.push(`Registration: ${event.registrationUrl}`);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//authorgaurav.com//Events//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@authorgaurav.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${dateStamp}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(details.join('\n'))}`,
    ...(event.location ? [`LOCATION:${escapeIcsText(event.location)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
