# KP Infotech Design System

**Version:** 2.0
**Last Updated:** February 2025
**Direction:** Bold, confident, premium, exclusive

---

## Brand Positioning

KP Infotech is a **Design and Technology studio** serving startups and businesses seeking premium digital products. The design language conveys mastery, exclusivity, and meticulous craftsmanship — like a high-end architecture firm or luxury brand agency.

**Voice:** Confident but not arrogant. Minimal but not cold. Premium but accessible.

---

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0a0a0a` | Main background, deepest black |
| `--bg-secondary` | `#0f0f0f` | Card backgrounds, alternate sections |
| `--bg-tertiary` | `#161616` | Hover states, elevated surfaces |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#ffffff` | Headlines, primary content |
| `--text-secondary` | `rgba(255,255,255,0.5)` | Body text, descriptions |
| `--text-muted` | `#3a3a3a` | Subtle labels, decorative numbers |

### Accent Colors (Warm Gold)

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent` | `#c9a87c` | Primary accent, CTAs, highlights |
| `--accent-light` | `#e4d4bc` | Hover states, gradients |
| `--accent-dim` | `#8b7355` | Subtle accents, decorative elements |

### Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--border` | `#1a1a1a` | Default borders, dividers |
| `--border-light` | `#2a2a2a` | Hover borders, emphasis |

### Utility Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#4ade80` | Success states, confirmations |
| `--error` | `#f87171` | Error states, warnings |

---

## Typography

### Font Families

```css
--font-display: 'Playfair Display', serif;
--font-body: 'Outfit', sans-serif;
```

**Playfair Display** — Used for headlines, large display text, numbers in stats. Conveys editorial elegance and premium quality.

**Outfit** — Used for body text, navigation, labels, buttons. Clean geometric sans-serif that balances the serif's personality.

### Type Scale (Standardized)

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Hero H1 | Playfair | `clamp(3rem, 8vw, 5.5rem)` | 500 | `1.1` |
| Section H2 | Playfair | `clamp(2rem, 5vw, 3rem)` | 500 | `1.1` |
| Card H3 | Playfair | `1.25rem - 1.5rem` | 500 | `1.2` |
| Body Large | Outfit | `1.125rem` | 300 | `1.7` |
| Body | Outfit | `1rem` | 300 | `1.6` |
| Section Label | Outfit | `0.6875rem (11px)` | 400 | `1` |
| Nav Link | Outfit | `0.75rem` | 400 | `1` |
| Button | Outfit | `0.75rem` | 400 | `1` |

### Highlighted Text Pattern

Use `*asterisks*` in content to highlight words in accent color. This creates visual emphasis on key terms.

**In Sanity/Content:**
```
We craft *digital experiences* that drive growth
```

**Rendered Output:**
```html
We craft <span class="text-accent">digital experiences</span> that drive growth
```

**Component:** Use `<HighlightedText text={title} />` from `src/components/ui/HighlightedText.astro`

**Usage Guidelines:**
- Highlight 1-2 key words per headline (not entire phrases)
- Use consistently across all section titles
- Words to highlight: action verbs, key nouns, differentiators

---

## Section Labels

Section labels introduce content sections with uppercase text and decorative lines.

### Default Variant (Left Line)
```
——— SECTION NAME
```
Use for: Standard content sections

### Centered Variant (Lines on Both Sides)
```
——— SECTION NAME ———
```
Use for: Hero sections, centered layouts

**Standard Implementation:**
```astro
<!-- Default (left line) -->
<SectionLabel text="What We Do" />

<!-- Centered (lines on both sides) -->
<SectionLabel text="About Us" variant="centered" />
```

**Consistency Rule:** Pick ONE variant per page and use it for all sections on that page.
- Homepage: Default variant
- About page: Centered variant (for its centered hero layout)

---

## Layout Standards

### Container Max-Widths

