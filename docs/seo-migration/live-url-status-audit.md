# Live URL Status Audit

Generated: 29/06/2026, 10:02:11 GMT+5:30 (2026-06-29T04:32:11.163Z)

Scope: legacy URL status and redirect behavior on `https://kpinfo.tech`. No redirects or page behavior were changed by this audit.

## Method

- Each legacy URL was requested with manual `HEAD` redirect following, equivalent in intent to `curl -sI -L`.
- The final URL was also requested with `GET` to identify hard 404 vs soft 404 vs valid HTML.
- Repo behavior was compared against `src/worker.js`, `src/worker/migration-redirects.js`, `public/_redirects`, `wrangler.toml`, and the generated Astro route surface.
- Recommendations are action buckets only; they are not implemented redirects.

## Summary

- Audited URLs: 42
- Hard 404: 42
- Soft 404: 0
- Redirects ending in 200: 0
- Valid pages without redirect: 0
- Final URL is 200: 0

Old 404 assumptions are still true for all 42 audited URLs. No audited URL had outdated 404 assumptions: none currently redirects and none resolves as a valid 200 page.

## Redirect Source Drift Risk

For this audited URL set, production behavior appears to match repo-controlled redirect sources: none of the 42 exact legacy paths is configured in the Worker migration map or `public/_redirects`, and every live request returns a hard 404.

The production redirect source is Worker-first: `wrangler.toml` points `main` to `src/worker.js`, and that Worker calls `src/worker/migration-redirects.js` before Astro handles the request. `public/_redirects` is still present, but under the current Cloudflare Workers deployment it should be treated as fallback/documentation unless deployment behavior changes. There is drift risk outside this audited set because `_redirects` and the Worker map do not always name the same destination for older service URLs. Future redirect work should update the Worker map and tests first, then keep `_redirects` synchronized as a fallback record.

## Live Facts

