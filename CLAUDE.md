# Primegate — build-v2

This file is auto-loaded by Claude Code on every session in this
directory. It carries the design context (mirrored from
`.impeccable.md`) plus operational guidance for working in this repo.

## Operational

- **Tech stack:** static HTML / CSS / SVG. No build step, no framework,
  no npm dependency in deployed assets. Open `index.html` in a browser
  to preview, or `python -m http.server 8000` from this directory.
- **Deployment:** GitHub Pages, repo `TaranAujla123/primegate`,
  branch `main`, custom domain `primegaterealty.com`.
- **Branches:** `main` is live. `v3-direction-a-mock` carries an
  earlier (rejected) palette-swap mock. Direction A v3.1 is being
  rebuilt under the Impeccable skill (in progress).
- **Preview namespace:** `/v3-preview/` on `main` exists for
  side-by-side review of in-progress redesigns. Always isolated from
  the live site. Delete when the visual call is made.

## Compliance — non-negotiable

- Visible brand: **Primegate** alone. Never with "Realty," "Group,"
  "Real Estate," "Brokerage" suffixes.
- Brokerage attribution: **HomeLife G1 Realty Inc., Brokerage** must
  appear with the "Brokerage" descriptor on every deployed page.
- Practitioner: **Salesperson** — never "Agent," "Sales
  Representative," or inline "Realtor®".
- Former-legal-practice references are permitted only in past tense,
  descriptive of completed historical work, and only on the About
  section. No present-tense legal capacity, no claim of currently
  providing legal services, no holding-out language (LSO Rule 3.1).
  The "I now work on the deal side directly" sentence in About P1
  carries the present-capacity disclosure and must remain whenever
  legal background is referenced.
- No misleading-advertising language (RECO Bulletin 5.3): no
  "guaranteed return," "best deal," "exclusive access."
- No em dashes in user-visible strings.

## Design Context

*Mirrored from `.impeccable.md` — single source of truth lives there.
This copy keeps the direction in scope on every Claude Code session
without requiring `imp-impeccable` to be explicitly invoked.*

### Users

High-net-worth Ontario real estate clients — HNW individuals, family
offices, founders, executives, professionals, and counsel making
referrals. Sophisticated buyers and sellers transacting in land and
development projects, income and multi-unit property, estate homes
and custom builds, and private client representation.

They have already seen every Compass / Sotheby's / Engel & Völkers
homepage in Toronto. They are immune to drone hero footage and "MEET
YOUR REALTOR" hero modules. They want a practitioner who actually
reads the documents.

### Brand Personality

**Three words: Decisive · Considered · Unhurried.**

Voice/tone: direct without being cold. Names risk, says what's done,
points to where the client's lawyer takes over. No hedging. No
declarative bravado. No urgency theatre.

### Aesthetic Direction

**Direction: Brutalist-confident.** Raw structure on display.
Oversized typographic statements. No decoration. Confidence as the
design language itself.

**Theme: Dark.** Bone (warm off-white) text on near-black ink
surfaces. No pure white, no pure black.

**Visual signature:** A single massive typographic gesture in the
hero — H1 at genuine display scale (clamp from ~80px mobile to ~220px
wide desktop), bleeding toward the viewport edges, contrasted with
extreme-tiny editorial body text. The page says one thing very loudly
in the hero, then drops to a confident library voice for everything
that follows. No second crescendo.

**Anti-references:** Compass / The Agency / Sotheby's affiliate sites
with drone hero video; law firm websites with champagne italic
flourishes; Engel & Völkers / Royal LePage Signature templates; AI
landing pages with gradient text, glassmorphism, side-stripe accent
borders, soft drop shadows.

### Design Principles

1. **One voice, one moment.** The page speaks once at full volume in
   the hero. Everything that follows is set in a confident library
   voice. No second crescendo.
2. **Type does the design.** No ornamental SVG flourishes, no
   italic-coloured accents on headlines, no decorative dividers.
   Hierarchy is built from scale × weight × negative space.
3. **Asymmetry over centering.** Left-aligned, ragged-right.
   Intentional grid breaks at moments that matter.
4. **Specificity beats sophistication.** Named transaction types,
   named risk patterns, named documents. The site is the
   proof-of-competence itself.
5. **Compliance carried prominently, not apologetically.** Brokerage
   attribution dignified, not minimised.
6. **No theatre.** No drone hero, no testimonials carousel, no number
   counters animating from zero, no auto-playing video. Movement
   reserved for state changes only.

### Banned font reflexes (per Impeccable)

Do NOT pick: Fraunces, Newsreader, Lora, Crimson, Playfair Display,
Cormorant, Syne, IBM Plex (any), Space Mono, Space Grotesk, Inter, DM
Sans, DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans/Serif. The
v2 site used Fraunces + Inter — both banned. v3.1 uses different
type.

### What's locked

Notes section, two-path intake form, branded `/thanks/` page, sticky
TOC on long-form articles, cream paper panel for article body, auto
PDF generation pipeline (Puppeteer), four practice categories, six
standard headings as content.

### What's up for reconsideration

All typography, accent colour, layout grid, hero composition, lane
card flip mechanic, pillar layout, About composition, footer
treatment, decorative elements.

---

*Last updated 2026-04-28. Authoritative copy in `.impeccable.md`.*
