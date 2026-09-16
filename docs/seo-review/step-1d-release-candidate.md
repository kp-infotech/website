# Step 1D — Deployment-safe release candidate

## Status: PASS WITH AUTH BLOCKER

Prepared 16 September 2026. Approved Step 1A/1C changes are isolated in `/private/tmp/kp-step1-release-candidate`, branch `codex/seo-step-1-release-candidate`, based on `9c3f1aa76806c4d3322f35ae91c66b1ef7a8dc1c`. Nothing deployed. The only failing test is the existing P0 blog sitemap check, pending authenticated Sanity access.

## Isolation and exact included scope

A separate Git worktree was created from the committed baseline. Only the files below were copied or constructed there. Dependencies were copied into that worktree and the build/test/preview commands ran there, not in the original mixed workspace. No destructive reset or checkout was used on the original worktree.

The original working tree was recorded before isolation: 304 tracked/untracked non-ignored files were hashed, together with HEAD and porcelain status. Verification confirmed identical hashes, status and HEAD after candidate preparation. Its pending changes, including the unapproved 410 and article edits, remain intact. Adding the candidate necessarily adds Git branch/worktree metadata; it does not change the original branch or files.

Exact candidate change list:

| File | Approved purpose |
|---|---|
| `public/_redirects` | Six Step 1A destinations aligned with working Worker routes; case-study wildcard replaced with exact retained migrations. |
| `src/worker/migration-redirects.js` | Remove exactly 21 unsupported case-study entries; preserve 96 retained Worker migrations. Constructed from committed source, not copied from the mixed file. |
| `src/lib/public-case-study-policy.js` | Keep the five approved project slugs; exclude drafts, releases and private dot-ID documents. |
| `src/lib/queries.ts` | Apply the active case-study policy to routes, hub, homepage/featured, next-project and service/industry related work. |
| `tests/fixtures/legacy-redirects.json` | Frozen Step 1A historical mapping inventory; removal exceptions are recorded separately. |
| `tests/fixtures/step-1c-case-study-decisions.json` | Exact approved five-project scope and 21 authorized removals. |
| `tests/legacy-redirect-protection.test.mjs` | Preserve retained migrations and queries; check authorized removals, static parity and sample-marketing normal 404 semantics. |
| `tests/public-case-study-policy.test.mjs` | Evaluate actual GROQ queries against reviewed, unknown, draft, release and private-ID records. |
| `tests/step-1c-case-study-artifacts.test.mjs` | Verify generated sitemap, hub and rendered work links. |
| `scripts/seo/audit-step1c.mjs` | Read-only generated/HTTP validation, including sample-marketing and normal branded 404 responses. |
| `docs/seo-migration/redirect-implementation-batch-1.md` | Correct the claim that static `_redirects` is inactive under Workers. |
| `docs/seo-review/step-1d-release-candidate.md` | This release scope, decision record, publication workflow and verification report. |

The existing slug-policy mechanism was retained. One narrow safety check was added for Step 1D: `_id in path("*")` excludes private dot-ID case-study records even if they reuse an approved slug. The other published/draft/release and slug guards remain. No routes or card layouts were redesigned.

## Unapproved changes excluded

**`/sample-digital-marketing-strategy/`: SEO DECISION PENDING.** Current approved behavior is normal 404; no content, redirect or retirement decision was made.

Exclusion was implemented by keeping `src/worker.js` and `wrangler.toml` byte-identical to the committed baseline, and constructing `src/worker/migration-redirects.js` from that baseline with only the 21 approved removals. Thus the candidate contains none of the pending `GONE_STATUS`, `RETIRED_GONE_PATHS`, `isRetiredGoneUrl`, Worker 410-response branch, or sample-marketing Worker-first patterns. The generated Wrangler configuration also has no sample-marketing override.

The candidate's migration tests use the unchanged committed `tests/migration-redirects.test.mjs`, not the mixed version with a test claiming the pending 410 should be preserved. Candidate release tests independently assert the unresolved path returns normal 404, has no Location header and never receives 410.

Also excluded:

- Uncommitted H1/content-rendering edits in `src/components/sections/BlogPostContent.astro`.
- Uncommitted article/internal-link edits in `src/pages/insights/[slug].astro`.
- Earlier untracked review folders, raw CMS snapshots and historical HTTP audit script/output not needed for this candidate.
- All original pending Worker-wrapper and Wrangler hunks.

The Sanity client, public blog policy, original P0 tests and all six blog migration behaviors remain unchanged from the committed baseline. No metadata, H1, company positioning, blog restoration, new commercial redirect, CMS write or Step 2 change is included.

## Five active case studies

