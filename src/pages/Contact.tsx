import { useState } from 'react';
import { Mail, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import Seo from '../components/Seo';
import Divider from '../components/Divider';
import { socialLinks } from '../data/social';
import { supabase, CONTACT_FORM_ENDPOINT, SUPABASE_ANON_KEY } from '../lib/supabase';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', circle: false });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const update = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSending(true);
    setSubmitError(false);
    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message, joinCircle: form.circle }),
      });
      if (!res.ok) throw new Error('Contact form submission failed');

      if (form.circle) {
        // Best-effort — a duplicate/failed subscribe shouldn't block "message sent".
        await supabase.from('authorgaurav_newsletter_subscribers').insert({ email: form.email, source: 'contact-form' }).then(
          () => {},
          () => {},
        );
      }

      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact Gaurav Mishra — Say Hello, Share a Note, Join the Reader Circle"
        description="Get in touch with author Gaurav Mishra. Send a message, request a free chapter, or join the reader circle for monthly letters and new-release alerts."
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">Say Hello</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Contact</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Whether you're a reader, a fellow writer, or just passing through — I'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="font-display text-2xl text-ink mb-2">Send a Message</h2>
            <p className="text-muted text-sm mb-8">Fill out the form below and I'll get back to you personally.</p>

            {submitted ? (
              <div className="rounded-md border border-gold/40 bg-cream px-6 py-10 text-center">
                <CheckCircle2 className="mx-auto mb-3 text-gold" size={36} />
                <h3 className="font-display text-xl text-ink mb-2">Message sent</h3>
                <p className="text-muted text-sm">
                  Thank you, {form.name.split(' ')[0]}. Your note is on its way — I'll reply soon
                  {form.circle ? ", and you have been added to the reader circle." : "."}
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '', circle: false }); }}
                  className="btn-caps btn-gold-outline mt-6 rounded-sm px-5 py-2.5 text-2xs">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="label-caps text-muted block mb-2">Name</label>
                  <input id="name" type="text" required value={form.name} onChange={(e) => update('name', e.target.value)}
                    className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="email" className="label-caps text-muted block mb-2">Email</label>
                  <input id="email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                    className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="message" className="label-caps text-muted block mb-2">Message</label>
                  <textarea id="message" required rows={5} value={form.message} onChange={(e) => update('message', e.target.value)}
                    className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none resize-none" />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.circle} onChange={(e) => update('circle', e.target.checked)} className="mt-1 h-4 w-4 accent-gold" />
                  <span className="text-sm text-muted">Add me to the reader circle — I'd like the free chapter and monthly letters.</span>
                </label>
                {submitError && <p className="text-2xs text-rose">Something went wrong — please try again.</p>}
                <button type="submit" disabled={sending} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3 disabled:opacity-60">
                  <Send size={15} /> {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-8">
            <div className="rounded-md border border-gold/20 bg-cream p-6">
              <p className="label-caps text-gold mb-3">Email</p>
              <a href="mailto:hello@writetogetherhub.com" className="inline-flex items-center gap-2 text-ink hover:text-gold transition-colors">
                <Mail size={16} /> hello@writetogetherhub.com
              </a>
            </div>
            <div className="rounded-md border border-gold/20 bg-cream p-6">
              <p className="label-caps text-gold mb-4">Links</p>
              <ul className="space-y-3 text-sm">
                <li><a href="https://writetogetherhub.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink hover:text-gold transition-colors">WriteTogetherHub <ExternalLink size={13} /></a></li>
                <li><a href="https://off-beat-love.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink hover:text-gold transition-colors">off-beat-love.com <ExternalLink size={13} /></a></li>
                <li><a href="https://the-shadow-code.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink hover:text-gold transition-colors">the-shadow-code.com <ExternalLink size={13} /></a></li>
              </ul>
            </div>
            <div className="rounded-md border border-gold/20 bg-cream p-6">
              <p className="label-caps text-gold mb-4">Social</p>
              <div className="flex gap-4">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label} className="label-caps text-2xs text-muted hover:text-gold transition-colors border border-gold/25 rounded-full px-3 py-2">{s.label}</a>
                ))}
              </div>
            </div>
          </aside>
        </div>
        <Divider />
      </section>
    </>
  );
}
