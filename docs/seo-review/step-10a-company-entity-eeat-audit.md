# Step 10A — Company Entity, Author Identity & E-E-A-T Audit

## Executive Entity Assessment

**PASS WITH DATA GAPS — audit/research only, 28 September 2026.** The production entity architecture is already sound: all 56 sitemap pages emit the same Organization node, `https://kpinfo.tech/#organization`. Core commercial positioning consistently describes B2B operations technology across five services. No competing company Organization node was found, including nested schema.

The clearest wrong-identity defect is **Krupa Joshi → Poojan Patel's LinkedIn URL**, present in the published team record, visible author links and Person `sameAs` on three live insights. Both Person authors lack biographies; executive/founder titles remain company assertions, not independently established business facts. Six other insights use the Organization author fallback without a visible company byline. Contact publishes consistent channels but implies an office visit without a verified visitor address. Terms retains the former service positioning. Historical publication and meaningful revision dates need evidence.

No new author, founder, team, awards, certification, location or security pages are justified now. Step 10B should begin with a small correction queue, preserving the Step 9 proof boundary. There is still **no verified public Odoo case, BPA case or production action-taking AI-agent case**. Five work pages remain Technical Overviews; homepage numerical proof and testimonials remain hidden.

### Scope, evidence and reproducibility

- Fresh production capture completed at **2026-09-28 10:41:24 UTC (16:11:24 IST)**. HTTPS GET of all 56 production sitemap URLs; all returned 200. Read production HTML, JSON-LD, metadata, header/footer links, article bylines, dates and public contact details. Also read sitemap index, robots, selected retired routes and plausible legal/security paths. No forms submitted, calls placed, email sent, accounts created or login performed.
- Fresh published-perspective Sanity reads: project `5rux0mv2`, dataset `production`, API `2024-01-01`, CDN disabled. Anonymous reads expose 15 articles; a narrowly projected authenticated GET confirmed all 21 published articles, the two team records, settings and five proof classifications. The six dot-ID articles require authenticated reads; their rendered content is public. No mutation, draft write or private evidence retrieval occurred.
- Source tracing: [SEO helpers](../../src/lib/seo.ts), [shared layout](../../src/layouts/BaseLayout.astro), [article template](../../src/pages/insights/[slug].astro), [author display](../../src/components/sections/AuthorBio.astro), [team schema](../../sanity/schemas/teamMember.ts), [About](../../src/pages/about.astro), [Contact](../../src/pages/contact.astro), [contact map](../../src/components/sections/ContactMap.astro), [queries](../../src/lib/queries.ts), legal templates and public policies. The supplied checkout contains older/pre-existing changes and does not fully represent the deployed Step 9C release. Production is authoritative for current output; preserved Step 9C release sources/validators under `/private/tmp/kp-step9c-release` were used for regression, not copied into this checkout.
- Compared fresh production with the Step 9C production capture: 56/56 match for normalized body, title, description, canonical, H1 and JSON-LD. Re-ran Step 2, Step 4, Step 7A–E and Step 9B/9C output validators on the fresh capture. Baseline: [Step 9C](step-9c-proof-governance.md), [production results](step-9c-evidence/production-match.json). Temporary working evidence is in `/private/tmp/kp-step10a`; the tables and findings below are the durable audit deliverable.
- Bounded web searches: `KP Infotech`, `KPInfotech`, `KP Infotech software`, `KP Infotech Odoo`, `KP Infotech Ahmedabad`, `Krupa KP Infotech`, `Poojan KP Infotech`, `KP Info software`, `KPInfo`, and exact profile/domain queries. Search snippets are discovery/cached evidence, not live-site truth or ownership proof. No claim of Google rank, index coverage or answer-engine citation performance is made.
- **VERIFIED PUBLIC** means the narrow fact is supported by an accessible public source/business record. **INTERNALLY CONSISTENT BUT UNVERIFIED** means KP-controlled assertions agree without independent/business proof. **CONFLICTING** means sources disagree. **UNKNOWN** means no reliable basis. Profile ownership confidence is assessed separately; an official self-managed profile does not independently verify its employment, incorporation, office, credential or delivery claims. Missing evidence is not proof of falsity.

## Canonical Company Entity

**Keep:** public brand `KP Infotech`, canonical website `https://kpinfo.tech/`, Organization ID `https://kpinfo.tech/#organization`. The schema's slashless `url` (`https://kpinfo.tech`) is the same origin, not a second entity. Keep the existing ID; no migration is needed.

**Recommended concise definition:** “KP Infotech is a global B2B operations technology partner focused on custom software development, business automation, ERP and Odoo solutions, AI automation and agents, and cloud and DevOps.” This is intended service positioning, not independent evidence of worldwide delivery, a global office network, certifications or completed engagements. The existing Organization description already covers all five pillars and can remain. Service availability and delivered proof must stay separate.

### Representation and name inventory

| Surface | Observed identity / definition | Assessment |
|---|---|---|
| Homepage | KP Infotech; B2B operations partner; custom software, ERP, automation, AI and cloud | Clear core definition; no numeric proof/testimonials |
| About | Operations-focused hero; Ahmedabad origin; first-name founder attribution; broad startup/enterprise history | Definition clear; founder identity and history insufficiently substantiated |
| Contact | KP Infotech; operations challenges and five aligned project-type choices | Consistent identity; office/hours evidence gap |
| Services hub + five detail pages | Five B2B operations pillars; shared company schema; worldwide service scope | Clear intended positioning; scope is not verified delivery |
| Work hub + five detail pages | Technical Overviews, anonymized context, explicit proof limits | Consistent with Step 9; do not interpret as verified clients |
| Insights hub/pagination | Generic design/technology/innovation editorial positioning; implies project-derived insight | Residual generic positioning and first-hand-experience implication need review |
| Articles | Shared publisher; two Person identities or Organization fallback; topic-specific CTAs | Mixed editorial identity; technical subject matter alone does not establish author expertise |
| Header / navigation | Brand logo linked home; public phone/email; core navigation | No competing brand string |
| Footer | KP Infotech copyright; software/ERP/automation/AI/cloud definition; matching contact | Aligned |
| Privacy Policy | KP Infotech and info@kpinfo.tech | Brand/contact aligned; controller legal identity not established |
| Terms | KP Infotech; UI/UX, web/mobile, ERP and digital marketing service description | Material positioning drift; business/legal review |
| CMS settings | siteName KP Infotech; operations-focused default SEO and footer text | Aligned; duplicated assertions are not corroboration |
| OpenGraph / Twitter | Brand in titles, page-specific descriptions and apex canonical URLs | Step 2 fixtures preserved; no separate company entity found |
| Breadcrumbs | Home → relevant hub/category/detail; apex URLs | 55 BreadcrumbList nodes; navigational labels, not alternate companies |
| Sitemap / robots | 56 apex URLs; robots points to apex sitemap index | Consistent host; no personal author-profile routes |
| Schema helpers | ORG_NAME / ORG_ID, common description, hard-coded city/region/country | Central identity; CMS name/contact/socials can override selected fields |