| Context | Max-Width | Usage |
|---------|-----------|-------|
| Standard sections | `1200px` | Services, Industries, Work grids |
| Hero sections | `1440px` | Full hero layouts |
| Centered content | `900px` | CTAs, Testimonials, About hero text |
| Narrow content | `700px` | Blog post body, focused reading |

### Section Vertical Padding (Standardized)

| Breakpoint | Padding | CSS |
|------------|---------|-----|
| Mobile (<480px) | `3rem 0` | `padding: 3rem 0;` |
| Tablet (480-768px) | `4rem 0` | `padding: 4rem 0;` |
| Desktop (>768px) | `6rem 0` | `padding: 6rem 0;` |

**Exception:** Hero sections use `min-height: 100vh` instead of fixed padding.

### Section Header Spacing

```css
.section__header {
  margin-bottom: 3rem;  /* Mobile/Tablet */
}

@media (min-width: 768px) {
  .section__header {
    margin-bottom: 4rem;  /* Desktop */
  }
}
```

### Horizontal Padding (Container)

```css
/* Mobile */
padding: 0 1rem;      /* 16px */

/* Tablet */
padding: 0 1.5rem;    /* 24px */

/* Desktop */
padding: 0 1.5rem;    /* Within max-width container */
```

---

## Components

### Buttons

**Primary Button** — Ghost style with accent border, fills on hover
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 36px;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.btn-primary:hover {
  background: var(--accent);
  color: var(--bg-primary);
}
```

**Secondary Button** — Solid accent fill
```css
.btn-secondary {
  background: var(--accent);
  color: var(--bg-primary);
}

.btn-secondary:hover {
  background: var(--accent-light);
}
```

**Text Link** — Minimal with arrow, accent on hover
```css
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.text-link:hover {
  color: var(--accent);
}

.text-link:hover svg {
  transform: translateX(4px);
}
```

### Cards (Standardized Hover Pattern)

**All cards use the LEFT BORDER ACCENT pattern:**

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-left: 3px solid transparent;
  transition: border-color 0.3s ease, transform 0.3s ease;
}

.card:hover {
  border-left-color: var(--accent);
  transform: translateY(-2px);
}
```

**Card Types:**
- Service cards: Icon + title + description + arrow
- Work cards: Image + client + title + arrow badge
- Industry links: Icon + name + arrow
- Value cards: Number + title + description

### Form Elements

**Text Input** — Underline style
```css
.form-input {
  width: 100%;
  padding: 16px 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-primary);
  font-size: 16px;
}

.form-input:focus {
  border-color: var(--accent);
  outline: none;
}
```

**Textarea** — Boxed style
```css
.form-textarea {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  padding: 16px;
  min-height: 150px;
}

.form-textarea:focus {
  border-color: var(--accent);
}
```

### Tags/Pills

```css
.tag {
  display: inline-block;
  padding: 6px 12px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.tag:hover {
  border-color: var(--accent-dim);
  color: var(--accent);
}
```

### Stats

```css
.stat-value {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 500;
  color: var(--accent);
  line-height: 1;
}

.stat-label {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 300;
  color: var(--text-secondary);
}
```

---

## CTA Sections

### Standard CTA Pattern

```
┌─────────────────────────────────────────────┐
│                                             │
│     Ready to *elevate* your digital         │
│            presence?                        │
│                                             │
│     Let's discuss how we can help...        │
│                                             │
│          [ Start a Project ]                │
│                                             │
└─────────────────────────────────────────────┘
```

**Specifications:**
- Container: `max-width: 900px`, centered
- Card: `--bg-secondary` background, `1px solid var(--accent)` border
- Padding: `5rem 4rem` desktop, `3rem 2rem` tablet, `2.5rem 1.5rem` mobile
- Text: Centered
- Headline: Uses `<HighlightedText>` with one highlighted word
- Single primary button

---

## Navigation

**Fixed header** — Transparent initially, gains backdrop blur on scroll

```css
nav {
  position: fixed;
  padding: 28px 48px;
  transition: all 0.4s ease;
}

nav.scrolled {
  padding: 20px 48px;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
```

