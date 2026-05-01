# Primegate Landing Page — build-v2

**Status:** DRAFT. Do not deploy until the four gates in `../DEPLOYMENT_GATES.md` are cleared.

**Brand rule (non-negotiable):** The displayed brand is **Primegate** alone. Never "Primegate Realty," "Primegate Real Estate," "Primegate Group," or any entity-suggestive suffix on the visible page. The domain `primegaterealty.com` is an address, not a brand display — it's fine.

---

## File structure

```
build-v2/
├── index.html              # Main landing page. Hero, four categories, six standards, about, for clarity, two-path intake, footer.
├── styles.css              # Full visual system, design tokens at :root. Shared with /notes pages.
├── README.md               # This file
├── assets/
│   ├── primegate-mark.svg       # Two-tone brand mark (navy + blue). Primary use.
│   ├── primegate-mark-mono.svg  # Single-colour mark, inherits currentColor.
│   ├── favicon.svg              # Browser-tab mark (ink + gold).
│   ├── og-image.svg             # Source for social share card (1200x630).
│   ├── og-image.png             # [TO GENERATE] PNG export of og-image.svg.
│   └── portrait.jpg             # [TO ADD] Editorial portrait, 4:5 ratio. Replaces the editorial SVG in About section.
├── notes/                   # Notes section (see notes/README.md for publishing workflow)
│   ├── README.md                # Notes publishing workflow.
│   ├── _template.html           # Reusable article template.
│   ├── pdf-template.html        # Print-ready PDF template. Used during PDF generation.
│   ├── index.html               # Notes index (Level 1). Lists published notes by group.
│   └── assets/
│       └── pdf/                 # [created on first export] one PDF per published note.
└── _archive/                # Reference files, not deployed.
    └── notes-sample-deleted-pre-launch.html
```

All files are plain HTML / CSS / SVG — **no build step, no npm, no framework**. Open `index.html` in a browser to preview. Host on any static provider (Netlify, Vercel, Cloudflare Pages, GitHub Pages, traditional web host).

---

## How to preview locally

Just double-click `index.html`, or from the folder:

```bash
# Python 3
python -m http.server 8000

# or Node (if installed)
npx serve .
```

Then open `http://localhost:8000`.

---

## How to update copy

All copy lives in `index.html`. The file is heavily commented — search for the section label (e.g. `<!-- ============================== HERO ==============================` `-->`) to jump to the block you want.

**Before changing any copy, read `../LANDING_PAGE_BRIEF_FOR_CLAUDE_CODE.md` Section 5 (compliance rules).** Note: Pass 1 (April 2026) introduced new voice rules that take precedence where they conflict with the brief:

- Never display "Primegate" with "Realty," "Group," "Real Estate," "Brokerage," or any suffix.
- Never use "legal-grade," "legal review," "attorney-quality," "top 1%," or urgency copy.
- Make no reference to former legal practice anywhere on the public site.
- Use "Salesperson" rather than "Sales Representative" throughout, consistent with current TRESA usage.
- Use "transaction note" instead of "diligence note" everywhere.
- No em dashes anywhere. Use commas, periods, or parentheses instead.
- The regulatory disclosure block in the footer is mandatory. Treatment may change, substance may not.

---

## How to swap the portrait

See **"Replacing the editorial portrait mark with a real photograph"** further down this README. Short version: save the portrait as `assets/portrait.jpg` at 4:5 ratio, replace the inline `<svg>` inside `<div class="portrait-artwork">` with an `<img>` tag. No CSS changes required.

---

## How to change the form endpoints

The intake section now has **two forms** — a short "Referred" path and the full "New introduction" path — that post to the **same Formspree endpoint**. A hidden `intake_path` field (values: `referred` or `new-introduction`) lets you tell them apart in your inbox. Email subject lines are pre-set via `_subject` so you can filter / sort at a glance.

### Formspree (recommended — easiest)

