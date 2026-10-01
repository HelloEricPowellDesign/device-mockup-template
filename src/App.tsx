import { useState } from 'react';
import DeviceMockup, { DeviceType } from './components/DeviceMockup';

const devices: { type: DeviceType; label: string }[] = [
  { type: 'iphone', label: 'iPhone 15 Pro' },
  { type: 'ipad', label: 'iPad' },
  { type: 'macbook', label: 'MacBook Pro' },
  { type: 'desktop', label: 'Desktop' },
];

export default function App() {
  const [heroDevice, setHeroDevice] = useState<DeviceType>('macbook');

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-paper)',
        color: 'var(--color-ink)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          padding: 'var(--space-6) var(--space-page-x)',
          borderBottom: '1px solid var(--color-rule)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              flexShrink: 0,
            }}
          />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)', letterSpacing: '0.04em' }}>
            Device Mockup Template
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)' }}>
          Eric Powell · Portfolio
        </span>
      </header>

      {/* ── Section 01: Hero size ── */}
      <section style={{ padding: 'var(--space-16) var(--space-page-x) var(--space-12)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', fontWeight: 700, color: '#fff', letterSpacing: '-0.04em' }}>01</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Usage context</p>
              <h2 style={{ fontSize: 'var(--text-title)', fontWeight: 600, lineHeight: 1.25 }}>Case study hero</h2>
            </div>
          </div>

          {/* Device switcher */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            {devices.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setHeroDevice(type)}
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-data)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid',
                  borderColor: heroDevice === type ? 'var(--color-accent)' : 'var(--color-rule)',
                  backgroundColor: heroDevice === type ? 'rgba(245,74,56,0.1)' : 'transparent',
                  color: heroDevice === type ? 'var(--color-accent)' : 'var(--color-muted)',
                  cursor: 'pointer',
                  transition: `all var(--duration-fast) ease-out`,
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Hero mockup */}
          <DeviceMockup device={heroDevice} size="hero" />
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--color-rule)', margin: '0 var(--space-page-x)' }} />

      {/* ── Section 02: Card size ── */}
      <section style={{ padding: 'var(--space-12) var(--space-page-x) var(--space-16)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', fontWeight: 700, color: '#fff', letterSpacing: '-0.04em' }}>02</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Usage context</p>
              <h2 style={{ fontSize: 'var(--text-title)', fontWeight: 600, lineHeight: 1.25 }}>Case study card thumbnail</h2>
            </div>
          </div>

          {/* Card grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {devices.map(({ type, label }) => (
              <div key={type}>
                {/* Simulated case study card */}
                <div
                  style={{
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-card)',
                    overflow: 'hidden',
                    backgroundColor: '#111113',
                  }}
                >
                  <DeviceMockup device={type} size="card" />
                  <div style={{ padding: 'var(--space-4) var(--space-4) var(--space-6)' }}>
                    <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)', letterSpacing: '0.04em', marginBottom: 'var(--space-2)' }}>
                      {label} · Case study
                    </p>
                    <div style={{ width: '70%', height: '1rem', borderRadius: 4, backgroundColor: 'var(--color-rule)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: 'var(--space-6) var(--space-page-x)',
          borderTop: '1px solid var(--color-rule)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)' }}>
          Use the device switcher above to select the device for each case study.
        </p>
        <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-rule)' }}>
          Screen-record to export · WebM + MP4
        </p>
      </footer>
    </div>
  );
}
