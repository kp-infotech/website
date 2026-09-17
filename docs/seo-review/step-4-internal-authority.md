# Step 4 — Internal authority flow

**Status: release candidate; all build and local HTTP checks pass. Production release/verification pending.**

Scope: existing 56 sitemap pages only. No page, URL, redirect, metadata, heading, claim or article-prose changes. Isolated checkout `/private/tmp/kp-step4-release`, baseline main `5e342c97ff08b766da66c5a7f92fa457c74be866`; original mixed workspace excluded. No Step 5 work.

## GSC Context

User-supplied approximate impressions for 15 June–14 September 2026 **predate the recent SEO deployments** and are prioritization context, not post-Step-2 performance. No fresh GSC performance claim.

| Insight | Impressions |
| --- | --- |
| best-web-application-frameworks | 4548 |
| database-design-best-practices | 2908 |
| node-js-frameworks | 2691 |
| minimum-viable-product-examples | 2659 |
| erp-implementation-cost | 2183 |
| cloud-deployment-models-diagram | 489 |
| erp-for-retail-stores | 419 |
| odoo-erp-complete-guide | 246 |

| Service | Historical impressions |
| --- | --- |
| ERP | 458 |
| Custom Software | 132 |
| Cloud | 72 |
| AI | 60 |
| Business Automation | 36 |

The six restored articles are newly live; their topical relevance is useful, but performance is not yet established.

## Before Link Graph

All 56 indexable sitemap pages crawled before mutation. Full occurrence-level CSV/JSON records source, destination, accessible anchor, DOM context, location, HTTP result and canonical destination. Every linked page was also a sitemap target returning 200 directly; zero legacy or broken page destinations. Global counts are repeated footer/navigation occurrences, not editorial votes. Unique-page counts include global links and must not be interpreted as contextual support.

| Pillar | Total before → after | Body pages before → after | Global before → after | Case study before → after | Industry before → after | Insight before → after | Unique pages |
| --- | --- | --- | --- | --- | --- | --- | --- |
| custom-software-development | 73 → 79 | 3 → 9 | 56 → 56 | 4 → 4 | 8 → 8 | 3 → 9 | 56 → 56 |
| erp-software | 64 → 68 | 3 → 7 | 56 → 56 | 1 → 0 | 2 → 3 | 3 → 7 | 56 → 56 |
| business-automation | 70 → 69 | 4 → 4 | 56 → 56 | 1 → 0 | 7 → 7 | 4 → 4 | 56 → 56 |
| ai-automation-agents | 64 → 64 | 2 → 3 | 56 → 56 | 2 → 2 | 2 → 1 | 2 → 3 | 56 → 56 |
| cloud-devops | 68 → 70 | 2 → 4 | 56 → 56 | 3 → 3 | 5 → 5 | 2 → 4 | 56 → 56 |

Contextual/body figures are article editorial links; case-study service references and industry cards are separately identified, never silently treated as body paragraphs. No commercial page is an orphan: all are one homepage click away and directly linked from the Services hub.

| Pillar | Before | After | Evidence-based assessment |
| --- | --- | --- | --- |
| Custom Software | MODERATE SUPPORT | STRONG SUPPORT | Previously three newer editorial sources plus four case studies/eight industries; now six additional relevant older guides, including the historically strongest sources. |
| ERP/Odoo | MODERATE SUPPORT | STRONG SUPPORT | Previously three newer guides; now costs, Odoo adoption, retail implementation and inventory integration support it. Incorrect cloud proof removed. |
| Business Automation | STRONG SUPPORT | STRONG SUPPORT | Four relevant editorial sources and seven industry relationships already explain operational workflows; preserved without unnecessary expansion. |
| AI | WEAK SUPPORT | MODERATE SUPPORT | Two automation guides; limited dedicated informational coverage. Now three relevant guides and two actual AI project relationships. No unrelated AI links manufactured. |
| Cloud | MODERATE SUPPORT | STRONG SUPPORT | Previously two guides and genuine cloud proof; now deployment-cost and architecture operations discussions also link directly. |

