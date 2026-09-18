# Step 7A — ERP/Odoo commercial page

Status: pre-deployment checks PASS; final deployment and production results pending. Scope: existing /services/erp-software/ only. No Step 7B and no new pages.

## ERP Page Before

H1: ERP & Odoo Solutions. Hero: KP Infotech implements, customizes, migrates, and supports Odoo ERP systems that connect sales, CRM, purchase, inventory, warehouse, accounting, manufacturing, HR, and operations in one reliable platform.

Opening: three paragraphs about disconnected tools, duplicated data and Odoo as an integrated operational system. Body: seven module/capability paragraphs, adoption and migration overview, followed by Step 4 cost/selection links. Five process stages; 14 technologies; five FAQs; no ERP case study displayed. Hero “Discuss Your Project” and closing “Start a Conversation” CTAs both link to /contact/. Closing operations-focused Step 2 copy retained.

Service-owned content word count: **677 before → 1627 after**, including all five process panels and FAQ answers but excluding shared navigation/footer/CTA. This is an inventory measure, not a ranking score or target. Full raw document and rendered inventory are in step-7a-evidence/erp-before.json and inventory-before.json.

## Source Audit

| Element | Authoritative source / renderer | Action |
| --- | --- | --- |
| H1 and breadcrumb label | Sanity service cb963b5c-1e52-4e05-95cf-a279e6e1dcb7.title → ServiceHero → PageHero | ERP document title changed |
| Hero | excerpt (tagline fallback) → ServiceHero | Direct service definition |
| Opening, scope, modules, educational links | contentHeading/content Portable Text → ServiceContent | ERP-only content update; module paragraphs and Step 4 reference block preserved |
| Process | processHeading/process → HowWeBuild | Same five named stages and keys; useful approvals/deliverables; unsupported durations removed |
| Technologies | techHeading/technologies → ServiceTechMarquee | All 14 preserved: Odoo, Python, PostgreSQL, JavaScript, XML, REST APIs, Docker, Linux, Nginx, AWS, Google Cloud, Azure, Odoo.sh, Cloudflare |
| FAQs | faqHeading/faqs → ServiceFAQ and service route FAQPage | Five → nine; shared source unchanged |
| Related insights | Step 4 internalLink references in Portable Text, resolved by serviceBySlugQuery/PortableTextLink | Cost/selection retained; one deployment link added |
| Related work | relatedWork → query public-case-study filtering → ServiceWork | No related Odoo proof; renders no section; workHeading remains dormant |
| Service/Breadcrumb schema | src/pages/services/[slug].astro, src/lib/seo.ts | Names reflect CMS title; ERP-only areaServed Worldwide; other services unchanged |
| Organization schema | BaseLayout/SEO and shared organization identity | Preserved |
| CTA | ServiceHero and route CTASection props | Step 2 wording, contact routes and analytics attributes preserved |
| Metadata | service.seoTitle/seoDescription | Exact approved strings preserved |

The original workspace was a mixed, stale checkout. Release work uses /private/tmp/kp-step7a-release, cloned from the prior release and checked against remote main ab23d1e. No original workspace code, previous-step edits, credentials, routes, redirect rules or deployment configuration were included. Updating the shared ERP document title naturally updates its existing footer/card references; other service documents and service-page content were not optimized.

All 363 published-perspective CMS documents were captured locally before mutation at /private/tmp/kp-step7a-cms-before.json. Only the ERP snapshot is included in version control. Two revision-guarded ERP-only patches were applied: initial content, then removal of a duplicated introductory definition detected during browser review. Original, intermediate and final ERP snapshots are retained. The reproducible batch contains the final fields against the original revision; re-running after application deliberately fails the revision check. Independent CMS verification confirms exactly one changed document across 41 service/article/case-study/industry/settings/about documents.

## ERP Page After

Hero definition → buyer fit and when Odoo may not fit → implementation scope → configuration/customization/custom software → preserved module/workflow coverage → migration validation → Odoo integrations → testing/UAT/go-live → post-launch support → client responsibilities → cost/deployment decisions and resources → existing five-stage roadmap → existing technology list → nine FAQs → operations CTA.

