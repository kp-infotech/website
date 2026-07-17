# Technical SEO Audit — kpinfo.tech

**Date:** 2026-06-26 · **Stack:** Astro 5 (static) + Sanity v5 + Cloudflare Workers · **Verified via:** repo read + live `curl` + SEMrush.

Severity: 🔴 critical · 🟠 high · 🟡 medium · 🟢 low/ok

---

## Summary scorecard

| Area | Status | Notes |
|---|---|---|
| robots.txt | 🟢 | `Allow: /`, correct sitemap pointer |
| sitemap.xml | 🟢 (🟡 enrich) | Complete & correct; no `lastmod` |
| Canonical tags | 🟢 | Self-referencing, https, trailing-slash, query-stripped |
| HTTPS / http→https | 🟢 | `http://` 301s to `https://` |
| www / non-www | 🟢 | Apex canonical hard-coded; CLAUDE.md documents www→apex CF rule |
| Trailing-slash consistency | 🟢 | Enforced in `canonicalUrl()` |
| noindex / nofollow | 🟢 | Prod fully indexable; noindex only on non-prod hosts (JS) |
| Open Graph / Twitter | 🟢 (🟡 image) | Full OG+Twitter; no default OG image set |
| Structured data | 🟢 | Org/WebSite/Breadcrumb/Service/FAQ/BlogPosting/CreativeWork/ContactPage |
| 404 handling | 🟢 | True 404 status returned |
| Redirects | 🔴 | 42 ranking/backlinked URLs 404; committed `_redirects` drift (see redirect-risk-check.md) |
| Duplicate routes/content | 🟡 | Duplicate `blogCategory` docs; empty `automation-ai` category |
| Metadata completeness | 🟠 | 8 industries + ~10 blog posts missing seoTitle/seoDescription |
| Brand positioning in meta | 🟠 | `/services/`, `/about/`, siteSettings defaults use old "digital studio" language |
| Core Web Vitals | 🟡 | Recently optimized (commit 1991465); re-measure post-changes |
| JS-rendering / indexability | 🟢 | Static HTML output; meta in initial HTML (verified) |
| Image alt attributes | 🟡 | Verify Sanity images carry alt; `SanityPicture` supports it |

---

## 🔴 Critical

### T1 — 42 legacy URLs 404 with ranking/backlink value
Full analysis and 301 map in **[redirect-risk-check.md](redirect-risk-check.md)**. This is the single biggest technical-SEO risk: live link-equity and ranking loss accruing daily.

### T2 — Committed `public/_redirects` is out of sync with production
`public/_redirects` references service slugs that **404** (`web-development`, `ui-ux-design`, `mobile-apps`, `digital-marketing`). Live serves correct targets from another source (likely Cloudflare dashboard Bulk Redirects). A deploy from `main` could regress working redirects. Fix file to match live + add T1 redirects. See redirect-risk-check.md §2/§5.

---

## 🟠 High

### T3 — Industry pages missing SEO metadata (8 pages)
All 8 industries have `seoTitle`/`seoDescription` = null → titles render as bare `"<Industry> — KP Infotech"` and description falls back to a short tagline. Fix via Sanity (see [metadata-plan.csv](metadata-plan.csv), [sanity-update-plan.md](sanity-update-plan.md)).

### T4 — `/services/` hub describes the OLD taxonomy
[`src/pages/services/index.astro:58`](../../src/pages/services/index.astro) meta description: *"…UI/UX design, web development, mobile apps, ERP solutions, and digital marketing."* — three of those services now 404. Replace with the 5-pillar B2B copy. Repo fix (PR-safe).

### T5 — `/about/` + siteSettings defaults use off-brand "digital studio" language
- [`src/pages/about.astro:96`](../../src/pages/about.astro): *"premium digital product studio… exceptional digital experiences"*.
- `siteSettings.defaultSeoTitle` = "KP Infotech — Digital Product Studio"; `defaultSeoDescription` = "We craft premium digital experiences… UI/UX design, web development, mobile apps…". These are the **global fallbacks** (homepage overrides them, so not rendering today, but any page that omits a title inherits stale positioning). Fix in Sanity + about.astro.