AI remains a relative coverage warning, not a technical failure. Step 4 cannot create dedicated new assets under the requested scope. These are editorial judgments based on relevance/diversity/placement and historical visibility, not numeric tool scores.

## Links Added

13 article-to-service links across 12 articles; only scalable architecture receives two, to distinct relevant capabilities. No article text changed. Nine service-to-insight links added in short decision-support paragraphs using the existing content renderer.

| Source | Destination | Anchor | Reason |
| --- | --- | --- | --- |
| /insights/node-js-frameworks/ | /services/custom-software-development/ | building high-performance, scalable web applications | Connect the application planning or implementation discussion to the custom software capability. |
| /insights/database-design-best-practices/ | /services/custom-software-development/ | build applications that can handle increased load | Connect the application planning or implementation discussion to the custom software capability. |
| /insights/best-web-application-frameworks/ | /services/custom-software-development/ | enterprise building a complex, microservices-based system | Connect the application planning or implementation discussion to the custom software capability. |
| /insights/minimum-viable-product-examples/ | /services/custom-software-development/ | launching a successful MVP | Connect the application planning or implementation discussion to the custom software capability. |
| /insights/scalable-system-architecture/ | /services/custom-software-development/ | custom enterprise software | Connect the application planning or implementation discussion to the custom software capability. |
| /insights/angular-vs-react/ | /services/custom-software-development/ | Large, long‑lived enterprise systems | Connect the application planning or implementation discussion to the custom software capability. |
| /insights/erp-implementation-cost/ | /services/erp-software/ | expertise required for successful implementations | Implementation planning and customization expertise support the cost decision. |
| /insights/odoo-erp-complete-guide/ | /services/erp-software/ | implementation | The modular adoption paragraph introduces the Odoo implementation capability. |
| /insights/erp-for-retail-stores/ | /services/erp-software/ | ERP implementation | Link in the implementation section, not the introductory retail definition. |
| /insights/inventory-management-best-practices/ | /services/erp-software/ | Integrate systems with suppliers | Supplier and inventory integration is an ERP implementation capability. |
| /insights/cloud-deployment-models-diagram/ | /services/cloud-devops/ | cost management (FinOps) | Operational cost control is part of the Cloud & DevOps service. |
| /insights/scalable-system-architecture/ | /services/cloud-devops/ | deployments, monitoring | Operational complexity paragraph directly discusses DevOps responsibilities. |
| /insights/kp-infotech-new-website-custom-software-automation-ai/ | /services/ai-automation-agents/ | AI automation and agent systems | Existing guardrails paragraph describes the actual AI offering. |
| /services/custom-software-development/ | /insights/what-is-custom-software/ | custom software guide | Decision support within existing service content. |
| /services/custom-software-development/ | /insights/database-design-best-practices/ | database design best practices | Decision support within existing service content. |
| /services/erp-software/ | /insights/erp-implementation-cost/ | ERP implementation cost guide | Decision support within existing service content. |
| /services/erp-software/ | /insights/how-to-choose-erp-system/ | ERP selection checklist | Decision support within existing service content. |
| /services/business-automation/ | /insights/business-process-improvement-methods/ | process improvement methods | Decision support within existing service content. |
| /services/business-automation/ | /insights/business-process-automation-tools/ | automation tools guide | Decision support within existing service content. |
| /services/cloud-devops/ | /insights/cloud-deployment-models-diagram/ | cloud deployment models guide | Decision support within existing service content. |
| /services/cloud-devops/ | /insights/devops-best-practices/ | DevOps best practices | Decision support within existing service content. |
| /services/ai-automation-agents/ | /insights/business-process-automation-tools/ | business process automation tools guide | Decision support within existing service content. |

## Existing Links Preserved

