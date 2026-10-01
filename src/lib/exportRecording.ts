import { domToCanvas } from 'modern-screenshot';
import { EXPORT_SIZES, type DisplaySize } from '../components/DeviceMockup';

export type ExportKind = DisplaySize;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'mockup';
}

async function capturePoster(el: HTMLElement): Promise<Blob> {
  const canvas = await domToCanvas(el, {
    width: el.offsetWidth,
    height: el.offsetHeight,
    scale: 1,
    backgroundColor: '#1f1f22',
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Poster capture failed'))),
      'image/png',
    );
  });
}

export type ExportResult = {
  kind: ExportKind;
  files: Array<{ filename: string; blob: Blob }>;
};

/** Capture a static PNG poster of the export stage (no video). */
export async function exportStage(options: {
  el: HTMLElement;
  kind: ExportKind;
  slug: string;
  /** When true, also trigger a browser download as a backup. */
  download?: boolean;
  onProgress?: (label: string, ratio: number) => void;
}): Promise<ExportResult> {
  const { el, kind, slug, download = false, onProgress } = options;
  const size = EXPORT_SIZES[kind];
  const files: Array<{ filename: string; blob: Blob }> = [];

  el.style.width = `${size.w}px`;
  el.style.height = `${size.h}px`;

  onProgress?.('Capturing poster…', 0.2);
  const poster = await capturePoster(el);
  const posterName = `${slug}-${kind}.png`;
  files.push({ filename: posterName, blob: poster });
  if (download) downloadBlob(poster, posterName);

  onProgress?.('Done', 1);
  return { kind, files };
}
