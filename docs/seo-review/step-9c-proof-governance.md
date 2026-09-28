# Step 9C — Public proof governance

Status: **PASS WITH WARNINGS** — governance implemented, deployed and verified. Remaining warnings are the existing business-proof backlog and the need for honest authorized review; no release check is failing. Step 10 is out of scope.

## Current Public Proof State

Five Technical Overviews remain live. Their Step 9B wording, URLs, relationships, images and metadata are preserved. No new evidence, outcome, named client, testimonial, metric, year, certification, award or funding claim is introduced. A technical overview is not independently substantiated client proof.

## Governance Model

| Status field | Allowed values | Current five |
|---|---|---|
| `publicProofType` | `technicalOverview`, `verifiedCaseStudy` | `technicalOverview` |
| `evidenceStatus` | `pending`, `partiallyVerified`, `verified` | `pending` |
| `publicationPermission` | `unknown`, `approved`, `restricted` | `unknown` |

Additional status-only markers: each result's `reviewStatus` (`pending` / `approved`), `resultsSummaryReviewed`, `projectDateReviewed` and `testimonialReviewed` (explicit boolean true required). These markers contain no evidence or private references. False/missing markers do not authorize public proof. No extra marketing category was created.

The obsolete `presentationType` is no longer an editor option or publication authority. Its existing stored value remains untouched as historical data. There is no automatic migration from its `caseStudy` value to verified publication. Missing/unknown new statuses fail build review, while rendering defaults to withholding proof.

## Publication Gate

`verifiedCaseStudy` is permitted only when `evidenceStatus === 'verified' && publicationPermission === 'approved'`. Studio document validation and the mandatory Astro build-start hook use the same policy. Invalid combinations, missing/unknown status values, and a failed CMS status fetch stop the production build. No credentials or raw CMS errors are logged.

The build-end hook audits every public sitemap page against the Step 9B proof protections, including old claims in metadata/schema and hidden homepage proof. Calling `astro build` directly still invokes both hooks. A failed build must not be deployed. An existing deployment is not retroactively removed by build failure: if permission is revoked, remove/qualify the affected public copy, set safe states and ship an urgent successful remediation release.

Status flags are a review workflow, not cryptographic proof or role-based access control. An authorized editor can misstate statuses; owner review, private evidence and deployment controls remain necessary. This step does not configure Sanity roles or choose a private storage provider.

## Results Gate

A Technical Overview always returns and renders an empty results array and no results summary, regardless of historical values or review markers. Historical hidden fields do not block overview publication. For a valid verified case study, every populated result must have a non-empty metric/label and `reviewStatus = approved`; otherwise Studio/build validation fails. Results summary requires its own explicit review marker. GROQ strips unapproved entries and the renderer repeats the approval check.

Before approving a result, its private dossier must record metric name, exact definition, baseline, comparison period, numerator/denominator where applicable, source, calculation, attribution limits, reviewer and publication permission. No evidence record is fabricated here.

## Client Identity Gate

All work queries use a shared guarded projection. Technical Overviews emit only the five Step 9B-approved anonymous descriptors held in the policy. An arbitrary edit to `client` cannot leak a new name through the homepage, work hub, service/industry cards, next-project card or detail page. An unknown overview slug receives no descriptor until an approved anonymous context is added through policy review. Historical client text is not treated as verification.

A named public identity can render only through the valid verified gate. No private identity field is added to Sanity. The detail renderer repeats the gate; a Technical Overview never emits a client Organization node.

## Testimonial Gate

Technical Overviews cannot project or render a testimonial. A verified case study needs both publication approvals and `testimonialReviewed === true`. Review must establish the original attributable source, identity/role, exact wording permission and portrait permission if shown. No current testimonial is restored. Homepage testimonials remain disabled regardless of CMS data.

## Date Gate

Technical Overviews do not project or render `year`, including on cards. A verified case study requires the publication gate and `projectDateReviewed === true`. A year without this separate review fails validation. `_createdAt`, `_updatedAt` and website publication dates are never completion evidence. CreativeWork retains only CMS `dateModified` as an editorial timestamp; it does not introduce project completion schema.

## Certification / Compliance Gate

Every future assertion requires private review of the exact legal entity, certification/relationship, scope, issuer/provider, status/date and publication evidence. This includes SOC 2, PCI DSS, ISO, HIPAA and Odoo/AWS/Azure/Google Cloud partner assertions. A general verified flag is not independent substantiation of every sentence.

Technical-overview public copy is scanned for precise financial/percentage claims, performance/timeline guarantees, certification/compliance assurances, award/funding assertions and proof-backed marketing labels. Hidden historic fields are excluded. Ordinary requirements discussion such as “SOC 2 and PCI DSS requirements need scoped review” is allowed, and educational articles are not scanned by this record-specific rule. Step 9B identity, testimonial, old-image and removed-occurrence checks remain in force. Its inherited certification/award/funding phrase checks are scoped to proof surfaces rather than educational insight articles; a regression test confirms that an educational certification discussion is allowed while the same wording on a service proof surface is rejected.

