# Values Section Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3D icon images to the About page Values section cards using a horizontal icon-left layout.

**Architecture:** Copy 4 static PNG images to `public/images/values/`, update the `Values.astro` component to accept an optional `icon` prop per value and render a horizontal flex layout, update `about.astro` to pass icon paths.

**Tech Stack:** Astro, CSS

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `public/images/values/craft.png` | Create | Static value icon asset |
| `public/images/values/partnership.png` | Create | Static value icon asset |
| `public/images/values/innovation.png` | Create | Static value icon asset |
| `public/images/values/integrity.png` | Create | Static value icon asset |
| `src/components/sections/Values.astro` | Modify | Add icon support to interface, horizontal flex layout, updated CSS |
| `src/pages/about.astro` | Modify | Pass icon paths in values props |

---

## Task 1: Copy Icon Images to Public Directory

**Files:**
- Create: `public/images/values/craft.png`
- Create: `public/images/values/partnership.png`
- Create: `public/images/values/innovation.png`
- Create: `public/images/values/integrity.png`

- [ ] **Step 1: Create the directory and copy images**

Run:
```bash
mkdir -p public/images/values
cp "I:/Shared drives/KP Infotech/Website/Website Images/craft-click-button.png" public/images/values/craft.png
cp "I:/Shared drives/KP Infotech/Website/Website Images/partnership-deal.png" public/images/values/partnership.png
cp "I:/Shared drives/KP Infotech/Website/Website Images/innovation.png" public/images/values/innovation.png
cp "I:/Shared drives/KP Infotech/Website/Website Images/integrity-badge.png" public/images/values/integrity.png
```

- [ ] **Step 2: Verify all 4 files exist**

Run:
```bash
ls -la public/images/values/
```

Expected: 4 PNG files — `craft.png`, `innovation.png`, `integrity.png`, `partnership.png`

- [ ] **Step 3: Commit**

```bash
git add public/images/values/
git commit -m "feat: add value icon images for About page"
```

---

## Task 2: Update Values Component with Icon Support

**Files:**
- Modify: `src/components/sections/Values.astro`

- [ ] **Step 1: Update the Value interface to include optional icon**

In `src/components/sections/Values.astro`, change the interface from:

```typescript
interface Value {
  title: string;
  description: string;
}
```

To:

```typescript
interface Value {
  title: string;
  description: string;
  icon?: string;
}
```

- [ ] **Step 2: Update the card markup to horizontal flex layout with icon**

Replace the card rendering inside the `.values__grid` map:

```astro
{values.map((value, index) => (
  <div class="value-card">
    <span class="value-card__number">{String(index + 1).padStart(2, '0')}</span>
    <h3 class="value-card__title">{value.title}</h3>
    <p class="value-card__description">{value.description}</p>
  </div>
))}
```

With:

```astro
{values.map((value, index) => (
  <div class:list={["value-card", { "value-card--has-icon": value.icon }]}>
    {value.icon && (
      <img
        src={value.icon}
        alt={`${value.title} icon`}
        class="value-card__icon"
        width="72"
        height="72"
        loading="lazy"
      />
    )}
    <div class="value-card__text">
      <span class="value-card__number">{String(index + 1).padStart(2, '0')}</span>
      <h3 class="value-card__title">{value.title}</h3>
      <p class="value-card__description">{value.description}</p>
    </div>
  </div>
))}
```

- [ ] **Step 3: Update CSS for horizontal flex layout**

Replace the existing `.value-card` styles (the block starting with `.value-card {` through the last `.value-card__description` rule, but NOT the media queries) with:

```css
  .value-card {
    padding: 2.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    transition: border-color 0.3s ease;
  }

  .value-card--has-icon {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .value-card:hover {
    border-color: var(--accent);
  }

  .value-card__icon {
    width: 72px;
    height: 72px;
    min-width: 72px;
    object-fit: contain;
  }

  .value-card__number {
    display: block;
    font-family: var(--font-body), 'Outfit', sans-serif;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--accent);
    margin-bottom: 1.5rem;
  }

  .value-card__title {
    font-family: var(--font-display), 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0 0 1rem;
  }

  .value-card__description {
    font-family: var(--font-body), 'Outfit', sans-serif;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
  }
```

- [ ] **Step 4: Update the desktop media query**

In the `@media (min-width: 1024px)` block, keep the existing grid gap rule and update the card padding:

```css
  @media (min-width: 1024px) {
    .values__grid {
      gap: 2rem;
    }

    .value-card {
      padding: 3rem;
    }
  }
```

This is unchanged from current — just verify it's still there.

- [ ] **Step 5: Update the mobile media query**

In the `@media (max-width: 768px)` block, add icon sizing for small screens:

```css
  @media (max-width: 768px) {
    .values {
      padding: 4rem 0;
    }

    .values__header {
      margin-bottom: 3rem;
    }

    .value-card {
      padding: 2rem;
    }

    .value-card__icon {
      width: 56px;
      height: 56px;
      min-width: 56px;
    }
  }
```

- [ ] **Step 6: Verify the dev server renders correctly**

Run:
```bash
npm run dev
```

Open `http://localhost:4321/about/` and verify:
- Values section shows 4 cards in 2x2 grid on desktop
- Each card has the 3D icon on the left, number + title + description on the right
- Icons display at 72px on desktop, 56px on mobile
- Hover still shows accent border
- Cards without icons (if any) render normally in vertical layout

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Values.astro
git commit -m "feat: add icon support to Values component with horizontal layout"
```

---

## Task 3: Pass Icon Paths in About Page

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Add icon paths to the values array**

In `src/pages/about.astro`, update the `<Values>` component props from:

```astro
<Values
  label="Our Values"
  headline="What *Guides* Us"
  values={[
    {
      title: "Craft",
      description: "We obsess over the details. Every pixel, every interaction, every line of code is crafted with intention and care."
    },
    {
      title: "Partnership",
      description: "We don't just build for clients—we build with them. True collaboration creates the best outcomes."
    },
    {
      title: "Innovation",
      description: "We stay curious and embrace new technologies, always seeking better ways to solve problems."
    },
    {
      title: "Integrity",
      description: "We're honest about what we can deliver, transparent in our process, and committed to doing what's right."
    }
  ]}
/>
```

To:

```astro
<Values
  label="Our Values"
  headline="What *Guides* Us"
  values={[
    {
      title: "Craft",
      description: "We obsess over the details. Every pixel, every interaction, every line of code is crafted with intention and care.",
      icon: "/images/values/craft.png"
    },
    {
      title: "Partnership",
      description: "We don't just build for clients—we build with them. True collaboration creates the best outcomes.",
      icon: "/images/values/partnership.png"
    },
    {
      title: "Innovation",
      description: "We stay curious and embrace new technologies, always seeking better ways to solve problems.",
      icon: "/images/values/innovation.png"
    },
    {
      title: "Integrity",
      description: "We're honest about what we can deliver, transparent in our process, and committed to doing what's right.",
      icon: "/images/values/integrity.png"
    }
  ]}
/>
```

- [ ] **Step 2: Verify on dev server**

Run:
```bash
npm run dev
```

Open `http://localhost:4321/about/` — all 4 value cards should show their respective 3D icons on the left.

- [ ] **Step 3: Build check**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add value icons to About page"
```
