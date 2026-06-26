# Internal Linking Plan — kpinfo.tech

**Date:** 2026-06-26 · **Goal:** strengthen topical paths from Insights → Services and between related services, without over-optimizing anchors or disturbing ranking pages.

## How links are added here
Blog/service/case-study/industry bodies are **Sanity Portable Text** with an `internalLink` mark (`markDefs[]._type == "internalLink"` with a `reference->`). So contextual links are **content edits in Sanity** (require approval — body-content change). Structural links (nav, footer, related grids) already exist in the repo.

### Already in place (no action)
- **Home → 5 services** (RelatedServicesGrid) and **Home → industries** (IndustriesBento) ✅
- **Footer → all services + industries** ✅
- **Industries → related services** (RelatedServicesGrid) + **→ related work** ✅
- **Services → related work** (ServiceWork) ✅
- **Blog posts → related posts** (same category/tags) ✅
- **Breadcrumbs** on every deep page ✅

### The gap
**Insights posts rarely link to the matching Service page.** This is the highest-value internal-linking opportunity: it passes topical relevance to commercial pages and gives readers the next step. Add 1–2 contextual links per post.

## Recommended links (priority: P1 = protected/ranking post, P2 = supporting)

| # | Source URL | → Target URL | Suggested anchor (natural) | Reason | Priority |
|---|---|---|---|---|---|
| 1 | /insights/odoo-erp-complete-guide/ | /services/erp-software/ | "Odoo ERP implementation and customization" | Protected ERP asset → ERP service | **P1** |
| 2 | /insights/erp-implementation-cost/ | /services/erp-software/ | "ERP implementation and support" | Buyer-intent post → ERP service | **P1** |
| 3 | /insights/erp-for-retail-stores/ | /services/erp-software/ | "ERP for retail operations" | + also link to /industries/retail-ecommerce/ | **P1** |
| 4 | /insights/inventory-management-best-practices/ | /services/erp-software/ | "inventory and operations in one ERP" | Inventory → ERP | P2 |
| 5 | /insights/cloud-deployment-models-diagram/ | /services/cloud-devops/ | "cloud and DevOps services" | Ranking cloud post → cloud service | **P1** |
| 6 | /insights/node-js-frameworks/ | /services/custom-software-development/ | "custom software development" | Ranking dev post → custom software | **P1** |
| 7 | /insights/best-web-application-frameworks/ | /services/custom-software-development/ | "build a custom web application" | Dev post → custom software | P2 |
| 8 | /insights/scalable-system-architecture/ | /services/custom-software-development/ | "architect and build scalable software" | Architecture → custom software | P2 |
| 9 | /insights/database-design-best-practices/ | /services/custom-software-development/ | "custom software and data systems" | DB post → custom software | P2 |
| 10 | /insights/minimum-viable-product-examples/ | /services/custom-software-development/ | "build your MVP" (+ /industries/startups/) | MVP → custom software + startups | P2 |
| 11 | /insights/mobile-app-monetization-strategies/ | /services/custom-software-development/ | "mobile app development" | Mobile post → custom software | P3 |
| 12 | /insights/best-hr-software-for-startups/ | /services/business-automation/ | "automate HR and admin workflows" | HR/ops → automation | P2 |
| 13 | /insights/best-seo-tools-for-small-businesses/ | /services/custom-software-development/ | "custom dashboards and tools" | Weak topical; optional | P3 |
| 14 | /insights/kp-infotech-new-website-custom-software-automation-ai/ | all 5 services | service names inline | Launch post → service hub paths | P2 |

## Service ↔ Service / Service → Industry (cross-links in service body)

| # | Source | → Target | Anchor | Reason | Priority |
|---|---|---|---|---|---|
| 15 | /services/erp-software/ | /services/business-automation/ | "automate workflows around your ERP" | Adjacent demand | P2 |
| 16 | /services/business-automation/ | /services/ai-automation-agents/ | "AI agents for operations" | Upsell path | P2 |
| 17 | /services/ai-automation-agents/ | /services/business-automation/ | "broader business automation" | Reverse path | P2 |
| 18 | /services/custom-software-development/ | /services/cloud-devops/ | "deploy and run it reliably" | Build → run | P2 |
| 19 | /services/erp-software/ | /industries/manufacturing/, /industries/retail-ecommerce/ | "ERP for manufacturing / retail" | Service → vertical | P3 |

## Future content → service hubs (after recreation, see redirect-risk-check.md §4)
- New `/insights/what-is-custom-software/` → /services/custom-software-development/
- New `/insights/business-process-automation-tools/` → /services/business-automation/
- New `/insights/modern-website-design-ideas/` → /services/custom-software-development/

## Rules followed
- Natural, varied anchors — **no** exact-match keyword stuffing (e.g. "Odoo ERP implementation and customization", not "best odoo erp company").
- 1–2 contextual links per post; don't bloat.
- **Do not remove** existing links from ranking pages.
- Links point only to live 200 pages (verified).
