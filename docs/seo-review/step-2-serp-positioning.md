# Step 2 — SERP positioning, metadata and company messaging

Status: **PASS WITH WARNINGS** — deployed and production verified. All technical checks pass; the pre-existing Odoo partnership/certification assertion awaits business evidence. Step 3 is not started.

## GSC Baseline

Latest settled 28-day baseline through **2026-09-14**: **16 clicks; 7,129 impressions; approximately 0.224% CTR; approximately 51.66 average position.** This baseline largely predates Step 1 deployment on **17 September 2026**. It is the pre-growth baseline, not a measurement of Step 1 results.

## Source of Truth Audit

Audit completed before mutations. Clean release checkout starts at remote main `616d18ce45d4e46bf9bb8af4983f704bc11c8ac3`. The original workspace contains older uncommitted Step 1 work and is excluded from this release.

| Surface | Metadata source and precedence | Change |
| --- | --- | --- |
| Homepage | `src/pages/index.astro` explicit BaseLayout props; description previously reused hero paragraph | Page props; hero H1 and paragraph preserved |
| Services hub | `src/pages/services/index.astro` explicit props | Page props |
| Five services | Published Sanity `service.seoTitle` / `seoDescription`; falls back to title and excerpt/tagline in `src/pages/services/[slug].astro` | Only CMS SEO fields |
| About / Contact | Explicit props in their Astro pages | Page props; ContactPage schema description kept aligned |
| Site defaults | BaseLayout: explicit props → Sanity `defaultSeoTitle/defaultSeoDescription` → code defaults | No changes; already aligned |
| Title suffix | BaseLayout preserves titles containing KP Infotech; otherwise appends ` — KP Infotech` | No global logic changes; explicit full titles use preferred ` | ` separator |
| Social metadata | BaseLayout feeds fullTitle/metaDescription directly to OG and Twitter; canonical feeds og:url/twitter:url | Automatically consistent; image precedence unchanged |
| Homepage eyebrow | `siteSettings.siteTagline` → page fallback | CMS field and fallback |
| Global footer | `siteSettings.footerText` → shared Footer default | Modern CMS text preserved; fallback brought into agreement |

CMS previous values/revisions are in `step-2-evidence/cms-before.json`; guarded mutation batch is `scripts/sanity/step-2-batch.json`. `update-step-2.mjs` performs a dry run by default, checks project/dataset, allows only eleven intended fields, and locks patches to inventoried revisions. Apply evidence records transaction `Xe0A1k3WLpDZQN3vt63OC4`. No slugs, body content, images, drafts, default SEO fields, or unrelated CMS fields were changed. Existing authenticated API token was used privately; no new token was created.

## Target Pages

- `/`
- `/services/`
- `/services/custom-software-development/`
- `/services/business-automation/`
- `/services/erp-software/`
- `/services/ai-automation-agents/`
- `/services/cloud-devops/`
- `/about/`
- `/contact/`

## Before/After Metadata

Counts are characters, shown as title / description; clarity and intent take precedence over arbitrary length scores. All nine exact preferred titles/descriptions were used; Services description adds business outcomes and all five pillars.

