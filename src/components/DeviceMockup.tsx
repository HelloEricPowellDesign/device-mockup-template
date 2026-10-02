import { memo, useCallback, useEffect, useRef, useState } from 'react';
import './device-mockup.css';
import ScreenContent, {
  ScreenThemeContext,
  type ScreenTheme,
} from './ScreenContent';

export type DeviceType = 'iphone' | 'ipad' | 'macbook' | 'desktop';
export type DisplaySize = 'card' | 'hero';
export type DeviceSpec = DeviceType | [DeviceType, DeviceType];
export type MockupMode = 'dark' | 'light' | 'auto';
export type { ScreenTheme };

export type ScreenImages = Partial<Record<DeviceType, string>>;

export interface DeviceMockupProps {
  devices: DeviceSpec;
  size: DisplaySize;
  preLabel?: string;
  title?: string;
  description?: string;
  /** @deprecated Prefer screenImages for per-device uploads */
  screenImage?: string;
  screenImages?: ScreenImages;
  animVariant?: 0 | 1 | 2 | 3; // unused — kept for call-site compatibility
  className?: string;
  /** When true, omit title/description column (export stages) */
  exportMode?: boolean;
  /** Fill parent height (portfolio stages) instead of studio preview clamps */
  fillStage?: boolean;
  /** Stage appearance. `auto` follows `html[data-mode]` / prefers-color-scheme. */
  mode?: MockupMode;
  /** Placeholder UI accent — keeps Walmart/eBay from reading as Nike Form red. */
  screenTheme?: ScreenTheme;
}

export const DEVICE_LABELS: Record<DeviceType, string> = {
  iphone:  'iPhone',
  ipad:    'iPad',
  macbook: 'MacBook Pro',
  desktop: 'Desktop',
};

export const EXPORT_SIZES = {
  hero: { w: 2880, h: 1152 },
  card: { w: 1280, h: 800 },
} as const;

/* ─────────────────────────────────────────────
   Natural dimensions for each device at 1×.
   All devices render at these pixel sizes;
   scaling is handled by the wrapper via transform.
   ───────────────────────────────────────────── */
const NATURAL: Record<DeviceType, { w: number; h: number }> = {
  iphone:  { w: 172, h: 373 },  // 390:844
  ipad:    { w: 258, h: 371 },  // 820:1180 portrait
  macbook: { w: 416, h: 340 },  // open clamshell footprint (lid + foreshortened deck)
  desktop: { w: 382, h: 286 },  // screen 380×214 + neck + 3D foot + shadow
};

/* Target apparent height (px) per role × size.
   Sized to stay inside studio + portfolio stages with pair breathing room. */
const TARGET_H: Record<DisplaySize, Record<'single' | 'primary' | 'secondary', number>> = {
  hero:  { single: 440, primary: 360, secondary: 250 },
  card:  { single: 280, primary: 220, secondary: 155 },
};

function getScale(device: DeviceType, size: DisplaySize, role: 'single' | 'primary' | 'secondary') {
  return TARGET_H[size][role] / NATURAL[device].h;
}

/* ── Shared visuals ── */
const specular  = 'var(--device-edge)';
const edgeDark  = 'var(--device-edge-dark)';
const screenRecess = `inset 0 1px 4px rgba(0,0,0,0.9), inset 0 0 1px #000`;
const glow = (c = 'rgba(0,0,0,0.18)') => `0 0 28px 3px ${c}`;

/** Drop shadow layers — offsets driven by --cast-* / --shadow-* from tilt lighting */
function shadow(hero: boolean) {
  const d = hero;
  return [
    `0 0 0 1px var(--device-rim, rgba(255,255,255,0.06))`,
    `0 2px 6px rgba(0,0,0,var(--shadow-near, 0.55))`,
    `var(--cast-x, 0px) calc(var(--cast-y, ${d ? 20 : 10}px) * 0.55) var(--cast-blur, ${d ? 56 : 28}px) rgba(0,0,0,var(--shadow-mid, 0.55))`,
    `calc(var(--cast-x, 0px) * 1.4) var(--cast-y, ${d ? 52 : 26}px) calc(var(--cast-blur, ${d ? 120 : 60}px) * 1.35) rgba(0,0,0,var(--shadow-far, 0.42))`,
    `calc(var(--cast-x, 0px) * 1.8) calc(var(--cast-y, ${d ? 100 : 50}px) * 1.15) calc(var(--cast-blur, ${d ? 200 : 100}px) * 1.6) rgba(0,0,0,var(--shadow-ambient, 0.28))`,
  ].join(', ');
}

/* ── Floor shadow beneath device ── */
function FloorShadow({ w }: { w: number }) {
  return (
    <div
      className="device-floor-shadow"
      style={{
        width: w * 0.65,
        height: 10,
        borderRadius: '50%',
        margin: '0 auto',
      }}
    />
  );
}

