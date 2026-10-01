import { useRef, useState } from 'react';

type ScreenVariant = 'mobile' | 'desktop';

interface ScreenContentProps {
  variant: ScreenVariant;
  size: 'card' | 'hero';
  image?: string;
}

function ScrollingImageScreen({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scrollDist, setScrollDist] = useState(0);

  function measure() {
    if (!containerRef.current || !imgRef.current) return;
    const cH = containerRef.current.clientHeight;
    const iH = imgRef.current.clientHeight;
    setScrollDist(Math.max(0, iH - cH));
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#111113' }}
    >
      <img
        ref={imgRef}
        src={src}
        onLoad={measure}
        alt=""
        className={`screen-scroll-img${scrollDist > 0 ? ' is-scrolling' : ''}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          '--scroll-dist': `-${scrollDist}px`,
        } as React.CSSProperties}
      />
    </div>
  );
}

function MobileScreen({ size, image }: { size: 'card' | 'hero'; image?: string }) {
  const compact = size === 'card';
  // Natural frames are ~160–240px wide — keep chrome tiny so it reads as real iOS
  const statusPad = compact ? '8px 10px 2px' : '12px 14px 3px';
  const navPad = compact ? '3px 10px' : '4px 14px';
  const contentPad = compact ? '4px 10px' : '6px 14px';
  const timeSize = compact ? '5.5px' : '7px';
  const barH = compact ? 2.5 : 3.5;
  const signalW = compact ? 1.75 : 2.25;
  const batW = compact ? 8.5 : 11;
  const batH = compact ? 4 : 5;

  if (image) return <ScrollingImageScreen src={image} />;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#111113', fontFamily: 'var(--font-data, "Open Sans", sans-serif)' }}>
      {/* Status bar — top inset clears Dynamic Island / rounded screen clip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: statusPad,
        flexShrink: 0,
        minHeight: compact ? 18 : 24,
        boxSizing: 'border-box',
      }}>
        <span style={{
          fontSize: timeSize,
          color: '#a1a1a6',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          9:41
        </span>
        <div style={{ display: 'flex', gap: compact ? 2 : 2.5, alignItems: 'center' }}>
          {/* Cellular bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: compact ? 4 : 5.5 }}>
            {[0.35, 0.55, 0.75, 1].map((h, i) => (
              <div
                key={i}
                style={{
                  width: signalW,
                  height: `${h * 100}%`,
                  borderRadius: 0.4,
                  backgroundColor: '#a1a1a6',
                }}
              />
            ))}
          </div>
          {/* Battery */}
          <div style={{
            width: batW,
            height: batH,
            border: '1px solid rgba(161,161,166,0.65)',
            borderRadius: 1.25,
            position: 'relative',
            boxSizing: 'border-box',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0.75,
              right: 1.25,
              width: '70%',
              borderRadius: 0.4,
              background: '#a1a1a6',
            }} />
            <div style={{
              position: 'absolute',
              right: -2,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 1,
              height: compact ? 2 : 2.5,
              borderRadius: '0 1px 1px 0',
              background: 'rgba(161,161,166,0.65)',
            }} />
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: navPad,
        borderBottom: '1px solid #2a2a2c',
        flexShrink: 0,
      }}>
        <div style={{ width: compact ? 28 : 40, height: barH, borderRadius: 1.5, backgroundColor: '#3a3a3c' }} />
        <div style={{
          width: compact ? 8 : 11,
          height: compact ? 8 : 11,
          borderRadius: '50%',
          backgroundColor: '#f54a38',
          opacity: 0.9,
        }} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        padding: contentPad,
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 4 : 5,
      }}>
        <div style={{
          width: compact ? 22 : 32,
          height: barH,
          borderRadius: 1.5,
          backgroundColor: '#3a3a3c',
          animation: 'screen-row-in 0.5s ease-out 0.3s both',
        }} />

        {[
          { accent: false, delay: '0.5s', barW: '72%' },
          { accent: true,  delay: '0.8s', barW: '48%' },
          { accent: false, delay: '1.1s', barW: '88%' },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              backgroundColor: row.accent ? 'rgba(245,74,56,0.08)' : '#1c1c1e',
              borderRadius: compact ? 4 : 5,
              border: row.accent ? '1px solid rgba(245,74,56,0.25)' : '1px solid #2a2a2c',
              padding: compact ? '4px 5px' : '5px 7px',
              animation: `screen-row-in 0.5s ease-out ${row.delay} both`,
              display: 'flex',
              flexDirection: 'column',
              gap: compact ? 2.5 : 3,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: compact ? 34 : 50,
                height: barH,
                borderRadius: 1.5,
                backgroundColor: row.accent ? 'rgba(245,74,56,0.6)' : '#3a3a3c',
              }} />
              <div style={{
                width: compact ? 12 : 18,
                height: barH,
                borderRadius: 1.5,
                backgroundColor: row.accent ? 'rgba(245,74,56,0.4)' : '#2a2a2c',
              }} />
            </div>
            <div style={{ width: '100%', height: compact ? 1.5 : 2, borderRadius: 1.5, backgroundColor: '#2a2a2c', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                borderRadius: 1.5,
                backgroundColor: row.accent ? '#f54a38' : '#3a3a3c',
                '--bar-w': row.barW,
                animation: `bar-grow 0.8s cubic-bezier(0.4,0,0.2,1) ${row.delay} both`,
              } as React.CSSProperties} />
            </div>
          </div>
        ))}

        <div style={{ marginTop: 'auto', display: 'flex', gap: compact ? 2.5 : 3.5, animation: 'screen-row-in 0.5s ease-out 1.4s both' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: compact ? 12 : 16,
                borderRadius: compact ? 2.5 : 3.5,
                backgroundColor: i === 2 ? 'rgba(245,74,56,0.12)' : '#1c1c1e',
                border: i === 2 ? '1px solid rgba(245,74,56,0.2)' : '1px solid #2a2a2c',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopScreen({ size, image }: { size: 'card' | 'hero'; image?: string }) {
  const compact = size === 'card';

  if (image) return <ScrollingImageScreen src={image} />;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: 'var(--font-data, "Open Sans", sans-serif)' }}>
      {/* Sidebar */}
      <div style={{
        width: compact ? 28 : 48, borderRight: '1px solid #2a2a2c', display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: compact ? '8px 0' : '14px 0', gap: compact ? 6 : 10, flexShrink: 0,
      }}>
        <div style={{ width: compact ? 14 : 24, height: compact ? 14 : 24, borderRadius: '50%', backgroundColor: '#f54a38' }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            width: compact ? 12 : 20, height: compact ? 12 : 20, borderRadius: compact ? 3 : 5,
            backgroundColor: i === 1 ? '#3a3a3c' : '#2a2a2c',
            border: i === 1 ? '1px solid #4a4a4c' : 'none',
          }} />
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: compact ? 8 : 14 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: compact ? 6 : 12, flexShrink: 0 }}>
          <div style={{ width: compact ? 50 : 88, height: compact ? 5 : 8, borderRadius: 3, backgroundColor: '#3a3a3c' }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ width: compact ? 18 : 32, height: compact ? 8 : 14, borderRadius: compact ? 3 : 5, backgroundColor: i === 1 ? '#f54a38' : '#2a2a2c' }} />
            ))}
          </div>
        </div>

        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: compact ? 4 : 8, marginBottom: compact ? 6 : 12, flexShrink: 0 }}>
          {[
            { color: 'rgba(245,74,56,0.12)', border: 'rgba(245,74,56,0.2)', accent: true },
            { color: '#1c1c1e', border: '#2a2a2c', accent: false },
            { color: '#1c1c1e', border: '#2a2a2c', accent: false },
          ].map((tile, i) => (
            <div key={i} style={{
              backgroundColor: tile.color, border: `1px solid ${tile.border}`,
              borderRadius: compact ? 4 : 8, padding: compact ? '4px 6px' : '8px 10px',
              animation: `screen-row-in 0.4s ease-out ${0.3 + i * 0.15}s both`,
            }}>
              <div style={{ width: '60%', height: compact ? 3 : 5, borderRadius: 2, backgroundColor: tile.accent ? 'rgba(245,74,56,0.5)' : '#3a3a3c', marginBottom: compact ? 4 : 6 }} />
              <div style={{ width: '40%', height: compact ? 5 : 8, borderRadius: 2, backgroundColor: tile.accent ? 'rgba(245,74,56,0.8)' : '#4a4a4c' }} />
            </div>
          ))}
        </div>

        {/* Data rows */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: compact ? 3 : 5 }}>
          <div style={{ display: 'flex', gap: compact ? 6 : 10, marginBottom: compact ? 2 : 4 }}>
            {['40%', '25%', '20%', '15%'].map((w, i) => (
              <div key={i} style={{ width: w, height: compact ? 3 : 5, borderRadius: 2, backgroundColor: '#2a2a2c' }} />
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: compact ? 6 : 10,
              padding: compact ? '3px 0' : '5px 0', borderBottom: '1px solid #1e1e20',
              animation: `screen-row-in 0.35s ease-out ${0.6 + i * 0.1}s both`,
            }}>
              <div style={{ width: '40%', height: compact ? 4 : 6, borderRadius: 2, backgroundColor: i % 3 === 0 ? '#3a3a3c' : '#2a2a2c' }} />
              <div style={{ width: '25%', height: compact ? 4 : 6, borderRadius: 2, backgroundColor: '#2a2a2c' }} />
              <div style={{ width: '20%', height: compact ? 4 : 6, borderRadius: 2, backgroundColor: i === 2 ? 'rgba(245,74,56,0.5)' : '#2a2a2c' }} />
              <div style={{ width: '15%', height: compact ? 4 : 6, borderRadius: 2, backgroundColor: '#1e1e20' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScreenContent({ variant, size, image }: ScreenContentProps) {
  if (variant === 'mobile') return <MobileScreen size={size} image={image} />;
  return <DesktopScreen size={size} image={image} />;
}
