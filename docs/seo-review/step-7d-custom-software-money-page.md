# Step 7D — Custom Software money page

Status: **PASS WITH WARNINGS** — implemented, deployed and production-verified. Existing case-study claims remain in the Step 9 substantiation backlog. All Step 7D checks completed.

Target: https://kpinfo.tech/services/custom-software-development/
Scope: Step 7D only. No AI optimization, Step 7E work or new URL. Release prepared in clean main checkout `/private/tmp/kp-step7d-release`, based on `ae225fc`; the original mixed workspace is not used for release.

## Before

HTTP 200, indexable, one H1, approved metadata and canonical already correct.

- H1: **Custom Software Development**.
- Hero: We build custom business software for growing teams that have outgrown spreadsheets, disconnected tools, and manual workflows. From internal tools and dashboards to portals, SaaS MVPs, workflow systems, and API integrations, KP Infotech creates practical software that improves visibility and helps operations move faster.
- Content heading: Build the Software Your Operations Actually Need.
- Opening: Most growing businesses reach a point where spreadsheets, shared inboxes, and disconnected tools can no longer support daily operations. Reports take too long, approvals get missed, data is duplicated, and teams lose visibility into what is actually happening.
- Definition: Custom software development is the process of designing and building business-specific applications, portals, dashboards, and workflow systems around the way your company actually works. KP Infotech builds practical software that replaces manual work, connects data, and gives teams a clearer operating system for growth.
- Software types: Internal Tools & Admin Systems; Dashboards & Business Portals; Workflow Systems; SaaS MVPs & Product Platforms; API Integrations; Web & Mobile Interfaces.
- Buyer problems: spreadsheet dependence, disconnected tools, slow reports, missed approvals, duplicated data and limited visibility. Build-vs-buy appeared only briefly in an FAQ, without a buy/configure/automate decision framework.
- Body structure: What We Build; Built Around Business Outcomes; one Step 4 resource paragraph. Requirements, architecture and testing were mostly brief process statements. UAT, acceptance, scope changes, cost drivers and handover responsibilities needed more detail.
- Process: Discovery & Workflow Mapping → Architecture & Product Planning → Agile Development → Testing & Deployment → Support & Iteration. Generic durations: 1–2 Weeks, 1–2 Weeks, 4–10 Weeks, 1–2 Weeks, Ongoing.
- Technologies (15, preserved): Next.js, React, Node.js, TypeScript, Python, FastAPI, PostgreSQL, Supabase, Sanity CMS, REST APIs, GraphQL, AWS, Vercel, Docker, Cloudflare.
- FAQs: five covering build-vs-buy, tools/portals, integration, MVP and ownership.
- Related work: three existing cards, collaboration platform, digital banking and omnichannel commerce; the collaboration case is featured with its existing excerpt, the other two use smaller title cards.
- Insights: custom software guide and database design best practices, represented by internal references in Portable Text rather than a separate related-insights field.
- CTAs: Discuss Your Project → /contact/; All Services → /services/; closing Start a Conversation → /contact/.
- Schema: Organization, BreadcrumbList, Service and FAQPage; serviceArea unset, Service areaServed Country/India.
- Word count: **702**, using service-field text only, excluding navigation/footer, CTA, durations and case-card content. Descriptive inventory, not an optimization target.

### Source audit

| Element | Source |
|---|---|
| Sanity document | Published service `2466d2a2-9084-4ae5-b347-291ba5475965`, revision `Xe0A1k3WLpDZQN3vt7JBHA`, project `5rux0mv2`, dataset `production` |
| Page and query | `src/pages/services/[slug].astro`; explicit `serviceBySlugQuery` in `src/lib/queries.ts` |
| H1/breadcrumbs | `service.title` → ServiceHero/PageHero; breadcrumb schema uses the same title |
| Hero | `excerpt`, fallback tagline; existing hero image |
| Body/capabilities | `contentHeading`, `content` Portable Text → ServiceContent; no separate capability array |
| Process | `processHeading`, `process[]` → HowWeBuild; title, description, deliverables, duration |
| Technology list | `techHeading`, `technologies[]` → ServiceTechMarquee |
| FAQ | `faqHeading`, `faqs[]` → ServiceFAQ and matching FAQPage schema |
| Insights | Existing `step4resources` Portable Text reference block |
| Related work | `relatedWork[]` public-case-study-filtered query → ServiceWork; workHeading preserved |
| Schema | Service route builds Service/Breadcrumb/FAQ data and references shared Organization identity |
| Service area | Existing optional serviceArea field, explicitly projected by query, overrides historical default |
| CTA | Hero buttons in ServiceHero; operations-focused CTASection supplied by service route |

