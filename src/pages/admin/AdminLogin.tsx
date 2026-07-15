import { useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="font-display text-2xl text-ivory text-center mb-8">Gaurav<span className="text-gold">Mishra</span> Admin</p>
        <form onSubmit={handleSubmit} className="rounded-md border border-gold/20 bg-ink-soft p-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="label-caps text-ivory/70 block mb-2">Email</label>
            <input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-gold/30 bg-ink px-4 py-2.5 text-ivory focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label htmlFor="admin-password" className="label-caps text-ivory/70 block mb-2">Password</label>
            <input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-gold/30 bg-ink px-4 py-2.5 text-ivory focus:border-gold focus:outline-none" />
          </div>
          {error && <p className="text-2xs text-rose">{error}</p>}
          <button type="submit" disabled={loading} className="btn-caps btn-gold w-full rounded-sm px-4 py-3 disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
