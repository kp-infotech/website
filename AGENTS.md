# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Required Reading Rules

**Before modifying these files, ALWAYS read `docs/context/design-system.md` first:**
- `src/components/**/*.astro` — All components
- `src/styles/**/*.css` — All stylesheets
- `src/pages/**/*.astro` — Page layouts and sections

The design system document contains standardized values for spacing, typography, colors, and component patterns that MUST be followed for consistency.

## Project Overview

KP Infotech website rebuild: WordPress + Elementor → Astro + Sanity CMS. Premium Design and Technology studio positioning with dark editorial design language.

**Domain:** kpinfo.tech
**Target Performance:** 90+ Lighthouse scores, <2.5s LCP

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Astro 5.x with static output |
| CMS | Sanity v5 (embedded studio at /studio) |
| Styling | Tailwind CSS 4.x with @tailwindcss/vite plugin |
| Icons | @lucide/astro |
| Animations | GSAP + ScrollTrigger |
| Forms | HubSpot Forms API |
| Hosting | Cloudflare Pages |

## Commands

```bash
# Development
npm run dev              # Start Astro dev server
npm run sanity:dev       # Start Sanity Studio

# Build & Deploy
npm run build            # Production build
npm run preview          # Preview production build
npm run deploy           # Build + deploy to Cloudflare Pages (production)
npm run deploy:preview   # Build + deploy as preview branch

# Sanity
npm run sanity:deploy    # Deploy Sanity Studio
```

## Project Structure

```
src/
├── layouts/Layout.astro           # Base HTML wrapper, SEO component
├── components/
│   ├── Navigation.astro           # Fixed header, mobile menu
│   ├── Footer.astro
│   ├── SEO.astro                  # Meta tags, OG, JSON-LD schema
│   ├── ui/                        # Button, Tag, Input, SectionLabel
│   ├── cards/                     # ServiceCard, WorkCard, BlogCard, etc.
│   ├── sections/                  # Hero, ServicesGrid, StatsSection, etc.
│   └── effects/                   # GSAP animations: FadeUp, TextReveal, Counter
├── pages/
│   ├── work/[slug].astro          # Case study dynamic routes
│   ├── services/[slug].astro      # Service detail pages
│   ├── industries/[slug].astro    # Industry detail pages
│   └── insights/[slug].astro      # Blog post pages
├── lib/
│   ├── sanity.ts                  # Sanity client configuration
│   └── queries.ts                 # GROQ queries
└── styles/global.css              # CSS variables, base styles

sanity/
├── schemas/                       # Document types: service, industry, caseStudy, blogPost
└── schemas/objects/               # portableText, processStep, faqItem, resultMetric
```

## Design System

### Colors (CSS Variables)

```css
--bg-primary: #0a0a0a      /* Main background */
--bg-secondary: #0f0f0f    /* Card backgrounds */
--text-primary: #ffffff    /* Headlines */
--text-secondary: #6b6b6b  /* Body text */
--accent: #c9a87c          /* Warm gold - CTAs, highlights */
--border: #1a1a1a          /* Default borders */
```

### Typography

- **Display:** Playfair Display (headlines, stats) - self-hosted via @fontsource
- **Body:** Outfit (body text, navigation, buttons) - self-hosted via @fontsource
- Hero H1: `clamp(3rem, 8vw, 5.5rem)`, weight 500
- Section labels: 11px uppercase, letter-spacing 4px, accent color with 40px line prefix

### Animation Standards

Use GSAP with these patterns:
- **Fade Up:** `opacity: 0→1, y: 60→0`, duration 0.8s, trigger at 80% viewport
- **Text Reveal:** `translateY: 100%→0, rotate: 3→0`, stagger 0.08s
- **Image Reveal:** Overlay `scaleX: 1→0`, duration 1.2s
- **Easing:** `power3.out` (primary), `power3.inOut` (images)
- **Reduced motion:** Always check `prefers-reduced-motion: reduce`

## Sanity CMS Patterns

### Document Types

Primary content types: `service`, `industry`, `caseStudy`, `blogPost`, `testimonial`, `teamMember`, `jobListing`, `siteSettings` (singleton)

### GROQ Query Patterns

```groq
// Fetch featured case studies for homepage
*[_type == "caseStudy" && featured == true] | order(_createdAt desc)[0...4]

// Fetch service with related work
*[_type == "service" && slug.current == $slug][0] {
  ...,
  relatedWork[]->{ title, slug, thumbnailImage }
}

// Blog posts with category
*[_type == "blogPost"] | order(publishedAt desc) {
  ...,
  category->{ title, slug }
}
```

### Image Handling

Use `@sanity/image-url` with `createImageUrlBuilder` (not deprecated `imageUrlBuilder`):
```typescript
import { createImageUrlBuilder } from '@sanity/image-url';
const builder = createImageUrlBuilder(client);
// For retina: fetch 2-3x size, display smaller via CSS
const imageUrl = builder.image(source).height(120).format('webp').url();
```

## Image Optimization

**Strategy:** Build-time optimization via Astro (free, runs at build time on any hosting provider)

