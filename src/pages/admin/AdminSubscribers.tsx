import { useEffect, useState } from 'react';
import { fetchSubscribers, type AdminSubscriberRow } from '../../lib/adminQueries';

export default function AdminSubscribers() {
  const [rows, setRows] = useState<AdminSubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers().then(setRows).finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    const csv = ['name,email,source,genre_preference,created_at', ...rows.map((r) => `${r.name ?? ''},${r.email},${r.source ?? ''},${r.genre_preference ?? ''},${r.created_at}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Newsletter Subscribers ({rows.length})</h1>
        {rows.length > 0 && (
          <button onClick={exportCsv} className="btn-caps btn-gold-outline rounded-sm px-4 py-2 text-2xs">Export CSV</button>
        )}
      </div>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && (
        <div className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-5 py-3 border-b border-gold/10 last:border-0">
              <p className="text-ink">{r.name ? `${r.name} · ${r.email}` : r.email}</p>
              <p className="text-2xs text-muted">{r.source ?? '—'}{r.genre_preference ? ` · ${r.genre_preference}` : ''} · {new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
          {rows.length === 0 && <p className="px-5 py-6 text-muted text-sm">No subscribers yet.</p>}
        </div>
      )}
    </div>
  );
}
