# Step 7E — AI Automation & Agents money page

Status: **PASS WITH WARNINGS**. Published and production-verified. The warnings are evidence limitations: no verified public production action-taking-agent case, and the existing case-claim review backlog. No technical acceptance check remains failed or pending.

Scope: only `/services/ai-automation-agents/`. No new service or insight page. No Step 8 work. Clean release checkout `/private/tmp/kp-step7e-release`, based on main `bf59a95`. The original mixed working checkout was not used to build or deploy.

## Before

The page returned HTTP 200 with one H1, “AI Automation & Agents”. Its hero said KP builds AI agents to process documents, answer operational questions, summarize data, route tasks and support customers. The opening definition treated all AI workflows as agents and included updating systems without distinguishing read access, proposals and writes.

Five existing use-case groups covered internal operations assistants, document processing, customer support/sales, reporting/insights and workflows. Guardrails mentioned approved sources, access roles, review, logs and fallback, but offered little buyer guidance on suitability, evaluation acceptance, permission boundaries or operating ownership. Knowledge coverage mentioned internal sources; RAG appeared in technologies without a useful explanation. Document processing lacked a complete validation/review/handoff sequence. Five process stages included generic durations and an ROI estimate. Five FAQs gave broad capability and data-safety answers, including an unqualified assurance that no technical staff were needed.

The existing educational link was the business process automation tools guide. Related work comprised the property listing and commerce personalization cases. Existing CTA labels: Discuss Your Project → `/contact/`; All Services → `/services/`; Start a Conversation → `/contact/`. Schema: Organization, BreadcrumbList, Service and FAQPage. `serviceArea` was unset, rendering the historical India Country default.

CMS content inventory: 679 words before; 2,087 after. This count excludes navigation/footer, CTA, durations and related-case content. It was recorded to prevent duplication, not used as a target. The full snapshot and rendered inventory are in `step-7e-evidence/ai-before.json` and `inventory-before.json`.

### Source audit

| Output | Source |
|---|---|
| CMS document | `service`, ID `414efdd8-f4ce-4d84-bdaa-a28b7b4fa652`; slug `ai-automation-agents` |
| Query and schema | `src/lib/queries.ts` → `serviceBySlugQuery`; `sanity/schemas/service.ts` |
| H1 and hero | `title` and `excerpt` through `ServiceHero.astro`/`PageHero.astro`; tagline is fallback |
| Opening and capability blocks | `contentHeading` and Portable Text `content`, rendered by `ServiceContent.astro`; capabilities are in the body, not a separate field |
| Process | `processHeading` and five `process` objects through `HowWeBuild.astro` |
| Technology list | `techHeading` and `technologies` through `ServiceTechMarquee.astro` |
| FAQ | `faqHeading` and `faqs` through `ServiceFAQ.astro`; same records generate FAQPage |
| Related insights | Existing `step4resources` Portable Text internal reference; no separate related-insights section |
| Related work | Two `relatedWork` references and `workHeading` through `ServiceWork.astro`; approved-case filtering retained |
| Service/Breadcrumb schema | `src/pages/services/[slug].astro`, with helpers from `src/lib/seo.ts`; Service name/type follow title, description follows approved SEO description |
| Area served | Existing page-scoped `serviceArea` overrides historical fallback |
| CTA | Hero actions in `ServiceHero.astro`; closing CTA passed to shared `CTASection.astro` from service page |

