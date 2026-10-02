import { expect, test } from '@playwright/test';
import { routes } from './routes';

// axe's colour-contrast rule reports most text on this site as "incomplete"
// (it cannot resolve backgrounds through the page's dot texture), so a clean
// axe run does not prove contrast. This test measures it directly: every
// visible text node against the nearest opaque background colour up its
// ancestor chain (alpha-blended), at WCAG AA - 4.5:1, or 3:1 for large text.
//
// Skipped on purpose, each checked by other means:
//  - text on gradient backgrounds (the gold buttons - a flat colour can't
//    describe them; dark ink on gold is ~6:1),
//  - the header and dialogs (translucent over the page, so the nearest
//    opaque ancestor is not what the eye sees),
//  - disabled controls and aria-hidden subtrees.
test.use({ reducedMotion: 'reduce' }); // settle entrance animations instantly

for (const route of routes) {
  test(`text contrast: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForSelector('h1', { timeout: 10000 });
    await page.waitForTimeout(800);

    const failures = await page.evaluate(() => {
      type RGBA = { r: number; g: number; b: number; a: number };
      const parse = (c: string): RGBA | null => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
        return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
      };
      const lum = ({ r, g, b }: RGBA) => {
        const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const blend = (fg: RGBA, bg: RGBA): RGBA => ({
        r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1,
      });
      const visible = (el: Element) => {
        const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
      };
      const chainOpacity = (el: Element | null) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; };
      const hasGradient = (el: Element | null) => { for (let e = el; e; e = e.parentElement) if (/gradient\(/.test(getComputedStyle(e).backgroundImage) && !/radial-gradient\(rgba\(42/.test(getComputedStyle(e).backgroundImage)) return true; return false; };
      const backdrop = (el: Element): RGBA => {
        const layers: RGBA[] = [];
        for (let e: Element | null = el; e; e = e.parentElement) {
          const c = parse(getComputedStyle(e).backgroundColor);
          if (c && c.a > 0) { layers.push(c); if (c.a >= 0.99) break; }
        }
        let base: RGBA = { r: 247, g: 243, b: 235, a: 1 }; // the page's ivory
        for (let i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base);
        return base;
      };

      const out: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = (n.textContent ?? '').trim();
        const el = n.parentElement;
        if (!text || !el || !visible(el)) continue;
        if (el.closest('script,style,noscript,header,[role="dialog"],[aria-hidden="true"],[inert],:disabled')) continue;
        if (hasGradient(el)) continue;
        const cs = getComputedStyle(el);
        const fg = parse(cs.color);
        const opacity = chainOpacity(el);
        if (!fg || opacity < 0.3) continue;
        const bg = backdrop(el);
        const eff = blend({ ...fg, a: fg.a * opacity }, bg);
        const l1 = lum(eff), l2 = lum(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const size = parseFloat(cs.fontSize);
        const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700);
        if (ratio < (large ? 3 : 4.5)) {
          out.push(`${ratio.toFixed(2)}:1 "${text.slice(0, 30)}" <${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 50)}">`);
        }
      }
      return [...new Set(out)];
    });

    expect(failures, `low-contrast text on ${route}:\n${failures.join('\n')}`).toEqual([]);
  });
}
