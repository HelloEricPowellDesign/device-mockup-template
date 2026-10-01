# Hero Device Mockup Template — Plan

## Context

Eric Powell's portfolio site uses "Motion" placeholders in two places:
1. **Case study card thumbnails** on the index — a compact animated device mockup
2. **Case study page heroes** — a large, cinematic version at the top of each case study

The goal is a reusable `DeviceMockup` component that renders an animated device frame (iPhone, iPad, MacBook Pro, or desktop monitor) with a placeholder screen animation simulating UI interaction — similar to the videinfra.com hero treatment (device floating in space, screen content animating as if being used).

---

## Design System (from ericpowell-design.vercel.app/design-system/)

All tokens are used verbatim — no new palette is introduced.

### Colors
| Token | Dark mode | Light mode |
|-------|-----------|------------|
| `--color-paper` | `#18181A` | `#FFFFFF` |
| `--color-ink` | `#FFFFFF` | `#18181A` |
| `--color-muted` | `#A3A3A3` | `#666666` |
| `--color-accent` | `#F54A38` | `#F54A38` |
| `--color-rule` | `#3A3A3C` | `#DDDDDD` |

The hero mockup lives on the **dark** ground (`#18181A`) — matching the portfolio's dark mode presentation.

### Typography
- **Font: Open Sans exclusively** — all three roles (display, body, data)
- Device type labels use `--text-data` (0.8125rem / 13px, Open Sans, tracking as needed)
- Any screen-content placeholder labels also use Open Sans

### Motion
- `--duration: 480ms ease-out` — transition micro-interactions
- `--duration-fast: 200ms ease-out` — quick state changes
- `prefers-reduced-motion: reduce` collapses both to 1ms
- Float/drift loop animation (the device hovering): 6s cubic-bezier, separate from the DS duration tokens but respects `prefers-reduced-motion`

### Border Radius
- `--radius-card: 1.25rem` — card containers holding the mockup
- Device bezels use their own natural radius per device type (iPhone ~2.5rem, iPad ~1.5rem, etc.) — not the card token

### Spacing
- Uses the 4px base scale; composite tokens `--space-page-x` and `--space-section` for layout rhythm

---

## Component Architecture

### `DeviceMockup` component (`src/components/DeviceMockup.tsx`)

**Props:**
```ts
type DeviceType = 'iphone' | 'ipad' | 'macbook' | 'desktop';
type DisplaySize = 'card' | 'hero';

interface DeviceMockupProps {
  device: DeviceType;
  size: DisplaySize;
  className?: string;
}
```

**Per-device construction (CSS/div only — no SVG libraries or external assets):**
- **iPhone**: Dynamic Island pill cutout at top, 390×844 aspect ratio, ~2.5rem corner radius, side buttons rendered as thin border strips
- **iPad**: 820×1100 aspect ratio landscape, slim 8px bezels, home indicator bar
- **MacBook Pro**: Screen (16:10) + notch + thin hinge line + keyboard palmrest base with trackpad; whole unit wider than tall
- **Desktop**: Thin-bezel monitor (16:9) + short neck + elliptical base; standalone, no keyboard

All shapes built with Tailwind utilities + inline CSS where specific aspect ratios or pixel values are needed.

---

## Animation System

### 1. Device float (outer loop)
Applied to the entire device wrapper:
```css
@keyframes device-float {
  0%, 100% { transform: perspective(1200px) rotateY(-4deg) rotateX(3deg) translateY(0px); }
  50%       { transform: perspective(1200px) rotateY(4deg)  rotateX(-2deg) translateY(-8px); }
}
/* duration: 6s, easing: cubic-bezier(0.45, 0, 0.55, 1), iteration: infinite */
```

### 2. Screen content animation (inner loop)
Inside the screen, staggered CSS animations simulate a UI being used — all using `#F54A38` accent sparingly and `#3A3A3C` as UI chrome:
- **Nav bar**: static strip at top
- **Content rows**: 3 placeholder content blocks that fade in sequentially (200ms stagger)
- **Active element pulse**: one element pulses with accent color glow (`#F54A38` at low opacity)
- **Simulated interaction flash**: a subtle highlight sweeps across a row, looping every ~8s

### 3. Reduced motion
`@media (prefers-reduced-motion: reduce)` disables the float and sweep; leaves only a 1ms fade on the screen content rows.

---

## Two Usage Contexts

### `size="card"` — case study card thumbnail
- Outer container: fixed height ~220px, `border-radius: var(--radius-card)` (1.25rem)
- Background: `#18181A` with a faint radial bloom using `rgba(245,74,56,0.06)` at center (subtle accent warmth)
- Device scaled to ~70% of container height, centered
- No text labels (compact format)

### `size="hero"` — case study page header
- Outer container: full viewport width, 480–560px tall on desktop
- Device larger, occupies ~65% of width at most
- Device type + orientation label below in Open Sans `--text-data` / `--color-muted`
- Same bloom background, deeper radial spread

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/index.css` | Add `@import` for Open Sans (Google Fonts), define DS color/spacing/motion CSS custom properties |
| `src/components/DeviceMockup.tsx` | New — device frame rendering + float animation |
| `src/components/ScreenContent.tsx` | New — animated placeholder UI inside screen |
| `src/App.tsx` | Demo comp: hero variant (MacBook, full width) + 4-device card row |

---

## Comp Preview (demo `App.tsx`)

The demo renders a complete, approval-ready visual:
1. **Top section** — MacBook Pro in `hero` size, centered on dark ground
2. **Device gallery row** — all 4 device types at `card` size, evenly spaced
3. Open Sans data-weight labels beneath each card: "iPhone 15 Pro", "iPad", "MacBook Pro", "Desktop"
4. A small toggle (pill button in DS accent red) to switch between `hero` and `card` views interactively

---

## Verification

- Hot reload shows both contexts immediately in the preview panel
- All 4 device types render at correct proportions in both `card` and `hero` sizes
- Screen content animation loops smoothly (CSS-only)
- `prefers-reduced-motion` disables float + sweep (test in DevTools → Rendering)
- Open Sans loads via Google Fonts `@import` (confirmed public face)
- No TypeScript errors