| URL | Old title | New title | Old description | New description | Old → new lengths | Source | Primary intent / reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | Custom Software, ERP, Automation & AI Solutions \| KP Infotech | Custom Software, Odoo ERP & Automation \| KP Infotech | KP Infotech helps growing B2B teams replace spreadsheets, manual workflows, and disconnected tools with custom software, Odoo ERP, business automation, AI agents, and cloud infrastructure built around how their operations actually work. | KP Infotech builds custom software, Odoo ERP, business automation, AI agents and cloud systems that reduce manual work and improve operations. | 61 / 236 → 52 / 142 | Code: page BaseLayout props | KP Infotech + broad B2B technology entity; clearer relevance and snippet copy |
| /services/ | B2B Software, ERP, Automation & AI Services — KP Infotech | Custom Software, ERP, AI & Cloud Services \| KP Infotech | Explore KP Infotech's services — custom software, business automation, ERP & Odoo, AI agents, and cloud & DevOps — built for growing businesses replacing manual operations. | Explore custom software, Odoo ERP, business automation, AI agents and cloud infrastructure that reduce manual work and improve business operations. | 57 / 172 → 55 / 147 | Code: page BaseLayout props | Navigation / broad five-pillar services; clearer relevance and snippet copy |
| /services/custom-software-development/ | Custom Business Software Development Company — KP Infotech | Custom Software Development Company \| KP Infotech | Custom business software development for growing teams that need internal tools, dashboards, portals, SaaS MVPs, workflow systems, and integrations to reduce manual work and improve operational visibility. | Build custom business software, internal tools, portals, SaaS products and integrations that replace manual work and improve operational visibility. | 58 / 205 → 49 / 148 | CMS service SEO fields | Custom software development company/services; clearer relevance and snippet copy |
| /services/business-automation/ | Business Automation Services for Growing Companies — KP Infotech | Business Process Automation Services \| KP Infotech | Business automation services for teams using spreadsheets, manual approvals, disconnected tools, and repetitive admin workflows. KP Infotech builds workflow automation, integrations, dashboards, and operational systems. | Automate workflows, approvals, reporting, documents and system handoffs with practical business automation built around your operations. | 64 / 219 → 50 / 136 | CMS service SEO fields | Business process automation services; clearer relevance and snippet copy |
| /services/erp-software/ | Odoo ERP Implementation & Customization Company — KP Infotech | Odoo ERP Implementation Services \| KP Infotech | Odoo ERP implementation, customization, migration, and support for growing businesses. KP Infotech connects CRM, sales, purchase, inventory, accounting, manufacturing, HR, and operations in one ERP system. | Implement, customize, migrate and integrate Odoo ERP across sales, inventory, manufacturing, finance and operations with KP Infotech. | 61 / 205 → 46 / 133 | CMS service SEO fields | Odoo ERP implementation services/company; clearer relevance and snippet copy |
| /services/ai-automation-agents/ | AI Agent Development & Automation for Business Operations — KP Infotech | AI Agent Development & Automation Services \| KP Infotech | AI agent development and AI automation for business operations. KP Infotech builds document processing agents, internal AI assistants, workflow automations, support agents, and reporting agents with practical guardrails. | Build AI agents and automation for document processing, operational knowledge, task routing and repetitive workflows with human oversight. | 71 / 220 → 56 / 138 | CMS service SEO fields | AI agent development/automation services; clearer relevance and snippet copy |
| /services/cloud-devops/ | Cloud & DevOps Services for Scalable Business Systems — KP Infotech | Cloud & DevOps Services \| KP Infotech | Cloud and DevOps services for reliable deployments, scalable infrastructure, CI/CD pipelines, monitoring, backups, cloud hosting, security controls, and cost optimization for growing business systems. | Design reliable cloud infrastructure, CI/CD, monitoring and cost optimization for business systems that need to scale securely and efficiently. | 67 / 200 → 37 / 143 | CMS service SEO fields | Cloud & DevOps services; clearer relevance and snippet copy |
| /about/ | About — KP Infotech | About KP Infotech \| B2B Technology & Automation Partner | KP Infotech is a B2B operations technology partner in Ahmedabad building custom software, ERP & Odoo, automation, AI agents, and cloud systems for growing businesses. | Learn how KP Infotech helps growing businesses replace manual work and disconnected systems with software, ERP, automation, AI and cloud solutions. | 19 / 166 → 55 / 147 | Code: page BaseLayout props | Company/entity/trust; clearer relevance and snippet copy |
| /contact/ | Contact — KP Infotech | Contact KP Infotech \| Discuss Your Operations Challenge | Talk to KP Infotech about custom software, Odoo ERP, automation, AI agents, and cloud infrastructure for growing business operations. | Discuss your operations challenge with KP Infotech and plan the right mix of custom software, Odoo ERP, automation, AI and cloud infrastructure. | 21 / 133 → 55 / 144 | Code: page BaseLayout props | Brand/contact/conversion; clearer relevance and snippet copy |

### Existing routes with copy-only changes

These 43 routes receive a shared CTA wording change. Their title/description and primary intent remain unchanged; this table records the complete metadata inventory without implying a metadata rewrite. No article body was edited.