1. Create a free account at https://formspree.io
2. Create one new form. Copy the form URL — looks like `https://formspree.io/f/xyzabcde`.
3. In `index.html`, find the `REPLACE_WITH_YOUR_FORM_ID` placeholder — it appears **twice** (once per form). Use the same form ID in both.
4. Save. Submissions from both paths will land in the same Formspree inbox, tagged by subject line and by the `intake_path` field.

**If you later want separate inboxes:** create two Formspree forms and use each one's ID in the matching `action` attribute. Form names are already distinct (`primegate-intake-referred` vs `primegate-intake-new`) for routing.

### Netlify Forms (if hosting on Netlify)

1. In `index.html`, find the `<form>` tag.
2. Remove `action="…"` and `method="POST"`.
3. Add `data-netlify="true"` and a `name` attribute (already present as `name="primegate-intake"`).
4. Deploy to Netlify. Submissions appear in the Netlify Forms dashboard.

### Any other backend (your own server)

Replace `action` with your endpoint URL. The form posts standard `application/x-www-form-urlencoded` fields: `name`, `email`, `phone`, `lane`, `timeline`, `notes`, `_gotcha` (honeypot — ignore).

### Honeypot spam trap

The form includes a hidden `_gotcha` field (positioned off-screen). Real users don't fill it; bots do. Formspree respects `_gotcha` out of the box. If you use a different backend, ignore submissions where `_gotcha` is non-empty.

---

## How to add a project / deal / listing to a lane

The page is currently purely informational, but each lane has a commented-out showcase scaffold ready to activate.

**To add a project under a lane** (e.g. Lane 01 — Higher-End Pre-Construction):

1. Open `index.html`, find the lane's `<article class="lane">` block.
2. Locate the `<!-- DEAL-SHOWCASE-SCAFFOLD: … -->` comment.
3. **Un-comment the HTML inside** (remove the `<!--` and the matching `-->` that wrap the `<div class="showcase" hidden>` block).
4. **Remove `hidden`** from the `<div class="showcase">` tag.
5. **Populate the `<li class="showcase-item">` block** — title, location, price floor, one-line note, link if public.
6. **Duplicate `<li class="showcase-item">` for each additional project.**

The scaffold has no CSS yet — minimal styles for `.showcase`, `.showcase-label`, `.showcase-list`, `.showcase-item` need to be added when the first project is ready. That's a v3 task, not needed for v2 launch.

**Compliance reminder when adding any deal:**

- Do **not** use "guaranteed return," "guaranteed appreciation," "best deal," "exclusive access" (RECO misleading-advertising rule)
- Facts only — builder, unit type, price floor, neighbourhood, one-line positioning
- If quoting numbers beyond the published builder pricing, verify with the builder's sales office first
- For any project on MLS, include the MLS number and co-brokerage credit where applicable

---

## How to add testimonials (once real ones exist)

**Do not populate with stock quotes or placeholder text.** Brief Section 5 rule 10: testimonials are scaffolded but hidden until genuine quotes exist and written consent has been obtained.

1. Get the quote in writing. Save the signed consent form to `../../03_Compliance/Testimonial_Consent/`.
2. Open `index.html`, find the `TESTIMONIAL-SCAFFOLD` comment block.
3. Remove the outer HTML comment wrapper (`<!--` and `-->`) that surrounds the `<section id="testimonials">`.
4. Remove the `hidden` attribute on the `<section>`.
5. Populate `<blockquote class="testimonial">` — use exact wording from the consent form, attribute by first name + role/city.
6. Add minimal testimonial CSS to `styles.css` when ready.

---

## Social share preview (Open Graph image)

When your URL is pasted into LinkedIn, WhatsApp, iMessage, Slack, email, etc., those platforms fetch a preview card. The card's image is specified in the HTML `<meta property="og:image">` tag and currently points to `assets/og-image.png`.

**Before deploy:**