## Primary Intent

Odoo ERP implementation services/company for global B2B buyers. /services/erp-software/ remains the single commercial owner. Historical “kp erp” visibility is probable branded/entity demand, not evidence of strong generic Odoo rankings.

## Secondary Intents

Odoo consulting and discovery; configuration; customization; module selection; data migration; Odoo integration; support after implementation. These remain supporting sections on the parent.

## H1

ERP & Odoo Solutions → **Odoo ERP Implementation & Customization Services**. One H1, no unsupported superlative.

## Direct Answer

KP Infotech implements and adapts Odoo ERP for growing businesses whose sales, purchasing, inventory, finance and manufacturing workflows are spread across disconnected tools. We configure modules, migrate agreed data and connect systems so teams can work from shared operational information.

The definition appears once in the hero; the first body section moves directly into buyer fit.

## Buyer Decision Coverage

Disconnected systems, spreadsheet-heavy work, duplicate entry, stock and reporting visibility, replacement ERP fit, module priorities, configuration-first decisions, client access/data/testing responsibilities, scope and maintenance tradeoffs. Odoo is not presented as necessary for every company. No country targeting or cheap/offshore positioning was added.

## Configuration vs Customization

Standard settings first; custom modules/reports/workflows or integrations for demonstrated gaps. Consider a separate custom system if core requirements do not fit the ERP model. One contextual Custom Software link supports that decision. Business Automation is described as workflow execution across existing tools; no competing integration landing page was created.

## Data Migration

Source exports are assessed individually; spreadsheets and existing ERP/CRM/accounting/inventory sources remain within the earlier offering. Candidate records are subject to assessment, not universal compatibility. Client data owners clean and approve source records; KP maps/tests imports; operations/finance owners reconcile counts, balances and samples before cutover. No zero-loss promise.

## Integration

Odoo-specific API/third-party connections with agreed source of truth, fields, direction, access, failure handling and representative workflow tests. No invented named-vendor connectors or platform expertise. Generic software/API integration remains a Custom Software boundary.

## Implementation Process

The original five stages are preserved: Operations Audit; Solution Planning; Configuration & Customization; Training & Rollout; Support & Optimization. Every stage now states KP work, client input/approval and outputs. Checkpoints: approved requirements; agreed scope/acceptance criteria; tested workflows/trial reconciliation; UAT and cutover approval; validated improvements and prioritized backlog. Fixed durations 1–2, 2–3, 8–16 and 2 weeks were removed because no supporting delivery evidence was supplied.

## UAT / Go-Live

End-to-end workflows, permissions, reports, data and integrations are validated with testing users. Process owners approve acceptance; final imports, checks, deployment ownership and handling failed critical checks are planned before rollout. Training and existing user/admin documentation support handover. No zero downtime, guaranteed adoption or fixed rollout claim.

## Support

Issue resolution, workflow/report improvements, users, updates and incremental module expansion match the prior process/support positioning. Integration ownership and update responsibilities must be agreed. No 24/7 service, emergency SLA, response guarantee or official vendor support replacement.

## FAQs

Before (5): Why choose Odoo ERP for a growing business? | Can KP Infotech customize Odoo for our workflows? | Can Odoo support manufacturing, inventory, and purchase workflows? | Can you migrate data from spreadsheets or legacy software? | Do you support cloud and on-premise Odoo deployments?

After (9): Is Odoo right for our business? | What is included in an Odoo implementation? | Can KP Infotech customize Odoo for our workflows? | How do we choose modules for manufacturing, inventory and purchasing? | Can you migrate data from spreadsheets or legacy software? | Can Odoo integrate with our existing systems? | Do you support cloud and on-premise Odoo deployments? | What affects implementation cost and timing? | What happens after go-live?

Existing fit/customization/modules/migration/deployment subjects refined; scope, integration, cost/timing and support questions added. Nine unique questions; schema and rendered answers are tested for exact equality.

## Proof

