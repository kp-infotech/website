# P0 Content Drafts

Review-only drafts for recreating high-value legacy informational URLs as future `/insights/` articles.

These files do not create Sanity documents, publish posts, change redirects, update sitemap output, modify schema, or change production page behavior. They are drafting artifacts for content review before any Sanity or redirect implementation work.

## Drafts

| Legacy URL | Proposed insight URL | Current redirect target | Target pillar |
|---|---|---|---|
| `/what-is-customised-software/` | `/insights/what-is-custom-software/` | `/services/custom-software-development/` | Custom Software Development |
| `/business-process-automation-tools/` | `/insights/business-process-automation-tools/` | `/services/business-automation/` | Business Automation |
| `/business-process-improvement-methods/` | `/insights/business-process-improvement-methods/` | `/services/business-automation/` | Business Automation |
| `/how-to-choose-erp-system/` | `/insights/how-to-choose-erp-system/` | `/services/erp-software/` | ERP & Odoo Solutions |
| `/on-premise-vs-cloud-erp/` | `/insights/on-premise-vs-cloud-erp/` | `/services/erp-software/` | ERP & Odoo Solutions / Cloud & DevOps |
| `/best-practices-for-devops/` | `/insights/devops-best-practices/` | `/services/cloud-devops/` | Cloud & DevOps |

## Review Notes

- Treat every draft as unpublished Sanity `blogPost` content.
- FAQ sections are candidates for FAQ schema only if the questions and answers are displayed on the published page.
- Related P0 links marked `future after publish` should not be added to a live Sanity body until the linked article exists.
- Future redirect changes should update the original Worker redirect source directly. Do not create source -> service -> insight chains.
