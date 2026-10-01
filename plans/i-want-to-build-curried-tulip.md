# Hero Device Mockup Template — Plan

## Context

Eric Powell's portfolio site (Astro + CSS Custom Properties + Fontsource Open Sans) uses "Motion" placeholders in two places:
1. **Case study card thumbnails** on the index — a compact animated device mockup
2. **Case study page heroes** — a large, cinematic device at the top of each case study

This Make project is React + Vite + Tailwind v4 — used as a design comp and template. The component will later be adapted into the Astro portfolio. The goal is a reusable `DeviceMockup` component supporting iPhone, iPad, MacBook Pro, and desktop — each with a looping "in use" screen animation, matching the videinfra.com floating-device hero pattern.

---

## Design System (verbatim from ericpowell-design.vercel.app/design-system/)

### Colors (dark ground — all hero/card mockups live on dark)
| Token | Value |
|-------|-------|
| `--color-paper` | `#18181A` (dark bg) |
| `--color-ink` | `#FFFFFF` |
| `--color-muted` | `#A3A3A3` |
| `--color-accent` | `#F54A38` |
| `--color-rule` | `#3A3A3C` |

### Typography
- **Open Sans exclusively** — installed via `@fontsource/open-sans` (self-hosted, matching portfolio approach)
- `--text-data: 0.8125rem` for device labels and screen chrome
- Weights: 400, 500, 600, 700

### Motion tokens
- `--duration: 480ms ease-out` (transitions)
- `--duration-fast: 200ms ease-out` (quick states)
- `prefers-reduced-motion` collapses to 1ms (matching portfolio)

### Border radius
- `--radius-card: 1.25rem` — outer card containers
- Device bezels use per-device values (iPhone ~40px, iPad ~20px, MacBook ~12px)

### Spacing
- 4px base; composite tokens for gutters and sections

---

## Animation Technology Choice

**Framer Motion** (`motion`) — chosen for React-native spring physics, GPU-accelerated transforms, and built-in `useReducedMotion` hook. No JS animation loop on the main thread; transforms are off-thread via CSS compositor.

Two animation layers:
1. **Device float** — Framer Motion `animate` with `repeatType: "mirror"` spring; gentle Y-axis rotation + vertical bob, 6s period
2. **Screen content** — Framer Motion `variants` with staggered children; rows fade/slide in sequentially, then loop. Accent pulse uses a `keyframes` array on opacity.

Both layers respect `useReducedMotion()` — disables float entirely and skips stagger on reduced-motion.

---

## Component Architecture

### `src/components/DeviceMockup.tsx`

```ts
type DeviceType = 'iphone' | 'ipad' | 'macbook' | 'desktop';
type DisplaySize = 'card' | 'hero';

interface DeviceMockupProps {
  device: DeviceType;
  size: DisplaySize;
  className?: string;
}
```

Device frames built with **div geometry + Tailwind utilities** — no SVG libraries or external mockup assets. Each device is a pure CSS construction:

| Device | Construction notes |
|--------|-------------------|
| **iPhone** | Dynamic Island pill cutout, 390:844 ratio, ~40px radius, side button strips |
| **iPad** | 820:1100 landscape ratio, 8px slim bezels, home indicator |
| **MacBook Pro** | 16:10 screen + notch + 4px hinge line + wider keyboard palmrest base + trackpad |
| **Desktop** | 16:9 monitor + short neck + wide elliptical stand |

### `src/components/ScreenContent.tsx`
Animated UI placeholder inside each screen. Content is device-appropriate:
- **iPhone/iPad**: Mobile-style card list (nav bar, 3 list rows, one highlighted in accent)
- **MacBook/Desktop**: Dashboard-style layout (sidebar + main content area, data rows)

Screen colors: `#111113` bg, `#3A3A3C` for UI chrome elements, `#F54A38` sparingly for one active/accent element.

---

## Two Usage Contexts

### `size="card"` — case study card thumbnail
- Outer container: fixed 220px height, `border-radius: 1.25rem`, overflow hidden
- Background: `#18181A` + faint radial warm bloom (`rgba(245,74,56,0.05)`)
- Device at ~65% container height, centered
- No labels

### `size="hero"` — case study page header
- Full-width container, 480–560px tall on desktop, responsive via `clamp`
- Device at ~65% container width max
- Open Sans `--text-data` label below: device type + "· Portrait" or "· Landscape"
- Richer radial bloom, subtle vignette at edges

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `package.json` | Add `@fontsource/open-sans`, `motion` (Framer Motion) |
| `src/index.css` | Import Fontsource Open Sans, define DS CSS custom property tokens, keyframes |
| `src/components/DeviceMockup.tsx` | New — device frame + Framer Motion float |
| `src/components/ScreenContent.tsx` | New — staggered animated screen placeholder |
| `src/App.tsx` | Demo comp for approval |

---

## Comp Preview (approval demo in `App.tsx`)

1. **Hero section** — MacBook Pro, `size="hero"`, full width, dark ground
2. **Device gallery** — all 4 devices at `size="card"`, evenly spaced in a row
3. **Device type labels** in Open Sans below each card
4. **Pill toggle** (accent `#F54A38`, `border-radius: 999px`) to switch demo device in the hero slot

---

## Workflow: From Template to Final Creative

### Step 1 — Approve the comp (this Make project)
The Make project serves as an interactive design comp. You review the animation in the preview panel, tweak device proportions, motion feel, screen content style, and colors until it's right.

### Step 2 — Configure per case study
Each case study needs its own device + orientation. Configuration is just a prop:
```tsx
// NSRL Form → iPad landscape
<DeviceMockup device="ipad" size="hero" />

// A mobile app case study → iPhone
<DeviceMockup device="iphone" size="card" />
```

You can also pass custom `className` to adjust background color or sizing per case study context without changing the component itself.

### Step 3 — Choose your output format

Your Astro portfolio has no React runtime. There are two clean paths to get the final creative into the site:

#### Path A — Screen-record to video (recommended for now)
Once the animation is approved in the preview panel, screen-record it (QuickTime / OBS) and export as **WebM + MP4 fallback**. Drop the video into your Astro case study page as:
```html
<video autoplay loop muted playsinline>
  <source src="/motion/nsrl-ipad.webm" type="video/webm" />
  <source src="/motion/nsrl-ipad.mp4" type="video/mp4" />
</video>
```
This is the exact same pattern used by sites like videinfra.com. Zero JS runtime cost, perfect loop, works everywhere.

#### Path B — Port to vanilla CSS + HTML (for Astro integration without video)
Because the animation is CSS-driven (Framer Motion only adds spring wrapper — the actual transforms/keyframes are standard CSS), the component can be ported to a plain HTML/CSS Astro component (`.astro` file) after approval. This keeps your zero-JS constraint and matches your existing tech stack. This would be a follow-up step after the comp is approved and finalized.

#### Path C — Astro React island (optional middle ground)
Astro supports `client:load` islands. You could bring the React component in directly with `@astrojs/react` if you want the interactive device-switcher toggle. Heavier than Path A or B, but an option if the animation complexity grows.

**Recommended starting point: Path A.** Get the animation right in the comp, record it, ship it. Port to vanilla CSS later if you want it to be live-animated rather than a video.

---

## Verification

- Preview panel shows smooth float + screen animation immediately
- All 4 device types correct proportions at both sizes
- `useReducedMotion()` disables float and stagger
- Open Sans self-hosted (no external font request)
- No TypeScript errors
- Framer Motion transforms stay on GPU compositor thread (transform/opacity only)
