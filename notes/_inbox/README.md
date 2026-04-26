# Notes — Inbox

Drop content here when you have a new note ready. Then ask Claude Code (or Taran's site maintainer) to publish.

## What goes in this folder

For each note: one markdown file, plus an optional PDF. Same filename stem (the "slug") on both.

```
notes/_inbox/
├── README.md                                  ← this file (do not delete)
├── reading-the-assignment-clause.md           ← article + metadata, REQUIRED
└── reading-the-assignment-clause.pdf          ← downloadable version, OPTIONAL
```

The slug is lowercase, hyphen-separated, descriptive. It becomes the URL: `primegaterealty.com/notes/reading-the-assignment-clause`.

## The .md file format

YAML front matter at the top, markdown body below:

```markdown
---
title: Reading the assignment clause
category: Pre-Construction
date: 2026-04-26
description: What a restrictive assignment clause actually prevents, and what to negotiate around it.
---

The body of the article in plain markdown.

## A subheading works.

You can use **bold**, *italic*, [links](https://example.com),

> blockquotes,

- bulleted lists,
- and ordered lists.

For a Note callout (gold-accented sidebar):

::: note
This piece is a written observation from the practice. Not legal advice.
:::

For a Caution callout (deeper-ochre sidebar):

::: caution
HST treatment varies. Confirm with your accountant before relying on this.
:::
```

## Required front-matter fields

| Field | What | Example |
|---|---|---|
| `title` | Article title | `Reading the assignment clause` |
| `category` | One of: `Pre-Construction` / `Land` / `Business` / `Private Client` | `Pre-Construction` |
| `date` | Publication date in `YYYY-MM-DD` format | `2026-04-26` |
| `description` | One-line summary, ~150 chars | `What a restrictive assignment clause actually prevents.` |

## How to publish

1. Save the `.md` file (and optional `.pdf`) into this folder. Drag and drop on github.com works fine — open the repo, navigate to `notes/_inbox/`, click "Add file → Upload files", drop them.
2. Open chat with Claude Code.
3. Say: **publish [slug]** (e.g., `publish reading-the-assignment-clause`).
4. Claude does the rest:
   - Renders the article HTML from the existing `_template.html`.
   - Moves the PDF (if present) to `/notes/assets/pdf/[slug].pdf` and uncomments the "Download as PDF" link.
   - Adds the entry to `/notes/index.html` under the right category group (un-hiding the group's `<section>` if it's commented out — Group A is already visible; Groups B and C activate when their first article ships).
   - Archives the inbox files to `/notes/_inbox/_published/[slug]/` for record-keeping.
   - Commits and pushes.
5. Site updates within ~60 seconds (GitHub Pages rebuild) or instantly if hosted on Netlify / Cloudflare Pages.
6. Claude confirms in chat with the live URL.

## What if I don't have a PDF?

Two paths:

- **Skip the PDF.** The "Download as PDF" link on the article page is hidden by default. The article publishes without it.
- **Ask Claude to generate one.** Tell Claude `publish [slug] and generate the PDF`. Claude renders the article HTML through the brand-consistent `pdf-template.html` and saves it to `/notes/assets/pdf/[slug].pdf`. (Requires the optional Puppeteer-based generator script — add to repo on first use.)

## Categories

Four permitted category values (exact casing matters):

- `Pre-Construction`
- `Land`
- `Business`
- `Private Client`

If a note doesn't fit one of these, it probably shouldn't be published.

## Compliance reminders before publishing

Before each note goes live, check:

1. **No legal-practice references.** No language implying current legal advice ("legal review", "attorney-quality", etc.). The site has been scrubbed of legal-background triggers; notes shouldn't reintroduce them.
2. **Anonymize file reviews.** Remove names, addresses, specific deal values, identifying project details.
3. **The disclaimer block** ("This piece is a written observation from the practice. Not legal advice. Legal opinions stay with your lawyer.") is added automatically by the template. Don't delete it.
4. **Past-tense only** for prior experience.
5. **No claims of guaranteed return, dollar volume, or transaction count.**

If unsure about a sentence, defer to Section 5 of `../../LANDING_PAGE_BRIEF_FOR_CLAUDE_CODE.md`.

## What not to add

Per brand direction:

- No author byline ("by Taran Aujla")
- No social share buttons
- No comment section
- No related-articles section
- No newsletter capture
- No next/previous article navigation
- No tag clouds
- No "Coming Soon" language

The article template already excludes all of these. Don't add them back.

## Markdown extensions Claude understands

When converting your markdown to HTML, Claude recognizes:

| Markdown | Renders as |
|---|---|
| `# H1` | (skipped — title comes from front matter) |
| `## H2` | `<h2>` subheading |
| `### H3` | `<h3>` sub-subheading |
| `**bold**` | `<strong>bold</strong>` |
| `*italic*` | `<em>italic</em>` |
| `[text](url)` | `<a href="url">text</a>` |
| `> quote` | `<blockquote>quote</blockquote>` |
| `- item` | unordered list (gold hairline bullets) |
| `1. item` | ordered list (italic-gold numerals) |
| `::: note ... :::` | Note callout (gold sidebar) |
| `::: caution ... :::` | Caution callout (deeper ochre sidebar) |

Anything else? Ask Claude — it can extend the converter or fall back to plain text.
