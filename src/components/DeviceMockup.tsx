import ScreenContent from './ScreenContent';

export type DeviceType = 'iphone' | 'ipad' | 'macbook' | 'desktop';
export type DisplaySize = 'card' | 'hero';

export interface DeviceMockupProps {
  device: DeviceType;
  size: DisplaySize;
  className?: string;
}

/* ── Shared style helpers ── */

const deviceShadow = (hero: boolean) =>
  `0 0 0 1px rgba(255,255,255,0.06),
   0 2px 6px rgba(0,0,0,0.95),
   0 ${hero ? 24 : 14}px ${hero ? 64 : 36}px rgba(0,0,0,0.75),
   0 ${hero ? 60 : 32}px ${hero ? 140 : 72}px rgba(0,0,0,0.55),
   0 ${hero ? 120 : 56}px ${hero ? 240 : 110}px rgba(0,0,0,0.35)`;

/* Aluminum body gradient — catches light from upper-left */
const aluminumGrad = `linear-gradient(
  145deg,
  #2e2e30 0%,
  #242426 18%,
  #1c1c1e 38%,
  #181818 55%,
  #1e1e20 72%,
  #242426 88%,
  #2a2a2c 100%
)`;

/* Specular edge highlight — 1px bright top-left rim */
const specularBorder = `1px solid rgba(255,255,255,0.13)`;
const darkBorder = `1px solid rgba(0,0,0,0.6)`;

const screenBezelShadow = `
  inset 0 1px 4px rgba(0,0,0,0.9),
  inset 0 0 1px rgba(0,0,0,1)
`;

/* Screen glow — light leaking from display onto surrounding bezel */
const screenGlow = (color = 'rgba(120,160,255,0.12)') =>
  `0 0 32px 4px ${color}`;

