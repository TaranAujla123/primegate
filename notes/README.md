# Notes. Publishing workflow.

> **Quickest path to publish a new note:** drop your markdown + optional PDF
> into `_inbox/` and ask Claude Code to `publish [slug]`. See
> [`_inbox/README.md`](_inbox/README.md) for the format and steps. The rest of
> this file documents the underlying file structure for maintainers.

This folder is the Primegate **Notes** section. Two levels:

- **Level 1. Index** (`index.html`). The public list of published notes, organized into three groups: Technical Walkthroughs, File Reviews, Market Notes.
- **Level 2. Articles** (individual `.html` files in this folder). Each published note is a standalone HTML page built from `_template.html`.

Every file is plain HTML and shared CSS (`../styles.css`). No build step, no framework, no dependencies.

---

## Folder contents

```
notes/
├── README.md          (this file)
├── _template.html     (article starter. Duplicate, do not publish as-is.)
├── pdf-template.html  (print-ready PDF template. Used during PDF generation.)
├── index.html         (the Notes index. Level 1.)
├── [slug].html        (each published note. One file per note.)
└── assets/
    └── pdf/
        └── [slug].pdf (one PDF per published note, manually generated.)
```

The `assets/pdf/` folder is created the first time a PDF is exported.

---

## Empty-state convention

The Notes index renders only the groups that have at least one real article.

- **Group A (Technical Walkthroughs)** is the only group present in the HTML at launch. Its `<section>` block lives in `index.html` with an empty `.notes-entry-list`. It is auto-hidden by the CSS rule `.notes-group:not(:has(.notes-entry-list a.notes-entry)) { display: none; }` while the list is empty, and it appears the moment the first real `<a class="notes-entry">` is added.
- **Group B (File Reviews)** and **Group C (Market Notes)** are commented out in `index.html`. To activate either group, remove the surrounding HTML comment wrapper and follow the publishing workflow below.

This means: if no articles have been published yet, the index page renders the heading, the intro paragraph, and the closing line ("More notes are added when they are ready."), with no group headers visible. That is the intended launch state until the first article is supplied.

---

## How to publish a new note

**Four file touches.** Two are mechanical.

### Step 1. Create the article HTML

1. Copy `_template.html` to a new file named after the note's slug:
   ```
   cp _template.html reading-the-assignment-clause.html
   ```
   The slug is lowercase, hyphen-separated, descriptive. It becomes the URL: `primegaterealty.com/notes/reading-the-assignment-clause`.

2. Open the new file and fill the eleven TODO slots:
   - `<title>`
   - `<meta name="description">` (~150 characters)
   - `<meta property="og:title">` (same as title)
   - `<meta property="og:description">` (same as description)
   - `<meta property="og:url">` (`https://primegaterealty.com/notes/[slug]`)
   - `<link rel="canonical">` (same URL)
   - `.article-eyebrow` (one of: **Pre-Construction / Land / Business / Private Client**)
   - `.article-title`
   - `.article-date` (format: `YYYY-MM-DD`)
   - `.article-pdf-link` (leave commented out for now. Uncomment in Step 3 after generating the PDF.)
   - `.article-body`

### Step 2a. Generate the cover image

Each note gets a brand-consistent SVG + PNG cover (1200x630, dark
ink + champagne gold, Fraunces serif). The cover is used as the
note's `og:image` for social shares and can optionally appear
inside the article page or on the index thumbnail.

Run the cover generator from the build-v2 root:

```bash
node scripts/generate-note-cover.mjs \
  slug=reading-the-assignment-clause \
  title="Reading the assignment clause" \
  category="Pre-Construction" \
  date="2026-04-27"
```

Outputs:
- `notes/assets/covers/[slug].svg`
- `notes/assets/covers/[slug].png`

The script auto-wraps long titles to 1-3 lines and picks the
font-size that keeps the layout clean. No design work required
per note.

> **Sharp dependency.** The PNG export needs `sharp`. If
> `node_modules/sharp` is not present in build-v2, install it
> once: `npm install sharp`. Or run the script from a directory
> where sharp is already installed (the script is portable).

### Step 2b. Generate the PDF

PDF generation is automated. From the build-v2 root:

```bash
node scripts/generate-note-pdf.mjs slug=reading-the-assignment-clause
```

Output: `notes/assets/pdf/[slug].pdf`.