1. Open `assets/og-image.svg` in a browser, Figma, Illustrator, or any SVG viewer to confirm the design. Edit the SVG source if you want to change copy or colours.
2. Export the SVG to a **PNG at 1200×630 pixels**. Quick options:
   - **Figma:** import the SVG → export as PNG @ 1x (confirm 1200×630)
   - **Online:** https://cloudconvert.com/svg-to-png (set width 1200, height 630)
   - **ImageMagick CLI:** `magick -density 300 -background none assets/og-image.svg -resize 1200x630 assets/og-image.png`
3. Save the PNG to `assets/og-image.png` (overwriting or creating).
4. After deploy, test by pasting your URL into LinkedIn's Post Inspector (https://www.linkedin.com/post-inspector/) and the OpenGraph Debugger (https://www.opengraph.xyz/).

If you change the SVG later, repeat the export.

---

## Replacing the editorial portrait mark with a real photograph

The About section currently shows a dark architectural gate composition (SVG) in place of a portrait. When the commissioned editorial portrait is ready:

1. Crop and save the portrait as `assets/portrait.jpg` (or `.webp`) at **4:5 aspect ratio** (e.g. 640×800 or 1200×1500 for retina).
2. In `index.html`, find the `<div class="portrait-artwork">` block inside the About section.
3. Replace the inline `<svg>...</svg>` with:

   ```html
   <img
     src="assets/portrait.jpg"
     alt="Taran Aujla, Salesperson"
     width="640"
     height="800"
     loading="lazy"
   />
   ```

4. No CSS changes needed. The `.portrait-artwork` wrapper preserves the 4:5 aspect ratio and framing. The image fills the slot via `object-fit: cover`.

The SVG composition is deliberately editorial (a margin-and-rule composition: italic serif quotation glyph in champagne gold, long horizontal gold rule beneath, three proportion ticks). Leaving it in for the first few weeks post-launch is perfectly acceptable. It does not read as a placeholder.

---

## Regulatory number / RECO registration

The footer contains a placeholder: `RECO Registration No.: [pending registration]`.

Once RECO issues the registration number (Gate 1 of deployment):

1. Open `index.html`.
2. Search for `regnum-value`.
3. Replace `[pending registration]` with the number.

---

## Design tokens (quick reference)

All colours and scale values are defined at the top of `styles.css` under `:root`. To adjust globally (e.g. change the accent colour), edit there only.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0E1F3A` | Primary headings, links, buttons |
| `--ink-deep` | `#07132A` | Footer background |
| `--accent` | `#A8824A` | Warm ochre — eyebrows, pullquote rule, hero hairline |
| `--cream` | `#FBF8F1` | Page background |
| `--paper` | `#F4EEDF` | Intake form, inset panels |
| `--body` | `#1A1D24` | Body text |
| `--muted` | `#5C5F68` | Secondary text, leads |
| `--rule` | `#E4DCC8` | Section dividers, form borders |

Typography: Playfair Display (headlines, pullquote, italic emphasis) + Inter (body, UI, labels). Loaded from Google Fonts with `&display=swap`.

---

## Accessibility

- Semantic landmarks (`header`, `main`, `footer`, `nav`, `section`, `article`)
- Skip-to-main link (first focusable element)
- Visible focus ring (2px warm ochre) on all interactive elements
- Mobile nav toggle uses proper ARIA (`aria-expanded`, `aria-controls`)
- Form labels explicitly associated; required fields marked with both visible asterisk and `required` attribute
- `prefers-reduced-motion` honoured
- All interactive contrast ratios target WCAG 2.1 AA (4.5:1 body, 3:1 large text)

**Before deploy:** run a full accessibility check per `design:accessibility-review` skill. Confirm contrast on all ochre-on-cream and muted-text combinations.

---

## Performance

- Zero JavaScript frameworks, zero bundlers
- One inline `<script>` for mobile-nav toggle (~20 lines)
- Google Fonts preconnected
- SVG mark is inline in the HTML (no HTTP request for the top-bar mark)
- Portrait image should be `.webp` and lazy-loaded when added

