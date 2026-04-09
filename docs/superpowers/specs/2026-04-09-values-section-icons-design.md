# Values Section — Icon Integration Design

**Date:** 2026-04-09
**Scope:** Add 3D icon images to the About page Values section

---

## Summary

Integrate four 3D icon images (Craft, Partnership, Innovation, Integrity) into the existing Values section on the About page. The icons are colorful 3D renders on transparent backgrounds — the color pop against the dark theme is intentional and adds personality.

## Layout

**Current:** Vertical card with number → title → description (2x2 grid on desktop, 1-column on mobile).

**New:** Horizontal card with icon on the left, number + title + description on the right (same 2x2 grid).

```
┌──────────────────────────────────┐
│  [72px icon]  01                 │
│               Craft              │
│               Description text...│
└──────────────────────────────────┘
```

- Grid: 2 columns at 640px+, 1 column below (unchanged)
- Card: `display: flex`, `align-items: flex-start`, `gap: 20px`
- Hover: existing accent border-color transition stays

## Icon Specifications

| Value | Source File | Static Path | Alt Text |
|-------|-----------|-------------|----------|
| Craft | `craft-click-button.png` | `/images/values/craft.png` | Craft icon |
| Partnership | `partnership-deal.png` | `/images/values/partnership.png` | Partnership icon |
| Innovation | `innovation.png` | `/images/values/innovation.png` | Innovation icon |
| Integrity | `integrity-badge.png` | `/images/values/integrity.png` | Integrity icon |

**Icon styling:**
- Size: 72x72px (`width: 72px; height: 72px; min-width: 72px`)
- Fit: `object-fit: contain`
- No background container, border, or overlay — renders sit directly on card background
- Full color, no desaturation or opacity reduction

## Image Storage

Static assets in `public/images/values/`. These are brand identity assets that won't change via CMS.

Source: `I:\Shared drives\KP Infotech\Website\Website Images\`

## Files to Modify

1. **`public/images/values/`** — Create directory, copy 4 PNG files (renamed for clarity)
2. **`src/components/sections/Values.astro`** — Add `icon` to `Value` interface, update markup to flex horizontal layout, update CSS
3. **`src/pages/about.astro`** — Add `icon` path to each value in props

## Component Interface Change

```typescript
// Before
interface Value {
  title: string;
  description: string;
}

// After
interface Value {
  title: string;
  description: string;
  icon?: string;  // Path to icon image, e.g. "/images/values/craft.png"
}
```

The `icon` field is optional so the component works with or without icons.

## Mobile Behavior

- Below 640px: cards stack to single column
- Each card keeps the horizontal icon-left layout (icon + text side by side)
- Icon may shrink slightly on very small screens (min-width prevents collapse)

## No Other Changes

- Section header (label + headline) stays the same
- Section background (`--bg-secondary`) stays the same
- Hover behavior (accent border) stays the same
- Card padding and spacing follow existing patterns
