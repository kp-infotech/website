# Step 1F — Production verification

**STEP 1 PRODUCTION VERIFICATION FAILED**

Deployment succeeded. All required restored articles, historical redirects, sitemap pages, case studies, robots checks, and protected 404s passed. The strict production internal-link audit failed on four pagination links using noncanonical, slashless URLs. These are **307 → 200 normalization redirects, not dead or missing pages**. No automatic code change or workaround was made after this finding. Step 2 has not started.

## Deployment

- Deployed Git revision: `929596f06abc4a69952e8736149580e361d48946`.
- Reviewed application revision: `06f0151882ba75e56a3f04a0e4da4d7437eb6063`; subsequent changes were the approved Step 1E report/audit script only.
- Branch: `codex/seo-step-1-release-candidate`.
- Isolated worktree: `/private/tmp/kp-step1-release-candidate`.
- Mechanism: fresh authenticated `npm run build`, verification, then the repository's normal `wrangler deploy` using its generated adapter configuration. Generated output was not edited.
- Production Worker: `website`, KP Infotech account `c727a19f93045d1c218d54f510af40c2`.
- Deployment timestamp: `2026-09-17T04:26:35.866521Z` (09:56:35 IST).
- Cloudflare deployment ID: `bfdb8d29-97d0-4f6d-94a9-cee812f7bd89`.
- Cloudflare version: `3437a0f3-d164-43d4-97d7-64aaea9a4d88`, serving 100%.
- Domain `kpinfo.tech` remains enabled on the same Worker.
- SESSION KV namespace preserved: `2c096c90da704a4fb42c8734ae99cc2e`. Wrangler explicitly reported SESSION as inherited; post-deploy API inspection confirmed its unchanged ID.
- No unrelated original-working-tree changes were included. The original 304-file snapshot, Git status, and HEAD preservation checks passed. No Git branch was pushed or merged.

### Build configuration and secret handling

Cloudflare Settings → Builds confirms SANITY_API_TOKEN as **Secret**, value encrypted. All four required public build variables are present and unchanged: PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_GA_MEASUREMENT_ID, PUBLIC_CLARITY_ID. The existing PUBLIC_TURNSTILE_SITE_KEY was also retained in the production-equivalent build to preserve form configuration.

The user revoked and replaced the previously exposed credential and updated `.env` and the private build secret. A published-perspective read using the replacement token returned all six required documents, and the deployed artifacts came from that fresh authenticated build. No credential was found in generated artifacts. The mistaken plain-text runtime SANITY_API_TOKEN was removed and remains absent after deployment. No secret value appears in this report.

An automatic approval review initially blocked deployment because the dashboard diff suggested domain/KV removal. Read-only inspection of the installed Wrangler implementation and a dry run established that no route mutation is called for an empty configured route list and the existing SESSION binding is inherited. The retry was approved; post-release API checks verified both settings preserved. No alternate deployment path or generated-file modification was used.

## Pre-deployment tests

- Fresh authenticated build: PASS.
- Full test suite: **45 passed, 0 failed, 0 skipped**.
- Redirect verifier: PASS.
- Step 1C artifact audit: PASS.
- Step 1E six-article artifact audit: PASS.
- Git diff checks: PASS; candidate was clean at deployment.
- Generated sitemap: 56 URLs; generated HTML: 57 files including the 404 document.
- No unsupported case-study page, unapproved 410 implementation, or unrelated original-working-tree change was added.

## Homepage

`https://kpinfo.tech/` → **200**, no noindex meta/header, exactly one canonical `https://kpinfo.tech/`. Browser accessibility and screenshot inspection confirmed the normal hero, navigation, services, and featured projects rendered without a deployment error. Homepage metadata was not optimized in this step.

## Six Restored Articles

Every article below returned **200**, was indexable, had one exact apex self-canonical, one rendered substantial article body, one matching BlogPosting schema, and breadcrumb schema. No empty article was found. All are present in the live sitemap. They are the explicitly approved published private-ID documents, not drafts; no unapproved private pages were introduced.

| Live route | HTTP | Canonical/indexability | Content/schema/sitemap |
|---|---|---|---|
| `/insights/business-process-automation-tools/` | 200 | PASS | PASS |
| `/insights/business-process-improvement-methods/` | 200 | PASS | PASS |
| `/insights/devops-best-practices/` | 200 | PASS | PASS |
| `/insights/how-to-choose-erp-system/` | 200 | PASS | PASS |
| `/insights/on-premise-vs-cloud-erp/` | 200 | PASS | PASS |
| `/insights/what-is-custom-software/` | 200 | PASS | PASS |

## Eight Historical Redirects

All eight sources below were checked with slash/no-slash variants using GET and HEAD (32 source/final checks). Each is exactly one 301 to the expected destination, followed by 200. No chain, loop, or 301 → 404.

| Source | Live destination | Result |
|---|---|---|
| `/blogs/business-process-automation-tools/` | `/insights/business-process-automation-tools/` | 301 → 200 |
| `/blogs/business-process-improvement-methods/` | `/insights/business-process-improvement-methods/` | 301 → 200 |
| `/blogs/devops-best-practices/` | `/insights/devops-best-practices/` | 301 → 200 |
| `/devops-best-practices/` | `/insights/devops-best-practices/` | 301 → 200 |
| `/blogs/how-to-choose-erp-system/` | `/insights/how-to-choose-erp-system/` | 301 → 200 |
| `/blogs/on-premise-vs-cloud-erp/` | `/insights/on-premise-vs-cloud-erp/` | 301 → 200 |
| `/blogs/what-is-custom-software/` | `/insights/what-is-custom-software/` | 301 → 200 |
| `/what-is-custom-software/` | `/insights/what-is-custom-software/` | 301 → 200 |

