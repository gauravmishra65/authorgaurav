import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  BookOpen,
  Calculator,
  CalendarCheck,
  CalendarRange,
  ChevronDown,
  FileText,
  Grid3x3,
  Hash,
  Heart,
  HeartHandshake,
  Languages,
  Mail,
  ShieldCheck,
  Users,
  Wallet,
  WifiOff,
  type LucideIcon,
} from 'lucide-react';
import PhoneFrame from './PhoneFrame';
import LanguageSwitch from './LanguageSwitch';
import ScreenshotGallery from './ScreenshotGallery';
import { trackEvent } from '../../lib/analytics';
import {
  APP,
  demoMailto,
  screenshots,
  type BenefitIcon,
  type FeatureIcon,
  type JyotishCopy,
} from '../../data/gauravJyotish';

const featureIcons: Record<FeatureIcon, LucideIcon> = {
  kundali: Grid3x3,
  vedic: BookOpen,
  milan: Heart,
  muhurta: CalendarCheck,
  numerology: Hash,
  forecast: CalendarRange,
  reading: FileText,
  saved: Users,
  language: Languages,
};

const benefitIcons: Record<BenefitIcon, LucideIcon> = {
  private: ShieldCheck,
  offline: WifiOff,
  careful: Calculator,
  honest: HeartHandshake,
  family: Users,
  payment: Wallet,
};

interface JyotishSectionProps {
  copy: JyotishCopy;
  /** The page has exactly one h1 - the English hero headline. The Hindi hero headline is an h2. */
  headingLevel: 'h1' | 'h2';
}

/** One complete version of the page in a single language. The page renders
 * this twice (English, then Hindi) so both are real, crawlable content. */
