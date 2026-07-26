import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import Seo from '../components/Seo';
import Divider from '../components/Divider';
import { socialLinks } from '../data/social';
import { supabase, CONTACT_FORM_ENDPOINT, SUPABASE_ANON_KEY } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';

const enquiryTypes = [
  { value: 'reader', label: 'Reader message' },
  { value: 'media', label: 'Media or interview' },
  { value: 'book-event', label: 'Book event' },
  { value: 'book-club', label: 'Book club' },
  { value: 'school-event', label: 'School event' },
  { value: 'rights', label: 'Rights or publishing' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'technical', label: 'Technical issue' },
  { value: 'other', label: 'Other' },
] as const;

type EnquiryValue = (typeof enquiryTypes)[number]['value'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  name: string;
  email: string;
  organisation: string;
  enquiryType: EnquiryValue;
  subject: string;
  message: string;
  consent: boolean;
  circle: boolean;
  company: string; // honeypot — real users never see or fill this
}

const emptyForm = (initialType: EnquiryValue): FormState => ({
  name: '', email: '', organisation: '', enquiryType: initialType, subject: '', message: '', consent: false, circle: false, company: '',
});

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialType = enquiryTypes.find((t) => t.value === searchParams.get('type'))?.value ?? 'reader';

  const [form, setForm] = useState<FormState>(() => emptyForm(initialType));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) next.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (!form.subject.trim()) next.subject = 'Please enter a subject.';
    if (!form.message.trim()) next.message = 'Please enter a message.';
    if (!form.consent) next.consent = 'Please confirm you consent to being contacted.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Honeypot: a bot that fills every field gets a normal-looking success
    // state, but nothing is ever sent — never reveal the trap.
    if (form.company.trim()) {
      setSubmitted(true);
      return;
    }

    setSending(true);
    setSubmitError(null);
    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          organisation: form.organisation || undefined,
          enquiryType: enquiryTypes.find((t) => t.value === form.enquiryType)?.label,
          subject: form.subject,
          message: form.message,
          consent: form.consent,
          joinCircle: form.circle,
          company: form.company,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.error === 'rate_limited'
          ? 'You already sent a message moments ago — please wait a minute before sending another.'
          : 'Something went wrong sending your message. Please try again.');
      }

      if (form.circle) {
        // Best-effort — a duplicate/failed subscribe shouldn't block "message sent".
        await supabase.from('authorgaurav_newsletter_subscribers').insert({ email: form.email, source: 'contact-form' }).then(
          () => {},
          () => {},
        );
      }

      trackEvent('contact_submit', { enquiryType: enquiryTypes.find((t) => t.value === form.enquiryType)?.label });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong — please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact Gaurav Mishra — Say Hello, Share a Note, Join the Reader Circle"
        description="Get in touch with author Gaurav Mishra. Send a message, request a free chapter, or join the reader circle for monthly letters and new-release alerts."
        path="/contact"
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">Say Hello</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Contact</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Whether you're a reader, a fellow writer, media, a book club, or a school — I'd love to hear from you.
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
                <CheckCircle2 className="mx-auto mb-3 text-gold-text" size={36} />
                <h3 className="font-display text-xl text-ink mb-2">Message sent</h3>
                <p className="text-muted text-sm">
                  Thank you, {form.name.split(' ')[0] || 'friend'}. Your note is on its way — I'll reply soon
                  {form.circle ? ", and you have been added to the reader circle." : "."}
                </p>
                <button onClick={() => { setSubmitted(false); setForm(emptyForm('reader')); setErrors({}); }}
                  className="btn-caps btn-gold-outline mt-6 rounded-sm px-5 py-2.5 text-2xs">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="form-label-caps text-muted block mb-2">Name</label>
                    <input id="name" type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                      aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined}
                      className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none" />
                    {errors.name && <p id="name-error" role="alert" className="text-2xs text-rose mt-1.5">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label-caps text-muted block mb-2">Email</label>
                    <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                      aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}
                      className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none" />
                    {errors.email && <p id="email-error" role="alert" className="text-2xs text-rose mt-1.5">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="organisation" className="form-label-caps text-muted block mb-2">Organisation <span className="normal-case text-2xs opacity-70">(optional)</span></label>
                    <input id="organisation" type="text" value={form.organisation} onChange={(e) => update('organisation', e.target.value)}
                      className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none" />
                  </div>
                  <div>
                    <label htmlFor="enquiryType" className="form-label-caps text-muted block mb-2">Enquiry Type</label>
                    <select id="enquiryType" value={form.enquiryType} onChange={(e) => update('enquiryType', e.target.value as EnquiryValue)}
                      className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none">
                      {enquiryTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="form-label-caps text-muted block mb-2">Subject</label>
                  <input id="subject" type="text" value={form.subject} onChange={(e) => update('subject', e.target.value)}
                    aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-error' : undefined}
                    className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none" />
                  {errors.subject && <p id="subject-error" role="alert" className="text-2xs text-rose mt-1.5">{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="form-label-caps text-muted block mb-2">Message</label>
                  <textarea id="message" rows={5} value={form.message} onChange={(e) => update('message', e.target.value)}
                    aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}
                    className="w-full rounded-sm border border-gold/30 bg-cream px-4 py-3 text-ink focus:border-gold focus:outline-none resize-none" />
                  {errors.message && <p id="message-error" role="alert" className="text-2xs text-rose mt-1.5">{errors.message}</p>}
                </div>

                {/* Honeypot — hidden from sighted users and screen readers, but still in the DOM/tab flow for naive bots that ignore display:none. */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => update('company', e.target.value)} />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.circle} onChange={(e) => update('circle', e.target.checked)} className="mt-1 h-4 w-4 accent-gold" />
                  <span className="text-sm text-muted">Add me to the reader circle — I'd like the free chapter and monthly letters.</span>
                </label>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)}
                      aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-error' : undefined}
                      className="mt-1 h-4 w-4 accent-gold" />
                    <span className="text-sm text-muted">I consent to being contacted about this enquiry.</span>
                  </label>
                  {errors.consent && <p id="consent-error" role="alert" className="text-2xs text-rose mt-1.5">{errors.consent}</p>}
                </div>

                {submitError && <p role="alert" className="text-2xs text-rose">{submitError}</p>}

                <button type="submit" disabled={sending} className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3 disabled:opacity-60">
                  <Send size={15} /> {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-8">
            <div className="rounded-md border border-gold/20 bg-cream p-6">
              <p className="label-caps text-gold-text mb-3">Email</p>
              <a href="mailto:hello@writetogetherhub.com" className="inline-flex items-center gap-2 text-ink hover:text-gold-text transition-colors">
                <Mail size={16} /> hello@writetogetherhub.com
              </a>
            </div>
            <div className="rounded-md border border-gold/20 bg-cream p-6">
              <p className="label-caps text-gold-text mb-4">Links</p>
              <ul className="space-y-3 text-sm">
                <li><a href="https://writetogetherhub.com" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('writetogetherhub_click', { source: 'contact' })} className="inline-flex items-center gap-1.5 text-ink hover:text-gold-text transition-colors">WriteTogetherHub <ExternalLink size={13} /></a></li>
                <li><a href="https://off-beat-love.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink hover:text-gold-text transition-colors">off-beat-love.com <ExternalLink size={13} /></a></li>
                <li><a href="https://the-shadow-code.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink hover:text-gold-text transition-colors">the-shadow-code.com <ExternalLink size={13} /></a></li>
              </ul>
            </div>
            <div className="rounded-md border border-gold/20 bg-cream p-6">
              <p className="label-caps text-gold-text mb-4">Social</p>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="label-caps text-2xs text-muted hover:text-gold-text transition-colors border border-gold/25 rounded-full px-3 py-2">{s.label}</a>
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
