# P0 Sanity Draft Import Runbook

This runbook imports the six reviewed P0 insight drafts from `docs/seo-migration/p0-content-drafts/` into Sanity as draft-only `blogPost` documents.

## Scope

The workflow creates or updates Sanity draft documents only:

- `drafts.blogPost.what-is-custom-software`
- `drafts.blogPost.business-process-automation-tools`
- `drafts.blogPost.business-process-improvement-methods`
- `drafts.blogPost.how-to-choose-erp-system`
- `drafts.blogPost.on-premise-vs-cloud-erp`
- `drafts.blogPost.devops-best-practices`

It does not publish documents, update existing published documents, change legacy redirects, update sitemap output, change schema, change canonicals, change robots/noindex behavior, or change live page copy.

## Required Environment Variables

For dry-run:

```bash
PUBLIC_SANITY_PROJECT_ID=5rux0mv2
PUBLIC_SANITY_DATASET=production
```

Optional for dry-run:

```bash
SANITY_READ_TOKEN=<token that can read drafts>
```

Without `SANITY_READ_TOKEN` or `SANITY_WRITE_TOKEN`, dry-run still checks published posts, categories, and internal references, but cannot see existing drafts. The apply path always checks drafts because it requires `SANITY_WRITE_TOKEN`.

For apply:

```bash
PUBLIC_SANITY_PROJECT_ID=5rux0mv2
PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=<token with write access to the production dataset>
```

The script refuses any target except project `5rux0mv2` and dataset `production`.

## Dry Run

Dry-run is the default:

```bash
node scripts/sanity/import-p0-insight-drafts.mjs
```

Equivalent explicit command:

```bash
node scripts/sanity/import-p0-insight-drafts.mjs --dry-run
```

Review every article in the output. The script prints the source draft, intended draft ID, category slug, internal reference count, content block count, SEO fields, action, and any blocking reasons.

The batch pins each article to an exact existing category document ID, not only a category slug. This prevents duplicate category slugs in Sanity from causing nondeterministic category references.

Current category IDs:

- `custom-software-development` -> `blogCategory-custom-software-development`
- `automation-ai` -> `blogCategory-automation-ai`
- `erp-business-systems` -> `blogCategory-erp-business-systems`
- `cloud-devops` -> `0213cb0f-23cd-4489-9712-7107bd7a829e`

## Apply

After reviewing dry-run output:

```bash
node scripts/sanity/import-p0-insight-drafts.mjs --apply
```

Default apply behavior blocks if a draft with the same slug already exists. To intentionally update existing drafts:

```bash
node scripts/sanity/import-p0-insight-drafts.mjs --apply --update-existing-drafts
```

The script still refuses to modify any published document. Published slug collisions block the run.

## Preview Verification

After apply, review the drafts in Sanity Studio:

```bash
npm run sanity:dev
```

Open the Studio and inspect each draft `blogPost`:

- title, slug, excerpt, category, tags, read time
- SEO title and SEO description
- body structure, including FAQ headings and answers
- internal links to service pages and existing published insights
- absence of future-only links to unpublished P0 articles

Useful Vision query:

```groq
*[_id in [
  "drafts.blogPost.what-is-custom-software",
  "drafts.blogPost.business-process-automation-tools",
  "drafts.blogPost.business-process-improvement-methods",
  "drafts.blogPost.how-to-choose-erp-system",
  "drafts.blogPost.on-premise-vs-cloud-erp",
  "drafts.blogPost.devops-best-practices"
]]{
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  seoDescription,
  excerpt,
  "category": category->slug.current,
  readTime,
  "contentBlocks": count(content)
}
```

Publishing is a separate manual step after content review. Do not use this workflow as a publishing path.

## Delete Or Revert Drafts

If these are new draft-only documents, delete them from Sanity Studio or run a reviewed delete transaction against the six `drafts.blogPost.*` IDs.

If `--update-existing-drafts` was used, revert through Sanity Studio document history or restore the prior draft fields from a saved dry-run/apply review. Published documents remain untouched by this workflow.

Do not revert by changing redirects, canonicals, robots/noindex behavior, schema, or existing live page content.

## Publishing And Future Redirects

Publishing must happen manually and separately after content review. Legacy URL redirect evolution also happens later, after the new insights are published and verified live. Update the original Worker redirect sources directly at that time; do not create chained redirects through the current service targets.
