// Templated cover generator for Primegate Notes articles.
//
// Each article gets a 1200x630 editorial cover that matches the site's
// brand (dark ink + champagne gold + Fraunces). The cover is used as
// the OG share image (og:image) for that article and can optionally
// appear as a hero on the article page or thumbnail on the index.
//
// Usage from Node script:
//   import { generateCover } from './scripts/generate-note-cover.mjs';
//   await generateCover({
//     slug: 'reading-the-assignment-clause',
//     title: 'Reading the assignment clause',
//     category: 'Pre-Construction',
//     date: '2026-04-27'
//   });
//
// Usage from CLI:
//   node scripts/generate-note-cover.mjs slug=sample title="Sample title" category="Pre-Construction" date="2026-04-27"
//
// Output: notes/assets/covers/[slug].svg AND notes/assets/covers/[slug].png

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PRIMEGATE_ICON_TOP = '73.33 243.48 73.33 350.14 82.88 350.14 82.88 253.04 170.42 253.04 170.42 340.58 104.57 340.58 95.01 350.14 179.98 350.14 179.98 243.48 73.33 243.48';
const PRIMEGATE_ICON_INNER = '104.57 274.73 148.74 274.73 148.74 318.89 115.81 318.89 115.81 328.45 158.29 328.45 158.29 265.17 95.01 265.17 95.01 350.14 104.57 340.58 104.57 274.73';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Simple word-aware wrap into N visual lines for SVG <tspan>s.
// fontSize is in CSS px. maxWidth is in px (the rendering width budget).
// Approx char width for Fraunces at this scale is ~0.55x the font-size.
function wrapTitle(title, fontSize, maxWidth) {
  const approxCharWidth = fontSize * 0.55;
  const maxCharsPerLine = Math.floor(maxWidth / approxCharWidth);
  const words = title.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? line + ' ' + word : word;
    if (next.length <= maxCharsPerLine || !line) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Pick a font-size that keeps the title to <=3 lines and fits the budget.
function pickTitleFontSize(title, maxWidth) {
  const candidates = [76, 68, 60, 54, 48, 42];
  for (const size of candidates) {
    const lines = wrapTitle(title, size, maxWidth);
    if (lines.length <= 3) return { size, lines };
  }
  return { size: 42, lines: wrapTitle(title, 42, maxWidth) };
}

function formatDate(input) {
  // Accept "2026-04-27" or human-readable strings; pass through if already formatted.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!m) return input;
  const [, y, mo, d] = m;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(d, 10)} ${months[parseInt(mo, 10) - 1]} ${y}`;
}

export function generateCoverSvg({ title, category, date, slug }) {
  const titleMaxWidth = 980; // 1200 viewbox - 110 left margin - 110 right gutter
  const { size: titleSize, lines } = pickTitleFontSize(title, titleMaxWidth);
  const lineHeight = titleSize * 1.05;
  const titleStartY = 350; // y of first baseline
  const titleTspans = lines
    .map((l, i) => `<tspan x="110" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`)
    .join('');
  const dateLabel = escapeXml(formatDate(date).toUpperCase());
  const cat = escapeXml(category.toUpperCase());

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="${escapeXml(title)}. Primegate Notes.">
  <!-- Background -->
  <rect width="1200" height="630" fill="#0A0D14"/>

  <!-- Ambient gold glow, top-right -->
  <defs>
    <radialGradient id="glow-${escapeXml(slug)}" cx="85%" cy="15%" r="42%">
      <stop offset="0%" stop-color="#C9A961" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#C9A961" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow-${escapeXml(slug)})"/>

  <!-- Editorial margin rule -->
  <rect x="60" y="60" width="1080" height="510" fill="none" stroke="#EDE8DC" stroke-opacity="0.10" stroke-width="1"/>

  <!-- Corner signature marks (champagne) -->
  <g stroke="#C9A961" stroke-width="1.5" fill="none" stroke-linecap="square">
    <path d="M 84 84 L 84 108 M 84 84 L 108 84"/>
    <path d="M 1116 84 L 1116 108 M 1116 84 L 1092 84"/>
    <path d="M 84 546 L 84 522 M 84 546 L 108 546"/>
    <path d="M 1116 546 L 1116 522 M 1116 546 L 1092 546"/>
  </g>

  <!-- Top-left: Primegate brand mark icon -->
  <g transform="translate(110, 124) scale(0.32)">
    <polygon fill="#EDE8DC" points="${PRIMEGATE_ICON_TOP}" transform="translate(-73, -243)"/>
    <polygon fill="#EDE8DC" opacity="0.55" points="${PRIMEGATE_ICON_INNER}" transform="translate(-73, -243)"/>
  </g>

  <!-- Top-left: Primegate wordmark -->
  <text x="158" y="156" font-family="'Fraunces', 'Cormorant Garamond', Georgia, serif" font-size="30" font-weight="400" fill="#EDE8DC" letter-spacing="0.005em">Primegate</text>

  <!-- Top-right: NOTES eyebrow with hairline rule -->
  <line x1="1010" y1="148" x2="1042" y2="148" stroke="#C9A961" stroke-width="1"/>
  <text x="1054" y="154" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="500" fill="#C9A961" letter-spacing="3.6">NOTES</text>

  <!-- Category eyebrow -->
  <text x="110" y="280" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="500" fill="#C9A961" letter-spacing="3.8">${cat}</text>

  <!-- Article title -->
  <text x="110" y="${titleStartY}" font-family="'Fraunces', 'Cormorant Garamond', Georgia, serif" font-size="${titleSize}" font-weight="400" fill="#EDE8DC" letter-spacing="-0.02em">${titleTspans}</text>

  <!-- Hairline rule under title block -->
  <line x1="110" y1="510" x2="190" y2="510" stroke="#C9A961" stroke-width="1"/>

  <!-- Date -->
  <text x="110" y="538" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="500" fill="#EDE8DC" fill-opacity="0.65" letter-spacing="2.4">${dateLabel}</text>
</svg>
`;
}

export async function generateCover({ title, category, date, slug, outDir }) {
  const out = outDir || path.resolve(process.cwd(), 'notes/assets/covers');
  await fs.mkdir(out, { recursive: true });
  const svg = generateCoverSvg({ title, category, date, slug });
  const svgPath = path.join(out, `${slug}.svg`);
  const pngPath = path.join(out, `${slug}.png`);
  await fs.writeFile(svgPath, svg, 'utf8');
  await sharp(Buffer.from(svg, 'utf8')).png().toFile(pngPath);
  return { svgPath, pngPath };
}

// CLI: node scripts/generate-note-cover.mjs slug=sample title="..." category="..." date="2026-04-27"
const isMain = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` ||
               import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain) {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    const eq = arg.indexOf('=');
    if (eq === -1) continue;
    args[arg.slice(0, eq)] = arg.slice(eq + 1);
  }
  if (!args.slug || !args.title || !args.category || !args.date) {
    console.error('Usage: node scripts/generate-note-cover.mjs slug=... title="..." category="..." date="2026-04-27"');
    process.exit(1);
  }
  generateCover(args).then(r => {
    console.log('Generated cover:');
    console.log('  SVG:', r.svgPath);
    console.log('  PNG:', r.pngPath);
  }).catch(err => {
    console.error('Cover generation failed:', err);
    process.exit(1);
  });
}