### T6 — ~10 high-value blog posts missing seoTitle/seoDescription
Incl. protected `odoo-erp-complete-guide`, `cloud-deployment-models-diagram`, plus `node-js-frameworks`, `erp-for-retail-stores`, `inventory-management-best-practices`, `angular-vs-react`, etc. They fall back to title + excerpt (workable but unoptimized). See metadata-plan.csv.

---

## 🟡 Medium

### T7 — Duplicate `blogCategory` documents (data hygiene)
26 `blogCategory` docs exist; only **5 slugs render pages** (`automation-ai`, `cloud-devops`, `custom-software-development`, `digital-platforms-ecommerce`, `erp-business-systems`). The 5 live slugs each have **duplicate docs** (e.g. `blogCategory-automation-ai` *and* `blogCategory.automation-ai`), and ~16 legacy-taxonomy docs are orphaned. The sitemap shows only one URL per slug (no duplicate pages emitted today), but the colliding-slug docs are a latent build/canonical risk. **Recommend:** in Sanity, keep one canonical doc per final slug, repoint any post references, delete the rest. *Content-ops task — not an SEO emergency.*

### T8 — Empty category page `/insights/category/automation-ai/`
No published post references `automation-ai`, so the page is thin/near-empty yet indexable & in sitemap. Either assign a post to it or drop it from the public set until populated.

### T9 — Sitemap has no `lastmod`
`@astrojs/sitemap` emits bare `<loc>` only. Adding `lastmod` (from Sanity `_updatedAt`) and sensible `changefreq`/`priority` helps crawl scheduling. Low effort via the integration's `serialize`/`lastmod` options.

### T10 — No default OG image
`siteSettings.defaultOgImage` = null; OG falls back to a local `hero-placeholder.jpg`. Pages without a hero image (legal, hubs) share a generic image. Set a branded default OG (1200×630) in siteSettings.

### T11 — Industry pages emit only BreadcrumbList schema
No `Service`/`CollectionPage` entity. Optional enhancement (see [schema-plan.md](schema-plan.md)).

### T12 — Core Web Vitals — re-measure
Mobile PageSpeed was recently improved (LCP/fonts/favicon/CLS — commit 1991465). Re-run PageSpeed Insights / CrUX after the metadata + redirect changes to confirm ≥90 / LCP <2.5s targets (CLAUDE.md goal). No code regression expected from SEO-field edits.

---

## 🟢 Low / informational

- **T13 — Title separator inconsistency:** homepage uses `… | KP Infotech` (pipe) while CLAUDE.md pattern and other pages use `— KP Infotech` (em-dash). Cosmetic; align to em-dash.
- **T14 — `/industries/` copy** mentions "energy" (not an actual industry). Minor.
- **T15 — Stale years in blog titles:** `angular-vs-react` title says "2024"; `best hr software` has lowercase "hr". Cosmetic title polish (Sanity).
- **T16 — Image alt coverage:** confirm Sanity images set `alt`; `SanityPicture` passes `alt` through. Spot-check hero/featured images.
- **T17 — `/studio` (Sanity Studio)** and `/api/*` are correctly absent from the sitemap; ensure `/studio` is not indexable (it isn't linked and not in sitemap).

---

## Confirmed healthy (no action)

- `robots.txt`: `User-agent: * / Allow: /` + `Sitemap: https://kpinfo.tech/sitemap-index.xml` ✅
- Canonical construction (`canonicalUrl()` in `src/lib/seo.ts`) — https, apex host, trailing slash, strips `?`/`#` ✅
- JSON-LD `@graph` merging via `jsonLdGraph()` with `removeEmpty()` (no empty nodes) ✅
- 5 service pages: crawlable, indexable, internally linked (home grid + footer + industries), in sitemap ✅
- Sitemap completeness: home, 8 industries, 15 posts, 5 categories, 4 case studies, hubs, legal ✅
- Static HTML output → meta/JSON-LD present in initial response (verified via curl, no JS-rendering dependency) ✅
- True 404 status on missing routes ✅
