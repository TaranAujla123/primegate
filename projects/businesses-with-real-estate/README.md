# Businesses Sold With Their Real Estate. Workflow

This folder holds individual file pages for businesses sold together
with the real estate they occupy, and the reusable detail template
(`_template.html`). Use this README every time you add or update a
file page.

---

## Adding a new listing page

1. **Copy the template.**

   ```
   cp _template.html <listing-slug>.html
   ```

   The slug is lowercase, hyphenated, no spaces, and never identifies
   the business by its trading name unless the vendor has consented to
   public naming. Use a code-name plus geography. Examples:
   `burlington-plaza-2026.html`, `qew-corridor-gas-station.html`,
   `niagara-industrial-flex-2026.html`.

2. **Replace every token.** The template contains tokens of the form
   `{{ TOKEN_NAME }}`. Replace all of them with the listing's actual
   content. The full index is in the comment block at the top of
   `_template.html`. The most important ones:

   - `{{ LISTING_NAME }}`. The human-readable name (or code-name).
     Used in `<title>`, `<h1>`, breadcrumb, og:title, `_subject`, and
     the hidden `listing_name` form field. If the vendor requires
     confidentiality, append `(Confidential)` rather than naming the
     business.
   - `{{ LISTING_SLUG }}`. The file-name slug. Used in canonical URL
     and og:url.
   - `{{ LISTING_TYPE }}`. Short label, all caps. Examples:
     `PLAZA - OWNER-OPERATED WITH REAL ESTATE`,
     `GAS STATION & C-STORE - OWNER-OPERATED WITH SITE`,
     `INDUSTRIAL FLEX - OWNER-OCCUPIED WITH BUILDING`.
   - `{{ LISTING_SECTOR }}`. Plain-language sector descriptor.
     Examples: `Plazas`, `Gas stations & c-stores`, `Industrial & flex`,
     `Specialty retail`, `Small hospitality`.
   - `{{ LISTING_LOCATION }}`. Geography only, no street address
     unless the vendor has consented. Example: `Burlington, Ontario`.
   - `{{ LISTING_TENANCY }}`. Phrased as a fact. Examples:
     `Owner-occupied (100% used by the operating business)`,
     `Mixed (owner-occupied with in-place tenants)`,
     `Fully tenanted (operator manages tenancies)`.
   - `{{ LISTING_STRUCTURE }}`. Example: `Asset sale`, `Share sale`,
     `Either, vendor open`.
   - `{{ LISTING_ASKING_PRICE }}`. Phrased as the asking price.
     If the price is on request only, write `On request after NDA`.
   - `{{ LISTING_BROKERAGE }}`. Listing brokerage's legal name. Do not
     omit. Cooperating-brokerage disclosure relies on this being
     present and accurate.
   - `{{ LISTING_SUMMARY }}`. One sentence for meta description and og.
     Withhold anything covered by the vendor's NDA.

3. **Fill the content slots.** The template marks each prose slot with
   a `<div class="project-detail-prose placeholder">` wrapper and a
   `<!-- BEGIN content slot -->` / `<!-- END content slot -->` pair of
   comments. Replace the placeholder `<p>` tags with the real text and
   remove the `placeholder` class on the wrapper so the dashed border
   goes away. Do the same for the `placeholder-inline` spans inside the
   key-facts grid and the documents list.

4. **Confidentiality first.** Do not publish anything covered by the
   vendor's NDA: trading name (if undisclosed), financials, vendor
   identity, supplier or customer contracts, employee identities. The
   public page should state the category and the geography and direct
   prospective buyers to sign the NDA for the deal book.

5. **Add the hero image only if the vendor consents.** If the vendor
   requires confidentiality, leave the `<div class="project-detail-hero
   placeholder">` block in place. Where consent exists, replace it with
   an `<img>` tag pointing to
   `../../assets/projects/<slug>-hero.jpg` (1920x1080 recommended).

6. **Wire the documents.** Replace each `placeholder-inline` slot in
   the documents list with either a real `<a href="...">` link or
   remove the line if the document is not yet available. The NDA
   template should be the first document and should always be
   available.