Exactly these detail pages remain active. Each returned 200 in the candidate HTTP audit, has one self-canonical at the apex production URL, has no noindex meta/header directive, appears in the sitemap, and is linked by a real hub card:

| Approved page | Candidate status | Canonical / indexability | Sitemap |
|---|---:|---|---|
| `/work/cloud-cost-optimization-industrial-sme/` | 200 | Self-canonical / indexable HTML | Included |
| `/work/collaboration-platform-distributed-teams/` | 200 | Self-canonical / indexable HTML | Included |
| `/work/digital-banking-platform/` | 200 | Self-canonical / indexable HTML | Included |
| `/work/omnichannel-ecommerce-platform/` | 200 | Self-canonical / indexable HTML | Included |
| `/work/virtual-tours-ai-listings/` | 200 | Self-canonical / indexable HTML | Included |

`/work/` also returned 200 and contains exactly five cards, with no placeholder project or missing-image placeholder elements. Source components iterate the returned inventory, feature at most four records and conditionally render the next project; no filler was introduced. Production-host canonicals are intentionally retained in local preview HTML. No changes were made to the nonproduction hostname indexing safeguards.

## 21 unsupported legacy projects

All 21 sources listed in `tests/fixtures/step-1c-case-study-decisions.json` have no reliable genuine historical publication/project evidence in the repository/history/CMS inventory examined in Step 1B. The user's Step 1C correction explicitly authorized removing those unsupported mappings. This decision does not claim a complete historical backlink archive was available.

All 21 `/casestudy/<slug>` and `/casestudy/<slug>/` sources returned the normal branded site 404 with no Location header; their 21 missing `/work/<slug>/` destinations also returned normal 404. No 410, hub fallback or speculative restoration was added. The broad static case-study wildcard is absent, so it cannot silently recreate 301 → 404 behavior.

Retained project migrations, each verified in both source slash forms:

- `/casestudy/collaboration-platform-distributed-teams/` → 301 → `/work/collaboration-platform-distributed-teams/` → 200.
- `/casestudy/digital-banking-platform/` → 301 → `/work/digital-banking-platform/` → 200.
- `/casestudy/omnichannel-ecommerce-platform/` → 301 → `/work/omnichannel-ecommerce-platform/` → 200.
- `/casestudy/virtual-tours-ai-listings/` → 301 → `/work/virtual-tours-ai-listings/` → 200.
- `/casestudy/` hub, and its no-slash form → 301 → `/work/` → 200.

No extra redirect, loop or dead terminal target exists in these retained case-study paths. No new legacy cloud-cost source was invented. All 96 retained Worker migrations are protected by regression tests; the eight still-broken blog variants are preserved rather than treated as unsupported projects. Earlier committed root-to-service mappings were not changed, and no new commercial-page fallback was introduced.

## Sitemap and internal links

Fresh generated sitemap index: `https://kpinfo.tech/sitemap-index.xml`; one child: `https://kpinfo.tech/sitemap-0.xml`. Total **50 page URLs**, including the five approved detail pages and `/work/`.

Every sitemap page returned 200 from the candidate Worker, had the correct apex self-canonical and no noindex meta/header directive. Both sitemap XML files returned 200 and matched the generated contents. All URLs have built HTML files. Generated robots.txt allows crawling and names the current index.

The 21 unsupported project destinations, legacy redirect sources, 404/410 paths, draft/release/unapproved project routes and currently inaccessible six blog destinations are absent. No legitimate published page was removed. The sitemap remains truthful about the currently generated pages; it does not invent entries for inaccessible CMS documents.

**Zero dead internal case-study links** across all 51 generated HTML files and the 50 candidate sitemap page responses. No legacy `/casestudy/` internal links were rendered. The five-card hub and related-project policy checks passed.

## Publication workflow for a future genuine case study

1. Supply the authentic project record and support for client/project facts and claimed outcomes.
2. Obtain explicit publication approval.
3. Publish the reviewed Sanity case-study document with a public root ID; drafts, release variants and private dot-ID records do not qualify.
4. Approve its canonical slug and update `PUBLIC_CASE_STUDY_SLUGS` deliberately. A redirect entry never authorizes a project page.
5. Update the reviewed scope fixture to record that approved addition; do not regenerate historical fixtures merely to bypass failures.
6. Build and verify route 200, canonical/indexability, hub/related links and content.
7. Verify the sitemap contains only the approved final page, then review the release before deployment.

No future project was added in Step 1D.

## Verification — clean candidate only