| URL | Old = new title | Old = new description | Title / description lengths | Source / intent / reason |
| --- | --- | --- | --- | --- |
| /industries/education/ | Education Portals, LMS & Student Workflow Automation — KP Infotech | Build LMS platforms, student portals, reporting dashboards, and admin automation that help education teams deliver and measure learning. | 66 / 136 | Code: shared route CTA; preserve industry detail intent; remove generic agency CTA |
| /industries/finance/ | Finance Software, Secure Dashboards & Workflow Automation — KP Infotech | Build secure finance portals, payment integrations, reporting dashboards, and automated workflows that improve visibility and control. | 71 / 134 | Code: shared route CTA; preserve industry detail intent; remove generic agency CTA |
| /industries/healthcare/ | Healthcare Software, Automation & Patient Operations — KP Infotech | Build secure healthcare portals, telemedicine workflows, practice dashboards, and integrations that reduce admin work and improve patient service visibility. | 66 / 157 | Code: shared route CTA; preserve industry detail intent; remove generic agency CTA |
| /industries/logistics/ | Logistics Software, Fleet Tracking & Warehouse Automation — KP Infotech | Improve fleet visibility, warehouse workflows, route planning, and supply chain reporting with custom logistics software and automation. | 71 / 136 | Code: shared route CTA; preserve industry detail intent; remove generic agency CTA |
| /industries/manufacturing/ | Manufacturing ERP, Automation & Production Dashboards — KP Infotech | Connect production, inventory, purchasing, quality, and reporting with ERP and automation systems that give manufacturers clearer operational control. | 67 / 150 | Code: shared route CTA; preserve industry detail intent; remove generic agency CTA |
| /industries/real-estate/ | Real Estate Portals, Listing Platforms & Workflow Automation — KP Infotech | Modernize property operations with listing platforms, portals, virtual tour integrations, CRM workflows, and dashboards that help teams move deals faster. | 74 / 154 | Code: shared route CTA; preserve industry detail intent; remove generic agency CTA |
| /industries/retail-ecommerce/ | Retail & E-commerce ERP, Automation & Commerce Systems — KP Infotech | Unify storefronts, inventory, orders, CRM, and reporting with retail systems that reduce manual reconciliation and help teams serve buyers faster. | 68 / 146 | Code: shared route CTA; preserve industry detail intent; remove generic agency CTA |
| /industries/startups/ | Startup MVPs, SaaS Platforms & Scalable Business Software — KP Infotech | Launch MVPs, portals, SaaS products, and internal systems with practical architecture that supports fast learning without avoidable rework. | 71 / 139 | Code: shared route CTA; preserve industry detail intent; remove generic agency CTA |
| /insights/ | Insights & Articles — KP Infotech | Expert insights on design, development, and digital transformation. Learn from our experience building digital products that drive business growth. | 33 / 147 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/2/ | Insights & Articles — Page 2 — KP Infotech | Expert insights on design, development, and digital transformation. Learn from our experience building digital products that drive business growth. | 42 / 147 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/3/ | Insights & Articles — Page 3 — KP Infotech | Expert insights on design, development, and digital transformation. Learn from our experience building digital products that drive business growth. | 42 / 147 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/angular-vs-react/ | Angular vs React for Business Web Applications — KP Infotech | Compare Angular and React for enterprise and startup web applications, including architecture, speed, maintainability, and team fit. | 60 / 132 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/best-hr-software-for-startups/ | Best HR Software for Startups: Selection Guide — KP Infotech | Compare HR software options for startups by hiring workflow, employee records, payroll needs, automation, integrations, and growth stage. | 60 / 137 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/best-seo-tools-for-small-businesses/ | 12 Best SEO Tools for Small Businesses in 2025 — KP Infotech | Discover the 12 best SEO tools for small businesses in our 2025 guide. Boost your visibility with top tools for keyword research, site audits, and more. | 60 / 152 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/best-web-application-frameworks/ | Best Web Application Frameworks for Business Software — KP Infotech | Compare leading web application frameworks for scalable business apps, portals, dashboards, and SaaS products, with practical fit by use case. | 67 / 142 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/business-process-automation-tools/ | Business Process Automation Tools: Types & Selection Guide — KP Infotech | Compare business process automation tools by use case, workflow complexity, integrations, approvals, reporting, AI fit, and long-term operations needs. | 72 / 151 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/business-process-improvement-methods/ | Business Process Improvement Methods for Growing Teams — KP Infotech | Learn practical business process improvement methods for reducing manual work, improving visibility, simplifying workflows, and preparing for automation. | 68 / 153 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/category/automation-ai/ | Automation & AI Articles — KP Infotech | Business process automation, workflow optimization, AI agents, and AI-powered operations. | 38 / 89 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/category/cloud-devops/ | Cloud & DevOps Articles — KP Infotech | Cloud infrastructure, deployment, and operational best practices | 37 / 64 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/category/custom-software-development/ | Custom Software & Development Articles — KP Infotech | Software engineering, application development, architecture, testing, and mobile development insights. | 52 / 102 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/category/digital-platforms-ecommerce/ | Digital Platforms & E-commerce Articles — KP Infotech | Websites, e-commerce, UX design, digital marketing, and customer-facing digital platforms. | 53 / 90 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/category/erp-business-systems/ | ERP & Business Systems Articles — KP Infotech | ERP, CRM, inventory, HR software, implementation planning, and operational business systems. | 45 / 92 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/cloud-deployment-models-diagram/ | Cloud Deployment Models: Public, Private & Hybrid Explained — KP Infotech | Understand public, private, hybrid, and multi-cloud deployment models, with tradeoffs for control, cost, security, and operations. | 73 / 130 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/database-design-best-practices/ | 8 Essential Database Design Best Practices for 2025 — KP Infotech | Discover 8 essential database design best practices to optimize performance, security, and scalability. Learn from experts with real-world examples. | 65 / 148 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/devops-best-practices/ | DevOps Best Practices for Reliable Business Apps — KP Infotech | Learn DevOps best practices for CI/CD, infrastructure, monitoring, rollback, backups, security, and operational reliability in business applications. | 62 / 149 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/erp-for-retail-stores/ | ERP for Retail Stores: Inventory, POS & Omnichannel Guide — KP Infotech | Learn how retail ERP connects POS, inventory, purchasing, finance, CRM, and omnichannel operations to reduce manual reconciliation. | 71 / 131 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/erp-implementation-cost/ | Understanding ERP Implementation Cost — KP Infotech | Discover the true ERP implementation cost. Our complete guide breaks down software fees, hidden expenses, and budgeting strategies for your next project. | 51 / 153 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/how-to-choose-erp-system/ | How to Choose an ERP System: Evaluation Checklist — KP Infotech | Learn how to choose an ERP system by mapping requirements, modules, integrations, costs, deployment options, vendor fit, and implementation readiness. | 63 / 150 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/inventory-management-best-practices/ | 9 Essential Inventory Management Best Practices for 2025 — KP Infotech | Discover 9 crucial inventory management best practices to optimise stock levels, reduce costs, and streamline your operations for sustainable growth in 2025. | 70 / 157 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/kp-infotech-new-website-custom-software-automation-ai/ | KP Infotech’s Next Chapter: Custom Software, ERP, Automation & AI | KP Infotech’s new website reflects a sharper focus on custom software, Odoo ERP, business automation, AI agents, and cloud infrastructure for growing businesses. | 65 / 161 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/minimum-viable-product-examples/ | Minimum Viable Product Examples for Startup Planning — KP Infotech | Review practical MVP examples and lessons for validating product ideas, prioritizing features, and avoiding avoidable build cost early. | 66 / 135 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/mobile-app-monetization-strategies/ | 10 Mobile App Monetization Strategies for 2025 — KP Infotech | Discover the top 10 mobile app monetization strategies for 2025. Learn how to implement freemium, IAP, subscriptions, and more to boost your revenue. | 60 / 149 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/node-js-frameworks/ | Best Node.js Frameworks for Scalable Web Applications — KP Infotech | Compare Node.js frameworks for APIs, web apps, and real-time systems, with practical tradeoffs for performance, maintainability, and team fit. | 67 / 142 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/odoo-erp-complete-guide/ | Odoo ERP Guide: Features, Modules, Pricing & Fit — KP Infotech | Understand Odoo ERP modules, implementation considerations, pricing factors, and when it fits growing businesses replacing scattered tools. | 62 / 139 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/on-premise-vs-cloud-erp/ | On-Premise vs Cloud ERP: Key Differences & Fit — KP Infotech | Compare on-premise ERP and cloud ERP by cost, control, security, access, customization, maintenance, scalability, and fit for growing businesses. | 60 / 145 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/scalable-system-architecture/ | Building a Scalable System Architecture: Essential Guide — KP Infotech | Learn how to design a scalable system architecture with key principles and patterns to ensure your systems grow efficiently and reliably. | 70 / 137 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /insights/what-is-custom-software/ | What Is Custom Software? Definition, Examples & Fit — KP Infotech | Learn what custom software is, when it fits growing businesses, and how it compares with off-the-shelf tools for workflows, dashboards, and integrations. | 65 / 153 | Code: shared route CTA; preserve editorial article / archive intent; remove generic agency CTA |
| /work/ | Our Work — KP Infotech | Explore our portfolio of digital projects. From web applications to mobile apps and enterprise solutions, see how we help businesses grow. | 22 / 138 | Code: shared route CTA; preserve case study / work hub intent; remove generic agency CTA |
| /work/cloud-cost-optimization-industrial-sme/ | Cloud Cost Optimization Case Study \| $17K to $2.8K Monthly Cloud Spend — KP Infotech | See how KP Infotech helped a European industrial machinery SME reduce cloud infrastructure cost from $17K/month to $2.8K/month through AWS S3 optimization, Docker, Coolify, and infrastructure consolidation. | 84 / 206 | Code: shared route CTA; preserve case study / work hub intent; remove generic agency CTA |
| /work/collaboration-platform-distributed-teams/ | Collaboration Platform Case Study — KP Infotech | How we built a real-time collaboration platform for distributed teams, achieving 25K teams, $3.2M ARR, 98% DAU, and $12M Series A funding. | 47 / 138 | Code: shared route CTA; preserve case study / work hub intent; remove generic agency CTA |
| /work/digital-banking-platform/ | Digital Banking Platform Case Study — KP Infotech | How we built a modern digital banking platform that increased mobile adoption by 186%, achieved 92% satisfaction, and saved $12M for a regional credit union. | 49 / 157 | Code: shared route CTA; preserve case study / work hub intent; remove generic agency CTA |
| /work/omnichannel-ecommerce-platform/ | Omnichannel E-Commerce Platform Case Study — KP Infotech | How we built an AI-powered omnichannel e-commerce platform that grew online revenue by 340% to $45M and achieved 28% conversion rate for a fashion retailer. | 56 / 156 | Code: shared route CTA; preserve case study / work hub intent; remove generic agency CTA |
| /work/virtual-tours-ai-listings/ | Virtual Tour Platform Case Study — KP Infotech | Real estate platform case study for 3D virtual tours, AI listing content, lead capture, CRM workflows, and sales pipeline visibility. | 46 / 133 | Code: shared route CTA; preserve case study / work hub intent; remove generic agency CTA |

