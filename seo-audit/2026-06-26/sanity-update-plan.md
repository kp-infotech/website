# Sanity Update Plan — SEO fields only

**Date:** 2026-06-26 · **Project:** `5rux0mv2` / dataset `production` · **Backup:** [sanity-seo-export.csv](sanity-seo-export.csv) (taken before any write).

## Scope & guardrails
- ✅ Update **only** `seoTitle` and `seoDescription` (and `siteSettings.defaultSeoTitle`/`defaultSeoDescription`).
- ❌ Do **not** change: slugs, publish/unpublish state, body content, references, categories, images.
- ❌ No canonical/noindex fields exist in the schema — nothing to touch there.
- 🔁 **Dry-run first** (default). Apply only after diffs are reviewed and approved.
- 🧾 Every write logs `{_id, field, before, after}`.

## Schema field map (confirmed)
| Type | SEO title field | SEO description field |
|---|---|---|
| `service` | `seoTitle` (string) | `seoDescription` (text) |
| `industry` | `seoTitle` (string, group `seo`) | `seoDescription` (text, group `seo`) |
| `blogPost` | `seoTitle` (string) | `seoDescription` (text) |
| `caseStudy` | `seoTitle` (string) | `seoDescription` (text) |
| `siteSettings` | `defaultSeoTitle` (string) | `defaultSeoDescription` (text) |

> No `metaTitle`/`metaDescription`/`openGraph*`/`canonical`/`noIndex` fields exist. Open Graph + Twitter tags are derived from `seoTitle`/`seoDescription` + hero image in `BaseLayout.astro`, so updating the two fields updates OG/Twitter automatically.

## Documents to update (from metadata-plan.csv)
**Services (5):** no change — already strong.
**Industries (8):** add seoTitle + seoDescription — all currently null.
**Blog posts (~10):** add seoTitle + seoDescription where null (odoo-erp-complete-guide, cloud-deployment-models-diagram, node-js-frameworks, erp-for-retail-stores, inventory-management-best-practices, angular-vs-react, best-web-application-frameworks, best-hr-software-for-startups, minimum-viable-product-examples, mobile-app-monetization-strategies). Optional title polish: erp-implementation-cost.
**Case study (1):** expand thin `virtual-tours-ai-listings` seoDescription.
**siteSettings (1):** replace stale `defaultSeoTitle`/`defaultSeoDescription` with B2B-ops fallback.

## How to run the script
The script lives at **[`sanity-seo-update.mjs`](sanity-seo-update.mjs)** (this folder). It uses the existing `@sanity/client` dependency and `SANITY_API_TOKEN` (Editor token).

```bash
# from repo root, with SANITY_API_TOKEN exported (or in .env.local)
export SANITY_API_TOKEN=...   # Editor token, project 5rux0mv2

# 1) DRY RUN (default) — prints a colorized diff for every field, writes nothing
node seo-audit/2026-06-26/sanity-seo-update.mjs

# 2) Review the diffs. When approved:
node seo-audit/2026-06-26/sanity-seo-update.mjs --apply

# Optional: limit to a subset
node seo-audit/2026-06-26/sanity-seo-update.mjs --only=industry          # dry run, industries only
node seo-audit/2026-06-26/sanity-seo-update.mjs --apply --only=blogPost  # apply, blog posts only
```

The script:
1. Fetches the current published value of each target field.
2. Skips any field that already matches the proposed value (idempotent).
3. In dry-run, prints `BEFORE → AFTER` per field and a summary count.
4. With `--apply`, runs `client.patch(_id).set({...}).commit()` for **only** the changed SEO fields, then logs each write.
5. Never publishes/unpublishes, never edits drafts separately (operates on published IDs), never touches non-SEO fields.

## Rollback
The before-values are in `sanity-seo-export.csv` and printed by the dry-run. To revert, re-run with the original values, or restore from Sanity document history (Studio → document → History).

## Sequencing recommendation
1. Run dry-run → attach output to the approval thread.
2. Apply **industries + siteSettings** first (highest-impact, lowest-risk; currently null/stale).
3. Apply **blog posts** second.
4. Trigger a Cloudflare rebuild (Sanity webhook or `npm run deploy`) so the new meta is in the static build.
5. Re-crawl in GSC for the updated pages.
