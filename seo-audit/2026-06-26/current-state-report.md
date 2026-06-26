# KP Infotech — SEO/GEO Current-State Report

**Date:** 2026-06-26 · **Domain:** kpinfo.tech · **Stack:** Astro 5 (static) + Sanity v5 + Cloudflare Workers
**Data sources:** SEMrush MCP (IN + US), Sanity content API (project `5rux0mv2`), repository read, **live HTTP verification** (direct `curl`, 2026-06-26). GSC/GA4 not available via connected tooling — SEMrush used as the ranking proxy (see [gsc-baseline.csv](gsc-baseline.csv)).

---

## 1. Executive summary

The new site is, technically, in **good shape**: it is static-rendered (meta + JSON-LD in the initial HTML), fully indexable, has correct canonicals/robots/sitemap, returns true 404s, and ships strong structured data (Organization, WebSite, Breadcrumb, Service, FAQPage, BlogPosting, CreativeWork, ContactPage). The **five core service pages are crawlable, indexable, internally linked, and in the sitemap** — the central acceptance criterion is met. The homepage and service pages already communicate the intended **B2B operations technology partner** positioning with well-written, on-brand metadata.

The problem is **not the new pages — it is the migration tail.** **42 old WordPress URLs that still rank in SEMrush and/or hold backlinks now return hard 404s**, including the site's former **#2 organic page** (`/what-is-customised-software/`, "custom software", search volume 1,000) and its highest-commercial-value term (`/business-process-automation-tools/`, "process automation software", CPC **$30.58**). Separately, the committed `public/_redirects` file is **out of sync with production** and points several service slugs at pages that 404 — a latent regression risk on the next deploy.

Current SEMrush India footprint is small (65 organic keywords, ~27 est. monthly traffic, 81% of it branded "kp infotech"), so the absolute traffic at stake is modest **today** — but the lost pages are exactly the **non-branded, commercial-intent** assets the business needs to grow, and link equity is bleeding daily. Recovering them is the highest-ROI action available.

**Priority order:** (1) stop the 404 bleed with 301s, (2) fix the redirect-config drift, (3) fill missing metadata (8 industries + ~10 blog posts), (4) correct off-brand copy on `/services/` and `/about/`, (5) recreate the 3–4 highest-value informational pages as Insights.

---

## 2. Ranking-protection findings (what must be preserved)

### 2a. Live & healthy — protect, do not touch
- **Homepage** `/` — ranks branded "kp infotech" #2 (81% of traffic), "kp it", "kp digital", "kp website" etc. Strong B2B title/desc live. 137 backlinks / 67 referring domains.
- **`/services/erp-software/`** — protected pillar, ranks branded, strong metadata. ✅
- **`/contact/`** — ranks "kp technical" #14 (vol 480). ✅
- **`/about/`**, **`/careers/`** — branded equity. ✅
- **Working 301s** (verified): `/erp-software/`, `/odoo-crm/`, `/services/erp-software/odoo-crm/`, `/services/website-design/`, `/services/graphics-design/`, `/services/mobile-web-app/`, `/blogs/`, `/casestudy/`, `/career/`, and all blog-post root→`/insights/` moves (`/node-js-frameworks/`, `/database-design-best-practices/`, `/odoo-erp-complete-guide/`, `/erp-implementation-cost/`, `/cloud-deployment-models-diagram/`, `/scalable-system-architecture/`, etc.). **Preserve these exactly.**