Full before document, all five approved case documents and rendered inventory were captured before mutation. The updater checks complete snapshot equality and uses `ifRevisionId`; only title, excerpt, contentHeading, content, process, faqs and serviceArea are set. No metadata, slug, image, technology, reference, template, schema or query changes.

## After

One commercial H1, direct hero definition, buyer-decision sections, coherent software types, detailed discovery/integration/UAT guidance, practical scope and handover language, existing five process stages, technology list, three proof cards, ten FAQs and original CTAs.

Body headings:

- When custom software is the right fit
- Build, buy, configure or automate?
- Types of software we build
- Discovery and requirements
- Architecture and maintainability
- Data and system integrations
- Testing and user acceptance
- Practical security responsibilities
- What your team provides
- Scope, cost and delivery planning
- Ownership and handover
- Support after release

Service-field word count: **702 → 1936**. Added detail answers buyer questions; no word-count target was used.

## H1

**Custom Software Development → Custom Software Development Services**. Natural commercial provider intent without superlatives or keyword stacking.

## Direct Answer

> KP Infotech designs and builds custom business software for companies whose workflows no longer fit spreadsheets, disconnected tools or off-the-shelf products. We create internal tools, business applications, portals, SaaS MVPs and integrations around the operational capabilities your team needs.

## Buyer Fit

Distinct operational workflows, interfaces or data models that suitable products cannot support, spreadsheet-based operations, reconciliation and dedicated customer/partner access. Recommends defining an unstable process and testing a smaller scope before building.

## Build vs Buy vs Configure

Four concise options: buy a suitable standard product; configure Odoo or another platform; automate handoffs across adequate existing systems; build when a distinct capability is required. Custom development is not presented as the default answer.

## Software Types

Internal tools emphasize staff tasks, approvals, reconciliation, reports and coordination. Business applications cover department workflows and shared records. Portals cover role-based requests, orders, documents and visibility. SaaS/MVP stays a supporting capability with minimum useful scope and validation. Application/API integrations and responsive interfaces support those systems.

Custom ERP-like operational functionality is conditional on a packaged platform not fitting; no separate custom-ERP offer or Odoo intent takeover. Legacy internal-tool replacement is a limited parent capability, not evidence of a broad modernization practice.

## Discovery

Business problem, current work, users/roles, rules, exceptions, systems, data, permissions, integrations, reporting and relevant non-functional requirements. Prioritized scope and representative journeys become shared acceptance criteria.

## Architecture

Application boundaries, storage, APIs, authentication, environments, expected usage and maintainability. Capacity follows requirements. Cloud & DevOps operates supporting infrastructure; AI interpretation/retrieval/reasoning/agent features require distinct scope and evaluation.

## Integrations

System of record, data ownership, APIs, permissions, mapping, synchronization, error handling and duplicate prevention. Application integrations belong here; Odoo-specific connections remain ERP work; workflow orchestration across adequate tools remains Business Automation. No universal vendor support claim.

## Testing / UAT

Critical journeys, rules, permissions, integration flows, representative data and edge cases. Browser/device and performance checks follow scope. KP investigates issues; nominated client users validate intended work and accept against agreed criteria. Review unresolved issues, deployment, data movement and recovery before release.

## Client Responsibilities

Business/process owner, decision-maker, subject experts, representative data, appropriate system access, testing users, feedback, scope approval and acceptance decisions. Described as shared delivery responsibilities.

