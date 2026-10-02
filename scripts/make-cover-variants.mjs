#!/usr/bin/env node
// Generates smaller responsive copies of each book cover so a phone loading a
// 110px-wide card thumbnail doesn't download the same 666px-wide image the
// hero uses. For every `<slug>-gaurav-mishra-book-cover.webp` in
// public/images/book-covers it writes `-160`, `-240`, `-320`, `-480` and `-640` (.webp)
// siblings (never enlarging a narrower source). BookCover builds its `srcset`
// from exactly these names. Run `npm run images:variants` after adding or
// replacing a cover; the output is committed, not regenerated on every build.
import { existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public/images/book-covers');
const WIDTHS = [160, 240, 320, 480, 640];
const sources = readdirSync(dir).filter((f) => /-gaurav-mishra-book-cover\.webp$/.test(f));

let made = 0;
for (const file of sources) {
  const base = file.replace(/\.webp$/, '');
  for (const width of WIDTHS) {
    const out = resolve(dir, `${base}-${width}.webp`);
    // Regenerate when the source is newer, so replacing a cover refreshes its variants.
    if (existsSync(out) && statSync(out).mtimeMs >= statSync(resolve(dir, file)).mtimeMs) continue;
    await sharp(resolve(dir, file)).resize({ width, withoutEnlargement: true }).webp({ quality: 76 }).toFile(out);
    made++;
  }
}
console.log(`${sources.length} cover(s) checked, ${made} variant file(s) written.`);