/* ── Sheen overlay (specular highlight — follows key light + tilt) ── */
function Sheen({ radius }: { radius: number | string }) {
  return (
    <div
      className="device-sheen"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        pointerEvents: 'none',
        zIndex: 6,
      }}
    />
  );
}

/* ═══════════════════════════════════════
   Device components — always at NATURAL px
   ═══════════════════════════════════════ */

function IPhone({ size, screenImage }: { size: DisplaySize; screenImage?: string }) {
  const W = NATURAL.iphone.w;   // 172
  const H = NATURAL.iphone.h;   // 373
  // iPhone 17/18: tighter corners, near-zero-bezel aesthetic
  const R = 36, BW = 7;
  // Dynamic Island — slimmer pill than original
  const diW = 58, diH = 14;

  const railBtn = (top: number, h: number, side: 'left' | 'right') => (
    <div style={{
      position: 'absolute', [side]: -2, top,
      width: 2, height: h,
      borderRadius: side === 'left' ? '1px 0 0 1px' : '0 1px 1px 0',
      background: 'linear-gradient(180deg, var(--metal-btn-hi) 0%, var(--metal-btn-mid) 50%, var(--metal-btn) 100%)',
      boxShadow: `${side === 'left' ? '-1px' : '1px'} 0 3px rgba(0,0,0,0.35)`,
    }} />
  );

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* White iPhone SKU — frosted glass + silver aluminum rails */}
      <div className="device-metal device-finish-white" style={{ width: W, height: H, borderRadius: R, border: specular, boxShadow: shadow(false), position: 'relative' }}>

        {/* Action button — left, top (small pill) */}
        <div style={{
          position: 'absolute', left: -3, top: 62,
          width: 3, height: 18,
          borderRadius: '2px 0 0 2px',
          background: 'linear-gradient(180deg, var(--metal-btn-hi), var(--metal-btn))',
          boxShadow: '-1px 0 3px rgba(0,0,0,0.35)',
          border: specular,
          borderRight: 'none',
        }} />

        {/* Volume up */}
        {railBtn(90, 38, 'left')}
        {/* Volume down */}
        {railBtn(138, 38, 'left')}

        {/* Power button — right */}
        {railBtn(100, 52, 'right')}

        {/* Camera Control — right side, below power btn. Horizontal capsule rail */}
        <div style={{
          position: 'absolute', right: -3, top: 166,
          width: 3, height: 72,
          borderRadius: '0 3px 3px 0',
          background: 'linear-gradient(180deg, var(--metal-hi) 0%, var(--metal-btn-mid) 40%, var(--metal-hi) 100%)',
          boxShadow: '2px 0 4px rgba(0,0,0,0.35), inset -1px 0 1px rgba(255,255,255,0.35)',
          border: specular,
          borderLeft: 'none',
        }} />
        {/* Camera Control inner groove (haptic rail texture) */}
        <div style={{
          position: 'absolute', right: -1, top: 178,
          width: 1, height: 48,
          borderRadius: 1,
          background: 'rgba(255,255,255,0.35)',
        }} />

        {/* Screen recess — ultra-thin bezel */}
        <div style={{ position: 'absolute', inset: BW, borderRadius: R - BW, background: '#050507', boxShadow: screenRecess, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: glow('rgba(0,0,0,0.16)'), zIndex: 5, pointerEvents: 'none' }} />
          {/* Dynamic Island — thinner pill */}
          <div style={{
            position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
            width: diW, height: diH, borderRadius: 999,
            background: '#000',
            zIndex: 10,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.03)',
          }} />
          <ScreenContent variant="mobile" size={size} image={screenImage} />
        </div>

        {/* Home indicator — thinner, more translucent */}
        <div style={{ position: 'absolute', bottom: 11, left: '50%', transform: 'translateX(-50%)', width: 72, height: 3, borderRadius: 999, background: 'rgba(140,140,145,0.35)' }} />
        <Sheen radius={R} />
      </div>
      <FloorShadow w={W} />
    </div>
  );
}

