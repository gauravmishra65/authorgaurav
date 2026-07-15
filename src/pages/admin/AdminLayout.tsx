import { NavLink, Outlet } from 'react-router-dom';
import { useAdminSession } from '../../lib/useAdminSession';
import { supabase } from '../../lib/supabase';
import AdminLogin from './AdminLogin';

const links = [
  { label: 'Books', to: '/admin/books' },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Blog', to: '/admin/blog' },
  { label: 'News & Events', to: '/admin/news' },
  { label: 'Newsletter Subscribers', to: '/admin/subscribers' },
  { label: 'Contact Messages', to: '/admin/messages' },
];

export default function AdminLayout() {
  const { session, loading } = useAdminSession();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-ink text-ivory">Loading…</div>;
  if (!session) return <AdminLogin />;

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-56 flex-shrink-0 bg-ink text-ivory flex flex-col">
        <div className="px-5 py-6 border-b border-gold/20">
          <p className="font-display text-lg">Gaurav<span className="text-gold">Mishra</span></p>
          <p className="text-2xs text-ivory/50 mt-1">{session.user.email}</p>
        </div>
        <nav className="flex-1 py-4">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `block px-5 py-2.5 label-caps text-2xs ${isActive ? 'text-gold bg-ink-soft' : 'text-ivory/70 hover:text-gold'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="m-4 btn-caps btn-gold-outline rounded-sm px-4 py-2 text-2xs">
          Sign Out
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