## Positioning Changes

The following are exact source strings (asterisk highlight markers are omitted in rendered text). These changes retain existing layout, styling, navigation and links.

| Source | Old | New | Classification |
| --- | --- | --- | --- |
| Sanity siteSettings.siteTagline | Design & Technology Studio | B2B Operations Technology Partner | A — company identity |
| src/pages/index.astro | "Digital Product Studio" | "B2B Operations Technology Partner" | C — fallback |
| src/pages/services/index.astro | We offer end-to-end digital solutions, from initial concept and design       through development and launch. Each service is tailored to your unique needs. | We design and implement the systems growing businesses need to run better —       from custom software and Odoo ERP to workflow automation, AI agents and scalable cloud infrastructure. | A — company positioning / form taxonomy |
| src/pages/about.astro | We Craft Digital Excellence | Technology Built Around Better Business Operations | A — company positioning / form taxonomy |
| src/pages/about.astro | A B2B operations technology partner helping growing businesses replace manual workflows and disconnected tools with custom software, ERP, automation, AI, and cloud systems. | KP Infotech helps growing businesses build and improve the software, ERP, automation, AI and cloud systems that support day-to-day operations. | A — company positioning / form taxonomy |
| src/pages/contact.astro | We're ready to bring your vision to life. Tell us about your project and let's create something extraordinary together. | Tell us where manual work or disconnected systems slow your team down. We'll help you plan the right next step. | B — generic CTA |
| src/components/sections/ContactHero.astro | We're ready to bring your vision to life. Tell us about your project and let's create something extraordinary together. | Tell us where manual work or disconnected systems slow your team down. We'll help you plan the right next step. | C — fallback |
| src/pages/contact.astro | Talk to KP Infotech about custom software, Odoo ERP, automation, AI agents, and cloud infrastructure for growing business operations. | Discuss your operations challenge with KP Infotech and plan the right mix of custom software, Odoo ERP, automation, AI and cloud infrastructure. | A — company positioning / form taxonomy |
| src/components/Footer.astro | Crafting digital experiences that elevate brands and drive measurable business growth. | We build custom software, ERP, automation, AI, and cloud systems for growing businesses that need better operations and less manual work. | C — fallback |
| src/components/sections/AboutHero.astro | A premium digital product studio crafting exceptional experiences for ambitious brands. | KP Infotech helps growing businesses build and improve the software, ERP, automation, AI and cloud systems that support day-to-day operations. | C — fallback |
| src/components/sections/Team.astro | A dedicated team of designers, developers, and strategists passionate about creating exceptional digital experiences. | A dedicated team of engineers, ERP specialists, and automation experts building practical systems for growing businesses. | C — fallback |
| src/pages/services/[slug].astro | Let's explore how we can help bring your vision to life. | Let's discuss the systems and workflows your business needs to run better. | B — generic CTA |
| src/pages/industries/[slug].astro | Let's explore how we can help bring your vision to life. | Let's discuss the operational challenges and systems your industry depends on. | B — generic CTA |
| src/pages/work/[slug].astro | Let's explore how we can help bring your vision to life. | Let's discuss how the right systems can improve your operations. | B — generic CTA |
| src/pages/about.astro | Let's discuss how we can help bring your vision to life. | Talk to us about the workflows, tools and systems your team needs to improve. | B — generic CTA |
| src/pages/work/index.astro | Let's discuss how we can bring your vision to life with the right strategy and technology. | Let's discuss how the right software and automation can improve your operations. | B — generic CTA |
| src/pages/insights/[...page].astro | Ready to elevate your digital presence? | Ready to improve your business operations? | B — generic CTA |
| src/pages/insights/[slug].astro | Ready to elevate your digital presence? | Ready to improve your business operations? | B — generic CTA |
| src/pages/insights/category/[slug].astro | Ready to elevate your digital presence? | Ready to improve your business operations? | B — generic CTA |
| src/components/sections/ContactFormSection.astro | const projectTypes = [   { value: "", label: "Select project type..." },   { value: "ui-ux-design", label: "UI/UX Design" },   { value: "web-development", label: "Web Development" },   { value: "mobile-apps", label: "Mobile App" },   { value: "erp-solutions", label: "ERP Solution" },   { value: "digital-marketing", label: "Digital Marketing" },   { value: "other", label: "Other" } ];   | const projectTypes = [   { value: "", label: "Select project type..." },   { value: "custom-software-development", label: "Custom Software Development" },   { value: "erp-solutions", label: "ERP & Odoo Solutions" },   { value: "business-automation", label: "Business Automation" },   { value: "ai-automation-agents", label: "AI Automation & Agents" },   { value: "cloud-devops", label: "Cloud & DevOps" },   { value: "other", label: "Other / Not Sure" }, ];   | C — fallback |
| src/pages/about.astro | We obsess over the details. Every pixel, every interaction, every line of code is crafted with intention and care. | We focus on the details that make systems dependable: clear workflows, reliable integrations and maintainable code. | A — company positioning / form taxonomy |
| src/components/sections/Values.astro | We obsess over the details. Every pixel, every interaction, every line of code is crafted with intention and care. | We focus on the details that make systems dependable: clear workflows, reliable integrations and maintainable code. | C — fallback |

