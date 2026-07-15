import { useEffect, useState } from 'react';
import { fetchContactMessages, setContactMessageStatus, type AdminContactMessageRow } from '../../lib/adminQueries';

export default function AdminMessages() {
  const [rows, setRows] = useState<AdminContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetchContactMessages().then(setRows).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id: string) => {
    await setContactMessageStatus(id, 'read');
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Contact Messages ({rows.length})</h1>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && (
        <div className="space-y-4">
          {rows.map((m) => (
            <div key={m.id} className={`rounded-md border p-5 ${m.status === 'new' ? 'border-gold/40 bg-ivory' : 'border-gold/15 bg-ivory/50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-display text-ink">{m.name} <span className="text-muted font-body text-sm">&lt;{m.email}&gt;</span></p>
                  <p className="text-2xs text-muted">{new Date(m.created_at).toLocaleString()}{m.join_circle ? ' · Wants reader circle' : ''}</p>
                </div>
                {m.status === 'new' && (
                  <button onClick={() => markRead(m.id)} className="label-caps text-2xs text-gold hover:text-ink transition-colors">Mark read</button>
                )}
              </div>
              <p className="text-text/85 leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
          {rows.length === 0 && <p className="text-muted text-sm">No messages yet.</p>}
        </div>
      )}
    </div>
  );
}
