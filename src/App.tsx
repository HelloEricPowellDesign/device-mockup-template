import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DeviceMockup, {
  DEVICE_LABELS,
  EXPORT_SIZES,
  type DeviceType,
  type DeviceSpec,
  type ScreenImages,
  type MockupMode,
} from './components/DeviceMockup';
import { exportStage, slugify } from './lib/exportRecording';
import { publishToPortfolio } from './lib/publishToPortfolio';

type HeroOption = {
  label: string;
  spec: DeviceSpec;
  title?: string;
  description?: string;
};

const heroOptions: HeroOption[] = [
  {
    label: 'iPhone',
    spec: 'iphone',
    title: 'Transit Companion',
    description: 'A real-time transit app designed for commuters navigating complex urban networks.',
  },
  {
    label: 'iPad',
    spec: 'ipad',
    title: 'NSRL Form',
    description: 'Operator intake tool for Nike Sport Research Lab.',
  },
  {
    label: 'MacBook',
    spec: 'macbook',
    title: 'Analytics Platform',
    description: 'A data exploration dashboard for performance marketers.',
  },
  {
    label: 'Desktop',
    spec: 'desktop',
    title: 'Design System',
    description: 'A token-based design system built for scale.',
  },
  {
    label: 'Desktop + iPhone',
    spec: ['desktop', 'iphone'],
    title: 'Omnichannel Returns',
    description: 'Returns experience spanning desktop checkout and mobile confirmation.',
  },
  {
    label: 'MacBook + iPhone',
    spec: ['macbook', 'iphone'],
    title: 'Loyalty Platform',
    description: 'Cross-device loyalty program redesign.',
  },
  {
    label: 'iPad + iPhone',
    spec: ['ipad', 'iphone'],
    title: 'Field Operations',
    description: 'Companion tools for field teams.',
  },
];

function devicesInSpec(spec: DeviceSpec): DeviceType[] {
  return typeof spec === 'string' ? [spec] : [...spec];
}

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

function PillButton({ active, onClick, children, disabled }: { active?: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-data)',
        fontSize: 'var(--text-data)',
        padding: '7px 14px',
        borderRadius: 'var(--radius-button)',
        border: '1px solid',
        borderColor: active ? 'var(--color-accent)' : 'var(--color-rule)',
        backgroundColor: active ? 'rgba(245,74,56,0.1)' : 'transparent',
        color: disabled ? 'var(--color-rule)' : active ? 'var(--color-accent)' : 'var(--color-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--duration-fast) ease-out',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ height: '1px', backgroundColor: 'var(--color-rule)', margin: '0 var(--space-page-x)' }} />;
}