Estimated Lighthouse: Performance 98+, Accessibility 100, Best Practices 100, SEO 100 once deployed with HTTPS and a valid robots.txt.

---

## Analytics

**Intentionally omitted from v2.** No Google Analytics, no Facebook Pixel, no tracking. Brief Section 6 recommends Plausible or Fathom if needed — wire those in at deployment, not in draft.

---

## Compliance gates before deploy

See `../DEPLOYMENT_GATES.md`. All four must be cleared in writing:

1. **RECO registration active** — update `[pending registration]` in footer
2. **BoR written approval** from Jeevan Punni for "Primegate" as a personal practice mark
3. **HomeLife franchise review** — confirm with Khaqan Mehmood whether HomeLife logo must be added to footer
4. **RECO advertising compliance review** — final pass against Bulletin 5.1, 5.2, 5.3

---

## Behavioural details (for future maintainers)

Three design details that are not obvious from reading the CSS:

**1. Top bar inverts over cream panels.**
The sticky navigation is normally dark (ink + translucent blur). When scrolled over the two cream sections (About, Intake), a small JavaScript routine adds an `.over-light` class to the `.topbar` element, switching it to cream-on-dark-text to maintain contrast. No action needed from you — it's automatic. If you add a new cream-toned section, give its `<section>` the class `panel-light` and the inversion will apply there too.

**2. Prose uses old-style (text) numerals; UI elements use lining (data) numerals.**
Body paragraph text uses old-style figures via Fraunces's `oldstyle-nums` variant — this makes digits in prose feel like they belong in a book, not a spreadsheet. UI elements (lane numerals 01/02/03, form labels, buttons, section labels) use lining figures so numbers read as graphic. The split is defined at the top of `styles.css` under the `body` block and the `.lane-num, .pillar-num, ...` selector. If you add new content areas, either category may work — test and pick what reads better.

**3. Subtle scroll reveal is opt-in.**
A fade-in-on-scroll effect exists in the inline `<script>` at the bottom of `index.html`, but it only applies to elements with a `data-reveal` attribute. No elements currently have it. Add `data-reveal` to any element you want to fade in when it enters the viewport. Respects `prefers-reduced-motion`.

---

## Version history

