import Seo from '../components/Seo';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';
import EmailStrip from '../components/EmailStrip';
import Divider from '../components/Divider';
import { buildEventStructuredData } from '../components/EventStructuredData';
import { fetchEvents, fetchReaderPhotos } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

export default function Events() {
  const { data: events, loading, error } = useSupabaseData(fetchEvents, []);
  const { data: readerPhotos } = useSupabaseData(fetchReaderPhotos, []);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events?.filter((e) => e.eventDate >= today) ?? [];
  const past = events?.filter((e) => e.eventDate < today) ?? [];
  const jsonLd = buildEventStructuredData(upcoming);

  return (
    <>
      <Seo
        title="Events — Gaurav Mishra"
        description="Upcoming book launches, literary events, school visits, and book-club appearances with author Gaurav Mishra."
        path="/events"
        jsonLd={jsonLd}
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">Appearances</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Events</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Book launches, literary events, school visits, interviews, and book-club appearances — online and in person.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        {loading && <p className="text-center text-muted">Loading events…</p>}
        {error && <p className="text-center text-rose">Couldn't load events: {error}</p>}

        {!loading && !error && (
          <>
            <p className="eyebrow text-gold-text mb-6 text-center">Upcoming</p>
            {upcoming.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 mb-16">
                {upcoming.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
            ) : (
              <EmptyState
                heading="No public events are currently scheduled"
                message="Join the Reader Circle for future announcements."
                className="mb-16"
              />
            )}

            {past.length > 0 && (
              <>
                <Divider className="!my-10" />
                <p className="eyebrow text-gold-text mb-6 text-center">Past Events</p>
                <div className="grid gap-6 md:grid-cols-2">
                  {past.map((event) => <EventCard key={event.id} event={event} isPast />)}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {readerPhotos && readerPhotos.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16 border-t border-gold/10">
          <p className="eyebrow text-gold-text mb-2 text-center">Reader Photos</p>
          <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-10">Readers with the Book</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {readerPhotos.map((photo) => (
              <figure key={photo.id} className="rounded-md border border-gold/15 bg-ivory overflow-hidden hover:border-gold/40 transition-colors">
                <img src={photo.imageSrc} alt={photo.caption || photo.readerName || 'Reader with the book'} className="w-full aspect-square object-cover" loading="lazy" />
                {(photo.caption || photo.readerName || photo.bookTitle) && (
                  <figcaption className="p-4">
                    {photo.caption && <p className="text-sm text-ink leading-relaxed">{photo.caption}</p>}
                    <p className="text-2xs text-muted mt-1">
                      {photo.readerName}{photo.readerName && photo.bookTitle ? ' · ' : ''}{photo.bookTitle}
                    </p>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      <EmailStrip
        heading="Never miss an appearance"
        subheading="Get notified when a new event, launch, or book-club visit is announced."
      />
    </>
  );
}