export default function JyotishSection({ copy, headingLevel }: JyotishSectionProps) {
  const { lang, hero, features, benefits, editions, faq, maker, contact } = copy;
  const Headline = headingLevel;
  const price = APP.fullVersionPrice ? editions.fullPriceWrap(APP.fullVersionPrice) : '';
  const privacyHref = lang === 'hi' ? `${APP.privacyPath}/#hindi` : `${APP.privacyPath}/`;
  const heroShot = screenshots[0];

  return (
    <section id={lang === 'en' ? 'english' : 'hindi'} lang={lang} className="jyotish scroll-mt-20">
      {/* 1. HERO */}
      <div className="jy-hero relative overflow-hidden">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
          <LanguageSwitch active={lang} label={copy.switchLabel} />

          <div className="mt-10 grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <img
                src={APP.icon}
                alt={hero.iconAlt}
                width={112}
                height={112}
                decoding="async"
                className="mb-6 h-28 w-28 rounded-[1.6rem] shadow-[0_14px_34px_-12px_rgba(0,0,0,0.7)]"
              />
              <p className="eyebrow jy-eyebrow-dark mb-4">{hero.eyebrow}</p>
              <Headline className="font-display text-4xl leading-tight md:text-5xl">{hero.headline}</Headline>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#f7f3ec]/85">{hero.subline}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                {APP.playStoreUrl ? (
                  <a href={APP.playStoreUrl} target="_blank" rel="noopener noreferrer" className="btn-caps jy-btn jy-btn-gold">
                    {hero.play}
                  </a>
                ) : (
                  <span aria-disabled="true" className="btn-caps jy-btn jy-btn-soon flex-wrap">
                    {hero.play} <span className="jy-soon-tag normal-case">{hero.playSoon}</span>
                  </span>
                )}
                <a
                  href={demoMailto}
                  onClick={() => trackEvent('jyotish_demo_click', { lang })}
                  className={`btn-caps jy-btn ${APP.playStoreUrl ? 'jy-btn-ghost' : 'jy-btn-gold'}`}
                >
                  <Mail size={18} aria-hidden="true" /> {hero.demo}
                </a>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <PhoneFrame shot={heroShot} lang={lang} placeholder={copy.screenshots.placeholder} eager className="w-52 sm:w-60 md:w-64" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEATURES */}
      <div className="jy-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <p className="eyebrow jy-eyebrow-light mb-3 font-semibold">{features.eyebrow}</p>
            <h2 className="font-display text-3xl text-[#0e0a2e] md:text-4xl">{features.title}</h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.items.map((item) => {
              const Icon = featureIcons[item.icon];
              return (
                <li key={item.icon} className="jy-card p-6">
                  <span className="jy-icon-chip mb-4">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 font-display text-xl text-[#0e0a2e]">{item.title}</h3>
                  <p className="leading-relaxed text-text/80">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 3. BENEFITS */}
      <div className="jy-band py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <p className="eyebrow jy-eyebrow-dark mb-3">{benefits.eyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl">{benefits.title}</h2>
          </div>
          <ul className="grid gap-5 md:grid-cols-2">
            {benefits.items.map((item) => {
              const Icon = benefitIcons[item.icon];
              return (
                <li key={item.icon} className="jy-card-dark flex gap-4 p-6">
                  <span className="jy-icon-chip">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="mb-1 font-display text-xl text-[#f6b347]">{item.title}</h3>
                    <p className="leading-relaxed text-[#f7f3ec]/85">{item.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 4. EDITIONS */}
      <div className="jy-cream py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <p className="eyebrow jy-eyebrow-light mb-3 font-semibold">{editions.eyebrow}</p>
            <h2 className="font-display text-3xl text-[#0e0a2e] md:text-4xl">{editions.title}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="jy-card p-7">
              <span className="jy-icon-chip mb-4">
                <BadgeCheck size={22} aria-hidden="true" />
              </span>
              <h3 className="mb-2 font-display text-2xl text-[#0e0a2e]">{editions.demoTitle}</h3>
              <p className="mb-6 leading-relaxed text-text/80">{editions.demoBody}</p>
              <a
                href={demoMailto}
                onClick={() => trackEvent('jyotish_demo_click', { lang, source: 'editions' })}
                className="btn-caps jy-btn jy-btn-gold"
              >
                <Mail size={18} aria-hidden="true" /> {hero.demo}
              </a>
            </div>
            <div className="jy-card border-[#e07b1f]/50! p-7">
              <span className="jy-icon-chip mb-4">
                <Wallet size={22} aria-hidden="true" />
              </span>
              <h3 className="mb-2 font-display text-2xl text-[#0e0a2e]">{editions.fullTitle}</h3>
              <p className="leading-relaxed text-text/80">
                {editions.fullBeforePrice}
                {price}
                {editions.fullAfterPrice}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SCREENSHOTS */}
      <div className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center">
            <p className="eyebrow jy-eyebrow-light mb-3 font-semibold">{copy.screenshots.eyebrow}</p>
            <h2 className="font-display text-3xl text-[#0e0a2e] md:text-4xl">{copy.screenshots.title}</h2>
          </div>
          <ScreenshotGallery copy={copy} />
        </div>
      </div>

      {/* 6. FAQ */}
      <div className="jy-cream py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
            <p className="eyebrow jy-eyebrow-light mb-3 font-semibold">{faq.eyebrow}</p>
            <h2 className="font-display text-3xl text-[#0e0a2e] md:text-4xl">{faq.title}</h2>
          </div>
          <div className="space-y-3">
            {faq.items.map((item) => (
              <details key={item.q} className="jy-card group">
                <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 px-5 py-3 text-left font-medium text-[#0e0a2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#36207a]">
                  <span>{item.q}</span>
                  <ChevronDown size={20} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-text/80">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* 7. ABOUT THE MAKER + 8. CONTACT AND LEGAL */}
      <div className="jy-band py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="eyebrow jy-eyebrow-dark mb-3">{maker.eyebrow}</p>
            <h2 className="mb-4 font-display text-3xl">{maker.title}</h2>
            <p className="mb-6 leading-relaxed text-[#f7f3ec]/85">{maker.body}</p>
            <Link to="/about/" className="btn-caps jy-btn jy-btn-ghost">
              {maker.link}
            </Link>
          </div>
          <div>
            <p className="eyebrow jy-eyebrow-dark mb-3">{contact.eyebrow}</p>
            <h2 className="mb-4 font-display text-3xl">{contact.title}</h2>
            <ul className="space-y-1 text-lg">
              <li>
                <span className="text-[#f7f3ec]/70">{contact.emailLabel}: </span>
                <a href={`mailto:${APP.email}`} className="inline-flex min-h-12 items-center break-all text-[#f6b347] underline underline-offset-4 hover:text-white">
                  {APP.email}
                </a>
              </li>
              <li>
                <Link to={privacyHref} className="inline-flex min-h-12 items-center text-[#f6b347] underline underline-offset-4 hover:text-white">
                  {contact.privacy}
                </Link>
              </li>
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-[#f7f3ec]/70">{contact.smallPrint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