No shared component, frontend query, schema definition, stylesheet or template changed. The Sanity and SEO/AEO skills informed structured-content preservation and claim discipline. Technical terminology was cross-checked against [Anthropic’s workflow/agent distinction](https://www.anthropic.com/engineering/building-effective-agents); that source is conceptual guidance, not proof of KP delivery.

## After

The page now gives buyers a direct service definition, a bounded starting point, AI fit/no-fit guidance, precise rules/workflow/model/agent distinctions, five scoped use-case groups, document and knowledge workflows, access and human approval controls, evaluation, failure handling, monitoring, neighboring-service boundaries, client responsibilities, cost drivers and accurate proof framing. Existing components render the expanded content.

Eight CMS fields changed: `title`, `excerpt`, `contentHeading`, `content`, `process`, `faqs`, `workHeading`, `serviceArea`. The update compared the full current snapshot, checked its revision and used `ifRevisionId` with a field-specific patch. Metadata, URL, tagline, images, technologies, section headings other than content/work, Step 4 resource block and related-work references were preserved.

## H1

Before: **AI Automation & Agents**.

After: **AI Agent Development & Automation Services**.

One H1; natural service intent matching the approved title. No company-ranking claim or synonym stacking.

## Direct Answer

> KP Infotech designs AI-assisted workflows and bounded AI agents for business tasks that require interpretation, retrieval, classification or controlled actions across operational systems. Not every automation problem needs AI; important actions remain subject to agreed human approval.

## AI Fit

AI is scoped to variable text, classification, extraction, summaries, retrieval and context-dependent requests. Rules, ordinary integrations and search remain valid alternatives. Unacceptable uncertainty, unsuitable data access and unclear processes can produce a no-go decision.

## Rules vs AI

Rules follow a known trigger, condition and action. Workflow automation coordinates people, data and approvals. AI-assisted automation adds a model step. A bounded agent selects from permitted next actions and returns results/status under explicit controls. A summary or response alone is not described as an agent. Business Automation retains deterministic workflow ownership.

## Use Cases

Five existing groups remain, with restrained labels: document processing, internal knowledge assistance, operational task assistance, reporting/information synthesis, and customer/support assistance. Customer-facing outputs are governed by review and escalation rules. No list of speculative autonomous agents was added.

## Document AI

Agreed sources/types → extraction/classification → field/format/business-rule validation → meaningful quality checks → human exceptions → structured output → downstream handoff. Format, language and scan-quality support is established per workflow. Fixed-rule creation/routing stays with Business Automation.

## Knowledge / RAG

Approved sources, source permissions, retrieval relevance, document updates and optional implemented references are explained. Evaluation includes stale/conflicting/denied sources and unanswerable questions. Retrieval is not represented as a guarantee of factual correctness.

## Tool Access & Human Approval

Read-only or proposal-first scope; least-necessary permissions and explicit action sets. Writes are a separate feasibility, scope, testing and approval decision. People review uncertain extraction, confirm generated content and approve sensitive financial/customer changes. Named owners can resolve exceptions, override, revoke access or stop workflows. Credentials are kept out of prompts and user-facing output; logging is qualified by system support. The page explicitly avoids presenting public AI-feature cases as production ERP/CRM-writing proof.

## Evaluation

Representative examples and expected outputs/actions are agreed with client experts. Quality criteria cover normal, ambiguous, invalid, missing-context and failure cases, retrieval relevance, unanswerable questions, tool restrictions, denied access and approvals. Client acceptance gates release; changes to prompts, models, sources or workflow logic require regression checks. No invented benchmark or numerical accuracy target.

## Failure Handling

Incorrect interpretation, unsupported answers, wrong tools, unexpected formats and unavailable APIs are acknowledged. Validation, restricted permissions/actions, stop/unresolved statuses, review routes and supported logs give failures an owner. Errors remain possible.

## Monitoring

Engagement-scoped reviews may include failures, tool/API errors, review/approval rates, quality feedback, unexpected output, cost, latency, provider changes and source freshness. The operational owner, cadence, hours and response responsibilities are agreed. No 24/7 promise.

## Client Responsibilities

Business owner, subject-matter experts, representative examples, approved access, system/tool owners, sensitive-action rules, reviewers, acceptance criteria, feedback and an after-launch operational owner are explicit.

### Process preserved and strengthened

The same five stage titles, keys, order and step numbers remain. Each has KP duties, client inputs, evaluation and a proceed checkpoint. Generic durations were removed, including “Ongoing”; monitoring is subject to scope.

- **Use Case Discovery** — KP maps one candidate task, its risks and simpler alternatives. Your business owner and experts provide examples and success criteria. We evaluate whether AI adds value and whether the data is suitable; proceed only with an agreed bounded use case.
- **Agent & Guardrail Design** — KP designs the data access, permitted tools, review points and failure paths. Your system owners approve sources and sensitive-action rules. We check the proposed permissions and responsibilities; build starts when those boundaries are agreed.
- **Build, Test & Evaluate** — KP builds the scoped workflow and tests representative, ambiguous and failing cases. Your experts review outputs and actions against the acceptance criteria. We evaluate retrieval, restrictions and approvals where relevant; release waits for agreed acceptance or a narrower scope.
- **Deploy & Train** — KP prepares the release, operating notes and agreed monitoring. Your reviewers and operational owner rehearse approvals, exception handling and stopping the workflow. We check access and release readiness; launch follows acceptance of the handover and operating responsibilities.
- **Monitor & Improve** — Within the agreed support scope, KP reviews quality feedback, failures and provider or workflow changes. Your operational owner supplies feedback and prioritizes issues. Re-evaluate changed behavior before release; expansion requires evidence from the first use case and a new scope decision.

## Cost / Scope

Drivers include workflow complexity, sources, document volume, model/provider usage, retrieval/indexing, integrations, permissions, evaluation, human review, latency, monitoring and support. No prices, universal timeline or automatic cost-saving claim. Expansion follows evaluation of the first bounded use case.

## Proof

All five approved case studies were reviewed; the same two AI-adjacent references were retained:

- [3D Virtual Tours & AI Property Listing Platform](https://kpinfo.tech/work/virtual-tours-ai-listings/) — AI-assisted listing content and recommendation features; first featured card remains.
- [Omnichannel E-Commerce Platform with AI-Powered Personalization](https://kpinfo.tech/work/omnichannel-ecommerce-platform/) — personalization; second card remains.

“AI Automation Examples” became **“AI Feature Examples”**. The page states what these cases demonstrate and what they do not. No unrelated case was added. Collaboration, banking and cloud case documents remain untouched.

**Verified production action-taking-agent proof gap remains.** The cases do not establish autonomous agents, multi-agent orchestration, ERP/CRM writes, safe agent tool use, mature RAG evaluation or large-scale agent monitoring. This is a substantive evidence limitation, not solved by adding service copy. Existing case metrics remain verbatim in their approved documents/cards and remain part of the prior claims-review backlog; none was introduced or generalized into AI service copy. Step 6’s near-absence of returned non-brand commercial signal is historical research evidence, not a claim about current ranking or market demand.

## FAQs

Before: 5. After: 10 unique buyer questions. Capability, integration and error/data questions were clarified; the absolute no-technical-staff answer was replaced by operational ownership. New answers cover definitions, fit, actual review decisions, evaluation, uncertain outputs, cost/timeline and after-launch scope. Visible answers and FAQPage JSON-LD use the same CMS strings and are checked for exact equality.

## Internal Links

The original `step4resources` block is byte-for-byte structurally preserved: [business process automation tools guide](https://kpinfo.tech/insights/business-process-automation-tools/). Both case references and the CTA destinations remain. No new service/insight URL or new keyword-owner page. The revised AI title flows through existing dynamic service-card/footer/reference labels; other pages’ editorial content is unchanged. Existing Step 4 contextual links retain their destinations and anchors.

## Schema

Approved title: `AI Agent Development & Automation Services | KP Infotech`.

Approved description: `Build AI agents and automation for document processing, operational knowledge, task routing and repetitive workflows with human oversight.`

Canonical remains `https://kpinfo.tech/services/ai-automation-agents/`. Service name/type and final Breadcrumb label follow the updated H1. Service description remains the approved description. FAQPage has ten matching answers. `serviceArea: Worldwide` uses the existing page-scoped field; all five primary service pillars now render Worldwide. Organization identity is unchanged. No reviews, ratings, certification or location pages were added.

## Claims Avoided

- Unrestricted autonomy, autonomous-workforce or human-replacement positioning.
- Production ERP/CRM-write, multi-agent or RAG-evaluation proof unsupported by cases.
- Universal OCR/file/language support, perfect accuracy or error-free/hallucination-free answers.
- Certification, compliance, “secure enterprise RAG” or private-model guarantees.
- Zero retention, no training or regional processing claims without architecture/provider/contract evidence.
- Guaranteed savings, ROI, benchmark scores, prices, delivery durations or 24/7 monitoring.
- Best/leading/number-one provider claims.

## Future AI Page Decisions

| Topic | Decision | Reason |
|---|---|---|
| AI Agent Development | KEEP ON PARENT | Existing page is the primary commercial owner |
| AI Workflow Automation | KEEP ON PARENT | Same buyer task; distinguish deterministic workflows |
| Document Processing AI | KEEP ON PARENT / conditional P2 | Need verified document/evaluation/review proof before reconsidering a split |
| Knowledge Assistants / RAG | KEEP ON PARENT / conditional P2 | Need permission-aware retrieval, freshness and evaluation evidence |
| AI Integration | KEEP ON PARENT | Enabling capability within scoped agent/AI delivery |
| Multi-Agent Systems | DO NOT TARGET standalone | No demonstrated differentiated buyer need or KP proof |

Zero pages created or reserved by this step.

## Future Informational Gap

**REMAINS P3 INFORMATIONAL GAP.** Essential buyer-level controls and evaluation are now on the parent. A detailed production-agent-controls guide could still serve an engineering reader, but only after an original reproducible example, permissions/approval design, evaluation cases, redacted traces, failure handling and operational evidence exist. No guide was drafted or published; no Step 8 work began.

## Tests

- Authenticated production build: PASS, 1m 27s.
- Full test suite: **87 passed, 0 failed, 0 skipped** (four focused Step 7E tests).
- Negative regression checks reject FAQ mismatch, unrestricted-autonomy claims, accuracy guarantees, certification claims and generalized metrics.
- Step 1 build audit: 57 HTML files, 56 sitemap pages, five approved case studies, no dead/legacy internal links.
- Local Worker Step 1: 56 pages, 32 redirect checks, 63 removed-project checks, all three sample-marketing variants 404; robots/sitemap checks pass.
- Six restored insights: HTTP 200, correct canonical/schema; 32 associated redirect checks pass.
- Step 2: nine approved metadata targets pass.
- Step 3: 56 pages, 358 images, no missing alt, heading hierarchy, duplicate-ID, empty-button or empty-body findings.
- Step 4: 56-page link graph, no errors.
- Step 7A/7B/7C/7D/7E audits: PASS.
- CMS comparison: 41 relevant published documents checked; exactly one changed document, limited to the eight authorized fields.
- Strict static UI audit: no findings. Deployment dry run and final whitespace checks: PASS.

Prior tests expecting India for AI were updated solely for the authorized Step 7E global scope. Their coverage remains; other service schema assertions are unchanged.

## Regression

Steps 1–4 architecture, redirects, metadata, semantics and links were rechecked. Steps 5–6 classifications/ownership and reports were not changed. ERP, Business Automation, Cloud and Custom Software CMS documents are identical, including H1, hero, body, FAQ, metadata and service area. Their schema and main-copy preservation are checked against the pre-edit capture. All five case documents remain unchanged; only a dynamic AI service-reference label may follow the new title. No shared-template edit.

## Deployment

Application/content release commit: `f7ebda78fb179b34af12eab3d198046724c41f07`, normally pushed to `origin/main` from the clean release checkout. Authenticated build deployed through the existing Cloudflare Worker `website` workflow.

| Record | Value |
|---|---|
| Manual deployment ID | `8ab34c99-b238-4590-b620-65f57c55340f` |
| Manual version | `ea98802d-5819-4d2d-b4c5-7dfaa25a94d3` |
| Manual deployment time | `2026-09-20T08:02:29.822684Z` (13:32:29 IST) |
| Subsequent automatic deployment ID | `afa0625e-0891-4f5a-9aa0-2ebfc1f146f5` |
| Active version at production verification | `35bc8ae5-e5c3-4583-bd40-6e43f576a462` at 100% |
| Automatic deployment time | `2026-09-20T08:03:32.897932Z` (13:33:32 IST) |
| Production | `https://kpinfo.tech` |

The full 56-page match and Step 1 production smoke test were rerun after the automatic rollout; both passed. Final report/evidence are recorded in a separate documentation commit. A documentation push can trigger another equivalent build; deployment identifiers above identify the versions actually checked, not a promise that the ID never changes.

## Production Verification

**PASS.** Live AI page: HTTP 200, indexable, unchanged approved title/description/canonical, one expected H1, all buyer sections, ten visible/schema-matched FAQs, two original proof cards, working contact CTA and Worldwide Service scope.

Desktop at 1440×900 and mobile at 390×844 were visually checked. Both had zero horizontal overflow and zero broken images. Mobile human-approval FAQ expansion passed; process tab 04 followed by ArrowRight selected 05 with the expected content. The featured property-case link opened the correct case; Start a Conversation opened `/contact/`. Viewport override was reset. No form was submitted.

All 56 sitemap pages returned 200 and matched the built headings, images, tables and link structure after the latest automatic rollout. Approved metadata matched the baseline; no semantic errors. Main-copy preservation passed for four other services and five cases, allowing only the exact dynamic AI service-reference label update. The four other services’ H1, title, description, canonical and complete schema remained exact.

The production smoke included homepage, four other pillars, six restored insights, five cases, sitemap, robots, 32 redirect checks and 63 removed-project checks. All three sample-marketing URL variants remained 404. The production internal-link graph had no errors. Final CMS comparison at `2026-09-20T08:06:03.857Z` still showed only the intended AI document changes.

Tooling note: the older Step 1E command rejects non-local origins by design. It passed locally; production article/redirect verification used the production-capable Step 1G audit and the full 56-page verifier. This was an audit invocation limitation, not a website failure.

Evidence is retained alongside this report in `step-7e-evidence/`, including before/after snapshots, inventories, build/test output, local and production audits, preservation results, browser checks and sanitized deployment records.

## Final visible copy

The exact final hero is above. Body, process and FAQs below are included for independent SEO review.

### Body

Start with one document type, one knowledge domain or one team task. We scope the data, permitted actions, review points and acceptance criteria before building, then evaluate whether the workflow is useful enough to launch or expand.

### When AI is the right fit

AI can help when a task needs interpretation of variable text, document classification, information extraction, operational summaries or retrieval from internal knowledge. Contextual task routing may also benefit when fixed rules cannot cover the requests reliably.

Use a normal integration or rules-based workflow when the steps are predictable, and ordinary search or filters when they answer the question. AI may be unsuitable where accuracy requirements cannot tolerate model uncertainty, data access is inappropriate or the business process is not yet clear. Discovery can lead to a simpler solution or a decision not to proceed.

### Rules-based automation vs AI agents

Rules-based automation. A known trigger meets a defined condition and runs a defined action, such as routing an approved request to a named team.

Workflow automation. Coordinates tasks, data and approvals across people and systems. This is the focus of our Business Automation service; adding a model is optional.

AI-assisted automation. Uses a model to interpret, extract, classify or generate information inside a controlled process. A document summary or draft response alone is not an agent.

An AI agent. Receives context, uses a model to select a next step, accesses only permitted data and tools, and proposes or executes an allowed action. It returns a result or status within defined limits and approval rules. Not every workflow needs this ability to choose actions.

### AI use cases for business operations

Document processing. Extract, classify or summarize information from agreed document types, with exceptions routed to a reviewer.

Internal knowledge assistance. Help staff find answers in approved policies, procedures and operational references, subject to source access and freshness.

Operational task assistance. Interpret a request, prepare a task, suggest a next action or route work for approval. Any tool action needs a specific permitted scope.

Reporting and information synthesis. Combine available operational information into summaries for recurring reviews. People check the underlying figures and conclusions before decisions.

Customer and support assistance. Draft replies, summarize requests or assist lead qualification using approved information. Review and escalation rules determine what may reach a customer.

### Document processing with validation and review

We agree the input source and document types, define the fields or categories needed, then test extraction and classification against representative examples. Validation checks required fields, formats and business rules; quality or confidence checks are used where meaningful. Missing, conflicting or uncertain information goes to a reviewer before a structured output is handed to the next system.

Supported formats, languages and scan quality must be established for the specific workflow. Fixed-rule document creation and routing belong in Business Automation; this service covers the interpretation step when AI is justified.

### Knowledge assistants and RAG

Retrieval-augmented generation, or RAG, retrieves relevant material from approved sources to help a model answer a question. The design must respect source permissions, define how documents are updated and test whether retrieved context supports the answer. Source references can be included where implemented so staff can check the material.

We evaluate relevant, stale, conflicting and inaccessible sources as well as questions the material cannot answer. An assistant should acknowledge missing information or refer the user to an owner instead of presenting an unsupported answer as fact. Retrieval does not remove the need to evaluate outputs.

### Tool access and human approvals

Begin with read-only access or proposed actions for review. Each tool needs a defined purpose, a limited action set and the least-necessary permissions. Enabling writes is a separate scope decision, dependent on integration feasibility, testing and approval rules; our public AI feature cases do not establish a production ERP- or CRM-writing agent.

People review uncertain extractions, confirm generated content and approve sensitive financial or customer changes before execution. The design identifies who can resolve an exception, override a result, revoke access or stop a workflow. Keep credentials outside prompts and user-facing outputs, and record tool requests, approvals and outcomes where the connected systems support logging. Assign an owner for failed or incomplete actions.

### Data sources and access decisions

Your data and system owners approve the sources a workflow may use, the people who may access them and any sensitive fields that need exclusion or special handling. We map the information needed for each task and review access boundaries before connecting documents, databases or APIs.

Third-party models or APIs may receive information as part of the chosen design. Provider settings, hosting architecture and contract terms determine retention, data use, processing location and privacy arrangements. These need agreement for the actual implementation before sensitive sources are enabled.

### How we evaluate AI workflows

A successful API call is not enough: a model can return a valid-looking but incorrect answer. KP and your subject-matter experts agree representative examples, expected outputs or actions and quality criteria. Evaluation includes ambiguous or invalid input, missing context, conflicting information, retrieval relevance and questions that cannot be answered.

We test tool restrictions, denied access, approval requirements and failure paths alongside normal cases. Your reviewers assess results against the agreed acceptance criteria before release. Changes to prompts, models, sources or workflow logic need regression checks against those examples; an unresolved failure can narrow or stop the proposed rollout.

### Failure handling and monitoring

Incorrect interpretation, unsupported answers, wrong tool selection, unexpected output formats and unavailable APIs need explicit handling. Use validation and permission checks, restrict the action scope, and define whether an unsuccessful step stops, returns a clear status or moves to human review. Logs, where supported, help the owner investigate; these controls reduce exposure but errors can still occur.

After launch, the agreed monitoring scope can include workflow failures, tool/API errors, review and approval rates, user quality feedback, unexpected outputs, usage cost and latency. Assign owners to review model or provider changes and knowledge-source freshness. Support hours, review cadence and response responsibilities are agreed for the engagement.

### How AI fits with your existing systems

Choose this service when interpretation, retrieval or bounded model-selected actions are central. Business Automation coordinates deterministic handoffs and approvals. Custom Software covers general application and API engineering; ERP covers Odoo implementation and Odoo-specific integration; Cloud & DevOps covers infrastructure and runtime operation. A project may need more than one discipline, with responsibilities defined during discovery.

### What your team provides

Nominate a business owner, subject-matter experts and an operational owner for after launch. Provide representative examples, approved data access, tool and system owners, rules for sensitive actions and named reviewers or approvers. Agree acceptance criteria, make time to review outputs and supply feedback before expanding the workflow.

### Scope, cost and rollout planning

Scope and cost depend on workflow complexity, data sources, document volume, model/provider usage, retrieval and indexing needs, integrations, permissions and evaluation effort. Human review, latency requirements and ongoing monitoring or support also affect the plan. We establish these during discovery rather than assuming AI will reduce costs.

Launch decisions follow evaluation of a bounded first use case. Expand to another document type, knowledge domain or action only after its data, permissions, quality and operating responsibilities have been checked.

### What the related work demonstrates

The related property platform case describes AI-assisted listing content and recommendation features. The commerce case describes personalization. They illustrate AI features in larger applications; they do not demonstrate an evaluated action-taking business agent or a permission-aware RAG assistant.

Our business process automation tools guide explains where rule-based automation fits and when AI-assisted workflows need human review.

### Process

#### Use Case Discovery

KP maps one candidate task, its risks and simpler alternatives. Your business owner and experts provide examples and success criteria. We evaluate whether AI adds value and whether the data is suitable; proceed only with an agreed bounded use case.

Deliverables: Task and risk assessment; Representative examples and criteria; Agreed scope or no-go decision.

#### Agent & Guardrail Design

KP designs the data access, permitted tools, review points and failure paths. Your system owners approve sources and sensitive-action rules. We check the proposed permissions and responsibilities; build starts when those boundaries are agreed.

Deliverables: Data and tool permission map; Approval and exception rules; Approved implementation scope.

#### Build, Test & Evaluate

KP builds the scoped workflow and tests representative, ambiguous and failing cases. Your experts review outputs and actions against the acceptance criteria. We evaluate retrieval, restrictions and approvals where relevant; release waits for agreed acceptance or a narrower scope.

Deliverables: Working scoped workflow; Evaluation and failure findings; Acceptance decision and open issues.

#### Deploy & Train

KP prepares the release, operating notes and agreed monitoring. Your reviewers and operational owner rehearse approvals, exception handling and stopping the workflow. We check access and release readiness; launch follows acceptance of the handover and operating responsibilities.

Deliverables: Release and operating checklist; Reviewer training and handover; Launch readiness decision.

#### Monitor & Improve

Within the agreed support scope, KP reviews quality feedback, failures and provider or workflow changes. Your operational owner supplies feedback and prioritizes issues. Re-evaluate changed behavior before release; expansion requires evidence from the first use case and a new scope decision.

Deliverables: Quality and failure review; Change evaluation record; Agreed improvement priorities.

### Technologies (unchanged)

Python, LangChain, LangGraph, LlamaIndex, OpenAI API, Claude API, FastAPI, n8n, Make, Vector Databases, Pinecone, PostgreSQL, Embeddings, RAG, REST APIs, Firebase.

### FAQs

#### What is an AI agent?

An AI agent receives context and uses a model to choose a next step from permitted tools or actions. It proposes or performs an allowed action and returns a result or status within defined permissions, limits and approval rules. A summary or generated response alone is not an agent.

#### When should we use AI instead of normal automation?

Use AI when interpretation, extraction, classification or retrieval adds value to a defined business task. Prefer rules, ordinary search or a normal integration when those are sufficient. Data restrictions, unacceptable uncertainty or an unclear process can make AI unsuitable.

#### What business tasks can AI automation support?

Potential scopes include document interpretation, internal knowledge assistance, task preparation and routing, operational summaries, and reviewed customer-support drafts. Start with one task and evaluate its data, output quality and review requirements before expanding.

#### Can AI agents connect to our existing systems?

Connections depend on available APIs, approved data access and the actions a system permits. Begin with read-only access or proposed actions for review. Writes require a separately agreed scope, permissions, tests and approvals; our public AI feature cases do not prove a production ERP- or CRM-writing agent.

#### How do you keep people in control?

Define who reviews uncertain extraction, approves generated content and authorizes sensitive financial or customer changes. Named owners resolve exceptions and can override results, revoke access or stop the workflow. Tool permissions and action limits are agreed before release.

#### How do you test an AI workflow?

We agree representative examples, expected outputs or actions and acceptance criteria with your experts. Tests cover ambiguous and invalid inputs, retrieval relevance, unanswerable questions, tool restrictions, denied access, approvals and failure paths. Recheck the examples when prompts, models or workflow logic change.

#### What happens when an output is incorrect or uncertain?

Validation and review rules determine whether to stop, return an unresolved status or route the item to a person. Logs where supported help the owner investigate incorrect interpretation, unsupported answers, format errors or failed tool calls. AI outputs still need evaluation and appropriate review.

#### What data and access does the system need?

The workflow needs approved sources and representative examples relevant to the task. Your data and system owners authorize access and sensitive-data handling. Third-party model/API use, retention, processing location and privacy arrangements depend on the selected architecture, provider settings and contract.

#### What affects AI project cost and timeline?

Workflow complexity, data readiness, document volume, model usage, retrieval requirements, integrations, permissions, evaluation and human-review needs affect delivery. Latency, monitoring and support requirements also matter. Discovery defines the initial scope and checkpoints; there is no universal delivery duration.

#### What happens after deployment?

Your named operational owner and KP agree support responsibilities, review cadence and monitoring scope. Reviews can cover failures, API errors, quality feedback, approval rates, cost, latency, provider changes and source freshness. Further use cases follow evaluation and a separate scope decision.