- **v3.0.7** (2026-05-01) For Clarity item 1 swapped. "First-time buyer programs." (with sub-$1M referral-out gloss) → "Broadcast marketing." with new gloss: "Growth here is built on relationships, network, and deliberate strategy, not broadcast content and follower counts. Focused by design." Repositions the practice's first do-not item from a price-floor signal to a marketing-philosophy signal. Other four items unchanged.
- **v3.0.6** (2026-05-01) Pullquote rewritten. "If the position is right, I press. If it is not, I say so. If the deal belongs elsewhere, I point you there." → "The difference between a good deal and a bad one is decided before the offer goes in." Visual treatment unchanged (italic Fraunces, gold quotation glyph above, centered).
- **v3.0.5** (2026-04-30) Two changes. (1) Hero H1 line 2: "Read carefully" → "Handled carefully" (better matches the "deals are won" framing on line 1). (2) Six standards Roman numerals (I–VI) now render in champagne gold. The .pillar-num rule already declared color: var(--gold) but was being overridden by a later .pillar p { color: var(--bone-muted) } rule with equal specificity. Selector bumped from .pillar-num to .pillar .pillar-num so the gold colour wins on specificity. Inline comment added in styles.css explaining the bump.
- **v3.0.4** (2026-04-30) Hero CTA added. New italic-gold inline link "Begin a conversation →" inserted between hero subhead and brokerage disclosure paragraph, anchoring to #intake. Quiet treatment: italic Fraunces in champagne gold, no underline at rest, underline appears in same color on hover/focus. Top-nav "Begin" pill button unchanged. Single new CSS rule block (.hero .hero-cta) added in styles.css.
- **v3.0.3** (2026-04-30) Hero H1 tightened. Line 1 shortened from "The deals that close are won before the negotiation." to "Deals are won before the negotiation." Italic-gold accent on line 2 moved back from "Pressed" to "right moment" (reverting v3.0.2's accent move). Each H1 line still carries one gold-accented phrase: "won" on line 1, "right moment" on line 2.
- **v3.0.2** (2026-04-30) Hero subhead simplified from three beats to two. "Read first. Positioned early. Pressed at the right moment." → "Read carefully. Pressed at the right moment." Italic-gold accent moved from "right moment" to "Pressed" so each line of the H1 carries one gold-accented verb (won / Pressed) for visual symmetry. "Read first" also softened to "Read carefully" in the same edit.
- **v3.0** (2026-04-30) Strategic repositioning from "careful private practitioner" to "deal-maker who reads transactions carefully." Hero H1 changed to "The deals that close are won before the negotiation." with italic-gold accent on "won." Hero subhead replaced with three-beat "Read first. Positioned early. Pressed at the right moment." with italic-gold accent on "right moment." Hero body paragraph rewritten with leverage-built-early framing. Practice section intro rewritten to open with the difference-between-good-and-poor-outcomes thesis and close on "leverage points when handled correctly." Cat 01 closing sentence added on position-to-hold-terms. Cat 02 second paragraph rewritten with conditions-worth-insisting-on framing. Cat 03 second paragraph rewritten with structure-that-holds-under-scrutiny framing. Cat 04 closing sentence added on negotiating-from-strength. How We Work section renamed from "Six commitments" to "Six standards" with new subheading. Standards I, II, IV, V body copy rewritten to lead with execution-readiness and leverage-construction language while preserving the fiduciary duty signal. Standards III and VI unchanged. About section gains one new paragraph on press-when-the-position-is-built. All em dashes purged from index.html in compliance with project style rules. Typography, palette, layout, and HTML structure unchanged.
- **v2.6** (2026-04-27) Tone-and-register pass. Eight copy changes to soften gated language without removing operational filters. Hero eyebrow ("By Referral or Application" → "By Referral or Direct Inquiry"). Practice lede rewritten to open with an explicit invitation. Commitment VI heading and body rewritten — "Limited roster by design" → "A small roster, on purpose"; waitlist and capacity-ranking language removed; rationale-for-small-roster substituted. About paragraph 5 — removed "I do not take every file that comes through the form" and "capped by design"; replaced with rationale framing. For Clarity intro softened ("vagueness wastes everyone's time" → "stated openly"). For Clarity item 4 gloss rewritten from "reserved for" / "not part of this practice" to "works best when" / "that is the standard." Intake lede — "defined windows, not continuously" replaced with "read personally, usually within a business day." Path 2 lede rewritten to open with explicit invitation rather than conditional. No structural, design, or compliance changes. All four categories, six commitments, what-this-practice-does-not-do list, and 8–10 file roster cap retained.
- **v2.5** (2026-04-25) Final pre-launch revision pass. Hero rebalanced: H1 Line 2 reduced to ~60-70% of Line 1's scale with "properly" and "calmly" set in italic champagne-gold (matches the brand's existing italic-gold accent treatment); the four-category intro paragraph that previously sat below the subline removed entirely so the subline closes the hero. Practice section: Cat 02 renamed from "Land for Small-Scale Development" to "Investment and Development Property" with new badge ("Land · Multi-Unit · Income · Cottage") and an expanded body covering multi-unit residential, income-producing residential including short-term rental, cottage and recreational, and larger acreage parcels. Cat 04 body rewritten to emphasize "decision-makers who need control over timing, exposure, and information" plus a new closing paragraph on coordination with counsel/accountant when ownership involves a corporation, family trust, or estate; badge changed to "Principals · Executives · Family-Held Assets · Sensitive Files". How We Work expanded from four to **five** commitments and reordered: I. The deal has to make sense for you, II. Written transaction note before you move, III. The hard parts get handled early, IV. The file does not end at signing (NEW: covers post-signing handling through closing and beyond), V. Limited roster by design. Pillar grid updated to 3+2 layout on wide desktop (12-col grid, three across the top, two centered below) with a 2x2-plus-spanning-fifth fallback on tablets. Intake Path 2 dropdown updated: "Land for Small-Scale Development" renamed to "Investment and Development Property". Navigation order swapped per the explicit NAVIGATION FOR LAUNCH listing: now reads The Practice, How We Work, Notes, About, Begin (Notes moved before About) on all three deployed pages (top desktop, top mobile, sub-pages). Meta description, og:description, twitter:description, and schema.org description updated to reflect the renamed Cat 02.
- **v2.4** (2026-04-25) Pass 1 for public launch. System-wide voice/terminology scrub: removed every reference to former legal practice across the public site (hero subhead, hero credential line, About bio, both footer "Not legal or financial advice" disclosures); renamed "Sales Representative" to "Salesperson" everywhere (meta tags, schema.org, footer in main and notes pages, og-image.svg); renamed "diligence" to "transaction note" everywhere; purged em dashes from all user-visible strings. Hero rewritten: new eyebrow, new two-line headline (both lines at equal scale, no italic emphasis), new italic subhead, new four-category intro paragraph. Practice section heading changed to "Four categories. Deliberately narrow.", new intro paragraph, all four category bodies replaced; Cat 03 badge changed from "Enterprise Value" to "Transaction Value"; Cat 04 renamed from "Private Client Work" to "Private Representation" with two-paragraph body and reworded badge. All four commitment headings and bodies replaced. New pullquote. About: title line changed to "Salesperson," entire bio replaced with shorter five-paragraph block (drops "That is the practice." italic transition and the standalone investment-emphasis line; folds investment sentiment into Para 3). About portrait artwork replaced: editorial margin-and-rule composition (italic Fraunces opening quotation in champagne gold, long horizontal gold rule, three proportion ticks). For Clarity Item 4 rewritten ("Legal, tax, planning, or partnership advice"); closing line tightened. Intake Path 2 lede updated to "four categories"; dropdown option "Private Client Work" renamed to "Private Representation". Notes section: new intro paragraph, new closing line ("More notes are added when they are ready."), all placeholder entries removed, Groups B and C commented out at launch (auto-hide CSS rule added via `:has()`), `_template.html` adds a commented PDF download slot, `pdf-template.html` added (print-ready Letter PDF generator), README rewritten with new publishing workflow including PDF generation step. `sample.html` archived to `_archive/`.
- **v2.3** (2026-04-23) Four-category structure. Added Category 04 (Private Client Work) and Commitment IV (Your interest decides). Restructured lanes and pillars to 2x2 grids. Full About bio rewrite with investment-alignment paragraph. Hero subhead added. New pullquote. For Clarity closing tightened. Intake lede tightened with review-window language. Path 2 "Which Lane" to "Which Category" with updated options. Added Notes section: Level 1 index (3 groups, 7 placeholder entries), Level 2 article template, sample article for review. Nav updated to include Notes between ABOUT and BEGIN (top + mobile + footer).
- **v2.2** (2026-04-23) Revisions pass. About opening rewritten (2026 removed). About closing tightened to single italic line with separator. Intake restructured into two paths (Referred + New Introduction). For Clarity closing qualifier added. Portrait placeholder replaced with editorial architectural SVG. OG share card image added. Topbar inverts over cream panels. Old-style numerals applied to prose.
- **v2.1** (2026-04-23) Dark-luxe visual direction. Fraunces display + Inter body. Champagne gold signature. Bento lane layout. Scroll-reveal and cinematic hero.
- **v2.0** (2026-04-23) Editorial direction (cream, Playfair Display). Superseded by v2.1.
- **v1** (earlier) Single-file HTML draft at `../primegate-landing-draft-v1.html`. Reference only.

---

*Questions → update `../LANDING_PAGE_BRIEF_FOR_CLAUDE_CODE.md` Section 8, or raise with Taran directly.*
