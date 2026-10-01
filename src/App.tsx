import { useState } from 'react';
import DeviceMockup, { DeviceType, DeviceSpec } from './components/DeviceMockup';

type HeroOption = {
  label: string;
  spec: DeviceSpec;
};

const heroOptions: HeroOption[] = [
  { label: 'iPhone',               spec: 'iphone' },
  { label: 'iPad',                 spec: 'ipad' },
  { label: 'MacBook',              spec: 'macbook' },
  { label: 'Desktop',              spec: 'desktop' },
  { label: 'Desktop + iPhone',     spec: ['desktop', 'iphone'] },
  { label: 'MacBook + iPhone',     spec: ['macbook', 'iphone'] },
  { label: 'iPad + iPhone',        spec: ['ipad', 'iphone'] },
];

const cardExamples: { label: string; sub: string; spec: DeviceSpec }[] = [
  { label: 'NSRL Form',     sub: 'iPad · Operator tool',         spec: 'ipad' },
  { label: 'Mobile App',   sub: 'iPhone 15 Pro · iOS',          spec: 'iphone' },
  { label: 'Dashboard',    sub: 'MacBook Pro · Web',             spec: 'macbook' },
  { label: 'Ecosystem',    sub: 'Desktop + iPhone',              spec: ['desktop', 'iphone'] },
];

function SectionLabel({ n, pre, title }: { n: string; pre: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', fontWeight: 700, color: '#fff', letterSpacing: '-0.04em' }}>{n}</span>
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{pre}</p>
        <h2 style={{ fontSize: 'var(--text-title)', fontWeight: 600, lineHeight: 1.25 }}>{title}</h2>
      </div>
    </div>
  );
}

function PillButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-data)',
        fontSize: 'var(--text-data)',
        padding: '7px 14px',
        borderRadius: 'var(--radius-button)',
        border: '1px solid',
        borderColor: active ? 'var(--color-accent)' : 'var(--color-rule)',
        backgroundColor: active ? 'rgba(245,74,56,0.1)' : 'transparent',
        color: active ? 'var(--color-accent)' : 'var(--color-muted)',
        cursor: 'pointer',
        transition: 'all var(--duration-fast) ease-out',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ height: '1px', backgroundColor: 'var(--color-rule)', margin: '0 var(--space-page-x)' }} />;
}

export default function App() {
  const [heroIdx, setHeroIdx] = useState(4); // default: Desktop + iPhone

  const active = heroOptions[heroIdx];

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-paper)', color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}>

      {/* ── Header ── */}
      <header style={{ padding: 'var(--space-6) var(--space-page-x)', borderBottom: '1px solid var(--color-rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-accent)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)', letterSpacing: '0.04em' }}>
            Device Mockup Template
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)' }}>
          Eric Powell · Portfolio
        </span>
      </header>

      {/* ── Section 01: Hero ── */}
      <section style={{ padding: 'var(--space-16) var(--space-page-x) var(--space-12)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <SectionLabel n="01" pre="Usage context" title="Case study hero" />

          {/* Switcher — single + multi combos */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            {heroOptions.map((opt, i) => (
              <PillButton key={i} active={heroIdx === i} onClick={() => setHeroIdx(i)}>
                {opt.label}
              </PillButton>
            ))}
          </div>

          {/* Hero mockup — overflow visible so 3D rotation never clips */}
          <div style={{ overflow: 'visible' }}>
            <DeviceMockup devices={active.spec} size="hero" />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Section 02: Card thumbnails ── */}
      <section style={{ padding: 'var(--space-12) var(--space-page-x) var(--space-16)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <SectionLabel n="02" pre="Usage context" title="Case study card thumbnail" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {cardExamples.map(({ label, sub, spec }) => (
              <div
                key={label}
                style={{
                  border: '1px solid var(--color-rule)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  backgroundColor: '#111113',
                }}
              >
                {/* Card mockup — overflow hidden here to clip to card shape */}
                <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-card) var(--radius-card) 0 0' }}>
                  <DeviceMockup devices={spec} size="card" />
                </div>

                <div style={{ padding: 'var(--space-4) var(--space-4) var(--space-6)' }}>
                  <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)', letterSpacing: '0.04em', marginBottom: 'var(--space-2)' }}>
                    {sub}
                  </p>
                  <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-ink)' }}>
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: 'var(--space-6) var(--space-page-x)', borderTop: '1px solid var(--color-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)' }}>
          Select a device config above · Screen-record to export as WebM + MP4
        </p>
        <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-rule)' }}>
          Path A: video · Path B: vanilla CSS port · Path C: Astro island
        </p>
      </footer>
    </div>
  );
}