## Sitemap

`https://kpinfo.tech/sitemap-index.xml` → 200 and references exactly `https://kpinfo.tech/sitemap-0.xml` → 200.

**Exact live page count: 56.** The live URL set equals the authenticated candidate's generated sitemap. All 56 pages return final 200 responses, have one correct apex self-canonical, and have no noindex meta/header. All six restored insights and exactly the five approved case-study details are included. No legacy redirect sources, 404 URLs, sample-marketing URL, unsupported projects, draft/release variants, or additional unapproved pages are included.

The separate existing Step 1C production audit passed all 58 page/sitemap HTTP checks with zero errors.

## Case Studies

The following detail pages are live 200, indexable, self-canonical, in the sitemap, and are exactly the five cards on `/work/`:

- `/work/cloud-cost-optimization-industrial-sme/`
- `/work/collaboration-platform-distributed-teams/`
- `/work/digital-banking-platform/`
- `/work/omnichannel-ecommerce-platform/`
- `/work/virtual-tours-ai-listings/`

The work hub has no placeholder cards or missing-project links. Homepage featured count was not used to infer the total case-study count.

### All 21 unsupported projects

Each slug below was checked at `/casestudy/<slug>`, `/casestudy/<slug>/`, and `/work/<slug>/` (63 responses). **Every response was the branded HTML 404 with no Location header**. None became 410, a homepage/hub fallback, or a 301 to a missing destination.

- `ai-shopping-app-visual-search` — all three variants 404.
- `ar-furniture-configurator` — all three variants 404.
- `cloud-ehr-multi-specialty` — all three variants 404.
- `crypto-trading-platform` — all three variants 404.
- `digital-wallet-p2p-payments` — all three variants 404.
- `fleet-management-route-optimization` — all three variants 404.
- `food-delivery-platform` — all three variants 404.
- `insurance-claims-ai-portal` — all three variants 404.
- `inventory-warehouse-management` — all three variants 404.
- `investment-portfolio-app` — all three variants 404.
- `learning-management-system-university` — all three variants 404.
- `patient-engagement-app` — all three variants 404.
- `production-planning-mrp-automotive` — all three variants 404.
- `property-management-erp-portal` — all three variants 404.
- `quality-control-dashboard-spc` — all three variants 404.
- `saas-mvp-project-management` — all three variants 404.
- `secure-telemedicine-platform` — all three variants 404.
- `shipment-tracking-last-mile` — all three variants 404.
- `student-portal-mobile-app` — all three variants 404.
- `supplier-management-procurement` — all three variants 404.
- `warehouse-automation-robotics` — all three variants 404.

## Sample Marketing

Mandatory production check passed:

- `https://kpinfo.tech/sample-digital-marketing-strategy/` → normal branded **404**, no Location.
- No-slash variant → normal branded **404**, no Location.
- Slash variant with `?ref=legacy` → normal branded **404**, no Location.

No 410, 301, or 200 was introduced.

## Robots

`https://kpinfo.tech/robots.txt` → **200** and contains:

```text
User-agent: *
Allow: /
Sitemap: https://kpinfo.tech/sitemap-index.xml
```

Google crawling is not blocked. All 56 sitemap pages, including the restored articles and service pages, passed robots meta/header indexability checks.

## Internal Links

- Actual dead `/work/...` or `/insights/...` destinations: **0**.
- Links to unsupported projects: **0**.
- Links matching any retained legacy migration source: **0**, checked against the actual migration resolver across all 56 live pages.
- Placeholder project cards: **0**.
- Noncanonical pagination link occurrences: **4**, across three distinct slashless URLs.

The strict production audit required links to be direct final-200 sitemap URLs. These four occurrences failed that check:

| Source page | Rendered href | Actual live behavior |
|---|---|---|
| `/insights/` | `/insights/2` | 307 → `/insights/2/` → 200 |
| `/insights/2/` | `/insights` | 307 → `/insights/` → 200 |
| `/insights/2/` | `/insights/3` | 307 → `/insights/3/` → 200 |
| `/insights/3/` | `/insights/2` | 307 → `/insights/2/` → 200 |

The audit JSON's `deadLinks` field initially collected these noncanonical candidates; follow-up HTTP diagnosis confirmed **none are dead pages**. This distinction is preserved rather than reporting four 404s. The audit's direct-final-URL assertion remains failed; it was not weakened, skipped, or automatically worked around. These findings concern existing pagination URL formatting, not the eight historical migrations, which all passed.

## Production Smoke Result

**FAIL — strict internal-link final-URL check only.** Deployment itself and every other listed production check passed. The approved release remains live; no rollback, additional application change, or automatic fix was made. SEO review should decide whether to accept normal pagination slash normalization or authorize a focused pagination-link correction before declaring Step 1 complete. Step 2 has not started.

## Release persistence note

This was an authorized local CLI release. No Git push or merge was performed. Cloudflare's existing Git build trigger and Sanity deploy hook still target `main`; a future build from an older remote revision can replace this release. Coordinate the reviewed branch's repository integration before triggering such a rebuild. No branch or hook settings were changed automatically.

## Evidence

- `/tmp/kp-step1f-deployment.json`: deployment ID, version, domain, and KV preservation.
- `/tmp/kp-step1f-production-audit.json`: all live page, article, redirect, removed-project, sample-marketing, robots, and pagination results.
- `/tmp/kp-step1f-production-step1c.json`: existing Step 1C production audit, zero errors.
- `/tmp/kp-step1f-legacy-internal-links.json`: zero legacy migration links.
- `/tmp/kp-step1f-tests.log`: 45/45 passing tests.
- `/tmp/kp-step1f-binding-safety.md`: read-only evidence resolving the automatic approval review concern.
