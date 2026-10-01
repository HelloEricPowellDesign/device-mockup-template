# Hero Device Mockup Template — Plan

## Context

Eric Powell's portfolio site uses "Motion" placeholders in two places:
1. **Case study card thumbnails** on the index — a compact animated device mockup
2. **Case study page heroes** — a large, cinematic version at the top of each case study

The goal is a reusable `DeviceMockup` component that renders an animated device frame (iPhone, iPad, MacBook Pro, or desktop monitor) with a placeholder screen animation simulating UI interaction — similar to the videinfra.com hero treatment (device floating in space, screen content animating as if being used).

---

## Aesthetic Decisions

**Stance:** Product-studio dark. Deep near-black ground (#0D0D0F), device frames rendered in graphite with subtle specular highlights. The device "floats" against a radial gradient bloom (cool blue-tinted at center, fading to near-black). This reads as intentional, not generic.

**Fonts:**
- Display/label: **Instrument Sans** (Google Fonts) — geometric, technical, confident; not overused
- Mono captions: **JetBrains Mono** for device type labels and size annotations

**Color tokens (defined in `src/index.css` as CSS custom properties):**
```
--bg: #0D0D0F
--device-frame: #1C1C1E
--device-highlight: #3A3A3C
--screen-bg: #111114
--bloom: rgba(80, 120, 220, 0.12)
--accent: #5B8EF0
```

---

## Component Architecture

### `DeviceMockup` component (`src/components/DeviceMockup.tsx`)

**Props:**
```ts
type DeviceType = 'iphone' | 'ipad' | 'macbook' | 'desktop';
type DisplaySize = 'card' | 'hero';

interface DeviceMockupProps {
  device: DeviceType;      // which device to render
  size: DisplaySize;       // 'card' (compact) or 'hero' (full-width)
  className?: string;
}
```

**Structure per device:**
- **iPhone**: 393×852 aspect ratio, Dynamic Island cutout, thin side rails, bottom bar
- **iPad**: 820×1180 aspect ratio (portrait) or flipped landscape, slim bezels, home indicator
- **MacBook**: Laptop silhouette — screen + hinge + keyboard base (palmrest), notch at top of screen
- **Desktop**: Monitor with thin bezel, adjustable stand base

All devices built purely with **CSS/Tailwind** — no SVG libraries, no external mockup assets. Clean div-based geometry with border-radius and box-shadow for realism.

---

## Animation System

### Device-level motion (the "floating" effect)
A looping CSS `@keyframes` animation applies a subtle 3D perspective transform to the whole device:
- Gentle Y-axis rotation (±8°)
- Slight elevation bob (translateY ±6px)
- Easing: `cubic-bezier(0.45, 0, 0.55, 1)`, 6s loop

### Screen content animation (the "in use" simulation)
Inside the screen, staggered CSS animations simulate UI activity:
- A top navigation bar (static)
- 2–3 content "rows" that fade in sequentially (like data loading)
- A simulated cursor/highlight that moves across elements
- A soft glow pulse on the accent element
- Total loop: ~8s, then repeats

### Reduced-motion: respects `prefers-reduced-motion` — falls back to a static device with subtle opacity pulse only.

---

## Two Usage Contexts

### 1. Card thumbnail (`size="card"`)
- Fixed height: ~240px container
- Device centered, scaled down to fit
- Background: subtle radial bloom, no text labels
- Used inside the portfolio case study card grid

### 2. Case study hero (`size="hero"`)
- Full-width container, ~520–600px tall on desktop
- Device larger, optionally angled more dramatically
- Device type label shown as mono caption (e.g., "iPad · Landscape")
- Background: deeper bloom, more pronounced depth

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/index.css` | Add Google Font `@import` (Instrument Sans + JetBrains Mono), CSS custom properties |
| `src/components/DeviceMockup.tsx` | New — the core component |
| `src/components/ScreenContent.tsx` | New — animated placeholder screen content |
| `src/App.tsx` | Update to show a demo/comp: hero variant + card variant for all 4 device types |

---

## Comp Preview Structure (for approval)

`App.tsx` will render a demo page showing:
1. **Hero section** — MacBook Pro, full hero size, centered on dark ground
2. **Device switcher row** — all 4 devices at card size, side by side
3. Short Instrument Sans label under each card identifying the device type

This gives a complete visual comp of both usage contexts before any integration into the actual portfolio site.

---

## Verification

- Preview renders in the Figma Make panel immediately (hot reload)
- Device animation loops smoothly at 60fps (CSS-only, no JS animation loop)
- All 4 device types render correctly at both `card` and `hero` sizes
- `prefers-reduced-motion` disables the floating animation (test via DevTools)
- No TypeScript errors
