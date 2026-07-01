# P0 Insight Production Verification

Verification timestamp: `2026-06-30T09:56:55.839Z`

Production origin: `https://kpinfo.tech`

## Summary

Result: `FAIL`

All six expected P0 insight URLs returned the production 404 page, not the intended article pages. Because the article routes did not return 200, canonical URLs, title tags, meta descriptions, article Open Graph/Twitter metadata, visible FAQ content, and article-body service pillar links could not pass verification.

No redirect evolution was implemented in this task. The existing Batch 1 legacy redirects still point to the approved service/industry targets and the existing redirect checks pass.

## Repository State

- Synced with latest `origin/main` by running `git fetch origin` and rebasing the two existing local documentation commits onto `origin/main`.
- After sync, the branch was no longer behind `origin/main`; it remained ahead by two pre-existing local documentation commits.
- Tracked working tree before writing this verification was clean: `git diff --name-only` returned no files.
- Full working tree was not clean because these pre-existing untracked P0 import workflow artifacts were present before this verification:
  - `docs/seo-migration/p0-sanity-draft-import-runbook.md`
  - `scripts/sanity/import-p0-insight-drafts.mjs`
  - `scripts/sanity/p0-insight-draft-import.json`
  - `tests/p0-insight-draft-import.test.mjs`
- These four artifacts are part of the already-applied draft-import workflow and migration safety record. They should be tracked with the follow-up public-routing fix rather than left as undocumented local files.

## Production Page Results

| URL | Status | Canonical | Title | Meta description | Indexability | OG/Twitter | FAQ | Internal links | Sitemap | Result |
|---|---:|---|---|---|---|---|---|---|---|---|
| `https://kpinfo.tech/insights/what-is-custom-software/` | 404 | `https://kpinfo.tech/404/` | `Page Not Found — KP Infotech` | `The page you're looking for doesn't exist or has been moved. Let's get you back on track.` | Not indexable because status is 404 | Metadata present for 404 page, not article | Missing | Article body not rendered; service link not verifiable | Not present | FAIL |
| `https://kpinfo.tech/insights/business-process-automation-tools/` | 404 | `https://kpinfo.tech/404/` | `Page Not Found — KP Infotech` | `The page you're looking for doesn't exist or has been moved. Let's get you back on track.` | Not indexable because status is 404 | Metadata present for 404 page, not article | Missing | Article body not rendered; service link not verifiable | Not present | FAIL |
| `https://kpinfo.tech/insights/business-process-improvement-methods/` | 404 | `https://kpinfo.tech/404/` | `Page Not Found — KP Infotech` | `The page you're looking for doesn't exist or has been moved. Let's get you back on track.` | Not indexable because status is 404 | Metadata present for 404 page, not article | Missing | Article body not rendered; service link not verifiable | Not present | FAIL |
| `https://kpinfo.tech/insights/how-to-choose-erp-system/` | 404 | `https://kpinfo.tech/404/` | `Page Not Found — KP Infotech` | `The page you're looking for doesn't exist or has been moved. Let's get you back on track.` | Not indexable because status is 404 | Metadata present for 404 page, not article | Missing | Article body not rendered; service link not verifiable | Not present | FAIL |
| `https://kpinfo.tech/insights/on-premise-vs-cloud-erp/` | 404 | `https://kpinfo.tech/404/` | `Page Not Found — KP Infotech` | `The page you're looking for doesn't exist or has been moved. Let's get you back on track.` | Not indexable because status is 404 | Metadata present for 404 page, not article | Missing | Article body not rendered; service link not verifiable | Not present | FAIL |
| `https://kpinfo.tech/insights/devops-best-practices/` | 404 | `https://kpinfo.tech/404/` | `Page Not Found — KP Infotech` | `The page you're looking for doesn't exist or has been moved. Let's get you back on track.` | Not indexable because status is 404 | Metadata present for 404 page, not article | Missing | Article body not rendered; service link not verifiable | Not present | FAIL |

No-slash variants were also checked and returned 404 with no redirect:

- `/insights/what-is-custom-software`
- `/insights/business-process-automation-tools`
- `/insights/business-process-improvement-methods`
- `/insights/how-to-choose-erp-system`
- `/insights/on-premise-vs-cloud-erp`
- `/insights/devops-best-practices`

## Sitemap Results

Live sitemap endpoints checked:

- `https://kpinfo.tech/robots.txt`: 200, points to `https://kpinfo.tech/sitemap-index.xml`
- `https://kpinfo.tech/sitemap-index.xml`: 200, points to `https://kpinfo.tech/sitemap-0.xml`
- `https://kpinfo.tech/sitemap-0.xml`: 200, 50 URLs fetched
- `https://kpinfo.tech/sitemap.xml`: 404