- `git diff --check`: PASS.
- Fresh production-style `npm run build`: PASS, **22.75 seconds**. Public Sanity project/dataset and existing public analytics IDs were supplied in the process environment; no Sanity secret was available.
- Redirect regression tests: **16/16 PASS**. The count is one lower than Step 1C because the mixed-tree test asserting 410 behavior was excluded; the new release test asserts normal 404 instead.
- Case-study GROQ policy tests: **4/4 PASS**, including private IDs with approved slugs.
- Artifact/sitemap test: **1/1 PASS**.
- Combined scoped run: **21/21 PASS**.
- `npm run seo:verify-redirects`: PASS for its existing selected targets.
- Full suite: **44/45 PASS, one failure, no skipped tests**. The only failure is `built sitemap includes all P0 insight URLs when build output exists`, first reporting missing `what-is-custom-software`. The P0 test file is byte-identical to the baseline; it was not weakened or suppressed. Step 1B already reproduced the failure before Step 1 changes. All six intended articles remain inaccessible to the unauthenticated build.
- Local Worker audit: **129 responses, zero audit errors**: 52 HTTP 200 responses (50 pages plus two sitemap XML files), 10 HTTP 301 responses (four retained project migrations and hub, each in both forms), 67 normal HTML 404 responses (42 removed source variants, 21 missing destinations, three sample-marketing variants, one unknown-project probe).
- Sample-marketing GET responses: no-slash, slash and query variants all **404**, no Location header, branded site 404 body. Unit checks also cover GET and HEAD. No pending 410 can enter through the candidate's baseline Worker wrapper or configuration.
- Original workspace preservation: **304 file hashes unchanged; Git status and HEAD unchanged**.

Evidence is stored separately at `/private/tmp/kp-step1d-verification/`: build/test logs, artifact and HTTP audit JSON, source exclusion comparison, and original-worktree preservation results. Generated assets and dependencies are ignored build inputs/output, not committed release changes. The candidate audit is reproducible using `node scripts/seo/audit-step1c.mjs --origin=http://127.0.0.1:8789 --output=/tmp/step1d-http.json` after starting its local Worker.

## Sanity authentication readiness

Required variable: **`SANITY_API_TOKEN`**, containing a project-scoped token with sufficient read access to the production dataset. It must remain private; never use a `PUBLIC_` name, hardcode it, paste it into reports or log it.

The existing `src/lib/sanity.ts` consumes `import.meta.env.SANITY_API_TOKEN` only in the server build path and uses `perspective: 'published'`. With a token it disables the CDN read path. The six slugs are already in the public blog allowlist; another route/date/category change is not needed. The source client and public blog policy were not modified in this candidate. Existing code is ready to consume a build-time token; successful authenticated content retrieval cannot be verified without access.

The repo uses Cloudflare **Workers**, with the adapter-generated Wrangler output. The older README's Pages label is stale. There is no checked-in `.github` workflow. No token is supplied by committed `wrangler.toml`; its public `[vars]` values do not provide a secret to the Astro build. The current dashboard build settings and secret presence could not be inspected, so this report does not claim the production dashboard lacks a secret.

**Owner/admin action:** in Cloudflare, open **Workers & Pages → website → Settings → Build → Build variables and secrets**, and add `SANITY_API_TOKEN` as a **Secret** available to the production `npm run build` process. Configure the corresponding trusted build environment separately where needed. Setting only a runtime secret under Settings → Variables and Secrets is not sufficient for static prerendering. Cloudflare documents build variables/secrets as distinct from runtime settings. [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)

If a suitable read token does not exist, the Sanity project owner can create one for project `5rux0mv2` under **Settings → API → Tokens**, using Viewer/read access, then store it directly in the build-secret setting. No token was created or exposed in this task. [Sanity authentication and tokens](https://www.sanity.io/docs/content-lake/http-auth)

For Codex/local verification, the owner must separately supply the same private variable through the local process environment or ignored `.env.local` in the release worktree. Cloudflare build secrets are not automatically inherited by Codex. Codex currently has neither this environment token nor an authenticated Sanity CLI session. If an external CI system is introduced, its encrypted secret must be explicitly mapped to `SANITY_API_TOKEN` for the build step; no such workflow was added here.

After access is supplied, first re-read the six exact published documents and confirm their current content, then rebuild and rerun the unchanged P0 test and route/indexability checks. Do not switch to draft perspective, create duplicates or replace informational intent with commercial service pages. Configuring a token alone is not evidence that current CMS content was verified or restored.

## Deployment and review

Nothing deployed. No push, production mutation or Step 2 work occurred. Use only the isolated candidate for any later reviewed release; do not deploy the original mixed working tree. This task prepares the candidate and does not authorize deployment.

Step 1 deployment candidate prepared. Six historical blog routes remain blocked only by authenticated Sanity access. Awaiting SEO review before deployment or Step 2.
