import ScreenContent from './ScreenContent';

export type DeviceType = 'iphone' | 'ipad' | 'macbook' | 'desktop';
export type DisplaySize = 'card' | 'hero';
export type DeviceSpec = DeviceType | [DeviceType, DeviceType];

export interface DeviceMockupProps {
  devices: DeviceSpec;
  size: DisplaySize;
  title?: string;       // shown top-left in hero layout
  description?: string; // shown below title in hero layout
  className?: string;
}

/* ─────────────────────────────────────────────
   Natural dimensions for each device at 1×.
   All devices render at these pixel sizes;
   scaling is handled by the wrapper via transform.
   ───────────────────────────────────────────── */
const NATURAL: Record<DeviceType, { w: number; h: number }> = {
  iphone:  { w: 172, h: 373 },  // 390:844
  ipad:    { w: 258, h: 371 },  // 820:1180 portrait
  macbook: { w: 432, h: 308 },  // screen 400×250 + hinge + body + shadow
  desktop: { w: 382, h: 276 },  // screen 380×214 + neck + base + shadow
};

/* Target apparent height (px) per role × size */
const TARGET_H: Record<DisplaySize, Record<'single' | 'primary' | 'secondary', number>> = {
  hero:  { single: 370, primary: 330, secondary: 250 },
  card:  { single: 160, primary: 145, secondary: 110 },
};

function getScale(device: DeviceType, size: DisplaySize, role: 'single' | 'primary' | 'secondary') {
  return TARGET_H[size][role] / NATURAL[device].h;
}

/* ── Shared visuals ── */
const aluminum = `linear-gradient(145deg, #2e2e30 0%, #242426 18%, #1c1c1e 38%, #181818 55%, #1e1e20 72%, #242426 88%, #2a2a2c 100%)`;
const specular  = `1px solid rgba(255,255,255,0.13)`;
const screenRecess = `inset 0 1px 4px rgba(0,0,0,0.9), inset 0 0 1px #000`;
const glow = (c = 'rgba(100,140,255,0.12)') => `0 0 28px 3px ${c}`;

function shadow(hero: boolean) {
  const d = hero;
  return [
    `0 0 0 1px rgba(255,255,255,0.06)`,
    `0 2px 6px rgba(0,0,0,0.95)`,
    `0 ${d ? 20 : 10}px ${d ? 56 : 28}px rgba(0,0,0,0.75)`,
    `0 ${d ? 52 : 26}px ${d ? 120 : 60}px rgba(0,0,0,0.55)`,
    `0 ${d ? 100 : 50}px ${d ? 200 : 100}px rgba(0,0,0,0.3)`,
  ].join(', ');
}

/* ── Floor shadow beneath device ── */
function FloorShadow({ w }: { w: number }) {
  return (
    <div style={{
      width: w * 0.65, height: 10, borderRadius: '50%',
      background: 'rgba(0,0,0,0.45)', filter: 'blur(10px)',
      margin: '0 auto',
    }} />
  );
}

/* ── Sheen overlay (specular highlight across face) ── */
function Sheen({ radius }: { radius: number | string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none',
      background: 'linear-gradient(150deg, rgba(255,255,255,0.07) 0%, transparent 35%)',
    }} />
  );
}

/* ═══════════════════════════════════════
   Device components — always at NATURAL px
   ═══════════════════════════════════════ */

function IPhone({ size }: { size: DisplaySize }) {
  const W = NATURAL.iphone.w;   // 172
  const H = NATURAL.iphone.h;   // 373
  const R = 32, BW = 9;
  const diW = 66, diH = 18;

  const btn = (top: number, h: number, side: 'left' | 'right') => (
    <div style={{
      position: 'absolute', [side]: -3, top,
      width: 3, height: h,
      borderRadius: side === 'left' ? '2px 0 0 2px' : '0 2px 2px 0',
      background: 'linear-gradient(180deg,#2a2a2c,#1a1a1c)',
      boxShadow: `${side === 'left' ? '-' : ''}1px 0 2px rgba(0,0,0,0.8)`,
      border: '1px solid rgba(255,255,255,0.06)',
      [side === 'left' ? 'borderRight' : 'borderLeft']: 'none',
    }} />
  );

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{ width: W, height: H, borderRadius: R, background: aluminum, border: specular, boxShadow: shadow(false), position: 'relative' }}>
        {btn(72,  26, 'left')}
        {btn(108, 42, 'left')}
        {btn(160, 42, 'left')}
        {btn(110, 54, 'right')}

        {/* Screen recess */}
        <div style={{ position: 'absolute', inset: BW, borderRadius: R - BW, background: '#0a0a0c', boxShadow: screenRecess, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: glow('rgba(120,160,255,0.1)'), zIndex: 5, pointerEvents: 'none' }} />
          {/* Dynamic Island */}
          <div style={{ position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)', width: diW, height: diH, borderRadius: 999, background: '#000', zIndex: 10, boxShadow: '0 0 0 1px rgba(255,255,255,0.04)' }} />
          <ScreenContent variant="mobile" size={size} />
        </div>

        {/* Home indicator */}
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 64, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.22)' }} />
        <Sheen radius={R} />
      </div>
      <FloorShadow w={W} />
    </div>
  );
}