## Cost / Scope

Drivers: workflows, roles, UX, integrations, data quality/migration, access/security, tests, deployment and support. New roles, integrations or acceptance conditions can change effort, cost and timing; review priorities before adding work. No invented prices, deadlines or contractual change policy.

### Delivery process

Preserves all five titles, stage numbers, keys and order. Each stage now states KP work, client participation and a checkpoint, with three concrete deliverables. Removes all unsupported fixed duration fields and unscoped Ongoing label. UAT fits the existing Testing & Deployment stage; no artificial sixth stage.

## Ownership / Handover

Exact body wording:

> Project agreements should define code and repository access, third-party dependencies and licenses, deployment ownership, credentials, documentation, handover responsibilities and ongoing support. Intellectual-property rights depend on the agreement and applicable licenses; ownership of all source code is not assumed.

> Handover should leave named owners able to access the agreed repositories and environments, understand configuration and integration dependencies, and follow operating guidance. Confirm what has been delivered, what remains in the backlog and who is responsible for running the application.

This is delivery transparency, not a universal source-code/IP guarantee. The FAQ retains the same limitation.

## Support

Scoped issue investigation, technical maintenance, integration changes, deployment support, monitoring coordination and small improvements. Larger features use the backlog. Hours, response arrangements and responsibilities are agreed; no lifetime, unlimited or 24/7 promise.

## Proof

All five approved cases reviewed. Preserved the existing three-card set:

| Case | Relevance and placement |
|---|---|
| `/work/collaboration-platform-distributed-teams/` | Existing featured multi-user product example; title/excerpt unchanged |
| `/work/digital-banking-platform/` | Existing application/interface and integration example; smaller card |
| `/work/omnichannel-ecommerce-platform/` | Existing custom frontend and system-integration example on a configured commerce platform; smaller card, not described as an entirely from-scratch platform |

This existing compact set covers different application/integration work without adding the fourth AI/property example or the Cloud cost case. No duplicated body links, new client facts, metrics or broad enterprise-scale claims.

Published case claims, including the featured collaboration excerpt's adoption/revenue figures and any metrics on linked pages, remain in the **Step 9 proof-substantiation backlog**. They are not treated as typical outcomes or proof of every service capability. All case documents are unchanged.

## FAQs

**5 → 10**.

Before:

- When should we build custom software instead of using off-the-shelf tools?
- Can you build internal dashboards, portals, and workflow tools?
- Do you integrate custom software with our existing systems?
- Can you start with an MVP before building the full system?
- Who owns the custom software after development?

After:

- When should we build custom software instead of buying a tool?
- What types of custom software do you build?
- Can you integrate with our existing systems?
- Can we start with an MVP?
- How do you define scope and handle changing requirements?
- How do testing and UAT work?
- What affects custom software cost and timeline?
- Who manages hosting and deployment?
- How are ownership and handover handled?
- What happens after release?

Visible FAQ content and FAQPage must match exactly; focused audit verifies equality. Scope/change, cost, UAT, hosting and support now answer practical purchasing questions alongside the useful existing topics.

## Internal Links

Preserves the exact Step 4 resource block linking `/insights/what-is-custom-software/` and `/insights/database-design-best-practices/`. No mechanical addition of architecture/MVP articles and no article edits. The three existing proof references and original contact/services CTAs remain unchanged. Adjacent service boundaries are explained without introducing unnecessary link duplication.

## Schema

Custom Software alone gains `serviceArea: "Worldwide"`, using existing field/query/template support and the authorized global business positioning. H1, Service name/serviceType and breadcrumbs use the new title; approved description and canonical remain unchanged. Ten FAQs feed visible content and schema.

ERP, Business Automation and Cloud remain Worldwide with unchanged page content. AI retains the existing Country/India behavior and is not optimized. Existing navigation/cards/service-reference labels naturally follow the changed Custom Software title.

## Claims Avoided