function UploadSlot({
  label,
  fileName,
  onImage,
  onClear,
}: {
  label: string;
  fileName?: string | null;
  onImage: (url: string, name: string) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    onImage(URL.createObjectURL(file), file.name);
  }, [onImage]);

  const title = `${label} screenshot`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)' }}>{title}</span>
      <div
        role="button"
        tabIndex={0}
        aria-label={fileName ? `${title}: ${fileName}` : `Upload ${title}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handle(f); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-button)',
          border: `1px dashed ${dragging ? 'var(--color-accent)' : 'var(--color-rule)'}`,
          backgroundColor: dragging ? 'rgba(245,74,56,0.06)' : 'transparent',
          cursor: 'pointer',
          transition: 'all var(--duration-fast) ease-out',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }} aria-hidden>
          <path d="M7 1v8M4 4l3-3 3 3M1 10v1.5A1.5 1.5 0 002.5 13h9A1.5 1.5 0 0013 11.5V10" stroke="var(--color-muted)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
          {fileName || 'Drop or choose'}
        </span>
        {fileName && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: 'var(--text-data)', padding: '2px 6px', marginLeft: 'auto' }}
            aria-label={`Clear ${title}`}
          >
            ✕
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ''; }} />
      </div>
    </div>
  );
}

type ImageMeta = { url: string; name: string };

type ExportProgress = {
  label: string;
  /** 0–1 overall across all stages in this run */
  ratio: number;
  tone: 'working' | 'done' | 'error';
};

function ExportProgressBar({ progress }: { progress: ExportProgress }) {
  const pct = Math.max(0, Math.min(100, Math.round(progress.ratio * 100)));
  const fill =
    progress.tone === 'error'
      ? 'var(--color-accent)'
      : progress.tone === 'done'
        ? '#3d9a5f'
        : 'var(--color-accent)';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={progress.tone === 'working'}
      style={{
        marginBottom: 'var(--space-6)',
        padding: '14px 16px',
        borderRadius: 12,
        border: '1px solid var(--color-rule)',
        background: 'color-mix(in srgb, var(--color-accent) 8%, var(--color-paper))',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 'var(--space-4)',
        marginBottom: 10,
      }}>
        <p style={{
          margin: 0,
          fontFamily: 'var(--font-data)',
          fontSize: 'var(--text-data)',
          fontWeight: 600,
          color: progress.tone === 'error' ? 'var(--color-accent)' : 'var(--color-ink)',
          letterSpacing: '0.02em',
        }}>
          {progress.label}
        </p>
        <p style={{
          margin: 0,
          fontFamily: 'var(--font-data)',
          fontSize: 'var(--text-data)',
          fontWeight: 700,
          color: fill,
          fontVariantNumeric: 'tabular-nums',
          flexShrink: 0,
        }}>
          {pct}%
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={progress.label}
        style={{
          height: 10,
          borderRadius: 999,
          background: 'var(--color-rule)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 999,
            background: fill,
            transition: progress.tone === 'working'
              ? 'width 160ms linear'
              : 'width var(--duration-fast) ease-out',
            boxShadow: progress.tone === 'working'
              ? '0 0 12px color-mix(in srgb, var(--color-accent) 55%, transparent)'
              : undefined,
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [heroIdx, setHeroIdx] = useState(1);
  const [images, setImages] = useState<Partial<Record<DeviceType, ImageMeta>>>({});
  const [slugInput, setSlugInput] = useState('nsrl-form');
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportKind, setExportKind] = useState<'hero' | 'card' | null>(null);
  const [stageMode, setStageMode] = useState<Exclude<MockupMode, 'auto'>>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', stageMode);
  }, [stageMode]);

  const exportHostRef = useRef<HTMLDivElement>(null);
  const active = heroOptions[heroIdx];
  const activeDevices = useMemo(() => devicesInSpec(active.spec), [active.spec]);

  const screenImages: ScreenImages = useMemo(() => {
    const out: ScreenImages = {};
    for (const d of activeDevices) {
      if (images[d]?.url) out[d] = images[d]!.url;
    }
    return out;
  }, [images, activeDevices]);

  const slug = slugify(slugInput || active.title || 'mockup');

  useEffect(() => {
    return () => {
      Object.values(images).forEach((m) => { if (m?.url) URL.revokeObjectURL(m.url); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke only on unmount
  }, []);

  const setDeviceImage = useCallback((device: DeviceType, url: string, name: string) => {
    setImages((prev) => {
      const old = prev[device]?.url;
      if (old) URL.revokeObjectURL(old);
      return { ...prev, [device]: { url, name } };
    });
  }, []);

  const clearDeviceImage = useCallback((device: DeviceType) => {
    setImages((prev) => {
      const old = prev[device]?.url;
      if (old) URL.revokeObjectURL(old);
      const next = { ...prev };
      delete next[device];
      return next;
    });
  }, []);

  const runExport = useCallback(async (kinds: Array<'hero' | 'card'>) => {
    if (!exportHostRef.current || exporting) return;
    setExporting(true);
    setExportProgress({ label: 'Preparing export…', ratio: 0, tone: 'working' });
    const stageWeight = 0.9 / kinds.length;
    try {
      const collected: Array<{ filename: string; blob: Blob }> = [];
      for (let i = 0; i < kinds.length; i++) {
        const kind = kinds[i]!;
        const base = i * stageWeight;
        setExportKind(kind);
        setExportProgress({
          label: `Preparing ${kind}…`,
          ratio: base,
          tone: 'working',
        });
        // Wait a frame so React paints the export stage at the right size
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const el = exportHostRef.current.querySelector<HTMLElement>('[data-export-root]');
        if (!el) throw new Error('Export stage missing');
        const result = await exportStage({
          el,
          kind,
          slug,
          onProgress: (label, ratio) => {
            setExportProgress({
              label: `${kind}: ${label}`,
              ratio: base + ratio * stageWeight,
              tone: 'working',
            });
          },
        });
        collected.push(...result.files);
      }

      setExportProgress({ label: 'Saving to portfolio…', ratio: 0.92, tone: 'working' });
      const published = await publishToPortfolio({
        slug,
        devices: activeDevices,
        kinds,
        files: collected,
      });
      const fileList = published.wrote.join(', ');
      setExportProgress({
        label: published.workUpdated
          ? `Saved to portfolio · ${fileList}`
          : `Saved files · ${published.message || 'add motion frontmatter manually'} · ${fileList}`,
        ratio: 1,
        tone: 'done',
      });
    } catch (err) {
      setExportProgress({
        label: err instanceof Error ? err.message : 'Export failed',
        ratio: 1,
        tone: 'error',
      });
    } finally {
      setExportKind(null);
      setExporting(false);
      setTimeout(() => setExportProgress(null), 8000);
    }
  }, [activeDevices, exporting, slug]);

  const exportSize = exportKind ? EXPORT_SIZES[exportKind] : EXPORT_SIZES.hero;

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-paper)', color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}>
      <header style={{ padding: 'var(--space-6) var(--space-page-x)', borderBottom: '1px solid var(--color-rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-accent)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)', letterSpacing: '0.04em' }}>
            Device Mockup Studio
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)' }}>
          Local asset tool · Eric Powell
        </span>
      </header>

      <section style={{ padding: 'var(--space-8) var(--space-page-x) var(--space-6)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <SectionLabel n="01" pre="Compose" title="Device + screenshots" />

          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
            {heroOptions.map((opt, i) => (
              <PillButton key={opt.label} active={heroIdx === i} onClick={() => setHeroIdx(i)}>
                {opt.label}
              </PillButton>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {activeDevices.map((device) => (
              <UploadSlot
                key={device}
                label={DEVICE_LABELS[device]}
                fileName={images[device]?.name}
                onImage={(url, name) => setDeviceImage(device, url, name)}
                onClear={() => clearDeviceImage(device)}
              />
            ))}
            {activeDevices.length > 1 && (
              <p style={{
                flexBasis: '100%',
                margin: 0,
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-data)',
                color: 'var(--color-muted)',
              }}>
                Pair layouts use one screenshot per device. Leave a slot empty for the placeholder UI.
              </p>
            )}

            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)' }}>Export slug</span>
              <input
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                placeholder="nsrl-form"
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-data)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--color-rule)',
                  background: 'transparent',
                  color: 'var(--color-ink)',
                  outline: 'none',
                }}
              />
            </label>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginLeft: 'auto', alignItems: 'center' }}>
              <button
                type="button"
                className="mode-toggle"
                aria-pressed={stageMode === 'dark'}
                aria-label={stageMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={() => setStageMode((m) => (m === 'dark' ? 'light' : 'dark'))}
              >
                <span className="mode-toggle__icon" aria-hidden="true" />
              </button>
              <PillButton disabled={exporting} onClick={() => runExport(['hero'])}>Export hero</PillButton>
              <PillButton disabled={exporting} onClick={() => runExport(['card'])}>Export card</PillButton>
              <PillButton disabled={exporting} active onClick={() => runExport(['hero', 'card'])}>Export both</PillButton>
            </div>
          </div>

          {exportProgress && <ExportProgressBar progress={exportProgress} />}

          <div style={{
            overflow: 'hidden',
            border: stageMode === 'light' ? '1px solid #d4d4d8' : '1px solid var(--color-rule)',
            borderRadius: 0,
            backgroundColor: stageMode === 'light' ? '#ffffff' : '#1f1f22',
          }}>
            <DeviceMockup
              devices={active.spec}
              size="hero"
              title={active.title}
              description={active.description}
              screenImages={screenImages}
              mode={stageMode}
            />
          </div>
        </div>
      </section>

      <Divider />

      <section style={{ padding: 'var(--space-12) var(--space-page-x) var(--space-16)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <SectionLabel n="02" pre="Preview" title="Case study card thumbnail" />
          <div style={{ maxWidth: 520 }}>
            <div style={{
              border: stageMode === 'light' ? '1px solid #d4d4d8' : '1px solid var(--color-rule)',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              backgroundColor: stageMode === 'light' ? '#ffffff' : '#1f1f22',
              // Isolate so corner AA composites against the white fill, not the dark page
              isolation: 'isolate',
            }}>
              <DeviceMockup
                devices={active.spec}
                size="card"
                animVariant={0}
                screenImages={screenImages}
                mode={stageMode}
              />
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: 'var(--space-6) var(--space-page-x)', borderTop: '1px solid var(--color-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-muted)' }}>
          Export saves a static PNG poster into ericpowell.design/public/motion/, and updates matching work frontmatter (motionHero / motionCard / motionDevices). Screenshots stay CSS-positioned with no scroll animation.
        </p>
        <p style={{ fontFamily: 'var(--font-data)', fontSize: 'var(--text-data)', color: 'var(--color-rule)' }}>
          Hero 2880×1152 · Card 1280×800 · PNG only · Local only
        </p>
      </footer>

      {/* Offscreen export stage — sized to portfolio export pixels */}
      {createPortal(
        <div
          ref={exportHostRef}
          aria-hidden
          style={{
            position: 'fixed',
            left: -10000,
            top: 0,
            pointerEvents: 'none',
            zIndex: -1,
            opacity: 1,
          }}
        >
          {exportKind && (
            <div
              data-export-root
              style={{
                width: exportSize.w,
                height: exportSize.h,
                background: stageMode === 'light' ? '#ffffff' : '#1f1f22',
                overflow: 'hidden',
              }}
            >
              <DeviceMockup
                devices={active.spec}
                size={exportKind}
                screenImages={screenImages}
                exportMode
                mode={stageMode}
                animVariant={0}
              />
            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}