function IPad({ size }: { size: DisplaySize }) {
  const W = NATURAL.ipad.w;   // 258
  const H = NATURAL.ipad.h;   // 371
  const R = 18, BW = 12;

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{ width: W, height: H, borderRadius: R, background: aluminum, border: specular, boxShadow: shadow(false), position: 'relative' }}>
        {/* Camera */}
        <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 7, height: 7, borderRadius: '50%', background: '#0a0a0c', boxShadow: '0 0 0 1px rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'absolute', inset: BW, borderRadius: R - BW, background: '#0a0a0c', boxShadow: screenRecess, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: glow(), zIndex: 5, pointerEvents: 'none' }} />
          <ScreenContent variant="mobile" size={size} />
        </div>

        {/* Home indicator */}
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 80, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.18)' }} />
        <Sheen radius={R} />
      </div>
      <FloorShadow w={W} />
    </div>
  );
}

function MacBook({ size }: { size: DisplaySize }) {
  const screenW = 400, screenH = 250;
  const bodyW = 432, bodyH = 20;
  const R = 10, BW = 11;
  const notchW = 64, notchH = 13;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      {/* Lid */}
      <div style={{ width: screenW, height: screenH, borderRadius: `${R}px ${R}px 0 0`, background: aluminum, border: specular, borderBottom: '1px solid rgba(0,0,0,0.6)', boxShadow: shadow(false), position: 'relative' }}>
        {/* Apple logo hint */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 20, height: 20, borderRadius: '30% 30% 30% 30%/35% 35% 25% 25%', background: 'rgba(255,255,255,0.03)' }} />

        {/* Notch */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: notchW, height: notchH, background: '#0a0a0c', borderRadius: `0 0 7px 7px`, zIndex: 10 }} />

        <div style={{ position: 'absolute', inset: BW, borderRadius: R - BW, background: '#0a0a0c', boxShadow: screenRecess, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: glow('rgba(100,140,255,0.1)'), zIndex: 5, pointerEvents: 'none' }} />
          <ScreenContent variant="desktop" size={size} />
        </div>
        <Sheen radius={`${R}px ${R}px 0 0`} />
      </div>

      {/* Hinge */}
      <div style={{ width: screenW, height: 3, background: 'linear-gradient(180deg,#000,#0a0a0a)', boxShadow: '0 2px 6px rgba(0,0,0,0.9)', flexShrink: 0 }} />

      {/* Keyboard body */}
      <div style={{ width: bodyW, height: bodyH, background: 'linear-gradient(180deg,#1e1e20 0%,#161618 100%)', borderRadius: `0 0 6px 6px`, border: specular, borderTop: '1px solid rgba(0,0,0,0.5)', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.7)', flexShrink: 0 }}>
        {/* Key rows */}
        <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{ width: 9, height: 6, borderRadius: 1.5, background: 'linear-gradient(180deg,#2a2a2c,#222224)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04),0 1px 2px rgba(0,0,0,0.8)' }} />
          ))}
        </div>
        {/* Trackpad */}
        <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 80, height: 46, borderRadius: 5, background: 'linear-gradient(160deg,#1e1e20,#161618)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)' }} />
      </div>

      <FloorShadow w={bodyW} />
    </div>
  );
}

function DesktopMonitor({ size }: { size: DisplaySize }) {
  const screenW = 380, screenH = 214;
  const R = 8, BW = 9;
  const neckW = 28, neckH = 34;
  const baseW = 160, baseH = 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ width: screenW, height: screenH, borderRadius: R, background: aluminum, border: specular, boxShadow: shadow(false), position: 'relative' }}>
        <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#0a0a0c', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'absolute', inset: BW, borderRadius: R - BW, background: '#0a0a0c', boxShadow: screenRecess, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: glow('rgba(100,140,255,0.1)'), zIndex: 5, pointerEvents: 'none' }} />
          <ScreenContent variant="desktop" size={size} />
        </div>
        <Sheen radius={R} />
      </div>

      {/* Neck */}
      <div style={{ width: neckW, height: neckH, background: 'linear-gradient(180deg,#1e1e20,#161618)', borderLeft: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(0,0,0,0.5)', flexShrink: 0 }} />

      {/* Base */}
      <div style={{ width: baseW, height: baseH, borderRadius: baseH, background: 'linear-gradient(180deg,#222224,#181818)', border: specular, boxShadow: '0 3px 14px rgba(0,0,0,0.6)', flexShrink: 0 }} />

      <FloorShadow w={baseW} />
    </div>
  );
}

/* ── Device map ── */
const DEVICE_MAP: Record<DeviceType, React.ComponentType<{ size: DisplaySize }>> = {
  iphone:  IPhone,
  ipad:    IPad,
  macbook: MacBook,
  desktop: DesktopMonitor,
};

const DEVICE_LABELS: Record<DeviceType, string> = {
  iphone:  'iPhone 15 Pro',
  ipad:    'iPad',
  macbook: 'MacBook Pro 16"',
  desktop: 'Desktop Monitor',
};