The script (Puppeteer + headless Chromium):

1. Loads `notes/[slug].html` via `file://`.
2. Pulls the title (with any `<em>` accent), category, date, byline, and the `<meta name="description">` kicker from the article DOM.
3. Injects them into `notes/pdf-template.html`, replacing the body section between the body opener and the disclaimer with the article's full body HTML.
4. Renders to PDF using the template's `@page` rules (Letter, brand-aware running header/footer, dark cover with gold italic title accent, cream body pages, gold hairline above each `<h2>`, gold drop-cap on first paragraph of each section).

> **Title accent.** Wrap a tail fragment of `.article-title` in `<em>...</em>` to control the italic gold accent on the cover. Example: `<h1 class="article-title">Reading the <em>assignment clause</em></h1>`. If no `<em>` is present, the script auto-italicises the last 1-2 words.

> **Puppeteer dependency.** The generator needs `puppeteer` (~150 MB Chromium download). It looks for `node_modules/puppeteer` inside `build-v2/` first; if it's not there, you can either `npm install puppeteer` in build-v2 or symlink/junction `node_modules` to a directory where puppeteer is already installed. On Windows, PowerShell's `New-Item -ItemType Junction -Path ... -Target ...` works without admin rights.

### Step 3. Wire up the PDF download link

In the article's HTML (the one you created in Step 1), find the commented PDF block inside `.article-meta`:

```html
<!--
  PDF DOWNLOAD LINK
  Uncomment AFTER running:  node scripts/generate-note-pdf.mjs slug=[slug]
  ...
<p class="article-pdf-link">
  <a href="assets/pdf/[slug].pdf" download>Download as PDF</a>
</p>
-->
```

Uncomment by removing the surrounding `<!--` and `-->`. Replace `[slug]` in the `href` with the actual filename stem.

If a PDF was not generated for this article, leave the block commented out. The link will not display, and the article's HTML page renders normally.

### Step 4. Add the entry to the index

Open `notes/index.html`. Find the appropriate group (Technical Walkthroughs at launch; File Reviews or Market Notes once their groups are activated). Add a real entry inside the `.notes-entry-list` container using this pattern:

```html
<a class="notes-entry" href="reading-the-assignment-clause.html">
  <span class="notes-entry-tag">Pre-Construction</span>
  <div class="notes-entry-text">
    <h3>Reading the assignment clause</h3>
    <p class="notes-entry-desc">What a restrictive assignment clause actually prevents, and what to negotiate around it.</p>
  </div>
  <span class="notes-entry-date">14 Jun 2026</span>
</a>
```

The CSS rule `.notes-group:not(:has(.notes-entry-list a.notes-entry))` un-hides the section automatically the moment a real entry exists.

### Step 5. Test locally

From `build-v2/`:

```
python -m http.server 8000
```

Open `http://localhost:8000/notes/`. Confirm:

- The new entry appears in the right group.
- The group header and description are visible.
- Clicking the entry loads the article.
- The article title, date, category tag, and body all render.
- If you uncommented the PDF link, "Download as PDF" appears below the date and downloads the file.
- The "Return to Notes" links at top and bottom both work.

---

## Activating a previously hidden group

To activate **File Reviews** (Group B) or **Market Notes** (Group C):

1. In `notes/index.html`, find the comment block beginning `============================== GROUP B: FILE REVIEWS` or `============================== GROUP C: MARKET NOTES`.
2. Remove the outer HTML comment wrapper (the leading `<!--` and trailing `-->` that surround the entire `<section>` block).
3. Add the first real `<a class="notes-entry">` entry inside its `.notes-entry-list`, following the pattern in Step 4 above.

The CSS auto-hide rule keeps the group invisible until that first entry is added, so you can un-comment the structure before content is ready and nothing changes visually. The group only becomes visible once a real entry is in place.

---

## Categories

Five permitted category tags (exact casing matters for consistency):

- `Pre-Construction`
- `Land`
- `Business`
- `Private Client`
- `All Categories` (use only for technical pieces that span all four; see below)

The first four match the four categories described on the main
page. If a note does not fit one of these four, it probably
should not be published.

Use **`All Categories`** only when a piece is genuinely
cross-cutting (e.g. a technical walkthrough on something that
applies equally to pre-construction, land, businesses, and
private representation). The eyebrow on the article and the
pill on the index entry will both read "All Categories" in
small caps.

