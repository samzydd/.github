#!/usr/bin/env node
// Downloads the raster assets (photos, template thumbnails, avatars, QR code)
// from the "mc v2" section of the Figma file into public/assets/images.
//
// Usage:
//   FIGMA_TOKEN=<personal access token> npm run fetch-assets
//
// Each asset is the rendered export of the exact image layer used in the
// design, so crops and fits match the Figma frames.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE_KEY = 'UgiIveCwRYifQFdoXliO2e';
const SCALE = 2;

/** file name (without extension) -> Figma node id of the image layer */
const ASSETS = {
  'thumb-sell360-social': 'I1:3280;16427:86002',
  'thumb-sell360-playbook': 'I1:3950;16427:86002',
  'thumb-rtsell-postcard': 'I1:3383;16427:86002',
  'thumb-refer-earn': 'I1:3385;16427:86002',
  'thumb-renovate-and-sell': 'I1:3386;16427:86002',
  'thumb-renovate-to-sell-social': 'I1:3387;16427:86002',
  'thumb-revive-partner-op': 'I1:3388;16427:86002',
  'search-sell360-social': 'I1:4123;16480:158914',
  'search-rtsell-postcard': 'I1:4124;16480:158914',
  'search-sell360-playbook': 'I1:4125;16480:158914',
  'search-refer-earn': 'I1:4126;16480:158914',
  'project-house': 'I1:3296;16537:16237',
  'template-preview-sell360': '1:3809',
  'avatar-michelle': 'I1:3266;27365:28045;27381:7586',
  'avatar-michelle-lg': '1:3843',
  'logo-avatar': '1:3846',
  'app-qr': 'I1:3266;27363:26652',
};

const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.error('Set FIGMA_TOKEN to a Figma personal access token with read access to the file.');
  process.exit(1);
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'images');
await mkdir(outDir, { recursive: true });

const ids = Object.values(ASSETS).join(',');
const res = await fetch(
  `https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=${SCALE}`,
  { headers: { 'X-Figma-Token': token } },
);
if (!res.ok) {
  console.error(`Figma images request failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const { images = {}, err } = await res.json();
if (err) {
  console.error(`Figma reported an error: ${err}`);
  process.exit(1);
}

let failed = 0;
for (const [name, id] of Object.entries(ASSETS)) {
  const url = images[id];
  if (!url) {
    console.error(`✗ ${name}: no export URL returned for node ${id}`);
    failed++;
    continue;
  }
  const img = await fetch(url);
  if (!img.ok) {
    console.error(`✗ ${name}: download failed (${img.status})`);
    failed++;
    continue;
  }
  await writeFile(join(outDir, `${name}.png`), Buffer.from(await img.arrayBuffer()));
  console.log(`✓ ${name}.png`);
}
process.exit(failed ? 1 : 0);