### 2b. At risk — ranking/backlinked but currently 404 (ACT)
42 URLs. Top losses: `/what-is-customised-software/` (vol 1,000, #2 traffic page), `/business-process-automation-tools/` ($30.58 CPC), `/5-best-modern-website-design-ideas/` (vol 720/880), `/data-visualization-best-practices/` (12 backlinks), `/business-process-improvement-methods/` (7 backlinks), `/best-ecommerce-platform-for-small-business/` (6 backlinks), `/about-kp-infotech-expertise/` (branded). Full list + verified-200 redirect targets in **[redirect-risk-check.md](redirect-risk-check.md)**.

### 2c. Protected-list reconciliation (from the brief)
| Protected URL | Live status | Action |
|---|---|---|
| `/` | 200 | keep |
| `/services/erp-software/` | 200 | keep |
| `/erp-software/` | 301→/services/erp-software/ | keep |
| `/odoo-crm/` | 301→/services/erp-software/ | keep |
| `/services/erp-software/odoo-crm/` | 301→/services/erp-software/ | keep |
| `/odoo-erp-complete-guide/` | 301→/insights/odoo-erp-complete-guide/ | keep; add meta |
| `/erp-implementation-cost/` | 301→/insights/erp-implementation-cost/ | keep |
| `/cloud-deployment-models-diagram/` | 301→/insights/… | keep; add meta |
| `/business-process-automation-tools/` | **404** | **301 → /services/business-automation/** |
| `/best-practices-for-devops/` | **404** | **301 → /services/cloud-devops/** |
| `/how-to-make-a-website/` | **404** | **301 → /services/custom-software-development/** |
| `/what-is-customised-software/` | **404** | **301 → /services/custom-software-development/** |
| `/5-best-modern-website-design-ideas/` | **404** | **301 → /services/custom-software-development/** |
| `/services/website-design/` | 301→custom-software-development | keep |
| `/services/mobile-web-app/` | 301→custom-software-development | keep |
| `/services/graphics-design/` | 301→custom-software-development | keep |
| `/hire-wordpress-developer/` | 301→custom-software-development | keep |

---

## 3. New architecture — indexing status

| Page | Crawlable | Indexable | Internally linked | In sitemap | Verdict |
|---|---|---|---|---|---|
| /services/custom-software-development/ | ✅ | ✅ | home grid + footer + industries | ✅ | 🟢 |
| /services/business-automation/ | ✅ | ✅ | ✅ | ✅ | 🟢 |
| /services/erp-software/ | ✅ | ✅ | ✅ | ✅ | 🟢 |
| /services/ai-automation-agents/ | ✅ | ✅ | ✅ | ✅ | 🟢 |
| /services/cloud-devops/ | ✅ | ✅ | ✅ | ✅ | 🟢 |

All five pillars pass. `robots.txt` allows all; canonicals self-reference; static HTML carries title/desc/JSON-LD (verified live). Only gap: **few Insights→Service internal links** (see [internal-linking-plan.md](internal-linking-plan.md)). **Next step for these pages:** request indexing in GSC and build topical internal links.

---

## 4. Metadata quality audit

| Issue | Pages | Severity |
|---|---|---|
| Missing seoTitle + seoDescription | 8 industries; ~10 blog posts (incl. protected odoo-erp-complete-guide, cloud-deployment-models-diagram) | 🟠 |
| Off-brand / outdated positioning | `/services/` hub (lists 404'd old services), `/about/` ("digital product studio"), `siteSettings` defaults | 🟠 |
| Thin description | case study `virtual-tours-ai-listings` (53 chars) | 🟡 |
| Title/H1 polish | `angular-vs-react` (says 2024), `best hr software` ("hr" casing) | 🟢 |
| Separator inconsistency | homepage uses `|`, pattern is `—` | 🟢 |
| Duplicate seoTitle/desc | none detected | 🟢 |
| Title length out of range | a few proposed titles ~60–62 chars (acceptable; clarity prioritized) | 🟢 |

Title/H1/intent **match** on all current pages (no mismatches found). Per-page rewrites in **[metadata-plan.csv](metadata-plan.csv)**.

---

## 5. Technical SEO audit (summary)

Full detail in **[technical-seo-issues.md](technical-seo-issues.md)**. Headlines:
- 🔴 42 legacy 404s with equity (redirect-risk-check.md).
- 🔴 Committed `_redirects` drift vs production (points at 404 service slugs).
- 🟡 Duplicate `blogCategory` documents (26 docs, 5 live slugs) + empty `automation-ai` category page.
- 🟡 Sitemap has no `lastmod`; no default OG image set.
- 🟢 robots, canonical, HTTPS, www→apex, trailing slash, 404 status, JSON-LD graph, static rendering — all correct.

---

## 6. GEO / AEO audit (AI-answer readiness)

| Signal | Status |
|---|---|
| Clear direct definitions | 🟢 Service excerpts define each offering plainly ("custom business software for growing teams that have outgrown spreadsheets…") |
| Concise service explanations | 🟢 Strong on service pages |
| "Who this is for" | 🟢 Implicit/explicit on services & industries; could be a labelled section |
| Business outcomes | 🟢 Case studies quantify (ARR, conversion, savings); services frame outcomes |
| FAQs | 🟡 Present on service pages (with FAQPage schema); absent on industries & blogs |
| Comparison-friendly content | 🟡 A few posts (angular-vs-react, on-premise-vs-cloud-erp lost); add more comparisons |
| Implementation process | 🟢 Service "How We Build" process steps |
| Proof points | 🟢 Case studies + stats |
| Case-study links | 🟢 Services → related work |
| Company / entity clarity | 🟢 Organization schema w/ NAP; 🟠 upgrade to ProfessionalService + `knowsAbout` (schema-plan.md S1) |
| Service↔Insight internal links | 🟠 Weak — primary GEO/SEO gap (internal-linking-plan.md) |

**GEO verdict:** strong foundation (definitions + structured data + outcomes). Biggest GEO wins: (1) enumerate the 5 services in schema + a homepage OfferCatalog, (2) add Insights→Service links, (3) add concise FAQ blocks to industry pages, (4) recreate the lost informational pages so AI engines can cite KP Infotech for "what is custom software", "process automation tools", etc.

---

## 7. What still needs human review
1. **Confirm the active redirect source** (Cloudflare dashboard Bulk Redirects vs static `_redirects`) before adding the 42 redirects.
2. **Approve** the 301 map, metadata copy, and Sanity writes.
3. **GSC/GA4 access** to validate impressions on the 404 URLs and confirm the 5 services are "Indexed".
4. **Decide** recreate-vs-redirect for the 3–4 high-value informational pages.
5. **Sanity category cleanup** (duplicate docs) — content-ops decision.
