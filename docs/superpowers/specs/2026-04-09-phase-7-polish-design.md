# Phase 7: Polish — Design Spec

**Date:** 2026-04-09
**Status:** Approved
**Approach:** Effects-first, then pages

---

## 1. Custom Cursor — `CustomCursor.astro`

**Mount point:** `BaseLayout.astro`, rendered on every page.

### Elements

- **Dot:** 6px filled circle, `var(--accent)`, follows mouse instantly
- **Ring:** 36px circle outline, `rgba(var(--accent), 0.5)` border, follows with `0.12` lerp via `requestAnimationFrame`
- **Label:** `<span>` inside ring for contextual text ("View", "Play", etc.)
- **Beam:** 2px vertical bar for text cursor state

### Contextual States

| State | Trigger | Dot | Ring | Extra |
|-------|---------|-----|------|-------|
| Default | — | 6px, visible | 36px, accent border at 0.5 opacity | — |
| Hover | `data-cursor="hover"` or auto on `<a>`, `<button>` | Shrinks to 3px | 60px, subtle fill, `mix-blend-mode: difference` | — |
| View | `data-cursor="view"` | Hidden | 80px, "View" label | Label visible |
| Play | `data-cursor="play"` | Hidden | 80px, "▶" label | Label visible |
| Text | `data-cursor="text"` | Hidden | Hidden | Beam cursor visible |
| Drag | `data-cursor="drag"` | Hidden | 70px, "⟷" label | Label visible |

### Behavior

- Hidden on touch devices (`pointer: coarse` media query)
- Disabled when `prefers-reduced-motion: reduce`
- `cursor: none` set globally on `body` when cursor is active
- Auto-detects `<a>`, `<button>` for hover state
- Custom states applied via `data-cursor` attribute on any element

---

## 2. Scroll Progress — `ScrollProgress.astro`

**Mount point:** `BaseLayout.astro`.

- Fixed 2px bar at top of viewport, `z-index: 9999`
- Width: `scrollY / (documentHeight - viewportHeight) * 100%`
- Color: `var(--accent)`
- No visible background track
- Uses `requestAnimationFrame` for smooth updates
- Hidden when page content fits viewport (no scroll)
- Respects `prefers-reduced-motion`

---

## 3. Button Interaction — Border Draw

**Applied to:** `Button.astro` primary variant (ghost buttons with accent border).

### Technique

Four `<span>` elements positioned absolutely on each edge:

1. Top: `width 0% → 100%` (0s delay)
2. Right: `height 0% → 100%` (0.15s delay)
3. Bottom: `width 0% → 100%` (0.3s delay)
4. Left: `height 0% → 100%` (0.45s delay)

On mouse leave: reverses in opposite order.

- Draw lines: `var(--accent)`, 1.5px thickness
- Base border becomes `rgba(255,255,255,0.15)` (draw lines overlay in gold)
- Secondary variant (solid fill): unchanged
- Text variant (arrow): unchanged

---

## 4. Link Interaction — Letter Stagger

**Applied to:** Navigation links, footer links, inline text links.

### Technique

Link text split into individual `<span>` elements. On hover:

- Each letter: `translateY(-3px)` with stagger `index * 0.025s`
- Color transitions to `var(--accent)`
- Ease: `cubic-bezier(0.25, 0.1, 0.25, 1)`
- On mouse leave: letters drop back with same stagger

### Implementation

Reusable approach — either:
- `StaggerLink.astro` component wrapper, or
- Client-side script auto-initializing on `data-stagger` attribute

### Exclusions

Not applied to: buttons (have border draw), logo, section labels, footer legal links (too small).

---

## 5. GSAP Scroll Animations

### Global Animation Init — `src/lib/animations.ts`

Centralized module that:

1. Checks `prefers-reduced-motion` — if reduce, skips all GSAP, elements render in final state
2. Registers ScrollTrigger
3. Auto-discovers `data-reveal` attributes and initializes animations
4. Exports individual init functions for components needing manual control

Replaces scattered inline `<script>` GSAP blocks with a consistent system.

### Core Animations

**Text Reveals** — `data-reveal="text"`
- Target: Section headings (`<h2>`)
- Effect: Lines slide up from `y: 100%, opacity: 0` → visible
- Duration: 1s, ease: `power3.out`, stagger: 0.12s
- Trigger: 75% viewport

**Staggered Grid** — `data-reveal="stagger"`
- Target: Card grids (services, industries, team, process, work, blog)
- Effect: Each child `y: 60, opacity: 0` → visible
- Duration: 0.7s, ease: `power3.out`, stagger: 0.1s
- Trigger: 85% viewport

**Image Curtain Reveal** — `data-reveal="curtain"`
- Target: Work cards, case study images, featured work
- Effect: Gold overlay `scaleX: 1 → 0` (origin: right) + image `scale: 1.3 → 1`
- Duration: overlay 1.2s `power3.inOut`, image 1.4s `power3.out`
- Trigger: 80% viewport

**Counter Animation** — `data-reveal="counter"`
- Target: `StatsSection.astro` numbers
- Effect: `textContent` 0 → target, snapped to integers
- Duration: 2s, ease: `power2.out`
- Trigger: 85% viewport

### Selective Animations