## Privacy Rule

**Never put contracts, invoices, confidential client identities, security reports, billing/analytics exports, private emails, signed approvals, raw testimonials or credentials in public Sanity or Git.** The governance CMS fields contain STATUS ONLY. Actual proof and completed intake/review dossiers belong in an approved private business repository/storage system outside public site content. No provider is selected/configured in Step 9C.

Public Git may contain opaque reference IDs, statuses, approved public wording and non-confidential methodology descriptions. References must not encode names, secrets, tokens or private access URLs. The [blank intake template](proof-intake-template.md) and [verification checklist](verified-case-study-checklist.md) are safe to commit; complete them privately.

Existing CMS records are not made private by hiding them from the website. Step 9C does not change dataset permissions or claim to remove historical public content from caches/history. Fresh raw snapshots are kept in ignored private local storage; committed manifests contain only revision IDs, source hashes and verification summaries.

## Current Five Records

| Work slug | Public context | Proof type | Evidence | Permission |
|---|---|---|---|---|
| cloud-cost-optimization-industrial-sme | European Industrial Machinery Manufacturer | technicalOverview | pending | unknown |
| collaboration-platform-distributed-teams | SaaS Collaboration Platform | technicalOverview | pending | unknown |
| digital-banking-platform | Regional Credit Union | technicalOverview | pending | unknown |
| omnichannel-ecommerce-platform | Multi-Store Fashion Retailer | technicalOverview | pending | unknown |
| virtual-tours-ai-listings | Real Estate Network | technicalOverview | pending | unknown |

Transaction `IVLcVaE7g6HuAB08OV78Zk` used captured revision guards. Exactly these five records changed, only the three requested statuses plus Sanity system revision/timestamps. All public copy and 358 other records are unchanged. See [CMS verification](step-9c-evidence/cms-verification.json). Before mutation, snapshots captured 363 records, 56 live pages and hashes of 13 relevant source files at baseline commit `aae8d23ec236a59a8f4f5c129df1c4b0fdb31df4`.

## Current Proof Backlog

- ERP: NO VERIFIED PUBLIC ODOO CASE.
- Business Automation: NO VERIFIED BPA CASE.
- AI: NO VERIFIED PRODUCTION ACTION-TAKING AGENT CASE.
- Custom Software: current technical overviews require actual engagement, delivery scope and outcome substantiation before promotion.
- Cloud: current overview needs billing/delivery substantiation before financial claims return.
- Homepage: project/country counts, tenure and satisfaction remain unverified and hidden.
- Testimonials: source, identity, wording and publication/image permission required before rendering.

## Service-specific Proof Requirements

| Pillar | Meaningful private evidence |
|---|---|
| ERP / Odoo | Modules and starting state; configuration/customization; migration and integration; UAT; cutover; training; accepted outcome |
| Business Automation | Trigger, systems, rules, approvals, exceptions, before/after workflow, baseline, measured operational result and operating owner |
| Custom Software | Actual delivery scope, architecture, integrations, UAT, handover and source/methodology for every product/business outcome |
| AI | Actual model task, tools/actions, read/write boundaries, approvals, evaluation, failure handling, deployment status and monitoring |
| Cloud | Infrastructure scope, before/after architecture, billing scope and normalization if savings are claimed, reliability checks, change records and operational acceptance |

Guidance only; no example engagement or evidence is invented.

## Claim-risk Categories

This prioritizes review; it is not a legal opinion.

| Risk | Categories |
|---|---|
| High | Financial outcomes, revenue, cost savings, funding, certification, awards, client identity, testimonials, compliance, satisfaction, market/business growth, adoption, conversion, retention, guaranteed performance |
| Medium | Project dates, user counts, architecture/performance benchmarks, delivery timelines, specific implementation assertions, named third-party integrations |
| Lower | General technical explanations, process descriptions, requirements discussion, architecture principles, non-specific service capability |

## Re-review Triggers

Re-review certifications, partner status and security attestations when the issuer's status/scope/expiry changes, the covered system changes, or permission is withdrawn. Re-review customer/usage/team/company counts when the measurement period, population or counting rule changes; pricing when the offer changes; response commitments when the operating agreement or capacity changes. Use source-defined expiry or an agreed business event, not an invented annual cadence. Record owner and triggers privately. Downgrade uncertain evidence/permission immediately and prepare safe public copy; invalid verified status combinations block a new deployment, not an existing cached page.

## Public Terminology Audit

PASS. The 56-page terminology inventory is in [terminology-audit.json](step-9c-evidence/terminology-audit.json). Current work pages say Technical Overview. Work-hub introduction explains anonymized technical context without verified outcomes. Related headings (Related Software Projects, Cloud Cost Optimization Example, AI Feature Examples) describe relevant subject matter rather than client results. ERP/BPA have no forced proof cards. Neutral mentions of results, delivery responsibilities, negative proof limitations and third-party educational case studies remain unchanged. No public copy rewrite was needed.