Evidence used: existing published module paragraphs, custom module/API capabilities, migration FAQ, cloud/on-premise FAQ, five process stages, training/user/admin deliverables and ongoing support descriptions. These establish existing service scope, not independently verified project results. No approved Odoo implementation case study among the five public studies was found. relatedWork remains empty: **Odoo case-study proof gap remains**. Prior About partner/certification cleanup is preserved.

## Claims Avoided

No client names, savings percentages, implementation counts, testimonials, new case studies, certifications, official partner status, guaranteed data preservation, adoption, downtime, fixed implementation duration, price ranges or support SLA invented. Existing module paragraphs remain unchanged; no local legal/compliance service claim added.

## Internal Links

Preserved exactly: ERP implementation cost guide → /insights/erp-implementation-cost/ and ERP selection checklist → /insights/how-to-choose-erp-system/. Added once each: custom software development service → /services/custom-software-development/ and cloud vs on-premise ERP comparison → /insights/on-premise-vs-cloud-erp/. The Odoo complete guide retains informational ownership; no unnecessary extra link. Existing CTA paths remain /contact/. No article changed. Step 4 incoming ERP links remain 68 total, seven article-body sources and zero case-study sources.

## Schema

Organization, Service, FAQPage and BreadcrumbList preserved. Service name matches the new visible H1; URL matches unchanged canonical; description matches approved metadata. The sole runtime code change scopes Worldwide areaServed to the ERP slug, replacing the former India-only value for this service. Other service schema retains its prior behavior. No Review/AggregateRating or unsupported certification.

## Tests

Final authenticated production-style build PASS. Full node --test tests/*.test.mjs: **71/71 passed, 0 failed, 0 skipped**, including **4 new Step 7A tests** (rendered buyer content/schema/links; CMS field preservation; non-ERP scope preservation; negative claim/FAQ checks). ERP build audit: zero errors, nine FAQs. git diff --check PASS. Strict UI static audit: zero findings. Existing design-system document is the maintained visual context; no layout/token/style change. No separate formatter/typecheck command is configured.

Build has the existing Sanity Studio large-chunk warning; no new runtime failure. An early test run preceded completed prerender output and was superseded by the full passing run. First preview port was occupied; rebuilding invalidated an older preview’s asset manifest, so final HTTP checks use a fresh Worker on port 8798. These were test-environment issues, not published failures.

## Step 1–4 Regression

Step 1C/1E built checks PASS; full local HTTP audit: 56 pages, 32 redirect checks, 63 removed-project checks, zero dead/legacy links, six restored articles, five approved cases, sitemap/robots and sample-marketing 404 intact. Step 2: 9/9 exact metadata fixtures pass; only its intentional ERP H1 expectation updated. Step 3: 56 pages, 358 images, zero H1/hierarchy/missing-alt/duplicate-ID/empty-button/empty-body errors. Step 4: original sitemap and editorial relationships preserved; all link tests pass. No new URL.

## Deployment

Pending clean main commit/push and normal Cloudflare Worker deployment; final IDs will be recorded after release.

## Production Verification

Pending post-deployment checks. Local browser: 390px mobile and 1440px desktop, no horizontal overflow or broken completed images; hero, process panel and expanded FAQ inspected; process arrow-key navigation works. CTAs retain operations copy and contact paths. Final production results will replace this paragraph.

## Future Odoo Subpage Recommendation

| Topic | Decision | Reason |
| --- | --- | --- |
| Customization | KEEP ON PARENT | Core implementation choice, now explained with standard-first boundaries. |
| Migration | KEEP ON PARENT | Current evidence supports assessed migration as implementation scope; no distinct proof for a separate offer. |
| Integration | KEEP ON PARENT | Odoo-specific integration questions are covered; separate generic software/automation owners already exist. |
| Support | KEEP ON PARENT | Existing post-launch scope is covered, without verified standalone SLAs or proof to justify a dedicated page. |

Migration, Integration and Support can be reconsidered at P2 only if new non-brand demand and distinct verified delivery evidence justify a separate owner. None created.