**Pinned Step-Through** — `ServiceProcess.astro`
- Process section pins to viewport, steps cycle on scroll
- Progress dots show current step
- ScrollTrigger: `pin: true`, `scrub: 0.5`
- Mobile fallback (< 768px): static grid, no pinning

**Clip-Path Wipe** — `CTASection.astro`
- Card: `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)`
- Duration: 1.2s, ease: `power3.inOut`
- Trigger: 70% viewport

---

## 6. Careers Page — `/careers/`

### Data

Fetch all active `jobListing` documents from Sanity:

```groq
*[_type == "jobListing" && active == true] | order(_createdAt desc) {
  title,
  slug,
  type,
  location,
  department,
  description,
  requirements,
  applicationUrl,
  active
}
```

### Page Sections

**1. Hero** — `PageHero` variant="inner"
- Headline: "Join Our *Team*"
- Description: "We're building the future of digital experiences. Find your place at KP Infotech."

**2. Open Positions** (when listings exist)
- Section label: "Open Positions"
- Vertical card list (not grid)
- Each card: title (h3), metadata row (type tag, location, department), description excerpt (~150 chars), "Apply Now →" link
- Cards: `--bg-secondary` bg, `1px solid var(--border)`, accent left border on hover
- Staggered entrance animation

**3. Empty State** (when no listings)
- Centered content block
- Headline: "No Open Positions Right Now"
- Description: "We're always looking for talented people. Send us your details and we'll reach out when something opens up."
- Visual arrow pointing down to application form

**4. Application Form**
- Section label: "Apply"
- Headline: "Send Us Your *Details*"
- Fields:
  - Name (text, required)
  - Email (email, required)
  - Phone (tel, required)
  - Position (text, auto-filled from job card click or "General Application")
  - LinkedIn URL (url, optional)
  - Resume/CV (file upload, required, `.pdf,.doc,.docx`, max 5MB)
- Honeypot field: hidden `website` field, invisible via CSS — if filled, reject silently
- Cloudflare Turnstile: invisible CAPTCHA widget, generates token validated server-side
- Submit: "Submit Application" (primary button with border draw)
- Success: "Application sent! We'll be in touch."
- Error: "Something went wrong. Please try again or email us at [email]."

**5. CTA Section**
- Headline: "Want to *Collaborate* Instead?"
- Description: "If you're looking to work with us on a project, let's talk."
- Button → `/contact/`

### Backend — API Route

`src/pages/api/careers/apply.ts` (Astro API route, Cloudflare adapter):

1. Check honeypot field — if filled, return `{ success: true }` silently (don't reveal detection)
2. Validate Cloudflare Turnstile token via `https://challenges.cloudflare.com/turnstile/v0/siteverify`
3. Rate limit: max 3 submissions per IP per hour (using Cloudflare KV or in-memory map)
4. Validate required fields
5. Validate file: check MIME type (`application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`), enforce 5MB max
6. Send email via Resend with resume as attachment
7. Return JSON `{ success: true }` or `{ error: "message" }`

### Environment Variables (Careers)

```bash
TURNSTILE_SITE_KEY=         # Cloudflare Turnstile (public)
TURNSTILE_SECRET_KEY=       # Cloudflare Turnstile (server-side)
RESEND_API_KEY=             # Resend email service
CAREERS_EMAIL_TO=           # Destination email for applications
```

### Schema.org

`JobPosting` structured data for each active listing (helps Google Jobs indexing).

---

## 7. Privacy Policy — `/privacy-policy/`

### Structure

- `PageHero` variant="inner", no background image
- Headline: "Privacy Policy"
- Description: "Last updated: [date]"
- Content: hardcoded HTML in `.legal-content` wrapper
- No CTA section

### Content Sections

1. Information We Collect
2. How We Use Your Information
3. Cookies and Tracking
4. Third-Party Services (GA4, HubSpot, Sanity)
5. Data Retention
6. Your Rights
7. Contact Us

---

## 8. Terms of Service — `/terms-of-service/`

### Structure

Same as Privacy Policy:
- `PageHero` variant="inner"
- Headline: "Terms of Service"
- Hardcoded HTML in `.legal-content` wrapper

### Content Sections

1. Acceptance of Terms
2. Services Description
3. Intellectual Property
4. Limitation of Liability
5. Governing Law
6. Changes to Terms
7. Contact Us

---

## 9. Shared Legal Page Styles — `.legal-content`

- `max-width: 800px`
- `h3`: Outfit, 1.25rem, weight 400, `var(--text-primary)`
- `p`: 1rem, weight 300, `var(--text-secondary)`, line-height 1.8
- `ul/ol`: accent-colored bullets/numbers
- Section spacing: `2rem` gap
- Links: `var(--accent)` with underline

**Note:** Content is placeholder/template. Legal review recommended before launch.

---

## Implementation Order

1. **Custom cursor** + scroll progress (global effects)
2. **Button border draw** + link letter stagger (interaction effects)
3. **GSAP animation system** — `animations.ts` + apply `data-reveal` attributes across all pages
4. **Careers page** — template, form, API route
5. **Legal pages** — Privacy Policy, Terms of Service
6. **Integration pass** — ensure all animations, cursor states, and interactions work together across all pages
