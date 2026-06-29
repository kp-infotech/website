# Sanity Metadata Batch 1 Apply Log

## Timestamp

- Local: 29/06/2026, 09:54:51 GMT+5:30
- UTC: 2026-06-29T04:24:51.419Z

## Scope

Batch file: `scripts/sanity/seo-metadata-batch-1.json`

Inventory source: `docs/seo-migration/metadata-inventory.md`

Target: Sanity project `5rux0mv2`, dataset `production`

No slugs, canonicals, redirects, robots/noindex behavior, schema, or page content were changed.

## Branch And Files

- Branch: `main`
- Workflow files present in the working tree:
  - `scripts/sanity/update-seo-metadata.mjs`
  - `scripts/sanity/seo-metadata-batch-1.json`
  - `docs/seo-migration/sanity-metadata-update-runbook.md`
  - `tests/seo-metadata-batch.test.mjs`
- Working tree note: these SEO migration files are present but not yet committed; `src/layouts/BaseLayout.astro` also has the repo fallback metadata change.

## Commands Run

```bash
git branch --show-current
git status --short
rg --files scripts/sanity docs/seo-migration tests
node --test tests\seo-metadata-batch.test.mjs
node scripts/sanity/update-seo-metadata.mjs --dry-run
node scripts/sanity/update-seo-metadata.mjs --apply
node scripts/sanity/update-seo-metadata.mjs --dry-run
npm run build
node --test tests\seo-metadata-batch.test.mjs
node scripts/sanity/update-seo-metadata.mjs --dry-run
node scripts/sanity/update-seo-metadata.mjs --apply
node scripts/sanity/update-seo-metadata.mjs --dry-run
npm run build
npm run build
```

Additional one-off Node inspections were used to compare published vs draft Sanity documents and extract generated metadata from `dist/client`.

## Test Result

Initial batch test result:

```text
tests 6
pass 6
fail 0
```

During verification, the script was updated to force `perspective: 'published'` so draft documents cannot satisfy a batch guard while the built site still reads the published document. A regression test was added for that behavior.

Final batch test result:

```text
tests 7
pass 7
fail 0
```

## Dry Run Summary Before Apply

Initial dry-run, before the published-document fix:

```text
changes: 0
unchanged: 35
blocked: 0
missing: 0
Dry run only. No Sanity writes were made.
```

That result was not sufficient for built-site verification because `blogPost/cloud-deployment-models-diagram` had the proposed metadata on a draft document while the published document still had empty SEO fields.

Corrected dry-run after forcing published-document reads:

```text
changes: 2
unchanged: 33
blocked: 0
missing: 0
Dry run only. No Sanity writes were made.
```

The two pending changes were:

- `blogPost/cloud-deployment-models-diagram` `seoTitle`
- `blogPost/cloud-deployment-models-diagram` `seoDescription`

Both current values were empty and matched the inventory guard.

## Apply Summary

Initial apply, before the published-document fix:

```text
changes: 0
unchanged: 35
blocked: 0
missing: 0
No Sanity mutations to apply.
```

Corrected apply after forcing published-document reads:

```text
changes: 2
unchanged: 33
blocked: 0
missing: 0
Applied Sanity transaction with 1 document patch(es).
transactionId: FLWOnYzhRkuT5CLpK93xaS
documentIds: 3011f67f-8bba-43b3-b60d-8896384d64a0
```

## Dry Run Summary After Apply

```text
changes: 0
unchanged: 35
blocked: 0
missing: 0
Dry run only. No Sanity writes were made.
```

## Build Result

`npm run build` passed after the final apply.

The build emitted the existing Sanity Studio chunk-size warning from Vite, but Astro completed successfully and generated `dist/client` plus the sitemap.

Sanity CDN propagation note: the first post-apply rebuild still rendered stale metadata for `/insights/cloud-deployment-models-diagram/`. A direct CDN check then returned the updated published fields, and a second rebuild produced the expected generated HTML.

## Verification Notes

Generated HTML metadata was extracted from `dist/client`.

Passed generated metadata checks:

- All 8 industry pages rendered the Batch 1 `seoTitle` and `seoDescription`.
- All 8 P1 blog posts rendered the Batch 1 `seoTitle` and `seoDescription`.
- `/work/virtual-tours-ai-listings/` rendered the Batch 1 `seoDescription`; its title was observed only because Batch 1 did not change the case-study title.

Verification summary:

```text
Checked generated content pages: 17
Content page failures: 0
```

Site defaults:

- `siteSettings.defaultSeoTitle` and `siteSettings.defaultSeoDescription` were verified by the final Sanity dry-run.
- The generated homepage does not render those defaults because `src/pages/index.astro` passes explicit page-level title and description into `BaseLayout`.
- Observed generated homepage title: `Custom Software, ERP, Automation & AI Solutions | KP Infotech`
- Observed generated homepage description: `KP Infotech helps growing B2B teams replace spreadsheets, manual workflows, and disconnected tools with custom software, Odoo ERP, business automation, AI agents, and cloud infrastructure built around how their operations actually work.`
