# Step 11B — Exact-Intent Historical Link Equity Reclamation

## Step 11B Status

Pre-release validation PASS; deployment and production verification pending below. Exactly three historical root targets changed. No Step 11C work.

## Baseline

Fresh production checks before editing confirmed all three roots returned a single 301 to the expected broad service, then 200 with a self-canonical and no noindex. Slash and no-slash variants were checked. The baseline contained 56 canonical, indexable sitemap URLs. Full status, Location, hop, final URL and canonical records: [baseline](step-11b-evidence/baseline.json).

The original checkout was stale and contained unrelated uncommitted work. Release work used an isolated clean checkout of current main, `a60f117559e4071370ab7ec6d39ea195ceaeedf7`, preserving that work. A normal fast-forward push to main is used; no force push.

## Redirect Changes

| Historical root | Previous destination | New canonical destination |
|---|---|---|
| `/business-process-improvement-methods/` | `/services/business-automation/` | `https://kpinfo.tech/insights/business-process-improvement-methods/` |
| `/how-to-choose-erp-system/` | `/services/erp-software/` | `https://kpinfo.tech/insights/how-to-choose-erp-system/` |
| `/on-premise-vs-cloud-erp/` | `/services/erp-software/` | `https://kpinfo.tech/insights/on-premise-vs-cloud-erp/` |

The authoritative source is `src/worker/migration-redirects.js` (`EXACT_REDIRECTS`), invoked by `src/worker.js`. Only these three runtime values changed. No second redirect implementation or static rule was added. Fixtures, existing tests and the batch verifier now expect the authorized destinations.

## Why Each Mapping Changed

- Process Improvement: the existing approved Insight serves process diagnosis and improvement education, matching the historical topic more closely than implementation services.
- ERP Selection: the existing Insight serves selection and evaluation intent.
- On-premise vs Cloud ERP: the existing Insight serves deployment-model comparison intent.

No new informational owner was created. ERP Software continues to own Odoo/ERP implementation and commercial provider intent. Business Automation continues to own workflow automation and implementation services. Service and article content, metadata and authors remain unchanged.

## Preserved Redirects

| Excluded source | Preserved destination |
|---|---|
| `/business-process-automation-tools/` | `/services/business-automation/` |
| `/what-is-customised-software/` | `/services/custom-software-development/` |
| `/data-visualization-best-practices/` | `/services/custom-software-development/` |
| `/best-ecommerce-platform-for-small-business/` | `/industries/retail-ecommerce/` |

Each existing `/blogs/` equivalent for the three approved topics remains a direct 301 to its matching Insight. Root and blog variants are tested with GET/HEAD, slash/no-slash and query strings. All other fixture mappings and static rules remain identical to the release base.

## Preserved 404s

These remain 404, with no restoration, redirect or 410:

- `/how-to-choose-the-right-digital-marketing-channels-for-your-business/`
- `/graphics-design/`
- `/how-to-create-brand-guidelines/`
- `/b-2-b-lead-generation-strategies/`

The existing sample marketing URL `/sample-digital-marketing-strategy/` remains 404, including slash/no-slash/query variants. `/sample-marketing/` also remains 404.

## Destination Validation

All three Insights return 200, are indexable and self-canonical, appear in the unchanged 56-URL sitemap, and contain exactly one H1. No legacy canonical or noindex was found. All 72 unique internal links/resources checked across the destinations return 200 without a redirect. Redirect responses contain no canonical HTML or Link header. [Local Worker evidence](step-11b-evidence/local.json).

## Internal Links

All 56 pages contain zero internal links to the three historical roots. The complete baseline/build comparison preserves content, metadata, authors, structured data, headings, images and internal links. No links were added. Historical roots remain excluded from the sitemap; no sitemap dates were artificially changed. [Preservation evidence](step-11b-evidence/preservation-build.json).

## Tests

Authenticated production build PASS; built-in proof checks PASS on 56 pages. Full suite: **135 tests passed, 0 failed, 0 skipped, 0 cancelled**. This includes **12 new focused Step 11B tests**. [Test log](step-11b-evidence/tests.txt), [build log](step-11b-evidence/build.txt).

Initial setup runs exposed missing build output/public variables and an incorrect helper reference in the new test harness. The build now uses the existing production public variables and authenticated read token; the test harness uses the actual Worker API. JSON serialization normalization corrected undefined optional parser fields in the saved-baseline comparison. No existing assertion was relaxed. Final reruns pass.

`git diff --check` PASS. Cloudflare deploy dry-run PASS. Credential scan across 829 build/evidence files found zero credential matches. No secrets are included.

## Regression

Step 1C and local Step 1G PASS (56 pages, 32 redirects, 63 removed-project checks, zero dead/legacy internal links). Steps 2, 3, 4, 7A–7E, 9B, 9C and 10B PASS. An explicit Step 3 error gate also passes. Steps 5/6/8 ownership/content safeguards are preserved by the complete 56-page baseline comparison and full suite. [Regression exits](step-11b-evidence/build-regression-exits.json), [Step 1G](step-11b-evidence/step1g-local.json).

No Sanity mutations occurred. No Insight, service, author, work, site-settings or proof-status records were changed. No Studio deployment is required.

## Deployment

Pending release record.

## Production Verification

Pending fresh post-deployment verification.

## Historical Backlink Evidence

| Historical target | June 2026 backlinks | June 2026 referring domains |
|---|---:|---:|
| Process Improvement | 7 | 6 |
| ERP Selection | 2 | 2 |
| On-premise vs Cloud ERP | 3 | 2 |

These are dated Step 11A observations only. Current referring pages/links have not been revalidated; no fresh source-level export is available and Semrush API units are unavailable. Three historical linked URL targets were remapped to closer current equivalents. This does not establish that 12 backlinks were recovered or that Google has transferred equity. Crawl, ranking and equity effects require later observation.

## Outreach

None performed. No messages, outreach drafts, directory/forum submissions, profile changes, link-update requests, Search Console submissions or removal requests. Printcubator was not contacted or turned into proof, a case study, testimonial, logo or metric.

## Remaining Step 11 Queue

- Printcubator: **P0/P1 MANUAL RECLAMATION LEAD**, carried forward for separately authorized outreach.
- Obtain a fresh source-level backlink export and revalidate referring pages.
- Consider asset strengthening after evidence review.
- Consider ecosystem contribution after separate authorization.

None of these queue items was implemented. Step 11C has not begun.