| Legacy URL | Initial | Chain | Final URL | Final | 200? | Classification | Repo comparison | Action bucket | Recommended target |
|---|---:|---|---|---:|---|---|---|---|---|
| /what-is-customised-software/ | 404 | 404 https://kpinfo.tech/what-is-customised-software/ | https://kpinfo.tech/what-is-customised-software/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/custom-software-development/ |
| /business-process-automation-tools/ | 404 | 404 https://kpinfo.tech/business-process-automation-tools/ | https://kpinfo.tech/business-process-automation-tools/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/business-automation/ |
| /5-best-modern-website-design-ideas/ | 404 | 404 https://kpinfo.tech/5-best-modern-website-design-ideas/ | https://kpinfo.tech/5-best-modern-website-design-ideas/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /data-visualization-best-practices/ | 404 | 404 https://kpinfo.tech/data-visualization-best-practices/ | https://kpinfo.tech/data-visualization-best-practices/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs content recreation | - |
| /business-process-improvement-methods/ | 404 | 404 https://kpinfo.tech/business-process-improvement-methods/ | https://kpinfo.tech/business-process-improvement-methods/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/business-automation/ |
| /best-ecommerce-platform-for-small-business/ | 404 | 404 https://kpinfo.tech/best-ecommerce-platform-for-small-business/ | https://kpinfo.tech/best-ecommerce-platform-for-small-business/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs content recreation | - |
| /about-kp-infotech-expertise/ | 404 | 404 https://kpinfo.tech/about-kp-infotech-expertise/ | https://kpinfo.tech/about-kp-infotech-expertise/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /about/ |
| /on-premise-vs-cloud-erp/ | 404 | 404 https://kpinfo.tech/on-premise-vs-cloud-erp/ | https://kpinfo.tech/on-premise-vs-cloud-erp/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/erp-software/ |
| /web-design-company/ | 404 | 404 https://kpinfo.tech/web-design-company/ | https://kpinfo.tech/web-design-company/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /graphics-design/ | 404 | 404 https://kpinfo.tech/graphics-design/ | https://kpinfo.tech/graphics-design/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /how-to-choose-erp-system/ | 404 | 404 https://kpinfo.tech/how-to-choose-erp-system/ | https://kpinfo.tech/how-to-choose-erp-system/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /insights/odoo-erp-complete-guide/ |
| /how-to-choose-the-right-digital-marketing-channels-for-your-business/ | 404 | 404 https://kpinfo.tech/how-to-choose-the-right-digital-marketing-channels-for-your-business/ | https://kpinfo.tech/how-to-choose-the-right-digital-marketing-channels-for-your-business/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /how-to-make-a-website-mobile-friendly/ | 404 | 404 https://kpinfo.tech/how-to-make-a-website-mobile-friendly/ | https://kpinfo.tech/how-to-make-a-website-mobile-friendly/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /requirements-gathering-techniques/ | 404 | 404 https://kpinfo.tech/requirements-gathering-techniques/ | https://kpinfo.tech/requirements-gathering-techniques/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/custom-software-development/ |
| /architecture-of-a-mobile-app/ | 404 | 404 https://kpinfo.tech/architecture-of-a-mobile-app/ | https://kpinfo.tech/architecture-of-a-mobile-app/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs content recreation | - |
| /sample-digital-marketing-strategy/ | 404 | 404 https://kpinfo.tech/sample-digital-marketing-strategy/ | https://kpinfo.tech/sample-digital-marketing-strategy/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /affordable-web-hosting-solutions-for-businesses/ | 404 | 404 https://kpinfo.tech/affordable-web-hosting-solutions-for-businesses/ | https://kpinfo.tech/affordable-web-hosting-solutions-for-businesses/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /web-application-security-guide/ | 404 | 404 https://kpinfo.tech/web-application-security-guide/ | https://kpinfo.tech/web-application-security-guide/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs content recreation | - |
| /analytics-and-data-visualization/ | 404 | 404 https://kpinfo.tech/analytics-and-data-visualization/ | https://kpinfo.tech/analytics-and-data-visualization/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs content recreation | - |
| /digital-transformation-roadmap/ | 404 | 404 https://kpinfo.tech/digital-transformation-roadmap/ | https://kpinfo.tech/digital-transformation-roadmap/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs content recreation | - |
| /digital-marketing-for-startups/ | 404 | 404 https://kpinfo.tech/digital-marketing-for-startups/ | https://kpinfo.tech/digital-marketing-for-startups/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /website-and-app-development-company/ | 404 | 404 https://kpinfo.tech/website-and-app-development-company/ | https://kpinfo.tech/website-and-app-development-company/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/custom-software-development/ |
| /website-design/ | 404 | 404 https://kpinfo.tech/website-design/ | https://kpinfo.tech/website-design/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /how-to-create-brand-guidelines/ | 404 | 404 https://kpinfo.tech/how-to-create-brand-guidelines/ | https://kpinfo.tech/how-to-create-brand-guidelines/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /applications-based-on-cloud-computing/ | 404 | 404 https://kpinfo.tech/applications-based-on-cloud-computing/ | https://kpinfo.tech/applications-based-on-cloud-computing/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/cloud-devops/ |
| /software-development-process-phases/ | 404 | 404 https://kpinfo.tech/software-development-process-phases/ | https://kpinfo.tech/software-development-process-phases/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/custom-software-development/ |
| /software-development-life-cycle-example/ | 404 | 404 https://kpinfo.tech/software-development-life-cycle-example/ | https://kpinfo.tech/software-development-life-cycle-example/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/custom-software-development/ |
| /benefits-of-erp/ | 404 | 404 https://kpinfo.tech/benefits-of-erp/ | https://kpinfo.tech/benefits-of-erp/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /insights/odoo-erp-complete-guide/ |
| /erp-solutions-for-small-businesses/ | 404 | 404 https://kpinfo.tech/erp-solutions-for-small-businesses/ | https://kpinfo.tech/erp-solutions-for-small-businesses/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /insights/odoo-erp-complete-guide/ |
| /erp-implementation-best-practices/ | 404 | 404 https://kpinfo.tech/erp-implementation-best-practices/ | https://kpinfo.tech/erp-implementation-best-practices/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/erp-software/ |
| /how-to-use-odoo-crm-for-effective-customer-relationships/ | 404 | 404 https://kpinfo.tech/how-to-use-odoo-crm-for-effective-customer-relationships/ | https://kpinfo.tech/how-to-use-odoo-crm-for-effective-customer-relationships/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /insights/odoo-erp-complete-guide/ |
| /business-process-automation-examples/ | 404 | 404 https://kpinfo.tech/business-process-automation-examples/ | https://kpinfo.tech/business-process-automation-examples/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/business-automation/ |
| /analytics-in-banking-industry/ | 404 | 404 https://kpinfo.tech/analytics-in-banking-industry/ | https://kpinfo.tech/analytics-in-banking-industry/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs content recreation | - |
| /mobile-app-testing-checklist/ | 404 | 404 https://kpinfo.tech/mobile-app-testing-checklist/ | https://kpinfo.tech/mobile-app-testing-checklist/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs content recreation | - |
| /how-to-create-a-process-map/ | 404 | 404 https://kpinfo.tech/how-to-create-a-process-map/ | https://kpinfo.tech/how-to-create-a-process-map/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/business-automation/ |
| /how-to-increase-online-sales/ | 404 | 404 https://kpinfo.tech/how-to-increase-online-sales/ | https://kpinfo.tech/how-to-increase-online-sales/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /optimizing-cloud-computing/ | 404 | 404 https://kpinfo.tech/optimizing-cloud-computing/ | https://kpinfo.tech/optimizing-cloud-computing/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/cloud-devops/ |
| /b-2-b-lead-generation-strategies/ | 404 | 404 https://kpinfo.tech/b-2-b-lead-generation-strategies/ | https://kpinfo.tech/b-2-b-lead-generation-strategies/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /website-development-for-startups/ | 404 | 404 https://kpinfo.tech/website-development-for-startups/ | https://kpinfo.tech/website-development-for-startups/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/custom-software-development/ |
| /privacy-policy-2/ | 404 | 404 https://kpinfo.tech/privacy-policy-2/ | https://kpinfo.tech/privacy-policy-2/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /privacy-policy/ |
| /how-to-make-a-website/ | 404 | 404 https://kpinfo.tech/how-to-make-a-website/ | https://kpinfo.tech/how-to-make-a-website/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs manual approval | - |
| /best-practices-for-devops/ | 404 | 404 https://kpinfo.tech/best-practices-for-devops/ | https://kpinfo.tech/best-practices-for-devops/ | 404 | no | hard 404 | matches repo: no redirect configured | Needs 301 redirect | /services/cloud-devops/ |