---

## Article shell anatomy (web)

Each article has three full-width bands:

1. **`.article-hero`** (dark navy). Holds the eyebrow / title / date / byline / "Download as PDF" link. Matches the brand's editorial header treatment.
2. **`.article-paper.panel-light`** (cream). The reading column, with two children:
   - **`.article-toc`** (sticky dark card with gold links). Auto-built from `<h2>` headings inside `.article-body`. Hidden below 1024px viewport. Hidden entirely if the article has fewer than two `<h2>`s. Highlights the active section as the reader scrolls.
   - **`.article-body-wrap`** containing the prose, the closing divider, and the disclaimer.
3. **`.article-tail`** (dark). Bottom return-to-Notes link.

The cream-paper styles in `styles.css` (search for `.article-paper .article-body`) override the body's bone-on-ink colors with paper-ink and reduce `<strong>` to weight 500 so prose doesn't read as visually bold. Each `<h2>` automatically gets a short gold hairline above it and a gold serif drop-cap on the first paragraph after it (search for `.article-paper .article-body h2`).

## PDF template specifications

For reference. Documented here so a future maintainer can rebuild or extend `pdf-template.html`.

| Attribute | Value |
|---|---|
| Page size | US Letter (8.5 in by 11 in) |
| Margins | 1.0 in top, 1.1 in bottom, 0.85 in left, 0.85 in right |
| Single column | Yes |
| Title page | Category eyebrow, large serif title, publication date, hairline gold rule, Primegate mark |
| Running header (every page) | Primegate logomark and wordmark left, "NOTES" small caps right, hairline rule beneath |
| Running footer (every page) | Article URL left, page number center, "Not legal advice. Legal opinions stay with your lawyer." right (italic) |
| Body typography | Fraunces serif at 11pt, 1.55 line height |
| H2 | Fraunces 18pt 400 weight |
| H3 | Fraunces 13pt 500 weight |
| Lists | Hairline gold dash bullets, italic gold numerals |
| Blockquote | Italic, gold left rule, smaller indent |
| Callout (Note) | Gold left rule, soft champagne background |
| Callout (Caution) | Deeper ochre rule and background |
| Final disclaimer | Italic, top hairline rule, muted color |

---

## What NOT to add to a note

- No author byline. The practice is the byline. Context is on the page.
- No social share buttons.
- No comment section.
- No related-articles section.
- No newsletter capture.
- No next/previous article navigation.
- No tag clouds.
- No category filtering or search on the index.
- No "Coming Soon" language anywhere.
- No dates on placeholder entries (placeholder entries should not be published at all under the empty-state convention).

If a future revision asks for any of the above, push back and escalate to Taran.

---

## Compliance requirements for every note

Before publishing, each note must:

1. **Make no claim** of current legal practice. **Make no reference** to former legal practice in any form. Pass 1 (April 2026) removed all such references from the public site.
2. **Use no language** suggesting legal services: "legal-grade," "attorney-quality," "legal review," "legal advice," or any variant.
3. **Include** the `.article-disclaimer` block at the bottom (the template includes it by default; do not delete).
4. **Anonymize** any file review. Remove names, addresses, specific deal values, identifying project details.
5. **Display** "HomeLife G1 Realty Inc., Brokerage" in the footer. Display "Primegate" only paired with the brokerage name. The footer template handles this.
6. **Use** "Salesperson" rather than "Sales Representative" throughout, consistent with current TRESA usage.
7. **Avoid** em dashes in user-visible strings. Use commas, periods, or parentheses instead.
8. **Run through** `../LANDING_PAGE_BRIEF_FOR_CLAUDE_CODE.md` Section 5 compliance rules. If in doubt, do not publish.

---

## URL and routing

Each article lives at a top-level path under `/notes/`:

- `/notes/` (index, Level 1)
- `/notes/[slug]` or `/notes/[slug].html` (individual article, Level 2)

On most static hosts (Netlify, Vercel, Cloudflare Pages, GitHub Pages), `[slug].html` works. If the host supports clean URLs, configure them via `_redirects`, `vercel.json`, or the host's equivalent.

Internal links in the index use relative paths (`reading-the-assignment-clause.html`), which work regardless of how the host resolves extensions.

---

## Questions

See `../README.md` for the main project docs, or contact Taran directly.