- No universal code/IP ownership or third-party-license guarantees.
- No bug-free/zero-defect/100% coverage claim, fixed delivery duration or guaranteed ROI.
- No security certification, compliance, award or partner claim.
- No project/client/country counts, satisfaction figures, funding/revenue claims or new result metrics.
- No unlimited changes, lifetime support, 24/7 support or invented SLA.
- No broad enterprise modernization or universal vendor-integration claim.

## Future Page Decisions

| Candidate | Decision | Reason |
|---|---|---|
| Internal Tools | KEEP ON PARENT | Core operational software type; same discovery and delivery journey |
| SaaS Development | KEEP ON PARENT | Supporting multi-user product capability; no distinct evidenced offer requiring a separate owner |
| Portal Development | KEEP ON PARENT | Role-based access/interface use case within custom applications |
| Software Integration | KEEP ON PARENT | Application/data integration capability; retains ERP and workflow boundaries |
| MVP Development | KEEP ON PARENT | First-release scoping approach; educational MVP article remains separate |
| Custom ERP Development | KEEP ON PARENT | Conditional custom operational build where a configurable platform is inadequate |
| Legacy Modernization | REMAIN P2 | Limited replacement mention fits parent; a distinct modernization practice needs stronger proof and commercial depth |

No new page, URL or cost article. Step 5 classifications and Step 6 ownership decisions remain preserved.

## Tests

Authenticated production build: **PASS**, 1m 31s. Full Node suite: **83 tests passed, 0 failed, 0 skipped**. An initial negative test exposed a percent-sign word-boundary issue in the new IP-guarantee detector; the detector was fixed and the complete suite rerun successfully. Page content did not require a change.

- Step 1C: 57 HTML files, 56 sitemap pages and five public case studies; no dead or legacy links.
- Step 2: nine approved metadata targets; zero errors.
- Step 3: 56 pages and 358 images; no H1, hierarchy, alt, duplicate-ID or empty-button problems.
- Step 4: 56-page internal-link audit; zero errors.
- Step 7A/7B/7C: all focused audits passed with nine FAQs each.
- Step 7D: buyer content, ten FAQs/schema equality, metadata, proof, IP/claim checks and service area passed.
- Local HTTP: 56 pages, 32 redirects, 63 removed-project checks, six restored insights and three sample-marketing 404 variants; zero errors.
- Redirect verifier and strict static UI audit passed.
- Chrome preview: desktop 1440×1000 and mobile 390×844, no overflow/broken images; process tab click/ArrowRight and ownership FAQ passed.
- `git diff --check` passed.

Evidence is in `step-7d-evidence/`.

## Regression

Steps 1–7C automated checks passed. CMS verification confirmed only the authorized Custom Software document fields changed across all 41 checked content documents; case studies and articles were preserved. Prior service audits retained; only explicit Custom Software area-served/H1 expectations change. Metadata fixtures, redirects, sitemap architecture and Step 4 relationships are unchanged.

## Deployment

Release commit: `e4c20adcae5e6d57ce00c1b86e299b62769c382d`, normally pushed from the clean main checkout. Worker: `website`. No application/template changes outside CMS content.

Manual deployment:

- ID: `f1e5a3b5-6826-48e6-9b0e-94ea9039f5ef`.
- Version: `2981ed5d-c139-4bba-9fd2-72b730d39909`.
- Timestamp: `2026-09-18T14:43:09.32341Z` (18 September 2026, 20:13:09 IST).

Active deployment verified on 20 September 2026:

- ID: `fb064101-19c5-4900-9a6a-d7a200011dfc`.
- Version: `52acc42b-7ba8-42de-887b-01b8427fb882`, 100%.
- Timestamp: `2026-09-18T14:44:40.824423Z` (18 September 2026, 20:14:40 IST).

The original deployment had completed before the pause. On continuation, live output matched the tested build. Wrangler refreshed its expired session to read deployment records; no repeat deployment was needed. Final report and verification evidence are committed separately. No credentials are included.

## Production Verification