Homepage H1 remains “Custom Software, ERP & Automation Systems for Growing Businesses”. Its existing operations-focused supporting paragraph is unchanged. About is the only H1 changed. The current global CMS footer already uses the approved company positioning; only its dormant code fallback required repair. No global SEO fallback was patched to solve an individual page problem.

## Keyword Ownership

| Page | Primary search intent |
| --- | --- |
| / | KP Infotech + broad B2B technology entity |
| /services/ | Navigation / broad five-pillar services |
| /services/custom-software-development/ | Custom software development company/services |
| /services/business-automation/ | Business process automation services |
| /services/erp-software/ | Odoo ERP implementation services/company |
| /services/ai-automation-agents/ | AI agent development/automation services |
| /services/cloud-devops/ | Cloud & DevOps services |
| /about/ | Company/entity/trust |
| /contact/ | Brand/contact/conversion |

Nine unique titles; no two pages intentionally target the same primary commercial title. Homepage and Services hub are broad entity/navigation pages, while each of the five service URLs retains distinct commercial ownership.

## Generic Language Removed

A: studio eyebrow, About hero and company-value description; B: shared service/industry/work CTAs and insight archive/article CTA headlines; C: footer, homepage eyebrow, About/Contact hero, Team and Values defaults. Exact source/replacement inventory is above.