function IPad({ size, screenImage }: { size: DisplaySize; screenImage?: string }) {
  const W = NATURAL.ipad.w;   // 258
  const H = NATURAL.ipad.h;   // 371
  // iPad Pro M4: ultra-thin, equal bezels all sides, no home button
  const R = 20, BW = 10;

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Silver only — no white iPad Pro SKU */}
      <div className="device-metal device-finish-silver" style={{ width: W, height: H, borderRadius: R, border: specular, boxShadow: shadow(false), position: 'relative' }}>
        {/* FaceID / camera pill — centered top bezel */}
        <div style={{
          position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
          width: 28, height: 5, borderRadius: 999,
          background: '#0a0a0c',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04)',
        }} />

        {/* Top button (right edge) */}
        <div style={{
          position: 'absolute', right: -2, top: 52, width: 2, height: 28,
          borderRadius: '0 2px 2px 0',
          background: 'linear-gradient(180deg, var(--metal-btn), var(--metal-mid-lo))',
          boxShadow: '1px 0 3px rgba(0,0,0,0.3)',
        }} />
        {/* Volume buttons (left edge) */}
        <div style={{ position: 'absolute', left: -2, top: 72, width: 2, height: 26, borderRadius: '2px 0 0 2px', background: 'linear-gradient(180deg, var(--metal-btn), var(--metal-mid-lo))', boxShadow: '-1px 0 3px rgba(0,0,0,0.3)' }} />
        <div style={{ position: 'absolute', left: -2, top: 106, width: 2, height: 26, borderRadius: '2px 0 0 2px', background: 'linear-gradient(180deg, var(--metal-btn), var(--metal-mid-lo))', boxShadow: '-1px 0 3px rgba(0,0,0,0.3)' }} />

        <div style={{ position: 'absolute', inset: BW, borderRadius: R - BW, background: '#050507', boxShadow: screenRecess, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: glow(), zIndex: 5, pointerEvents: 'none' }} />
          <ScreenContent variant="mobile" size={size} image={screenImage} />
        </div>

        {/* Home indicator — iPad Pro has no home button, just slim bar */}
        <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', width: 64, height: 3, borderRadius: 999, background: 'rgba(140,140,145,0.35)' }} />
        <Sheen radius={R} />
      </div>
      <FloorShadow w={W} />
    </div>
  );
}

