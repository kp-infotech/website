# Step 10B — Safe Company Entity, Author Identity & Editorial Trust Corrections

## Step 10B Status

Pre-deployment checks PASS; deployment and production verification pending. Scope is limited to the authorized Step 10A P0/P1 corrections. No Step 11 work.

Clean release checkout: `/private/tmp/kp-step10b-release`, based on current `origin/main` commit `ed85e2fda0daa8e258cc44e666c9e11aeb4c8419`. The mixed original workspace is not the release source and remains untouched. [Step 10A audit](step-10a-company-entity-eeat-audit.md) accompanies this release as supporting documentation.

Before changes, captured 363 CMS documents with revisions in private temporary storage, all 56 production pages, all 21 article schema/author/date outputs, Organization schema, Contact, Insights, and relevant source files. [Baseline manifest](step-10b-evidence/baseline-manifest.json) records revision identifiers and capture hashes; [public baseline](step-10b-evidence/public-baseline.json) contains public page facts only. Raw CMS snapshots and credentials are not committed.

## Krupa Identity Correction

Published team record `ef223482-0edc-4d32-aad6-c87c2bf09432`:

- Before: `linkedin = https://www.linkedin.com/in/poojan-patel34/`.
- After: LinkedIn field absent; no replacement profile.
- Revision guard: `FLWOnYzhRkuT5CLpJU4eX2`; transaction/new revision `331r9LTHpoLfChrVYBxIhD`; completed `2026-09-28T11:04:12.738Z`.
- Exactly one user-content field changed (`linkedin`, unset); Sanity also updated its revision/update system metadata. The other **362 documents are unchanged**. Name, photo, Founder & Director label, assignments and every other user-content field are unchanged. [CMS verification](step-10b-evidence/cms-verification.json).

Build verification confirms the HR-software, retail-ERP and company-announcement pages still identify Krupa Joshi, with no author social link and no Person sameAs. All 12 Poojan article author blocks and Person nodes retain his existing correct LinkedIn. Author blocks do not fall back to another person's profile. No changes to Poojan's CMS record.

## Organization Entity

Preserved `https://kpinfo.tech/#organization`, name KP Infotech, URL `https://kpinfo.tech`, logo, five-pillar description, contact details, coarse address, region list/language and publisher/provider/creator references. Exactly one canonical Organization payload per page; no LocalBusiness, ProfessionalService, Corporation, Brand, founder Organization or additional identity fields were introduced. No alternateName, founder, foundingDate, legalName, brand, knowsAbout, award, employee count or tax/registration data was added.

## sameAs

Organization JSON-LD before: Instagram `https://www.instagram.com/kp.infotech/` and company LinkedIn `https://linkedin.com/company/kp-info/`.

After: **only `https://www.linkedin.com/company/kp-info`**. The schema helper now uses the reviewed company identity directly rather than treating every CMS social link as entity equivalence. Visible Instagram links and site-settings social values are unchanged. GitHub, candidate Krupa profile, namesake companies and Printcubator are not added to sameAs. Printcubator remains a research reference only, with no case, logo, testimonial or metric publication.

## Contact / Location

“Visit Our Office” → **“Location”**. The iframe is labelled **“General map of Ahmedabad, Gujarat, India”**, with visible **“General city map”** text. Removed the “Get Directions” CTA and unused directions styles/URL generation. The existing city-map URL is unchanged: no new street, coordinate, office pin or overseas location.

Email, phone, form markup, WhatsApp route, visible social links and office hours are preserved. The retained city label is a coarse declared location, not a verified visitor or registered office. Form delivery/phone reachability were not transaction-tested and are not claimed operationally verified.

Desktop (1440×1000) and mobile (390×844) checks show readable location content and no horizontal overflow. The external Google map did not render tiles in the verification browser; the retained location text and social links remain visible. No claim of third-party map availability is made. Existing design-system tokens, fonts, responsive structure and reduced-motion behavior are retained; no UI redesign or new DESIGN.md contract was needed for this content-site correction.

## Insights Positioning

Replaced the generic introduction and unsubstantiated project-experience implication on Insights and pagination pages 2/3 with:

> Practical guides to evaluating, designing and operating business systems — from custom software and ERP & Odoo to business automation, AI agents, and cloud & DevOps.

Headline, article cards, category links, pagination, CTAs and all metadata remain unchanged. The existing hub description still contains generic design/development and experience framing; this is documented, not silently rewritten. The user default was metadata preservation; a later separately reviewed metadata change may address it. No new service URL or canonical was introduced.

## Article Schema

All **21 BlogPosting nodes** now include `mainEntityOfPage: { "@type": "WebPage", "@id": <existing self-canonical article URL> }`.

Baseline comparison confirms all other article schema fields unchanged, except removal of Krupa's incorrect sameAs. Headline, description, image, publisher, section, keywords, dates and author assignment remain exactly as before. Publisher remains `https://kpinfo.tech/#organization`. No Person redesign or new Person ID/url/worksFor/biography/credential field.

