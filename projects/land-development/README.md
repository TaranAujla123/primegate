# Land & Development Projects. Workflow

This folder holds individual land and development project pages and the
reusable detail template (`_template.html`). Use this README every time
you add or update a project page.

---

## Adding a new project page

1. **Copy the template.**

   ```
   cp _template.html <project-slug>.html
   ```

   The slug is lowercase, hyphenated. Example:
   `king-road-severance.html`, `caledon-100-acres.html`.

2. **Replace every token.** Tokens of the form `{{ TOKEN_NAME }}` are
   listed in the comment block at the top of `_template.html`. The
   important ones:

   - `{{ PROJECT_NAME }}`. Used in `<title>`, `<h1>`, breadcrumb,
     og:title, `_subject`, and the hidden `project_name` form field.
   - `{{ PROJECT_SLUG }}`. File-name slug, used in canonical and og URLs.
   - `{{ PROJECT_TYPE }}`. Short label, all caps. Examples: `LAND`,
     `SEVERANCE OPPORTUNITY`, `DEVELOPMENT SITE`,
     `AGRICULTURAL CONVERSION`.
   - `{{ PROJECT_LOCATION }}`. Municipality and region.
   - `{{ PROJECT_SIZE }}`. Phrased as acreage. Example: `28.4 acres`.
   - `{{ PROJECT_USE }}`. Intended use, plain language.
   - `{{ PROJECT_LISTING_BROKERAGE }}`. Listing brokerage legal name.
     Do not omit. Cooperating-brokerage disclosure relies on this.
   - `{{ PROJECT_SUMMARY }}`. One sentence for meta description and og.

3. **Fill the content slots.** The template marks each prose slot with
   `<div class="project-detail-prose placeholder">` and `<!-- BEGIN
   content slot -->` / `<!-- END content slot -->` comments. Replace the
   placeholder `<p>` tags with real text. Remove the `placeholder` class
   on the wrapper so the dashed border goes away. Do the same for the
   `placeholder-inline` spans in the key-facts grid and the documents
   list.

4. **Add the hero image.** Replace the `<div class="project-detail-hero
   placeholder">` block with an `<img>`. Recommended 1920x1080 (16:9)
   aerial or site photograph, JPEG, ~200 KB target. Save to
   `../../assets/projects/<slug>-hero.jpg`.

5. **Wire the documents.** Replace each `placeholder-inline` slot in
   the documents list with a real `<a href="...">` to a PDF in
   `../../assets/projects/<slug>/`, or remove the line if the document
   is not yet available. Typical documents on this lane: survey or
   sketch, zoning bylaw extract, servicing report, environmental
   assessment, severance application status.

6. **Add a card on the lane index.** Edit `index.html` in this folder.
   Find one of the three placeholder cards (or copy one), then:

   - Replace the placeholder text with the real project details.
   - Add data attributes to the `<article class="project-card">` for
     filter chips:

     ```
     data-region="gta-west"
     data-size="25-100"
     data-use="residential"
     data-servicing="pending"
     ```

     Use values matching the chips defined at the top of `index.html`.

   - Remove the `placeholder` class so the card renders as a normal
     project card.
   - Replace the `<div class="image-slot">` with `<img>` pointing to
     `../../assets/projects/<slug>-card.jpg` (recommended 800x500,
     16:10).
   - Update the `<a class="project-card-cta">` href to the new project
     page.

7. **Update the project status badge.** Statuses used on this lane:
   `Listed`, `Under conditional`, `Off-market sounding`, `Closed`.

8. **Update `../../sitemap.xml`.** Add a new `<url>` entry for the
   project page.

---

## Pre-publish disclosure checklist

Run this checklist before pushing the new project page to `main`.

- [ ] Listing brokerage name is accurate. Confirm with the listing
      brokerage in writing.
- [ ] Parcel size and dimensions are stated as approximate where they
      have not been re-surveyed for this listing.
- [ ] Zoning and use designations are stated as current as-of the date
      of the listing brokerage's data sheet. Note the date.
- [ ] Servicing status is described accurately. Phrases like "fully
      serviced," "shovel-ready," or "approved for X units" only appear
      if the listing brokerage's documents support them and the buyer
      has been advised to verify independently.
- [ ] Pricing is stated as an estimate. No phrase like "guaranteed
      return," "best price," or "exclusive access."
- [ ] Cooperating-brokerage language is present in every disclosure
      block on the page.
- [ ] HomeLife G1 Realty Inc., Brokerage attribution appears in the
      footer with the "Brokerage" descriptor.
- [ ] Taran is identified as Salesperson.
- [ ] The hidden `project_name` and `project_lane` fields on the form
      are set correctly.
- [ ] Form submits to `https://formspree.io/f/xqewoqdw`.
- [ ] No urgency, scarcity, "VIP," or "exclusive" language anywhere.
- [ ] No em dashes anywhere in user-visible copy.
- [ ] Canonical URL, og:url, og:title, og:description, twitter:* tags
      all reflect the actual page.
- [ ] Internal links from the lane index card and any cross-references
      point to the new file, not the template.
- [ ] Environmental, archaeological, and source-water-protection
      overlays are noted where relevant.

---

## RECO Bulletin 5.5. Clearance status

Per the 2026-05-09 clearance, Bulletin 5.5 (project-specific
advertising) does not require per-project Broker of Record sign-off
before publishing. Project pages can be published as soon as the
disclosure checklist above is complete and the listing brokerage has
confirmed authorization to market the site.

What is still required, on every project page:

- TRESA conditions (a) through (d) on representation.
- RECO Bulletins 5.1 / 5.2 / 5.3. Accurate brokerage identification,
  no misleading advertising, no "guaranteed return / best deal /
  exclusive access" claims.
- LSO Rule 3.1. No holding-out as currently providing legal services.
- Cooperating-brokerage disclosure language present.

---

## Authorization to market a third-party listing

Before publishing a page that promotes a site listed by another
brokerage, confirm in writing that you have authorization to market
the listing. Acceptable forms:

- A cooperating-brokerage agreement.
- A written invitation from the listing brokerage to market the site
  to your clients.
- A signed buyer representation agreement that names the specific
  site.

Keep the written authorization on file in
`assets/projects/<slug>/authorization.pdf` or equivalent.

---

## Quick file map

```
projects/land-development/
  index.html               Lane landing, filter chips, project cards
  _template.html           Reusable detail template
  README.md                This file
  <slug>.html              Per-project detail pages (one per project)
```

Assets convention:

```
assets/projects/<slug>-card.jpg     800x500 card image (16:10)
assets/projects/<slug>-hero.jpg     1920x1080 hero image (16:9)
assets/projects/<slug>/             folder for PDFs, surveys, reports
```