## Schema Behavior

CreativeWork remains appropriate for the authored technical material. Technical Overviews cannot emit a client Organization, results, testimonials, delivery year, Review/AggregateRating, award or certification. Generic publisher/creator Organization remains KP Infotech. Future valid verified case studies may emit an approved public client and reviewed visible proof; review/rating/award schema is not automatically generated by any status. No governance values are displayed as public content or JSON-LD properties.

## Editor UX

Studio labels and descriptions explain technical versus verified content, status-only evidence handling and permission requirements. Shared document validation rejects invalid combinations. Per-result and separate date/summary/testimonial review controls default to unapproved. No evidence upload field or private-client field was added. The obsolete presentation field is hidden/read-only for compatibility with historical records and ignored by the site; it cannot bypass the new gate.

## Tests

Authenticated production build: PASS, including mandatory build-start input validation and build-end checks for all 56 pages. Full suite: 107 passed, 0 failed, 0 skipped; 16 focused governance tests cover invalid/missing/revoked states, hidden historical proof, per-item reviews, GROQ card/detail projections, synthetic verified behavior, sensitive copy, Studio rules and output leakage. Studio build: PASS. Schema validation: 0 errors, 0 warnings. Synthetic fixtures only exercise verified behavior; no fake verified record is created in production. Credential scan: zero occurrences in website, Studio and evidence artifacts. `git diff --check`: PASS. The initial build-hook ordering defect was fixed by running output validation after sitemap generation; final builds pass.

## Regression

Steps 1C, 2, 3, 4, 7A–7E, 9B and 9C build validators: PASS. Local Step 1G: 56 sitemap pages, 32 redirects, 63 unsupported-project 404 checks, zero dead/legacy links; restored articles, robots and sample-marketing 404 pass. Step 9B baseline comparison: all 56 pages preserve body, headings, metadata, images/alt and schema except the expected editorial dateModified. No new page, URL, redirect, noindex rule, schema type or service ownership change. Steps 5/6 ownership/classification and Step 8 zero-new-page decision remain untouched.

## Deployment

Application release commits: `e1d42a96d55b9a8c15780bf007e1dafa6be8bd37` (governance) and `f17ead4b58fd35e8bcebc7c6728f71e1c5f0f23f` (educational-context refinement), normally pushed to `origin/main` from the isolated release checkout.

- Cloudflare Worker `website`, production `https://kpinfo.tech`.
- Final manually deployed and verified version: `e11755db-64b1-4e3e-89e7-a3b235cce096` at 100%; deployed `2026-09-28T10:29:29.240Z` (15:59:29 IST).
- Existing Sanity app `nrhngkka32o4vdxu667lovc8`, hostname `https://kpinfotech.sanity.studio/`; schema `_.schemas.kp-infotech` deployed successfully (1/1).
- Studio deployment command completed `2026-09-28T10:23:14.985370Z` (15:53:14 IST). Bundle `sanity-B31IL5JN.js` matches the hosted JavaScript byte-for-byte; its SHA-256 is recorded in `studio-release.json`.
- The Studio hostname intentionally redirects into the existing managed Sanity dashboard. Its asset is HTTP 200 and matches the approved build; this is not a deployment failure.
- Studio used a separate clean checkout/default `dist` directory because this CLI version prompts on a non-empty custom directory even with unattended mode. Its supported authentication environment variable used the existing project token; no new credential or access permission was created.
- Final report/evidence are committed separately. An automatic equivalent Cloudflare deployment may replace a recorded version ID; these records identify the versions actually verified.

## Production Verification

PASS. All 56 live pages match the final validated build (body, headings, title/description, canonical and schema); the build matches Step 9B public content and images/alt apart from the five CMS editorial `dateModified` advances. This does not imply a project completion date.

Production Step 1G: 56 sitemap pages, 32 redirect checks, 63 unsupported-project 404 checks, zero dead/legacy links. Robots, restored articles and sample-marketing 404 pass. Steps 2, 3, 4, 7A–7E, 9B and 9C production checks pass. Homepage/work hub, five services, five work pages and finance/healthcare/startups remain clean. All five cases are 200, indexable, self-canonical and still Technical Overviews; no result strips, unverified years, client Organization, testimonials, homepage stats or internal governance properties leak.

Fresh authenticated CMS verification confirms all five remain `technicalOverview / pending / unknown`. No fake verified record was created. See `studio-production.json`, `production-match.json`, `production-regression-exits.json` and `step1-production.json`.

## Step 9 Overall Readiness

Step 9's audit, risk remediation and governance implementation can be closed after SEO review. Closing this implementation does not verify any engagement or outcome; the documented ERP/BPA/AI/software/cloud/homepage/testimonial evidence backlog remains open. Step 10 was not started.

STEP 9C COMPLETE — AWAITING SEO REVIEW
