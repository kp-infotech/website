# Phase 7: Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Phase 7 (Polish) — custom cursor, scroll progress, button/link interactions, GSAP animation system, careers page with application form, and legal pages.

**Architecture:** Effects-first approach. Build global interaction layer (cursor, scroll progress, GSAP animations, button/link effects) first, then content pages (Careers, Privacy, Terms). All effects respect `prefers-reduced-motion`. GSAP animations auto-initialize via `data-reveal` attributes. Careers form submits to a Cloudflare Workers API route that sends email via Resend.

**Tech Stack:** Astro 6, GSAP 3.14 + ScrollTrigger, Cloudflare Workers, Resend (email), Cloudflare Turnstile (spam protection)

**Spec:** `docs/superpowers/specs/2026-04-09-phase-7-polish-design.md`

**Testing note:** This is a static Astro site with no test framework. Verification is visual — run `npm run dev` and check in browser. Each task includes specific verification steps.

---

## File Structure

### New files to create:
```
src/components/effects/CustomCursor.astro     — Dot + ring cursor with contextual states
src/components/effects/ScrollProgress.astro   — Top bar scroll progress indicator
src/lib/animations.ts                         — Centralized GSAP animation init system
src/pages/careers/index.astro                 — Careers page with job listings + form
src/pages/api/careers/apply.ts                — API route for job application form
src/pages/privacy-policy/index.astro          — Privacy policy page
src/pages/terms-of-service/index.astro        — Terms of service page
```

### Files to modify:
```
src/layouts/BaseLayout.astro                  — Import + mount CustomCursor, ScrollProgress
src/components/ui/Button.astro                — Replace fill hover with border draw (primary variant)
src/components/Navigation.astro               — Letter stagger on nav links
src/components/Footer.astro                   — Letter stagger on footer links
src/components/sections/CTASection.astro      — Add data-reveal="clip" attribute
src/components/sections/StatsSection.astro    — Add data-reveal="counter" + data attributes
src/styles/global.css                         — Add cursor: none for custom cursor
package.json                                  — Add resend dependency
```

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install resend**

```bash
cd "C:/Users/user/Desktop/Poojan/KP Infotech/website" && npm install resend
```

- [ ] **Step 2: Verify installation**

```bash
cd "C:/Users/user/Desktop/Poojan/KP Infotech/website" && node -e "require('resend'); console.log('resend OK')"
```

Expected: `resend OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add resend dependency for careers email"
```

---

## Task 2: Custom Cursor Component

**Files:**
- Create: `src/components/effects/CustomCursor.astro`

- [ ] **Step 1: Create the CustomCursor component**

```astro
---
/**
 * CustomCursor - Dot + Ring cursor with contextual states
 * Mount once in BaseLayout. Hidden on touch devices and reduced motion.
 *
 * States triggered by data-cursor attribute on elements:
 * - default: 6px dot + 36px ring
 * - hover: ring expands to 60px (auto on <a>, <button>)
 * - view: ring 80px + "View" label
 * - play: ring 80px + "▶" label
 * - text: beam cursor
 * - drag: ring 70px + "⟷" label
 */
---

<div id="custom-cursor" class="custom-cursor" aria-hidden="true">
  <div class="custom-cursor__dot"></div>
  <div class="custom-cursor__ring">
    <span class="custom-cursor__label"></span>
  </div>
  <div class="custom-cursor__beam"></div>
</div>

<style>
  .custom-cursor {
    display: none;
  }

  /* Only show on non-touch devices with no reduced motion preference */
  @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .custom-cursor {
      display: block;
    }

    :global(html) {
      cursor: none !important;
    }

    :global(a, button, [role="button"], input, textarea, select, label) {
      cursor: none !important;
    }
  }

  .custom-cursor__dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10001;
    transform: translate(-50%, -50%);
    transition: opacity 0.2s, transform 0.15s;
  }

  .custom-cursor__ring {
    position: fixed;
    top: 0;
    left: 0;
    width: 36px;
    height: 36px;
    border: 1.5px solid rgba(201, 168, 124, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
                height 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.3s,
                border-color 0.3s,
                opacity 0.2s;
  }

  .custom-cursor__label {
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0;
    color: var(--accent);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 400;
    opacity: 0;
    transition: font-size 0.3s, opacity 0.3s;
    white-space: nowrap;
    pointer-events: none;
  }

  .custom-cursor__beam {
    position: fixed;
    top: 0;
    left: 0;
    width: 2px;
    height: 20px;
    background: var(--accent);
    pointer-events: none;
    z-index: 10001;
    opacity: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.2s;
  }

  /* State: hidden (when cursor leaves window) */
  .custom-cursor--hidden .custom-cursor__dot,
  .custom-cursor--hidden .custom-cursor__ring,
  .custom-cursor--hidden .custom-cursor__beam {
    opacity: 0;
  }
</style>

<script>
  function initCursor() {
    const container = document.getElementById('custom-cursor');
    if (!container) return;

    // Skip on touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const dot = container.querySelector('.custom-cursor__dot') as HTMLElement;
    const ring = container.querySelector('.custom-cursor__ring') as HTMLElement;
    const label = container.querySelector('.custom-cursor__label') as HTMLElement;
    const beam = container.querySelector('.custom-cursor__beam') as HTMLElement;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let currentState = 'default';
    let visible = false;

    function setState(state: string, labelText?: string) {
      if (currentState === state) return;
      currentState = state;

      // Reset all
      dot.style.opacity = '1';
      dot.style.transform = 'translate(-50%, -50%)';
      beam.style.opacity = '0';
      ring.style.background = 'transparent';
      ring.style.borderColor = 'rgba(201, 168, 124, 0.5)';
      ring.style.mixBlendMode = '';

      switch (state) {
        case 'default':
          ring.style.width = '36px';
          ring.style.height = '36px';
          label.style.fontSize = '0';
          label.style.opacity = '0';
          break;

        case 'hover':
          ring.style.width = '60px';
          ring.style.height = '60px';
          ring.style.background = 'rgba(201, 168, 124, 0.08)';
          ring.style.borderColor = 'rgba(201, 168, 124, 0.6)';
          ring.style.mixBlendMode = 'difference';
          dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
          label.style.fontSize = '0';
          label.style.opacity = '0';
          break;

        case 'view':
          ring.style.width = '80px';
          ring.style.height = '80px';
          ring.style.background = 'rgba(201, 168, 124, 0.1)';
          ring.style.borderColor = 'var(--accent)';
          dot.style.opacity = '0';
          label.textContent = labelText || 'View';
          label.style.fontSize = '9px';
          label.style.opacity = '1';
          break;

        case 'play':
          ring.style.width = '80px';
          ring.style.height = '80px';
          ring.style.background = 'rgba(201, 168, 124, 0.1)';
          ring.style.borderColor = 'var(--accent)';
          dot.style.opacity = '0';
          label.textContent = '▶';
          label.style.fontSize = '16px';
          label.style.opacity = '1';
          break;

        case 'text':
          dot.style.opacity = '0';
          ring.style.width = '0px';
          ring.style.height = '0px';
          ring.style.borderColor = 'transparent';
          beam.style.opacity = '1';
          label.style.fontSize = '0';
          label.style.opacity = '0';
          break;

        case 'drag':
          ring.style.width = '70px';
          ring.style.height = '70px';
          ring.style.background = 'rgba(201, 168, 124, 0.08)';
          ring.style.borderColor = 'rgba(201, 168, 124, 0.6)';
          dot.style.opacity = '0';
          label.textContent = '⟷';
          label.style.fontSize = '18px';
          label.style.opacity = '1';
          break;
      }
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      beam.style.left = mouseX + 'px';
      beam.style.top = mouseY + 'px';

      if (!visible) {
        visible = true;
        container.classList.remove('custom-cursor--hidden');
      }
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animate);
    }

    function bindHoverListeners() {
      // Auto-detect links and buttons for hover state
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        const cursorAttr = el.getAttribute('data-cursor');
        // Skip if element has a more specific data-cursor
        if (cursorAttr && cursorAttr !== 'hover') return;

        el.addEventListener('mouseenter', () => setState('hover'));
        el.addEventListener('mouseleave', () => setState('default'));
      });

      // Custom data-cursor attributes
      document.querySelectorAll('[data-cursor]').forEach((el) => {
        const state = el.getAttribute('data-cursor')!;
        const cursorLabel = el.getAttribute('data-cursor-label');
        el.addEventListener('mouseenter', () => setState(state, cursorLabel || undefined));
        el.addEventListener('mouseleave', () => setState('default'));
      });
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', () => {
      visible = false;
      container.classList.add('custom-cursor--hidden');
    });

    bindHoverListeners();
    animate();

    // Re-bind after Astro view transitions
    document.addEventListener('astro:after-swap', bindHoverListeners);
  }

  // Init on load and after view transitions
  initCursor();
  document.addEventListener('astro:after-swap', initCursor);
</script>
```

