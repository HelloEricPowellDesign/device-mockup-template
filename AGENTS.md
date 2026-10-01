# Device Mockup Studio

React + Vite + Tailwind CSS local tool for composing device mockups and exporting portfolio motion assets.

## Purpose

Generate looping hero and card assets for [ericpowell.design](https://ericpowell.design) case studies. This app is a **local studio**, not a public Lab generator.

## Workflow

1. Pick a device config (single or pair).
2. Upload a screenshot per device.
3. Set an export slug (e.g. `nsrl-form`).
4. Preview hero and card.
5. **Export hero / card / both** — writes into `ericpowell.design/public/motion/`:
   - `{slug}-{hero|card}.png` (poster)
   - `{slug}-{hero|card}.webm` (or mp4 from MediaRecorder)
   - `{slug}-{hero|card}.mp4` when WebM was recorded and ffmpeg.wasm can transcode
   - Updates matching `src/content/work/{slug}.mdx` frontmatter (`motionHero`, `motionCard`, `motionDevices`) when that file exists
6. Point work frontmatter at the base path if the slug is new (e.g. `/motion/nsrl-form-hero`).

Hero exports are **device-only**. Title, description, and company mark are a live HTML layer in `StudyHero` on the portfolio (responsive overlay), not baked into the video.

## Export sizes (2× desktop stages)

- Hero: **2880 × 1152** (~2.5:1, matches 1440×576 stage)
- Card: **1280 × 800** (~1.6:1)
- Loop length: **72s** with screenshot scroll, else **7s**, at 30fps

Portfolio stages stay fluid; videos use `object-fit: cover`.

## Development

```bash
npm install
npm run dev
```

## Project structure

- `src/main.tsx` — entry
- `src/App.tsx` — studio UI (compose, preview, export)
- `src/components/DeviceMockup.tsx` — device frames + `screenImages` map
- `src/components/ScreenContent.tsx` — placeholder UI or scrolling screenshot
- `src/lib/exportRecording.ts` — poster + MediaRecorder + optional MP4 transcode
- `src/index.css` — tokens and keyframes

## Dependencies

- Runtime: React 19
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`
- Capture: `modern-screenshot`, `MediaRecorder`, optional `@ffmpeg/ffmpeg`
