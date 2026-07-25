interface BookFiltersProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

/** One row of filter pills (genre, language, or status) — plain, native
 * `<button>`s, so Tab/Space/Enter all work with zero extra ARIA plumbing. */
export default function BookFilters<T extends string>({ label, options, value, onChange }: BookFiltersProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap justify-center gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`label-caps px-4 py-2 rounded-full border transition-all ${
            value === option
              ? 'bg-ink text-gold-lt border-gold'
              : 'bg-cream text-text/70 border-gold/25 hover:border-gold/60 hover:text-ink'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