- [ ] **Step 2: Verify file created**

```bash
ls "C:/Users/user/Desktop/Poojan/KP Infotech/website/src/components/effects/CustomCursor.astro"
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/components/effects/CustomCursor.astro
git commit -m "feat: add CustomCursor component with contextual states"
```

---

## Task 3: Scroll Progress Component

**Files:**
- Create: `src/components/effects/ScrollProgress.astro`

- [ ] **Step 1: Create the ScrollProgress component**

```astro
---
/**
 * ScrollProgress - Thin accent bar at top of viewport
 * Shows reading/scroll progress. Hidden when page doesn't scroll.
 * Respects prefers-reduced-motion.
 */
---

<div id="scroll-progress" class="scroll-progress" aria-hidden="true">
  <div class="scroll-progress__bar"></div>
</div>

<style>
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .scroll-progress--visible {
    opacity: 1;
  }

  .scroll-progress__bar {
    height: 100%;
    width: 0%;
    background: var(--accent);
    will-change: width;
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-progress {
      display: none;
    }
  }
</style>

<script>
  function initScrollProgress() {
    const container = document.getElementById('scroll-progress');
    if (!container) return;

    const bar = container.querySelector('.scroll-progress__bar') as HTMLElement;
    if (!bar) return;

    // Check if page actually scrolls
    function checkScrollable() {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight + 50;
      container.classList.toggle('scroll-progress--visible', scrollable);
    }

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      bar.style.width = progress + '%';
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkScrollable);

    checkScrollable();
    updateProgress();
  }

  initScrollProgress();
  document.addEventListener('astro:after-swap', initScrollProgress);
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/effects/ScrollProgress.astro
git commit -m "feat: add ScrollProgress top bar component"
```

---

## Task 4: Mount Effects in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro:1-8` (imports), `src/layouts/BaseLayout.astro:77-78` (body content)

- [ ] **Step 1: Add imports to BaseLayout**

In `src/layouts/BaseLayout.astro`, add after the existing imports (after line 7):

```astro
import CustomCursor from '../components/effects/CustomCursor.astro';
import ScrollProgress from '../components/effects/ScrollProgress.astro';
```

- [ ] **Step 2: Mount components in body**

In `src/layouts/BaseLayout.astro`, add the components after the `<body>` tag (line 77) and before `<Navigation>` (line 78):

Replace:
```astro
  <body class="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
    <Navigation
```

With:
```astro
  <body class="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
    <ScrollProgress />
    <CustomCursor />
    <Navigation
```

- [ ] **Step 3: Verify in browser**

```bash
cd "C:/Users/user/Desktop/Poojan/KP Infotech/website" && npm run dev
```

Open http://localhost:4321. Verify:
- Gold dot follows mouse immediately
- Ring follows with slight delay
- Ring expands when hovering nav links/buttons
- Thin gold progress bar at top grows as you scroll
- Progress bar hidden on short pages that don't scroll

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: mount CustomCursor and ScrollProgress in BaseLayout"
```

---

## Task 5: Button Border Draw Effect

**Files:**
- Modify: `src/components/ui/Button.astro`

- [ ] **Step 1: Replace the fill span with border draw spans**

In `src/components/ui/Button.astro`, replace line 36:

```astro
  {variant === 'primary' && <span class="btn__fill"></span>}