D intentionally retained: About historical story paragraphs in `about.astro` and `OurStory.astro`; three historical/editorial blog-body matches in the CMS audit. E intentionally retained: `parseHighlightedText`/HighlightedText usage comments and the homepage legacy-string comparison guard. None of those comments or the guard renders as current positioning. Historical article copy and service bodies were not mechanically rewritten. `step-2-evidence/cms-language-audit.json` captures all four matching CMS occurrences (one company tagline changed, three editorial excerpts preserved).

**Evidence warning:** About still says “Official Odoo implementation and development partner, delivering enterprise ERP solutions with certified expertise.” Repository evidence includes references to an Odoo Learning Partner badge, which does not substantiate this broader current claim or certification. Flagged for business verification; no partnership evidence, certification, awards, client counts, or history invented.

## Contact Taxonomy

Legacy choices existed: UI/UX Design, Web Development, Mobile App, ERP Solution, Digital Marketing, Other. Current labels: Custom Software Development; ERP & Odoo Solutions; Business Automation; AI Automation & Agents; Cloud & DevOps; Other / Not Sure.

Backend is the current Cloudflare email endpoint, not the older documented HubSpot integration. `src/pages/api/contact.ts` reads free-text `project_type`, escapes it into email, and imposes no enum/mapping. `erp-solutions` and `other` values remain compatible; new capabilities use their service identifiers. `project_type` field name, FormData submission, endpoint, validation, CAPTCHA, rate limiting, success/error handling, and `generate_lead` event name/parameter shape remain unchanged. Category values now accurately identify current capabilities.

