# KP Infotech Website Rebuild — Product Requirements Document

**Version:** 1.0  
**Date:** February 2026  
**Author:** Claude (for handoff to Claude Code)  
**Project:** Complete website redesign and rebuild

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Site Architecture](#4-site-architecture)
5. [Page Specifications](#5-page-specifications)
6. [Sanity CMS Schema](#6-sanity-cms-schema)
7. [Component Library](#7-component-library)
8. [Integrations](#8-integrations)
9. [SEO Requirements](#9-seo-requirements)
10. [Content Migration](#10-content-migration)
11. [Implementation Phases](#11-implementation-phases)

---

## 1. Executive Summary

### Project Overview

Rebuild kpinfo.tech from WordPress + Elementor to Astro + Sanity CMS. Transform brand positioning from "IT solutions provider" to "premium Design and Technology studio."

### Goals

1. **Performance** — Achieve 90+ Lighthouse scores (current: 61 mobile, 72 desktop)
2. **Brand elevation** — Premium, editorial design language
3. **Conversion focus** — Clear paths to contact
4. **Maintainability** — Non-technical team can update content via Sanity Studio
5. **SEO foundation** — Proper technical SEO, preserve existing (minimal) rankings

### Current State

| Metric | Value |
|--------|-------|
| Platform | WordPress + Elementor |
| Pages | 16 core pages + 80 blog posts |
| Organic clicks (3 months) | ~157 total |
| Performance score (mobile) | 61/100 |
| Primary issue | Speed (13.8s LCP on mobile) |

### Target State

| Metric | Target |
|--------|--------|
| Platform | Astro + Sanity + Vercel |
| Performance score | 90+ |
| LCP | <2.5s |
| Time to Interactive | <3.9s |

---

## 2. Tech Stack

### Core Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Astro 4.x | Static site generation, partial hydration |
| **CMS** | Sanity v3 | Headless content management |
| **Hosting** | Vercel | Deployment, CDN, edge functions |
| **Styling** | Tailwind CSS 3.x | Utility-first CSS |
| **Animations** | GSAP + ScrollTrigger | Scroll-driven animations |
| **Forms** | HubSpot Forms | Lead capture, CRM integration |
| **Analytics** | GA4 + Vercel Analytics | Traffic analysis + Core Web Vitals |

### Package Dependencies

```json
{
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/tailwind": "^5.x",
    "@astrojs/vercel": "^7.x",
    "@sanity/client": "^6.x",
    "@sanity/image-url": "^1.x",
    "@portabletext/astro": "^0.x",
    "gsap": "^3.12.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x",
    "@fontsource/playfair-display": "^5.x",
    "@fontsource/outfit": "^5.x"
  }
}
```

### Deployment Configuration

- **Build trigger:** Git push to main + Sanity webhook
- **Preview:** Vercel preview deployments on PR
- **Production:** Vercel production on merge to main
- **Revalidation:** On-demand ISR via Sanity webhook (or full rebuild if simpler)

---

## 3. Design System

### Brand Direction

**Style:** Dark Editorial (Refined)  
**Tone:** Bold, confident, premium, exclusive  
**Position:** Design and Technology studio serving startups and businesses

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0a;
  --bg-secondary: #0f0f0f;
  --bg-tertiary: #161616;
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #6b6b6b;
  --text-muted: #3a3a3a;
  
  /* Accent (Warm Gold) */
  --accent: #c9a87c;
  --accent-light: #e4d4bc;
  --accent-dim: #8b7355;
  
  /* Borders */
  --border: #1a1a1a;
  --border-light: #2a2a2a;
  
  /* Utility */
  --success: #4ade80;
  --error: #f87171;
}
```

### Typography

| Element | Font | Size | Weight | Letter Spacing |
|---------|------|------|--------|----------------|
| Hero H1 | Playfair Display | `clamp(3rem, 8vw, 5.5rem)` | 500 | `-0.02em` |
| Section H2 | Playfair Display | `clamp(2.5rem, 5vw, 4rem)` | 500 | `normal` |
| Card H3 | Playfair Display | `1.5rem - 2rem` | 400 | `normal` |
| Body | Outfit | `1rem` | 300 | `normal` |
| Label | Outfit | `0.6875rem` | 400 | `0.25em` |
| Button | Outfit | `0.75rem` | 400 | `0.1875em` |

**Font loading:** Self-host via `@fontsource` packages for performance.

### Spacing Scale

Based on 8px grid:

```javascript
spacing: {
  'xs': '8px',
  'sm': '12px',
  'md': '16px',
  'lg': '24px',
  'xl': '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '128px',
}
```

### Tailwind Config Extension

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
          dim: 'var(--accent-dim)',
        },
        border: {
          DEFAULT: 'var(--border)',
          light: 'var(--border-light)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
}
```

### Animation Specifications

**Library:** GSAP + ScrollTrigger

**Core easing:**
- Primary: `power3.out`
- Image reveals: `power3.inOut`
- Elastic (buttons): `elastic.out(1, 0.5)`

**Standard animations:**

| Animation | Trigger | Properties |
|-----------|---------|------------|
| Fade Up | Element enters 80% viewport | `opacity: 0→1, y: 60→0, duration: 0.8s` |
| Text Reveal | On load or scroll | `translateY: 100%→0, rotate: 3→0, stagger: 0.08s` |
| Image Reveal | Element enters 75% viewport | `scaleX: 1→0 (overlay), duration: 1.2s` |
| Counter | Element enters 85% viewport | Count from 0, duration: 2s, snap integers |
| Magnetic Button | Mouse move | Translate toward cursor by 15%, elastic return |

**Reduced motion:** Disable all animations when `prefers-reduced-motion: reduce`.

---

## 4. Site Architecture

### Navigation Structure

```
Primary Nav:
┌─────────────────────────────────────────────────────────────┐
│  [LOGO]           Work  Services  Industries  About  Insights  [Contact]  │
└─────────────────────────────────────────────────────────────┘
```

| Item | URL | Type |
|------|-----|------|
| Work | `/work/` | Link |
| Services | `/services/` | Link (or mega menu) |
| Industries | `/industries/` | Link |
| About | `/about/` | Link |
| Insights | `/insights/` | Link |
| Contact | `/contact/` | CTA Button |

### Complete Sitemap

```
kpinfo.tech/
│
├── / (Homepage)
│
├── /work/
│   └── /work/[case-study-slug]/
│
├── /services/
│   ├── /services/ui-ux-design/
│   ├── /services/web-development/
│   ├── /services/mobile-apps/
│   ├── /services/erp-solutions/
│   └── /services/digital-marketing/
│
├── /industries/
│   ├── /industries/healthcare/
│   ├── /industries/retail-ecommerce/
│   ├── /industries/manufacturing/
│   ├── /industries/logistics/
│   ├── /industries/finance/
│   └── /industries/startups/
│
├── /about/
│
├── /insights/
│   ├── /insights/[post-slug]/
│   └── /insights/category/[category-slug]/
│
├── /contact/
│
├── /careers/
│
├── /privacy-policy/
│
└── /terms-of-service/
```

### URL Patterns

| Content Type | Pattern | Example |
|--------------|---------|---------|
| Homepage | `/` | kpinfo.tech/ |
| Service | `/services/[slug]/` | /services/ui-ux-design/ |
| Industry | `/industries/[slug]/` | /industries/healthcare/ |
| Case study | `/work/[slug]/` | /work/fintech-mobile-app/ |
| Blog post | `/insights/[slug]/` | /insights/node-js-frameworks/ |
| Blog category | `/insights/category/[slug]/` | /insights/category/development/ |

---

## 5. Page Specifications

### 5.1 Homepage (/)

**Purpose:** Introduce brand, establish premium positioning, drive to services/contact

**Sections:**

| # | Section | Content | Data Source |
|---|---------|---------|-------------|
| 1 | Hero | H1: "We craft digital experiences", tagline, primary CTA, hero image | Static |
| 2 | Services Marquee | Scrolling service names | Static |
| 3 | Featured Work | 2-4 case study cards | Sanity: caseStudy (featured) |
| 4 | Services Grid | 4-5 service cards with icons | Sanity: service |
| 5 | Stats | 4 key metrics (projects, clients, years, etc.) | Sanity: siteSettings |
| 6 | Industries | Industry cards or list | Sanity: industry |
| 7 | Testimonial | Featured client quote | Sanity: testimonial (featured) |
| 8 | CTA | "Start a project" with contact link | Static |

**SEO:**
- Title: "KP Infotech — UI/UX Design Consultancy"
- Meta description: ~155 chars about services and value prop
- Schema: Organization, WebSite

---

### 5.2 Work (Portfolio) (/work/)

**Purpose:** Showcase portfolio, build credibility

**Features:**
- Grid of case study cards
- Filter by service type (optional, can add later)
- Each card: image, title, client, year, service tags

**Data Source:** Sanity: caseStudy[]

**SEO:**
- Title: "Our Work — KP Infotech"
- Schema: ItemList of case studies

---

### 5.3 Case Study (/work/[slug]/)

**Purpose:** Deep dive into project, demonstrate expertise

**Sections:**

| # | Section | Content |
|---|---------|---------|
| 1 | Hero | Project title, client, year, service tags, hero image |
| 2 | Overview | Challenge, approach, results summary |
| 3 | Content | Rich text body with images |
| 4 | Results | Metrics/outcomes (optional) |
| 5 | Testimonial | Client quote (optional) |
| 6 | Next Project | Link to another case study |

**Data Source:** Sanity: caseStudy

**SEO:**
- Title: "[Project Name] — KP Infotech"
- Schema: CreativeWork

---

### 5.4 Services Index (/services/)

**Purpose:** Overview of all services

**Layout:** Accordion Reveal — numbered list rows with expand-on-click. Each row shows step number, service title, tagline, and chevron. Expanded panel contains description + technology tags on left, framed 16:9 hero image thumbnail on right. Atmospheric full-bleed background image behind each item (opacity 0 → 0.15 on hover → 0.2 on open, with left-to-right gradient overlay). View Transitions connect thumbnails and titles to service detail pages.

**Data Source:** Sanity: service[]

---

### 5.5 Service Detail (/services/[slug]/)

**Purpose:** Explain specific service, drive to contact

**Sections:**

| # | Section | Content |
|---|---------|---------|
| 1 | Hero | Service name, tagline, intro paragraph |
| 2 | What We Do | Service description, key offerings |
| 3 | Process | Blueprint-style 2-column grid with dashed-border cards, corner bracket markers, ghost step numbers, duration dimension lines, and hover-activated deliverables spec panels |
| 4 | Technologies | Tech stack badges/icons |
| 5 | Related Work | 2-3 relevant case studies |
| 6 | FAQ | Service-specific questions (accordion) |
| 7 | CTA | "Discuss your project" |

**Services to create:**

| Service | Slug | Replaces |
|---------|------|----------|
| UI/UX Design | `ui-ux-design` | graphics-design |
| Web Development | `web-development` | website-design |
| Mobile Apps | `mobile-apps` | mobile-web-app |
| ERP Solutions | `erp-solutions` | erp-software + odoo-crm |
| Digital Marketing | `digital-marketing` | marketing |

**Data Source:** Sanity: service

**SEO:**
- Title: "[Service Name] — KP Infotech"
- Schema: Service

---

### 5.6 Industries Index (/industries/)

**Purpose:** Show industry expertise, help visitors self-identify

**Layout:** Grid of industry cards with icons/images

**Data Source:** Sanity: industry[]

---

### 5.7 Industry Detail (/industries/[slug]/)

**Purpose:** Industry-specific value proposition

**Sections:**

| # | Section | Content |
|---|---------|---------|
| 1 | Hero | Industry name, tagline, hero image |
| 2 | Challenges | Common industry challenges we solve |
| 3 | Solutions | How our services address them |
| 4 | Related Work | Case studies in this industry |
| 5 | CTA | "Work with us" |

**Industries to create:**

| Industry | Slug |
|----------|------|
| Healthcare | `healthcare` |
| Retail & E-commerce | `retail-ecommerce` |
| Manufacturing | `manufacturing` |
| Logistics | `logistics` |
| Finance | `finance` |
| Startups & SMEs | `startups` |

**Data Source:** Sanity: industry

---

### 5.8 About (/about/)

**Purpose:** Tell company story, build trust

**Sections:**

| # | Section | Content |
|---|---------|---------|
| 1 | Hero | "Who we are" headline |
| 2 | Our Story | Founders narrative (Poojan & Krupa), company journey |
| 3 | Values | 4 core values with descriptions |
| 4 | Team | Team member cards (HIDDEN at launch, schema ready) |
| 5 | Certifications | Odoo partner badge, etc. |
| 6 | CTA | "Work with us" |

**Data Source:** Sanity: aboutPage, teamMember[] (hidden), certification[]

---

### 5.9 Insights (Blog) (/insights/)

**Purpose:** Blog/resource hub, SEO content

**Features:**
- Grid of article cards
- Category filter
- Pagination (12 per page)
- Each card: featured image, title, category, date, excerpt

**Data Source:** Sanity: blogPost[]

**SEO:**
- Title: "Insights — KP Infotech"
- Schema: Blog

---

### 5.10 Blog Post (/insights/[slug]/)

**Purpose:** Individual article

**Sections:**

| # | Section | Content |
|---|---------|---------|
| 1 | Hero | Title, category, date, author, reading time |
| 2 | Featured Image | Hero image |
| 3 | Content | Portable Text body |
| 4 | Author | Author bio card |
| 5 | Related Posts | 2-3 related articles |
| 6 | CTA | Newsletter signup or contact |

**Data Source:** Sanity: blogPost

**SEO:**
- Title: "[Post Title] — KP Infotech"
- Schema: Article

---

### 5.11 Blog Category (/insights/category/[slug]/)

**Purpose:** Filtered blog listing

**Categories:**

| Category | Slug | Example Posts |
|----------|------|---------------|
| Development | `development` | node-js-frameworks, database-design |
| Cloud & DevOps | `cloud-devops` | cloud-deployment-models, best-practices-devops |
| ERP & Business | `erp-business` | odoo-erp-complete-guide, erp-implementation |
| Design | `design` | modern-website-design-ideas, brand-style-guide |
| Marketing | `marketing` | best-seo-tools, digital-marketing-strategy |
| Mobile | `mobile` | mobile-app-monetization, app-development-tips |

---

### 5.12 Contact (/contact/)

**Purpose:** Primary conversion page

**Sections:**

| # | Section | Content |
|---|---------|---------|
| 1 | Hero | "Let's talk" headline, intro text |
| 2 | Form | HubSpot embedded form |
| 3 | Contact Info | Email, phone, location |
| 4 | Social Links | LinkedIn, Twitter, etc. |

**Form Fields:**
- Name (required)
- Email (required)
- Phone (optional)
- Company (optional)
- Project Type (dropdown: UI/UX Design, Web Development, Mobile App, ERP, Marketing, Other)
- Budget Range (dropdown: <$5k, $5-15k, $15-50k, $50k+, Not sure)
- Message (required)

**Data Source:** Static + Sanity: siteSettings (contact info)

---

### 5.13 Careers (/careers/)

**Purpose:** Attract talent

**Sections:**

| # | Section | Content |
|---|---------|---------|
| 1 | Hero | "Join our team" headline |
| 2 | Culture | Why work at KP Infotech |
| 3 | Benefits | Perks list |
| 4 | Open Positions | Job listing cards |
| 5 | Application | Link to apply or embedded form |

**Data Source:** Sanity: jobListing[]

---

### 5.14 Legal Pages

**/privacy-policy/** and **/terms-of-service/**

Simple rich text pages from Sanity.

---

## 6. Sanity CMS Schema

### 6.1 Document Types

```typescript
// schemas/service.ts
export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'tagline', type: 'string', title: 'Tagline' },
    { name: 'excerpt', type: 'text', title: 'Excerpt', rows: 3 },
    { name: 'iconName', type: 'string', title: 'Icon Name (Lucide)' },
    { name: 'iconCustom', type: 'image', title: 'Custom Icon (SVG)' },
    { name: 'heroImage', type: 'image', title: 'Hero Image' },
    { name: 'contentHeading', type: 'string', title: 'Content Section Heading' },  // *asterisks* for highlight
    { name: 'content', type: 'array', of: [{ type: 'richText' }, { type: 'image' }], title: 'Content' },
    { name: 'processHeading', type: 'string', title: 'Process Section Heading' },
    { name: 'process', type: 'array', of: [{ type: 'processStep' }], title: 'Process Steps' },
    { name: 'techHeading', type: 'string', title: 'Technologies Section Heading' },
    { name: 'technologies', type: 'array', of: [{ type: 'string' }], title: 'Technologies' },
    { name: 'faqHeading', type: 'string', title: 'FAQ Section Heading' },
    { name: 'faqs', type: 'array', of: [{ type: 'faqItem' }], title: 'FAQs' },
    { name: 'workHeading', type: 'string', title: 'Related Work Section Heading' },
    { name: 'relatedWork', type: 'array', of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }] },
    { name: 'seoTitle', type: 'string', title: 'SEO Title' },
    { name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 2 },
    { name: 'order', type: 'number', title: 'Display Order' },
  ],
}

// schemas/industry.ts
export default {
  name: 'industry',
  title: 'Industry',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'tagline', type: 'string', title: 'Tagline' },
    { name: 'excerpt', type: 'text', title: 'Excerpt', rows: 3 },
    { name: 'icon', type: 'string', title: 'Icon Name' },
    { name: 'heroImage', type: 'image', title: 'Hero Image' },
    { name: 'challenges', type: 'array', of: [{ type: 'block' }], title: 'Industry Challenges' },
    { name: 'solutions', type: 'array', of: [{ type: 'block' }], title: 'Our Solutions' },
    { name: 'relatedWork', type: 'array', of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }] },
    { name: 'relatedServices', type: 'array', of: [{ type: 'reference', to: [{ type: 'service' }] }] },
    { name: 'seoTitle', type: 'string', title: 'SEO Title' },
    { name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 2 },
    { name: 'order', type: 'number', title: 'Display Order' },
  ],
}

// schemas/caseStudy.ts
export default {
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Project Title' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'client', type: 'string', title: 'Client Name' },
    { name: 'year', type: 'string', title: 'Year' },
    { name: 'featured', type: 'boolean', title: 'Featured on Homepage' },
    { name: 'heroImage', type: 'image', title: 'Hero Image' },
    { name: 'thumbnailImage', type: 'image', title: 'Thumbnail Image' },
    { name: 'excerpt', type: 'text', title: 'Excerpt', rows: 3 },
    { name: 'challenge', type: 'array', of: [{ type: 'block' }], title: 'Challenge' },
    { name: 'approach', type: 'array', of: [{ type: 'block' }], title: 'Approach' },
    { name: 'content', type: 'portableText', title: 'Full Content' },
    { name: 'results', type: 'array', of: [{ type: 'resultMetric' }], title: 'Results' },
    { name: 'testimonial', type: 'reference', to: [{ type: 'testimonial' }] },
    { name: 'services', type: 'array', of: [{ type: 'reference', to: [{ type: 'service' }] }] },
    { name: 'industries', type: 'array', of: [{ type: 'reference', to: [{ type: 'industry' }] }] },
    { name: 'seoTitle', type: 'string', title: 'SEO Title' },
    { name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 2 },
  ],
}

// schemas/blogPost.ts
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'category', type: 'reference', to: [{ type: 'blogCategory' }] },
    { name: 'author', type: 'reference', to: [{ type: 'teamMember' }] },
    { name: 'publishedAt', type: 'datetime', title: 'Published At' },
    { name: 'featuredImage', type: 'image', title: 'Featured Image' },
    { name: 'excerpt', type: 'text', title: 'Excerpt', rows: 3 },
    { name: 'content', type: 'portableText', title: 'Content' },
    { name: 'relatedPosts', type: 'array', of: [{ type: 'reference', to: [{ type: 'blogPost' }] }] },
    { name: 'seoTitle', type: 'string', title: 'SEO Title' },
    { name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 2 },
  ],
}

// schemas/blogCategory.ts
export default {
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', type: 'text', title: 'Description', rows: 2 },
  ],
}

// schemas/teamMember.ts
export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'role', type: 'string', title: 'Role' },
    { name: 'photo', type: 'image', title: 'Photo' },
    { name: 'bio', type: 'text', title: 'Bio', rows: 3 },
    { name: 'linkedin', type: 'url', title: 'LinkedIn URL' },
    { name: 'twitter', type: 'url', title: 'Twitter URL' },
    { name: 'visible', type: 'boolean', title: 'Visible on Site', initialValue: false },
    { name: 'order', type: 'number', title: 'Display Order' },
  ],
}

// schemas/testimonial.ts
export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    { name: 'quote', type: 'text', title: 'Quote', rows: 4 },
    { name: 'authorName', type: 'string', title: 'Author Name' },
    { name: 'authorRole', type: 'string', title: 'Author Role' },
    { name: 'company', type: 'string', title: 'Company' },
    { name: 'companyLogo', type: 'image', title: 'Company Logo' },
    { name: 'authorPhoto', type: 'image', title: 'Author Photo' },
    { name: 'featured', type: 'boolean', title: 'Featured on Homepage' },
  ],
}

// schemas/jobListing.ts
export default {
  name: 'jobListing',
  title: 'Job Listing',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Job Title' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'type', type: 'string', title: 'Employment Type', options: { list: ['Full-time', 'Part-time', 'Contract', 'Remote'] } },
    { name: 'location', type: 'string', title: 'Location' },
    { name: 'department', type: 'string', title: 'Department' },
    { name: 'description', type: 'portableText', title: 'Description' },
    { name: 'requirements', type: 'array', of: [{ type: 'string' }], title: 'Requirements' },
    { name: 'applicationUrl', type: 'url', title: 'Application URL' },
    { name: 'active', type: 'boolean', title: 'Active', initialValue: true },
  ],
}

// schemas/siteSettings.ts (singleton)
export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'siteName', type: 'string', title: 'Site Name' },
    { name: 'siteTagline', type: 'string', title: 'Site Tagline' },
    { name: 'heroHeadline', type: 'string', title: 'Hero Headline' },
    { name: 'logo', type: 'image', title: 'Logo' },
    { name: 'logoLight', type: 'image', title: 'Logo (Light Version)' },
    { name: 'contactEmail', type: 'string', title: 'Contact Email' },
    { name: 'contactPhone', type: 'string', title: 'Contact Phone' },
    { name: 'address', type: 'text', title: 'Address', rows: 3 },
    { name: 'socialLinks', type: 'object', fields: [
      { name: 'linkedin', type: 'url', title: 'LinkedIn' },
      { name: 'twitter', type: 'url', title: 'Twitter' },
      { name: 'instagram', type: 'url', title: 'Instagram' },
      { name: 'dribbble', type: 'url', title: 'Dribbble' },
    ]},
    { name: 'stats', type: 'array', of: [{ type: 'statItem' }], title: 'Homepage Stats' },
    { name: 'footerText', type: 'text', title: 'Footer Description', rows: 2 },
    { name: 'defaultSeoTitle', type: 'string', title: 'Default SEO Title' },
    { name: 'defaultSeoDescription', type: 'text', title: 'Default SEO Description', rows: 2 },
    { name: 'defaultOgImage', type: 'image', title: 'Default OG Image' },
  ],
}
```

### 6.2 Object Types

```typescript
// schemas/objects/richText.tsx — shared Portable Text block with highlight decorator
export default {
  name: 'richText',
  type: 'block',
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
      { title: 'Underline', value: 'underline' },
      { title: 'Strike', value: 'strike-through' },
      { title: 'Code', value: 'code' },
      { title: 'Highlight', value: 'highlight', icon: HighlightIcon, component: HighlightDecorator },
    ],
  },
}
// Note: All schemas use { type: 'richText' } instead of { type: 'block' } for Portable Text fields.
// The 'highlight' decorator renders as accent color (#c9a87c) in both Sanity Studio and frontend.

// schemas/objects/processStep.ts
export default {
  name: 'processStep',
  title: 'Process Step',
  type: 'object',
  fields: [
    { name: 'stepNumber', type: 'number', title: 'Step Number' },
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'description', type: 'text', title: 'Description', rows: 2 },
    { name: 'duration', type: 'string', title: 'Duration' },         // e.g. "2-3 Weeks"
    { name: 'deliverables', type: 'array', of: [{ type: 'string' }], title: 'Deliverables' },
  ],
}

// schemas/objects/faqItem.ts
export default {
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    { name: 'question', type: 'string', title: 'Question' },
    { name: 'answer', type: 'array', of: [{ type: 'block' }], title: 'Answer' },
  ],
}

// schemas/objects/resultMetric.ts
export default {
  name: 'resultMetric',
  title: 'Result Metric',
  type: 'object',
  fields: [
    { name: 'value', type: 'string', title: 'Value (e.g., "70%")' },
    { name: 'label', type: 'string', title: 'Label (e.g., "Cost Reduction")' },
  ],
}

// schemas/objects/statItem.ts
export default {
  name: 'statItem',
  title: 'Stat Item',
  type: 'object',
  fields: [
    { name: 'number', type: 'string', title: 'Number (e.g., "150+")' },
    { name: 'label', type: 'string', title: 'Label' },
  ],
}
```

---

## 7. Component Library

### Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| `Layout` | `layouts/Layout.astro` | Base HTML, head, scripts |
| `Navigation` | `components/Navigation.astro` | Header nav, mobile menu |
| `Footer` | `components/Footer.astro` | Site footer |
| `SEO` | `components/SEO.astro` | Meta tags, OG, schema |

### UI Components

| Component | File | Props |
|-----------|------|-------|
| `Button` | `components/ui/Button.astro` | `variant: 'primary' \| 'secondary' \| 'text'`, `href`, `icon` |
| `SectionLabel` | `components/ui/SectionLabel.astro` | `text` |
| `Tag` | `components/ui/Tag.astro` | `text`, `href` |
| `Input` | `components/ui/Input.astro` | `type`, `placeholder`, `required` |
| `Textarea` | `components/ui/Textarea.astro` | `placeholder`, `rows` |

### Section Components

| Component | File | Props |
|-----------|------|-------|
| `Hero` | `components/sections/Hero.astro` | `title`, `subtitle`, `cta`, `image` |
| `ServicesMarquee` | `components/sections/ServicesMarquee.astro` | `items[]` |
| `ServicesGrid` | `components/sections/ServicesGrid.astro` | `services[]` |
| `WorkGrid` | `components/sections/WorkGrid.astro` | `projects[]` |
| `StatsSection` | `components/sections/StatsSection.astro` | `stats[]` |
| `Testimonial` | `components/sections/Testimonial.astro` | `quote`, `author`, `company` |
| `CTASection` | `components/sections/CTASection.astro` | `title`, `buttonText`, `href` |
| `FAQAccordion` | `components/sections/FAQAccordion.astro` | `faqs[]` |

### Card Components

| Component | File | Props |
|-----------|------|-------|
| `ServiceCard` | `components/cards/ServiceCard.astro` | `number`, `title`, `description`, `href` |
| `WorkCard` | `components/cards/WorkCard.astro` | `title`, `client`, `year`, `image`, `tags[]`, `href` |
| `BlogCard` | `components/cards/BlogCard.astro` | `title`, `excerpt`, `date`, `category`, `image`, `href` |
| `TeamCard` | `components/cards/TeamCard.astro` | `name`, `role`, `photo`, `linkedin` |
| `IndustryCard` | `components/cards/IndustryCard.astro` | `title`, `icon`, `excerpt`, `href` |

### Animation Components

| Component | File | Purpose |
|-----------|------|---------|
| `ScrollProgress` | `components/effects/ScrollProgress.astro` | Top progress bar |
| `CustomCursor` | `components/effects/CustomCursor.astro` | Custom cursor (desktop) |
| `GrainOverlay` | `components/effects/GrainOverlay.astro` | Subtle texture |
| `ImageReveal` | `components/effects/ImageReveal.astro` | Animated image reveal |
| `TextReveal` | `components/effects/TextReveal.astro` | Animated text reveal |
| `FadeUp` | `components/effects/FadeUp.astro` | Scroll-triggered fade up |
| `Counter` | `components/effects/Counter.astro` | Animated number counter |

---

## 8. Integrations

### 8.1 HubSpot Forms

**Setup:**
1. Create HubSpot account (free tier)
2. Create form in HubSpot Forms tool
3. Get embed code or use HubSpot Forms API

**Implementation options:**

Option A: Embed code (simpler)
```html
<!-- In Contact page -->
<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    region: "na1",
    portalId: "YOUR_PORTAL_ID",
    formId: "YOUR_FORM_ID",
    css: "" // Disable default styles
  });
</script>
```

Option B: API submission (more control over styling)
```typescript
// POST to HubSpot API
const response = await fetch(
  `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: [
        { name: 'email', value: formData.email },
        { name: 'firstname', value: formData.name },
        // ...
      ],
    }),
  }
);
```

**Recommended:** Option B for full styling control matching design system.

### 8.2 Google Analytics 4

**Setup:**
1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXX)

**Implementation:**

```html
<!-- In Layout.astro <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

**Events to track:**
- Contact form submission
- CTA button clicks
- Case study views
- Blog post reads (scroll depth)

### 8.3 Vercel Analytics

**Setup:**
```bash
npm install @vercel/analytics
```

**Implementation:**
```typescript
// In Layout.astro
import { Analytics } from '@vercel/analytics/astro';

// In body
<Analytics />
```

Automatically tracks Core Web Vitals and page views.

### 8.4 Sanity Webhook (for Rebuilds)

**Vercel deploy hook:**
1. In Vercel project settings → Git → Deploy Hooks
2. Create hook for main branch
3. Copy webhook URL

**Sanity webhook:**
1. In Sanity project → API → Webhooks
2. Create webhook pointing to Vercel deploy hook URL
3. Trigger on: Create, Update, Delete
4. Filter to relevant document types

---

## 9. SEO Requirements

### 9.1 Technical SEO

| Requirement | Implementation |
|-------------|----------------|
| **HTTPS** | Vercel handles automatically |
| **XML Sitemap** | Generate at `/sitemap.xml` using `@astrojs/sitemap` |
| **robots.txt** | Static file in `/public/robots.txt` |
| **Canonical tags** | Auto-generate in SEO component |
| **Hreflang** | Not needed (English only) |
| **Structured data** | JSON-LD in each page type |

### 9.2 robots.txt

```
User-agent: *
Allow: /

Sitemap: https://kpinfo.tech/sitemap.xml
```

### 9.3 Schema Markup

| Page Type | Schema |
|-----------|--------|
| Homepage | Organization, WebSite |
| Service | Service |
| Case Study | CreativeWork |
| Blog Post | Article |
| Blog Index | Blog |
| About | Organization |
| Contact | ContactPage |
| FAQ sections | FAQPage |

### 9.4 Meta Tag Template

```html
<title>{pageTitle} — KP Infotech</title>
<meta name="description" content="{pageDescription}" />
<link rel="canonical" href="{canonicalUrl}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="{pageTitle}" />
<meta property="og:description" content="{pageDescription}" />
<meta property="og:image" content="{ogImage}" />
<meta property="og:url" content="{canonicalUrl}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{pageTitle}" />
<meta name="twitter:description" content="{pageDescription}" />
<meta name="twitter:image" content="{ogImage}" />
```

### 9.5 Redirects

**Critical redirects (must implement):**

```
# vercel.json or _redirects file

# Service pages
/services/erp-software/ → /services/erp-solutions/ 301
/services/erp-software/odoo-crm/ → /services/erp-solutions/ 301
/services/website-design/ → /services/web-development/ 301
/services/mobile-web-app/ → /services/mobile-apps/ 301
/services/graphics-design/ → /services/ui-ux-design/ 301
/services/marketing/ → /services/digital-marketing/ 301

# Hire pages (redirect to relevant service)
/hire-wordpress-developer/ → /services/web-development/ 301
/hire-laravel-developer/ → /services/web-development/ 301
/hire-react-js-developer/ → /services/web-development/ 301

# Blog moves to /insights/
/node-js-frameworks/ → /insights/node-js-frameworks/ 301
/database-design-best-practices/ → /insights/database-design-best-practices/ 301
/inventory-management-best-practices/ → /insights/inventory-management-best-practices/ 301
/cloud-deployment-models-diagram/ → /insights/cloud-deployment-models-diagram/ 301
# ... (all migrated blog posts)

# Old pages
/kp-infotech-faqs/ → /services/ 301
/casestudy/ → /work/ 301
```

---

## 10. Content Migration

### 10.1 Blog Posts

**Total posts:** 80+  
**Action:** Keep ~30, remove ~50

**Posts to migrate (have organic value):**

| Post Slug | Clicks | Category |
|-----------|--------|----------|
| node-js-frameworks | 28 | Development |
| database-design-best-practices | 10 | Development |
| inventory-management-best-practices | 7 | ERP & Business |
| cloud-deployment-models-diagram | 7 | Cloud & DevOps |
| best-seo-tools-for-small-businesses | 5 | Marketing |
| mobile-app-monetization-strategies | 5 | Mobile |
| odoo-erp-complete-guide | 2 | ERP & Business |
| minimum-viable-product-examples | 4 | Development |
| erp-implementation-cost | 3 | ERP & Business |
| scalable-system-architecture | 3 | Development |
| best-hr-software-for-startups | 1 | ERP & Business |
| best-web-application-frameworks | 1 | Development |
| angular-vs-react | 1 | Development |
| erp-for-retail-stores | 1 | ERP & Business |

**Plus:** Any posts published in last 6 months (even if no clicks yet).

**Posts to remove:** All others with 0 clicks and older than 6 months. Do not migrate — let old URLs 404 or redirect to `/insights/`.

### 10.2 Service Content

| Old Page | New Page | Migration Notes |
|----------|----------|-----------------|
| /services/website-design/ | /services/web-development/ | Rewrite completely in new voice |
| /services/mobile-web-app/ | /services/mobile-apps/ | Rewrite completely |
| /services/erp-software/ + /odoo-crm/ | /services/erp-solutions/ | Combine and rewrite |
| /services/graphics-design/ | /services/ui-ux-design/ | Elevate positioning, rewrite |
| /services/marketing/ | /services/digital-marketing/ | Rewrite completely |

### 10.3 Case Studies

**Current:** 1 case study (cloud cost reduction)

**Migrate as-is, add schema for more.**

### 10.4 Content Rewriting Notes

**Current voice issues:**
- Too generic ("IT solutions provider")
- Overuse of buzzwords
- Inconsistent AI mentions across pages

**New voice:**
- Premium, confident
- Focus on design craft and outcomes
- Consistent across all pages

---

## 11. Implementation Phases

### Phase 1: Foundation (Week 1-2)

- [ ] Set up Astro project
- [ ] Configure Tailwind with design system tokens
- [ ] Set up Sanity project and schemas
- [ ] Implement base layout (nav, footer)
- [ ] Create SEO component
- [ ] Set up Vercel deployment

### Phase 2: Core Pages (Week 2-3)

- [ ] Homepage
- [ ] About page
- [ ] Contact page (with HubSpot form)
- [ ] 404 page

### Phase 3: Services (Week 3-4) ✅

- [x] Services index page (Accordion Reveal layout with View Transitions)
- [x] 5 service detail pages (dynamic route)
- [x] Service sections: Hero (PageHero), Content (PortableText + images + highlight), Process (Blueprint grid), Tech (Marquee), Related Work (Featured + Grid), FAQ (Side-by-Side accordion), CTA
- [x] richText schema type with custom Highlight decorator (accent color in Studio + frontend)
- [x] processStep schema updated with duration and deliverables fields

### Phase 4: Industries (Week 4)

- [ ] Industries index page
- [ ] 6 industry detail pages
- [ ] Industry cards component

### Phase 5: Portfolio (Week 4-5)

- [ ] Work index page
- [ ] Case study template
- [ ] Migrate existing case study
- [ ] Work cards component

### Phase 6: Blog (Week 5-6)

- [ ] Insights index page
- [ ] Blog post template
- [ ] Blog category pages
- [ ] Migrate ~30 blog posts to Sanity
- [ ] Blog cards component

### Phase 7: Polish (Week 6-7)

- [ ] Careers page
- [ ] Legal pages (privacy, terms)
- [ ] All GSAP animations
- [ ] Custom cursor
- [ ] Scroll progress
- [ ] Image optimization
- [ ] Performance audit

### Phase 8: Launch (Week 7-8)

- [ ] Set up redirects
- [ ] GA4 + Vercel Analytics
- [ ] Test all forms
- [ ] Test all pages on mobile
- [ ] Lighthouse audit (target 90+)
- [ ] Final content review
- [ ] DNS cutover

### Phase 9: Content Overhaul (Post-Launch or Pre-Launch TBD)

- [ ] Revisit and potentially change the current 5 services (new set, renamed, or restructured)
- [ ] Remove all existing case studies from Sanity
- [ ] Create 3-4 high-quality case studies per service (~15-20 total) — each should be detailed and solid
- [ ] Review and rework blog/insights content strategy (decide whether to migrate old WordPress posts or start fresh)
- [ ] Populate Sanity with final content for all document types

---

## Appendix A: File Structure

```
kpinfo-website/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
├── vercel.json
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
│       └── og-default.jpg
│
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   ├── components/
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── SEO.astro
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.astro
│   │   │   ├── SectionLabel.astro
│   │   │   ├── Tag.astro
│   │   │   ├── Input.astro
│   │   │   └── Textarea.astro
│   │   │
│   │   ├── cards/
│   │   │   ├── ServiceCard.astro
│   │   │   ├── WorkCard.astro
│   │   │   ├── BlogCard.astro
│   │   │   ├── TeamCard.astro
│   │   │   └── IndustryCard.astro
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.astro
│   │   │   ├── ServicesMarquee.astro
│   │   │   ├── ServicesGrid.astro
│   │   │   ├── WorkGrid.astro
│   │   │   ├── StatsSection.astro
│   │   │   ├── Testimonial.astro
│   │   │   ├── CTASection.astro
│   │   │   └── FAQAccordion.astro
│   │   │
│   │   └── effects/
│   │       ├── ScrollProgress.astro
│   │       ├── CustomCursor.astro
│   │       ├── GrainOverlay.astro
│   │       ├── ImageReveal.astro
│   │       ├── TextReveal.astro
│   │       ├── FadeUp.astro
│   │       └── Counter.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── careers.astro
│   │   ├── privacy-policy.astro
│   │   ├── terms-of-service.astro
│   │   │
│   │   ├── work/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   │
│   │   ├── services/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   │
│   │   ├── industries/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   │
│   │   └── insights/
│   │       ├── index.astro
│   │       ├── [slug].astro
│   │       └── category/
│   │           └── [slug].astro
│   │
│   ├── lib/
│   │   ├── sanity.ts          # Sanity client
│   │   ├── queries.ts         # GROQ queries
│   │   └── utils.ts           # Helper functions
│   │
│   └── styles/
│       └── global.css         # CSS variables, base styles
│
└── sanity/
    ├── sanity.config.ts
    ├── sanity.cli.ts
    └── schemas/
        ├── index.ts
        ├── service.ts
        ├── industry.ts
        ├── caseStudy.ts
        ├── blogPost.ts
        ├── blogCategory.ts
        ├── teamMember.ts
        ├── testimonial.ts
        ├── jobListing.ts
        ├── siteSettings.ts
        └── objects/
            ├── portableText.ts
            ├── processStep.ts
            ├── faqItem.ts
            ├── resultMetric.ts
            └── statItem.ts
```

---

## Appendix B: Environment Variables

```bash
# .env.local

# Sanity
PUBLIC_SANITY_PROJECT_ID=xxxxxx
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxxxxx  # For preview/draft mode if needed

# HubSpot
PUBLIC_HUBSPOT_PORTAL_ID=xxxxxx
PUBLIC_HUBSPOT_FORM_ID=xxxxxx

# Analytics
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
```

---

## Appendix C: Deferred Decisions

| Item | Status | Notes |
|------|--------|-------|
| "Hire Developer" pages | Deferred | Currently redirecting to /services/web-development/. May add dedicated page later. |
| Team photos on About | Deferred | Schema ready, `visible: false` by default. Enable when ready. |
| Blog search | Deferred | Not in v1. Add if blog grows. |
| Newsletter | Deferred | HubSpot can handle. Add when ready. |
| Multi-language | Not planned | English only for now. |

---

*End of PRD — Ready for handoff to Claude Code*