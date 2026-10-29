interface LanguageSwitchProps {
  active: 'en' | 'hi';
  /** Accessible name for the nav landmark, in the language of the section it sits in. */
  label: string;
}

/** The English | हिंदी switch. Plain in-page anchors, so it works without
 * script and each target is a real, prerendered section of the same page. */
export default function LanguageSwitch({ active, label }: LanguageSwitchProps) {
  const base = 'inline-flex min-h-12 min-w-24 items-center justify-center px-5 text-base font-medium transition-colors';
  const on = 'bg-[#f6b347] text-[#0e0a2e]';
  const off = 'text-[#f7f3ec] hover:bg-white/10';
  return (
    <nav aria-label={label} className="inline-flex overflow-hidden rounded-full border border-[#f6b347]/55">
      <a href="#english" lang="en" aria-current={active === 'en' ? 'true' : undefined} className={`${base} ${active === 'en' ? on : off}`}>
        English
      </a>
      <a href="#hindi" lang="hi" aria-current={active === 'hi' ? 'true' : undefined} className={`${base} border-l border-[#f6b347]/55 pt-1 ${active === 'hi' ? on : off}`}>
        हिंदी
      </a>
    </nav>
  );
}
