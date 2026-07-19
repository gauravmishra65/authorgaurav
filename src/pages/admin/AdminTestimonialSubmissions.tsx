import { useEffect, useState } from 'react';
import {
  fetchTestimonialSubmissions, approveTestimonialSubmission, rejectTestimonialSubmission,
  fetchAdminBooks, type AdminTestimonialSubmissionRow, type AdminBookRow,
} from '../../lib/adminQueries';

const statusStyles: Record<AdminTestimonialSubmissionRow['status'], string> = {
  pending: 'text-gold border-gold/40',
  approved: 'text-green-700 border-green-700/30',
  rejected: 'text-rose border-rose/40',
};

export default function AdminTestimonialSubmissions() {
  const [rows, setRows] = useState<AdminTestimonialSubmissionRow[]>([]);
  const [books, setBooks] = useState<AdminBookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    Promise.all([fetchTestimonialSubmissions(), fetchAdminBooks()])
      .then(([submissions, b]) => {
        setRows(submissions);
        setBooks(b);
        setReplies((prev) => {
          const next = { ...prev };
          for (const s of submissions) if (!(s.id in next)) next[s.id] = s.author_reply ?? '';
          return next;
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const bookTitle = (id: string | null) => books.find((b) => b.id === id)?.title ?? '—';

  const handleApprove = async (row: AdminTestimonialSubmissionRow) => {
    setBusyId(row.id);
    setError(null);
    try {
      await approveTestimonialSubmission(row, replies[row.id] ?? '');
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to approve.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (row: AdminTestimonialSubmissionRow) => {
    setBusyId(row.id);
    setError(null);
    try {
      await rejectTestimonialSubmission(row.id, replies[row.id] ?? '');
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reject.');
    } finally {
      setBusyId(null);
    }
  };

  const pending = rows.filter((r) => r.status === 'pending');
  const decided = rows.filter((r) => r.status !== 'pending');

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-2">Testimonial Submissions</h1>
      <p className="text-muted text-sm mb-6">Reader feedback submitted on /testimonials. Approving publishes it to "What Readers Say" with your reply attached.</p>

      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-2xs text-rose mb-4">{error}</p>}

      {!loading && (
        <div className="space-y-8">
          <section>
            <p className="label-caps text-gold mb-3">Pending ({pending.length})</p>
            <div className="space-y-4">
              {pending.map((row) => (
                <div key={row.id} className="rounded-md border border-gold/30 bg-ivory p-5">
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <div>
                      <p className="font-display text-ink">{row.name} <span className="text-muted font-body text-sm">&lt;{row.email}&gt;</span></p>
                      <p className="text-2xs text-muted">{bookTitle(row.book_id)} · {new Date(row.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`label-caps text-2xs border rounded-full px-2.5 py-0.5 ${statusStyles[row.status]}`}>{row.status}</span>
                  </div>
                  <p className="text-text/85 leading-relaxed italic mb-4">"{row.quote}"</p>
                  <label className="block mb-4">
                    <span className="label-caps text-muted block mb-1.5 text-2xs">Your Reply (optional, shown publicly)</span>
                    <textarea
                      rows={2}
                      value={replies[row.id] ?? ''}
                      onChange={(e) => setReplies((r) => ({ ...r, [row.id]: e.target.value }))}
                      className="input"
                    />
                  </label>
                  <div className="flex gap-3">
                    <button onClick={() => handleApprove(row)} disabled={busyId === row.id} className="btn-caps btn-gold rounded-sm px-4 py-2 text-2xs disabled:opacity-60">
                      {busyId === row.id ? 'Working…' : 'Approve & Publish'}
                    </button>
                    <button onClick={() => handleReject(row)} disabled={busyId === row.id} className="btn-caps btn-gold-outline rounded-sm px-4 py-2 text-2xs disabled:opacity-60">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {pending.length === 0 && <p className="text-muted text-sm">No pending submissions.</p>}
            </div>
          </section>

          <section>
            <p className="label-caps text-gold mb-3">Reviewed ({decided.length})</p>
            <div className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
              {decided.map((row) => (
                <div key={row.id} className="px-5 py-3 border-b border-gold/10 last:border-0">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-ink italic truncate">"{row.quote}"</p>
                      <p className="text-2xs text-muted">{row.name} — {bookTitle(row.book_id)}</p>
                    </div>
                    <span className={`label-caps text-2xs border rounded-full px-2.5 py-0.5 flex-shrink-0 ${statusStyles[row.status]}`}>{row.status}</span>
                  </div>
                </div>
              ))}
              {decided.length === 0 && <p className="px-5 py-6 text-muted text-sm">No reviewed submissions yet.</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