**PASS, verified 20 September 2026.** Custom Software returns HTTP 200, is indexable, has one H1 and the correct canonical, visible buyer content, three existing proof cards, two educational links, ten matching FAQ/schema entries and Worldwide service area.

Approved metadata remains exact:

- Title: `Custom Software Development Company | KP Infotech`.
- Description: `Build custom business software, internal tools, portals, SaaS products and integrations that replace manual work and improve operational visibility.`

Chrome desktop 1440×1000 and mobile 390×844 checks showed no horizontal overflow or broken images. The build/buy/configure section was reviewed on mobile; the ownership FAQ opened. Keyboard activation reached `/contact/` and the featured collaboration case. The case navigation initially exceeded the wait timeout but the subsequent DOM/URL check confirmed the correct destination. Viewport reset; no forms submitted.

Full production checks: 56 sitemap pages matched tested build headings, images, tables and links while preserving metadata; 32 redirect checks, 63 unsupported-case checks, robots and all three sample-marketing 404 variants passed. Six restored insights and five approved cases remain available. Step 4 production graph passed. ERP, Automation, Cloud and AI main content is preserved; all five case main contents are preserved, allowing only the exact existing Custom Software service-reference anchor label to update naturally.

CMS verification checked 41 content documents and found only the authorized Custom Software fields changed. No Step 7E work or new URL.

Evidence files: `production.json`, `preservation.json`, `step1-production.json`, `step2-production.json`, `step4-production.json`, `erp-production.json`, `automation-production.json`, `cloud-production.json`, `software-production.json`, `browser-verification.json`, `cms-verification.json` and `deployment.json` in `step-7d-evidence/`.

## Exact Final Copy

Full structured after-snapshot: `step-7d-evidence/software-after.json`. Readable copy follows for SEO review.

### Hero

Custom Software Development Services

KP Infotech designs and builds custom business software for companies whose workflows no longer fit spreadsheets, disconnected tools or off-the-shelf products. We create internal tools, business applications, portals, SaaS MVPs and integrations around the operational capabilities your team needs.

### Body

What custom software development includes

#### When custom software is the right fit

Custom software development services are useful when a business-critical workflow, interface or data model cannot be supported adequately by existing products. Typical starting points include spreadsheets acting as the operational system, repeated reconciliation between applications, or customers and partners needing a dedicated place to request work and see its status.

The goal is less manual work, clearer operational visibility and software your team can maintain. If the process is still changing or requirements are unclear, start by defining the problem and testing a smaller scope. Writing a new application too early can make an unsettled process harder to improve.

#### Build, buy, configure or automate?

Use existing software. Choose a standard product when it meets the important requirements and its operating costs and constraints are acceptable.

Configure a platform. Odoo or another configurable platform may already support the operation with reasonable adaptation. Implementing Odoo belongs in an ERP engagement; a new custom system should not duplicate capabilities a suitable platform already provides.

Automate existing tools. When the core applications are adequate but people manually move information or chase approvals, Business Automation can coordinate those handoffs across tools and rules.

Build custom software. Choose a new application when a distinct workflow, user interface, data model or product capability is necessary. Compare the value of that fit with the work needed to build, operate and maintain it.

#### Types of software we build

Internal tools and admin systems. Staff applications for approvals, reporting, data reconciliation, task coordination and operational tracking. Internal tool development centers on the people doing the work: the information they need, the actions they can take and the exceptions they must resolve.

Business applications and operational systems. Custom business software for department-specific workflows, shared records and management visibility. A system may include ERP-like functions when a suitable packaged platform does not fit. Replacing an old internal tool starts with understanding its data, dependencies and the work it still needs to support.

Customer, partner and vendor portals. Dedicated interfaces for requests, orders, document exchange, status visibility and reporting, with access appropriate to each user’s role. Portal scope depends on which records users can see or change and how their actions reach the internal team.

SaaS products and MVPs. Focused multi-user products that start with a validated business problem and core user journeys. We define the minimum useful release, choose architecture appropriate to the current stage and test the experience before expanding the feature set.