All 19 existing clickable article-body links were preserved exactly, including the six restored guides. The 14 existing service links below required no new commercial link; the other five are educational cross-links.

| Source | Destination | Anchor |
| --- | --- | --- |
| /insights/business-process-automation-tools/ | /services/business-automation/ | business automation services |
| /insights/business-process-automation-tools/ | /services/ai-automation-agents/ | AI automation agents |
| /insights/business-process-automation-tools/ | /services/custom-software-development/ | custom software development |
| /insights/business-process-improvement-methods/ | /services/business-automation/ | business automation |
| /insights/business-process-improvement-methods/ | /services/ai-automation-agents/ | AI automation agents |
| /insights/business-process-improvement-methods/ | /services/erp-software/ | Odoo ERP implementation and customization |
| /insights/devops-best-practices/ | /services/cloud-devops/ | Cloud & DevOps services |
| /insights/devops-best-practices/ | /services/custom-software-development/ | custom software development |
| /insights/devops-best-practices/ | /insights/scalable-system-architecture/ | scalable system architecture guide |
| /insights/devops-best-practices/ | /insights/cloud-deployment-models-diagram/ | cloud deployment models guide |
| /insights/how-to-choose-erp-system/ | /insights/odoo-erp-complete-guide/ | Odoo ERP guide |
| /insights/how-to-choose-erp-system/ | /services/erp-software/ | Odoo ERP implementation and customization |
| /insights/how-to-choose-erp-system/ | /services/business-automation/ | business automation |
| /insights/on-premise-vs-cloud-erp/ | /insights/cloud-deployment-models-diagram/ | cloud deployment models guide |
| /insights/on-premise-vs-cloud-erp/ | /services/erp-software/ | Odoo ERP implementation and customization |
| /insights/on-premise-vs-cloud-erp/ | /services/cloud-devops/ | cloud and DevOps services |
| /insights/on-premise-vs-cloud-erp/ | /insights/odoo-erp-complete-guide/ | Odoo ERP guide |
| /insights/what-is-custom-software/ | /services/custom-software-development/ | custom software for growing businesses |
| /insights/what-is-custom-software/ | /services/business-automation/ | business automation |

## Links Not Added

- HR software: vendor-selection material and incidental automation mentions do not establish a focused service implementation need. High impressions alone do not justify a new link. Both overlapping versions and incomplete table remain untouched.
- SEO tools: marketing/tool-comparison intent is outside the five pillars; no forced link to software or AI.
- Mobile app monetization: revenue-model discussion does not provide a focused operational implementation relationship; no commercial link added.
- The restored automation, ERP-selection, deployment and custom-software guides already contain relevant links, so none were duplicated.
- MVP examples was reviewed individually: its existing founder/product-manager paragraph about launching an MVP supports Custom Software, which explicitly offers SaaS MVPs. Only that phrase was linked; its unusual code-formatted takeaways were left intact.
- Cloud guide discusses cost management explicitly; that passage supports Cloud without introducing a claim. No extra AI links were added to frameworks/database articles.

## Anchor Text

Exact before/after distributions are in graph JSON. New anchors use existing paragraph language, varying by implementation, application, inventory and operations context. No “click here”, inflated company-keyword anchors or hidden links added. Existing three identical “Odoo ERP implementation and customization” anchors in distinct restored guides were preserved because they accurately describe the destination; no mass synonym replacement. The short Odoo anchor “implementation” relies on its immediately surrounding Odoo adoption paragraph. Existing Services-hub “View Service” labels are within descriptive service cards; they remain accessible and unchanged.

## Service → Proof

| Service | Approved case studies | Action |
| --- | --- | --- |
| Custom Software | collaboration-platform-distributed-teams; digital-banking-platform; omnichannel-ecommerce-platform | Populate existing related-work field/component |
| Cloud | cloud-cost-optimization-industrial-sme | Populate existing related-work field/component |
| AI | virtual-tours-ai-listings; omnichannel-ecommerce-platform | Populate existing component; actual listing-content/personalization AI, not claims of autonomous agents |
| ERP; Business Automation | None | No matching approved proof invented |