function MacBook({ size, screenImage }: { size: DisplaySize; screenImage?: string }) {
  const screenW = 416;
  const screenH = 260;
  // Match lid width at the hinge — a wider deck reads as a flare under perspective
  const baseW = screenW;
  const baseD = 200; // shorter deck = less “tablet behind the lid” silhouette
  const bodyT = 10;
  const R = 11;
  const BW = 11;
  const notchW = 66;
  const notchH = 13;
  const hingeY = screenH + 2;
  // Lid tips back slightly; deck foreshortens hard so it reads as a base, not a second screen
  const lidOpen = -20;
  const deckAngle = 78;

  return (
    <div style={{
      position: 'relative',
      width: baseW,
      height: 340,
      flexShrink: 0,
      transformStyle: 'preserve-3d',
    }}>
      {/* ── Keyboard deck ── */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: hingeY,
        width: baseW,
        height: baseD,
        transformOrigin: 'top center',
        transform: `rotateX(${deckAngle}deg)`,
        transformStyle: 'preserve-3d',
      }}>
        {/* Top surface */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(180deg, var(--metal-cast) 0%, transparent 14%),
            linear-gradient(168deg, var(--metal-mid-hi) 0%, var(--metal-mid) 42%, var(--metal-mid-lo) 78%, var(--metal-lo) 100%)
          `,
          borderRadius: '1px 1px 14px 14px',
          border: specular,
          borderTop: edgeDark,
          boxShadow: '0 14px 28px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}>
          {/* Lid cast near hinge — keeps deck attached to the screen */}
          <div aria-hidden style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 45%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Keyboard well */}
          <div style={{
            position: 'absolute',
            top: 14,
            left: 24,
            right: 24,
            height: 108,
            borderRadius: 6,
            background: 'linear-gradient(180deg, var(--metal-well) 0%, var(--metal-deep) 100%)',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.05)',
            overflow: 'hidden',
          }}>
            {[0, 1, 2, 3, 4].map((row) => (
              <div
                key={row}
                style={{
                  position: 'absolute',
                  left: row === 4 ? 30 : 8,
                  right: row === 4 ? 30 : 8,
                  top: 9 + row * 18,
                  height: 12,
                  borderRadius: 2.5,
                  background: 'linear-gradient(180deg, var(--metal-key-hi) 0%, var(--metal-key-lo) 100%)',
                  boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04)',
                }}
              />
            ))}
          </div>

          {/* Trackpad */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 112,
            height: 68,
            borderRadius: 8,
            background: 'linear-gradient(180deg, var(--metal-mid) 0%, var(--metal-mid-lo) 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.14), inset 0 2px 4px rgba(0,0,0,0.16)',
          }} />
        </div>

        {/* Front chin — extruded face for unibody thickness */}
        <div style={{
          position: 'absolute',
          left: 1,
          right: 1,
          bottom: 0,
          height: bodyT,
          transformOrigin: 'top center',
          transform: 'rotateX(-90deg)',
          background: 'linear-gradient(180deg, var(--metal-mid) 0%, var(--metal-lo) 50%, var(--metal-ink) 100%)',
          borderRadius: '0 0 4px 4px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
        }} />
      </div>

      {/* ── Lid ── */}
      <div style={{
        position: 'absolute',
        left: (baseW - screenW) / 2,
        top: hingeY - screenH,
        width: screenW,
        height: screenH,
        transformOrigin: 'bottom center',
        transform: `rotateX(${lidOpen}deg) translateZ(6px)`,
        transformStyle: 'preserve-3d',
        zIndex: 3,
      }}>
        <div
          className="device-metal device-finish-silver"
          style={{
            width: screenW,
            height: screenH,
            borderRadius: `${R}px ${R}px 3px 3px`,
            border: specular,
            borderBottom: edgeDark,
            boxShadow: shadow(false),
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: BW,
            borderRadius: R - BW,
            background: '#0a0a0c',
            boxShadow: screenRecess,
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: notchW,
              height: notchH,
              background: '#000',
              borderRadius: '0 0 7px 7px',
              zIndex: 10,
              boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              boxShadow: glow('rgba(0,0,0,0.16)'),
              zIndex: 5,
              pointerEvents: 'none',
            }} />
            <ScreenContent variant="desktop" size={size} image={screenImage} />
          </div>
          <Sheen radius={`${R}px ${R}px 3px 3px`} />
        </div>
      </div>

      {/* Hinge — bridges lid and deck */}
      <div style={{
        position: 'absolute',
        left: 10,
        right: 10,
        top: hingeY - 3,
        height: 7,
        borderRadius: 3.5,
        background: 'linear-gradient(180deg, var(--metal-mid) 0%, var(--metal-deep) 55%, var(--metal-mid-lo) 100%)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.22)',
        transform: 'translateZ(8px)',
        zIndex: 5,
      }} />

      <div style={{ position: 'absolute', left: '50%', bottom: 2, transform: 'translateX(-50%)', zIndex: 0 }}>
        <FloorShadow w={baseW * 0.86} />
      </div>
    </div>
  );
}

function DesktopMonitor({ size, screenImage }: { size: DisplaySize; screenImage?: string }) {
  const screenW = 380, screenH = 214;
  const R = 8, BW = 9;
  const neckW = 26, neckH = 28;
  const baseW = 156;
  const footH = 22;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexShrink: 0,
      transformStyle: 'preserve-3d',
    }}>
      {/* Silver aluminum chassis — Studio Display has no white SKU */}
      <div className="device-metal device-finish-silver" style={{ width: screenW, height: screenH, borderRadius: R, border: specular, boxShadow: shadow(false), position: 'relative' }}>
        <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#0a0a0c', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'absolute', inset: BW, borderRadius: R - BW, background: '#0a0a0c', boxShadow: screenRecess, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: glow('rgba(0,0,0,0.16)'), zIndex: 5, pointerEvents: 'none' }} />
          <ScreenContent variant="desktop" size={size} image={screenImage} />
        </div>
        <Sheen radius={R} />
      </div>

      {/* Neck — short aluminum stem into the foot */}
      <div style={{
        position: 'relative',
        width: neckW,
        height: neckH,
        flexShrink: 0,
        zIndex: 2,
        background: 'linear-gradient(90deg, var(--metal-lo) 0%, var(--metal-mid-hi) 22%, var(--metal-hi) 48%, var(--metal-mid) 72%, var(--metal-deep) 100%)',
        borderRadius: '0 0 3px 3px',
        boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.18), inset -1px 0 0 rgba(0,0,0,0.2)',
      }}>
        {/* Soft center ridge — keep matte, not chrome */}
        <div aria-hidden style={{
          position: 'absolute',
          inset: '12% 40% 18% 40%',
          borderRadius: 2,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Foot — flat elliptical plate (no rotateX foreshortening) */}
      <div style={{
        position: 'relative',
        width: baseW,
        height: footH,
        flexShrink: 0,
        marginTop: -2,
        zIndex: 1,
      }}>
        {/* Top face */}
        <div aria-hidden style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 16,
          borderRadius: '50%',
          background: `
            radial-gradient(ellipse 70% 90% at 50% 35%, var(--metal-mid-hi) 0%, transparent 55%),
            linear-gradient(180deg, var(--metal-mid) 0%, var(--metal-mid-lo) 55%, var(--metal-lo) 100%)
          `,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -2px 4px rgba(0,0,0,0.12)
          `,
        }} />
        {/* Edge thickness */}
        <div aria-hidden style={{
          position: 'absolute',
          left: '3%',
          right: '3%',
          top: 10,
          height: 8,
          borderRadius: '0 0 50% 50% / 0 0 100% 100%',
          background: 'linear-gradient(180deg, var(--metal-mid-lo) 0%, var(--metal-lo) 40%, var(--metal-ink) 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
        }} />
        {/* Desk contact */}
        <div aria-hidden style={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          top: 15,
          height: 5,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.2)',
          filter: 'blur(3px)',
          pointerEvents: 'none',
        }} />
      </div>

      <FloorShadow w={baseW * 0.88} />
    </div>
  );
}

/* ── Device map ── */
const DEVICE_MAP: Record<DeviceType, React.ComponentType<{ size: DisplaySize; screenImage?: string }>> = {
  iphone:  IPhone,
  ipad:    IPad,
  macbook: MacBook,
  desktop: DesktopMonitor,
};

