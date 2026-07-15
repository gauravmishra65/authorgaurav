#!/usr/bin/env node
// One-off/dev script: converts book cover art (public/images/book-covers) to
// WebP so the site ships smaller images. Run with `npm run images:webp` after
// adding a new cover; the .webp output is committed alongside the source
// image, it is not regenerated on every build.
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, basename } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const coversDir = resolve(__dirname, '..', 'public/images/book-covers');

const sourceExts = new Set(['.png', '.jpg', '.jpeg']);

const files = readdirSync(coversDir).filter((f) => sourceExts.has(extname(f).toLowerCase()));

for (const file of files) {
  const src = resolve(coversDir, file);
  const dest = resolve(coversDir, `${basename(file, extname(file))}.webp`);
  await sharp(src).webp({ quality: 82 }).toFile(dest);
  console.log(`Converted ${file} -> ${basename(dest)}`);
}

console.log(`Done. Converted ${files.length} image(s).`);
