import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { fetchAdminEvents, saveEvent, deleteEvent, type AdminEventRow } from '../../lib/adminQueries';

const empty: Partial<AdminEventRow> = {
  slug: '', title: '', description: '', event_date: new Date().toISOString().slice(0, 10),
  event_time: '', timezone: '', location: '', mode: 'Online', event_type: 'Launch', registration_url: '', featured: false,
};

export default function AdminEvents() {
  const [rows, setRows] = useState<AdminEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminEventRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetchAdminEvents().then(setRows).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await saveEvent(editing);
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await deleteEvent(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Events</h1>
        <button onClick={() => setEditing(empty)} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-4 py-2 text-2xs">
          <Plus size={14} /> Add Event
        </button>
      </div>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && (
        <div className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
          {rows.map((ev) => (
            <div key={ev.id} className="flex items-center justify-between px-5 py-3 border-b border-gold/10 last:border-0">
              <div>
                <p className="font-display text-ink">{ev.title}</p>
                <p className="text-2xs text-muted">{ev.event_type} · {ev.mode} · {new Date(`${ev.event_date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(ev)} className="p-2 text-muted hover:text-gold-text"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(ev.id)} className="p-2 text-muted hover:text-rose"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="px-5 py-6 text-muted text-sm">No events yet.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50 overflow-auto" onClick={() => setEditing(null)}>
          <div className="bg-cream rounded-md max-w-xl w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl text-ink">{editing.id ? 'Edit Event' : 'Add Event'}</h2>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Slug</span>
                <input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" />
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Title</span>
                <input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" />
              </label>
            </div>
            <label className="block">
              <span className="label-caps text-muted block mb-1.5 text-2xs">Description</span>
              <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Event Date</span>
                <input type="date" value={(editing.event_date ?? '').slice(0, 10)} onChange={(e) => setEditing({ ...editing, event_date: e.target.value })} className="input" />
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Time (display text)</span>
                <input placeholder="6:00 PM" value={editing.event_time ?? ''} onChange={(e) => setEditing({ ...editing, event_time: e.target.value })} className="input" />
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Time Zone</span>
                <input placeholder="IST" value={editing.timezone ?? ''} onChange={(e) => setEditing({ ...editing, timezone: e.target.value })} className="input" />
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Location</span>
                <input value={editing.location ?? ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="input" />
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Mode</span>
                <select value={editing.mode} onChange={(e) => setEditing({ ...editing, mode: e.target.value as AdminEventRow['mode'] })} className="input">
                  <option>Online</option><option>In-Person</option><option>Hybrid</option>
                </select>
              </label>
              <label className="block">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Event Type</span>
                <select value={editing.event_type} onChange={(e) => setEditing({ ...editing, event_type: e.target.value as AdminEventRow['event_type'] })} className="input">
                  <option>Launch</option><option>School</option><option>Literary</option><option>Interview</option><option>Book Club</option><option>Online</option><option>Other</option>
                </select>
              </label>
              <label className="block col-span-2">
                <span className="label-caps text-muted block mb-1.5 text-2xs">Registration URL</span>
                <input value={editing.registration_url ?? ''} onChange={(e) => setEditing({ ...editing, registration_url: e.target.value })} className="input" />
              </label>
              <label className="flex items-center gap-2 col-span-2">
                <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="h-4 w-4 accent-gold" />
                <span className="label-caps text-muted text-2xs">Featured</span>
              </label>
            </div>

            {error && <p className="text-2xs text-rose">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="btn-caps btn-gold rounded-sm px-5 py-2.5 text-2xs disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(null)} className="btn-caps btn-gold-outline rounded-sm px-5 py-2.5 text-2xs">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
