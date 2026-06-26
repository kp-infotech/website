# Structured Data (Schema) Plan — kpinfo.tech

**Date:** 2026-06-26 · **Implementation:** all JSON-LD is generated in the repo (`src/lib/seo.ts` helpers + per-page `jsonLd` props), merged into one `@graph` in `BaseLayout.astro`. **None** is authored in Sanity. No fake reviews/ratings/pricing present — keep it that way.

## Current coverage (verified in code + live HTML)

| Schema type | Where | Status |
|---|---|---|
| `Organization` (@id `#organization`, with PostalAddress + ContactPoint, sameAs) | Global (BaseLayout, every page) | 🟢 Good |
| `WebSite` (@id `#website`, publisher→Org) | Homepage | 🟢 Good |
| `BreadcrumbList` | All deep pages (services, industries, work, insights, legal, about, contact) | 🟢 Good |
| `Service` (provider→Org, serviceType, areaServed) | Service pages | 🟢 Good |
| `FAQPage` | Service pages **with** FAQs | 🟢 Good |
| `BlogPosting` (author Person, publisher→Org, datePublished/Modified, image, keywords) | Blog posts | 🟢 Good |
| `CreativeWork` (creator/publisher→Org, about[], client) | Case studies | 🟢 Good |
| `ContactPage` | /contact/ | 🟢 Good |

**This is strong coverage already.** The recommendations below are enhancements, not fixes.

## Recommendations

### S1 — 🟠 Upgrade `Organization` → also `ProfessionalService` (local SEO)
The org has NAP (Ahmedabad, Gujarat, IN) + phone + email. Adding `ProfessionalService` (or `LocalBusiness` subtype) as an additional `@type` on the existing org node strengthens local/entity signals and "near me"/branded queries, **without** any fabricated data. Add `areaServed`, `priceRange` only if truthful (omit if unknown — do **not** invent).
```jsonc
// src/lib/seo.ts organizationSchema(): change
"@type": "Organization"
// to (truthful multi-type):
"@type": ["Organization", "ProfessionalService"]
// keep existing address/contactPoint; optionally add "knowsAbout": ["Custom software","Odoo ERP","Business automation","AI agents","Cloud & DevOps"]
```
> Do NOT add `aggregateRating`/`review` unless backed by a real, verifiable review source.

### S2 — 🟡 Add `Service` provider details / `OfferCatalog` linking the 5 services (homepage)
On the homepage, add a `Service` or `OfferCatalog` listing the 5 pillars under the Organization, so AI/answer engines can enumerate offerings. Pure structured restatement of existing nav — no new claims.

### S3 — 🟡 Industry pages: add `CollectionPage` or `Service` (areaServed = industry)
Industry pages currently emit only Breadcrumb. Add a lightweight `Service` node (`serviceType: "<Industry> software & automation"`, `provider: {@id: #organization}`) or `CollectionPage` to give each vertical an entity. Mirror the `services/[slug]` pattern in `industries/[slug].astro`.

### S4 — 🟡 `WebPage`/`AboutPage` nodes
- Add `AboutPage` to /about/ (`mainEntity → Organization`).
- The `pageId()` helper (`#webpage`) exists but isn't attached anywhere — optionally bind a `WebPage` node per page for a cleaner graph. Low priority.

### S5 — 🟢 `BlogPosting` → consider `TechArticle` for how-to/dev posts
Dev/how-to posts (node-js-frameworks, scalable-system-architecture, database-design) could use `TechArticle`. Optional; `BlogPosting` is fine.

### S6 — 🟢 FAQ schema for non-service pages with visible FAQs
Only service pages have FAQs today. If FAQs are added to industry or key blog pages, emit `FAQPage` (the helper pattern already exists in `services/[slug].astro`). Only when the FAQs are **visible on-page** (Google policy).

### S7 — 🟢 Keep `@id` references consistent
The graph already cross-links via `{@id: ORG_ID}` — good. When adding S1–S4, reuse the same `@id`s so engines resolve one entity.

## AEO / AI-answer notes (from seo-aeo-best-practices skill)
- Service pages already include **definition-style excerpts + "who it's for" + FAQs + process** — strong AEO foundation. Keep answers concise and self-contained.
- Org `knowsAbout` (S1) + service enumeration (S2) make the entity machine-readable for ChatGPT/Perplexity/AI Overviews.
- Ensure `robots.txt` does not block AI crawlers you want (currently `Allow: /` for all — fine; decide intentionally if you ever want to allow/deny GPTBot, PerplexityBot, etc.).

## Do NOT
- ❌ No fake `aggregateRating`, `review`, `Offer`/`priceRange`, or unverifiable awards.
- ❌ No FAQ schema for FAQs not visible on the page.
- ❌ No `Article` author Person unless the author is real (current author comes from Sanity — fine).