/* ── iPhone ── */
function IPhone({ size }: { size: DisplaySize }) {
  const hero = size === 'hero';
  const w = hero ? 220 : 120;
  const h = Math.round(w * (844 / 390));
  const r = hero ? 40 : 22;
  const bw = hero ? 11 : 6;
  const diW = hero ? 82 : 44;
  const diH = hero ? 23 : 12;

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Drop shadow bloom beneath device */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        height: '30px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.55)',
        filter: 'blur(20px)',
        zIndex: -1,
      }} />

      <div style={{
        width: w,
        height: h,
        borderRadius: r,
        background: aluminumGrad,
        border: specularBorder,
        boxShadow: deviceShadow(hero),
        position: 'relative',
        overflow: 'visible',
      }}>
        {/* Side buttons — left volume up */}
        <div style={{ position: 'absolute', left: -3, top: hero ? 88 : 48, width: 3, height: hero ? 32 : 18, borderRadius: '2px 0 0 2px', background: 'linear-gradient(180deg, #2a2a2c, #1a1a1c)', boxShadow: '-1px 0 2px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRight: 'none' }} />
        {/* Volume down */}
        <div style={{ position: 'absolute', left: -3, top: hero ? 136 : 74, width: 3, height: hero ? 52 : 28, borderRadius: '2px 0 0 2px', background: 'linear-gradient(180deg, #2a2a2c, #1a1a1c)', boxShadow: '-1px 0 2px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRight: 'none' }} />
        <div style={{ position: 'absolute', left: -3, top: hero ? 200 : 108, width: 3, height: hero ? 52 : 28, borderRadius: '2px 0 0 2px', background: 'linear-gradient(180deg, #2a2a2c, #1a1a1c)', boxShadow: '-1px 0 2px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRight: 'none' }} />
        {/* Power button — right */}
        <div style={{ position: 'absolute', right: -3, top: hero ? 140 : 76, width: 3, height: hero ? 68 : 38, borderRadius: '0 2px 2px 0', background: 'linear-gradient(180deg, #2a2a2c, #1a1a1c)', boxShadow: '1px 0 2px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: 'none' }} />

        {/* Screen recess */}
        <div style={{
          position: 'absolute',
          inset: bw,
          borderRadius: r - bw,
          background: '#0a0a0c',
          boxShadow: screenBezelShadow,
          overflow: 'hidden',
        }}>
          {/* Screen glow layer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            boxShadow: screenGlow(),
            zIndex: 5,
            pointerEvents: 'none',
          }} />
          {/* Dynamic Island */}
          <div style={{
            position: 'absolute',
            top: hero ? 11 : 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: diW,
            height: diH,
            borderRadius: 999,
            background: '#000',
            zIndex: 10,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04)',
          }} />
          <ScreenContent variant="mobile" size={size} />
        </div>

        {/* Home indicator */}
        <div style={{
          position: 'absolute',
          bottom: hero ? 11 : 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: hero ? 80 : 44,
          height: hero ? 4 : 3,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.25)',
        }} />

        {/* Top specular sheen */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: r,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

/* ── iPad ── */
function IPad({ size }: { size: DisplaySize }) {
  const hero = size === 'hero';
  const w = hero ? 480 : 260;
  const h = Math.round(w * (1180 / 820));
  const r = hero ? 22 : 12;
  const bw = hero ? 16 : 9;

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        position: 'absolute',
        bottom: '-12%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '24px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.5)',
        filter: 'blur(18px)',
        zIndex: -1,
      }} />

      <div style={{
        width: w,
        height: h,
        borderRadius: r,
        background: aluminumGrad,
        border: specularBorder,
        boxShadow: deviceShadow(hero),
        position: 'relative',
      }}>
        {/* Camera pill */}
        <div style={{
          position: 'absolute',
          top: hero ? 7 : 4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: hero ? 10 : 6,
          height: hero ? 10 : 6,
          borderRadius: '50%',
          background: '#0a0a0c',
          boxShadow: 'inset 0 0 2px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
        }} />

        {/* Screen */}
        <div style={{
          position: 'absolute',
          inset: bw,
          borderRadius: r - bw,
          background: '#0a0a0c',
          boxShadow: screenBezelShadow,
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, boxShadow: screenGlow(), zIndex: 5, pointerEvents: 'none', borderRadius: 'inherit' }} />
          <ScreenContent variant="mobile" size={size} />
        </div>

        {/* Home indicator */}
        <div style={{
          position: 'absolute',
          bottom: hero ? 10 : 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: hero ? 100 : 54,
          height: hero ? 4 : 3,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.2)',
        }} />

        {/* Specular sheen */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: r, background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 35%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

/* ── MacBook Pro ── */
function MacBook({ size }: { size: DisplaySize }) {
  const hero = size === 'hero';
  const screenW = hero ? 580 : 310;
  const screenH = Math.round(screenW * (10 / 16));
  const bodyW = Math.round(screenW * 1.08);
  const bodyH = Math.round(bodyW * 0.052);
  const r = hero ? 12 : 7;
  const bw = hero ? 13 : 7;
  const notchW = hero ? 82 : 44;
  const notchH = hero ? 18 : 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      {/* Lid */}
      <div style={{
        width: screenW,
        height: screenH,
        borderRadius: `${r}px ${r}px 0 0`,
        background: aluminumGrad,
        border: specularBorder,
        borderBottom: darkBorder,
        boxShadow: `${deviceShadow(hero)}, inset 0 -1px 0 rgba(0,0,0,0.4)`,
        position: 'relative',
        overflow: 'visible',
      }}>
        {/* Apple logo placeholder */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: hero ? 24 : 13,
          height: hero ? 24 : 13,
          borderRadius: '30% 30% 30% 30% / 35% 35% 25% 25%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        {/* Notch */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: notchW,
          height: notchH,
          background: '#0a0a0c',
          borderRadius: `0 0 ${hero ? 9 : 5}px ${hero ? 9 : 5}px`,
          zIndex: 10,
          boxShadow: '0 1px 0 rgba(255,255,255,0.03)',
        }} />

        {/* Screen recess */}
        <div style={{
          position: 'absolute',
          inset: bw,
          borderRadius: r - bw,
          background: '#0a0a0c',
          boxShadow: screenBezelShadow,
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, boxShadow: screenGlow('rgba(100,140,255,0.1)'), zIndex: 5, pointerEvents: 'none', borderRadius: 'inherit' }} />
          <ScreenContent variant="desktop" size={size} />
        </div>

        {/* Lid specular */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: `${r}px ${r}px 0 0`, background: 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, transparent 30%)', pointerEvents: 'none' }} />
      </div>

      {/* Hinge shadow strip */}
      <div style={{
        width: screenW,
        height: hero ? 4 : 2,
        background: 'linear-gradient(180deg, #000 0%, #0a0a0a 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.9)',
        flexShrink: 0,
      }} />

      {/* Keyboard body */}
      <div style={{
        width: bodyW,
        height: bodyH,
        background: `linear-gradient(180deg, #1e1e20 0%, #1a1a1c 40%, #161618 100%)`,
        borderRadius: `0 0 ${hero ? 8 : 5}px ${hero ? 8 : 5}px`,
        border: specularBorder,
        borderTop: '1px solid rgba(0,0,0,0.5)',
        position: 'relative',
        boxShadow: `0 8px 40px rgba(0,0,0,0.7), 0 24px 80px rgba(0,0,0,0.4)`,
        flexShrink: 0,
      }}>
        {/* Keyboard key rows */}
        <div style={{ position: 'absolute', top: hero ? 8 : 5, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: hero ? 3 : 2 }}>
          {Array.from({ length: hero ? 13 : 9 }).map((_, i) => (
            <div key={i} style={{
              width: hero ? 10 : 6,
              height: hero ? 7 : 4,
              borderRadius: hero ? 2 : 1,
              background: 'linear-gradient(180deg, #2a2a2c 0%, #222224 100%)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.8)',
            }} />
          ))}
        </div>
        {/* Second key row */}
        {hero && (
          <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 3 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: 10, height: 7, borderRadius: 2, background: 'linear-gradient(180deg, #2a2a2c 0%, #222224 100%)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.8)' }} />
            ))}
          </div>
        )}
        {/* Trackpad */}
        <div style={{
          position: 'absolute',
          bottom: hero ? 6 : 4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: hero ? 100 : 54,
          height: hero ? 58 : 32,
          borderRadius: hero ? 7 : 4,
          background: 'linear-gradient(160deg, #1e1e20 0%, #161618 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)',
        }} />
      </div>

      {/* Floor shadow */}
      <div style={{
        marginTop: hero ? 6 : 3,
        width: bodyW * 0.7,
        height: hero ? 16 : 8,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.4)',
        filter: 'blur(12px)',
      }} />
    </div>
  );
}

