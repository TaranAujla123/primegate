// Automated PDF generator for Primegate Notes articles.
//
// Reads a published article HTML from notes/[slug].html, extracts
// the title, category, date, and body, injects them into the
// brand-locked pdf-template.html, and uses Puppeteer to render a
// Letter-size PDF with the template's running header/footer and
// gold-accent print CSS.
//
// Usage from chat / CLI:
//   node scripts/generate-note-pdf.mjs slug=deals-between-signing-and-closing
//
// Output: notes/assets/pdf/[slug].pdf
//
// Dependency: puppeteer (installs ~150MB of Chromium on first install).
// The script can run from any directory that has puppeteer installed in
// node_modules; the buildRoot is auto-detected from the script's path.

import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

async function detectBuildRoot(explicitRoot) {
  const candidates = [
    explicitRoot,                                   // CLI/arg override (highest priority)
    path.resolve(SCRIPT_DIR, '..'),                 // when run from scripts/
    process.cwd(),                                  // when run from build-v2 itself
    path.resolve(process.cwd(), 'build-v2'),        // when run from one level up
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      await fs.access(path.join(c, 'notes', 'pdf-template.html'));
      return c;
    } catch {}
  }
  throw new Error('Could not locate build-v2 root (looking for notes/pdf-template.html). Pass buildRoot=...');
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function generateNotePdf({ slug, buildRoot }) {
  const root = await detectBuildRoot(buildRoot);
  const articlePath = path.join(root, 'notes', `${slug}.html`);
  const pdfTemplatePath = path.join(root, 'notes', 'pdf-template.html');
  const pdfOutDir = path.join(root, 'notes', 'assets', 'pdf');
  const pdfOutPath = path.join(pdfOutDir, `${slug}.pdf`);

  // Sanity check
  await fs.access(articlePath);
  await fs.access(pdfTemplatePath);

  // Read source files
  const pdfTemplate = await fs.readFile(pdfTemplatePath, 'utf8');

  // Convert local file path to a file:// URL Puppeteer can navigate to
  const articleFileUrl = 'file:///' + articlePath.replace(/\\/g, '/');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Step 1: load the published article and pull title / eyebrow (category) /
    // date / byline / kicker / body / canonical URL. We pull the title's
    // existing innerHTML so an in-source <em> already marks the gold-italic
    // accent fragment; if no <em> is present, the script italicises the
    // last 1-3 words automatically (cover-page brand signature).
    await page.goto(articleFileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    const article = await page.evaluate(() => ({
      titleHtml:    document.querySelector('.article-title')?.innerHTML?.trim() || '',
      titleText:    document.querySelector('.article-title')?.innerText?.trim() || '',
      category:     document.querySelector('.article-eyebrow')?.innerText?.trim() || '',
      date:         document.querySelector('.article-date')?.innerText?.trim() || '',
      byline:       document.querySelector('.article-byline')?.innerText?.trim() || '',
      kicker:       document.querySelector('meta[name="description"]')?.content?.trim() || '',
      bodyHtml:     document.querySelector('.article-body')?.innerHTML?.trim() || '',
      canonicalUrl: document.querySelector('link[rel="canonical"]')?.href || ''
    }));

    if (!article.titleText || !article.bodyHtml) {
      throw new Error(`Could not extract content from ${articlePath} — missing .article-title or .article-body`);
    }

    // Default byline if the article omits one (so the cover never blanks).
    const byline = article.byline || 'Taran Aujla, Salesperson';

    // Build the cover-page title HTML. If the source title already contains
    // an <em>, trust it (manual accent control). Otherwise auto-italicise
    // the last 2 words (or 1 if the title is short) to give the gold italic
    // accent the brand uses on every cover.
    let coverTitleHtml = article.titleHtml;
    if (!/<em\b/i.test(coverTitleHtml)) {
      const words = article.titleText.replace(/\s+/g, ' ').split(' ');
      const accentCount = words.length >= 6 ? 2 : 1;
      const accentStart = words.length - accentCount;
      const lead = words.slice(0, accentStart).join(' ');
      const accent = words.slice(accentStart).join(' ');
      coverTitleHtml = lead
        ? `${escapeHtml(lead)} <em>${escapeHtml(accent)}</em>`
        : `<em>${escapeHtml(accent)}</em>`;
    }

    // Step 2: inject content into the PDF template.
    let pdfHtml = pdfTemplate;

    // Footer URL: prefer the article's own canonical, falling back to the slug.
    const footerUrl = article.canonicalUrl
      ? article.canonicalUrl.replace(/^https?:\/\//, '')
      : `primegaterealty.com/notes/${slug}`;
    pdfHtml = pdfHtml.replace(/primegaterealty\.com\/notes\/\[slug\]/g, footerUrl);

    // Title-page slots (case-insensitive on the literal placeholder strings).
    pdfHtml = pdfHtml.replace(/\[CATEGORY\]/gi, escapeHtml(article.category || 'All Categories'));
    pdfHtml = pdfHtml.replace(/\[Note title\]/g, coverTitleHtml);
    pdfHtml = pdfHtml.replace(/\[YYYY-MM-DD\]/g, escapeHtml(article.date));
    pdfHtml = pdfHtml.replace(/\[BYLINE\]/g, escapeHtml(byline));
    pdfHtml = pdfHtml.replace(/\[KICKER\]/g, escapeHtml(article.kicker));

    // Body section: replace everything inside .pdf-body section that sits
    // between the section opener and the disclaimer paragraph with the
    // article's actual body HTML.
    const bodySectionRegex = /(<section class="pdf-page pdf-body">)([\s\S]*?)(<p class="pdf-disclaimer">)/;
    const replacement = `$1\n\n${article.bodyHtml}\n\n    $3`;
    pdfHtml = pdfHtml.replace(bodySectionRegex, replacement);

    // Step 3: render the assembled HTML to PDF. Use 'domcontentloaded'
    // (not 'networkidle0') because Puppeteer's setContent doesn't always
    // fire the network-idle event reliably with file:// resources.
    await page.setContent(pdfHtml, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for fonts (Google Fonts CSS + WOFF) to finish loading so
    // Fraunces is rendered correctly in the PDF instead of the fallback.
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    });
    // Small additional buffer for any late layout
    await new Promise(r => setTimeout(r, 500));

    await fs.mkdir(pdfOutDir, { recursive: true });
    await page.pdf({
      path: pdfOutPath,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true, // honour the @page rule from pdf-template.html
      margin: { top: '0', bottom: '0', left: '0', right: '0' }, // template handles its own margins
      displayHeaderFooter: false
    });

    return { pdfPath: pdfOutPath, articleTitle: article.titleText };
  } finally {
    await browser.close();
  }
}

// CLI: node scripts/generate-note-pdf.mjs slug=deals-between-signing-and-closing
const isMain = import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` ||
               import.meta.url === pathToFileUrl(process.argv[1]);

function pathToFileUrl(p) { return 'file:///' + path.resolve(p).replace(/\\/g, '/'); }

if (isMain) {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    const eq = arg.indexOf('=');
    if (eq === -1) continue;
    args[arg.slice(0, eq)] = arg.slice(eq + 1);
  }
  if (!args.slug) {
    console.error('Usage: node scripts/generate-note-pdf.mjs slug=[slug] [buildRoot=...]');
    process.exit(1);
  }
  generateNotePdf(args).then(r => {
    console.log('Generated PDF:', r.pdfPath);
    console.log('Article title:', r.articleTitle);
  }).catch(err => {
    console.error('PDF generation failed:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  });
}
