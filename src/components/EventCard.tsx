import { CalendarDays, MapPin, ExternalLink, Download } from 'lucide-react';
import type { AuthorEvent } from '../data/events';
import FormatBadge from './FormatBadge';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { downloadEventIcs } from '../lib/ics';
import { trackEvent } from '../lib/analytics';

interface EventCardProps {
  event: AuthorEvent;
  isPast?: boolean;
}

function formatEventDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function EventCard({ event, isPast = false }: EventCardProps) {
  return (
    <article className={`rounded-md border border-gold/20 bg-cream p-6 ${isPast ? 'opacity-70' : ''}`}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <FormatBadge>{event.eventType}</FormatBadge>
        <FormatBadge>{event.mode}</FormatBadge>
        {isPast && <FormatBadge>Past</FormatBadge>}
      </div>
      <h3 className="font-display text-xl text-ink mb-2">{event.title}</h3>
      <p className="text-sm text-muted flex items-center gap-1.5 mb-1">
        <CalendarDays size={14} aria-hidden="true" />
        {formatEventDate(event.eventDate)}
        {event.eventTime && ` · ${event.eventTime}`}
        {event.timezone && ` ${event.timezone}`}
      </p>
      {event.location && (
        <p className="text-sm text-muted flex items-center gap-1.5 mb-3">
          <MapPin size={14} aria-hidden="true" /> {event.location}
        </p>
      )}
      <p className="text-sm text-text/85 leading-relaxed mb-5">{event.description}</p>

      {!isPast && (
        <div className="flex flex-wrap gap-3">
          {event.registrationUrl && (
            <PrimaryButton href={event.registrationUrl} external size="sm" onClick={() => trackEvent('event_registration_click', { event: event.slug })}>
              Register <ExternalLink size={13} />
            </PrimaryButton>
          )}
          <SecondaryButton onClick={() => downloadEventIcs(event)} size="sm" aria-label={`Add ${event.title} to calendar`}>
            <Download size={13} /> Add to Calendar
          </SecondaryButton>
        </div>
      )}
    </article>
  );
}
