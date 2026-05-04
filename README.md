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
│   └── portrait.jpg             # Editorial portrait, 4:5 ratio (880×1184). Wired into About section as of v3.1.8.
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

- **v3.1.21** (2026-05-04) Two layout polish changes. (1) **HomeLife G1 lockup parity.** Bumped the brokerage-bar to give the brokerage identification roughly equal visual weight to the Primegate brand-mark below. `--brokerage-bar-h` 60px → 76px, `.brokerage-bar-logo` height 36px → 50px, `.brokerage-bar-name` font-size 11.5px → 13.5px, `.brokerage-bar-sub` 9.5px → 10.5px. Mobile breakpoint logo also bumped 30px → 40px. The sticky-portrait top offset reads `--brokerage-bar-h` so it auto-adjusts to the new bar height — no other downstream change needed. Visual effect: the brokerage attribution now reads as a co-equal lockup with the Primegate brand below, satisfying the RECO brokerage-prominence intent more clearly. (2) **About portrait larger.** `.about-grid` desktop column for the portrait bumped from `minmax(0, 320px)` to `minmax(0, 380px)`, giving the photo ~19% more area in both dimensions and more vertical presence in the bio column. The bio text column adapts via `1fr` so the prose reflows to fit the remaining width. Cache-bust `styles.css?v=3.1.21`.
- **v3.1.20** (2026-05-04) Brand-mark inner polygon over-light fix. When the topbar floats above a cream panel (About / Intake), the wordmark text "Primegate" switches to dark navy (paper-ink) correctly, and the outer L-frame of the icon switches to gold-deep correctly, but the inner polygon of the icon was still rendering as `var(--bone)` (cream) which made the inner detail invisible against the cream wall. Root cause: when v3.1.15 cleaned up the failed mix-blend-mode experiment it removed the `.topbar.over-light .brand-mark polygon:last-of-type` override entirely instead of restoring the original `fill: var(--paper-ink) !important; opacity: 1 !important` that was there before. Restored that rule. Also overrides the inline `opacity="0.55"` attribute on the inner polygon so the detail reads at full opacity. Now both polygons of the icon match the dark wordmark text on cream sections — full brand-mark legibility on both palettes. Cache-bust `styles.css?v=3.1.20`.
- **v3.1.19** (2026-05-04) Two small refinements on the v3.1.18 boardroom portrait. (1) **Portrait — chest fabric uniformity.** Single focused nano-banana pass on `CLEAN-REAL4-boardroom-FULL.jpg` instructing "make the white shirt fabric appear uniformly opaque across the chest area, smooth out any subtle tonal variation or visible texture beneath the fabric." Removes the slight see-through quality of the cotton in the chest area while preserving collar, button placket, all natural folds at shoulders/elbows, and everything else outside the shirt fabric. Output `CLEAN-REAL4-boardroom-v2-D-tight.jpg` (107 KB) ships as `assets/portrait.jpg`. Total: 3 nano-banana passes deep on the face — still well within clean territory, no plasticky tells. (2) **Directional drop shadow on `.portrait-artwork`.** Added a second box-shadow layer offset 14px right + 22px down with 36px blur at 32% opacity — gives the portrait the visual presence of a framed object set into the cream About panel rather than floating flat against it. Original ambient shadow retained underneath for soft elevation. Cache-bust both `styles.css` and `portrait.jpg` to `?v=3.1.19`.
- **v3.1.18** (2026-05-04) New portrait via clean 2-pass nano-banana pipeline. Fresh start from `V2.jpg` (a different source photo with a more authoritative pose) using a deliberately-minimal 2-pass chain to avoid the JPEG generation-loss problem that wrecked v3.1.13/14 (which had stacked 6+ kontext passes and the face went visibly AI-processed). Pass 1: combined color/exposure correction + shirt smoothing on the V2 source — single nano-banana call producing `step1-clean.jpg`. Pass 2: background replacement with the "high-end private boardroom" prompt — dark wood paneling with soft architectural recessed-panel framing visible as blurred shapes, soft warm ambient lighting from off-camera (no visible fixture), hint of a polished conference table edge in the lower foreground, hint of a dark leather chair/banquette as a soft mass in the lower-left. Output `CLEAN-REAL4-boardroom-FULL.jpg` cropped at the D-tight framing (720×900 source crop, scaled to 1200px wide, both shoulders fit comfortably, mid-chest framing). Total: 2 nano-banana calls deep on the face — pixel quality preserved (skin texture, beard hair, eye sharpness, glasses clarity all visible at zoom). Reads as "private space where high-stakes decisions are made quietly" — the brand brief. 129 KB shipped. Cache-bust `?v=3.1.18`. Pipeline script: `assets/portrait-source/_run-clean-2pass.mjs`. Working alternates retained under `_final-stages/v2-CLEAN/` (CLEAN-REAL3-herringbone variants for future use).
- **v3.1.17** (2026-05-03) **Critical fix: index.html was truncated mid-tag for the past 7 commits.** Discovered while investigating "card flip stopped working" + "topbar transparent on scroll" reports. Both symptoms had the same root cause: the inline `<script>` block at the end of `index.html` was unclosed — file ended literally with `</sc` instead of `</script></body></html>`. Truncation was introduced in commit `9c47966` ("Migrate canonical to prime-gate.ca; deploy v3-compliant build", 2026-05-03 00:50) which lost the last few characters of the file. Browsers parsed the unclosed script tag and silently failed to register the lane-card-flip click listeners + topbar scroll/over-light listeners, but did not throw a visible console error. Restored the file to end with `</script>\n</body>\n</html>` per the working pre-migration version (`a120606`). All inline JS now executes: practice card 3D flip works again, topbar dark background on scroll works again, and the over-light cream background on About/Intake panels works again (which means logo inversion would also work — but per v3.1.15 user direction the brand wordmark stays cream-on-cream regardless). Cache-bust to `?v=3.1.17`.
- **v3.1.16** (2026-05-03) Portrait reverted to `v2-pass2-shadow` per user feedback. v3.1.13/14/15's stack of 5+ kontext/max passes (sleeves aggressive → face glow → left-arm focused → face-brighter-natural) compounded JPEG generation-loss artifacts and gave the photo an "AI-processed" pixel quality when zoomed in. A conservative `clarity-upscaler` cleanup pass (v6, creativity 0.15, resemblance 0.9, 2x upscale) was attempted but introduced new artifacts: face went slightly plasticky around cheeks, right-side glasses arm rendered with a visible glitch, sleeve wrinkles unchanged. User opted to roll back all the way to `v2-pass2-shadow` (the cleanest stop-point — only 2 kontext passes deep, retains the relit lounge background + initial chest-wrinkle smoothing, leaves natural shirt drape on sleeves rather than try to over-correct them). 138 KB, 880×1184. Cache-bust to `?v=3.1.16`. Pipeline scripts retained under `assets/portrait-source/_run-*.mjs` for future re-runs if desired (start fresh from L4 background to avoid the multi-pass pixel decay).
- **v3.1.15** (2026-05-03) Reverted brand wordmark mix-blend-mode experiments per user direction ("leave the logo as is — white even on scroll its fine"). v3.1.12 introduced `mix-blend-mode: difference` on `.brand-name`, `.brand-sub`, and the inner SVG polygon to auto-invert colour against any background. Combined with the still-present `.topbar.over-light` `color: var(--paper-ink) !important` override, the difference math went the wrong way (dark navy paint differenced against cream paint = pale washed-out result) and the wordmark stayed effectively invisible on cream sections. Diagnosed via Chrome MCP runtime inspection: the `over-light` JS class isn't being added to the `.topbar` at runtime for some reason (the IIFE registers but the apply listener never fires the class transition — root cause unclear after a few iterations, deferred). User opted to keep the brand wordmark in its original cream/bone state on all backgrounds rather than continue debugging — the icon's outer L-frame (gold) remains visible on both palettes which provides enough brand presence. Removed: `mix-blend-mode: difference` and `color: #FFFFFF` from `.brand-name`/`.brand-sub`; `.topbar .brand-mark polygon:last-of-type` mix-blend-mode override. Restored: original `color: var(--bone)` / `color: var(--bone-muted)`. The `.topbar.over-light` background and outer-polygon `gold-deep` overrides remain in place — they apply if the JS ever does fire and don't cause harm if it doesn't.
- **v3.1.14** (2026-05-03) Portrait v5: hyper-focused on the LEFT-side arm of the image (the arm without the watch, near the window) + a stronger but still natural face brightening pass. v3.1.13 left this specific arm heavily wrinkled because the prior prompts treated "both sleeves" symmetrically and kontext gravitated toward the easier-to-edit watch arm. This pass uses spatial language ("the arm on the LEFT side of the image", "closest to the window", "WITHOUT the wristwatch") at `guidance_scale: 7.0` to force kontext to actually edit that region. Pass B follows with another face-brightening at `guidance: 5.5` — face is now noticeably more luminous and even but still uniform across the face (no directional spotlight). Cumulative output ships as `assets/portrait.jpg`. Cache-bust to `?v=3.1.14`.
- **v3.1.13** (2026-05-03) Portrait v4: aggressive sleeves + subtle natural face brightening. v3.1.12's pass-A sleeve smoothing was too subtle — user reported wrinkles still visible at the elbows. Two new sequential kontext/max passes on top of v3.1.12: (A) aggressive sleeve smoothing at `guidance_scale: 6.5` with explicit "perfectly pressed", "freshly ironed", "no visible wrinkles or folds anywhere on forearms, elbows, cuffs" language; (B) subtle uniform face brightening at `guidance_scale: 5.5` — explicitly NOT a directional spotlight (which the previous v3-passB attempt was rejected for), instead a slight ambient warmth across the whole face that retains all natural skin texture, beard detail, and existing facial shadows. Pass-B cumulative output ships as `assets/portrait.jpg`. Cache-bust to `?v=3.1.13`.
- **v3.1.12** (2026-05-03) Portrait pass A (sleeves) + CSS-only logo over-light via mix-blend-mode. (1) **Portrait — sleeves smoothed.** Took the v3.1.9 pass-3 winner and ran another flux-pro/kontext/max pass focused exclusively on smoothing wrinkles on both forearms, inner elbows, and cuff drape lines. Pass-A output (`_final-stages/v3-passA-sleeves.jpg`, 140 KB) is now `assets/portrait.jpg`. Note: Pass B (right-side face brightness/glow) was rejected — looked like a directional spotlight on the face, unnatural. Pass A retained alone. (2) **Logo over-light without JS dependency.** v3.1.10 and v3.1.11 added `!important` cascades, but the user reported the topbar text/icon still appeared cream-on-cream in incognito on the live site — strongly suggesting the `over-light` JS class isn't being applied at runtime for some reason we couldn't reproduce locally. Switched the brand wordmark text and brand-mark inner polygon to `mix-blend-mode: difference` with `color: #FFFFFF` (text) / `fill: #FFFFFF` (SVG). Difference of white against any background pixel produces the inverse colour at full contrast — auto-adapts on dark hero, on cream About/Intake panels, and is completely independent of any JS state. Removed the now-redundant `.topbar.over-light .brand-mark polygon:last-of-type` and `.topbar.over-light .brand .brand-name` / `.brand .brand-sub` overrides. Kept `.topbar.over-light .brand-mark polygon:first-of-type` (outer L-frame) since gold-deep on cream looks better than gold over difference math. CSS + portrait both cache-busted to `?v=3.1.12`.
- **v3.1.11** (2026-05-03) Bulletproof v3.1.10 fixes against cache + cascade quirks. (1) Add `!important` to all `.topbar.over-light` color/fill/opacity declarations on `.brand`, `.brand-name`, `.brand-sub`, `.brand-mark` and its two polygons. The v3.1.10 specificity-only override was correct on paper but did not consistently take effect in production — likely a renderer-specific quirk where inline SVG attributes (`opacity="0.55"` on the inner polygon) survived a CSS opacity declaration without the importance flag. Belt-and-suspenders restatement. (2) Cache-bust the portrait image: `assets/portrait.jpg?v=3.1.11` so browsers that cached the v3.1.8 placeholder/un-retouched portrait fetch the v3.1.9 retouched file as a brand-new URL. Same `?v=` trick now applied to both `styles.css` and `portrait.jpg`. Going forward, bump the version on any visible-asset change.
- **v3.1.10** (2026-05-03) Two About-section / topbar fixes. (1) **Logo over-light visibility.** When the sticky topbar floats over a cream `.panel-light` section (About, Intake), the Primegate brand-mark and wordmark were reading as cream-on-cream — the inversion logic was set up correctly for `.brand-name` and the polygon fills, but the inner polygon of the SVG mark carries an inline `opacity="0.55"` attribute that survived the over-light fill swap. At 55% on `--paper-ink` (#14171F) the inner detail rendered as a washed-out medium gray on the cream panel, making the icon look faded. Fix: bump opacity to 0.85 in the `.topbar.over-light .brand-mark polygon:last-of-type` rule, and re-state the wordmark text rules at higher specificity (`.topbar.over-light .brand .brand-name` / `.brand .brand-sub`) so the inversion wins against any later default-state overrides. (2) **Sticky portrait on desktop.** New rule on `.about-grid .portrait-figure` at the 780px+ breakpoint: `position: sticky; top: calc(var(--brokerage-bar-h, 60px) + 80px + 24px); align-self: start;`. The portrait now stays visible as the bio text column scrolls past it, eliminating the dead vertical space that opened up below the photo on tall viewports. `.about-grid` already had `align-items: start` from earlier — required for sticky to work inside a grid track. Mobile (<780px) layout unchanged: portrait still stacks above the bio.
- **v3.1.9** (2026-05-03) Portrait retouch — actually visible this time. v3.1.8 used `flux-pro/kontext` at `guidance_scale: 3.5` with a single combined 6-instruction prompt; the model preserved the source verbatim and produced no visible edits. This pass replaces it with `flux-pro/kontext/max` at `guidance_scale: 5.5`, `num_inference_steps: 50`, run as three sequential focused passes (each takes the prior output as input). Pass 1: shirt wrinkles smoothed across chest, torso, arms — fabric now reads crisp. Pass 2: tried to add cast shadow on wood paneling behind head; did not visibly land (kontext is reluctant to add architectural elements that weren't in the source — known weakness). Pass 3: skin tone brightened and evened, midsection slightly flatter near the watch hand. Cumulative pass-3 output (`_final-stages/v2-pass3-skin-belly.jpg`, 136 KB) replaces `assets/portrait.jpg`. Pipeline script: `assets/portrait-source/_run-retouch-v2.mjs`. Shadow on paneling deferred — would require a separate compositing pass (mask the subject, drop shadow on a duplicated background layer) rather than another kontext call.
- **v3.1.8** (2026-05-03) Editorial portrait wired in. The placeholder editorial SVG (margin-and-rule composition with italic gold opening quotation) in the About section is replaced by `assets/portrait.jpg` — the commissioned headshot, retouched and placed against a private members club lounge backdrop. Image is 880×1184 (4:5 native), 212 KB JPEG. The `<svg>` block and the "Photograph forthcoming." `<figcaption>` are removed from `index.html`. Surrounding `.portrait-artwork` wrapper preserved (4:5 aspect ratio, dark ink frame, subtle drop shadow, `object-fit: cover`). `.portrait-caption` CSS rule retained but now unused — kept for the template `pdf-template.html` and `notes/_template.html` which still reference it. Pipeline working artefacts (`assets/portrait-source/` — 45 MB of FAL.AI variants, cutouts, MJS scripts, `_final-stages/`) added to `.gitignore` and kept off the repo. Portrait pipeline summary: source phone JPEG (2784×2080 with displaymatrix → 2080×2784 effective) → ffmpeg normalize (apply rotation, strip metadata) → fal-ai/birefnet/v2 cutout → fal-ai/iclight-v2 background relight (private members club lounge with dark walnut wood paneling, brass two-arm sconce upper-right, partial window panel upper-left for natural daylight, subtle gold tone-on-tone wallpaper) → fal-ai/flux-pro/kontext combined retouch (soft cast shadow on wood paneling consistent with window light, slight jawline definition, glasses glare removed, shirt wrinkles smoothed, skin tone evened, midsection slightly flatter near watch hand). 8 background candidates generated across 3 rounds (A library, B boardroom, C modern office, D studio, E skyline; D2/D4 iterations; L1–L4 lounge variants); L4-arched-doorway selected. Iterations and FAL key references retained in pipeline scripts under `assets/portrait-source/_run-*.mjs` for future re-runs.
- **v3.1.7** (2026-05-02) HomeLife G1 logo updated to a tighter (less padding around the mark) variant. Two new assets added: `homelife-g1-logo-white-tight.png` and `homelife-g1-logo-black-tight.png`. Both `<img>` references in `index.html` (brokerage-bar at line 88 and footer-g1-logo at line 732) now point to the white-tight version. Original `homelife-g1-logo-white.png` and `homelife-g1-logo-black.png` retained — `styles.css` still references the original black for the over-light topbar swap, unchanged. Mirrors the cowork-session change made on the v3-compliant master.
- **v3.1.6** (2026-05-02) Card title rhythm — uniform 2-line wrap. (1) Card 01 "Premium Pre-Construction" → "Premium Pre&#8209;Construction" (non-breaking hyphen U+2011) so the wrap point falls between "Premium" and "Pre‑Construction" instead of mid-word. (2) Card 04 "Private Representation" → "Private Client Representation" so it wraps to "Private Client" / "Representation", matching cards 02 and 03's two-line rhythm. Intake form's category select option updated to match. aria-label on lane-front updated for both cards.
- **v3.1.5** (2026-05-02) lane-tag pill — line-height 1.9, padding 12 vertical. v3.1.3's line-height 1.7 was still too tight for card 04's three-line pill ("Principals · Executives · Family-Held Assets · Sensitive Transactions"). Bumped to 1.9 line-height + 12px vertical padding. Mirrored in build-v3-compliant.
- **v3.1.4** (2026-05-02) lane-header gap — dialed back to ~22px. v3.1.3's 35px was "too airy" per user. Settled at clamp(20px, 1.5vw, 24px) which lands at 21.6px at 1440 desktop. Iteration trail: 16 (cramped) → 23 (still tight) → 52 (too airy) → 35 (still too airy) → 22 (sweet spot). Mirrored in build-v3-compliant.
- **v3.1.3** (2026-05-02) Practice cards — sweet spot + multi-line pill fix. Two changes. (1) lane-header gap dialed back from clamp(40, 3.6vw, 64) to clamp(28, 2.4vw, 40) — v3.1.2's 52px at desktop was too airy; this lands at ~35px which is visible breathing without spread-thin. (2) lane-tag pill (the gold oval): padding bumped from 6×12 to 9×14, line-height set to 1.7 for the FIRST time. Card 04's tag wraps to three lines ("Principals · Executives · Family-Held Assets · Sensitive Transactions") and was stacking tight against itself. The responsive media-query override at the 4-col-grid breakpoint also updated so the change applies at all viewports.
- **v3.1.2** (2026-05-02) Practice cards breathing room — round 2. The v3.1.1 bump from 16px to clamp(22, 1.6vw, 32) was too subtle; the cluster still read as a tight block hugging the top of the card with a vast empty middle below. This pass goes further: gap clamp(40px, 3.6vw, 64px) — 52px between numeral / title / oval tag at 1440 desktop. The cluster now visibly expands to fill more of the card's vertical territory rather than huddling. Mirrored in build-v3-compliant/styles.css.
- **v3.1.1** (2026-05-02) Practice cards breathing room. `.lane-header` gap bumped from 16px to clamp(22px, 1.6vw, 32px) so the lane numeral, the title, and the oval tag each have visible vertical separation at the top of the card. Was reading as cramped on desktop. Mirrored in build-v3-compliant/styles.css to keep template in sync.
- **v3.1.0** (2026-05-02) RECO COMPLIANCE LAUNCH. Wholesale promotion of `build-v3-compliant/` to production over the v3.0.x evolution path. Architectural changes grounded in the Compliance Justification Memo (`04_Marketing/Compliance/COMPLIANCE_JUSTIFICATION_MEMO.md`) addressing the four most-cited risks under RECO Bulletins 5.1, 5.2, 5.3, 5.5. Specifically: (1) New top-of-page Brokerage Bar identifies HomeLife G1 Realty Inc., Brokerage with the G1 logo, full registered name, "Independently Owned & Operated", and brokerage phone — paint-1 prominence per Bulletin 5.3 page 1. (2) Top-bar lockup carries Primegate mark + vertical divider + HomeLife G1 brokerage block at co-equal visual weight (CSS rebalance: brokerage-name 13px, brokerage-sub 10px, max-width 245px with flex-shrink: 0 so the registered name wraps to two lines beside the G1 logo without compressing). (3) Footer lockup mirrors the same co-equal pattern; legacy `.footer-brand { margin-bottom: 56px }` removed. (4) Pillar III ("Written transaction note before you move") narrowed: was promised for "every property or business" — now scoped to "clients under engagement" per Bulletin 5.1 promises/offers requirement. (5) Pillar VI softens precise-claim language ("8–10 active transactions"; "calls returned same day") to "deliberately limited active roster" and "calls returned promptly" per Bulletin 5.1 verifiability standard. (6) Removed the v2 phrase "personal practice mark" / "personal practice identifier" — TRESA has no such category. Replaced regulatory disclosure block with plain-language framing: "Primegate is a name used by Taran Aujla in connection with real estate services provided through HomeLife G1 Realty Inc., Brokerage. Primegate is not a brokerage, is not registered under TRESA, and does not itself trade in real estate." (7) Salesperson descriptor "Salesperson" used consistently in title, meta, alt, JSON-LD jobTitle, header subline, footer column. (8) Added `assets/homelife-g1-logo-white.png` and `homelife-g1-logo-black.png` (logos provided directly by the brokerage); over-light topbar swaps to the black variant. (9) Removed the obsolete `v3-preview/` mock folder. (10) Updated notes/ template files to inherit the new compliance footer. Investor claim in About section preserved (flagged in HTML as `VERIFY-FACTUAL-CLAIM`); editorial portrait remains an SVG placeholder pending professional photography (per Compliance Memo item 4); canonical URLs use `primegaterealty.com` (current CNAME target) until the planned domain transition documented in `DOMAIN_AND_EMAIL_TRANSITION.md`.
- **v3.0.8** (2026-05-01) Hero rewrite. Three changes. (1) Eyebrow: "By Referral or Direct Inquiry" → "Select Transaction Representation" — sharper category framing, signals scope of practice. (2) H1 line 2 first phrase: "Handled carefully." → "Prepared first." — preserves the verb-pair pattern with line 1's "won" and matches the "deals are won before the negotiation" thesis (preparation is the operative word). (3) Hero subhead replaced with "For selected Ontario real estate files where structure, leverage, timing, and terms matter." — much shorter, sharpens audience filter. Italic-gold accents on "won" (line 1) and "right moment" (line 2) preserved. Begin a conversation CTA unchanged.
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