Application and API integrations. Connections and, where appropriate, custom middleware between the application and existing business systems. Integration work accounts for data ownership, interface availability and what happens when an exchange fails.

Web and mobile-friendly interfaces. Responsive access for staff, customers and field teams where their tasks require it. Supported browsers and devices are part of project scope and acceptance rather than an assumption that every interface is needed.

#### Discovery and requirements

We map the business problem, current workflow, users and roles before deciding what to build. Discovery covers existing systems, data sources, business rules, permissions, exceptions, integration needs and reporting. Relevant performance, availability and operating constraints are recorded alongside functional requirements.

KP and your process owners turn this into a prioritized scope, representative user journeys and acceptance criteria. Examples of real work and edge cases help reveal missing decisions early. The checkpoint is agreement on the problem, the first useful release and how its behavior will be accepted.

#### Architecture and maintainability

Architecture defines application boundaries, data storage, APIs, authentication, permissions and environments. We consider expected usage, operational requirements and the people who will maintain the system. Capacity planning follows the workload; complexity is added where a requirement justifies it.

Custom Software builds the application. Cloud & DevOps covers the infrastructure used to deploy and operate it, with those responsibilities agreed together when needed. If a feature requires AI interpretation, retrieval, reasoning or bounded agent actions, that capability needs its own defined scope and evaluation rather than being assumed in every application.

#### Data and system integrations

For each integration, identify the system of record and who owns the data. Review available APIs, access permissions, field mapping, synchronization direction and timing, error handling and duplicate prevention. We confirm what the existing system can reliably expose before committing to an integration design.

Application/API integration is part of custom software when it supports the new application. Odoo-specific connections sit with ERP implementation; coordinating repeatable processes across otherwise adequate existing tools sits with Business Automation. Your system owners help validate mappings, exceptions and recovery from failed exchanges.

#### Testing and user acceptance

Acceptance checks cover critical user journeys, business rules, permissions, integrations and representative data, including relevant edge cases. Browser/device coverage and performance checks follow the agreed requirements. KP investigates issues and presents the working release for review against those checks.

Your nominated users carry out user acceptance testing, confirm that the software supports the intended work and identify gaps. Release readiness includes reviewing unresolved issues, deployment steps, data movement where needed and recovery arrangements. Acceptance is based on agreed behavior, not a promise of defect-free software.

#### Practical security responsibilities

Project planning should address authentication, role-based authorization, input validation, secrets handling, dependency management and environment separation. Limit access to the people and systems that need it. Agree backup and recovery responsibilities where the application stores operational data; specialist security requirements need explicit scope and validation.

#### What your team provides

A business/process owner and decision-maker keep priorities clear. Subject-matter experts explain the work, provide representative data through agreed access methods and help review exceptions. Existing-system owners support integration access; testing users provide feedback and acceptance decisions. Scope approval and timely review checkpoints make delivery decisions visible to both teams.

#### Scope, cost and delivery planning

Cost and timing depend on user roles, workflows, UX complexity, integrations, data quality and migration, access requirements, testing, deployment and support. We use discovery to distinguish what is essential for the first release from what can wait. No fixed price or delivery duration is assumed before the scope and dependencies are understood.

New requirements, integrations, roles or acceptance conditions can change the work involved. Discuss the effect on scope, cost and timing before adding them to delivery, and agree the revised priorities. A visible feature backlog helps keep improvements connected to the operational problem.

#### Ownership and handover

Project agreements should define code and repository access, third-party dependencies and licenses, deployment ownership, credentials, documentation, handover responsibilities and ongoing support. Intellectual-property rights depend on the agreement and applicable licenses; ownership of all source code is not assumed.

Handover should leave named owners able to access the agreed repositories and environments, understand configuration and integration dependencies, and follow operating guidance. Confirm what has been delivered, what remains in the backlog and who is responsible for running the application.

#### Support after release

Agreed support can cover issue investigation, technical maintenance, integration changes, deployment support, monitoring coordination and small improvements. Larger features are reviewed through the backlog. Support scope, hours and response arrangements are defined for the engagement.

