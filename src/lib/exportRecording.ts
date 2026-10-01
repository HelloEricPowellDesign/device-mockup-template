import { domToCanvas } from 'modern-screenshot';
import { EXPORT_SIZES, type DisplaySize } from '../components/DeviceMockup';

export type ExportKind = DisplaySize;

export const LOOP_MS = {
  scroll: 72_000,
  float: 7_000,
} as const;

const FPS = 30;

function pickMimeType(): { mimeType: string; ext: 'webm' | 'mp4' } {
  const candidates: Array<{ mimeType: string; ext: 'webm' | 'mp4' }> = [
    { mimeType: 'video/webm;codecs=vp9', ext: 'webm' },
    { mimeType: 'video/webm;codecs=vp8', ext: 'webm' },
    { mimeType: 'video/webm', ext: 'webm' },
    { mimeType: 'video/mp4', ext: 'mp4' },
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(c.mimeType)) {
      return c;
    }
  }
  return { mimeType: 'video/webm', ext: 'webm' };
}

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

async function recordViaCanvas(
  el: HTMLElement,
  durationMs: number,
  onProgress?: (ratio: number) => void,
): Promise<{ video: Blob; ext: 'webm' | 'mp4' }> {
  const { w, h } = el.offsetWidth && el.offsetHeight
    ? { w: el.offsetWidth, h: el.offsetHeight }
    : { w: 1280, h: 800 };

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unsupported');

  const { mimeType, ext } = pickMimeType();
  const stream = canvas.captureStream(FPS);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8_000_000,
  });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };

  const done = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType.split(';')[0] }));
    recorder.onerror = () => reject(new Error('MediaRecorder failed'));
  });

  recorder.start(100);
  const frameInterval = 1000 / FPS;
  const start = performance.now();

  while (performance.now() - start < durationMs) {
    const frame = await domToCanvas(el, {
      width: w,
      height: h,
      scale: 1,
      backgroundColor: '#1f1f22',
    });
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(frame, 0, 0, w, h);
    onProgress?.(Math.min(1, (performance.now() - start) / durationMs));
    const elapsed = performance.now() - start;
    const target = Math.floor(elapsed / frameInterval) * frameInterval + frameInterval;
    const wait = Math.max(0, start + target - performance.now());
    if (wait) await new Promise((r) => setTimeout(r, wait));
  }

  recorder.stop();
  stream.getTracks().forEach((t) => t.stop());
  const video = await done;
  return { video, ext };
}

export type ExportResult = {
  kind: ExportKind;
  durationMs: number;
  files: Array<{ filename: string; blob: Blob }>;
};

export async function exportStage(options: {
  el: HTMLElement;
  kind: ExportKind;
  slug: string;
  hasScrollImage: boolean;
  /** When true (default), also trigger browser downloads as a backup. */
  download?: boolean;
  onProgress?: (label: string, ratio: number) => void;
}): Promise<ExportResult> {
  const { el, kind, slug, hasScrollImage, download = false, onProgress } = options;
  const durationMs = hasScrollImage ? LOOP_MS.scroll : LOOP_MS.float;
  const size = EXPORT_SIZES[kind];
  const files: Array<{ filename: string; blob: Blob }> = [];

  // Ensure layout matches export pixels for capture
  el.style.width = `${size.w}px`;
  el.style.height = `${size.h}px`;

  onProgress?.('Capturing poster…', 0);
  const poster = await capturePoster(el);
  const posterName = `${slug}-${kind}.png`;
  files.push({ filename: posterName, blob: poster });
  if (download) downloadBlob(poster, posterName);

  onProgress?.('Recording loop…', 0.05);
  const { video, ext } = await recordViaCanvas(el, durationMs, (r) => {
    onProgress?.('Recording loop…', 0.05 + r * 0.7);
  });
  const videoName = `${slug}-${kind}.${ext}`;
  files.push({ filename: videoName, blob: video });
  if (download) downloadBlob(video, videoName);

  // Skip in-browser MP4. ffmpeg.wasm hangs on long/high-res WebMs and pinned
  // progress at ~36% ("Encoding MP4…"). PNG + WebM are enough for the portfolio;
  // MP4 can be transcoded offline later if needed.
  onProgress?.('Done', 1);
  return { kind, durationMs, files };
}