**Nav Links** — Underline grows from left on hover
```css
.nav-link {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

---

## Animation Principles

### Core Easing

```javascript
// Primary easing — smooth, premium feel
'power3.out'      // Most animations

// For image reveals
'power3.inOut'

// Elastic — magnetic button return
'elastic.out(1, 0.5)'
```

### Animation Patterns

**Fade Up** — Standard entrance for sections
```javascript
{
  initial: { opacity: 0, y: 60 },
  final: { opacity: 1, y: 0 },
  duration: 0.8,
  trigger: '80% viewport'
}
```

**Text Reveal** — Characters/words slide up
```javascript
{
  initial: { translateY: '100%', rotate: 3 },
  final: { translateY: 0, rotate: 0 },
  stagger: 0.08,
  duration: 1
}
```

**Image Reveal** — Overlay slides away
```javascript
{
  overlay: { scaleX: 1 → 0 },
  transformOrigin: 'right',
  duration: 1.2
}
```

**Counter Animation** — Stats count up
```javascript
{
  duration: 2,
  easing: 'power2.out',
  snap: 1  // integers only
}
```

### Reduced Motion

Always respect user preferences:
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Skip animations, show content immediately
}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | `< 640px` | Single column, 1rem padding, stacked layouts |
| Tablet | `640px - 1024px` | 2-column grids, 1.5rem padding |
| Desktop | `> 1024px` | Full layouts, all animations, 3+ column grids |

### Grid Columns by Breakpoint

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Services Grid | 1 | 2 | 3 |
| Industries | 1 | 2 | 3 |
| Work Grid | 1 | 2 | 2 |
| Stats | 1 | 2 | 4 |
| Team | 1 | 2 | 3-4 |

---

## Accessibility

### Contrast Requirements
- Minimum 4.5:1 contrast for body text
- `--text-secondary` (#6b6b6b) on `--bg-primary` (#0a0a0a) = ~4.7:1 ✓
- `--accent` (#c9a87c) should only be used for decorative text, not essential information

### Focus States
All interactive elements need visible focus states:
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Reduced Motion
Disable GSAP animations when `prefers-reduced-motion: reduce`

---

## File Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── Button.astro
│   │   ├── SectionLabel.astro
│   │   ├── HighlightedText.astro
│   │   ├── Tag.astro
│   │   └── Input.astro
│   ├── cards/                 # Card components
│   │   ├── ServiceCard.astro
│   │   ├── WorkCard.astro
│   │   └── BlogCard.astro
│   ├── sections/              # Page sections
│   │   ├── Hero.astro
│   │   ├── ServicesGrid.astro
│   │   ├── FeaturedWork.astro
│   │   ├── Industries.astro
│   │   ├── StatsSection.astro
│   │   ├── Testimonials.astro
│   │   └── CTASection.astro
│   └── effects/               # GSAP animation wrappers
│       ├── FadeUp.astro
│       └── TextReveal.astro
├── styles/
│   └── global.css             # CSS variables, base styles
└── lib/
    └── utils.ts               # parseHighlightedText(), etc.
```

---

## Quick Reference Checklist

When creating/editing components, verify:

- [ ] Section padding: `6rem 0` desktop, `4rem 0` tablet, `3rem 0` mobile
- [ ] Container max-width: `1200px` (standard) or `900px` (centered)
- [ ] Section title: Uses `<HighlightedText>` with `clamp(2rem, 5vw, 3rem)`
- [ ] Cards: Left border accent hover pattern (3px)
- [ ] Fonts: Playfair for headlines, Outfit for body
- [ ] Colors: Using CSS variables, not hardcoded hex
- [ ] Focus states: Visible outline on `:focus-visible`
- [ ] Reduced motion: Animations respect `prefers-reduced-motion`

---

*This document is the single source of truth for the KP Infotech design system. Reference it when creating or modifying any component.*