### SanityPicture Component
Always use `<SanityPicture>` for Sanity images (not raw `<img>`):
```astro
import SanityPicture from '@/components/ui/SanityPicture.astro';
import { urlFor } from '@/lib/sanity';

<SanityPicture
  src={urlFor(image).url()}
  alt="Description"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Output:** AVIF → WebP → JPG fallback chain, responsive srcset, build-time optimized

### SVG Handling
- **SVGs:** Use `urlFor(image).url()` without `.format()` to preserve vector
- **Raster:** Use `urlFor(image).format('webp').url()` or `<SanityPicture>`
- Helper: `isSvgAsset(image)` checks if asset is SVG

### CSS for Picture Elements
When using `<SanityPicture>`, target the `img` inside:
```css
.my-image { display: block; width: 100%; }
.my-image img { object-fit: cover; }
```

### Highlighted Text

Use `*asterisks*` in Sanity string fields to highlight words in accent color:
- Sanity: `We craft *digital experiences* that drive growth`
- Rendered: `We craft <span class="text-accent">digital experiences</span>...`
- Utility: `parseHighlightedText()` in `src/lib/utils.ts`
- Component: `<HighlightedText text={title} />` in `src/components/ui/`

### Schema Field Names

Testimonial: `authorName`, `authorRole`, `company`, `authorPhoto` (not `client*`)
Industry: `icon` is image field (SVG upload), not string

## Content Architecture

### URL Patterns

| Content Type | Pattern | Example |
|--------------|---------|---------|
| Service | `/services/[slug]/` | /services/ui-ux-design/ |
| Industry | `/industries/[slug]/` | /industries/healthcare/ |
| Case Study | `/work/[slug]/` | /work/fintech-mobile-app/ |
| Blog Post | `/insights/[slug]/` | /insights/node-js-frameworks/ |
| Blog Category | `/insights/category/[slug]/` | /insights/category/development/ |

### Services (5 total)

`ui-ux-design`, `web-development`, `mobile-apps`, `erp-solutions`, `digital-marketing`

### Industries (6 total)

`healthcare`, `retail-ecommerce`, `manufacturing`, `logistics`, `finance`, `startups`

## SEO Requirements

### Schema Markup by Page Type

| Page | Schema |
|------|--------|
| Homepage | Organization, WebSite |
| Service | Service |
| Case Study | CreativeWork |
| Blog Post | Article |
| Contact | ContactPage |
| FAQ sections | FAQPage |

### Title Pattern

`{Page Title} — KP Infotech`

### Critical Redirects

Old WordPress URLs must redirect to new structure:
- `/services/website-design/` → `/services/web-development/`
- `/services/graphics-design/` → `/services/ui-ux-design/`
- `/services/erp-software/` → `/services/erp-solutions/`
- `/blogs/` → `/insights/`
- Blog posts move from root to `/insights/[slug]/`

## Component Conventions

### Section Labels

Always use consistent section label pattern:
```astro
<span class="section-label">
  <span class="line"></span>
  Services
</span>
```

### Button Variants

- `primary`: Ghost with accent border, fills on hover
- `secondary`: Solid accent fill
- `text`: Minimal with arrow icon

### Cards

All cards use `--bg-secondary` background with `1px solid var(--border)`. Hover states add left accent line (3px, `--accent`).

## Environment Variables

**Loading pattern** (for Cloudflare Pages + local dev compatibility):
```typescript
// Check process.env first (hosting provider), then loadEnv (local .env.local)
const value = process.env.VAR_NAME || env.VAR_NAME;
```

```bash
PUBLIC_SANITY_PROJECT_ID=     # Sanity project ID
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=             # For preview/draft mode
PUBLIC_HUBSPOT_PORTAL_ID=     # HubSpot form embed
PUBLIC_HUBSPOT_FORM_ID=
PUBLIC_GA_MEASUREMENT_ID=     # GA4 tracking
```

Set these in Cloudflare Pages dashboard → Settings → Environment Variables (for both Production and Preview environments).

## Integration Notes

### HubSpot Forms

Use API submission (not embed) for full styling control:
```typescript
await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fields: [...] })
});
```

### Cloudflare Workers Deployment

Hosting is Cloudflare **Workers** (Astro static assets served from the edge + a Worker for SSR/redirects) via `@astrojs/cloudflare` v13+. See [wrangler.toml](wrangler.toml).

- **Staging:** Push to `main` → auto-deploys to the `*.workers.dev` URL
- **Preview:** PR branches → preview Worker deployment
- **Manual:** `npm run deploy` / `npm run deploy:preview`
- **Production:** Custom domain `kpinfo.tech` (apex) attached to the Worker. `www.kpinfo.tech` 301-redirects to the apex via a Cloudflare Redirect Rule. The codebase hard-codes the apex as the single canonical host — canonical URLs, analytics/consent gating, and the `noindex` fallback all key off `hostname === 'kpinfo.tech'`.
- **Rebuild trigger:** Sanity webhook → Cloudflare deploy hook

### Static Files

- `public/_redirects` — WordPress → Astro URL redirects (Cloudflare Pages format)
- `public/_headers` — Security headers and cache rules for static assets

## Accessibility

- Minimum 4.5:1 contrast for body text
- `--text-secondary` on `--bg-primary` = ~4.7:1 contrast
- All interactive elements need visible focus states
- Disable GSAP animations when `prefers-reduced-motion: reduce`
