import type { ReactNode } from 'react';
import { createElement, Fragment } from 'react';

// A deliberately small, hand-rolled parser — not full Markdown — covering
// only what the Phase 10 article template actually needs: "## Heading"
// lines for clear sections, and "[label](url)" inline links for natural,
// contextual internal linking within a paragraph. Existing post content
// (plain prose, no "##" or "[...]" syntax) renders exactly as before.

export interface ContentBlock {
  type: 'heading' | 'paragraph';
  text: string;
}

export function parsePostContent(raw: string): ContentBlock[] {
  return raw
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): ContentBlock =>
      block.startsWith('## ')
        ? { type: 'heading', text: block.slice(3).trim() }
        : { type: 'paragraph', text: block },
    );
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Splits a paragraph's text around "[label](url)" links, rendering the
 * link as a real <a> — external targets open in a new tab, internal ones
 * (relative paths) navigate in place. Plain text in between is untouched. */
export function renderInlineLinks(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const [, label, href] = match;
    const external = /^https?:\/\//.test(href);
    parts.push(
      createElement(
        'a',
        {
          key: key++,
          href,
          className: 'text-gold-text underline underline-offset-2 hover:text-ink transition-colors',
          ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
        },
        label,
      ),
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return createElement(Fragment, null, ...parts);
}
