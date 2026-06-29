# Redirect Manual Review

These legacy URLs were confirmed as hard 404s in `docs/seo-migration/live-url-status-audit.md`, but they are not included in Redirect Batch 1. They need manual approval because the old intent is weak, off-positioning, or no longer maps cleanly to KP Infotech's current B2B operations technology positioning.

## Manual Review URLs

| URL | Old signal from audit | Reason not redirected yet | Possible destination candidates | Recommendation |
|---|---|---|---|---|
| `/graphics-design/` | Hard 404, page title `Page Not Found - KP Infotech`, no redirect configured | Graphics design is no longer a core service and could send design-agency intent to an operations technology page. | `/services/custom-software-development/` only if approved as broader digital delivery; otherwise no strong current candidate. | Needs GSC/backlink review before deciding whether to keep 404, redirect, or recreate a narrow legacy explainer. |
| `/how-to-choose-the-right-digital-marketing-channels-for-your-business/` | Hard 404, page title `Page Not Found - KP Infotech`, no redirect configured | Digital marketing channel selection is outside the current service positioning. | Possible content recreation only if KP wants startup go-to-market operations content; weak candidates include `/industries/startups/`. | Keep 404 unless GSC/backlink evidence justifies content recreation or a manually approved redirect. |
| `/sample-digital-marketing-strategy/` | Hard 404, page title `Page Not Found - KP Infotech`, no redirect configured | Generic marketing strategy does not fit the five current service pillars. | Possible content recreation as a B2B operations planning article; no direct service-page target. | Keep 404 unless GSC/backlink evidence justifies recreation. |
| `/how-to-create-brand-guidelines/` | Hard 404, page title `Page Not Found - KP Infotech`, no redirect configured | Branding guidance is not a current core offer and could dilute operations/software positioning. | No direct destination. Possible future article only if brand systems become part of an approved service narrative. | Keep 404 unless manual approval identifies a strategic content reason. |
| `/b-2-b-lead-generation-strategies/` | Hard 404, page title `Page Not Found - KP Infotech`, no redirect configured | Lead-generation strategy is marketing/sales content, not an approved current service page. | Possible candidates after approval: `/services/business-automation/` for CRM/workflow automation, or `/industries/startups/` for startup operations. | Needs GSC/backlink review and manual target approval before redirecting. |

## Notes

- No redirects were added for these URLs in Batch 1.
- Do not redirect these URLs to the homepage.
- If any are later approved, add them to the Worker redirect map and tests in the same pattern as Batch 1.