Case-study → service: collaboration and banking retain Custom Software primary plus their existing Cloud secondary. Commerce retains Custom Software plus AI personalization. Cloud cost now points only to Cloud (existing Cloud reference preserved semantically; unrelated ERP/AI references removed). Virtual tours now points to Custom Software plus AI listing capability; its automation reference was replaced to focus the relationship on two strongest capabilities. No body, result, metric or client claim changed.

## Service → Insights

Each service now has one short educational paragraph, one or two guide links, using the existing Portable Text renderer. Exact relationships above. No giant related-articles block and no UI/template changes.

## Industry → Service

- logistics: erp-software, business-automation, custom-software-development.
- healthcare: business-automation, custom-software-development, cloud-devops.
- real-estate: custom-software-development, cloud-devops, ai-automation-agents.
- manufacturing: erp-software, custom-software-development, business-automation.
- finance: business-automation, custom-software-development, cloud-devops.
- startups: custom-software-development, cloud-devops, business-automation.
- retail-ecommerce: custom-software-development, business-automation, erp-software.
- education: custom-software-development, business-automation, cloud-devops.

Only Retail changes: ERP replaces AI in its three existing cards, prioritizing inventory sync and omnichannel integration. Manufacturing and logistics already link ERP, automation and custom systems. Other relationships remain grounded in their portal, workflow or infrastructure passages. No industry links to all five pillars.

## Legacy Internal Links

Zero rendered legacy/redirecting internal destinations before or after; no correction was needed. Homepage, Services hub, footer and navigation use final canonical URLs. Historical GSC URLs do not influence current links. Existing plain-text canonical references remain text, not duplicate clickable service links. No redirects changed; no external references replaced.

## Crawl Depth

| Path | Homepage before → after | Content-only before → after |
| --- | --- | --- |
| /insights/2/ | 2 → 2 | — → — |
| /insights/3/ | 2 → 2 | — → — |
| /insights/angular-vs-react/ | 3 → 3 | — → 3 |
| /insights/best-hr-software-for-startups/ | 3 → 3 | — → 3 |
| /insights/best-seo-tools-for-small-businesses/ | 3 → 3 | — → — |
| /insights/best-web-application-frameworks/ | 3 → 3 | — → 3 |
| /insights/business-process-automation-tools/ | 2 → 2 | — → 2 |
| /insights/business-process-improvement-methods/ | 2 → 2 | — → 2 |
| /insights/cloud-deployment-models-diagram/ | 2 → 2 | — → 2 |
| /insights/database-design-best-practices/ | 3 → 2 | — → 2 |
| /insights/devops-best-practices/ | 2 → 2 | — → 2 |
| /insights/erp-for-retail-stores/ | 3 → 3 | — → 3 |
| /insights/erp-implementation-cost/ | 3 → 2 | — → 2 |
| /insights/how-to-choose-erp-system/ | 2 → 2 | — → 2 |
| /insights/inventory-management-best-practices/ | 3 → 3 | — → — |
| /insights/kp-infotech-new-website-custom-software-automation-ai/ | 2 → 2 | — → — |
| /insights/minimum-viable-product-examples/ | 3 → 3 | — → — |
| /insights/mobile-app-monetization-strategies/ | 3 → 3 | — → — |
| /insights/node-js-frameworks/ | 3 → 3 | — → 3 |
| /insights/odoo-erp-complete-guide/ | 3 → 3 | — → 3 |
| /insights/on-premise-vs-cloud-erp/ | 2 → 2 | — → 3 |
| /insights/scalable-system-architecture/ | 3 → 3 | — → 3 |
| /insights/what-is-custom-software/ | 3 → 2 | — → 2 |
| /services/ai-automation-agents/ | 1 → 1 | 1 → 1 |
| /services/business-automation/ | 1 → 1 | 1 → 1 |
| /services/cloud-devops/ | 1 → 1 | 1 → 1 |
| /services/custom-software-development/ | 1 → 1 | 1 → 1 |
| /services/erp-software/ | 1 → 1 | 1 → 1 |
| /work/cloud-cost-optimization-industrial-sme/ | 1 → 1 | 1 → 1 |
| /work/collaboration-platform-distributed-teams/ | 1 → 1 | 1 → 1 |
| /work/digital-banking-platform/ | 2 → 2 | 2 → 2 |
| /work/omnichannel-ecommerce-platform/ | 1 → 1 | 1 → 1 |
| /work/virtual-tours-ai-listings/ | 1 → 1 | 1 → 1 |

