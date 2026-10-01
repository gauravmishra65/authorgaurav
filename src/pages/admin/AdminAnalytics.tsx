import { useEffect, useState } from 'react';
import { fetchAnalyticsEvents, type AdminAnalyticsEventRow } from '../../lib/adminQueries';

const PERIODS = [7, 30, 90] as const;

interface EventSummary {
  name: string;
  count: number;
  /** Top property combinations for this event, e.g. "retailer: Amazon" → 12 —
   * generic rather than hardcoded per event name, so a new event or a new
   * property key shows up here automatically without a code change. */
  topProps: [string, number][];
}

function summarize(rows: AdminAnalyticsEventRow[]): EventSummary[] {
  const byEvent = new Map<string, { count: number; byProps: Map<string, number> }>();
  for (const row of rows) {
    const entry = byEvent.get(row.event_name) ?? { count: 0, byProps: new Map() };
    entry.count += 1;
    const propsKey = row.properties && Object.keys(row.properties).length > 0
      ? Object.entries(row.properties).map(([k, v]) => `${k}: ${v}`).join(', ')
      : null;
    if (propsKey) entry.byProps.set(propsKey, (entry.byProps.get(propsKey) ?? 0) + 1);
    byEvent.set(row.event_name, entry);
  }
  return [...byEvent.entries()]
    .map(([name, { count, byProps }]) => ({
      name,
      count,
      topProps: [...byProps.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5),
    }))
    .sort((a, b) => b.count - a.count);
}

export default function AdminAnalytics() {
  const [days, setDays] = useState<(typeof PERIODS)[number]>(30);
  const [rows, setRows] = useState<AdminAnalyticsEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsEvents(days)
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, [days]);

  const handlePeriodChange = (p: (typeof PERIODS)[number]) => {
    setLoading(true);
    setError(null);
    setDays(p);
  };

  const summary = summarize(rows);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Analytics</h1>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`label-caps text-2xs px-3 py-1.5 rounded-xs border transition-colors ${days === p ? 'bg-ink text-ivory border-ink' : 'border-gold/30 text-muted hover:border-gold/60'}`}
            >
              Last {p}d
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-rose text-sm">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-2xs text-muted mb-4">{rows.length} total event{rows.length === 1 ? '' : 's'} in this period.</p>
          <div className="space-y-4">
            {summary.map((s) => (
              <div key={s.name} className="rounded-md border border-gold/20 bg-ivory p-5">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-display text-ink">{s.name}</p>
                  <p className="label-caps text-2xs text-gold-text">{s.count} {s.count === 1 ? 'event' : 'events'}</p>
                </div>
                {s.topProps.length > 0 && (
                  <ul className="text-2xs text-muted space-y-1 mt-3 border-t border-gold/10 pt-3">
                    {s.topProps.map(([key, count]) => (
                      <li key={key} className="flex items-center justify-between gap-3">
                        <span className="truncate">{key}</span>
                        <span className="shrink-0">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {summary.length === 0 && <p className="text-muted text-sm">No events recorded in this period.</p>}
          </div>
        </>
      )}
    </div>
  );
}
