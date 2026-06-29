# Redirect Implementation Batch 1

## Source Of Truth

Production redirects are implemented at the Cloudflare Worker layer.

- `wrangler.toml` sets `main = "src/worker.js"`.
- `src/worker.js` calls `getMigrationRedirectLocation()` from `src/worker/migration-redirects.js` before handing the request to Astro.
- `src/worker/migration-redirects.js` is the redirect source of truth for this batch.
- `public/_redirects` is retained as documentation/fallback for older deployment modes, but it is not the active source for this Worker deployment.

Batch 1 uses exact 301 redirects only. It does not change Sanity content, metadata, schema, sitemap, robots/noindex behavior, canonicals, slugs, or page copy.

## Redirect Map

All source URLs below were confirmed as hard 404s in `docs/seo-migration/live-url-status-audit.md`.

| Legacy source | Target | Rationale |
|---|---|---|
| `/what-is-customised-software/` | `/services/custom-software-development/` | Clear custom software intent. |
| `/business-process-automation-tools/` | `/services/business-automation/` | Clear workflow automation intent. |
| `/5-best-modern-website-design-ideas/` | `/services/custom-software-development/` | Website/design topic is folded into broader custom software delivery for this approved batch. |
| `/data-visualization-best-practices/` | `/services/custom-software-development/` | Reporting/dashboard content maps to custom business software. |
| `/business-process-improvement-methods/` | `/services/business-automation/` | Process improvement maps to automation. |
| `/best-ecommerce-platform-for-small-business/` | `/industries/retail-ecommerce/` | E-commerce platform intent maps to the retail/ecommerce industry page. |
| `/about-kp-infotech-expertise/` | `/about/` | Clear about/company replacement. |
| `/on-premise-vs-cloud-erp/` | `/services/erp-software/` | ERP deployment comparison maps to ERP/Odoo service. |
| `/web-design-company/` | `/services/custom-software-development/` | Approved broad software/web delivery target. |
| `/how-to-choose-erp-system/` | `/services/erp-software/` | ERP selection maps to ERP/Odoo service. |
| `/how-to-make-a-website-mobile-friendly/` | `/services/custom-software-development/` | Web application implementation maps to custom software. |
| `/requirements-gathering-techniques/` | `/services/custom-software-development/` | Discovery and requirements map to custom software delivery. |
| `/architecture-of-a-mobile-app/` | `/services/custom-software-development/` | Application architecture maps to custom software development. |
| `/affordable-web-hosting-solutions-for-businesses/` | `/services/cloud-devops/` | Hosting and infrastructure map to Cloud & DevOps. |
| `/web-application-security-guide/` | `/services/cloud-devops/` | Security/infrastructure topic maps to Cloud & DevOps. |
| `/analytics-and-data-visualization/` | `/services/custom-software-development/` | Analytics and dashboard systems map to custom software. |
| `/digital-transformation-roadmap/` | `/services/business-automation/` | Transformation roadmap maps to automation and operations improvement. |
| `/digital-marketing-for-startups/` | `/industries/startups/` | Startup business-growth intent maps to startups industry page for this approved batch. |
| `/website-and-app-development-company/` | `/services/custom-software-development/` | Broad web/app development maps to custom software. |
| `/website-design/` | `/services/custom-software-development/` | Website delivery maps to custom software in the current positioning. |
| `/applications-based-on-cloud-computing/` | `/services/cloud-devops/` | Cloud application topic maps to Cloud & DevOps. |
| `/software-development-process-phases/` | `/services/custom-software-development/` | Software process maps to custom software development. |
| `/software-development-life-cycle-example/` | `/services/custom-software-development/` | SDLC content maps to custom software development. |
| `/benefits-of-erp/` | `/services/erp-software/` | ERP benefits map to ERP/Odoo service. |
| `/erp-solutions-for-small-businesses/` | `/services/erp-software/` | ERP solutions intent maps to ERP/Odoo service. |
| `/erp-implementation-best-practices/` | `/services/erp-software/` | ERP implementation maps to ERP/Odoo service. |
| `/how-to-use-odoo-crm-for-effective-customer-relationships/` | `/services/erp-software/` | Odoo CRM maps to ERP/Odoo service. |
| `/business-process-automation-examples/` | `/services/business-automation/` | Automation examples map to Business Automation. |
| `/analytics-in-banking-industry/` | `/industries/finance/` | Banking analytics maps to finance industry operations. |
| `/mobile-app-testing-checklist/` | `/services/custom-software-development/` | QA/testing topic maps to custom software delivery. |
| `/how-to-create-a-process-map/` | `/services/business-automation/` | Process mapping maps to Business Automation. |
| `/how-to-increase-online-sales/` | `/industries/retail-ecommerce/` | Online sales intent maps to retail/ecommerce operations. |
| `/optimizing-cloud-computing/` | `/services/cloud-devops/` | Cloud optimization maps to Cloud & DevOps. |
| `/website-development-for-startups/` | `/industries/startups/` | Startup website/software intent maps to startups industry page for this approved batch. |
| `/privacy-policy-2/` | `/privacy-policy/` | Clear privacy policy replacement. |
| `/how-to-make-a-website/` | `/services/custom-software-development/` | Website implementation maps to custom software. |
| `/best-practices-for-devops/` | `/services/cloud-devops/` | DevOps topic maps to Cloud & DevOps. |

## Manual Review URLs Not Implemented

These remain unchanged and should still return 404 until explicitly approved:

- `/graphics-design/`
- `/how-to-choose-the-right-digital-marketing-channels-for-your-business/`
- `/sample-digital-marketing-strategy/`
- `/how-to-create-brand-guidelines/`
- `/b-2-b-lead-generation-strategies/`

Details are documented in `docs/seo-migration/redirect-manual-review.md`.

## Verification Commands

Run these before review:

```bash
npm run build
npm run seo:verify-redirects
node --test tests/migration-redirects.test.mjs
node --test tests/seo-metadata-batch.test.mjs
```

The redirect verification script checks:

- Batch 1 source URLs resolve to the approved target through the Worker redirect function.
- `PERMANENT_REDIRECT_STATUS` is `301`.
- Current targets do not redirect again, preventing chains.
- Built target HTML files exist under `dist/client` after `npm run build`.
- Manual-review URLs are still not redirected.
- Existing Worker redirects still resolve to their previous targets.

## Local Verification Results

Last checked: 2026-06-29

```text
node --test tests/migration-redirects.test.mjs
PASS: 9 tests, 0 failures

node --test tests/seo-metadata-batch.test.mjs
PASS: 7 tests, 0 failures

npm run build
PASS: Astro build completed, sitemap generated, server built successfully.

npm run seo:verify-redirects
PASS: Batch 1 redirects return 301, existing protected redirects pass, manual-review URLs remain unredirected, targets do not redirect again, and built target HTML exists.
```

## Known Risks

- These redirects are implemented in the Worker map. If deployment changes back to Cloudflare Pages-only, `_redirects` would need to be synchronized before deployment.
- Some redirects intentionally consolidate older web/design/marketing-like topics into current operations technology pages because the target map was approved for this batch. GSC performance should be reviewed after deployment.
- Redirects are exact path matches after trailing-slash normalization. Query strings are preserved.
- The earlier live audit remains pre-implementation evidence. A fresh live audit should be run after deployment to confirm production behavior.