Tests execute the actual endpoint with a mocked EMAIL binding: all six options return success and reach the email payload; invalid input returns 400; email failure returns 500. No real inquiry/email was sent. Mobile selector opening, focus and keyboard selection were verified in the browser. End-to-end external email delivery is not claimed.

## Build/Test Results

- Fresh authenticated final production build: PASS (see build log evidence). Initial build failed on a dependency symlink; isolated dependency copy resolved it without source/config changes. One early command used the wrong Astro CLI path. Artifact checks attempted during an unfinished rebuild were superseded by the complete final run.
- Full `node --test tests/*.test.mjs`: **59/59 PASS, 0 failures, 0 skips** (includes 11 metadata/sitemap tests and two contact tests).
- `npm run seo:verify-redirects`: PASS, including built targets.
- Nine-page built metadata audit: PASS, zero errors; unique title/description, one canonical, indexable HTML, OG/Twitter consistency, H1 preservation and modern footer. SVG icon titles are excluded from document-title counting.
- Step 1C and Step 1E built audits: PASS.
- Local Step 1G HTTP/internal-link audit: PASS; 56 pages, 32 redirect checks, 63 removed-project checks, zero dead/legacy links.
- Local Step 1E HTTP audit: PASS for six restored articles and historical migration pairs.
- UI static audit strict: PASS, zero findings. Existing `docs/context/design-system.md` is the maintained design context; no redesign or token changes. No standalone formatter/typecheck command is configured.
- Browser: all nine routes checked at 390px and 1440px, no horizontal overflow or broken completed images. About mobile and Services desktop screenshots inspected; contact selector keyboard interaction passed. Browser plugin initialization failed; supported computer/browser fallback used.
- Credential scan across all generated artifacts: **0 occurrences**.
- Wrangler deployment dry run: PASS, generated bindings match existing configuration.
- `git diff --check`: PASS.