/* ── Desktop Monitor ── */
function Desktop({ size }: { size: DisplaySize }) {
  const hero = size === 'hero';
  const screenW = hero ? 520 : 280;
  const screenH = Math.round(screenW * (9 / 16));
  const r = hero ? 10 : 6;
  const bw = hero ? 11 : 6;
  const neckW = hero ? 36 : 20;
  const neckH = hero ? 44 : 24;
  const baseW = hero ? 200 : 110;
  const baseH = hero ? 14 : 8;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      {/* Monitor */}
      <div style={{
        width: screenW,
        height: screenH,
        borderRadius: r,
        background: aluminumGrad,
        border: specularBorder,
        boxShadow: deviceShadow(hero),
        position: 'relative',
      }}>
        {/* Camera dot */}
        <div style={{
          position: 'absolute',
          top: hero ? 6 : 3,
          left: '50%',
          transform: 'translateX(-50%)',
          width: hero ? 7 : 4,
          height: hero ? 7 : 4,
          borderRadius: '50%',
          background: '#0a0a0c',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
        }} />

        {/* Screen */}
        <div style={{
          position: 'absolute',
          inset: bw,
          borderRadius: r - bw,
          background: '#0a0a0c',
          boxShadow: screenBezelShadow,
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, boxShadow: screenGlow('rgba(100,140,255,0.1)'), zIndex: 5, pointerEvents: 'none', borderRadius: 'inherit' }} />
          <ScreenContent variant="desktop" size={size} />
        </div>

        {/* Specular sheen */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: r, background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 30%)', pointerEvents: 'none' }} />
      </div>

      {/* Neck */}
      <div style={{
        width: neckW,
        height: neckH,
        background: 'linear-gradient(180deg, #1e1e20 0%, #161618 100%)',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        borderRight: '1px solid rgba(0,0,0,0.6)',
        flexShrink: 0,
      }} />

      {/* Base */}
      <div style={{
        width: baseW,
        height: baseH,
        borderRadius: baseH,
        background: 'linear-gradient(180deg, #222224 0%, #181818 100%)',
        border: specularBorder,
        boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)',
        flexShrink: 0,
      }} />

      {/* Floor shadow */}
      <div style={{
        marginTop: hero ? 6 : 3,
        width: baseW * 0.8,
        height: hero ? 14 : 7,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.4)',
        filter: 'blur(10px)',
      }} />
    </div>
  );
}

/* ── Device labels ── */
const deviceLabels: Record<DeviceType, string> = {
  iphone: 'iPhone 15 Pro · Portrait',
  ipad: 'iPad · Portrait',
  macbook: 'MacBook Pro · 16"',
  desktop: 'Desktop Monitor',
};

/* ── Wrapper ── */
export default function DeviceMockup({ device, size, className = '' }: DeviceMockupProps) {
  const hero = size === 'hero';

  const DeviceComponent = {
    iphone: IPhone,
    ipad: IPad,
    macbook: MacBook,
    desktop: Desktop,
  }[device];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: hero ? 'clamp(480px, 62vh, 620px)' : '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: hero ? 0 : 'var(--radius-card)',
        overflow: 'hidden',
        background: hero
          ? `radial-gradient(ellipse 60% 55% at 50% 45%,
              rgba(245,74,56,0.1) 0%,
              rgba(80,100,200,0.06) 40%,
              #18181a 70%)`
          : `radial-gradient(ellipse 85% 85% at 50% 48%,
              rgba(245,74,56,0.07) 0%,
              #18181a 70%)`,
      }}
    >
      {/* Edge vignette */}
      {hero && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(24,24,26,0.85) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }} />
      )}

      {/* Floating device */}
      <div style={{
        animation: `${hero ? 'device-float' : 'device-float-subtle'} 7s cubic-bezier(0.45, 0, 0.55, 1) infinite`,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        zIndex: 5,
      }}>
        <DeviceComponent size={size} />
      </div>

      {/* Label */}
      {hero && (
        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          fontFamily: 'var(--font-data)',
          fontSize: 'var(--text-data)',
          color: 'var(--color-muted)',
          letterSpacing: '0.06em',
          zIndex: 20,
          textTransform: 'uppercase',
        }}>
          {deviceLabels[device]}
        </div>
      )}
    </div>
  );
}
