export type EventMode = 'Online' | 'In-Person' | 'Hybrid';
export type EventType = 'Launch' | 'School' | 'Literary' | 'Interview' | 'Book Club' | 'Online' | 'Other';

export interface AuthorEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime?: string;
  timezone?: string;
  location?: string;
  mode: EventMode;
  eventType: EventType;
  registrationUrl?: string;
  featured: boolean;
}

export const eventModes: EventMode[] = ['Online', 'In-Person', 'Hybrid'];
export const eventTypes: EventType[] = ['Launch', 'School', 'Literary', 'Interview', 'Book Club', 'Online', 'Other'];

// Event content lives in Supabase (authorgaurav_events) — see src/lib/queries.ts. Manage it via /admin/events.
