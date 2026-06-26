# Redirect Risk Check — kpinfo.tech

**Date:** 2026-06-26
**Method:** SEMrush organic-keyword + backlink reports cross-referenced with **live HTTP status checks** (direct `curl`, 2026-06-26). Every proposed 301 target was verified to return **200** before being recommended.

> ⚠️ **Nothing in this document has been applied.** It is a proposal requiring approval. No URL is to be deleted, renamed, or redirected until signed off. All targets are existing, live, 200-status pages.

---

## 1. Headline risk — link-equity & ranking bleed from 404'd legacy URLs

The WordPress→Astro migration preserved **many** old URLs with 301s (good), but **42 legacy URLs that still carry SEMrush rankings and/or backlinks now return hard 404s.** They are not in the sitemap, not redirected, and are losing the link equity and rankings they accumulated.

Most damaging confirmed losses:

| Legacy URL (now 404) | Why it matters | Evidence |
|---|---|---|
| `/what-is-customised-software/` | **#2 organic page (7.4% of traffic)**; ranks "custom software" (vol **1,000**), "what is custom software" (vol 210) | SEMrush organic + 1 backlink |
| `/business-process-automation-tools/` | Ranks "process automation software" (vol 210, **CPC $30.58** — highest-value commercial term on the domain) | SEMrush organic + 1 backlink |
| `/5-best-modern-website-design-ideas/` | Ranks "modern website" (#23, vol 720) & "modern website design" (#48, vol 880); was 3.7% of traffic | SEMrush organic |
| `/data-visualization-best-practices/` | **12 backlinks / 3 referring domains** (highest-equity lost page) | SEMrush backlinks |
| `/business-process-improvement-methods/` | 7 backlinks / 6 domains | SEMrush backlinks |
| `/best-ecommerce-platform-for-small-business/` | Ranks "ecommerce platforms for small business" (#45); 6 backlinks | SEMrush organic + backlinks |
| `/about-kp-infotech-expertise/` | Branded "kp infotech" ranking (#54) | SEMrush organic |
| `/sample-digital-marketing-strategy/` | Ranks "digital marketing strategy example/ideas" (vol 170/260) | SEMrush organic |
| `/architecture-of-a-mobile-app/` | Ranks "mobile application architecture" (vol 320) | SEMrush organic + backlink |
| +33 more backlinked legacy URLs | 1–4 backlinks each | see §3 |

**Recommended fix:** add 301 redirects (§3) **as the immediate safety action** to stop the bleed, then recreate the highest-value informational pages as Insights posts (§4) for the durable win.

---

## 2. Configuration drift — committed `public/_redirects` is STALE and points at 404s

The repo file [`public/_redirects`](../../public/_redirects) does **not** match live behavior and contains rules that would send users to **non-existent pages**:

| Rule in committed `public/_redirects` | Target status | Live behavior (actual) |
|---|---|---|
| `/services/website-design/ → /services/web-development/` | `/services/web-development/` = **404** | live 301 → `/services/custom-software-development/` ✅ |
| `/services/graphics-design/ → /services/ui-ux-design/` | (chains) | live 301 → `/services/custom-software-development/` ✅ |
| `/services/mobile-web-app/ → /services/mobile-apps/` | `/services/mobile-apps/` = **404** | live 301 → `/services/custom-software-development/` ✅ |
| `/services/marketing/ → /services/digital-marketing/` | `/services/digital-marketing/` = **404** | live: `/services/marketing/` = 404 |
| `/services/erp-solutions/ → /services/erp-software/` | OK | OK ✅ |

**Interpretation:** production redirects are currently served from a source **other than** the committed file — almost certainly **Cloudflare dashboard Bulk Redirects / Redirect Rules** (only 5 services exist in Sanity: `custom-software-development`, `business-automation`, `erp-software`, `ai-automation-agents`, `cloud-devops`; the file references an obsolete `web-development / ui-ux-design / mobile-apps / digital-marketing` taxonomy).

**Latent danger:** if anyone deploys `main` and the static `_redirects` *is* (or becomes) the active source, working redirects regress into 404s. **The committed file must be corrected to match live and become the single source of truth** — see §5.

➡️ **Human review required:** confirm whether production redirects come from the Cloudflare dashboard (Bulk Redirects/Redirect Rules) or the static `_redirects`. The 301s in §3 must be added to **whichever is active**.

---

## 3. Proposed 301 redirect map (42 URLs) — all targets verified 200

Intent-matched to the closest live page. Priority: **P1** = ranks now / ≥3 backlinks; **P2** = 1–2 backlinks or topical; **P3** = low equity.

| # | Legacy URL (404) | → 301 Target (200 ✅) | Priority | Rationale |
|---|---|---|---|---|
| 1 | `/what-is-customised-software/` | `/services/custom-software-development/` | **P1** | vol 1,000; also recreate as Insight (§4) |
| 2 | `/business-process-automation-tools/` | `/services/business-automation/` | **P1** | $30.58 CPC term; recreate as Insight (§4) |
| 3 | `/5-best-modern-website-design-ideas/` | `/services/custom-software-development/` | **P1** | vol 720/880; intent is informational — recreate ideal (§4) |
| 4 | `/data-visualization-best-practices/` | `/services/custom-software-development/` | **P1** | 12 backlinks (dashboards/analytics fit) |
| 5 | `/business-process-improvement-methods/` | `/services/business-automation/` | **P1** | 7 backlinks |
| 6 | `/best-ecommerce-platform-for-small-business/` | `/industries/retail-ecommerce/` | **P1** | ranks + 6 backlinks |
| 7 | `/about-kp-infotech-expertise/` | `/about/` | **P1** | branded equity |
| 8 | `/on-premise-vs-cloud-erp/` | `/insights/odoo-erp-complete-guide/` | **P1** | 3 backlinks; ERP comparison intent |
| 9 | `/how-to-choose-erp-system/` | `/insights/odoo-erp-complete-guide/` | **P1** | 2 backlinks; ERP buyer intent |
| 10 | `/web-design-company/` | `/services/custom-software-development/` | P2 | 3 backlinks |
| 11 | `/graphics-design/` (root) | `/services/custom-software-development/` | P2 | 3 backlinks; consistent w/ `/services/graphics-design/` |
| 12 | `/sample-digital-marketing-strategy/` | `/insights/` | P2 | no DM service; avoid intent mismatch |
| 13 | `/how-to-choose-the-right-digital-marketing-channels-for-your-business/` | `/insights/` | P2 | 4 backlinks; no DM service |
| 14 | `/architecture-of-a-mobile-app/` | `/services/custom-software-development/` | P2 | ranks; mobile under custom software |
| 15 | `/how-to-make-a-website-mobile-friendly/` | `/services/custom-software-development/` | P2 | 4 backlinks |
| 16 | `/requirements-gathering-techniques/` | `/services/custom-software-development/` | P2 | 4 backlinks |
| 17 | `/applications-based-on-cloud-computing/` | `/services/cloud-devops/` | P2 | ranks; cloud topic |
| 18 | `/affordable-web-hosting-solutions-for-businesses/` | `/services/cloud-devops/` | P2 | 2 backlinks |
| 19 | `/web-application-security-guide/` | `/services/cloud-devops/` | P2 | 2 backlinks; security/ops |
| 20 | `/analytics-and-data-visualization/` | `/services/custom-software-development/` | P2 | 2 backlinks |
| 21 | `/digital-transformation-roadmap/` | `/services/business-automation/` | P2 | 2 backlinks |
| 22 | `/digital-marketing-for-startups/` | `/industries/startups/` | P2 | 2 backlinks |
| 23 | `/website-and-app-development-company/` | `/services/custom-software-development/` | P2 | 2 backlinks |
| 24 | `/website-design/` (root) | `/services/custom-software-development/` | P2 | 2 backlinks |
| 25 | `/how-to-create-brand-guidelines/` | `/insights/` | P2 | 2 backlinks; design content, no service |
| 26 | `/how-to-make-a-website/` | `/services/custom-software-development/` | P2 | protected list |
| 27 | `/best-practices-for-devops/` | `/services/cloud-devops/` | P2 | protected list |
| 28 | `/benefits-of-erp/` | `/services/erp-software/` | P2 | 1 backlink |
| 29 | `/erp-solutions-for-small-businesses/` | `/services/erp-software/` | P2 | 1 backlink |
| 30 | `/erp-implementation-best-practices/` | `/insights/erp-implementation-cost/` | P2 | 1 backlink; topical |
| 31 | `/how-to-use-odoo-crm-for-effective-customer-relationships/` | `/services/erp-software/` | P2 | Odoo CRM (protected topic) |
| 32 | `/business-process-automation-examples/` | `/services/business-automation/` | P2 | 1 backlink |
| 33 | `/analytics-in-banking-industry/` | `/industries/finance/` | P2 | 1 backlink; vertical |
| 34 | `/software-development-process-phases/` | `/services/custom-software-development/` | P3 | ranks (low) |
| 35 | `/software-development-life-cycle-example/` | `/services/custom-software-development/` | P3 | ranks (low) |
| 36 | `/mobile-app-testing-checklist/` | `/services/custom-software-development/` | P3 | 1 backlink |
| 37 | `/how-to-create-a-process-map/` | `/services/business-automation/` | P3 | 1 backlink |
| 38 | `/how-to-increase-online-sales/` | `/industries/retail-ecommerce/` | P3 | 1 backlink |
| 39 | `/optimizing-cloud-computing/` | `/services/cloud-devops/` | P3 | 1 backlink |
| 40 | `/b-2-b-lead-generation-strategies/` | `/insights/` | P3 | 1 backlink |
| 41 | `/website-development-for-startups/` | `/industries/startups/` | P3 | 1 backlink |
| 42 | `/privacy-policy-2/` | `/privacy-policy/` | P3 | duplicate legacy URL |

---

## 4. Recreate-as-content (durable fix for high-value informational URLs)

A 301 from an **informational** query to a **commercial service page** risks a soft-404 / intent-mismatch demotion by Google. For the four highest-value informational losses, the durable win is to **recreate the content as an Insights post** and 301 the legacy URL to the new post (instead of the service page). Until recreated, the §3 redirect is the safe interim.

| Legacy URL | Recreate as Insight | Captures |
|---|---|---|
| `/what-is-customised-software/` | `/insights/what-is-custom-software/` | "custom software" (vol 1,000), "what is custom software" |
| `/business-process-automation-tools/` | `/insights/business-process-automation-tools/` | "process automation software" ($30.58 CPC) |
| `/5-best-modern-website-design-ideas/` | `/insights/modern-website-design-ideas/` | "modern website" / "modern website design" (vol 720/880) |
| `/on-premise-vs-cloud-erp/` (interim → odoo guide) | `/insights/on-premise-vs-cloud-erp/` | ERP comparison backlinks |

Each new post should internally link to its matching service (custom-software-development / business-automation / erp-software).

---

## 5. Working redirects — DO NOT TOUCH (verified 301 → 200)

These already resolve correctly and must be preserved exactly:

`/erp-software/`, `/odoo-crm/`, `/services/erp-software/odoo-crm/`, `/services/website-design/`, `/services/graphics-design/`, `/services/mobile-web-app/`, `/services/ui-ux-design/`, `/services/erp-solutions/`, `/mobile-web-app/`, `/hire-wordpress-developer/`, `/kp-infotech-faqs/`, `/casestudy/`, `/career/`, `/blogs/`, `/odoo-erp-complete-guide/`, `/erp-implementation-cost/`, `/cloud-deployment-models-diagram/`, `/scalable-system-architecture/`, `/node-js-frameworks/`, `/database-design-best-practices/`, `/inventory-management-best-practices/`, `/best-hr-software-for-startups/`, `/best-seo-tools-for-small-businesses/`, `/best-web-application-frameworks/`, `/angular-vs-react/`, `/minimum-viable-product-examples/`, `/mobile-app-monetization-strategies/`, `http:// → https://`.

---

## 6. Ready-to-apply `_redirects` block (proposal — append after approval)

> Format: Cloudflare `_redirects`. Add to the **active** redirect source (file or dashboard). Do **not** remove any existing working rule. Order: specific paths first.

```
# ─── Legacy WordPress 404 recovery (added 2026-06-26, pending approval) ───
/what-is-customised-software/                                          /services/custom-software-development/   301
/business-process-automation-tools/                                    /services/business-automation/           301
/5-best-modern-website-design-ideas/                                   /services/custom-software-development/    301
/data-visualization-best-practices/                                    /services/custom-software-development/    301
/business-process-improvement-methods/                                 /services/business-automation/           301
/best-ecommerce-platform-for-small-business/                           /industries/retail-ecommerce/            301
/about-kp-infotech-expertise/                                          /about/                                  301
/on-premise-vs-cloud-erp/                                              /insights/odoo-erp-complete-guide/       301
/how-to-choose-erp-system/                                             /insights/odoo-erp-complete-guide/       301
/web-design-company/                                                   /services/custom-software-development/    301
/graphics-design/                                                      /services/custom-software-development/    301
/sample-digital-marketing-strategy/                                    /insights/                               301
/how-to-choose-the-right-digital-marketing-channels-for-your-business/ /insights/                               301
/architecture-of-a-mobile-app/                                         /services/custom-software-development/    301
/how-to-make-a-website-mobile-friendly/                                /services/custom-software-development/    301
/requirements-gathering-techniques/                                    /services/custom-software-development/    301
/applications-based-on-cloud-computing/                                /services/cloud-devops/                  301
/affordable-web-hosting-solutions-for-businesses/                      /services/cloud-devops/                  301
/web-application-security-guide/                                       /services/cloud-devops/                  301
/analytics-and-data-visualization/                                     /services/custom-software-development/    301
/digital-transformation-roadmap/                                       /services/business-automation/           301
/digital-marketing-for-startups/                                       /industries/startups/                    301
/website-and-app-development-company/                                  /services/custom-software-development/    301
/website-design/                                                       /services/custom-software-development/    301
/how-to-create-brand-guidelines/                                       /insights/                               301
/how-to-make-a-website/                                                /services/custom-software-development/    301
/best-practices-for-devops/                                            /services/cloud-devops/                  301
/benefits-of-erp/                                                      /services/erp-software/                  301
/erp-solutions-for-small-businesses/                                   /services/erp-software/                  301
/erp-implementation-best-practices/                                    /insights/erp-implementation-cost/       301
/how-to-use-odoo-crm-for-effective-customer-relationships/             /services/erp-software/                  301
/business-process-automation-examples/                                 /services/business-automation/           301
/analytics-in-banking-industry/                                        /industries/finance/                     301
/software-development-process-phases/                                  /services/custom-software-development/    301
/software-development-life-cycle-example/                              /services/custom-software-development/    301
/mobile-app-testing-checklist/                                         /services/custom-software-development/    301
/how-to-create-a-process-map/                                          /services/business-automation/           301
/how-to-increase-online-sales/                                         /industries/retail-ecommerce/            301
/optimizing-cloud-computing/                                           /services/cloud-devops/                  301
/b-2-b-lead-generation-strategies/                                     /insights/                               301
/website-development-for-startups/                                     /industries/startups/                    301
/privacy-policy-2/                                                     /privacy-policy/                         301
```

**Also fix the stale service-slug targets** in the committed file so it matches live (change `web-development`→`custom-software-development`, `ui-ux-design`→`custom-software-development`, `mobile-apps`→`custom-software-development`; remove/repoint the dead `/services/marketing/` rule).

---

## 7. Verification checklist after applying (re-run before & after)

```bash
# Expect 301 → 200 for every legacy URL after deploy
for u in what-is-customised-software business-process-automation-tools 5-best-modern-website-design-ideas; do
  curl -sI "https://kpinfo.tech/$u/" | head -1
done
```
Then in GSC: submit the new redirects, watch the **Page Indexing → "Not found (404)"** count fall, and re-request indexing for the recreated Insights posts.