## Authors

Distribution preserved: **Poojan 12; Krupa 3; Organization fallback 6**. All 21 author references remain unchanged in CMS. The six company fallback pages retain their existing rendering without a new visible company byline, editorial-team label or review claim. No bios or reviewer model were created.

## Deferred Author / Founder Items

P2: verified founder relationships and executive titles; full identity/profile confirmation for Krupa; approved specific biographies and portrait permissions; actual article contribution/editorial accountability; Instagram/GitHub ownership before structured use. Existing titles are preserved per instruction, not reclassified as verified. No inferred credentials, employers, degrees, experience years, awards or company-size facts.

## Terms / Legal Review

**BUSINESS/LEGAL REVIEW REQUIRED:** Terms section 2 retains the older design/web/mobile/ERP/digital-marketing service definition. It was not rewritten. Privacy and Terms body text, metadata, navigation and URL state are preserved; only the common Organization sameAs change applies to their schema. No Security, Cookie Policy, DPA, Subprocessor, Awards, Certifications, Press, team, founder or author pages were created.

## Article Date Backlog

No publishedAt, article datePublished/dateModified or visible article date was changed. Krupa's team-record update timestamp is not an article edit. Ten unzoned article timestamps remain unnormalized. The six restored articles' original publication provenance and all meaningful-review dates remain P2. No CMS creation/update date was promoted to an original-publication or expert-review date.

## Proof Governance

Step 9B/9C validators pass on all 56 built pages. All five published work records remain `technicalOverview / pending / unknown`, and their complete CMS records are unchanged. Five Technical Overviews remain live in the candidate; homepage numeric proof and testimonials remain hidden; no new client Organization, Review, metric, award or certification claim appears. No verified Odoo, BPA or production action-taking AI-agent case is asserted.

## Tests

- Authenticated production build: PASS, 56 sitemap URLs and 684 image optimization entries; built-in proof checks pass.
- Full Node suite: **123 passed, 0 failed, 0 skipped**; includes **16 new Step 10B tests**. [Test log](step-10b-evidence/tests.txt).
- Step 10B rendered audit: **56 pages, 21 BlogPosting nodes, 3 Krupa / 12 Poojan / 6 company fallbacks, zero errors**. Checks strict sameAs, entity architecture, exact allowed schema changes, baseline metadata/text/date preservation, Contact paths/map URL/form/hours and Insights introduction. [Result](step-10b-evidence/step10b-build.json).
- Step 1C: 57 generated HTML files, 56 sitemap pages, no dead/legacy links.
- Local Worker Step 1: **56 pages, 32 redirect checks, 63 removed-project checks, zero errors**; sample-digital-marketing variants remain 404; robots/sitemap pass. [Result](step-10b-evidence/step1-local.json).
- Step 2: nine approved metadata fixtures, zero errors.
- Step 3: 56 pages / 353 images; zero missing alt, H1/hierarchy, duplicate-ID, empty-button or empty-body issues.
- Step 4: 56-page graph, zero errors.
- Step 7A–7E: all five money-page validators pass.
- Step 9B and 9C: both 56-page validators pass.
- `git diff --check`: PASS. Cloudflare deployment dry-run: PASS, expected SESSION/EMAIL/ASSETS bindings retained; no Studio deploy required.
- Credential scan of built bundle and current evidence: zero occurrences. [Scan](step-10b-evidence/credential-scan.json).

[Validator exit codes](step-10b-evidence/regression-exits.json). An initial focused metadata comparison failed on an undefined parser property omitted by JSON serialization; filtering only undefined properties corrected the audit harness. All actual metadata values match. The primary browser plugin failed to initialize its native module, so available browser-control fallback was used; this did not affect the production build.

## Deployment

Pending authorized commit, normal push and established Cloudflare Worker deployment after completed checks. No Sanity Studio schema changed; no Studio deployment is planned.

## Production Verification

Pending deployment. Local candidate verification and desktop/mobile Contact/Insights checks completed. Post-deployment verification will cover all 56 pages, live/build matching, author mappings, metadata, dates, schema, proof, robots and retired routes.

## Remaining Step 10 Data Gaps

1. Krupa's verified correct profile; founder/leadership roles and approved biographies/portrait permissions.
2. Actual authorship/editorial responsibility for all articles and any maintainable reviewer process.
3. Original publication provenance, source timezones and meaningful update/review dates.
4. Legal name/type/registration/founding date, if useful to publish; no inferred values.
5. Visitor-office status/address, hours, channel monitoring/delivery and service availability. Worldwide Service scope and ContactPoint geography are intentionally unchanged.
6. Instagram/GitHub ownership for structured equivalence.
7. Business/legal approval for Terms service wording and policy operational facts; generic Insights metadata remains deferred.
8. All stronger client/outcome/testimonial evidence and permissions remain subject to Step 9.

STEP 10B COMPLETE — AWAITING SEO REVIEW
