# Pre-Construction Projects. Workflow

This folder holds individual pre-construction project pages and the
reusable detail template (`_template.html`). Use this README every time
you add or update a project page.

---

## Adding a new project page

1. **Copy the template.**

   ```
   cp _template.html <project-slug>.html
   ```

   The slug is lowercase, hyphenated, no spaces. Example:
   `marquee-condos.html`, `harbour-walk-erin-mills.html`.

2. **Replace every token.** The template contains tokens of the form
   `{{ TOKEN_NAME }}`. Replace all of them with the project's actual
   content. The full index is in the comment block at the top of
   `_template.html`. The most important ones:

   - `{{ PROJECT_NAME }}`. The human-readable name. Used in `<title>`,
     `<h1>`, breadcrumb, og:title, `_subject`, and the hidden
     `project_name` form field.
   - `{{ PROJECT_SLUG }}`. The file-name slug. Used in canonical URL
     and og:url.
   - `{{ PROJECT_TYPE }}`. Short label, all caps. Examples:
     `PRE-CONSTRUCTION CONDOMINIUM`, `PRE-CONSTRUCTION TOWNHOUSE`,
     `PRE-CONSTRUCTION MIXED-USE`.
   - `{{ PROJECT_LOCATION }}`. Neighbourhood and city. Example:
     `Erin Mills, Mississauga`.
   - `{{ PROJECT_BUILDER }}`. Builder's legal name.
   - `{{ PROJECT_LISTING_BROKERAGE }}`. Listing brokerage's legal name.
     Do not omit. Cooperating-brokerage disclosure relies on this being
     present and accurate.
   - `{{ PROJECT_OCCUPANCY_EST }}`. Phrased as estimate, e.g.
     `Estimated occupancy 2027`. Never as a guarantee.
   - `{{ PROJECT_SUMMARY }}`. One sentence for meta description and og.

3. **Fill the content slots.** The template marks each prose slot with
   a `<div class="project-detail-prose placeholder">` wrapper and a
   `<!-- BEGIN content slot -->` / `<!-- END content slot -->` pair of
   comments. Replace the placeholder `<p>` tags with the real text and
   remove the `placeholder` class on the wrapper so the dashed border
   goes away. Do the same for the `placeholder-inline` spans inside the
   key-facts grid and the documents list.

4. **Add the hero image.** Replace the `<div class="project-detail-hero
   placeholder">` block with an `<img>` tag. The recommended source
   image is 1920x1080 (16:9), JPEG, ~200 KB target. Save it to
   `../../assets/projects/<slug>-hero.jpg` and reference it from the
   page. Always include a descriptive `alt` attribute.

5. **Wire the documents.** Replace each `placeholder-inline` slot in
   the documents list with either a real `<a href="...">` link to a
   PDF in `../../assets/projects/<slug>/` or remove the line if the
   document isn't yet available.

6. **Add a card on the lane index.** Edit `index.html` in this folder.
   Find one of the three placeholder cards (or copy one), then:

   - Replace the placeholder text with the real project details.
   - Add data attributes to the `<article class="project-card">` for
     filter chips. These drive the filter UI:

     ```
     data-region="mississauga"
     data-stage="selling"
     data-suite="1br,2br,3br"
     data-occupancy="2027"
     ```

     `data-suite` may carry comma-separated values for projects with
     multiple suite types. Other groups take a single value matching the
     chips defined at the top of `index.html`.

   - Remove the `placeholder` class so the card renders as a normal
     project card.
   - Update the card image: replace the `<div class="image-slot">` with
     `<img>` pointing to `../../assets/projects/<slug>-card.jpg`
     (recommended 800x500, 16:10).
   - Update the `<a class="project-card-cta">` href to point at the new
     project page (e.g. `marquee-condos.html` instead of
     `_template.html?project=placeholder-1`).

7. **Update the project status badge.** The card displays the project's
   current status (e.g. `Stage: Selling.`). Keep it accurate. Statuses
   used on this lane: `Pre-launch`, `Selling`, `Final phase`,
   `Assignments only`, `Sold out`, `Closed`.

8. **Update `../../sitemap.xml`.** Add a new `<url>` entry for the
   project page so search engines pick it up.

---

## Pre-publish disclosure checklist

Run this checklist before pushing the new project page to `main`.

- [ ] Builder name is the builder's correct legal name. No abbreviation.
- [ ] Listing brokerage name is accurate. Confirm with the listing
      brokerage in writing.
- [ ] Pricing is stated as an estimate. No phrase like "guaranteed,"
      "starting at" without "estimated," or "best price."
- [ ] Occupancy is stated as an estimate. Never as a commitment.
- [ ] Cooperating-brokerage language is present in every disclosure
      block on the page. HomeLife G1 represents the buyer's interest in
      any transaction unless otherwise disclosed in writing.
- [ ] HomeLife G1 Realty Inc., Brokerage attribution appears in the
      footer with the "Brokerage" descriptor.
- [ ] Taran is identified as Salesperson. Never as Agent, Sales
      Representative, or Realtor.
- [ ] The hidden `project_name` and `project_lane` fields on the form
      are set correctly. Lead-routing depends on this.
- [ ] Form submits to `https://formspree.io/f/xqewoqdw`. Reuse the same
      endpoint as the main site intake.
- [ ] No urgency, scarcity, "VIP," "exclusive," or "limited" language.
- [ ] No em dashes anywhere in user-visible copy.
- [ ] Canonical URL, og:url, og:title, og:description, twitter:* tags
      all reflect the actual page.
- [ ] Internal links from the lane index card and any cross-references
      point to the new file, not the template.

---

## RECO Bulletin 5.5. Clearance status

Per the 2026-05-09 clearance, Bulletin 5.5 (project-specific
advertising) **does not** require per-project Broker of Record sign-off
before publishing. Project pages can be published as soon as the
disclosure checklist above is complete and the listing brokerage has
confirmed your authorization to market the project.

What is still required, on every project page:

- TRESA conditions (a) through (d) on representation.
- RECO Bulletins 5.1 / 5.2 / 5.3. Accurate brokerage identification,
  no misleading advertising, no "guaranteed return / best deal /
  exclusive access" claims.
- LSO Rule 3.1. No holding-out as currently providing legal services.
- Cooperating-brokerage disclosure language present.

---

## Authorization to market a third-party project

Before publishing a page that promotes a project listed by another
brokerage, confirm in writing that you have authorization to market
the project. Acceptable forms:

- A cooperating-brokerage agreement.
- A written invitation from the listing brokerage to market the project
  to your clients.
- A signed buyer representation agreement that names the specific
  project.

Keep the written authorization on file. Reference it in the project's
folder, e.g. `assets/projects/<slug>/authorization.pdf`.

---

## Quick file map

```
projects/pre-construction/
  index.html               Lane landing, filter chips, project cards
  _template.html           Reusable detail template (this file's pair)
  README.md                This file
  <slug>.html              Per-project detail pages (one per project)
```

Assets convention:

```
assets/projects/<slug>-card.jpg     800x500 card image (16:10)
assets/projects/<slug>-hero.jpg     1920x1080 hero image (16:9)
assets/projects/<slug>/             folder for PDFs, floor plans, etc.
```
