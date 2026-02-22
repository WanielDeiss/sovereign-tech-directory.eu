#!/usr/bin/env node
/**
 * Generate og-default.png from og-default.svg for social sharing (1200x630).
 * Run: node scripts/generate-og-image.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'static/images/social/og-default.svg');
const pngPath = join(root, 'static/images/social/og-default.png');

const svg = readFileSync(svgPath);
await sharp(svg)
  .resize(1200, 630)
  .png()
  .toFile(pngPath);
console.log('Written', pngPath);