All five services have homepage depth 1; `/ → /services/ → service` is a two-click hub path. Editorial paths flow through `/insights/` (and its existing pagination/category paths) to the relevant guide and then service; proof paths use `/work/ → case study → service`. Complete shortest-depth maps include all 56 routes. No navigation redesign.

## Internal Authority Matrix

`step-4-evidence/authority-matrix.csv` contains every nonglobal service relationship, with source, destination, relationship/location, anchor, existing/new and reason. Full before/after graphs retain other internal edges as well.

## CMS Mutations

20 published documents changed in one authenticated atomic transaction. Full before documents/revisions are snapshotted locally in the isolated checkout (excluded from Git); `scripts/sanity/step-4-links-batch.json` records each document ID, exact field/block index and key (null for pre-existing unkeyed blocks), old/new values, target reference and reason. Article edits set only individual content blocks; all text, block keys and styles are asserted unchanged. Service educational blocks are appended with a unique key; related-work/services fields are individually updated. Every patch uses `ifRevisionId`; any concurrent change aborts the transaction. Post-apply document comparison confirms no unrelated changes. No blind string replacement. CMS scripts require `STEP4_SNAPSHOT_PATH` pointing to the retained local snapshot. Full CMS documents, raw rendered-page inventories and build logs are deliberately retained locally rather than exported to Git.

## Tests

- Authenticated production build: PASS, 17 September 2026 13:21:11 IST, 1m46s. Existing large Sanity bundle warning only.
- `node --test tests/*.test.mjs`: **67 passed, 0 failed, 0 skipped**.
- New regression tests validate every rendered internal destination against canonical/indexable sitemap targets, accessible anchors, exact planned links, preservation of existing editorial links and narrow CMS mutation scope; no minimum-link quotas.
- Before/after graph: 56 pages, zero unresolved destinations.
- CMS verification: 20/20 documents exactly match planned field changes.
- `git diff --check`: PASS.
- An early test attempt ran before the build completed and was superseded by the complete 67/67 run. First local port was occupied; isolated preview used 8794. No failed check is hidden in final results.

## Step 1–3 Regression

- Step 1 local Worker: 56 HTTP-200 indexable canonical pages; 32 redirect checks and 63 unsupported-project variants pass; zero dead/legacy links. Sitemap/robots/sample 404 pass.
- Step 2: 9/9 exact approved fixtures; all 56 metadata snapshots unchanged.
- Step 3: 56/56 one H1, no heading-level skips, missing alts, duplicate IDs, unnamed buttons, body H1 or confirmed editorial residue. All 358 image occurrences have alt. Six additional proof thumbnails account for the image-count increase.
- Existing Step 3 editorial/proof backlog remains: HR duplication, incomplete comparisons, author-profile issue and business substantiation.

## Deployment

Pending final clean-main push and established Cloudflare Worker deployment.

## Production Verification

Pending release.

## Measurement

Review date: **15 October 2026**, approximately 28 days after planned 17 September release. Evaluate service impressions/clicks, non-brand queries, Top-20 commercial keywords and query relevance. No immediate ranking-success claim. No automation or Step 5 work.
