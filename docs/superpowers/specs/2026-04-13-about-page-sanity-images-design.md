# About Page — Sanity Image Fields

**Date:** 2026-04-13
**Scope:** Add `aboutPage` singleton schema for About page images; wire up frontend to use them

## Context

The PRD (section 5.8, line 469) specifies `aboutPage` as a Sanity data source, but the schema was never created. The About page (`src/pages/about.astro`) is entirely hardcoded. Photos exist on the shared drive (`I:\Shared drives\KP Infotech\Website\Website Images\`) that need a home in Sanity.

This is an images-only pass. Text content stays hardcoded and can be migrated to Sanity later by extending this schema.

## Schema: `aboutPage` (singleton)

**File:** `sanity/schemas/aboutPage.ts`

| Field | Sanity Type | Options | Purpose |
|---|---|---|---|
| `storyImage` | `image` | `hotspot: true` | Photo for the "Our Story" section (replaces current placeholder div) |
| `craftIcon` | `image` | — | Value icon for "Craft" |
| `partnershipIcon` | `image` | — | Value icon for "Partnership" |
| `innovationIcon` | `image` | — | Value icon for "Innovation" |
| `integrityIcon` | `image` | — | Value icon for "Integrity" |
| `partnersImage` | `image` | `hotspot: true` | Image for "Trusted Partnerships" / Certifications section |

Register in `sanity/schemas/index.ts`.

Preview: static title "About Page".

## Frontend Changes

### `src/pages/about.astro`

- Add GROQ query: `"aboutPage": *[_type == "aboutPage"][0] { storyImage, craftIcon, partnershipIcon, innovationIcon, integrityIcon, partnersImage }`
- Build image URLs with `urlFor()` for each field (guard against null)
- Pass `storyImageUrl` to `<OurStory>`
- Override value icon paths: if Sanity URL exists, use it; otherwise fall back to static `/images/values/*.png`
- Pass `partnersImageUrl` to `<Certifications>`

### `src/components/sections/OurStory.astro`

- Add `image?: string` prop (URL string)
- When `image` is provided: render `<img>` with proper alt text, `loading="lazy"`, sized to fit the existing visual container (max-width 480px, aspect-ratio 4/5)
- When `image` is absent: keep existing placeholder div (current behavior)

### `src/components/sections/Values.astro`

- No structural change — the `icon` field on each value object already accepts a URL string and renders an `<img>`
- `about.astro` already passes icon paths; we just swap in Sanity URLs when available

### `src/components/sections/Certifications.astro`

- Add `sectionImage?: string` prop (URL string)
- When provided: render as a visual alongside the certification badges (similar to the OurStory two-column pattern)
- When absent: no change to current layout

## What Stays the Same

- All text content (story paragraphs, value titles/descriptions, certification names) remains hardcoded
- `pageHeroes.aboutHero` continues handling the hero background image
- Static files in `public/images/values/` remain as fallbacks
- No changes to other pages or schemas

## Image Mapping (Shared Drive to Schema Fields)

| Shared Drive File | Schema Field |
|---|---|
| `About-our-story.jpg` | `storyImage` |
| `craft-click-button.png` | `craftIcon` |
| `partnership-deal.png` | `partnershipIcon` |
| `innovation.png` | `innovationIcon` |
| `integrity-badge.png` | `integrityIcon` |
| `Trusted partners.jpg` | `partnersImage` |

## Future Extension

When text content moves to Sanity, add fields to this same `aboutPage` document:
- `storyHeadline`, `storyParagraphs`, `founderNames`
- Convert value icons to an array of `{ title, description, icon }` objects
- `certifications[]` array of `{ name, description, logo, url }`