/* ── Scaled device wrapper ── */
interface ScaledDeviceProps {
  device: DeviceType;
  size: DisplaySize;
  role: 'single' | 'primary' | 'secondary';
  animClass: string;
  animDelay?: string;
  zIndex?: number;
  nudgeX?: number; // px offset for multi-device composition
}

function ScaledDevice({ device, size, role, animClass, animDelay = '0s', zIndex = 1, nudgeX = 0 }: ScaledDeviceProps) {
  const scale = getScale(device, size, role);
  const Comp = DEVICE_MAP[device];
  const nat = NATURAL[device];

  return (
    <div style={{
      position: 'absolute',
      // Anchor to the bottom-center of the natural (unscaled) bounding box.
      // translateX nudge shifts the visual center; scale is applied after.
      bottom: 0,
      left: '50%',
      transform: `translateX(calc(-50% + ${nudgeX}px)) scale(${scale})`,
      transformOrigin: 'center bottom',
      width: nat.w,
      zIndex,
    }}>
      <div style={{
        animation: `${animClass} 7s cubic-bezier(0.45,0,0.55,1) ${animDelay} infinite`,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}>
        <Comp size={size} />
      </div>
    </div>
  );
}

/* ════════════════════════
   DeviceMockup — public API
   ════════════════════════ */
export default function DeviceMockup({ devices, size, title, description, className = '' }: DeviceMockupProps) {
  const hero = size === 'hero';
  const hasText = hero && (title || description);

  const isSingle = typeof devices === 'string';
  const primaryType   = isSingle ? (devices as DeviceType) : devices[0];
  const secondaryType = isSingle ? null : devices[1];

  const primaryScale     = getScale(primaryType, size, isSingle ? 'single' : 'primary');
  const primaryApparentW = NATURAL[primaryType].w * primaryScale;

  // In single-column mode, nudge pairs left/right from center.
  // In two-column mode, devices are centered within the right column (nudge = 0 base).
  const primaryNudge   = isSingle ? 0 : -Math.round(primaryApparentW * 0.18);
  const secondaryNudge = isSingle ? 0 :  Math.round(primaryApparentW * 0.32);

  const containerH = hero ? 'clamp(440px, 58vh, 580px)' : '220px';

  const bloom = `radial-gradient(ellipse ${hasText ? '90% 80%' : '62% 58%'} at ${hasText ? '70%' : '50%'} 50%,
    rgba(245,74,56,0.09) 0%,
    rgba(80,100,200,0.05) 45%,
    #18181a 72%)`;

  const deviceLabel = isSingle
    ? DEVICE_LABELS[primaryType]
    : `${DEVICE_LABELS[primaryType]} · ${DEVICE_LABELS[secondaryType!]}`;

  /* ── Device scene (shared between single-col and two-col) ── */
  const DeviceScene = ({ column }: { column: boolean }) => (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ScaledDevice
        device={primaryType}
        size={size}
        role={isSingle ? 'single' : 'primary'}
        animClass="device-float"
        nudgeX={column ? primaryNudge : primaryNudge}
        zIndex={2}
      />
      {secondaryType && (
        <ScaledDevice
          device={secondaryType}
          size={size}
          role="secondary"
          animClass="device-float-subtle"
          animDelay="-3s"
          nudgeX={column ? secondaryNudge : secondaryNudge}
          zIndex={3}
        />
      )}
    </div>
  );

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: containerH,
        overflow: 'visible', // never clip 3D rotation
      }}
    >
      {/* Background bloom — always full-width, clipped to shape */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: hero ? 0 : 'var(--radius-card)',
        overflow: 'hidden',
        background: bloom,
        zIndex: 0,
      }}>
        {hero && (
          <div style={{
            position: 'absolute', inset: 0,
            background: hasText
              ? 'radial-gradient(ellipse 60% 100% at 100% 50%, transparent 30%, rgba(24,24,26,0.92) 80%)'
              : 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 42%, rgba(24,24,26,0.88) 100%)',
          }} />
        )}
      </div>

      {hasText ? (
        /* ── Two-column: text left · device right ── */
        <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 1 }}>

          {/* Left: text */}
          <div style={{
            width: '40%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(1.5rem, 3vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
            gap: '1rem',
            zIndex: 5,
          }}>
            {/* Accent rule */}
            <div style={{ width: 32, height: 2, borderRadius: 1, backgroundColor: 'var(--color-accent)', flexShrink: 0 }} />

            {title && (
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)',
                fontWeight: 600,
                lineHeight: 1.15,
                color: 'var(--color-ink)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                {title}
              </h2>
            )}

            {description && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 1.65,
                color: 'var(--color-muted)',
                margin: 0,
                maxWidth: '30ch',
              }}>
                {description}
              </p>
            )}

          </div>

          {/* Right: device */}
          <div style={{ flex: 1, position: 'relative' }}>
            <DeviceScene column />
          </div>
        </div>
      ) : (
        /* ── Single-column: device centered ── */
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <DeviceScene column={false} />

        </div>
      )}
    </div>
  );
}