Before defining a project, use our custom software guide and database design best practices to clarify fit and data requirements.

### Process

#### Discovery & Workflow Mapping

KP maps workflows, roles, data, rules and exceptions with your process owners. Your team provides representative examples and existing-system knowledge. Together we confirm the first-release scope and acceptance criteria before planning the solution.

- Workflow and requirements map
- Prioritized scope and acceptance criteria
- Client-approved discovery checkpoint

#### Architecture & Product Planning

KP defines the user journeys, application boundaries, data model, integrations and access approach. Your decision-makers review the proposed experience, dependencies and delivery priorities before approving the plan.

- Solution and user-journey plan
- Architecture, data and integration plan
- Approved release scope

#### Agile Development

KP builds working modules with code review, regular demos and agreed testing. Your team reviews the behavior against requirements and helps resolve questions; new requirements are assessed for their effect on scope before priorities change.

- Working modules and progress demos
- Reviewed changes and test findings
- Agreed feedback and updated priorities

#### Testing & Deployment

KP tests critical workflows, permissions, integrations and relevant device/performance requirements. Your users perform UAT and accept the release against agreed checks. Deployment and any data-movement or recovery steps are reviewed with the responsible owners.

- Test results and issue review
- Client UAT and release acceptance
- Agreed deployment and recovery plan

#### Support & Iteration

KP provides the agreed documentation and handover, then investigates issues and plans improvements within the support scope. Your owners confirm repository/environment access, operating responsibilities and the priority of future work.

- Documentation and access handover
- Accepted operating and support responsibilities
- Prioritized improvement backlog

### FAQs

#### When should we build custom software instead of buying a tool?

Build when an important workflow, interface or data model does not fit suitable existing products. If a standard tool, Odoo configuration or automation across current systems meets the need, that may be the more practical choice. Clarify an unstable process before committing to a build.

#### What types of custom software do you build?

We build internal tools, business applications, customer and partner portals, SaaS MVPs and application integrations. The scope follows the users, operational tasks and data involved, including responsive interfaces where they are needed.

#### Can you integrate with our existing systems?

We assess API availability, permissions, data ownership, mapping and synchronization needs before agreeing an integration. Error handling and duplicate prevention are part of the design. Odoo-specific integrations belong with ERP work; cross-tool workflow orchestration may suit Business Automation.

#### Can we start with an MVP?

Yes. For a new product or uncertain workflow, define the core user journeys and minimum useful scope, test them with intended users and use the findings to prioritize expansion. The first release should validate the problem and approach without assuming the full future platform.

#### How do you define scope and handle changing requirements?

Discovery turns workflows, roles, data, rules, exceptions and integration needs into a prioritized scope and acceptance criteria. When requirements change, review their effect on effort, cost and timing before agreeing revised delivery priorities.

#### How do testing and UAT work?

KP tests the agreed behavior, including critical journeys, permissions, integrations and representative data. Your nominated users validate the application against acceptance criteria. Unresolved issues and deployment readiness are reviewed before release acceptance.

#### What affects custom software cost and timeline?

Key factors include workflows, user roles, UX and data complexity, integrations, security requirements, testing, migration, deployment and support. Estimates depend on the agreed scope, dependencies and required validation; a generic duration would not reflect those differences.

#### Who manages hosting and deployment?

Application delivery and infrastructure operations have different responsibilities. We agree the hosting environment, deployment access, release steps and operating owner during planning. Cloud & DevOps work can support deployment and operations when included in the engagement.

#### How are ownership and handover handled?

The project agreement and applicable third-party licenses determine intellectual-property rights. Agree repository access, dependencies, documentation, deployment ownership, credentials and support responsibilities explicitly. The page does not promise ownership of every component or all third-party code.

#### What happens after release?

The agreed handover covers access, documentation, operating responsibilities and the remaining backlog. Further support can include issue investigation, maintenance, integration changes and improvements within the agreed scope. Hours and response arrangements are defined separately.