```

With:

```astro
  {variant === 'primary' && (
    <>
      <span class="btn__draw btn__draw--top"></span>
      <span class="btn__draw btn__draw--right"></span>
      <span class="btn__draw btn__draw--bottom"></span>
      <span class="btn__draw btn__draw--left"></span>
    </>
  )}
```

- [ ] **Step 2: Replace the primary button styles**

In `src/components/ui/Button.astro`, replace the primary styles (lines 61-85):

```css
  /* Primary: Ghost style with accent border, fills on hover */
  .btn--primary {
    padding: 1rem 2rem;
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--accent);
  }

  .btn--primary .btn__fill {
    position: absolute;
    inset: 0;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .btn--primary:hover {
    color: var(--bg-primary);
  }

  .btn--primary:hover .btn__fill {
    transform: scaleX(1);
  }
```

With:

```css
  /* Primary: Ghost style with border draw on hover */
  .btn--primary {
    padding: 1rem 2rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: var(--accent);
  }

  .btn--primary:hover {
    color: var(--accent-light, #e4d4bc);
  }

  /* Border draw lines */
  .btn__draw {
    position: absolute;
    background: var(--accent);
    z-index: 0;
  }

  .btn__draw--top {
    top: -1px;
    left: -1px;
    height: 1.5px;
    width: 0%;
    transition: width 0.2s cubic-bezier(0.65, 0, 0.35, 1) 0s;
  }

  .btn__draw--right {
    top: -1px;
    right: -1px;
    width: 1.5px;
    height: 0%;
    transition: height 0.2s cubic-bezier(0.65, 0, 0.35, 1) 0.15s;
  }

  .btn__draw--bottom {
    bottom: -1px;
    right: -1px;
    height: 1.5px;
    width: 0%;
    transition: width 0.2s cubic-bezier(0.65, 0, 0.35, 1) 0.3s;
  }

  .btn__draw--left {
    bottom: -1px;
    left: -1px;
    width: 1.5px;
    height: 0%;
    transition: height 0.2s cubic-bezier(0.65, 0, 0.35, 1) 0.45s;
  }

  .btn--primary:hover .btn__draw--top { width: calc(100% + 2px); }
  .btn--primary:hover .btn__draw--right { height: calc(100% + 2px); }
  .btn--primary:hover .btn__draw--bottom { width: calc(100% + 2px); }
  .btn--primary:hover .btn__draw--left { height: calc(100% + 2px); }
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:4321. Hover any primary button (e.g., CTAs, hero buttons). Verify:
- Base border is subtle gray
- Gold line draws around the button sequentially: top → right → bottom → left
- Effect reverses on mouse leave

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Button.astro
git commit -m "feat: replace button fill hover with border draw effect"
```

---

## Task 6: Navigation Letter Stagger

**Files:**
- Modify: `src/components/Navigation.astro:77-94` (desktop links), plus add CSS

- [ ] **Step 1: Update desktop nav link rendering**

In `src/components/Navigation.astro`, replace the link text rendering (inside the desktop nav `{navLinks.map}` block, lines 77-94). Replace:

```astro
            >
              {link.label}
              <span class="nav-underline absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-300"></span>
            </a>
```

With:

```astro
            >
              <span class="nav-link__letters">
                {link.label.split('').map((char, i) => (
                  <span
                    class="nav-link__letter"
                    style={`--letter-i: ${i}`}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
              <span class="nav-underline absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-300"></span>
            </a>
```

- [ ] **Step 2: Add letter stagger CSS**

In the `<style>` block of `Navigation.astro`, add after the existing `.nav-link` styles:

```css
  .nav-link__letters {
    display: inline-flex;
  }

  .nav-link__letter {
    display: inline-block;
    transition: transform 0.3s calc(var(--letter-i) * 0.025s) cubic-bezier(0.25, 0.1, 0.25, 1),
                color 0.3s calc(var(--letter-i) * 0.025s);
  }

  .nav-link:hover .nav-link__letter {
    transform: translateY(-3px);
    color: var(--text-primary);
  }
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:4321. Hover over desktop nav links. Verify:
- Each letter lifts up individually with a slight cascade
- Letters return on mouse leave with same stagger

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.astro
git commit -m "feat: add letter stagger effect to navigation links"
```

---

## Task 7: Footer Letter Stagger

**Files:**
- Modify: `src/components/Footer.astro` (services, company link columns)

- [ ] **Step 1: Read the Footer component**

Read `src/components/Footer.astro` fully to identify exact link rendering locations and current CSS classes.

- [ ] **Step 2: Update footer link rendering**

For each link in the services and company columns, replace the plain text with letter-split spans. Find patterns like:

```astro
{service.name}
```

Replace with:

```astro
<span class="footer-link__letters">
  {service.name.split('').map((char: string, i: number) => (
    <span class="footer-link__letter" style={`--letter-i: ${i}`}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))}
</span>
```

Apply to both the services links and the company links. Do NOT apply to legal links (too small) or contact info (email, phone, address).

- [ ] **Step 3: Add footer letter stagger CSS**

In the Footer `<style>` block, add:

```css
  .footer-link__letters {
    display: inline-flex;
  }

  .footer-link__letter {
    display: inline-block;
    transition: transform 0.3s calc(var(--letter-i) * 0.025s) cubic-bezier(0.25, 0.1, 0.25, 1),
                color 0.3s calc(var(--letter-i) * 0.025s);
  }

  a:hover .footer-link__letter {
    transform: translateY(-2px);
    color: var(--accent);
  }
```

- [ ] **Step 4: Verify in browser**

Scroll to footer, hover links in Services and Company columns. Letters should stagger upward.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add letter stagger effect to footer links"
```

---

## Task 8: GSAP Animation System

**Files:**
- Create: `src/lib/animations.ts`

- [ ] **Step 1: Create the centralized animation module**

```typescript
/**
 * animations.ts — Centralized GSAP animation system
 *
 * Auto-discovers elements with data-reveal attributes and initializes
 * appropriate ScrollTrigger animations. Respects prefers-reduced-motion.
 *
 * Usage: Add data-reveal="text|stagger|curtain|counter|clip" to elements.
 * Import and call initAnimations() from page scripts or BaseLayout.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Text Reveal — lines slide up from below */
function initTextReveals() {
  document.querySelectorAll('[data-reveal="text"]').forEach((el) => {
    const lines = el.querySelectorAll('.reveal-line');
    if (lines.length === 0) {
      // If no .reveal-line children, animate the element itself
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
      return;
    }
    gsap.from(lines, {
      y: '100%',
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });
}

/** Staggered Grid — children fade up in sequence */
function initStaggerGrids() {
  document.querySelectorAll('[data-reveal="stagger"]').forEach((el) => {
    const children = el.children;
    if (children.length === 0) return;
    gsap.from(children, {
      y: 60,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}

/** Image Curtain Reveal — overlay wipes away + image zoom settle */
function initCurtainReveals() {
  document.querySelectorAll('[data-reveal="curtain"]').forEach((el) => {
    const overlay = el.querySelector('.curtain-overlay');
    const image = el.querySelector('.curtain-image');
    if (!overlay) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });

    tl.to(overlay, {
      scaleX: 0,
      duration: 1.2,
      ease: 'power3.inOut',
    });

    if (image) {
      tl.from(image, {
        scale: 1.3,
        duration: 1.4,
        ease: 'power3.out',
      }, '-=0.8');
    }
  });
}

/** Counter Animation — numbers count up from 0 */
function initCounters() {
  document.querySelectorAll('[data-reveal="counter"]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-counter-target') || '0', 10);
    if (isNaN(target) || target === 0) return;

    const suffix = el.getAttribute('data-counter-suffix') || '';
    el.textContent = '0' + suffix;

    gsap.to(el, {
      textContent: target,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate() {
        el.textContent = Math.round(parseFloat(el.textContent || '0')) + suffix;
      },
    });
  });
}

/** Clip-Path Wipe — content revealed by animated clip */
function initClipReveals() {
  document.querySelectorAll('[data-reveal="clip"]').forEach((el) => {
    gsap.from(el, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 75%' },
    });
  });
}

/** Fade Up — simple fade + translate for generic elements */
function initFadeUps() {
  document.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}

/** Main init — call all animation initializers */
export function initAnimations() {
  if (prefersReducedMotion()) return;

  // Kill existing ScrollTriggers to prevent duplicates on page transitions
  ScrollTrigger.getAll().forEach((t) => t.kill());

  initTextReveals();
  initStaggerGrids();
  initCurtainReveals();
  initCounters();
  initClipReveals();
  initFadeUps();

  // Refresh ScrollTrigger after all animations are set up
  ScrollTrigger.refresh();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/animations.ts
git commit -m "feat: add centralized GSAP animation system with data-reveal attributes"
```

---

## Task 9: Wire Animations into BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (add script for animation init)

- [ ] **Step 1: Add animation init script to BaseLayout**

In `src/layouts/BaseLayout.astro`, add before the closing `</body>` tag (before line 94):

```astro
    <script>
      import { initAnimations } from '../lib/animations';

      // Init on first load
      initAnimations();

      // Re-init after Astro view transitions
      document.addEventListener('astro:after-swap', () => {
        initAnimations();
      });
    </script>
```

- [ ] **Step 2: Verify in browser**

```bash
cd "C:/Users/user/Desktop/Poojan/KP Infotech/website" && npm run dev
```

Open browser console. No errors should appear related to GSAP or animations.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: wire GSAP animation system into BaseLayout"
```

---

## Task 10: Apply data-reveal Attributes Across Existing Components

**Files:**
- Modify: `src/components/sections/StatsSection.astro`
- Modify: `src/components/sections/CTASection.astro`
- Modify: Various section components (headers, grids)

- [ ] **Step 1: Update StatsSection for counter animation**

In `src/components/sections/StatsSection.astro`, modify the stat value rendering (line 25).

Replace:

```astro
          <span class="stat-item__value">{stat.value}</span>
```

With:

```astro
          <span
            class="stat-item__value"
            data-reveal="counter"
            data-counter-target={stat.value.replace(/[^0-9]/g, '')}
            data-counter-suffix={stat.value.replace(/[0-9]/g, '')}
          >
            {stat.value}
          </span>
```

This extracts the numeric portion (e.g., "150" from "150+") and the suffix ("+").

- [ ] **Step 2: Add clip-path reveal to CTA**

In `src/components/sections/CTASection.astro`, add `data-reveal="clip"` to the card div (line 22).

Replace:

```astro
    <div class="cta-section__card">
```

With:

```astro
    <div class="cta-section__card" data-reveal="clip">
```

- [ ] **Step 3: Add stagger reveals to key section grids**

For each component below, read the file and add `data-reveal="stagger"` to the grid/list container that holds cards:

- `src/components/sections/RelatedServicesGrid.astro` — the grid element
- `src/components/sections/FeaturedWork.astro` — the work cards container
- `src/components/sections/Testimonials.astro` — the testimonials container
- `src/components/sections/Team.astro` — the team grid

For each, find the container element that wraps the repeated items and add `data-reveal="stagger"`.

- [ ] **Step 4: Verify in browser**

Open http://localhost:4321. Scroll through pages:
- Stats numbers should count up from 0
- CTA card should wipe in from left via clip-path
- Card grids should fade up with stagger

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/StatsSection.astro src/components/sections/CTASection.astro
git add -A src/components/sections/
git commit -m "feat: apply data-reveal attributes for GSAP animations across sections"
```

---

## Task 11: Careers Page

**Files:**
- Create: `src/pages/careers/index.astro`

- [ ] **Step 1: Create the careers page**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PageHero from '../../components/sections/PageHero.astro';
import SectionLabel from '../../components/ui/SectionLabel.astro';
import HighlightedText from '../../components/ui/HighlightedText.astro';
import Button from '../../components/ui/Button.astro';
import CTASection from '../../components/sections/CTASection.astro';
import { client } from '../../lib/sanity';
import { activeJobListingsQuery } from '../../lib/queries';

// Fetch active job listings
const jobs = await client.fetch(activeJobListingsQuery) || [];
const hasJobs = jobs.length > 0;
---

<BaseLayout
  title="Careers"
  description="Join KP Infotech — we're building the future of digital experiences. Explore open positions and apply."
>
  <!-- Hero -->
  <PageHero variant="inner">
    <h1>Join Our <span class="text-[var(--accent)]">Team</span></h1>
    <p class="page-hero__description">
      We're building the future of digital experiences. Find your place at KP Infotech.
    </p>
  </PageHero>

  <!-- Open Positions or Empty State -->
  <section class="careers-listings">
    <div class="careers-listings__container">
      {hasJobs ? (
        <>
          <SectionLabel text="Open Positions" />
          <div class="careers-listings__list" data-reveal="stagger">
            {jobs.map((job: any) => (
              <a href={`#apply`} class="job-card" data-position={job.title}>
                <div class="job-card__content">
                  <h3 class="job-card__title">{job.title}</h3>
                  <div class="job-card__meta">
                    {job.employmentType && <span class="job-card__tag">{job.employmentType}</span>}
                    {job.location && <span class="job-card__location">{job.location}</span>}
                    {job.department && <span class="job-card__dept">{job.department}</span>}
                  </div>
                  {job.tagline && <p class="job-card__desc">{job.tagline}</p>}
                </div>
                <span class="job-card__arrow">Apply Now &rarr;</span>
              </a>
            ))}
          </div>
        </>
      ) : (
        <div class="careers-empty" data-reveal="fade">
          <h2 class="careers-empty__title">No Open Positions Right Now</h2>
          <p class="careers-empty__text">
            We're always looking for talented people. Send us your details below and we'll reach out when something opens up.
          </p>
          <div class="careers-empty__arrow">
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 0v36M4 28l8 8 8-8"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  </section>

  <!-- Application Form -->
  <section class="careers-form" id="apply">
    <div class="careers-form__container">
      <SectionLabel text="Apply" />
      <h2 class="careers-form__title">
        <HighlightedText text="Send Us Your *Details*" />
      </h2>

      <form id="careers-form" class="careers-form__form" enctype="multipart/form-data">
        <!-- Honeypot -->
        <div style="position: absolute; left: -9999px;" aria-hidden="true">
          <input type="text" name="website" tabindex="-1" autocomplete="off" />
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label for="name">Name <span class="required">*</span></label>
            <input type="text" id="name" name="name" required placeholder="Your full name" />
          </div>

          <div class="form-field">
            <label for="email">Email <span class="required">*</span></label>
            <input type="email" id="email" name="email" required placeholder="you@example.com" />
          </div>

          <div class="form-field">
            <label for="phone">Phone <span class="required">*</span></label>
            <input type="tel" id="phone" name="phone" required placeholder="+91 98765 43210" />
          </div>

          <div class="form-field">
            <label for="position">Position</label>
            <input type="text" id="position" name="position" value="General Application" placeholder="Position you're applying for" />
          </div>

          <div class="form-field form-field--full">
            <label for="linkedin">LinkedIn Profile <span class="optional">(optional)</span></label>
            <input type="url" id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
          </div>

          <div class="form-field form-field--full">
            <label for="resume">Resume / CV <span class="required">*</span></label>
            <div class="file-upload" id="file-upload-area">
              <input type="file" id="resume" name="resume" required accept=".pdf,.doc,.docx" class="file-upload__input" />
              <div class="file-upload__display">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span class="file-upload__text">Choose file or drag here</span>
                <span class="file-upload__hint">PDF, DOC, DOCX — max 5MB</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Turnstile widget placeholder -->
        <div id="turnstile-container" class="turnstile-wrapper"></div>

        <div class="form-actions">
          <Button variant="primary" type="submit">
            Submit Application
          </Button>
        </div>

        <!-- Status messages -->
        <div id="form-success" class="form-message form-message--success" style="display: none;">
          Application sent! We'll be in touch.
        </div>
        <div id="form-error" class="form-message form-message--error" style="display: none;">
          Something went wrong. Please try again or email us.
        </div>
      </form>
    </div>
  </section>

  <!-- CTA -->
  <CTASection
    headline="Want to *Collaborate* Instead?"
    description="If you're looking to work with us on a project, let's talk."
    buttonText="Get in Touch"
    buttonHref="/contact/"
  />
</BaseLayout>

<Fragment slot="head">
  {hasJobs && (
    <script type="application/ld+json" set:html={JSON.stringify(
      jobs.map((job: any) => ({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "employmentType": job.employmentType?.toUpperCase().replace(/\s/g, '_'),
        "jobLocation": {
          "@type": "Place",
          "address": job.location
        },
        "hiringOrganization": {
          "@type": "Organization",
          "name": "KP Infotech",
          "sameAs": "https://kpinfo.tech"
        },
        "description": job.tagline
      }))
    )} />
  )}
</Fragment>

<style>
  /* Listings Section */
  .careers-listings {
    padding: 6rem 0;
  }

  .careers-listings__container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .careers-listings__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }

  /* Job Card */
  .job-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-left: 3px solid transparent;
    text-decoration: none;
    transition: border-left-color 0.3s, transform 0.3s, background 0.3s;
  }

  .job-card:hover {
    border-left-color: var(--accent);
    transform: translateY(-2px);
    background: var(--bg-tertiary, #161616);
  }

  .job-card__title {
    font-family: var(--font-body);
    font-size: 1.125rem;
    font-weight: 400;
    margin: 0 0 0.75rem;
    color: var(--text-primary);
  }

  .job-card__meta {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .job-card__tag {
    font-size: 0.6875rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--accent);
    padding: 0.25rem 0.75rem;
    border: 1px solid rgba(201, 168, 124, 0.3);
  }

  .job-card__location,
  .job-card__dept {
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  .job-card__desc {
    margin: 0.75rem 0 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .job-card__arrow {
    font-size: 0.75rem;
    letter-spacing: 1px;
    color: var(--accent);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Empty State */
  .careers-empty {
    text-align: center;
    padding: 4rem 0;
  }

  .careers-empty__title {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 500;
    margin: 0 0 1rem;
    color: var(--text-primary);
  }

  .careers-empty__text {
    font-size: 1.0625rem;
    color: var(--text-secondary);
    max-width: 500px;
    margin: 0 auto 2rem;
    line-height: 1.7;
  }

  .careers-empty__arrow {
    color: var(--accent);
    opacity: 0.5;
    animation: bounceDown 2s infinite;
  }

  @keyframes bounceDown {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  /* Application Form */
  .careers-form {
    padding: 6rem 0;
    background: var(--bg-secondary);
  }

  .careers-form__container {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .careers-form__title {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 500;
    margin: 1rem 0 2.5rem;
    color: var(--text-primary);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .form-field--full {
    grid-column: 1 / -1;
  }

  .form-field label {
    display: block;
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }

  .required { color: var(--accent); }
  .optional { color: var(--text-muted, #3a3a3a); font-style: italic; text-transform: none; letter-spacing: 0; }

  .form-field input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.9375rem;
    font-weight: 300;
    transition: border-color 0.3s;
  }

  .form-field input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .form-field input::placeholder {
    color: var(--text-muted, #3a3a3a);
  }

  /* File Upload */
  .file-upload {
    position: relative;
  }

  .file-upload__input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }

  .file-upload__display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 2rem;
    border: 1px dashed var(--border-light, #2a2a2a);
    color: var(--text-secondary);
    text-align: center;
    transition: border-color 0.3s, color 0.3s;
  }

  .file-upload:hover .file-upload__display,
  .file-upload--active .file-upload__display {
    border-color: var(--accent);
    color: var(--accent);
  }

  .file-upload__text {
    font-size: 0.875rem;
  }

  .file-upload__hint {
    font-size: 0.75rem;
    color: var(--text-muted, #3a3a3a);
  }

  .file-upload--has-file .file-upload__text {
    color: var(--accent);
  }

  /* Turnstile */
  .turnstile-wrapper {
    margin: 1.5rem 0;
  }

  /* Form Actions */
  .form-actions {
    margin-top: 2rem;
  }

  /* Status Messages */
  .form-message {
    margin-top: 1.5rem;
    padding: 1rem;
    font-size: 0.875rem;
    text-align: center;
  }

  .form-message--success {
    color: var(--success, #4ade80);
    border: 1px solid rgba(74, 222, 128, 0.2);
  }

  .form-message--error {
    color: var(--error, #f87171);
    border: 1px solid rgba(248, 113, 113, 0.2);
  }

  @media (max-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .job-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .careers-listings,
    .careers-form {
      padding: 4rem 0;
    }
  }
</style>

<script>
  // Auto-fill position from job card click
  document.querySelectorAll('.job-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const position = (card as HTMLElement).dataset.position;
      const input = document.getElementById('position') as HTMLInputElement;
      if (input && position) {
        input.value = position;
      }
    });
  });

  // File upload display
  const fileInput = document.getElementById('resume') as HTMLInputElement;
  const fileArea = document.getElementById('file-upload-area');
  const fileText = fileArea?.querySelector('.file-upload__text');

  if (fileInput && fileArea && fileText) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (file) {
        fileText.textContent = file.name;
        fileArea.classList.add('file-upload--has-file');
      } else {
        fileText.textContent = 'Choose file or drag here';
        fileArea.classList.remove('file-upload--has-file');
      }
    });

    // Drag and drop
    fileArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileArea.classList.add('file-upload--active');
    });

    fileArea.addEventListener('dragleave', () => {
      fileArea.classList.remove('file-upload--active');
    });

    fileArea.addEventListener('drop', (e) => {
      e.preventDefault();
      fileArea.classList.remove('file-upload--active');
      const file = (e as DragEvent).dataTransfer?.files[0];
      if (file && fileInput) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('change'));
      }
    });
  }

  // Form submission
  const form = document.getElementById('careers-form') as HTMLFormElement;
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]') as HTMLButtonElement;
      const btnText = submitBtn?.querySelector('.btn__text');
      const successMsg = document.getElementById('form-success');
      const errorMsg = document.getElementById('form-error');
      const originalText = btnText?.textContent;

      // Hide previous messages
      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';

      // Disable button
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending...';

      try {
        const formData = new FormData(form);

        // Client-side file validation
        const file = formData.get('resume') as File;
        if (file && file.size > 5 * 1024 * 1024) {
          throw new Error('File size must be under 5MB');
        }

        const response = await fetch('/api/careers/apply', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Submission failed');
        }

        // Success
        if (successMsg) successMsg.style.display = 'block';
        form.reset();
        if (fileText) fileText.textContent = 'Choose file or drag here';
        if (fileArea) fileArea.classList.remove('file-upload--has-file');

      } catch (error: any) {
        console.error('Form error:', error);
        if (errorMsg) {
          errorMsg.textContent = error.message || 'Something went wrong. Please try again.';
          errorMsg.style.display = 'block';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = originalText || 'Submit Application';
      }
    });
  }
</script>
```

- [ ] **Step 2: Verify page renders**

```bash
cd "C:/Users/user/Desktop/Poojan/KP Infotech/website" && npm run dev
```

Open http://localhost:4321/careers/. Verify:
- Hero shows "Join Our Team"
- Empty state shows since no job listings exist in Sanity
- Application form renders with all fields
- File upload area works (drag and drop + click)
- Form layout is responsive

- [ ] **Step 3: Commit**

```bash
git add src/pages/careers/index.astro
git commit -m "feat: add careers page with job listings and application form"
```

---

## Task 12: Careers API Route

**Files:**
- Create: `src/pages/api/careers/apply.ts`

- [ ] **Step 1: Create the API endpoint**

```typescript
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Rate limiting: simple in-memory store (resets on worker restart)
const submissions = new Map<string, number[]>();
const RATE_LIMIT = 3; // max submissions
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = submissions.get(ip) || [];
  const recent = times.filter((t) => now - t < RATE_WINDOW);
  submissions.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}

function recordSubmission(ip: string) {
  const times = submissions.get(ip) || [];
  times.push(Date.now());
  submissions.set(ip, times);
}

// Allowed MIME types for resume
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')
      || 'unknown';

    // Rate limit check
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Too many submissions. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await request.formData();

    // Honeypot check — if filled, silently "succeed"
    const honeypot = formData.get('website');
    if (honeypot) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Turnstile verification
    const turnstileToken = formData.get('cf-turnstile-response') as string;
    const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;

    if (turnstileSecret && turnstileToken) {
      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: ip,
        }),
      });
      const turnstileData = await turnstileRes.json() as { success: boolean };
      if (!turnstileData.success) {
        return new Response(
          JSON.stringify({ success: false, error: 'Verification failed. Please try again.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Extract fields
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    const position = (formData.get('position') as string)?.trim() || 'General Application';
    const linkedin = (formData.get('linkedin') as string)?.trim() || '';
    const resume = formData.get('resume') as File;

    // Validate required fields
    if (!name || !email || !phone) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name, email, and phone are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate file
    if (!resume || resume.size === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Resume is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (resume.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, error: 'File size must be under 5MB.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!ALLOWED_TYPES.includes(resume.type)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Only PDF, DOC, and DOCX files are accepted.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const resendKey = import.meta.env.RESEND_API_KEY;
    const toEmail = import.meta.env.CAREERS_EMAIL_TO || 'careers@kpinfo.tech';

    if (!resendKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendKey);
    const fileBuffer = Buffer.from(await resume.arrayBuffer());

    await resend.emails.send({
      from: 'KP Infotech Careers <careers@kpinfo.tech>',
      to: [toEmail],
      subject: `New Application: ${position} — ${name}`,
      html: `
        <h2>New Job Application</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Position:</td><td style="padding: 8px;">${position}</td></tr>
          ${linkedin ? `<tr><td style="padding: 8px; font-weight: bold;">LinkedIn:</td><td style="padding: 8px;"><a href="${linkedin}">${linkedin}</a></td></tr>` : ''}
        </table>
        <p style="margin-top: 16px; color: #666;">Resume attached.</p>
      `,
      attachments: [
        {
          filename: resume.name,
          content: fileBuffer,
        },
      ],
    });

    // Record successful submission for rate limiting
    recordSubmission(ip);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Careers form error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

- [ ] **Step 2: Verify the file compiles**

```bash
cd "C:/Users/user/Desktop/Poojan/KP Infotech/website" && npm run dev
```

Check that the dev server starts without errors. The endpoint won't work without env vars, but it should compile.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/careers/apply.ts
git commit -m "feat: add careers application API route with Resend, rate limiting, and Turnstile"
```

---

## Task 13: Privacy Policy Page

**Files:**
- Create: `src/pages/privacy-policy/index.astro`

- [ ] **Step 1: Create the privacy policy page**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PageHero from '../../components/sections/PageHero.astro';
---

<BaseLayout
  title="Privacy Policy"
  description="KP Infotech privacy policy — how we collect, use, and protect your information."
>
  <PageHero variant="inner">
    <h1>Privacy Policy</h1>
    <p class="page-hero__description">Last updated: April 2026</p>
  </PageHero>

  <section class="legal-content">
    <div class="legal-content__container">

      <h3>1. Information We Collect</h3>
      <p>We collect information you provide directly to us, including your name, email address, phone number, and any other information you choose to provide when you fill out a contact form, apply for a position, or communicate with us.</p>
      <p>We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website.</p>

      <h3>2. How We Use Your Information</h3>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Respond to your inquiries and fulfill your requests</li>
        <li>Send you technical notices and support messages</li>
        <li>Communicate with you about projects, services, and events</li>
        <li>Monitor and analyze trends, usage, and activities on our website</li>
        <li>Improve our website and develop new features</li>
        <li>Process job applications submitted through our careers page</li>
      </ul>

      <h3>3. Cookies and Tracking</h3>
      <p>We use cookies and similar tracking technologies to collect information about your browsing activity. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our website may not function properly.</p>

      <h3>4. Third-Party Services</h3>
      <p>We use the following third-party services that may collect information about you:</p>
      <ul>
        <li><strong>Google Analytics (GA4)</strong> — for website analytics and usage statistics</li>
        <li><strong>HubSpot</strong> — for form handling and customer relationship management</li>
        <li><strong>Sanity</strong> — for content management (no user data stored)</li>
        <li><strong>Cloudflare</strong> — for website hosting, security, and performance</li>
        <li><strong>Resend</strong> — for transactional email delivery</li>
      </ul>

      <h3>5. Data Retention</h3>
      <p>We retain personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. Contact form submissions and job applications are retained for up to 12 months.</p>

      <h3>6. Your Rights</h3>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you</li>
        <li>Correct inaccurate or incomplete personal information</li>
        <li>Request deletion of your personal information</li>
        <li>Object to or restrict processing of your personal information</li>
        <li>Data portability</li>
      </ul>
      <p>To exercise any of these rights, please contact us using the information below.</p>

      <h3>7. Contact Us</h3>
      <p>If you have any questions about this Privacy Policy, please contact us at:</p>
      <p><strong>KP Infotech</strong><br />Email: <a href="mailto:info@kpinfo.tech">info@kpinfo.tech</a></p>

    </div>
  </section>
</BaseLayout>

<style>
  .legal-content {
    padding: 4rem 0 6rem;
  }

  .legal-content__container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .legal-content__container h3 {
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--text-primary);
    margin: 2.5rem 0 1rem;
  }

  .legal-content__container h3:first-child {
    margin-top: 0;
  }

  .legal-content__container p {
    font-size: 1rem;
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 1.8;
    margin: 0 0 1rem;
  }

  .legal-content__container ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
  }

  .legal-content__container li {
    position: relative;
    padding-left: 1.5rem;
    font-size: 1rem;
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 0.5rem;
  }

  .legal-content__container li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.75rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.6;
  }

  .legal-content__container a {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.3s;
  }

  .legal-content__container a:hover {
    color: var(--accent-light, #e4d4bc);
  }

  .legal-content__container strong {
    font-weight: 400;
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .legal-content {
      padding: 3rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 2: Verify at http://localhost:4321/privacy-policy/**

Page should render with hero and formatted legal content.

- [ ] **Step 3: Commit**

```bash
git add src/pages/privacy-policy/index.astro
git commit -m "feat: add privacy policy page"
```

---

## Task 14: Terms of Service Page

**Files:**
- Create: `src/pages/terms-of-service/index.astro`

- [ ] **Step 1: Create the terms of service page**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PageHero from '../../components/sections/PageHero.astro';
---

<BaseLayout
  title="Terms of Service"
  description="KP Infotech terms of service — the terms governing use of our website and services."
>
  <PageHero variant="inner">
    <h1>Terms of Service</h1>
    <p class="page-hero__description">Last updated: April 2026</p>
  </PageHero>

  <section class="legal-content">
    <div class="legal-content__container">

      <h3>1. Acceptance of Terms</h3>
      <p>By accessing and using the KP Infotech website (kpinfo.tech), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>

      <h3>2. Services Description</h3>
      <p>KP Infotech provides design and technology services including UI/UX design, web development, mobile application development, ERP solutions, and digital marketing. Specific terms for individual projects are defined in separate service agreements.</p>

      <h3>3. Intellectual Property</h3>
      <p>All content on this website, including text, graphics, logos, images, and software, is the property of KP Infotech or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.</p>
      <p>For client projects, intellectual property ownership and usage rights are defined in the respective project agreements.</p>

      <h3>4. User Conduct</h3>
      <p>When using our website, you agree not to:</p>
      <ul>
        <li>Use the website for any unlawful purpose</li>
        <li>Attempt to gain unauthorized access to any part of the website</li>
        <li>Interfere with or disrupt the website or servers</li>
        <li>Submit false or misleading information through our forms</li>
        <li>Use automated systems to access the website without permission</li>
      </ul>

      <h3>5. Limitation of Liability</h3>
      <p>KP Infotech provides this website on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the website's operation or the information, content, or materials included on it.</p>
      <p>To the fullest extent permitted by law, KP Infotech shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website.</p>

      <h3>6. Governing Law</h3>
      <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat, India.</p>

      <h3>7. Changes to Terms</h3>
      <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of the website after changes are posted constitutes your acceptance of the modified terms.</p>

      <h3>8. Contact Us</h3>
      <p>If you have any questions about these Terms of Service, please contact us at:</p>
      <p><strong>KP Infotech</strong><br />Email: <a href="mailto:info@kpinfo.tech">info@kpinfo.tech</a></p>

    </div>
  </section>
</BaseLayout>

<style>
  .legal-content {
    padding: 4rem 0 6rem;
  }

  .legal-content__container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .legal-content__container h3 {
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--text-primary);
    margin: 2.5rem 0 1rem;
  }

  .legal-content__container h3:first-child {
    margin-top: 0;
  }

  .legal-content__container p {
    font-size: 1rem;
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 1.8;
    margin: 0 0 1rem;
  }

  .legal-content__container ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
  }

  .legal-content__container li {
    position: relative;
    padding-left: 1.5rem;
    font-size: 1rem;
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 0.5rem;
  }

  .legal-content__container li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.75rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.6;
  }

  .legal-content__container a {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.3s;
  }

  .legal-content__container a:hover {
    color: var(--accent-light, #e4d4bc);
  }

  .legal-content__container strong {
    font-weight: 400;
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .legal-content {
      padding: 3rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 2: Verify at http://localhost:4321/terms-of-service/**

- [ ] **Step 3: Commit**

```bash
git add src/pages/terms-of-service/index.astro
git commit -m "feat: add terms of service page"
```

---

## Task 15: Build Verification

- [ ] **Step 1: Run production build**

```bash
cd "C:/Users/user/Desktop/Poojan/KP Infotech/website" && npm run build
```

Expected: Build succeeds with no errors. Check for any warnings about missing env vars (Turnstile, Resend keys are expected to be missing locally).

- [ ] **Step 2: Preview production build**

```bash
cd "C:/Users/user/Desktop/Poojan/KP Infotech/website" && npm run preview
```

Open http://localhost:4321 and verify:
- Custom cursor works across all pages
- Scroll progress bar tracks scroll position
- Button border draw effect works on all primary buttons
- Letter stagger works on nav and footer links
- Stats counter animates on scroll
- CTA card has clip-path reveal
- /careers/ page renders (empty state + form)
- /privacy-policy/ page renders
- /terms-of-service/ page renders
- No console errors

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Phase 7 Polish — cursor, scroll progress, animations, careers, legal pages"
```

---

## Environment Variables Checklist

These need to be set in Cloudflare Pages dashboard for the careers form to work in production:

```bash
TURNSTILE_SITE_KEY=           # Cloudflare Turnstile (get from Cloudflare dashboard)
TURNSTILE_SECRET_KEY=         # Cloudflare Turnstile server key
RESEND_API_KEY=               # Resend API key (get from resend.com)
CAREERS_EMAIL_TO=             # Email address to receive applications
```

Turnstile widget is optional — the form works without it but has less spam protection. To enable it, add the Turnstile script and widget to the careers page form.