## Action Buckets

### Already OK / preserve

- None in this audit.

### Needs 301 redirect

- `/what-is-customised-software/` -> /services/custom-software-development/: Clear custom software service intent; approve exact target before implementation.
- `/business-process-automation-tools/` -> /services/business-automation/: Clear automation service intent; consider recreating article later if GSC shows demand.
- `/business-process-improvement-methods/` -> /services/business-automation/: Process improvement maps to the automation service.
- `/about-kp-infotech-expertise/` -> /about/: Clear about-page replacement.
- `/on-premise-vs-cloud-erp/` -> /services/erp-software/: ERP/cloud comparison maps to ERP service unless a dedicated guide is recreated.
- `/how-to-choose-erp-system/` -> /insights/odoo-erp-complete-guide/: Closest current ERP guide exists.
- `/requirements-gathering-techniques/` -> /services/custom-software-development/: Discovery/requirements content maps to custom software delivery.
- `/website-and-app-development-company/` -> /services/custom-software-development/: Closest current service page for broad software/web development intent.
- `/applications-based-on-cloud-computing/` -> /services/cloud-devops/: Cloud computing intent maps to Cloud & DevOps.
- `/software-development-process-phases/` -> /services/custom-software-development/: Software process intent maps to custom software development.
- `/software-development-life-cycle-example/` -> /services/custom-software-development/: SDLC intent maps to custom software development.
- `/benefits-of-erp/` -> /insights/odoo-erp-complete-guide/: Closest current ERP educational guide exists.
- `/erp-solutions-for-small-businesses/` -> /insights/odoo-erp-complete-guide/: Closest current ERP educational guide exists.
- `/erp-implementation-best-practices/` -> /services/erp-software/: Maps to ERP implementation service unless a best-practices article is recreated.
- `/how-to-use-odoo-crm-for-effective-customer-relationships/` -> /insights/odoo-erp-complete-guide/: Closest current Odoo/ERP guide exists.
- `/business-process-automation-examples/` -> /services/business-automation/: Automation examples map to the automation service; article recreation can follow if needed.
- `/how-to-create-a-process-map/` -> /services/business-automation/: Process mapping maps to automation/process work.
- `/optimizing-cloud-computing/` -> /services/cloud-devops/: Cloud optimization intent maps to Cloud & DevOps.
- `/website-development-for-startups/` -> /services/custom-software-development/: Startup web/software development maps to custom software development.
- `/privacy-policy-2/` -> /privacy-policy/: Clear policy-page replacement.
- `/best-practices-for-devops/` -> /services/cloud-devops/: DevOps topic maps to Cloud & DevOps.