## Step 1 Regression

The exact pre-Step-2 sitemap URL set remains **56 pages** (57 HTML files including 404). All six restored articles and their schema/canonical checks pass. Historical redirects, five active case studies, 21 absent projects (63 path variants), normal sample-marketing 404, robots, canonicals, URL/trailing-slash policy, and internal links are preserved. No changes to Worker code, redirect files, case-study policy, GROQ queries, Sanity client/token handling, sitemap/robots logic, or Wrangler configuration.

## Deployment

- Application commit: `7d0fd2365d007e5f3e5c1707aba1815e4a41acb5`; reviewed diff committed and pushed to `main` before deployment.
- Worker: `website` in KP Infotech account `c727a19f93045d1c218d54f510af40c2`.
- Deployment ID: `44647632-84d9-4b66-b50c-3ad351f16fb2`.
- Version: `7f7284a8-5710-4bd0-9c35-34f44d52d6f2`, serving 100% at verification.
- Timestamp: `2026-09-17T05:07:50.314241Z` (**17 September 2026, 10:37:50 IST**).
- Mechanism: fresh authenticated build, full checks, clean main push, then normal `wrangler deploy` with adapter-generated configuration. A subsequent verification-only commit records final evidence and strengthens schema assertions; application source is unchanged.
- `kpinfo.tech` custom domain and SESSION namespace `2c096c90da704a4fb42c8734ae99cc2e` preserved. No runtime SANITY_API_TOKEN binding. No generated configuration override.
- Original mixed workspace was not deployed or altered; a copy of this report/evidence is supplied there for review.

## Production Verification

**PASS — zero errors.** Evidence: `step-2-evidence/metadata-production.json`, `step1-production.json`, and `deployment.json`.

| Check | Production result |
| --- | --- |
| Nine target pages | 9/9 HTTP 200; exact title/description; one canonical; indexable; OG/Twitter match |
| Company messaging | Modern eyebrow, Services introduction, About H1/supporting copy, Contact copy and taxonomy verified |
| H1 structure | One H1 on all nine; homepage and service H1s preserved; About changed intentionally |
| Schema | Organization identity preserved; five Service URLs and ContactPage URL match their canonical destinations |
| Layout | Browser checked all nine desktop pages; no horizontal overflow or broken completed images; About screenshot inspected |
| Restored articles | 6/6 HTTP 200, schema/canonical/indexability pass |
| Historical migrations | Eight historical migrations preserved; all 32 GET/HEAD/variant redirect checks pass (301 → 200) |
| Approved work | 5/5 active and in sitemap |
| Unsupported work | 21/21 absent; all 63 tested path variants return 404 |
| Sample marketing | Slash, slashless and query variants return 404 with no Location |
| Sitemap / robots | Exactly 56 canonical, indexable, final HTTP-200 URLs; sitemap matches build; robots valid |
| Internal links | Zero dead links; zero legacy/nonfinal links |

No URL additions, removals or redirect changes. No Step 3 work.

## Measurement Checkpoints

Deployment baseline date: **17 September 2026**. Checkpoints: **24 September** (7 days, crawl/snippet adoption); **1 October** (14 days, early CTR/query signals); **15 October** (28 days, proper GSC comparison); **12 November** (8 weeks); **10 December** (12 weeks). Track service-page impressions, non-brand commercial impressions, CTR, clicks, query relevance and brand CTR. No GSC settings were changed and no automatic monitoring task was created.

Google may take days or weeks to recrawl/reprocess pages and may rewrite titles/descriptions. This release establishes relevance and CTR foundations; it does not demonstrate immediate ranking improvement.

STEP 2 COMPLETE — AWAITING SEO REVIEW