The six expected P0 insight URLs were not present in the live sitemap. A fresh local build also generated `dist/client/sitemap-index.xml` -> `https://kpinfo.tech/sitemap-0.xml`, and `dist/client/sitemap-0.xml` did not contain any of the six P0 slugs.

## Build Observation

`npm run build` passed, but the prerender list did not include the six P0 insight routes and no corresponding files were generated under `dist/client/insights/`.

The insight route uses `publicBlogSlugsQuery`, which applies `PUBLIC_BLOG_GROQ_FILTER`: a post must either have a slug in `PUBLIC_BLOG_SLUGS` or have `publishedAt >= 2025-12-25T00:00:00Z`. The six P0 slugs are not currently in the explicit `PUBLIC_BLOG_SLUGS` list, and the fresh build did not prerender them from Sanity. This indicates the published Sanity documents are not satisfying the current public blog filter in the production dataset.

The original verification task did not change the public blog filter, routes, sitemap configuration, robots/noindex logic, canonical logic, schema, redirects, or page copy.

## Follow-Up Root Cause And Planned Fix

Follow-up read-only Sanity inspection on `2026-06-30` found:

- An unauthenticated `published` perspective query against project `5rux0mv2` / dataset `production` returned known published blog posts, but returned no documents for the six P0 slugs.
- A token-authenticated read-only `published` perspective query returned all six P0 `blogPost` documents with the expected slugs and category slugs.
- All six returned documents had `publishedAt: null`, so they do not satisfy the `publishedAt >= 2025-12-25T00:00:00Z` branch.
- The returned document IDs use the `blogPost.<slug>` pattern. Those dot-containing IDs require authenticated Sanity reads, so the existing unauthenticated build client could not see them.

Planned repo-side fix for the next deployment:

- Add the six P0 slugs to `PUBLIC_BLOG_SLUGS` so the public blog policy does not depend on changing Sanity dates.
- Let the server/build Sanity client use the existing non-public `SANITY_API_TOKEN` with `perspective: 'published'`, so the build can read the already-published dot-ID documents without including drafts.
- Keep legacy redirects, canonical logic, robots/noindex behavior, schema generation, route structure, and page copy unchanged.

Production should remain marked `FAIL` until the fix is deployed and the six live URLs plus the live sitemap are rechecked.

## Redirect Status

No legacy redirect was changed to point at the new P0 insight URLs.

Existing Batch 1 targets remain:

| Legacy source | Current target |
|---|---|
| `/what-is-customised-software/` | `/services/custom-software-development/` |
| `/business-process-automation-tools/` | `/services/business-automation/` |
| `/business-process-improvement-methods/` | `/services/business-automation/` |
| `/how-to-choose-erp-system/` | `/services/erp-software/` |
| `/on-premise-vs-cloud-erp/` | `/services/erp-software/` |
| `/best-practices-for-devops/` | `/services/cloud-devops/` |

`npm run seo:verify-redirects` passed and confirmed Batch 1 redirects, existing protected redirects, manual-review non-redirects, and no target redirect chains.

## Verification Commands

```bash
git fetch origin
git rebase origin/main
git status --short --branch
git diff --name-only
npm run build
npm run seo:verify-redirects
node --test tests/migration-redirects.test.mjs
node --test tests/seo-metadata-batch.test.mjs
node --test tests/p0-insight-draft-import.test.mjs
```

Results:

- `npm run build`: PASS. Sitemap generated, but six P0 insight routes were not prerendered.
- `npm run seo:verify-redirects`: PASS.
- `node --test tests/migration-redirects.test.mjs`: PASS, 9 tests.
- `node --test tests/seo-metadata-batch.test.mjs`: PASS, 7 tests.
- `node --test tests/p0-insight-draft-import.test.mjs`: PASS, 11 tests. This test file is currently an untracked workspace artifact, but it directly confirms the P0 import batch did not mutate legacy redirect targets.

## Follow-Up Local Verification

After the repo-side public-routing fix, local verification on `2026-06-30` showed:

- `git diff --check`: PASS.
- `node --test tests/p0-insight-draft-import.test.mjs`: PASS, 15 tests after a fresh build.
- `node --test tests/seo-metadata-batch.test.mjs`: PASS, 7 tests.
- `node --test tests/migration-redirects.test.mjs`: PASS, 9 tests.
- `npm run seo:verify-redirects`: PASS. Batch 1 redirects, existing protected redirects, manual-review non-redirects, and target-chain checks remained unchanged.
- `npm run build`: PASS. The local prerender output included the six expected `/insights/` pages.
- `dist/client/sitemap-0.xml`: PASS. The local generated sitemap included all six expected P0 insight URLs.

This is local build evidence only. Production remains `FAIL` until this fix is deployed and the live URLs plus live sitemap are rechecked.

## Files Added By Original Verification Task

- `docs/seo-migration/p0-insight-production-verification.md`
- `docs/seo-migration/p0-insight-production-verification.csv`