### Needs content recreation

- `/data-visualization-best-practices/`: Aligned analytics/operations topic but no close current page exists.
- `/best-ecommerce-platform-for-small-business/`: Potential retail/ecommerce operations topic; no exact current article exists.
- `/architecture-of-a-mobile-app/`: Technical app architecture topic has no current equivalent.
- `/web-application-security-guide/`: Useful custom software/cloud trust topic but no close current page exists.
- `/analytics-and-data-visualization/`: Potential operations reporting topic; no current equivalent exists.
- `/digital-transformation-roadmap/`: Aligned transformation topic but should be rebuilt with current positioning.
- `/analytics-in-banking-industry/`: Could support finance/software authority; no close current page exists.
- `/mobile-app-testing-checklist/`: Technical QA topic has no current equivalent.

### Needs manual approval

- `/5-best-modern-website-design-ideas/`: Design-agency topic is off the current B2B operations positioning.
- `/web-design-company/`: Generic web-design agency intent conflicts with current operations technology positioning.
- `/graphics-design/`: Graphic design is no longer a primary service.
- `/how-to-choose-the-right-digital-marketing-channels-for-your-business/`: Digital marketing is outside the current service positioning.
- `/how-to-make-a-website-mobile-friendly/`: Generic website topic; approve whether to retire, redirect, or recreate.
- `/sample-digital-marketing-strategy/`: Digital marketing topic is outside current service positioning.
- `/affordable-web-hosting-solutions-for-businesses/`: Hosting-price intent is not a current core offer.
- `/digital-marketing-for-startups/`: Digital marketing topic is outside current service positioning.
- `/website-design/`: Generic website design intent needs approval under current positioning.
- `/how-to-create-brand-guidelines/`: Branding topic is not a current core offer.
- `/how-to-increase-online-sales/`: Generic sales/marketing topic needs approval under current positioning.
- `/b-2-b-lead-generation-strategies/`: Lead generation topic is outside current core services.
- `/how-to-make-a-website/`: Generic website tutorial needs approval under current positioning.

### Needs fresh GSC validation

- All 42 audited URLs should be rechecked in Google Search Console after any redirect or content-recreation batch is implemented. Today they are all live hard 404s, so GSC validation should happen only after a reviewed remediation batch is deployed.

## CSV

The machine-readable audit is in `docs/seo-migration/live-url-status-audit.csv`.