/* ── Scaled device wrapper ── */
interface ScaledDeviceProps {
  device: DeviceType;
  size: DisplaySize;
  role: 'single' | 'primary' | 'secondary';
  zIndex?: number;
  nudgeX?: number;
  /** Extra Y offset in px (positive = down). Adds to the default stage lift. */
  nudgeY?: number;
  /** Local Z so secondaries clear 3D lids / bezels. */
  translateZ?: number;
  screenImage?: string;
}

function ScaledDevice({
  device,
  size,
  role,
  zIndex = 1,
  nudgeX = 0,
  nudgeY = 0,
  translateZ = 0,
  screenImage,
}: ScaledDeviceProps) {
  const scale = getScale(device, size, role);
  const Comp = DEVICE_MAP[device];
  const nat = NATURAL[device];
  // Keep devices vertically centered so lids/decks stay inside the stage frame.
  const baseLift = size === 'hero' ? 4 : 2;
  const y = baseLift + nudgeY;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate3d(calc(-50% + ${nudgeX}px), calc(-50% + ${y}px), ${translateZ}px) scale(${scale})`,
      transformOrigin: 'center center',
      transformStyle: 'preserve-3d',
      width: nat.w,
      zIndex,
    }}>
      <Comp size={size} screenImage={screenImage} />
    </div>
  );
}

function resolveImage(
  device: DeviceType,
  screenImages?: ScreenImages,
  screenImage?: string,
) {
  return screenImages?.[device] ?? screenImage;
}

const REST = {
  hero: { rotateY: -8, rotateX: 4, perspective: 900 },
  card: { rotateY: -4, rotateX: 2, perspective: 700 },
} as const;

const TILT_RANGE = {
  hero: { y: 14, x: 8 },
  card: { y: 10, x: 6 },
} as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function readDocumentMode(): 'dark' | 'light' {
  const attr = document.documentElement.getAttribute('data-mode');
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function useResolvedMockupMode(mode: MockupMode): 'dark' | 'light' {
  const [resolved, setResolved] = useState<'dark' | 'light'>(() => {
    if (mode === 'light' || mode === 'dark') return mode;
    if (typeof document === 'undefined') return 'dark';
    return readDocumentMode();
  });

  useEffect(() => {
    if (mode === 'light' || mode === 'dark') {
      setResolved(mode);
      return;
    }
    const sync = () => setResolved(readDocumentMode());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', sync);
    return () => {
      obs.disconnect();
      mq.removeEventListener('change', sync);
    };
  }, [mode]);

  return resolved;
}

const STAGE = {
  dark: {
    // Charcoal — deep, but above pure black so cast shadows still read
    base: '#1f1f22',
    bloomPeak: 'rgba(0,0,0,0.18)',
    bloomMid: 'rgba(0,0,0,0.06)',
    scrim: 'rgba(31,31,34,0.9)',
    scrimSide: 'rgba(31,31,34,0.94)',
  },
  light: {
    base: '#ffffff',
    bloomPeak: '#ffffff',
    bloomMid: '#ffffff',
    scrim: 'rgba(255,255,255,0.9)',
    scrimSide: 'rgba(255,255,255,0.94)',
  },
} as const;

/**
 * Overdamped exponential follow — no spring velocity, so no overshoot/jerk.
 * Rates are per ~16.7ms frame; tick scales by real dt.
 */
const AIM_RATE = 0.045;
const FOLLOW_RATE = 0.032;
const LIFT_RATE = 0.025;
const HOME_AIM_RATE = 0.022;
const HOME_FOLLOW_RATE = 0.016;
const HOME_LIFT_RATE = 0.02;
const REST_RETURN_DELAY_MS = 1100;
const SETTLE_EPS = 0.008;

const DeviceScene = memo(function DeviceScene({
  primaryType,
  secondaryType,
  size,
  isSingle,
  primaryNudge,
  secondaryNudge,
  secondaryNudgeY,
  secondaryZ,
  primaryImage,
  secondaryImage,
  perspective,
  tiltRef,
  interactive,
}: {
  primaryType: DeviceType;
  secondaryType: DeviceType | null;
  size: DisplaySize;
  isSingle: boolean;
  primaryNudge: number;
  secondaryNudge: number;
  secondaryNudgeY: number;
  secondaryZ: number;
  primaryImage?: string;
  secondaryImage?: string;
  perspective: number;
  tiltRef: React.RefObject<HTMLDivElement | null>;
  interactive: boolean;
}) {
  // Intentionally no `transform` in React style — rAF owns it exclusively.
  // Putting rest pose here made React snap the node back on every re-render.
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        perspective,
        perspectiveOrigin: '50% 45%',
      }}
    >
      <div
        ref={tiltRef}
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          willChange: interactive ? 'transform' : undefined,
        }}
      >
        <ScaledDevice
          device={primaryType}
          size={size}
          role={isSingle ? 'single' : 'primary'}
          nudgeX={primaryNudge}
          zIndex={2}
          screenImage={primaryImage}
        />
        {secondaryType && (
          <ScaledDevice
            device={secondaryType}
            size={size}
            role="secondary"
            nudgeX={secondaryNudge}
            nudgeY={secondaryNudgeY}
            translateZ={secondaryZ}
            zIndex={4}
            screenImage={secondaryImage}
          />
        )}
      </div>
    </div>
  );
});

export default function DeviceMockup({
  devices,
  size,
  title,
  description,
  screenImage,
  screenImages,
  className = '',
  exportMode = false,
  fillStage = false,
  mode = 'auto',
  screenTheme = 'nike',
}: DeviceMockupProps) {
  const hero = size === 'hero';
  const hasText = hero && !!(title || description);
  const reducedMotion = usePrefersReducedMotion();
  const interactive = !exportMode && !reducedMotion;
  const resolvedMode = useResolvedMockupMode(mode);
  const stage = STAGE[resolvedMode];
  const modeRef = useRef(resolvedMode);
  modeRef.current = resolvedMode;

  const rest = REST[size];
  const range = TILT_RANGE[size];
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const tilt = useRef({
    curY: REST[size].rotateY as number,
    curX: REST[size].rotateX as number,
    curZ: 0,
    aimY: REST[size].rotateY as number,
    aimX: REST[size].rotateX as number,
    aimZ: 0,
    rawY: REST[size].rotateY as number,
    rawX: REST[size].rotateX as number,
    rawZ: 0,
    raf: 0 as number,
    lastTs: 0,
    homing: false,
  });
  const homeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHomeTimer = useCallback(() => {
    if (homeTimerRef.current != null) {
      clearTimeout(homeTimerRef.current);
      homeTimerRef.current = null;
    }
  }, []);

  const isSingle = typeof devices === 'string';
  const primaryType   = isSingle ? (devices as DeviceType) : devices[0];
  const secondaryType = isSingle ? null : devices[1];
  const primaryImage = resolveImage(primaryType, screenImages, screenImage);
  const secondaryImage = secondaryType
    ? resolveImage(secondaryType, screenImages, screenImage)
    : undefined;

  const primaryScale     = getScale(primaryType, size, isSingle ? 'single' : 'primary');
  const primaryApparentW = NATURAL[primaryType].w * primaryScale;

  let primaryNudge = 0;
  let secondaryNudge = 0;
  let secondaryNudgeY = 0;
  let secondaryZ = 0;
  if (!isSingle && secondaryType) {
    const largePrimary = primaryType === 'macbook' || primaryType === 'desktop';
    const phoneSecondary = secondaryType === 'iphone';

    if (hero) {
      if (largePrimary && phoneSecondary) {
        // Laptop/monitor + phone: phone sits clear of the lid, overlapping the
        // right edge in front — keep the pair inside the media column.
        primaryNudge = -Math.round(primaryApparentW * 0.18);
        secondaryNudge = Math.round(primaryApparentW * 0.34);
        secondaryNudgeY = 28;
        secondaryZ = 80;
      } else if (primaryType === 'ipad' && phoneSecondary) {
        primaryNudge = -Math.round(primaryApparentW * 0.16);
        secondaryNudge = Math.round(primaryApparentW * 0.3);
        secondaryNudgeY = 22;
        secondaryZ = 40;
      } else {
        primaryNudge = -Math.round(primaryApparentW * 0.14);
        secondaryNudge = Math.round(primaryApparentW * 0.26);
        secondaryZ = 28;
      }
    } else {
      // Card pairs: small gap so both devices stay readable
      const secScale = getScale(secondaryType, size, 'secondary');
      const secApparentW = NATURAL[secondaryType].w * secScale;
      const gap = largePrimary && phoneSecondary ? 8 : 4;
      primaryNudge = -Math.round((secApparentW + gap) / 2);
      secondaryNudge = Math.round((primaryApparentW + gap) / 2);
      if (phoneSecondary) {
        secondaryNudgeY = largePrimary ? 12 : 8;
        secondaryZ = largePrimary ? 36 : 20;
      }
    }
  }

  const containerH = exportMode || fillStage
    ? '100%'
    : hero
      ? 'clamp(360px, 46vh, 520px)'
      : 'clamp(260px, 34vh, 360px)';

  const bloom = `radial-gradient(ellipse ${hasText ? '90% 80%' : '62% 58%'} at ${hasText ? '70%' : '50%'} 50%,
    ${stage.bloomPeak} 0%,
    ${stage.bloomMid} 42%,
    ${stage.base} 72%)`;

  const paintTilt = useCallback(() => {
    const t = tilt.current;
    const el = tiltRef.current;
    if (!el) return;

    el.style.transform =
      `rotateY(${t.curY.toFixed(3)}deg) rotateX(${t.curX.toFixed(3)}deg) translateZ(${t.curZ.toFixed(2)}px)`;

    // Key light sits upper-left; remap tilt into [-1, 1] vs rest pose
    const nx = Math.max(-1, Math.min(1, (t.curY - rest.rotateY) / Math.max(range.y, 1)));
    const ny = Math.max(-1, Math.min(1, (t.curX - rest.rotateX) / Math.max(range.x, 1)));
    const light = modeRef.current === 'light';
    const sheenBoost = light ? 0.04 : 0;

    const sheenAngle = 148 - nx * 52 + ny * 24;
    const sheenX = 30 - nx * 26;
    const sheenY = 20 + ny * 18;
    const sheenStrength = 0.028 + (1 - Math.abs(nx) * 0.4) * 0.022 + sheenBoost;
    const sheenFalloff = 30 + Math.abs(nx) * 12 + Math.abs(ny) * 6;
    const metalAngle = 145 - nx * 28 + ny * 12;
    const rimOpacity = 0.02 + Math.max(0, nx) * 0.025 + Math.max(0, -ny) * 0.015;

    const castX = 6 - nx * 18;
    const castY = (hero ? 22 : 12) + ny * 12 + t.curZ * 0.35;
    const castBlur = (hero ? 56 : 30) + Math.abs(nx) * 22 + Math.abs(ny) * 10;

    const floorOx = -nx * 16;
    const floorOy = 2 + ny * 6;
    const floorSx = 1 + Math.abs(nx) * 0.22;
    const floorOpacity = light
      ? 0.05 + Math.abs(nx) * 0.03 + Math.max(0, ny) * 0.02
      : 0.28 + Math.abs(nx) * 0.14 + Math.max(0, ny) * 0.08;
    const floorBlur = (light ? 10 : 12) + Math.abs(nx) * 5 + Math.abs(ny) * 2;

    el.style.setProperty('--sheen-angle', `${sheenAngle.toFixed(1)}deg`);
    el.style.setProperty('--sheen-x', `${sheenX.toFixed(1)}%`);
    el.style.setProperty('--sheen-y', `${sheenY.toFixed(1)}%`);
    el.style.setProperty('--sheen-strength', sheenStrength.toFixed(3));
    el.style.setProperty('--sheen-falloff', `${sheenFalloff.toFixed(1)}%`);
    el.style.setProperty('--metal-angle', `${metalAngle.toFixed(1)}deg`);
    el.style.setProperty('--rim-opacity', rimOpacity.toFixed(3));
    el.style.setProperty('--cast-x', `${castX.toFixed(1)}px`);
    el.style.setProperty('--cast-y', `${castY.toFixed(1)}px`);
    el.style.setProperty('--cast-blur', `${castBlur.toFixed(1)}px`);
    el.style.setProperty('--shadow-rim', light ? '0' : '0.06');
    el.style.setProperty('--shadow-near', light ? '0.05' : '0.55');
    el.style.setProperty('--shadow-mid', light ? '0.06' : '0.55');
    el.style.setProperty('--shadow-far', light ? '0.035' : '0.42');
    el.style.setProperty('--shadow-ambient', light ? '0.018' : '0.28');
    el.style.setProperty('--floor-ox', `${floorOx.toFixed(1)}px`);
    el.style.setProperty('--floor-oy', `${floorOy.toFixed(1)}px`);
    el.style.setProperty('--floor-sx', floorSx.toFixed(3));
    el.style.setProperty('--floor-opacity', floorOpacity.toFixed(3));
    el.style.setProperty('--floor-blur', `${floorBlur.toFixed(1)}px`);
  }, [hero, range.x, range.y, rest.rotateX, rest.rotateY]);

  const startTiltLoop = useCallback(() => {
    if (!interactive || tilt.current.raf) return;
    const tick = (ts: number) => {
      const t = tilt.current;
      const last = t.lastTs || ts;
      // Cap dt so a tab-blur hitch can't leap the pose
      const frames = Math.min(Math.max((ts - last) / 16.67, 0.5), 2.5);
      t.lastTs = ts;

      const aimRate = t.homing ? HOME_AIM_RATE : AIM_RATE;
      const followRate = t.homing ? HOME_FOLLOW_RATE : FOLLOW_RATE;
      const liftRate = t.homing ? HOME_LIFT_RATE : LIFT_RATE;
      const aimA = 1 - (1 - aimRate) ** frames;
      const followA = 1 - (1 - followRate) ** frames;
      const liftA = 1 - (1 - liftRate) ** frames;

      t.aimY += (t.rawY - t.aimY) * aimA;
      t.aimX += (t.rawX - t.aimX) * aimA;
      t.aimZ += (t.rawZ - t.aimZ) * aimA;

      t.curY += (t.aimY - t.curY) * followA;
      t.curX += (t.aimX - t.curX) * followA;
      t.curZ += (t.aimZ - t.curZ) * liftA;

      paintTilt();

      const settling =
        Math.abs(t.rawY - t.curY) > SETTLE_EPS ||
        Math.abs(t.rawX - t.curX) > SETTLE_EPS ||
        Math.abs(t.rawZ - t.curZ) > SETTLE_EPS ||
        Math.abs(t.aimY - t.curY) > SETTLE_EPS ||
        Math.abs(t.aimX - t.curX) > SETTLE_EPS;

      if (settling) {
        t.raf = requestAnimationFrame(tick);
      } else {
        // Freeze in place — never snap toward raw
        if (t.homing) t.homing = false;
        t.lastTs = 0;
        t.raf = 0;
      }
    };
    tilt.current.lastTs = 0;
    tilt.current.raf = requestAnimationFrame(tick);
  }, [interactive, paintTilt]);

  useEffect(() => {
    // Initial paint once the tilt node exists; refresh when mode flips
    const id = requestAnimationFrame(() => paintTilt());
    return () => {
      cancelAnimationFrame(id);
      clearHomeTimer();
      if (tilt.current.raf) cancelAnimationFrame(tilt.current.raf);
      tilt.current.raf = 0;
    };
  }, [paintTilt, clearHomeTimer, resolvedMode]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!interactive || !stageRef.current) return;
    clearHomeTimer();
    tilt.current.homing = false;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const t = tilt.current;
    t.rawY = rest.rotateY + nx * range.y;
    t.rawX = rest.rotateX - ny * range.x;
    t.rawZ = 8;
    startTiltLoop();
  }, [clearHomeTimer, interactive, range.x, range.y, rest.rotateX, rest.rotateY, startTiltLoop]);

  const onPointerEnter = useCallback(() => {
    if (!interactive || !stageRef.current) return;
    clearHomeTimer();
    tilt.current.homing = false;
    stageRef.current.dataset.tiltHover = 'true';
  }, [clearHomeTimer, interactive]);

  const onPointerLeave = useCallback(() => {
    if (stageRef.current) stageRef.current.dataset.tiltHover = 'false';
    tilt.current.rawZ = 0;
    startTiltLoop();
    clearHomeTimer();
    homeTimerRef.current = setTimeout(() => {
      homeTimerRef.current = null;
      const t = tilt.current;
      t.homing = true;
      t.rawY = rest.rotateY;
      t.rawX = rest.rotateX;
      t.rawZ = 0;
      startTiltLoop();
    }, REST_RETURN_DELAY_MS);
  }, [clearHomeTimer, rest.rotateX, rest.rotateY, startTiltLoop]);

  return (
    <ScreenThemeContext.Provider value={screenTheme}>
    <div
      ref={stageRef}
      className={className}
      data-tilt-hover="false"
      data-export={exportMode ? 'true' : undefined}
      data-mockup-mode={resolvedMode}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerEnter={interactive ? onPointerEnter : undefined}
      onPointerLeave={interactive ? onPointerLeave : undefined}
      style={{
        position: 'relative',
        width: '100%',
        height: containerH,
        overflow: 'hidden',
        // Solid stage fill on the root so rounded-corner AA never punches
        // through transparent layers to the dark studio chrome.
        backgroundColor: stage.base,
        cursor: interactive ? 'pointer' : undefined,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden',
        background: bloom,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        {hero && (
          <div style={{
            position: 'absolute', inset: 0,
            background: hasText
              ? `radial-gradient(ellipse 60% 100% at 100% 50%, transparent 30%, ${stage.scrimSide} 80%)`
              : `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 42%, ${stage.scrim} 100%)`,
          }} />
        )}
      </div>

      {hasText ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 1 }}>
          <div style={{
            width: '34%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(1.25rem, 2.5vw, 2.25rem) clamp(1.25rem, 2.5vw, 2rem)',
            gap: '0.6rem',
            zIndex: 5,
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginBottom: '0.5rem',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6875rem', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>EP</span>
            </div>
            {title && (
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 600, lineHeight: 1.2, color: 'var(--color-ink)', margin: 0, letterSpacing: '-0.01em' }}>
                {title}
              </h2>
            )}
            {description && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', lineHeight: 1.65, color: 'var(--color-muted)', margin: 0, maxWidth: '28ch', marginTop: '0.25rem' }}>
                {description}
              </p>
            )}
          </div>
          <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
            <DeviceScene
              primaryType={primaryType}
              secondaryType={secondaryType}
              size={size}
              isSingle={isSingle}
              primaryNudge={primaryNudge}
              secondaryNudge={secondaryNudge}
              secondaryNudgeY={secondaryNudgeY}
              secondaryZ={secondaryZ}
              primaryImage={primaryImage}
              secondaryImage={secondaryImage}
              perspective={rest.perspective}
              tiltRef={tiltRef}
              interactive={interactive}
            />
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <DeviceScene
            primaryType={primaryType}
            secondaryType={secondaryType}
            size={size}
            isSingle={isSingle}
            primaryNudge={primaryNudge}
            secondaryNudge={secondaryNudge}
            secondaryNudgeY={secondaryNudgeY}
            secondaryZ={secondaryZ}
            primaryImage={primaryImage}
            secondaryImage={secondaryImage}
            perspective={rest.perspective}
            tiltRef={tiltRef}
            interactive={interactive}
          />
        </div>
      )}
    </div>
    </ScreenThemeContext.Provider>
  );
}