7. **Add a card on the lane index.** Edit `index.html` in this folder.
   Find one of the three placeholder cards (or copy one), then:

   - Replace the placeholder text with the listing's public-facing
     content (code-name, sector, geography, one-line description).
   - Add data attributes to the `<article class="project-card">` for
     filter chips. These drive the filter UI:

     ```
     data-sector="plazas"
     data-price="1m-3m"
     data-tenancy="mixed"
     data-structure="asset"
     ```

     `data-sector` may carry comma-separated values for listings that
     fit more than one sector. Other groups take a single value
     matching the chips defined at the top of `index.html`.

   - Remove the `placeholder` class so the card renders as a normal
     card.
   - Update the card image: replace the `<div class="image-slot">` with
     `<img>` pointing to `../../assets/projects/<slug>-card.jpg` only
     if the vendor consents. Otherwise keep the placeholder image slot.
   - Update the `<a class="project-card-cta">` href to point at the new
     listing page (e.g. `burlington-cafe-2026.html` instead of
     `_template.html?listing=placeholder-1`).

8. **Update the listing status badge.** The card displays the
   listing's current status (e.g. `Status: Available.`). Keep it
   accurate. Statuses used on this lane: `Available`, `Under offer`,
   `Conditional`, `Firm`, `Sold`, `Withdrawn`.

9. **Update `../../sitemap.xml`.** Add a new `<url>` entry for the
   listing page so search engines pick it up, only if the public page
   is non-confidential. Otherwise leave it off the sitemap.

---

## Pre-publish disclosure checklist

Run this checklist before pushing the new listing page to `main`.

- [ ] Vendor's confidentiality wishes confirmed in writing. If
      confidential, the listing name, address, and identifying images
      are withheld on the public page.
- [ ] Listing brokerage name is accurate. Confirm with the listing
      brokerage in writing.
- [ ] Authorization to market the listing on file. See section below.
- [ ] Asking price is stated plainly. No phrase like "guaranteed,"
      "starting at" without context, or "best price."
- [ ] Real estate component of the deal is clearly distinguished from
      the business component. The page should make clear that only the
      real estate trade is conducted under TRESA through the brokerage,
      and that the business assets, shares, or goodwill sale is
      conducted by the parties' counsel.
- [ ] Cooperating-brokerage language is present in every disclosure
      block on the page. HomeLife G1 represents the buyer's interest in
      any transaction unless otherwise disclosed in writing.
- [ ] HomeLife G1 Realty Inc., Brokerage attribution appears in the
      footer with the "Brokerage" descriptor.
- [ ] Taran is identified as Salesperson. Never as Agent, Sales
      Representative, or Realtor.
- [ ] The hidden `listing_name` and `project_lane` fields on the form
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
advertising) **does not** require per-listing Broker of Record sign-off
before publishing. Listings can be published as soon as the disclosure
checklist above is complete and the listing brokerage has confirmed
your authorization to market the listing.

What is still required, on every listing page:

- TRESA conditions (a) through (d) on representation. Note that TRESA
  applies to the real estate component of a business-with-real-estate
  sale, not to the business assets, shares, or goodwill component.
- RECO Bulletins 5.1 / 5.2 / 5.3. Accurate brokerage identification,
  no misleading advertising, no "guaranteed return / best deal /
  exclusive access" claims.
- LSO Rule 3.1. No holding-out as currently providing legal services.
- Cooperating-brokerage disclosure language present.

---

## Authorization to market a third-party listing

Before publishing a page that promotes a business listed by another
brokerage, confirm in writing that you have authorization to market
the listing. Acceptable forms:

- A cooperating-brokerage agreement.
- A written invitation from the listing brokerage to market the
  listing to your clients.
- A signed buyer representation agreement that names the specific
  listing.

Keep the written authorization on file. Reference it in the listing's
folder, e.g. `assets/projects/<slug>/authorization.pdf`.

---

## Quick file map

```
projects/businesses-with-real-estate/
  index.html               Lane landing, filter chips, listing cards
  _template.html           Reusable detail template (this file's pair)
  README.md                This file
  <slug>.html              Per-listing detail pages (one per listing)
```

Assets convention:

```
assets/projects/<slug>-card.jpg     800x500 card image (16:10), only if vendor consents
assets/projects/<slug>-hero.jpg     1920x1080 hero image (16:9), only if vendor consents
assets/projects/<slug>/             folder for NDAs, CIMs, lease summaries, etc.
```