Across rendered text, **KP Infotech** is the only observed company-name spelling (186 matches in the normalized full-page inventory, including repeated sitewide elements). Do not treat those repetitions as independent proof. `KP`, `KPInfo` and `KP Infotech Technologies` were not found as current visible competing company names. Domain/handle forms `kpinfo.tech`, `kp-info`, `kp.infotech`, repository organization `kp-infotech`, GitHub display `kp infotech`, and LinkedIn post capitalization `KP INFOTECH` are identifiers/styling, not evidence for `alternateName` or `legalName`. No canonical-name typo was found in the 56-page output. Search discovery includes other businesses using KP InfoTech; do not merge them.

The older service list in Terms is not merely an abbreviation. Conversely, the company announcement explains a transition from broad digital services to operational systems; its historical framing does not itself require mechanical replacement. Broad startup/enterprise experience in About and the Insights project-experience implication remain unverified.

## Organization Schema

### Complete current contract

Exactly **56 Organization declarations, one unique payload**, one per sitemap page. No nested client Organization, duplicate competing ID, Person represented as Organization, Review or AggregateRating was found. The separately probed 404 page also emits this same Organization payload; it does not introduce another identity. Current fields:

| Field | Current rendered value |
|---|---|
| @type | Organization |
| @id | `https://kpinfo.tech/#organization` |
| name | KP Infotech |
| url | `https://kpinfo.tech` |
| logo | [Public SVG](https://cdn.sanity.io/images/5rux0mv2/production/4b37e44f6cf2fce06dbf07a45db2dc3b95252a0c.svg) |
| description | B2B operations technology partner building custom software, business automation, ERP & Odoo solutions, AI automation & agents, and cloud & DevOps for growing businesses |
| email | info@kpinfo.tech |
| telephone | +91 86182 79004 |
| address.@type | PostalAddress |
| address.addressLocality / addressRegion / addressCountry | Ahmedabad / Gujarat / IN |
| contactPoint.@type / contactType | ContactPoint / sales |
| contactPoint.telephone / email | Same phone and email as above |
| contactPoint.areaServed | India, United States, United Kingdom, Europe |
| contactPoint.availableLanguage | English |
| sameAs | `https://www.instagram.com/kp.infotech/`; `https://linkedin.com/company/kp-info/` |
| alternateName, founder, foundingDate, knowsAbout, brand, legalName | Absent |
| Organization-level areaServed | Absent; scope is nested in contactPoint |
| Other fields | None beyond those enumerated above |

### Reference coverage

| Page family | Actual linkage |
|---|---|
| Homepage | Shared Organization; WebSite `https://kpinfo.tech/#website` publisher references ORG_ID |
| Five services | Shared Organization; Service provider references ORG_ID; Service areaServed Worldwide |
| Five work pages | Shared Organization; CreativeWork creator and publisher reference ORG_ID; no anonymous client promoted to company identity |
| All 21 insights | Shared Organization; BlogPosting publisher references ORG_ID; six author references also use it |
| Contact | ContactPage mainEntity references ORG_ID |
| About | Shared Organization and BreadcrumbList; no AboutPage node/person-founder relationship |
| Other hubs, industries, legal, careers | Same shared Organization; no second company identity |

Absence of an AboutPage node is not a conflicting entity. The region list in ContactPoint is narrower than the Worldwide service declarations; this is a semantic scope mismatch to clarify, not evidence of extra offices or a second organization. Organization fields currently trust every nonempty CMS social URL without ownership validation.

### Proposed future Organization field decisions

| Field | Decision | Safe contract / condition |
|---|---|---|
| @type, @id, name, url | KEEP CURRENT | One Organization, same existing identity on all pages |
| logo | KEEP CURRENT | Existing public brand asset; no claim of trademark registration |
| description | KEEP CURRENT | Current five-pillar operations definition; avoid generic agency fallback |
| email, telephone, contactPoint sales channel | KEEP CURRENT | Existing public contact values; owner to confirm monitoring separately |
| contactPoint.availableLanguage | KEEP CURRENT | English is the currently published communication language; do not infer others |
| sameAs: company LinkedIn | KEEP CURRENT | High-confidence official profile; preserve one URL variant, avoid duplicate www/regional aliases |
| sameAs: Instagram | REMOVE | From future structured sameAs pending stronger ownership corroboration; probable is below the requested threshold. Removal is not a claim that the profile is false; visible social link can await owner review |
| address locality/region/country | KEEP CURRENT | Coarse declared location only; still unverified as a business office. Do not expand to street/premises |
| streetAddress / postalCode | ADD AFTER VERIFICATION | Public business/visitor address evidence and publication approval; do not copy personal/premises details from profiles |
| founder | ADD AFTER VERIFICATION | Confirm legal/public identities and founder relationship before references to Person IDs |
| foundingDate / legalName / identifiers | ADD AFTER VERIFICATION | Actual relevant business records; UNKNOWN / DO NOT PUBLISH now |
| Organization-level areaServed | ADD AFTER VERIFICATION | Owner-confirmed service availability; align nested region list, without office claims |
| knowsAbout | DO NOT ADD | Five services already communicate scope; no keyword list or unverified expertise expansion |
| brand / alternateName | DO NOT ADD | No separate brand entity or necessary evidenced aliases |
| awards, credentials, certification, employee counts, ratings | DO NOT ADD | No supporting review package; external self-claims are insufficient |

## Founder / Leadership Identity

[About](https://kpinfo.tech/about/) attributes founding to first names Krupa and Poojan and an Ahmedabad origin. Its Team section is suppressed even though both CMS records have `visible: true`; public author blocks still expose full names, role labels, photos and LinkedIn links. No founder relation is currently emitted in Organization schema. There are no independent full Person nodes or dedicated person URLs.

| Record | Displayed name / role | LinkedIn in CMS and current author output | Photo | Bio / other profiles |
|---|---|---|---|---|
| `d18b9ffb-f3a0-448c-97a6-59a4e14e027d` | Poojan Patel / Founder & CEO | [poojan-patel34](https://www.linkedin.com/in/poojan-patel34/) | [Published portrait](https://cdn.sanity.io/images/5rux0mv2/production/9cf798366a6a885a4a7926426d74b671272111da-800x800.png) | Bio null; Twitter, GitHub and separate sameAs fields null/absent |
| `ef223482-0edc-4d32-aad6-c87c2bf09432` | Krupa Joshi / Founder & Director | **Same Poojan destination — incorrect for this named Person** | [Published portrait](https://cdn.sanity.io/images/5rux0mv2/production/d88c5956ae7625ee34427520131269dbb304793c-800x800.png) | Bio null; Twitter, GitHub and separate sameAs fields null/absent |

Names, photos and role labels are consistently reused within each author's articles, but consistency does not verify the photo subject, permission, founding relationship or executive appointment. Poojan's exact LinkedIn profile publicly identifies him and KP Infotech; Krupa J.'s candidate profile has a KP association, but the public abbreviated surname does not resolve the full-name match by itself. No CEO/director appointment record, founder agreement, verified biography, degree, previous-employer evidence or credential verification was available. Treat role/founding facts as **INTERNALLY CONSISTENT BUT UNVERIFIED**; Krupa's current profile mapping is **CONFLICTING**. Do not interpret the profiles' Bengaluru person location as a second KP office or as disproving an Ahmedabad origin.

### About-page buyer assessment

About clearly answers what KP offers, and its values outline collaboration, dependable systems and integrity. It names only first-name founders, supplies no useful leader biographies, and makes broad startup/enterprise experience assertions without supporting records. Industry targeting is clearer through the linked industry pages than within About itself; detailed discovery/build/support process is clearer on the service pages and company announcement. Its origin sentence and shared footer give a city, not verified operating premises. Buyers can contact KP through the shared public channels, but cannot yet verify leadership roles or named project outcomes from About. The restrained Odoo service description is capability wording, not a partner/certification claim. The smallest useful improvement is verified full-name leadership context and actual responsibilities within the existing page, plus a concise process explanation and links to the already labelled Technical Overviews. Do not restore metrics, certifications, testimonials or pretend that these overviews establish completed engagements.

### Proposed Person contracts

For Poojan and Krupa, keep the existing public names as display attribution while actual authorship is confirmed. A future durable Person `@id` can be `https://kpinfo.tech/#person-poojan-patel` and `https://kpinfo.tech/#person-krupa-joshi` after identity matching; these are proposed identifiers, not new pages. Reference the existing Organization using `worksFor` only after relationship confirmation. A `url` should point to a real useful public profile location/section if one exists; do not invent author URLs. Existing portrait assets can be reused after subject/permission confirmation. Keep only verified/high-confidence person profiles in `sameAs`; remove Krupa's incorrect Poojan link before any replacement. `jobTitle` and biography require owner evidence, and an unsupported title may be omitted. Do not add alumniOf, awards, credentials, knowsAbout or experience-year claims. No fabricated expertise statement is warranted by the article count.

## Author Inventory

**21 live insight detail pages: 15 Person-authored (Poojan 12; Krupa 3), six Organization references arising from the missing-author fallback.** Unknown schema type: zero. Explicit Organization author CMS selections: zero; Organization fallback is six, not an additional six articles. Actual writing/review responsibility is unverified across all 21.

Profile keys in the complete inventory below:

- **P** = Poojan team reference `d18b9ffb-f3a0-448c-97a6-59a4e14e027d`; visible name/Founder & CEO/portrait above; bio absent; Person name/jobTitle/sameAs present, but no Person @id, url, image, description or worksFor in schema.
- **K** = Krupa team reference `ef223482-0edc-4d32-aad6-c87c2bf09432`; visible name/Founder & Director/portrait above; bio absent; same schema fields as P but wrong Poojan sameAs.
- **O** = null author reference; BlogPosting author `{@id: https://kpinfo.tech/#organization}`. No visible author byline or author-bio section; no individual bio/photo/role/sameAs. Shared publisher identity remains present.

Every title below is the CMS title and rendered BlogPosting headline. All publication and modified timestamps below match the fresh published CMS values. Visible calendar dates match publishedAt; no visible modified-date label was found. All 21 use BlogPosting, not a separate Article node.

| Live URL / title | Profile / schema type | CMS post document | datePublished | dateModified |
|---|---|---|---|---|
| [Angular vs React: Which Framework Is Better in 2024?](https://kpinfo.tech/insights/angular-vs-react/) | P / Person | `fc2fe8e6-9359-4626-919e-ec95006b731a` | `2025-09-29T06:35:17` | `2026-09-17T07:49:05Z` |
| [12 Best hr software for startups You Should Know](https://kpinfo.tech/insights/best-hr-software-for-startups/) | K / Person | `3e40f487-87db-42d0-a113-86a22fed6393` | `2025-09-20T07:22:54` | `2026-09-17T06:16:19Z` |
| [12 Best SEO Tools for Small Businesses in 2025](https://kpinfo.tech/insights/best-seo-tools-for-small-businesses/) | P / Person | `45e3cd51-1204-4aa9-bc63-7d61683d616a` | `2025-07-09T08:52:06` | `2026-09-17T06:16:19Z` |
| [Top 12 Best Web Application Frameworks for 2025](https://kpinfo.tech/insights/best-web-application-frameworks/) | P / Person | `439cf1fe-7b82-4d5c-8566-3586e6d1dd72` | `2025-09-18T07:09:15` | `2026-09-17T07:49:05Z` |
| [Business Process Automation Tools: Types, Use Cases, and Selection Guide](https://kpinfo.tech/insights/business-process-automation-tools/) | O / Organization fallback | `blogPost.business-process-automation-tools` | `2025-11-06T06:31:00.000Z` | `2026-07-01T06:31:57Z` |
| [Business Process Improvement Methods for Growing Companies](https://kpinfo.tech/insights/business-process-improvement-methods/) | O / Organization fallback | `blogPost.business-process-improvement-methods` | `2025-11-26T06:32:00.000Z` | `2026-07-01T06:32:12Z` |
| [Cloud Deployment Models Diagram Explained](https://kpinfo.tech/insights/cloud-deployment-models-diagram/) | P / Person | `3011f67f-8bba-43b3-b60d-8896384d64a0` | `2025-10-13T07:19:26` | `2026-09-17T07:49:05Z` |
| [8 Essential Database Design Best Practices for 2025](https://kpinfo.tech/insights/database-design-best-practices/) | P / Person | `bbc095f6-0148-4f75-8e1a-3dadbab25d1f` | `2025-08-16T06:48:00` | `2026-09-17T07:49:05Z` |
| [DevOps Best Practices for Reliable Business Applications](https://kpinfo.tech/insights/devops-best-practices/) | O / Organization fallback | `blogPost.devops-best-practices` | `2026-03-12T06:32:00.000Z` | `2026-07-01T06:32:45Z` |
| [Your Guide to ERP for Retail Stores in India](https://kpinfo.tech/insights/erp-for-retail-stores/) | K / Person | `c78863d6-a962-4365-a153-7e1942d0f0b8` | `2025-10-12T07:19:38` | `2026-09-17T07:49:05Z` |
| [Understanding ERP Implementation Cost](https://kpinfo.tech/insights/erp-implementation-cost/) | P / Person | `01edc29a-94b5-4d89-b93c-c519a1addf17` | `2025-07-14T08:41:00` | `2026-09-17T07:49:05Z` |
| [How to Choose an ERP System: Requirements, Costs, and Evaluation Checklist](https://kpinfo.tech/insights/how-to-choose-erp-system/) | O / Organization fallback | `blogPost.how-to-choose-erp-system` | `2025-12-12T06:32:00.000Z` | `2026-07-01T06:32:23Z` |
| [9 Essential Inventory Management Best Practices for 2025](https://kpinfo.tech/insights/inventory-management-best-practices/) | P / Person | `7a6b6881-d12d-4f83-a314-c3f00f8819d2` | `2025-09-12T06:57:29Z` | `2026-09-17T07:49:05Z` |
| [The Next Chapter of KP Infotech: Building Practical Systems for Growing Businesses](https://kpinfo.tech/insights/kp-infotech-new-website-custom-software-automation-ai/) | K / Person | `15c6587c-de22-4015-b264-6ceae08c47d6` | `2026-06-25T14:12:00.000Z` | `2026-09-17T07:49:05Z` |
| [Top 7 Minimum Viable Product Examples That Succeeded in 2025](https://kpinfo.tech/insights/minimum-viable-product-examples/) | P / Person | `b2ca9ea9-cb68-4957-b502-eb0d437deeb7` | `2025-09-08T06:57:00Z` | `2026-09-17T07:49:05Z` |
| [10 Mobile App Monetization Strategies for 2025](https://kpinfo.tech/insights/mobile-app-monetization-strategies/) | P / Person | `ef89f4cb-8421-46ff-9ba6-628fd3647e1e` | `2025-08-29T10:28:50Z` | `2026-06-25T12:14:43Z` |
| [12 Best Node JS Frameworks & Resources for 2025](https://kpinfo.tech/insights/node-js-frameworks/) | P / Person | `c69b5f83-c71d-456c-9d23-60d1dc867fab` | `2025-09-28T06:29:08` | `2026-09-17T07:49:05Z` |
| [Odoo ERP Complete Guide (2025): Features, Benefits & Pricing Explained](https://kpinfo.tech/insights/odoo-erp-complete-guide/) | P / Person | `22114651-112b-40f6-af14-a6ecdd448dfd` | `2025-09-12T08:47:03Z` | `2026-09-17T07:49:05Z` |
| [On-Premise vs Cloud ERP: Differences, Costs, Security, and Fit](https://kpinfo.tech/insights/on-premise-vs-cloud-erp/) | O / Organization fallback | `blogPost.on-premise-vs-cloud-erp` | `2026-01-12T06:32:00.000Z` | `2026-07-01T06:32:35Z` |
| [Building a Scalable System Architecture: Essential Guide](https://kpinfo.tech/insights/scalable-system-architecture/) | P / Person | `c35f7505-422b-4c6a-aebb-557e383cc66f` | `2025-07-11T09:34:12` | `2026-09-17T07:49:05Z` |
| [What Is Custom Software? Definition, Examples, and When to Build](https://kpinfo.tech/insights/what-is-custom-software/) | O / Organization fallback | `blogPost.what-is-custom-software` | `2025-10-12T06:31:00.000Z` | `2026-07-01T06:31:42Z` |

The three wrong-link pages are [HR software](https://kpinfo.tech/insights/best-hr-software-for-startups/), [ERP for retail](https://kpinfo.tech/insights/erp-for-retail-stores/) and [company announcement](https://kpinfo.tech/insights/kp-infotech-new-website-custom-software-automation-ai/). Correct the shared source once in a separately authorized step and verify both visible links and JSON-LD on all three.

### Authorship quality and BlogPosting contract

Neither Person bio explains topic experience or editorial responsibility. Poojan's articles span software, cloud, ERP, SEO and monetization; Krupa's span retail ERP, HR and company positioning. Technical breadth is not proof of expertise in every subject. Their external association helps identify them but does not establish who drafted, checked or approved any article.

All 21 schemas have stable article @id, headline, description, image, url, datePublished, dateModified and publisher. Publisher is consistently the Organization ID. Images are article images, not person portraits. `articleSection`/keywords are conditional; the uncategorized company announcement lacks articleSection. `mainEntityOfPage` is absent in all 21; future addition referencing the existing canonical article page is a safe clarity improvement. Current author assignments must not be changed on an assumed ranking advantage. Six company fallbacks are correctly typed via the referenced Organization but leave responsibility implicit to human readers.

## Author / Reviewer Model

Use the smallest truthful model: **KP Infotech as publisher, with actual named authors where their contribution is established, otherwise explicit company editorial responsibility after owner confirmation.** Do not retroactively assign a founder merely because their title looks authoritative.

- Poojan's 12 and Krupa's three current assignments: retain pending an authorship ledger, unless the business identifies a real error. Krupa's company announcement is a reasonable Organization-authored *candidate* if it was a company statement; a genuinely written founder statement can remain Person-authored. Its first-person company language alone cannot decide ownership.
- The six unassigned technical explainers (BPA tools, process improvement, DevOps, ERP selection, on-premise vs cloud ERP, custom software definition) may remain Organization-authored if KP accepts editorial accountability. Their restored CMS history contains no author reference. Depth alone is not evidence for reassignment.
- Add brief specific bios only from actual practice/contributions, backed by owner records and approved public wording. No invented Odoo certification, AI researcher, AWS architect, cybersecurity specialist or years-of-experience labels.
- **No reviewedBy model now.** No identified, substantiated ERP/cloud/AI reviewer and maintainable review process was established. Reconsider only with an actual practitioner, contribution/competence evidence, review date, scope and ongoing owner. No Editorial Board or cosmetic reviewer badge.
- Dedicated author pages: **AUTHOR PAGES MAY BE USEFUL LATER**, not now. Multiple contributions exist, but useful biography, verified identity mapping and editorial accountability are incomplete. Strengthen current bylines/About before adding URLs.

## Social / sameAs Verification

A successful HTTP response is not ownership proof; bot challenges are not broken-profile evidence. No duplicate URLs within either current Organization sameAs array were found. The serious duplication is cross-person reuse of Poojan's URL.

| Profile / source | Current use and accessibility | Identity classification | Recommendation |
|---|---|---|---|
| [LinkedIn company kp-info](https://www.linkedin.com/company/kp-info) | In settings, site links and all Organization nodes. Direct request served a challenge; public indexed company page exposes kpinfo.tech backlink, matching brand, city, contacts and service definition | **VERIFIED / HIGH CONFIDENCE OFFICIAL** for ownership inference from reciprocal domain linkage; business claims still self-reported | Keep one canonical profile URL; do not add regional/www duplicates |
| [Poojan poojan-patel34](https://in.linkedin.com/in/poojan-patel34) | Used by P and incorrectly K. Direct request 999; indexed public profile names Poojan and KP; company employee association also matches | **VERIFIED / HIGH CONFIDENCE OFFICIAL** for Poojan profile mapping; not independent title/credential verification | Keep for Poojan; **INCORRECT** for Krupa, remove that mapping in 10B |
| [Krupa J. candidate](https://in.linkedin.com/in/krupa-j-92273819b) | Not used on live site. Indexed profile and company employee listing associate Krupa J. with KP; direct request 999 | **PROBABLE**; exact full-name identity unresolved | Owner confirmation/corroborating full-name link before replacement or structured sameAs |
| [Instagram kp.infotech](https://www.instagram.com/kp.infotech/) | Live company link and Organization sameAs. Direct HTTP 200 exposes matching display name and B2B software/Odoo/AI bio; no reciprocal kpinfo.tech domain could be established in returned public content | **PROBABLE**, not independently verified ownership; no observed unrelated redirect | Exclude from strict future sameAs allowlist until verified; no claim it is fake/private/deleted |
| [GitHub kp-infotech](https://github.com/kp-infotech), [public API](https://api.github.com/orgs/kp-infotech) | Repository package references this organization; not current site sameAs. HTTP 200, display name kp infotech; public API has no company website, location or description and is_verified false | **PROBABLE** based on repository association; public ownership linkage incomplete | Do not add sameAs yet. GitHub's unverified flag is not evidence of illegitimacy |
| Founder GitHub / Twitter and other person sameAs | Absent in both published team records and live Person nodes | **NOT FOUND** in bounded audit | Do not invent or select namesakes |
| Other similarly named companies/profiles | See ambiguity section | **AMBIGUOUS** relationship to KP; known distinct domains are unsuitable for KP sameAs | Do not add |

The indexed [company profile](https://www.linkedin.com/company/kp-info) also self-describes a partnership and publishes a more precise Naroda address. That is not a registration record or permission to promote a possible residential address to the website. The exact street can be inspected at the source; it is intentionally not recopied into the proposed public identity. The profile's heading contains an extra “s” in its operations tagline; cosmetic external-profile review can wait. Ownership confidence does not validate company size or operational claims.

## Contact / Location

Current [Contact](https://kpinfo.tech/contact/), header, footer, settings and Organization schema agree on **info@kpinfo.tech**, **+91 86182 79004**, **Ahmedabad, Gujarat, India**. Legal bodies repeat the same email; their shared footer supplies phone/location. No separate sales/support mailbox is published; sales contactPoint reuses info@. These are **INTERNALLY CONSISTENT BUT UNVERIFIED** as monitored business channels. Public presence is verified; mailbox delivery, phone ownership and response service levels were not tested.

Contact offers a form with five aligned service choices plus Other/Not Sure, email/tel links and a WhatsApp path. Header/footer navigation reaches real service pages; the project-type choices are not themselves links. Client/server form wiring exists, but no submission was made and successful message delivery is **UNKNOWN** in this read-only audit. No false “form works end to end” conclusion is drawn. No fixed response-time promise appeared in current Contact copy.

Office hours shown: Monday–Friday 9AM–6PM IST and Saturday 10AM–2PM IST. They are static claims with no operational evidence. “Visit Our Office” accompanies a city-level address; the embedded map is a generic Ahmedabad map, and directions use a text search, not a verified office pin. This creates a stronger visitor expectation than the evidence supports. In 10B, neutralize the visit invitation unless a real visitor location is confirmed; do not fabricate a street address or map pin.

About says the company originated in Ahmedabad. Schema has only city/state/country. Company LinkedIn shows Ahmedabad and a street-level Naroda location; founders' public profiles show Bengaluru personal locations. Distinguish founder residence, origin, current business location and visitor office. Neither office occupancy nor registered address is independently established. No supported overseas office was found. “Worldwide” in Service schema and the ContactPoint country list concern availability, not premises or proof of clients in those markets.

## Legal / Trust Pages

| Page / signal | HTTP and indexability | Footer / update / identity | Assessment |
|---|---|---|---|
| [Privacy Policy](https://kpinfo.tech/privacy-policy/) | 200; self-canonical; no noindex; in sitemap; robots allows | Linked from all shared footers; June 2026; KP Infotech / info@kpinfo.tech | Present and coherent brand identity; legal/controller name and operational accuracy need business/legal review |
| [Terms of Service](https://kpinfo.tech/terms-of-service/) | 200; self-canonical; no noindex; in sitemap; robots allows | Linked from all shared footers; April 2026; KP Infotech / info@kpinfo.tech | Section 2 still describes design, web/mobile, ERP and marketing; flag service-definition drift for business/legal review |
| [Cookie policy candidate](https://kpinfo.tech/cookie-policy/) | 404; not in sitemap, not linked as a separate footer policy | Cookies/consent described within Privacy | No automatic new-page requirement |
| [Data-processing candidate](https://kpinfo.tech/data-processing/) | 404; not in sitemap/footer | No separate DPA/subprocessor contract page found | Do not assert absence of private contractual arrangements |
| [Security candidate](https://kpinfo.tech/security/) | 404; not in sitemap/footer | No dedicated security/disclosure page found | Premature without an accountable response process |
| [security.txt](https://kpinfo.tech/.well-known/security.txt) | 404 | No dedicated public security contact/disclosure instruction | Missing file is not inherently an SEO defect |

Privacy names analytics/consent/hosting/email/CMS providers and a retention period. These are current statements, **not verified operational/compliance evidence** and not a formal contractual subprocessor register. No full consent, retention, security or legal-compliance audit was performed. No legal text is proposed here. No publicly substantiated company registration, GST/VAT identifier, incorporation number, legal suffix or founding year was found in the scoped CMS fields, production pages and implementation source. Legal entity is **NOT PUBLISHED / UNKNOWN**. LinkedIn's Partnership classification is **UNVERIFIED**, not a license to set legalName or business registration data. A namesake registration must never be borrowed.

A security page is **premature** now; a maintained reporting contact may become useful if buyers need it and KP can handle reports. Do not claim SOC 2, ISO, HIPAA, PCI or enterprise-grade assurance without scoped evidence. Privacy and Terms dates are displayed revision labels, not verified legal approval dates.

## Article Date Integrity

Rendering consistency passes; historical provenance does not.

- All 21 live datePublished/dateModified values equal the current published CMS fields; all visible calendar dates agree with publishedAt. No visible “updated” date is shown. Dates are rendered as spans rather than semantic time elements.
- Every dateModified is `_updatedAt` (fallback to publishedAt in the template). A CMS write is real editorial metadata but does not by itself prove a substantive content review. Fourteen current article records share 17 September 2026 updates, one uses 25 June, six use 1 July. Do not label these as expert-reviewed dates.
- Fourteen legacy Person articles were created in Sanity on 16 February 2026 but publish dates are in 2025. This can be correct migration preservation; original WordPress timestamps/export evidence were not established by this audit. No rule should replace them with CMS creation time.
- The six Organization-fallback articles were created 30 June 2026, have current publishedAt from October 2025 through March 2026, and update dates 1 July 2026. The [earlier migration verification](../seo-migration/p0-insight-production-verification.md) recorded null dates for all six; later Step 1E reads found the current dates. This documents a change from unknown to populated dates, **not proof of their historical origin**. These six need original-publication evidence and revision history before claiming original dates. Their restoration did not itself establish original authorship or original body provenance.
- The company announcement was created 25 June 2026 at 14:11:20Z and published at 14:12Z; this is internally coherent, but still not an independent original publication log.
- Ten publishedAt values omit a timezone (`angular-vs-react`, `best-hr-software-for-startups`, `best-seo-tools-for-small-businesses`, `best-web-application-frameworks`, `cloud-deployment-models-diagram`, `database-design-best-practices`, `erp-for-retail-stores`, `erp-implementation-cost`, `node-js-frameworks`, `scalable-system-architecture`); do not infer UTC or IST from them. After verifying the source timezone, normalize without shifting the visible calendar date. Eleven have Z offsets.
- Older year labels such as Angular vs React “2024” and the Odoo guide “2025” coexist with newer CMS modified timestamps. A timestamp update must not imply current technical/pricing validation.

**Date decisions:** preserve current dates during 10A. Step 10B can stop automatically presenting arbitrary CMS edits as substantive review only after a defined editorial-date policy; do not manufacture replacement dates, backdate content, or reset old content to today's date. Original publication of the 20 migrated/restored articles is unverified; the six restored dates have the stronger documented provenance gap. No confirmed case of migration creation date replacing original publication was found; missing provenance is not proof of that error.

## Brand / Entity Ambiguity

The bounded current search surfaced the official site and company LinkedIn, but also materially different entities:

| Source | Observed distinction | Consequence |
|---|---|---|
| [kpinfotech.co.in](https://www.kpinfotech.co.in/) | Mumbai-based marketing/media business with a different domain/contact identity; claims an older founding history | Do not borrow its founder, dates, awards, projects, testimonials or social profiles |
| [K&P Infotech](https://kpinfotech.ca/) | Separate Canadian-domain IT consulting identity | Brand-name similarity does not establish affiliation |
| [KP InfoTech Solutions](https://in.linkedin.com/company/kp-infotech-solutions) | Hyderabad company with a different name/domain context | Exclude from KP sameAs |
| [kp-infotech.com](https://kp-infotech.com/) | Holding/launching-soon site | Relationship unknown; do not treat as alternate official domain |
| [KP Info Systems](https://kpinfosystems.com/about/) | Separate ERP/software company and leadership | Do not merge on initials or service overlap |
| [KP Info](https://app.celnisprava.cz/KPInfo/) | Czech customs application | Short forms carry substantial non-brand ambiguity |

The five requested brand/software/Odoo/Ahmedabad queries returned mixtures of official, legacy and similarly named sources. `KPInfotech`, `KP Info` and `KPInfo` were less discriminating; no rank table or exact Google SERP position is inferred. Search still exposes older KP homepage metrics, testimonial text, older About partner language and old WordPress routes. Fresh GETs show the current homepage/About are remediated; old `/kp-infotech-faqs/` resolves to Contact and `/about-kp-infotech-expertise/` to About. Cached copy is a future indexing observation, not a Step 9 production regression or authorization for Step 14 work.

A useful narrow independent reference was found: [Printcubator's legal notice](https://printcubator.net/legal-notice/) credits KP Infotech for design/programming and explicitly identifies kpinfo.tech. **VERIFIED PUBLIC only for the existence of that third-party attribution.** It does not verify founder identity, legal status, project scope, Odoo/BPA/AI work, business outcomes or reuse permission. It must not become Organization sameAs (Printcubator is a different entity), a new case study or restored testimonial.

Reduce ambiguity through the existing stable apex entity ID, full public name, coherent five-pillar definition and verified profile connections. Do not stuff unrelated spelling variants into alternateName. No brand SERP/reputation implementation is included.

## GEO Entity Clarity

| Buyer / answer-engine question | State | Defensible answer / limitation |
|---|---|---|
| What is KP Infotech? | CLEAR | Publicly positions itself as a B2B operations technology partner; legal form unresolved |
| Which services? | CLEAR | Five live pillars: custom software, business automation, ERP/Odoo, AI automation/agents, cloud/DevOps |
| Who founded/runs it? | PARTIAL | About names Krupa and Poojan; author blocks give full names/titles; legal/founder-role proof missing and Krupa link wrong |
| Where does it operate? | PARTIAL | Declared Ahmedabad/India origin/location and worldwide service availability; visitor office/registered address unverified |
| Which industries? | CLEAR as target scope | Eight live sectors: healthcare, retail/e-commerce, manufacturing, logistics, finance, startups/SMEs, real estate, education; not verified delivered-client counts |
| How can it be contacted? | CLEAR for public routes | Published email, phone, form and WhatsApp; delivery/monitoring untested |
| Who writes technical content? | AMBIGUOUS | Two named authors plus six implicit company fallbacks; no bios, contribution logs or reviewer model |
| What proof is verified? | PARTIAL | Narrow independent website credit exists; work pages explicitly provide technical context, not verified delivery/outcomes |
| Founding year, credentials, legal registration? | UNSUPPORTED | UNKNOWN / DO NOT PUBLISH without source evidence |

This assesses extractable source clarity, not a prediction of ranking, citation or an E-E-A-T score.

## Entity Fact Table

| Fact | Current Public Value(s) | Source(s) | Status | Recommended Canonical Value | Step 10B Action |
|---|---|---|---|---|---|
| Public company name | KP Infotech | 56 live pages, CMS settings, independent Printcubator credit | VERIFIED PUBLIC as brand attribution, not legal name | KP Infotech | Keep |
| Website / entity ID | kpinfo.tech / #organization | Production, schema, LinkedIn backlink, Printcubator domain credit | VERIFIED PUBLIC for website association | https://kpinfo.tech/ / https://kpinfo.tech/#organization | Preserve |
| Short definition | B2B operations partner; Terms retains old digital-services list | Home/About/schema/settings/Terms | CONFLICTING positioning, not identity | Existing five-pillar operations definition | Align residual descriptions; Terms through business/legal owner |
| Services | Five core B2B pillars | Five live service pages, settings/footer | INTERNALLY CONSISTENT BUT UNVERIFIED as delivered capability | Current five pillars as offered scope | Keep; no delivered-proof implication |
| Founders | Krupa & Poojan | About and author titles | INTERNALLY CONSISTENT BUT UNVERIFIED | Full names only after identity/role substantiation | P2 verification before founder schema |
| Leadership roles | Poojan Founder & CEO; Krupa Founder & Director | Two CMS records / 15 article blocks | INTERNALLY CONSISTENT BUT UNVERIFIED | UNKNOWN / DO NOT PUBLISH additional roles | Verify titles, omit unsupported schema expansion |
| Physical location | Ahmedabad, Gujarat, India; office-visit wording; profile has more precise location | Contact/schema/About/company LinkedIn | INTERNALLY CONSISTENT BUT UNVERIFIED at city level; office UNKNOWN | Coarse declared location, not a verified visitor office | Neutralize visit claim; no street expansion |
| Service area | Worldwide vs India/US/UK/Europe | Service vs contactPoint schema | INTERNALLY CONSISTENT in broad intent; differing granularity | Owner-confirmed worldwide availability | Reconcile only as availability |
| Email | info@kpinfo.tech | Header/footer/Contact/legal/settings/schema | INTERNALLY CONSISTENT BUT UNVERIFIED monitoring | Existing public email | Keep; owner delivery check |
| Phone | +91 86182 79004 | Header/footer/Contact/settings/schema | INTERNALLY CONSISTENT BUT UNVERIFIED ownership/monitoring | Existing public phone | Keep; owner confirmation |
| Business hours | Weekday 9–6, Saturday 10–2 IST | Contact | UNKNOWN operational substantiation | UNKNOWN / DO NOT ADD to schema | Confirm or remove promise |
| Company LinkedIn | kp-info | Reciprocal website/profile relationship | VERIFIED PUBLIC / high-confidence profile association | Existing profile | Keep |
| GitHub | kp-infotech in repository metadata | Package + public organization/API | UNKNOWN public ownership; PROBABLE association | UNKNOWN / DO NOT PUBLISH in sameAs yet | Obtain public/owner corroboration |
| Instagram / other company sameAs | kp.infotech; no others | Site/settings/profile metadata | INTERNALLY CONSISTENT BUT UNVERIFIED ownership | UNKNOWN for strict sameAs until confirmed | Exclude pending verification |
| Founding date / age | No current date/year count found | 56 pages, schema, scoped CMS/source | UNKNOWN / NOT PUBLISHED | UNKNOWN / DO NOT PUBLISH | Do not infer from team tenure, GitHub date or copyright |
| Legal entity / business type | KP brand only; LinkedIn self-reports Partnership | Policies/schema/company profile | UNKNOWN legal name; UNVERIFIED type | UNKNOWN / DO NOT PUBLISH | Actual business records, no namesake borrowing |
| Registration / GST / VAT | Not published in scope | Pages/CMS/source scan | UNKNOWN / NOT PUBLISHED | UNKNOWN / DO NOT PUBLISH | Add only if verified and useful |
| Poojan author identity | Full name, portrait, title, correct LinkedIn; no bio | 12 articles/CMS/profile | Profile association high confidence; title/authorship unverified | Same public person, contribution-based attribution | Verify biography/role; stable Person contract later |
| Krupa author identity | Full name, portrait, title, Poojan link; no bio | Three articles/CMS; Krupa J. candidate | CONFLICTING profile mapping; replacement PROBABLE | Remove wrong link; replacement UNKNOWN until matched | P0 correction, P2 replacement verification |
| Company article author | Six null-reference fallbacks | Article schema and CMS | VERIFIED PUBLIC rendering; accountability UNKNOWN | KP as publisher; company authorship if accepted | Confirm and expose truthful responsibility |
| Independent attribution | Printcubator website design/programming credit to domain | Printcubator legal notice | VERIFIED PUBLIC for narrow attribution only | No new case/outcome claim | Retain research lead; no Step 9 reopening |

## E-E-A-T Gap Table

| Signal | Current State | Evidence Quality | Risk | Recommended Action |
|---|---|---|---|---|
| Company identity | One brand/site/Organization; residual Terms positioning | Strong rendering evidence; narrow third-party domain credit | Low entity-ID risk; moderate semantic drift | Keep graph; align residual copy |
| Founder identity | First names on About, full names/titles on articles | Company assertions; external association only | Unsupported founder/title inference | Verify business roles before expansion |
| Author identity | Two named authors, missing bios, wrong Krupa link | Fresh CMS + production confirm defect | High cross-person conflation | Remove wrong link; verify replacement |
| Editorial responsibility | Publisher explicit; six human-facing bylines absent | CMS references show assignment, not contribution | Unclear content ownership | Small real authorship/accountability model |
| Proof | Five Technical Overviews, no verified outcomes | Step 9 governance + fresh output checks | Repetition could be mistaken for corroboration | Preserve proof labels and gates |
| Testimonials | Hidden; no restored quotes | Fresh homepage and 56-page checks | Unsupported reintroduction | Keep hidden pending evidence/permission |
| Contact | Consistent email/phone, form present; city-only office invite | Public values observed; delivery untested | Buyer cannot locate verified visitor office | Neutralize office implication; owner tests channels |
| Legal pages | Privacy/Terms live and linked; old Terms services | Public text verified, legal adequacy not assessed | Identity/operational policy mismatch | Business/legal review, no automatic new pages |
| Schema | Stable Organization; Person IDs absent; dates use CMS updates | Full JSON-LD inventory | Wrong sameAs + weak temporal semantics | Correct identity; strengthen references selectively |
| External profiles | LinkedIn high confidence; Instagram/GitHub probable | Reciprocal domain evidence varies | Namesake contamination | Strict high-confidence sameAs allowlist |
| Security/compliance | Privacy provider list; no disclosure process/page | Assertions only; no attestation evidence | Cosmetic assurance would mislead | No enterprise security claims; process before page |
| Publication dates | Render/CMS agree; original-date evidence gaps | Historical null dates for six; import clusters | False historical/freshness inference | Source-date ledger and meaningful revision policy |
| Expert review | No reviewer model or substantiated reviewer found | UNKNOWN | Fabricated review credibility | Do not add reviewedBy now |
| Company age | No current numeric tenure or founding year identified | Absence within audited scope | Borrowing namesake/combined-tenure dates | Keep absent |

## Step 10B Queue

This is a recommendation, **not implementation authorization**.

### P0 — Correct wrong identity

1. Remove Poojan's LinkedIn URL from Krupa's team record and the resulting visible/social/schema output on her three articles. Do not automatically substitute the Krupa J. candidate. Acceptance: no Krupa author block or Person node points at poojan-patel34; Poojan's 12 remain correct. No Organization-ID correction is needed.

### P1 — Strong safe entity improvement

1. Preserve the existing Organization ID/name/publisher/provider graph. Restrict structured sameAs to high-confidence official identities; hold Instagram out pending verification rather than automatically emitting every social field. Preserve the company LinkedIn.
2. Remove the unsupported office-visit implication/generic-map-as-office framing while keeping the current coarse location and public channels. Do not add a new office claim.
3. Align Insights' generic/project-experience framing with the five-pillar editorial scope; route the legacy Terms service definition to business/legal review. Keep Step 2 approved titles/descriptions unchanged unless separately authorized.
4. Add BlogPosting mainEntityOfPage using existing canonical URLs if useful; do not change author assignments. After actual responsibility is confirmed, make the existing six Organization attributions understandable to readers. Biography, identity relationships and revised-date values remain gated below.

### P2 — Wait for business verification

- Confirm Krupa's full public identity and exact correct account; validate both founder relationships, executive titles, portraits/permissions and short factual biographies.
- Obtain real authorship/editorial responsibility for 21 records; no inferred reassignment. Establish original publication evidence, especially the six formerly-null dates, and substantive-revision dates/source timezones for all articles.
- Verify legal name/type/registration/founding date only through actual records; publish only useful approved facts. Do not calculate age from GitHub account, copyright or combined team experience.
- Verify visitor-office status/address, office hours, contact monitoring and service availability; align regional/Worldwide claims accordingly.
- Verify Instagram/GitHub ownership before schema use. Confirm policy/provider/retention assertions with the operational/business/legal owners. No new security/credential assertion without evidence.

### P3 — Optional trust improvement

Author-profile content within existing About/byline surfaces may be useful after P2. Dedicated author pages, real reviewer model, maintained security reporting contact or a concise data-handling explanation require an owner and user value. None is a prerequisite for this audit to pass. No awards/press/certification/location-page expansion is queued.

## New Page Decisions

| Page type | Decision | Reason |
|---|---|---|
| Author pages | AUTHOR PAGES MAY BE USEFUL LATER | Contribution volume exists; identity/bio/accountability prerequisites incomplete |
| Founder/team pages | NO NEW PAGES NOW | Existing About can answer buyer questions once facts are verified |
| Security page | PREMATURE | No evidenced disclosure response process or assurance package |
| Cookie policy | NO NEW PAGE REQUIRED BY THIS AUDIT | Current Privacy contains cookie/consent information; legal owner decides needs |
| DPA/subprocessor page | OPTIONAL ONLY WITH ACTUAL CONTRACTUAL/BUYER NEED | Provider list is not a legal assurance; no manufactured contract content |
| Press, awards, certifications, location pages | DO NOT CREATE | No substantiated new content/value package |

## Data Gaps

1. Founder/legal-identity evidence linking full names to the company, and current CEO/director responsibilities.
2. Full-name confirmation and ownership for Krupa's candidate LinkedIn; public/account-owner corroboration for Instagram and GitHub.
3. Approved, specific biographies, portrait subject/permission confirmation, contribution records and article-by-article author/editor accountability.
4. Original WordPress publication evidence for legacy posts; provenance of the six restored articles' newly populated dates; original body/revision history where relevant; timezone for ten unzoned values.
5. Evidence of substantive updates distinct from CMS migrations, metadata edits and maintenance writes.
6. Verified legal entity name/type, registration/tax identifiers and founding date if useful to publish. None can be borrowed from namesakes.
7. Actual business/visitor address and office arrangements; current operating hours; contact delivery/monitoring; owner-confirmed service availability.
8. Operational/business/legal confirmation of policy revision dates, provider statements, retention and consent descriptions. No assessment of legal sufficiency is made.
9. A genuine reviewer and maintainable review process, if proposed later; no certification/award/experience-year substantiation available.
10. Business evidence and publication permission for any future stronger client/outcome/testimonial claims remain governed by Step 9. The independent website credit does not close these gaps.
11. No direct Google SERP/rank, Search Console reindexing state or answer-engine extraction test; bounded public-search results can be stale. External bot restrictions limit live profile inspection.
12. Contact form delivery/phone reachability were deliberately not transaction-tested in this read-only task.

## Changes Made

Created only `docs/seo-review/step-10a-company-entity-eeat-audit.md`. Temporary scripts and captures were written under `/private/tmp/kp-step10a` for research. No source code, CMS values, author assignments, biographies, social links, metadata, sitemap, legal pages or deployed assets changed. No commit, push, build, deployment or Step 10B work occurred. Pre-existing workspace changes were left untouched.

## Regression

| Requirement | Fresh read-only result |
|---|---|
| 56 sitemap URLs unchanged | PASS — exact URL-set comparison with Step 9C, all 56 HTTP 200 |
| Five services live | PASS — custom-software-development, business-automation, erp-software, ai-automation-agents, cloud-devops |
| Five Technical Overviews live | PASS — all five case slugs retained, HTTP 200, correct labels and proof limits |
| Step 9 proof governance | PASS — output validators report zero errors across 56; all five current CMS records technicalOverview / evidence pending / publication permission unknown |
| Homepage stats/testimonials hidden | PASS — fresh output and Step 9 validators; no restoration |
| Step 2 metadata | PASS — nine approved target fixtures, zero errors |
| Step 4 internal graph | PASS — all 56 pages re-analyzed; zero graph errors |
| Step 7 money pages | PASS — five existing validators, zero errors |
| Baseline content preservation | PASS — body/title/description/canonical/H1/schema match Step 9C on 56/56 |
| sample-marketing | PASS — `/sample-marketing/` remains 404 |
| robots / apex sitemap | PASS — robots 200, Allow /, canonical sitemap-index reference |
| Deployment | NONE |

These are public-output and published-status checks, not a new mutation-based test of Sanity's enforcement gates. Existing Step 9C governance implementation remains outside this audit's mutation scope.

### Capture fingerprints

- `pages.json` SHA-256: `a9766b08aab31e19a6ee4fe9e94fa9f9fb1dad180f06ed5e4c735ffdc1f25a4f`
- `sitemap.xml` SHA-256: `43cc086f8e1961aee92d40157a1317c76b0bf05906d2db5baf5f90ea535a8f1c`
- `cms-auth.json` SHA-256: `115e4f96e0d37eb889e052b8328d5257c0d2ba88bde0c303e1164bddd647dd0f`
- `regression.json` SHA-256: `683415aed7c1b0429df579ca9944789623d5ed2d1379778bc22d74b318053e64`
- `validators.json` SHA-256: `429ee4527a8edda24c390ef032a32d5d0e8c75188e198e7b7ddef31da743700b`
- `graph.json` SHA-256: `1a9cf2120437647496b36987095f1c9673116bc42f3358bdb969706ccfdbe3a3`

STEP 10A COMPLETE — AWAITING SEO REVIEW
