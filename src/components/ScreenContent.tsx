type ScreenVariant = 'mobile' | 'desktop';

interface ScreenContentProps {
  variant: ScreenVariant;
  size: 'card' | 'hero';
}

function MobileScreen({ size }: { size: 'card' | 'hero' }) {
  const compact = size === 'card';

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#111113', fontFamily: 'var(--font-data)' }}>
      {/* Status bar */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{ padding: compact ? '6px 10px' : '10px 16px', borderBottom: '1px solid #2a2a2c' }}
      >
        <span style={{ fontSize: compact ? '8px' : '11px', color: '#a3a3a3', fontWeight: 600 }}>9:41</span>
        <div className="flex gap-1 items-center">
          {[3, 3, 3].map((_, i) => (
            <div key={i} style={{ width: compact ? '3px' : '4px', height: compact ? '5px' : '7px', borderRadius: '1px', backgroundColor: i < 3 ? '#fff' : '#3a3a3c' }} />
          ))}
          <div style={{ width: compact ? '12px' : '16px', height: compact ? '6px' : '8px', border: '1px solid #666', borderRadius: '2px', marginLeft: '2px', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '1px', right: '2px', background: '#fff', borderRadius: '1px' }} />
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{ padding: compact ? '8px 10px' : '14px 16px', borderBottom: '1px solid #2a2a2c' }}
      >
        <div style={{ width: compact ? '40px' : '64px', height: compact ? '6px' : '9px', borderRadius: '3px', backgroundColor: '#3a3a3c' }} />
        <div style={{ width: compact ? '14px' : '20px', height: compact ? '14px' : '20px', borderRadius: '50%', backgroundColor: '#f54a38', opacity: 0.9 }} />
      </div>

      {/* Content rows */}
      <div className="flex-1 overflow-hidden" style={{ padding: compact ? '8px 10px' : '14px 16px', display: 'flex', flexDirection: 'column', gap: compact ? '6px' : '10px' }}>

        {/* Section label */}
        <div style={{ width: compact ? '30px' : '48px', height: compact ? '4px' : '6px', borderRadius: '2px', backgroundColor: '#3a3a3c', animation: 'screen-row-in 0.5s ease-out 0.3s both' }} />

        {/* Card rows */}
        {[
          { w: '100%', accent: false, delay: '0.5s', barW: '72%' },
          { w: '100%', accent: true, delay: '0.8s', barW: '48%' },
          { w: '100%', accent: false, delay: '1.1s', barW: '88%' },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              backgroundColor: row.accent ? 'rgba(245,74,56,0.08)' : '#1c1c1e',
              borderRadius: compact ? '6px' : '10px',
              border: row.accent ? '1px solid rgba(245,74,56,0.25)' : '1px solid #2a2a2c',
              padding: compact ? '6px 8px' : '10px 12px',
              animation: `screen-row-in 0.5s ease-out ${row.delay} both`,
              display: 'flex',
              flexDirection: 'column',
              gap: compact ? '4px' : '6px',
            }}
          >
            <div className="flex items-center justify-between">
              <div style={{ width: compact ? '48px' : '80px', height: compact ? '4px' : '6px', borderRadius: '2px', backgroundColor: row.accent ? 'rgba(245,74,56,0.6)' : '#3a3a3c' }} />
              <div style={{ width: compact ? '20px' : '32px', height: compact ? '4px' : '6px', borderRadius: '2px', backgroundColor: row.accent ? 'rgba(245,74,56,0.4)' : '#2a2a2c' }} />
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: compact ? '2px' : '3px', borderRadius: '2px', backgroundColor: '#2a2a2c', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: '2px',
                  backgroundColor: row.accent ? '#f54a38' : '#3a3a3c',
                  '--bar-w': row.barW,
                  animation: `bar-grow 0.8s cubic-bezier(0.4,0,0.2,1) ${row.delay} both`,
                } as React.CSSProperties}
              />
            </div>
          </div>
        ))}

        {/* Bottom summary row */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            gap: compact ? '4px' : '6px',
            animation: 'screen-row-in 0.5s ease-out 1.4s both',
          }}
        >
          {['32%', '28%', '40%'].map((w, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: compact ? '20px' : '32px',
                borderRadius: compact ? '4px' : '6px',
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

function DesktopScreen({ size }: { size: 'card' | 'hero' }) {
  const compact = size === 'card';

  return (
    <div className="w-full h-full flex" style={{ backgroundColor: '#111113', fontFamily: 'var(--font-data)' }}>
      {/* Sidebar */}
      <div
        style={{
          width: compact ? '28px' : '48px',
          borderRight: '1px solid #2a2a2c',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: compact ? '8px 0' : '14px 0',
          gap: compact ? '6px' : '10px',
          flexShrink: 0,
        }}
      >
        <div style={{ width: compact ? '14px' : '24px', height: compact ? '14px' : '24px', borderRadius: '50%', backgroundColor: '#f54a38' }} />
        {[1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            style={{
              width: compact ? '12px' : '20px',
              height: compact ? '12px' : '20px',
              borderRadius: compact ? '3px' : '5px',
              backgroundColor: i === 1 ? '#3a3a3c' : '#2a2a2c',
              border: i === 1 ? '1px solid #4a4a4c' : 'none',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ padding: compact ? '8px' : '14px' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between shrink-0" style={{ marginBottom: compact ? '6px' : '12px' }}>
          <div style={{ width: compact ? '50px' : '88px', height: compact ? '5px' : '8px', borderRadius: '3px', backgroundColor: '#3a3a3c' }} />
          <div className="flex gap-1">
            {[1, 2].map((_, i) => (
              <div key={i} style={{ width: compact ? '18px' : '32px', height: compact ? '8px' : '14px', borderRadius: compact ? '3px' : '5px', backgroundColor: i === 1 ? '#f54a38' : '#2a2a2c' }} />
            ))}
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-3 shrink-0" style={{ gap: compact ? '4px' : '8px', marginBottom: compact ? '6px' : '12px' }}>
          {[
            { color: 'rgba(245,74,56,0.12)', border: 'rgba(245,74,56,0.2)', accent: true },
            { color: '#1c1c1e', border: '#2a2a2c', accent: false },
            { color: '#1c1c1e', border: '#2a2a2c', accent: false },
          ].map((tile, i) => (
            <div
              key={i}
              style={{
                backgroundColor: tile.color,
                border: `1px solid ${tile.border}`,
                borderRadius: compact ? '4px' : '8px',
                padding: compact ? '4px 6px' : '8px 10px',
                animation: `screen-row-in 0.4s ease-out ${0.3 + i * 0.15}s both`,
              }}
            >
              <div style={{ width: '60%', height: compact ? '3px' : '5px', borderRadius: '2px', backgroundColor: tile.accent ? 'rgba(245,74,56,0.5)' : '#3a3a3c', marginBottom: compact ? '4px' : '6px' }} />
              <div style={{ width: '40%', height: compact ? '5px' : '8px', borderRadius: '2px', backgroundColor: tile.accent ? 'rgba(245,74,56,0.8)' : '#4a4a4c' }} />
            </div>
          ))}
        </div>

        {/* Data rows */}
        <div className="flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column', gap: compact ? '3px' : '5px' }}>
          {/* Table header */}
          <div className="flex" style={{ gap: compact ? '6px' : '10px', marginBottom: compact ? '2px' : '4px' }}>
            {['40%', '25%', '20%', '15%'].map((w, i) => (
              <div key={i} style={{ width: w, height: compact ? '3px' : '5px', borderRadius: '2px', backgroundColor: '#2a2a2c' }} />
            ))}
          </div>
          {/* Rows */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center"
              style={{
                gap: compact ? '6px' : '10px',
                padding: compact ? '3px 0' : '5px 0',
                borderBottom: '1px solid #1e1e20',
                animation: `screen-row-in 0.35s ease-out ${0.6 + i * 0.1}s both`,
              }}
            >
              <div style={{ width: '40%', height: compact ? '4px' : '6px', borderRadius: '2px', backgroundColor: i % 3 === 0 ? '#3a3a3c' : '#2a2a2c' }} />
              <div style={{ width: '25%', height: compact ? '4px' : '6px', borderRadius: '2px', backgroundColor: '#2a2a2c' }} />
              <div style={{ width: '20%', height: compact ? '4px' : '6px', borderRadius: '2px', backgroundColor: i === 2 ? 'rgba(245,74,56,0.5)' : '#2a2a2c' }} />
              <div style={{ width: '15%', height: compact ? '4px' : '6px', borderRadius: '2px', backgroundColor: '#1e1e20' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScreenContent({ variant, size }: ScreenContentProps) {
  if (variant === 'mobile') return <MobileScreen size={size} />;
  return <DesktopScreen size={size} />;
}
