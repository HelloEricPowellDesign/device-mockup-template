import ScreenContent from './ScreenContent';

export type DeviceType = 'iphone' | 'ipad' | 'macbook' | 'desktop';
export type DisplaySize = 'card' | 'hero';

export interface DeviceMockupProps {
  device: DeviceType;
  size: DisplaySize;
  className?: string;
}

/* ── iPhone ── */
function IPhone({ size }: { size: DisplaySize }) {
  const hero = size === 'hero';
  const w = hero ? 220 : 120;
  const h = Math.round(w * (844 / 390));
  const r = hero ? 40 : 22;
  const bw = hero ? 10 : 6; // bezel width
  const diW = hero ? 80 : 44;
  const diH = hero ? 22 : 12;

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        backgroundColor: '#1c1c1e',
        border: '2px solid #3a3a3c',
        boxShadow: '0 0 0 1px #111, inset 0 0 0 1px #2a2a2c, 0 32px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Side buttons */}
      <div style={{ position: 'absolute', left: -3, top: hero ? 80 : 44, width: 2, height: hero ? 36 : 20, borderRadius: '2px 0 0 2px', backgroundColor: '#3a3a3c' }} />
      <div style={{ position: 'absolute', left: -3, top: hero ? 128 : 70, width: 2, height: hero ? 56 : 30, borderRadius: '2px 0 0 2px', backgroundColor: '#3a3a3c' }} />
      <div style={{ position: 'absolute', left: -3, top: hero ? 196 : 108, width: 2, height: hero ? 56 : 30, borderRadius: '2px 0 0 2px', backgroundColor: '#3a3a3c' }} />
      <div style={{ position: 'absolute', right: -3, top: hero ? 128 : 70, width: 2, height: hero ? 72 : 40, borderRadius: '0 2px 2px 0', backgroundColor: '#3a3a3c' }} />

      {/* Screen area */}
      <div
        style={{
          position: 'absolute',
          inset: bw,
          borderRadius: r - bw,
          overflow: 'hidden',
          backgroundColor: '#111113',
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: hero ? 10 : 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: diW,
            height: diH,
            borderRadius: 999,
            backgroundColor: '#0a0a0c',
            zIndex: 10,
          }}
        />
        <ScreenContent variant="mobile" size={size} />
      </div>

      {/* Bottom home indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: hero ? 10 : 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: hero ? 80 : 44,
          height: hero ? 4 : 3,
          borderRadius: 999,
          backgroundColor: '#4a4a4c',
        }}
      />
    </div>
  );
}

/* ── iPad ── */
function IPad({ size }: { size: DisplaySize }) {
  const hero = size === 'hero';
  const w = hero ? 520 : 280;
  const h = Math.round(w * (1180 / 820)); // portrait
  const r = hero ? 20 : 12;
  const bw = hero ? 14 : 8;

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        backgroundColor: '#1c1c1e',
        border: '2px solid #3a3a3c',
        boxShadow: '0 0 0 1px #111, inset 0 0 0 1px #2a2a2c, 0 32px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Top camera */}
      <div
        style={{
          position: 'absolute',
          top: hero ? 6 : 4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: hero ? 8 : 5,
          height: hero ? 8 : 5,
          borderRadius: '50%',
          backgroundColor: '#2a2a2c',
        }}
      />

      {/* Screen */}
      <div
        style={{
          position: 'absolute',
          inset: bw,
          borderRadius: r - bw,
          overflow: 'hidden',
          backgroundColor: '#111113',
        }}
      >
        <ScreenContent variant="mobile" size={size} />
      </div>

      {/* Home indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: hero ? 8 : 5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: hero ? 100 : 56,
          height: hero ? 4 : 3,
          borderRadius: 999,
          backgroundColor: '#3a3a3c',
        }}
      />
    </div>
  );
}

/* ── MacBook Pro ── */
function MacBook({ size }: { size: DisplaySize }) {
  const hero = size === 'hero';
  const screenW = hero ? 600 : 320;
  const screenH = Math.round(screenW * (10 / 16));
  const bodyW = Math.round(screenW * 1.1);
  const bodyH = Math.round(bodyW * 0.055);
  const r = hero ? 12 : 7;
  const bw = hero ? 12 : 7;
  const notchW = hero ? 80 : 44;
  const notchH = hero ? 16 : 9;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      {/* Screen lid */}
      <div
        style={{
          width: screenW,
          height: screenH,
          borderRadius: `${r}px ${r}px 0 0`,
          backgroundColor: '#1c1c1e',
          border: '2px solid #3a3a3c',
          borderBottom: 'none',
          boxShadow: '0 0 0 1px #111, inset 0 0 0 1px #2a2a2c',
          position: 'relative',
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: notchW,
            height: notchH,
            backgroundColor: '#0a0a0c',
            borderRadius: `0 0 ${hero ? 8 : 5}px ${hero ? 8 : 5}px`,
            zIndex: 10,
          }}
        />
        {/* Screen */}
        <div
          style={{
            position: 'absolute',
            inset: bw,
            borderRadius: r - bw,
            overflow: 'hidden',
            backgroundColor: '#111113',
          }}
        >
          <ScreenContent variant="desktop" size={size} />
        </div>
      </div>

      {/* Hinge line */}
      <div style={{ width: screenW, height: hero ? 3 : 2, backgroundColor: '#111', flexShrink: 0 }} />

      {/* Keyboard body (palmrest) */}
      <div
        style={{
          width: bodyW,
          height: bodyH,
          backgroundColor: '#1c1c1e',
          borderRadius: `0 0 ${hero ? 8 : 5}px ${hero ? 8 : 5}px`,
          border: '2px solid #3a3a3c',
          borderTop: '1px solid #2a2a2c',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Trackpad */}
        <div
          style={{
            position: 'absolute',
            bottom: hero ? 6 : 4,
            left: '50%',
            transform: 'translateX(-50%)',
            width: hero ? 100 : 54,
            height: hero ? 60 : 32,
            borderRadius: hero ? 6 : 4,
            border: '1px solid #3a3a3c',
            backgroundColor: '#161618',
          }}
        />
        {/* Keyboard dots (minimal suggestion) */}
        <div style={{ position: 'absolute', top: hero ? 8 : 5, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: hero ? 3 : 2 }}>
          {Array.from({ length: hero ? 14 : 10 }).map((_, i) => (
            <div key={i} style={{ width: hero ? 10 : 6, height: hero ? 7 : 4, borderRadius: hero ? 2 : 1, backgroundColor: '#2a2a2c' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Desktop Monitor ── */
function Desktop({ size }: { size: DisplaySize }) {
  const hero = size === 'hero';
  const screenW = hero ? 560 : 300;
  const screenH = Math.round(screenW * (9 / 16));
  const r = hero ? 10 : 6;
  const bw = hero ? 10 : 6;
  const neckW = hero ? 40 : 22;
  const neckH = hero ? 40 : 22;
  const baseW = hero ? 180 : 96;
  const baseH = hero ? 12 : 7;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      {/* Monitor */}
      <div
        style={{
          width: screenW,
          height: screenH,
          borderRadius: r,
          backgroundColor: '#1c1c1e',
          border: '2px solid #3a3a3c',
          boxShadow: '0 0 0 1px #111, inset 0 0 0 1px #2a2a2c, 0 32px 80px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        {/* Camera dot */}
        <div
          style={{
            position: 'absolute',
            top: hero ? 5 : 3,
            left: '50%',
            transform: 'translateX(-50%)',
            width: hero ? 6 : 4,
            height: hero ? 6 : 4,
            borderRadius: '50%',
            backgroundColor: '#2a2a2c',
          }}
        />
        {/* Screen */}
        <div
          style={{
            position: 'absolute',
            inset: bw,
            borderRadius: r - bw,
            overflow: 'hidden',
            backgroundColor: '#111113',
          }}
        >
          <ScreenContent variant="desktop" size={size} />
        </div>
      </div>

      {/* Neck */}
      <div
        style={{
          width: neckW,
          height: neckH,
          backgroundColor: '#1e1e20',
          borderLeft: '1px solid #2a2a2c',
          borderRight: '1px solid #2a2a2c',
        }}
      />

      {/* Base */}
      <div
        style={{
          width: baseW,
          height: baseH,
          borderRadius: baseH,
          backgroundColor: '#1c1c1e',
          border: '1px solid #3a3a3c',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  );
}

/* ── Device wrapper with float animation ── */
const deviceLabels: Record<DeviceType, string> = {
  iphone: 'iPhone 15 Pro · Portrait',
  ipad: 'iPad · Portrait',
  macbook: 'MacBook Pro · 16"',
  desktop: 'Desktop Monitor',
};

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
        height: hero ? 'clamp(480px, 60vh, 600px)' : '220px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: hero ? 0 : 'var(--radius-card)',
        overflow: 'hidden',
        background: hero
          ? 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,74,56,0.07) 0%, #18181a 70%)'
          : 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(245,74,56,0.05) 0%, #18181a 75%)',
      }}
    >
      {/* Vignette */}
      {hero && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(24,24,26,0.8) 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

      {/* Floating device */}
      <div
        style={{
          animation: `${hero ? 'device-float' : 'device-float-subtle'} 6s cubic-bezier(0.45, 0, 0.55, 1) infinite`,
          willChange: 'transform',
          transformStyle: 'preserve-3d',
        }}
      >
        <DeviceComponent size={size} />
      </div>

      {/* Label (hero only) */}
      {hero && (
        <div
          style={{
            position: 'absolute',
            bottom: hero ? '1.5rem' : undefined,
            fontFamily: 'var(--font-data)',
            fontSize: 'var(--text-data)',
            color: 'var(--color-muted)',
            letterSpacing: '0.04em',
            zIndex: 20,
          }}
        >
          {deviceLabels[device]}
        </div>
      )}
    </div>
  );
}
