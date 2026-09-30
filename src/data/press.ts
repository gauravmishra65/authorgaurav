export interface PressQuote {
  quote: string;
  source: string;
}

// No real press mentions exist yet — this must stay empty (PressStrip
// renders nothing when it is) rather than carry placeholder outlet quotes.
// It previously held three fabricated quotes attributed to made-up outlets
// ("The Reading Room", "Bookish Weekly", "Literary Notes"), which rendered
// live on the homepage as if they were real reviews — exactly what the
// master plan's "do not fabricate reviews/media appearances" rule and
// Part 36's "only render verified items" both prohibit. Add a real quote
// here only once a real outlet has actually published one, with a source
// you could point to if asked.
export const pressQuotes: PressQuote[] = [];
