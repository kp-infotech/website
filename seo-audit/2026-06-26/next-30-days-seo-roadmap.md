# Next 30 Days — SEO/GEO Roadmap

**Date:** 2026-06-26 · Sequenced by impact × safety. Nothing destructive; every action preserves or recovers existing equity.

---

## Week 1 — Stop the bleed (highest ROI, mostly additive)

| # | Action | Owner | Risk | Deliverable ref |
|---|---|---|---|---|
| 1 | Confirm the **active redirect source** (Cloudflare dashboard vs static `_redirects`) | Dev/Infra | none | redirect-risk-check.md §2 |
| 2 | Add the **42 legacy → live 301 redirects** (all targets verified 200) | Dev | low (additive) | redirect-risk-check.md §3/§6 |
| 3 | Fix committed `public/_redirects` to match live (repoint dead service-slug targets; drop dead `/services/marketing/`) | Dev (PR) | low | redirect-risk-check.md §2 |
| 4 | Re-run the live status sweep to confirm 0 of the 42 still 404 | Dev | none | redirect-risk-check.md §7 |
| 5 | Get **GSC access**; export the baseline; check 404 report + that 5 services are "Indexed"; submit updated sitemap | SEO | none | gsc-baseline.csv |

**Exit criteria:** every ranking/backlinked legacy URL returns 301→200; committed redirects match production; GSC baseline saved.

---

## Week 2 — Metadata completeness (Sanity + repo)

| # | Action | Owner | Risk | Ref |
|---|---|---|---|---|
| 6 | Run `sanity-seo-update.mjs` **dry-run**, review diffs | SEO | none | sanity-update-plan.md |
| 7 | `--apply` for **industries (8) + siteSettings defaults** | SEO | low (SEO fields only) | sanity-seo-export.csv (backup) |
| 8 | `--apply` for **blog posts (~10)** incl. protected odoo/cloud-diagram | SEO | low | metadata-plan.csv |
| 9 | Repo PR: fix `/services/` hub + `/about/` off-brand copy (meta + body) | Dev | low | technical-seo-issues.md T4/T5 |
| 10 | Trigger Cloudflare rebuild; verify new `<title>`/`<meta>` live | Dev | none | — |

**Exit criteria:** no indexable page missing seoTitle/seoDescription; no page describing 404'd old services.

---

## Week 3 — Internal linking + schema (topical authority + AEO)

| # | Action | Owner | Risk | Ref |
|---|---|---|---|---|
| 11 | Add **Insights → Service** contextual links (P1 set: odoo guide, erp cost, cloud diagram, node-js → matching services) | Content | low | internal-linking-plan.md |
| 12 | Add service↔service + service→industry cross-links | Content | low | internal-linking-plan.md |
| 13 | Upgrade `Organization` → `["Organization","ProfessionalService"]` + `knowsAbout` | Dev | low | schema-plan.md S1 |
| 14 | Add homepage service `OfferCatalog`/`Service` enumeration | Dev | low | schema-plan.md S2 |
| 15 | Add lightweight `Service`/`CollectionPage` schema to industry pages | Dev | low | schema-plan.md S3 |
| 16 | Sitemap `lastmod` + default OG image | Dev | low | technical-seo-issues.md T9/T10 |

**Exit criteria:** every protected/ranking post links to its service; entity enumerates the 5 pillars in JSON-LD.

---

## Week 4 — Recover the high-value informational pages (durable growth)

| # | Action | Owner | Risk | Ref |
|---|---|---|---|---|
| 17 | Recreate `/insights/what-is-custom-software/` (target "custom software", vol 1,000) + 301 the legacy URL to it | Content | low | redirect-risk-check.md §4 |
| 18 | Recreate `/insights/business-process-automation-tools/` ("process automation software", $30.58 CPC) | Content | low | §4 |
| 19 | Recreate `/insights/modern-website-design-ideas/` (vol 720/880) | Content | low | §4 |
| 20 | (Optional) `/insights/on-premise-vs-cloud-erp/` (3 backlinks) | Content | low | §4 |
| 21 | Sanity category cleanup: dedupe `blogCategory` docs; resolve empty `automation-ai` | Content-ops | med (verify refs) | technical-seo-issues.md T7/T8 |
| 22 | Re-measure Core Web Vitals (PageSpeed/CrUX) post-changes | Dev | none | technical-seo-issues.md T12 |

**Exit criteria:** the top informational queries point to real, indexable, internally-linked KP Infotech content (not a service-page 301).

---

## Weekly monitoring (every Monday)

Track in a simple sheet; compare to the 2026-06-26 baseline (semrush-domain-baseline.csv):
1. **404 watch** — re-run the curl sweep; alert if any of the 42 (or any ranking URL) returns 404.
2. **GSC** — clicks/impressions/avg-position by page; the **"Not found (404)"** coverage count (should trend to 0); branded "kp infotech" CTR.
3. **SEMrush** — organic keyword count (baseline 65 / IN), top-page traffic share, any keyword position drops >5.
4. **Indexing** — confirm 5 services + 8 industries stay "Indexed"; watch for "Crawled–not indexed".
5. **New pages** — index status + first impressions for recreated Insights posts.
6. **Regression guard** — after any deploy, diff production redirects vs the committed `_redirects` to catch drift.

## North-star (90 days)
Grow **non-branded** commercial keywords (custom software, business automation, Odoo ERP, AI agents, cloud/DevOps + the 8 industries) from a handful to a defensible core, with the 5 service pages and recovered informational pages as the ranking surface. Branded "kp infotech" already converts at #2 — the work is widening the **top of funnel** the migration nearly erased.
